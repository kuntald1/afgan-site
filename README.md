# Afghanistan Center for Excellence — Redesign

ACE's real content rebuilt into the modern agency-style design from the
earlier Axion Studio build, now split into **real, separate pages** with
`react-router-dom` rather than one long scrolling homepage:

```
/            Home       — hero, supported-by banner, impact numbers, projects, testimonials
/about       About      — mission, overview, team stats, our aspirations
/services    Services   — the four-pillar tabbed module (Assess/Transform/Empower/Comply)
/projects    Projects   — the SAME "Our projects" component shown on Home, on its own page
/divisions   Divisions  — KHANAGi, DAFTAR, WeBrand
/gallery     Gallery    — Photo & Video Media Gallery (PLACEHOLDER MEDIA — see below)
/blog        Blog       — article grid (PLACEHOLDER POSTS — see below)
/career      Career     — intro, values, openings (PLACEHOLDER ROLES — see below)
/contact     Contact    — CTA, email/phone/offices, contact form, Google Map
```

`Navbar` and `Footer` are shared across every page via `Layout.tsx`; only
the middle of the page swaps per route. About, Services, and Contact each
open with `PageVideoHero.tsx` — a shorter version of the homepage's video
hero — so the background video plays on every page, not just Home.

## Setup

```
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173) — try clicking
between Home / About / Services / Contact in the nav.

To build for production: `npm run build`, then `npm run preview`.

## ⚠️ Deployment note — Nginx needs a rewrite rule

This uses client-side routing (`BrowserRouter`), so direct links or page
refreshes on `/about`, `/services`, or `/contact` will 404 on a plain static
file server unless it's told to fall back to `index.html`. For an Nginx
reverse proxy in front of the built `dist/` folder, add:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Without this, the nav will work fine (client-side navigation), but a
bookmarked link or a page refresh on `/services` will break.

## 3D scroll experience

The site is built around a single persistent WebGL canvas (`src/components/
three/SceneBackground.tsx`) that sits fixed behind every page. Scroll
position drives the scene, so the whole site reads as one continuous 3D
space rather than separate pages.

**The concept is grounded in ACE's own copy.** Their overview describes
working through "our extensive and engaged network of public and private
sector leaders and institutions" — so the scene is a **network
constellation**: nodes that connect, light up, and build as you scroll,
rather than arbitrary floating shapes.

What scroll actually controls (`NetworkScene.tsx`):

- **A camera flight through the field** — the camera travels the full depth
  of the scene as you scroll (z 32 → -30), banking left/right, rising and
  falling, and rolling slightly, while looking ahead of its own travel
  direction so it reads as flight rather than a pan.
- **Progressive activation** — nodes warm from slate to ACE orange as you
  move down the page; a link only "connects" once both its nodes are active.
- **Field rotation** — the whole constellation rotates as you scroll, so the
  flight path cuts through it at changing angles.

### How it stays readable at speed

An earlier version flew the camera in close and nodes ballooned into giant
blobs sitting on top of the footer text. The fix isn't to slow the camera
down — it's a **near-field dissolve**: every node and link is faded and
shrunk based on its distance from the camera (`depthVisibility()`), so
anything rushing past the lens melts into the page colour instead of
blocking content. There's a matching far fade so distant nodes don't clutter
the horizon.

Because the field rotates, the camera position is converted into the
group's local space each frame (`group.worldToLocal`) so the depth fade
stays correct.

Dials, in order of usefulness:

- `NEAR_FADE_START` / `NEAR_FADE_FULL` — how early things dissolve as they
  approach the lens. Raise `NEAR_FADE_START` if anything still feels like
  it's crowding the text.
- The veil opacity in `SceneBackground.tsx` (`bg-[#F4F2ED]/30`) — a global
  knock-back over the whole canvas.
- `camTarget.set(...)` in `useFrame` — the camera path itself.
- `NODE_COUNT`, `MAX_LINK_DIST`, `FIELD` — density and reach.

Alongside the 3D, scroll also drives:

- **Hero handoff** — the video fades and its content lifts as you scroll,
  handing over to the 3D scene behind it.
- **Ken Burns zoom** (`ScrollZoom` in `motion/ScrollEffects.tsx`) — the
  About and Services images slowly scale as they pass through the viewport.
- **Parallax** — the two About images drift at opposing rates for depth.
- **Reveals** — sections fade/lift in, with a richer `ScaleReveal` variant
  available for cards.
- **Counters** — every stat number counts up when scrolled into view.
- **3D coverflow projects** — the Projects section pins to the viewport and
  scrolls the cards *sideways* as you scroll down. Each card measures its
  own screen position every frame and tilts in 3D (`rotateY`, `translateZ`,
  scale, opacity) based on distance from the centre of the screen, so cards
  rotate to face you as they pass through the middle and angle away at the
  edges (`CaseStudies.tsx`). Under reduced-motion it falls back to a plain
  grid with no tilt.
- **Progress bar** — a thin orange bar tracks page scroll at the top.
- **Page crossfades** — route changes fade rather than hard-cut.
- **Smooth scrolling** — enabled globally, disabled under reduced-motion.

### Design notes / trade-offs

- **Light theme.** The palette is a warm off-white (`#F4F2ED`) with ink
  text (`#16212b`) and the ACE orange accent. Sections are transparent with
  frosted white "glass" panels (`.glass-panel` in `index.css`) floating over
  the 3D scene, so the network stays visible without hurting readability.
  The 3D node/link colours were retuned (darker, saturated) to read against
  a light background instead of glowing against a dark one.
- **Performance guards**: one canvas for the whole site (not one per
  section), device pixel ratio capped at 1.75, link pairs precomputed once
  instead of every frame, and scratch vectors reused rather than allocated
  per frame.
- **Fallbacks**: if WebGL is unavailable, a gradient background renders
  instead of a broken canvas. `prefers-reduced-motion` freezes the scene
  animation and disables all the 2D motion via `MotionConfig`.
- **`shaders` package removed.** The 3D scene replaced it, which also
  removes the commercial-licensing blocker I flagged earlier — and cut the
  bundle from ~2.95 MB to ~1.29 MB. three.js now loads as its own cacheable
  chunk (~884 kB) split from the app code (~267 kB).

### Tuning

- Scene density/reach: `NODE_COUNT`, `MAX_LINK_DIST`, `FIELD` at the top of
  `NetworkScene.tsx`.
- Colours: `ORANGE`, `DEEP`, `MID` in the same file.
- Camera travel: the `camTarget.set(...)` call inside `useFrame`.
- Panel opacity: `.glass-panel` / `.glass-panel-soft` in `src/index.css`.

## Motion

Added `framer-motion` throughout for a more premium feel:

- **Scroll reveals**: most sections fade/slide up into place as you scroll,
  with staggered timing for grids (stats, testimonials, service cards) via
  `src/components/motion/Reveal.tsx`.
- **Animated counters**: every stat number (2,973 / 17,533 / 47 / 74, plus
  the team stats) counts up from 0 when it scrolls into view, via
  `src/components/motion/Counter.tsx`.
- **Hero entrance**: the eyebrow, headline, and CTA row stagger in on load,
  on both the homepage hero and the shorter page-heroes.
- **Sliding nav indicator**: the active nav link has an orange underline
  that slides between links using a shared `layoutId`, instead of just
  toggling color.
- **Sliding tab pill**: same technique on the Services page's Assess/
  Transform/Empower/Comply switcher, plus a crossfade when the active
  pillar's content changes.
- **Page transitions**: navigating between routes crossfades the page
  content instead of hard-cutting, via `AnimatePresence` in `Layout.tsx`.
- **Reduced motion respected**: wrapped the app in `<MotionConfig
  reducedMotion="user">`, so all of the above is automatically disabled for
  visitors with `prefers-reduced-motion` set — matching how the projects
  marquee already behaved.

## What changed from the Axion Studio base

- Nav: logo → "ACE" (image slot), links → Home / About / Services / Contact
  as real routes, clock →
  Kabul time (ACE is Kabul-based), CTA → "Start a conversation"
- Hero: real mission statement, "UN & Government Partner · Since 2012" badge,
  plus a background video layer (see below)
- About: ACE's actual history and services, real photography (placeholder
  for now — see below)
- New **Services** section (`ServicesDetail.tsx`): the four real pillars —
  Assess, Transform, Empower, Comply — as a single tabbed module (pill
  switcher matching the rest of the page's rounded-button language), not a
  stacked set of `+`/`−` accordions. Each pillar shows its intro copy and a
  grid of numbered detail cards. Note: the Comply pillar's detail items
  weren't visible in the screenshots I was given, so those four sub-items
  are placeholder copy in the same tone — swap in the real ones in
  `src/content.ts`.
- New Impact section: the four real figures from ace.af (2,973 returnees
  supported, 17,533 people connected to employment, 47 entities advised, 74
  projects implemented)
- **Projects section rebuilt as an animated marquee** (`CaseStudies.tsx`):
  the real 15-project list from ace.af's projects grid (PriSEC, ISLA, AACRS,
  ERRIN-SRA, ITAD, AIB ToT, ITC, TV campaign, DAI, Mercy Corps, Etisalat,
  IRARA, GITR, GIZ) scrolls continuously left, pausing on hover. See below
  for how to swap in your own photos.
- New **Testimonials** section (`Testimonials.tsx`): the four real partner
  quotes — Barbaricum, Denmark's Ministry of Immigration & Integration,
  Internet Society Afghanistan, and IDLO Kabul — used in full since they
  were provided directly for this rebuild.
- New **Supported by** banner (`SupportBanner.tsx`) and the nav logo now
  point at ACE's real assets from ace.af — both are placeholders for now,
  see "Logo & support banner" below.
- New **Overview** section (`Overview.tsx`), placed right after About: the
  fuller mission paragraph from ACE's About Us page, the real team stats
  (~50 core team, 200+ project-based team members, 30% women on the core
  team), the five office locations, and the "Our Aspirations" three pillars
  (Empower the Afghan Workforce, Nurture SME Growth, Reduce Unemployment).
- Footer now includes a real **Offices** column (Kabul, Jalalabad, Mazar,
  Herat, Kandahar) and a **Tags** row, both from the real site. The nav's
  office list was updated to match (it was missing Kandahar).
- **Not included:** the old footer's "Latest ACE Projects" links
  ("Ricky Casino...") are gambling-spam SEO injection, not real ACE
  content — a sign the live WordPress site may be compromised and worth
  getting audited separately from this redesign.
- New Contact/footer: real phone, email, and social links, plus who ACE
  serves (women, youth, people with specific needs, returnees, IDPs)

All copy and figures live in `src/content.ts` — edit there to correct or
extend anything.

## Logo & support banner

You asked me to pull these two directly from ace.af:

```
https://ace.af/wp-content/uploads/2018/05/ACE-Logo-Main-White-Text-100150.png
https://ace.af/wp-content/uploads/2025/11/support-1024x366.png
```

I couldn't — `ace.af` isn't on this build sandbox's reachable domain list
(confirmed `host_not_allowed`), and my page-fetch tool can't return raw
image bytes either, only page text. So both are placeholders sized to match
the real files:

```
public/assets/images/logo/ace-logo-white.png   -> Nav logo (used on the dark pill in Navbar.tsx)
public/assets/images/logo/ace-logo-color.png    -> ACE mark on light surfaces
public/assets/images/un-global-compact.png      -> UN Global Compact emblem
```

Save the real files at those exact paths/filenames — download them
yourself from the URLs above — and both appear everywhere automatically, no
code changes needed.

## Projects marquee

`CaseStudies.tsx` renders the list from `projectsList` in `src/content.ts`
twice back-to-back, then a CSS animation (`.marquee-track` in `index.css`)
scrolls the whole track left by exactly 50% of its width on a 55-second
loop, so it wraps seamlessly. Hovering pauses it; `prefers-reduced-motion`
turns it off entirely.

Each project's photo comes from `assets.projectImages` in `src/assets.ts`,
keyed by the project's `key`:

```ts
projectImages: {
  prisec: "/assets/images/projects/prisec.jpg",
  isla: "/assets/images/projects/isla.jpg",
  // ...
}
```

Crop your screenshots/photos to roughly a 4:3 ratio (760×520 is what the
placeholders use) and drop them in at those same filenames — nothing else
needs to change. To change how fast it scrolls, edit the `55s` in the
`marquee-scroll` animation rule in `index.css`.

Two project titles were reconstructed from overlapping/garbled text in the
screenshots (the PriSEC/ISLA pair, and the DAI/SALAM pair) — worth
double-checking those four entries in `content.ts` against the real site.

## Hero video — auto-discovered, any number of files

Drop as many `.mp4` files as you want into:

```
src/media/hero-videos/
```

named with a **leading number** to set play order:

```
1-field.mp4
2-training.mp4
3-community.mp4
12-closing-shot.mp4   <- adding a 4th (or 12th) file just works
```

They play in that numeric order, looping back to the first once the last
ends. Add, remove, or renumber files and rebuild (`npm run build`) — nothing
in the code needs to change, and the count is not fixed to 3.

**Why these live under `src/` and not `public/`:** the auto-discovery uses
Vite's `import.meta.glob`, which can only see files that are part of the
app's module graph — it has no way to list what's inside `public/`, since
that folder is just copied verbatim with no build-time manifest. Moving the
videos under `src/media/hero-videos/` is what makes "however many files are
in this folder, in this order" possible without editing code.

The discovery logic itself is `src/heroVideos.ts` — both `Hero.tsx` (home
page) and `PageVideoHero.tsx` (every other page) import from there, so the
same set of videos plays everywhere.

Numeric sort is done on the leading digits specifically (not a plain string
sort), so `10-x.mp4` correctly sorts after `2-x.mp4` rather than between `1`
and `2` the way string sorting would put it.

## Hero fog / atmosphere

## Swapping images / video

Paths are centralized in `src/assets.ts`. Files live in `public/assets/`:

```
public/assets/images/about-small.png       -> About section, small image
public/assets/images/about-large.png       -> About section, large image
public/assets/videos/hero-field.mp4        -> Hero background, clip 1
public/assets/videos/hero-training.mp4     -> Hero background, clip 2
public/assets/videos/hero-community.mp4    -> Hero background, clip 3
public/assets/images/service-assess.jpg    -> Services: Assess photo
public/assets/images/service-transform.jpg -> Services: Transform photo
public/assets/images/service-empower.jpg   -> Services: Empower photo
public/assets/images/service-comply.jpg    -> Services: Comply photo
public/assets/images/projects/*.jpg        -> 15 project cards (see above)
public/assets/images/logo/ace-logo-white.png -> nav logo (see "Logo & support banner")
```

These are currently **placeholders** — ace.af's real photography and video
live on a WordPress host unreachable from the build sandbox's network. Drop
ACE's real files in at the same filenames and the whole site updates, no
code changes needed.

## Note on the `shaders` package

No longer used — the 3D scene replaced it and the dependency has been
uninstalled. This also removes the commercial-licensing requirement that
package carried.

## Divisions page

Content transcribed from ACE's Divisions section: **KHANAGi** (bread shop),
**DAFTAR** (co-working space) and **WeBrand** (design/branding service),
each with the real body copy and the buttons shown on the current site.

The button links are all `href="#"` placeholders — the real site's targets
(menu PDF, Facebook pages, KHANAGi website) weren't visible in the
screenshots. Fill them in via `divisions[].links` in `src/content.ts`.

Layout alternates image/text side to side, with parallax and scroll-zoom on
the photos. Photos are placeholders at
`public/assets/images/divisions/{khanagi,daftar,webrand}.jpg`.

## Blog page

**The four posts are placeholders**, not real ACE content — the current
site's blog feed had been overrun with injected gambling spam, so there was
nothing legitimate to carry over. Replace the entries in `blogPosts` in
`src/content.ts` with real articles, and drop matching images into
`public/assets/images/blog/`. The grid adapts to however many posts you list.

## Footer

The footer now sits on a solid dark ink surface (`#16212b`) rather than the
page background, so it reads as a distinct anchor at the end of the page
instead of blending into the body and the 3D scene behind it.

## Career page

**The three openings are placeholders**, not real ACE vacancies — replace the
entries in `openings` in `src/content.ts`. Each takes a title, location,
contract type and short summary; the list adapts to however many you list.
Each role links to a pre-filled `mailto:` to `info@ace.af`.

The intro paragraph and the three values are drawn from ACE's real team
figures (≈50 core staff, 200+ project-based, 30% women on the core team).

## Layout notes

- **Project cards** were enlarged (up to 560px wide on desktop) and the
  pinned viewport tightened to 82vh, so the coverflow row fills the screen
  instead of floating in a large vertical gap.
- **Interior page heroes** (`PageVideoHero.tsx`) are taller (68–72vh) and the
  video is framed at `object-[center_28%]` rather than dead centre — the
  shorter earlier crop was cutting off people's heads. If a particular clip
  still frames badly, that percentage is the dial: lower shows more of the
  top of the frame.
- **The nav now holds seven links**, so link spacing tightens and the
  offices line / Kabul clock drop away on narrower desktops rather than
  colliding.

## Vertical spacing

Section padding was tightened across the board (roughly a third off the
top/bottom padding of every section, plus smaller heading margins), so the
page reads as a continuous flow rather than a series of widely separated
blocks.

The biggest single offender was the pinned Projects section: its sticky
child was a full `h-screen` while the cards inside are much shorter, which
left a tall empty band above and below the row. That's now `h-[74vh]`, and
the scroll spacer that drives the sideways travel came down from `300vh` to
`220vh` so the section doesn't overstay.

If you want it tighter or looser, the section-level `pt-*`/`pb-*` classes at
the top of each component in `src/components/` are the place to adjust.

## "Supported by" section

This was originally a single flat PNG with the ACE mark, the UN Global
Compact emblem and the statement all baked into one image — which meant the
parts couldn't be animated separately, the text wasn't selectable, and it
went soft on high-DPI screens.

It's now built from three separate elements that animate in from different
directions and converge:

- ACE mark drops in from above (`assets.logoColor`)
- UN Global Compact emblem slides in from the left, un-rotating as it
  settles (`assets.unGlobalCompact`)
- The statement slides in from the right — as **real text**, from
  `globalCompact` in `src/content.ts`

### Animation

This section is **scroll-scrubbed**, not triggered — every property is bound
continuously to how far you've scrolled through the section
(`useScroll` with offset `["start 0.95", "center 0.4"]`, smoothed through a
spring so nothing snaps on fast scrolls). Scrubbing back up reverses it.

What scroll drives, in sequence:

1. **The card tilts up out of 3D space** — starts rotated back 26° on the X
   axis, scaled to 0.86 and pushed down 90px, then settles flat and full
   size. The wrapper carries `perspective: 1400` so the rotation reads as
   real depth rather than a squash.
2. **The ACE mark drops in from above**, out of focus — a 10px blur resolves
   to sharp as it lands, which reads far more expensively than a plain fade.
3. **The divider wipes open** from the centre outward.
4. **The UN emblem swings in from the left**, un-rotating from -35° as it
   arrives.
5. **The statement writes itself in word by word** — each word has its own
   overlapping slice of the scroll range, lifting and un-blurring in turn,
   so the sentence resolves as you read down rather than appearing at once.
6. **A soft orange sheen sweeps across the card** as it settles.

Everything falls back to a static, fully-visible layout under
`prefers-reduced-motion`.

Tuning: the `useTransform` input ranges near the top of the component are
the timeline — the first array is scroll progress (0–1), the second is the
value. Widening a range slows that element down relative to the scroll.

**The card is deliberately solid white.** The real ACE and UN Global Compact
artwork both have white backgrounds, and a solid white card lets them sit on
it seamlessly — so you do *not* need transparent PNGs. If you ever switch
the card to a tinted background, you'd then need transparent versions.

Both images are placeholders. Replace them at:

```
public/assets/images/logo/ace-logo-color.png   -> ACE mark (colour, for light backgrounds)
public/assets/images/un-global-compact.png     -> UN Global Compact "WE SUPPORT" emblem
```

Note there are now two logo files: `ace-logo-white.png` for the dark nav
pill, and `ace-logo-color.png` for light surfaces like this card.

The old flat `support-banner.png` has been removed.

## TOONHUB carousel (`/toonhub`)

Built literally to the supplied spec — the character-figurine carousel with
role-based positioning (center / left / right / back), 650ms
`cubic-bezier(0.4,0,0.2,1)` transitions on transform, filter, opacity and
left, background-colour crossfade, grain overlay, giant "3D SHAPE" ghost
text, and the arrow navigation with its 650ms animation lock.

**It lives on its own route, deliberately outside the shared `Layout`** — no
ACE nav, footer or 3D background — because it's a self-contained
full-viewport section with its own branding (TOONHUB), fonts (Anton/Inter)
and colour scheme. Dropping it inside an ACE page would collide with the
site's identity. To place it elsewhere, import and render `<ToonHub />`
anywhere you like.

Two things to be aware of:

- **The four images are hot-linked from a Figma-hosted site**
  (`fifth-gentle-45902158.figma.site`), exactly as given in the spec. That
  host wasn't reachable from the build sandbox, so I could not verify the
  images actually load — check this in your browser. If they 404 or the
  host disappears, download them and swap the `src` values in the `IMAGES`
  array in `src/components/ToonHub.tsx` for local paths.
- The spec defines a `panel` colour per image, but never uses it in the
  layout. I kept the field in the data as written rather than dropping it.

The Anton + Inter font links were added to `index.html` as specified. Inter
is scoped to this component via inline `fontFamily`, so it doesn't change
the rest of the ACE site's typography.

## Hero video "fogginess" fix

Both `Hero.tsx` and `PageVideoHero.tsx` had the same bug: the video layer
started at reduced opacity (60% / 50%) even before any scrolling, and a flat
black gradient covered the *entire* frame at 25–65% opacity on top of that.
Combined, it made the footage read grey and washed out no matter what was
in it.

Fixed both:

- Video now renders at full opacity at rest, only fading near the very end
  of the hero's scroll range as it hands off to the page below.
- Scrims are now tight to where they're actually needed — a short strip at
  the top for nav legibility, a gradient in the bottom 55–60% for the
  headline — instead of a flat wash across the whole frame. The middle of
  the frame is now clear.

If it's still not vivid enough for your taste, the two scrim `<div>`s near
the top of each component (`h-40`/`h-32` for the top, `h-[55%]`/`h-[60%]`
for the bottom) are the dials — shrink the height or lower the `/NN`
opacity value to pull back further.

The hero now layers three scrims instead of one flat wash:

1. A **light full-frame haze** (`bg-black/12`) for atmosphere across the
   whole frame — this is the "fog" dial. It's intentionally much lighter
   than the original version that made the video look grey and dead.
2. A short gradient at the **top** for nav legibility.
3. A gradient across the **bottom ~55–60%** for the headline.

To adjust the fog level, change the `/12` in `bg-black/12` (in both
`Hero.tsx` and `PageVideoHero.tsx`) — higher number = foggier, lower = more
vivid/raw footage.

## Fixed: pages going blank when navigating from Home (but working on direct load)

**Symptom:** typing `/services`, `/divisions`, `/blog`, or `/career` directly
into the address bar worked fine, but clicking those links *from the Home
page* left the content area blank (nav and 3D background still visible,
page content empty). Going back to Home and forward again sometimes worked.

**Cause:** `Layout.tsx` used `<AnimatePresence mode="wait">` around the
routed page content. That mode makes the *incoming* page wait for the
*outgoing* page's exit animation to fully complete before rendering. On a
direct page load there's no previous page to exit, so there was nothing to
wait for — hence it always worked. But navigating away from Home — the
heaviest page on the site (video playlist, scroll-scrubbed sections, 3D
coverflow cards, several scroll listeners) — something in its exit could
stall or error during cleanup, and because the next page's render was
gated on that exit finishing, it never appeared.

**Fix:** removed `AnimatePresence`/`mode="wait"` entirely. The routed
content now just remounts on a `key={location.pathname}` change with its
own enter animation, with no dependency on the previous page's exit
finishing. Page transitions still fade in, just without the fragile
wait-for-exit choreography.

## Basic SEO setup

- **Per-page title, meta description, canonical URL, and Open Graph/Twitter
  tags** — every page calls `useSeo({ title, description, path })`
  (`src/hooks/useSeo.ts`) which sets these at runtime.
- **Site-wide fallback tags** in `index.html` — description, Open Graph,
  Twitter card, `robots`, canonical, and an Organization JSON-LD block —
  these are what non-JS crawlers and link-unfurlers see before the app runs.
- **`public/robots.txt`** — allows all crawlers, points to the sitemap.
- **`public/sitemap.xml`** — lists all nine routes.

**Two things to know:**

1. **This is a client-rendered SPA with no server-side rendering.**
   `useSeo` sets tags after JavaScript runs. Modern Googlebot executes JS and
   picks this up fine, but crawlers/bots that *don't* run JavaScript (some
   social-media unfurlers, simple scrapers) will only ever see the static
   tags baked into `index.html` — the generic site-wide ones, not each
   page's specific title/description. True per-page SEO in the raw HTML
   would need server-side rendering or static prerendering (e.g. a tool
   like `vite-plugin-ssr`, Next.js, or a prerender step in the build) — a
   real architectural change, well beyond "basic" setup. Worth doing later
   if organic search traffic matters a lot for this site.
2. **The domain is hardcoded as `ace-preview.duckdns.org`** in
   `useSeo.ts`, `index.html`, `robots.txt`, and `sitemap.xml`. Update all
   four once you're on your real production domain (e.g. `ace.af`), or
   search-engine results will keep pointing at the preview URL.

## Media Gallery (`/gallery`)

Video and photos each have their **own dedicated auto-discovery folder**,
same pattern as the hero videos — not a fixed count, not borrowed from
another section.

**Video** → `src/media/gallery-videos/`
```
1-site-visit.mp4
2-training-day.mp4     <- add as many as you want
```

**Photos** → `src/media/gallery-photos/`
```
1-field-visit.jpg
2-training-day.jpg
...                     <- not fixed to 8, add/remove freely
```

Both are named with a leading number for display order, both discovered at
build time via `src/galleryVideos.ts` / `src/galleryPhotos.ts` — drop files
in, rebuild, done. No code edits, no fixed count. If the gallery has no
video files at all, that section just doesn't render (no empty placeholder
box).

Photo captions are matched by position in `galleryPhotoCaptions` in
`src/content.ts` — if you have more photos than captions, the extras just
display without one.

**Currently placeholder content**, same as before: 8 generated placeholder
photos, 1 placeholder video. Swap in ACE's real media at those same paths.

## Projects page (`/projects`)

This is **not a new "Our projects" section** — it's the literal same
`<CaseStudies />` component that already renders on Home, now also given
its own dedicated page and nav link. Nothing was removed from Home; both
pages render the identical component, so any future edit to
`CaseStudies.tsx` (or `projectsList` in `content.ts`) updates both places
at once automatically.

## Contact form + Google Map (`/contact`)

**Contact form** (`ContactForm.tsx`): name, email, subject, message, with
loading/success/error states. **This does not send email yet** — there's no
backend on this static site, so it posts to
[Formspree](https://formspree.io), a free hosted form-to-email service that
needs no server code. To make it actually deliver:

1. Create a free account at formspree.io
2. Create a form, connect it to whatever inbox should receive submissions
   (e.g. `info@ace.af`)
3. Formspree gives you a form ID — replace `FORMSPREE_FORM_ID` at the top
   of `ContactForm.tsx` with the real one

Until that's done, submissions will fail with a visible error message
rather than silently pretending to work.

**Google Map** (`GoogleMap.tsx`): uses the key-free `google.com/maps?...
&output=embed` iframe, so no API key or billing setup is needed. It's
currently centred on a text search for "Afghanistan Center for Excellence,
Kabul, Afghanistan" since no exact street address was available — once you
have ACE's real office address, swap the `query` value in `GoogleMap.tsx`
for a precise pin.

## Nav now holds 9 links

Home / About / Services / Projects / Divisions / Gallery / Blog / Career /
Contact. The full desktop row now only shows at `xl` (1280px) and up
(previously `lg`/1024px) to avoid crowding, with tighter link spacing and
smaller text at that breakpoint. Below `xl` it collapses into the mobile
menu, which now scrolls if needed. If it still feels crowded on your
usual screen size, the next step would be grouping some links under a
dropdown (e.g. "Company" → About/Divisions/Career) rather than a flat row —
say the word if you want that instead.

## Admin CMS (`/admin` folder)

A separate admin login portal now exists for editing site content without
touching code — FastAPI + PostgreSQL backend, React admin frontend, same
stack pattern as your PillPoints platform. It lives entirely in
`admin/` at the project root (sibling to this `src/` folder, not inside
it) and deploys completely independently of the main site.

**Currently wired end-to-end**: the Home page's Hero (eyebrow, headline,
partner badge) and Impact stats section genuinely fetch their content from
the admin API, with automatic fallback to the static text if the API isn't
configured or unreachable — the main site never breaks because the admin
service is down.

Everything else — architecture, setup, deployment, security notes, and the
exact repeatable pattern for wiring up more content — is documented in
`admin/README.md`. Start there.

To connect this site to a running admin API, set in `.env`:
```
VITE_ADMIN_API_URL=https://admin-api.ace.af
```
