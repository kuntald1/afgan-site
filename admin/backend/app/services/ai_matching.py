"""
AI-powered CV matching — Claude for structured extraction + query
expansion, Voyage AI for embeddings, pgvector for similarity search.

Every function here is best-effort and defensive: if the relevant API key
isn't configured, or the API call fails for any reason, functions return
None (or raise a clearly-labeled AIMatchingUnavailable) rather than
crashing the caller. The free keyword search and résumé upload must keep
working regardless of whether this whole subsystem is configured at all.

NOT LIVE-TESTED: unlike the rest of this backend (which was verified with
real HTTP requests against a running server), the actual Claude and Voyage
API calls in this file could not be tested end-to-end in the environment
this was built in — no real API keys were available, and the Voyage AI API
isn't reachable from that sandbox at all. The JSON-parsing and
error-handling logic has been written carefully and reviewed, but treat
your first real submission after deploying this as the actual first test.
"""

import json
import re

from anthropic import Anthropic
from app.config import settings


class AIMatchingUnavailable(Exception):
    """Raised when AI matching is called but not configured (no API key)."""


def _require_anthropic() -> Anthropic:
    if not settings.anthropic_api_key:
        raise AIMatchingUnavailable("ANTHROPIC_API_KEY is not set")
    return Anthropic(api_key=settings.anthropic_api_key)


def _require_voyage():
    if not settings.voyage_api_key:
        raise AIMatchingUnavailable("VOYAGE_API_KEY is not set")
    import voyageai

    return voyageai.Client(api_key=settings.voyage_api_key)


def _extract_json_object(text: str) -> dict:
    """
    Claude is instructed to respond with ONLY a JSON object, but models
    occasionally wrap it in prose or a markdown code fence regardless —
    this pulls out the first {...} block as a fallback rather than
    trusting the response is always perfectly clean JSON.
    """
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


def extract_cv_structure(resume_text: str) -> dict | None:
    """
    Sends résumé text to Claude and asks for structured fields back:
    skills (list of strings), years_experience (int or null), education
    (short string), and a one-paragraph summary written specifically to be
    a good embedding target for retrieval (i.e. written like a candidate
    profile description, not a copy of the résumé).

    Returns None if AI matching isn't configured or the call/parse fails —
    callers should treat that as "extraction skipped," not an error to
    surface to the applicant.
    """
    if not resume_text or not resume_text.strip():
        return None

    try:
        client = _require_anthropic()
    except AIMatchingUnavailable:
        return None

    prompt = f"""Extract structured information from this resume. Respond with ONLY a JSON object, no other text, no markdown code fence -- just the raw JSON object, in exactly this shape:

{{
  "skills": ["skill one", "skill two"],
  "years_experience": null,
  "education": null,
  "summary": "a 2-3 sentence third-person professional summary"
}}

Fill in real values: skills is a list of strings found in the resume, years_experience is your best integer estimate of total relevant professional experience (or null if you can't tell), education is a short string describing highest/most relevant education (or null), summary is a 2-3 sentence third-person profile description of this candidate for search/retrieval use -- focus on skills, experience level, and domain, not a copy of resume text.

Resume text:
---
{resume_text[:8000]}
---"""

    try:
        response = client.messages.create(
            model=settings.anthropic_model,
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}],
        )
        text_block = next(
            (b.text for b in response.content if getattr(b, "type", None) == "text"), None
        )
        if not text_block:
            return None
        data = _extract_json_object(text_block)

        skills = data.get("skills")
        if not isinstance(skills, list):
            skills = []

        years = data.get("years_experience")
        if not isinstance(years, int):
            years = None

        return {
            "skills": [str(s) for s in skills],
            "years_experience": years,
            "education": str(data.get("education") or "") or None,
            "summary": str(data.get("summary") or "") or None,
        }
    except Exception as e:
        print(f"[ai_matching] Claude extraction failed: {e}")
        return None


def expand_search_query(query: str) -> dict | None:
    """
    Turns a short recruiter query like "python with 3 years" into:
      - a structured filter (min_years_experience, skills to look for)
      - an "ideal candidate" description, written the same way
        extract_cv_structure's `summary` field is written, so the two are
        comparable in embedding space.

    Returns None if unavailable/failed -- caller should fall back to plain
    keyword search in that case, not error out.
    """
    if not query or not query.strip():
        return None

    try:
        client = _require_anthropic()
    except AIMatchingUnavailable:
        return None

    prompt = f"""A recruiter searching for candidates typed this query: "{query}"

Respond with ONLY a JSON object, no other text, no markdown code fence, in exactly this shape:

{{
  "min_years_experience": null,
  "required_skills": ["skill one", "skill two"],
  "ideal_candidate_description": "a 2-3 sentence third-person description"
}}

Fill in real values: min_years_experience is an integer minimum years implied by the query (or null if not specified), required_skills is a list of skill strings implied by the query, ideal_candidate_description is a 2-3 sentence third-person description of the ideal candidate for this query, written the same way you'd summarize an actual candidate's resume -- this will be compared against candidate summaries using semantic similarity."""

    try:
        response = client.messages.create(
            model=settings.anthropic_model,
            max_tokens=400,
            messages=[{"role": "user", "content": prompt}],
        )
        text_block = next(
            (b.text for b in response.content if getattr(b, "type", None) == "text"), None
        )
        if not text_block:
            return None
        data = _extract_json_object(text_block)

        skills = data.get("required_skills")
        if not isinstance(skills, list):
            skills = []

        min_years = data.get("min_years_experience")
        if not isinstance(min_years, int):
            min_years = None

        description = data.get("ideal_candidate_description")
        if not description:
            return None

        return {
            "min_years_experience": min_years,
            "required_skills": [str(s) for s in skills],
            "ideal_candidate_description": str(description),
        }
    except Exception as e:
        print(f"[ai_matching] Claude query expansion failed: {e}")
        return None


def embed_text(text: str) -> list[float] | None:
    """Embeds a single string via Voyage AI. Returns None if unavailable/failed."""
    if not text or not text.strip():
        return None
    try:
        client = _require_voyage()
    except AIMatchingUnavailable:
        return None

    try:
        result = client.embed(
            texts=[text],
            model=settings.voyage_model,
            input_type="document",
            output_dimension=settings.voyage_embedding_dimensions,
        )
        return result.embeddings[0]
    except Exception as e:
        print(f"[ai_matching] Voyage embedding failed: {e}")
        return None


def embed_query(text: str) -> list[float] | None:
    """Same as embed_text but with input_type='query' -- Voyage prepends a
    different internal prompt for queries vs documents to improve
    retrieval, per their docs; using the right one for each side matters
    for match quality even though both return 1024-dim vectors either way."""
    if not text or not text.strip():
        return None
    try:
        client = _require_voyage()
    except AIMatchingUnavailable:
        return None

    try:
        result = client.embed(
            texts=[text],
            model=settings.voyage_model,
            input_type="query",
            output_dimension=settings.voyage_embedding_dimensions,
        )
        return result.embeddings[0]
    except Exception as e:
        print(f"[ai_matching] Voyage query embedding failed: {e}")
        return None
