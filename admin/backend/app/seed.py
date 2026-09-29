"""
Seeds content_blocks with the ACE site's actual current copy (pulled from
src/content.ts and the components as of this build), so the admin panel
opens already showing real content instead of empty rows.

Run once after the database/tables exist:
    python -m app.seed

Safe to re-run — it only inserts rows whose key doesn't already exist, it
never overwrites a value an admin has already edited.

This covers the HOME page's hero + impact stats end-to-end (the two pieces
actually wired to the live API — see admin/README.md "What's wired end-to-
end vs documented pattern"). The rest of the keys below are seeded so the
admin UI has real content to show and edit immediately, ready for the same
wiring to be extended to their components next.

--- Home-02 (page="Home") ---
Every key below with page "Home" is wired end-to-end into the Home-02
site's actual live components (src/components/home2/*.tsx via
useDynamicContent), which is what actually renders at the site's root URL
now. These are deliberately a SEPARATE page group from the original
"home"/"about" (lowercase) keys above (which belong to the OLD site under
<Layout>, not Home-02) — editing "Home" in the admin does NOT affect the
old site, and editing the old lowercase-"home" tab does not affect
Home-02. Each section's own dynamic list items (individual project cards,
team member photos/names, testimonial quotes, blog posts) are
intentionally NOT included here — those still come from src/content.ts.

Further Home-02 sub-pages (About, Services, Projects, Gallery, Blog,
Career, Contact — i.e. /home-02/about, /home-02/services, etc.) get their
own separate page groups below, added incrementally as each page gets
wired.
"""

from app.database import SessionLocal, Base, engine
from app.models import ContentBlock

Base.metadata.create_all(bind=engine)

SEED_DATA = [
    # page, section, key, label, type, value

    # --- Home-02 (page="Home") — wired end-to-end into src/components/home2/*.tsx ---

    # Hero2.tsx
    ("Home", "hero", "home2.hero.eyebrow", "Home hero — eyebrow label", "text",
     "Business Consulting"),
    ("Home", "hero", "home2.hero.headline_line1", "Home hero — headline, line 1", "text",
     "Welcome To"),
    ("Home", "hero", "home2.hero.headline_line2", "Home hero — headline, line 2", "text",
     "Afghanistan Center for Excellence"),
    ("Home", "hero", "home2.hero.badge_label", "Home hero — partner badge text", "text",
     "UN & Government Partner"),
    ("Home", "hero", "home2.hero.badge_year", "Home hero — partner badge year tag", "text",
     "Since 2012"),
    ("Home", "hero", "home2.hero.slide_1", "Home hero — background slide 1", "image",
     "/assets/images/home2/hero-1.jpg"),
    ("Home", "hero", "home2.hero.slide_2", "Home hero — background slide 2", "image",
     "/assets/images/home2/hero-2.jpg"),
    ("Home", "hero", "home2.hero.slide_3", "Home hero — background slide 3", "image",
     "/assets/images/home2/hero-3.jpg"),
    ("Home", "hero", "home2.hero.slide_4", "Home hero — background slide 4", "image",
     "/assets/images/home2/hero-4.jpg"),

    # About2.tsx ("About Our Consulting" homepage section)
    ("Home", "about", "home2.about.eyebrow", "Home about — eyebrow label", "text",
     "About Our Consulting"),
    ("Home", "about", "home2.about.heading", "Home about — heading", "text",
     "Driving Institutional Change Through Strategy"),
    ("Home", "about", "home2.about.body", "Home about — body paragraph", "richtext",
     "ACE is a results-driven, Afghan-owned consulting company helping government, private-sector and NGO partners improve performance, strengthen institutions, and deliver measurable outcomes."),
    ("Home", "about", "home2.about.point_1", "Home about — checklist point 1", "text",
     "~50 experienced Afghan consultants"),
    ("Home", "about", "home2.about.point_2", "Home about — checklist point 2", "text",
     "Offices across Kabul, Jalalabad, Mazar, Herat, Kandahar"),
    ("Home", "about", "home2.about.point_3", "Home about — checklist point 3", "text",
     "Majority-local, on-the-ground team since 2012"),
    ("Home", "about", "home2.about.badge_text", "Home about — spinning badge text", "text",
     "Business Consulting"),
    ("Home", "about", "home2.about.years_label", "Home about — years-experience label", "text",
     "Years Experience"),
    ("Home", "about", "home2.about.cta_label", "Home about — button label", "text",
     "More Details"),
    ("Home", "about", "home2.about.image", "Home about — photo", "image",
     "/assets/images/home2/about-large.jpg"),

    # Services2.tsx (homepage "What We Offer" section)
    ("Home", "services", "home2.services.eyebrow", "Home services — eyebrow label", "text",
     "What We Offer"),
    ("Home", "services", "home2.services.heading", "Home services — heading", "text",
     "Our Comprehensive Service Offerings"),
    ("Home", "services", "home2.services.intro", "Home services — intro paragraph", "richtext",
     "ACE supports government, private-sector and NGO partners across four connected pillars — from independent assessment through to institutional reform, workforce empowerment, and compliance."),

    # WhyChoose2.tsx
    ("Home", "whychoose", "home2.whychoose.eyebrow", "Home why-choose — eyebrow label", "text",
     "Why Choose Us"),
    ("Home", "whychoose", "home2.whychoose.heading", "Home why-choose — heading", "text",
     "Why Institutions Trust ACE"),
    ("Home", "whychoose", "home2.whychoose.intro", "Home why-choose — intro paragraph", "richtext",
     "Government agencies, private-sector firms and NGO partners choose ACE for strategic clarity, disciplined delivery, and a decade of proven results in some of Afghanistan's hardest working environments."),
    ("Home", "whychoose", "home2.whychoose.image", "Home why-choose — photo", "image",
     "/assets/images/home2/why-choose.jpg"),
    ("Home", "whychoose", "home2.whychoose.feature_1_title", "Home why-choose — feature 1 title", "text",
     "Independent assessment"),
    ("Home", "whychoose", "home2.whychoose.feature_1_body", "Home why-choose — feature 1 body", "text",
     "Evidence-based evaluation, not assumptions — every recommendation is grounded in what we find on the ground."),
    ("Home", "whychoose", "home2.whychoose.feature_2_title", "Home why-choose — feature 2 title", "text",
     "~50 local consultants"),
    ("Home", "whychoose", "home2.whychoose.feature_2_body", "Home why-choose — feature 2 body", "text",
     "A majority-Afghan team means context and relationships you can't outsource."),
    ("Home", "whychoose", "home2.whychoose.feature_3_title", "Home why-choose — feature 3 title", "text",
     "Since 2012"),
    ("Home", "whychoose", "home2.whychoose.feature_3_body", "Home why-choose — feature 3 body", "text",
     "Over a decade of continuous, on-the-ground delivery across five provinces."),
    ("Home", "whychoose", "home2.whychoose.feature_4_title", "Home why-choose — feature 4 title", "text",
     "Four connected pillars"),
    ("Home", "whychoose", "home2.whychoose.feature_4_body", "Home why-choose — feature 4 body", "text",
     "Assess, Transform, Empower, Comply — one team covering the full arc of institutional reform."),

    # Projects2.tsx (homepage "Latest Project" section)
    ("Home", "projects", "home2.projects.eyebrow", "Home projects — eyebrow label", "text",
     "Latest Project"),
    ("Home", "projects", "home2.projects.heading", "Home projects — heading", "text",
     "Field Work That Delivers Results"),

    # WhereWeWork2.tsx
    ("Home", "wherewework", "home2.wherewework.eyebrow", "Home where-we-work — eyebrow label", "text",
     "Our Footprint"),
    ("Home", "wherewework", "home2.wherewework.heading", "Home where-we-work — heading", "text",
     "Where We Work"),
    ("Home", "wherewework", "home2.wherewework.intro", "Home where-we-work — intro paragraph", "richtext",
     "ACE delivers on the ground across five provinces, with a head office in Kabul and regional offices covering the north, south, east and west."),

    # Team2.tsx
    ("Home", "team", "home2.team.eyebrow", "Home team — eyebrow label", "text",
     "Meet the Team"),
    ("Home", "team", "home2.team.heading", "Home team — heading", "text",
     "The People Behind Our Work"),

    # Testimonials2.tsx
    ("Home", "testimonials", "home2.testimonials.eyebrow", "Home testimonials — eyebrow label", "text",
     "Clients Feedback"),
    ("Home", "testimonials", "home2.testimonials.heading", "Home testimonials — heading", "text",
     "Client Experiences That Speak for Themselves"),
    ("Home", "testimonials", "home2.testimonials.image", "Home testimonials — photo", "image",
     "/assets/images/home2/testimonial.jpg"),

    # Blog2.tsx (homepage "Latest Blog Post" section)
    ("Home", "blog", "home2.blog.eyebrow", "Home blog — eyebrow label", "text",
     "Latest Blog Post"),
    ("Home", "blog", "home2.blog.heading", "Home blog — heading", "text",
     "Latest Insights from Our Consultants"),
    ("Home", "blog", "home2.blog.cta_label", "Home blog — 'View All Blog' button label", "text",
     "View All Blog"),

    # --- Home-02 Career page (page="Career") — /home-02/career ---
    # Job posting content (title, summary, responsibilities, etc.) stays
    # fully dynamic via the existing Careers admin tab / useCareerJobs — NOT
    # duplicated here. Only the page's own static copy is included.
    ("Career", "hero", "career.hero_title", "Career hero — title", "text",
     "Career"),
    ("Career", "hero", "career.hero_crumb", "Career hero — breadcrumb", "text",
     "Home / Career"),
    ("Career", "intro", "career.section1_eyebrow", "Career intro — eyebrow label", "text",
     "Work With Us"),
    ("Career", "intro", "career.section1_heading", "Career intro — heading", "text",
     "Build a Career That Builds the Country"),
    ("Career", "openings", "career.openings_eyebrow", "Career openings — eyebrow label", "text",
     "Current Openings"),
    ("Career", "openings", "career.openings_heading", "Career openings — heading", "text",
     "Roles Open Right Now"),
    ("Career", "openings", "career.no_fit_heading", "Career openings — 'no fit' callout heading", "text",
     "Don't see a fit?"),
    ("Career", "openings", "career.no_fit_body", "Career openings — 'no fit' callout body", "text",
     "Send us your CV and we'll keep it on file for future openings."),
    ("Career", "intro", "career.intro_text", "Career intro — paragraph", "richtext",
     "ACE is managed by a core team of around 50 experienced Afghans, with an additional 200 project-based team members. Women represent 30% of our core team. We hire across assessment, training, and programme delivery — in Kabul and across our regional offices."),
    ("Career", "intro", "career.intro_image", "Career intro — photo", "image",
     "/assets/images/home2/career-intro.jpg"),
    ("Career", "values", "career.value_1_title", "Career values — card 1 title", "text",
     "Work That Lands Locally"),
    ("Career", "values", "career.value_1_body", "Career values — card 1 body", "text",
     "Every project is delivered on the ground in Afghanistan, with communities we know and return to."),
    ("Career", "values", "career.value_2_title", "Career values — card 2 title", "text",
     "Room to Grow"),
    ("Career", "values", "career.value_2_body", "Career values — card 2 body", "text",
     "Team members move between assessment, training and delivery work rather than staying in one lane."),
    ("Career", "values", "career.value_3_title", "Career values — card 3 title", "text",
     "A Team That Reflects the Country"),
    ("Career", "values", "career.value_3_body", "Career values — card 3 body", "text",
     "We actively recruit women, youth and returnees into professional roles, not just programme participation."),

    # --- Home-02 About page (page="About") — /home-02/about ---
    ("About", "hero", "about.hero_eyebrow", "About hero — eyebrow label", "text",
     "About Our Consulting"),
    ("About", "hero", "about.hero_heading", "About hero — heading", "text",
     "Field-Tested Expertise, Delivering Results Across Afghanistan"),
    ("About", "hero", "about.hero_intro", "About hero — intro paragraph", "richtext",
     "An Afghan-owned professional services company helping government, private-sector and NGO partners improve performance, strengthen institutions, and deliver measurable outcomes since 2012."),
    ("About", "hero", "about.badge_1_text", "About hero — badge 1 label", "text", "Founded"),
    ("About", "hero", "about.badge_1_year", "About hero — badge 1 year", "text", "2012"),
    ("About", "hero", "about.badge_2_text", "About hero — badge 2 label", "text",
     "UN & Government Partner"),
    ("About", "hero", "about.point_1", "About hero — checklist point 1", "text",
     "~50 experienced Afghan consultants"),
    ("About", "hero", "about.point_2", "About hero — checklist point 2", "text",
     "Offices across Kabul, Jalalabad, Mazar, Herat, Kandahar"),
    ("About", "hero", "about.point_3", "About hero — checklist point 3", "text",
     "Majority-local, on-the-ground team since 2012"),
    ("About", "hero", "about.cta_label", "About hero — button label", "text",
     "See How We Work"),
    ("About", "hero", "about.image_large", "About hero — large photo", "image",
     "/assets/images/about-large.png"),
    ("About", "hero", "about.image_small", "About hero — small circular photo", "image",
     "/assets/images/about-small.png"),

    ("About", "pillars", "about.pillar_1_title", "About pillars — pillar 1 title", "text",
     "Afghan-Owned, Field-Tested"),
    ("About", "pillars", "about.pillar_1_body", "About pillars — pillar 1 body", "text",
     "Headquartered in Kabul since 2012, with regional offices in Jalalabad, Mazar, Herat and Kandahar."),
    ("About", "pillars", "about.pillar_2_title", "About pillars — pillar 2 title", "text",
     "Four Connected Pillars"),
    ("About", "pillars", "about.pillar_2_body", "About pillars — pillar 2 body", "text",
     "Assess, Transform, Empower, Comply — one methodology covering the full arc of institutional reform."),
    ("About", "pillars", "about.pillar_3_title", "About pillars — pillar 3 title", "text",
     "Trusted by Government & NGOs"),
    ("About", "pillars", "about.pillar_3_body", "About pillars — pillar 3 body", "text",
     "Working alongside government agencies, the private sector, and UN agencies since our founding."),

    ("About", "overview", "about.overview_eyebrow", "About overview — eyebrow label", "text",
     "Overview"),
    ("About", "overview", "about.overview_text", "About overview — paragraph", "richtext",
     "The Afghanistan Center for Excellence (ACE) is an Afghan-owned professional services company. We support national and international stakeholders from the public and private sectors in their quest to tackle pressing social and economic issues the country faces. As part of our fundamental mission, we hope to nurture an entrepreneurial culture in Afghanistan where innovation and adaptability are held at a premium. Through our extensive and engaged network of public and private sector leaders and institutions, we develop and implement pragmatic solutions to Afghanistan's most critical development challenges. Established in 2012, ACE is headquartered in Kabul with regional offices and presence in Jalalabad, Mazar, Herat, and Kandahar. ACE is managed by a core team of around 50 experienced Afghans with an additional 200 project-based team members — women represent 30% of our core team. Our diverse and dynamic team of experts provide turnkey solutions in effective and culturally appropriate ways."),
    ("About", "overview", "about.overview_offices", "About overview — office locations line", "text",
     "Kabul · Jalalabad · Mazar · Herat · Kandahar"),

    # Impact stats — StatsStrip2 is ONE shared component rendered on both the
    # Home page and the About page, so these keys edit both at once. They
    # previously lived in the old lowercase "home" group that was deleted.
    ("About", "stats", "impact.stat_1_value", "Impact stat 1 — number (Home + About pages)", "text", "2,973"),
    ("About", "stats", "impact.stat_1_label", "Impact stat 1 — label (Home + About pages)", "text",
     "Afghan returnees provided with reintegration support"),
    ("About", "stats", "impact.stat_2_value", "Impact stat 2 — number (Home + About pages)", "text", "17,533"),
    ("About", "stats", "impact.stat_2_label", "Impact stat 2 — label (Home + About pages)", "text",
     "people connected with employment"),
    ("About", "stats", "impact.stat_3_value", "Impact stat 3 — number (Home + About pages)", "text", "47"),
    ("About", "stats", "impact.stat_3_label", "Impact stat 3 — label (Home + About pages)", "text",
     "Government, private sector, and NGO entities technically advised"),
    ("About", "stats", "impact.stat_4_value", "Impact stat 4 — number (Home + About pages)", "text", "74"),
    ("About", "stats", "impact.stat_4_label", "Impact stat 4 — label (Home + About pages)", "text",
     "Projects Implemented"),

    # --- Home-02 Services page (page="Services") — /home-02/services ---
    # The four pillars' own content (Assess/Transform/Empower/Comply — tab
    # labels, intro paragraphs, sub-item cards) stays in src/content.ts
    # (serviceDetails), same scope boundary as the other dynamic lists.
    ("Services", "hero", "services.hero_title", "Services hero — title", "text",
     "Services"),
    ("Services", "hero", "services.hero_crumb", "Services hero — breadcrumb", "text",
     "Home / Services"),
    ("Services", "hero", "services.hero_image", "Services hero — background photo", "image",
     "/assets/images/home2/services-hero.jpg"),

    ("Services", "intro", "services.intro_eyebrow", "Services intro — eyebrow label", "text",
     "One Method, Four Stages"),
    ("Services", "intro", "services.intro_heading", "Services intro — heading", "text",
     "Assess, Transform, Empower, Comply"),

    ("Services", "skills", "services.skills_eyebrow", "Services skills — eyebrow label", "text",
     "Skills & Expertise"),
    ("Services", "skills", "services.skills_heading", "Services skills — heading", "text",
     "Built on Years of Hands-On Consulting"),
    ("Services", "skills", "services.skills_body", "Services skills — paragraph", "text",
     "Our skills and experience are built on years of hands-on consulting across diverse industries."),
    ("Services", "skills", "services.skill_1_label", "Services skills — bar 1 label", "text",
     "Business Consultants"),
    ("Services", "skills", "services.skill_1_value", "Services skills — bar 1 percent (0-100)", "text",
     "65"),
    ("Services", "skills", "services.skill_2_label", "Services skills — bar 2 label", "text",
     "Client Communication"),
    ("Services", "skills", "services.skill_2_value", "Services skills — bar 2 percent (0-100)", "text",
     "83"),
    ("Services", "skills", "services.skills_image", "Services skills — photo", "image",
     "/assets/images/home2/skills-expertise.jpg"),

    # --- Services pillars (Assess / Transform / Empower / Comply) ---
    # Shared by the Services page (ServicesDetail2) AND the homepage pillar
    # cards (Services2: title + first paragraph + image) via
    # src/components/home2/useServicePillars.ts. Number of cards per pillar
    # comes from content.ts serviceDetails (Transform has 3, the others 4).
    ("Services", "assess", "services.assess.title", "Assess — tab / pillar title (also homepage card)", "text", "Assess"),
    ("Services", "assess", "services.assess.intro_1", "Assess — paragraph 1 (also homepage card)", "richtext",
     "Our goal is to improve the impact of projects, programs and policies through high-quality assessments, innovative techniques and results-oriented decision making."),
    ("Services", "assess", "services.assess.intro_2", "Assess — paragraph 2", "richtext",
     "ACE collaborates with the government of Afghanistan, the private sector, and international partners to ensure a more prosperous Afghan economy by offering sound technical assistance and evidence-based strategies."),
    ("Services", "assess", "services.assess.image", "Assess — photo (also homepage card)", "image", "/assets/images/service-assess.jpg"),
    ("Services", "assess", "services.assess.item_1_title", "Assess — card 1 title", "text",
     "Baseline, midline and endline assessments"),
    ("Services", "assess", "services.assess.item_1_body", "Assess — card 1 body", "richtext",
     "Our team of experts will support your teams by conducting evaluation and impact studies, including baseline, midline, and endline assessments from inception to conclusion. ACE will help you with scheduling, audience selection and survey design, giving you cleaner and more credible data. Our goal is to alleviate complex back-and-forths and provide in-depth and accurate measurements of your project's impact."),
    ("Services", "assess", "services.assess.item_2_title", "Assess — card 2 title", "text",
     "Capacity / needs assessments"),
    ("Services", "assess", "services.assess.item_2_body", "Assess — card 2 body", "richtext",
     "ACE offers comprehensive capacity needs assessments by evaluating existing gaps, including knowledge, skills, strengths and weaknesses, opportunities, threats, assets and other required elements. Our team draws on its years of rich experience to translate needs assessments into capacity-building plans to help the target groups achieve their identified objectives."),
    ("Services", "assess", "services.assess.item_3_title", "Assess — card 3 title", "text",
     "Market assessments"),
    ("Services", "assess", "services.assess.item_3_body", "Assess — card 3 body", "richtext",
     "ACE provides comprehensive and in-depth market assessment services, including forecasting, growth plans, regional market assessments, infrastructure analysis and risk management policies and analysis. Our team has made positive contributions to market growth in Afghanistan since 2012 through various successful market assessments for both national and international clients."),
    ("Services", "assess", "services.assess.item_4_title", "Assess — card 4 title", "text",
     "Regulatory impact assessments"),
    ("Services", "assess", "services.assess.item_4_body", "Assess — card 4 body", "richtext",
     "ACE supports government agencies by conducting Regulatory Impact Assessments (RIA) to help ensure that new regulations achieve their objectives. Our detailed and systematic approach helps the government understand the positive and negative impacts of proposed and existing regulations."),

    ("Services", "transform", "services.transform.title", "Transform — tab / pillar title (also homepage card)", "text", "Transform"),
    ("Services", "transform", "services.transform.intro_1", "Transform — paragraph 1 (also homepage card)", "richtext",
     "ACE provides in-depth regulatory and procedural transformation to foster prosperous market dynamics and ensure sustainable social, economic, and environmental development."),
    ("Services", "transform", "services.transform.intro_2", "Transform — paragraph 2", "richtext",
     "We contribute to a more empowered Afghan economy by incorporating innovative solutions, access to law, enhanced transparency and regulatory reform."),
    ("Services", "transform", "services.transform.image", "Transform — photo (also homepage card)", "image", "/assets/images/service-transform.jpg"),
    ("Services", "transform", "services.transform.item_1_title", "Transform — card 1 title", "text",
     "Outreach strategies (and work plans)"),
    ("Services", "transform", "services.transform.item_1_body", "Transform — card 1 body", "richtext",
     "ACE designs practical outreach strategies and work plans that keep partners, communities, and stakeholders aligned as a program moves from design into delivery."),
    ("Services", "transform", "services.transform.item_2_title", "Transform — card 2 title", "text",
     "Regulatory and procedural reform (business environment reform)"),
    ("Services", "transform", "services.transform.item_2_body", "Transform — card 2 body", "richtext",
     "Specific expertise in business environment reform — simplifying regulation, cutting procedural friction, and helping institutions adopt rules that are easier to comply with and enforce."),
    ("Services", "transform", "services.transform.item_3_title", "Transform — card 3 title", "text",
     "Streamlining processes"),
    ("Services", "transform", "services.transform.item_3_body", "Transform — card 3 body", "richtext",
     "We map existing institutional processes end to end and redesign them to remove redundant steps, reduce delays, and make day-to-day operations easier to sustain."),

    ("Services", "empower", "services.empower.title", "Empower — tab / pillar title (also homepage card)", "text", "Empower"),
    ("Services", "empower", "services.empower.intro_1", "Empower — paragraph 1 (also homepage card)", "richtext",
     "ACE seeks to make positive contributions to the Afghan economy and empower our fellow citizens through effective structures, practices and training."),
    ("Services", "empower", "services.empower.intro_2", "Empower — paragraph 2", "richtext",
     "We offer comprehensive and practical solutions to Afghanistan's most pressing social and economic needs, enabling communities to increase control over their lives, both at home and abroad."),
    ("Services", "empower", "services.empower.image", "Empower — photo (also homepage card)", "image", "/assets/images/service-empower.jpg"),
    ("Services", "empower", "services.empower.item_1_title", "Empower — card 1 title", "text",
     "TVET training"),
    ("Services", "empower", "services.empower.item_1_body", "Empower — card 1 body", "richtext",
     "Technical and vocational education and training programs that build practical, employable skills matched to real demand in the local economy."),
    ("Services", "empower", "services.empower.item_2_title", "Empower — card 2 title", "text",
     "Entrepreneurship depot"),
    ("Services", "empower", "services.empower.item_2_body", "Empower — card 2 body", "richtext",
     "Hands-on support for aspiring Afghan entrepreneurs — from business fundamentals to the practical steps of getting a small enterprise off the ground."),
    ("Services", "empower", "services.empower.item_3_title", "Empower — card 3 title", "text",
     "Apprenticeships, internships & job creation"),
    ("Services", "empower", "services.empower.item_3_body", "Empower — card 3 body", "richtext",
     "Structured placements that connect jobseekers, especially youth and returnees, directly with employers and real work experience."),
    ("Services", "empower", "services.empower.item_4_title", "Empower — card 4 title", "text",
     "Bespoke training"),
    ("Services", "empower", "services.empower.item_4_body", "Empower — card 4 body", "richtext",
     "Custom-designed training curricula built around a specific partner's workforce, sector, or skills gap."),

    ("Services", "comply", "services.comply.title", "Comply — tab / pillar title (also homepage card)", "text", "Comply"),
    ("Services", "comply", "services.comply.intro_1", "Comply — paragraph 1 (also homepage card)", "richtext",
     "ACE offers a wide range of compliance consulting services to help our clients comply with government regulatory requirements."),
    ("Services", "comply", "services.comply.intro_2", "Comply — paragraph 2", "richtext",
     "Our team of experts help businesses navigate the regulatory landscape to comply with policies and regulations, manage risk effectively and respond to non-compliance issues."),
    ("Services", "comply", "services.comply.image", "Comply — photo (also homepage card)", "image", "/assets/images/service-comply.jpg"),
    ("Services", "comply", "services.comply.item_1_title", "Comply — card 1 title", "text",
     "Donor reporting compliance"),
    ("Services", "comply", "services.comply.item_1_body", "Comply — card 1 body", "richtext",
     "Support building and maintaining the reporting practices donors require, from data collection through to final submission."),
    ("Services", "comply", "services.comply.item_2_title", "Comply — card 2 title", "text",
     "Regulatory compliance audits"),
    ("Services", "comply", "services.comply.item_2_body", "Comply — card 2 body", "richtext",
     "Independent review of an organization's practices against the regulatory standards that apply to it, with clear, actionable findings."),
    ("Services", "comply", "services.comply.item_3_title", "Comply — card 3 title", "text",
     "Grant & contract compliance"),
    ("Services", "comply", "services.comply.item_3_body", "Comply — card 3 body", "richtext",
     "Guidance to keep grant- and contract-funded work compliant with the terms it was awarded under, reducing risk of clawback or dispute."),
    ("Services", "comply", "services.comply.item_4_title", "Comply — card 4 title", "text",
     "Monitoring & evaluation frameworks"),
    ("Services", "comply", "services.comply.item_4_body", "Comply — card 4 body", "richtext",
     "M&E frameworks built to fit a program's actual objectives, so progress reporting reflects real impact rather than paperwork for its own sake."),

    # --- Home-02 Projects page (page="Projects") — /home-02/projects ---
    # Individual project cards (projectsList in content.ts) stay hardcoded —
    # same list-content scope boundary as everywhere else.
    ("Projects", "hero", "projects.hero_title", "Projects hero — title", "text",
     "Projects"),
    ("Projects", "hero", "projects.hero_crumb", "Projects hero — breadcrumb", "text",
     "Home / Projects"),
    ("Projects", "hero", "projects.hero_image", "Projects hero — background photo", "image",
     "/assets/images/home2/projects-hero.jpg"),

    # --- Home-02 Gallery page (page="Gallery") — /home-02/gallery ---
    # Photos/videos themselves stay hardcoded (galleryPhotos, YOUTUBE_VIDEOS).
    ("Gallery", "hero", "gallery.hero_title", "Gallery hero — title", "text",
     "Media Gallery"),
    ("Gallery", "hero", "gallery.hero_crumb", "Gallery hero — breadcrumb", "text",
     "Home / Gallery"),
    ("Gallery", "hero", "gallery.hero_image", "Gallery hero — background photo", "image",
     "/assets/images/home2/gallery-hero.jpg"),
    ("Gallery", "hero", "gallery.video_label", "Gallery — 'Video' section tab label", "text",
     "Video"),
    ("Gallery", "hero", "gallery.photos_label", "Gallery — 'Photos' section tab label", "text",
     "Photos"),

    # --- Home-02 Blog page (page="Blog") — /home-02/blog ---
    # Individual posts (blogPosts in content.ts) stay hardcoded.
    ("Blog", "hero", "blog.hero_title", "Blog hero — title", "text",
     "Blog"),
    ("Blog", "hero", "blog.hero_crumb", "Blog hero — breadcrumb", "text",
     "Home / Blog"),
    ("Blog", "hero", "blog.hero_image", "Blog hero — background photo", "image",
     "/assets/images/home2/blog-hero.jpg"),

    # --- Home-02 Contact page (page="Contact") — /home-02/contact ---
    ("Contact", "hero", "contact.hero_title", "Contact hero — title", "text",
     "Contact Us"),
    ("Contact", "hero", "contact.hero_crumb", "Contact hero — breadcrumb", "text",
     "Home / Contact Us"),
    ("Contact", "hero", "contact.hero_image", "Contact hero — background photo", "image",
     "/assets/images/home2/contact-hero.jpg"),
    ("Contact", "form", "contact.form_eyebrow", "Contact form — eyebrow label", "text",
     "Contact Us"),
    ("Contact", "form", "contact.form_heading", "Contact form — heading", "text",
     "Let's Discuss How We Can Help You Succeed"),
    ("Contact", "form", "contact.form_image", "Contact form — photo", "image",
     "/assets/images/home2/contact-form.jpg"),
    ("Contact", "info", "contact.info_phone_label", "Contact info card — phone label", "text",
     "Have a Question?"),
    ("Contact", "info", "contact.info_phone_value", "Contact info card — phone number (placeholder — replace with real ACE number)", "text",
     "+880 (123) 456 789"),
    ("Contact", "info", "contact.info_email_label", "Contact info card — email label", "text",
     "Write Email"),
    ("Contact", "info", "contact.info_email_value", "Contact info card — email address (placeholder — replace with real ACE email)", "text",
     "support@ace.org.af"),
    ("Contact", "info", "contact.info_location_label", "Contact info card — location label", "text",
     "Our Location"),
    ("Contact", "info", "contact.info_location_value", "Contact info card — office location (placeholder — replace with real ACE address)", "text",
     "Kabul, Afghanistan"),
]


def run():
    db = SessionLocal()
    try:
        inserted = 0
        for page, section, key, label, type_, value in SEED_DATA:
            exists = db.query(ContentBlock).filter(ContentBlock.key == key).first()
            if exists:
                continue
            db.add(ContentBlock(
                key=key, page=page, section=section,
                label=label, type=type_, value=value,
            ))
            inserted += 1
        db.commit()
        print(f"[seed] Inserted {inserted} new content blocks "
              f"({len(SEED_DATA) - inserted} already existed, left untouched).")
    finally:
        db.close()




def seed_job_postings():
    """
    Seeds a few placeholder ACE job postings so the Career page and admin
    panel have something real to show immediately. These are placeholders,
    not real ACE vacancies — replace/delete them from the admin panel's
    Careers tab once you have real openings to post.

    Deliberately NOT seeded from the Cognizant .NET developer listing you
    shared — that's a real third-party company's job posting, not one of
    ACE's own openings, so publishing it under ACE's name would be
    inaccurate. It was useful as a reference for the FIELD STRUCTURE
    (title/company/location/posted date, expandable detail, application
    form with mandatory resume), which is what actually got built.
    """
    from datetime import date, timedelta
    from app.models import JobPosting

    db = SessionLocal()
    try:
        if db.query(JobPosting).count() > 0:
            return  # never overwrite existing postings, including deleted-to-zero on purpose

        today = date.today()
        placeholders = [
            JobPosting(
                title="Placeholder: Field Assessment Officer",
                company="ACE",
                location="Kabul, Afghanistan",
                employment_type="Full time",
                posted_date=today,
                deadline=today + timedelta(days=45),
                summary="This is a placeholder posting so you can see the Career page working end-to-end. Replace or delete it from the admin panel's Careers tab.",
                responsibilities="Conduct field assessments and data collection across ACE project sites; support monitoring and evaluation reporting; coordinate with local partners and communities.",
                qualifications="Bachelor's degree in a relevant field; 2+ years of field-based development or research experience; fluency in Dari and/or Pashto; strong written English.",
            ),
            JobPosting(
                title="Placeholder: Training Coordinator",
                company="ACE",
                location="Herat, Afghanistan",
                employment_type="Project based",
                posted_date=today,
                deadline=today + timedelta(days=30),
                summary="Second placeholder posting — shows how multiple listings and different deadlines display on the Career page.",
                responsibilities="Plan and deliver vocational and entrepreneurship training sessions; track participant outcomes; liaise with regional office staff.",
                qualifications="Experience designing or delivering adult training programs; comfortable working across ACE's regional offices; strong facilitation skills.",
            ),
        ]
        db.add_all(placeholders)
        db.commit()
        print(f"[seed] Inserted {len(placeholders)} placeholder job postings.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
    seed_job_postings()
