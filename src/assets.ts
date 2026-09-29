/**
 * Central place for every image/video path used on the page.
 *
 * All files live in /public/assets, so nothing here needs to change if you
 * replace a file — just drop a new file at the same path (same name, same
 * folder) and it updates everywhere it's used.
 *
 *   public/assets/images/about-small.png       -> About section, small image
 *   public/assets/images/about-large.png       -> About section, large image
 *
 * These are currently placeholders — ace.af's own photography/video sits on
 * a WordPress host that wasn't reachable from the build sandbox's network.
 * Drop ACE's real files in at the same paths and they'll show up everywhere
 * automatically.
 */

export const assets = {
  aboutSmall: "/assets/images/about-small.png",
  aboutLarge: "/assets/images/about-large.png",
  // Hero videos are no longer listed here — see src/heroVideos.ts, which
  // auto-discovers them from src/media/hero-videos/.
  serviceAssess: "/assets/images/service-assess.jpg",
  serviceTransform: "/assets/images/service-transform.jpg",
  serviceEmpower: "/assets/images/service-empower.jpg",
  serviceComply: "/assets/images/service-comply.jpg",
  contactHero: "/assets/images/home2/contact-hero.jpg",
  careerHero: "/assets/images/home2/career-hero.jpg",
  blogHero: "/assets/images/home2/blog-hero.jpg",
  servicesHero: "/assets/images/home2/services-hero.jpg",
  aboutHero: "/assets/images/home2/about-hero.jpg",
  servicesSkillsImage: "/assets/images/home2/skills-expertise.jpg",
  home2HeroSlides: [
  "/assets/images/home2/hero-1.jpg",
  "/assets/images/home2/hero-2.jpg",
  "/assets/images/home2/hero-3.jpg",
  "/assets/images/home2/hero-4.jpg",
],
  // One photo per project card in the Projects section. Crop your own
  // screenshots/photos to roughly 760x520 and drop them in at these same
  // filenames — nothing else needs to change.
  projectImages: {
    prisec: "/assets/images/projects/prisec.jpg",
    isla: "/assets/images/projects/isla.jpg",
    aacrs: "/assets/images/projects/aacrs.jpg",
    errinSra: "/assets/images/projects/errin-sra.jpg",
    itad: "/assets/images/projects/itad.jpg",
    aibTot: "/assets/images/projects/aib-tot.jpg",
    itcNes: "/assets/images/projects/itc-nes.jpg",
    tvCampaign: "/assets/images/projects/tv-campaign.jpg",
    midtermEval: "/assets/images/projects/midterm-eval.jpg",
    daiSalam: "/assets/images/projects/dai-salam.jpg",
    mercyCorpsLma: "/assets/images/projects/mercy-corps-lma.jpg",
    etisalat: "/assets/images/projects/etisalat.jpg",
    iraraErin: "/assets/images/projects/irara-erin.jpg",
    gitr: "/assets/images/projects/gitr.jpg",
    gizShagerdi: "/assets/images/projects/giz-shagerdi.jpg",
  },
  // ACE's real logo (white text, for use on dark or photo backgrounds) and
  // the "support" partner-logos banner from ace.af. Both are placeholders —
  // ace.af's WordPress host isn't reachable from this build sandbox, so
  // these couldn't be downloaded automatically. Save the real files at
  // these exact paths/filenames and both will appear across the site with
  // no code changes:
  //   https://ace.af/wp-content/uploads/2018/05/ACE-Logo-Main-White-Text-100150.png
  //   https://ace.af/wp-content/uploads/2025/11/support-1024x366.png
  divisionImages: {
    khanagi: "/assets/images/divisions/khanagi.jpg",
    daftar: "/assets/images/divisions/daftar.jpg",
    webrand: "/assets/images/divisions/webrand.jpg",
  },
blogImages: {
  "measuring-what-matters": "/assets/images/blog/measuring-what-matters.jpg",
  "regulatory-reform-that-sticks": "/assets/images/blog/regulatory-reform-that-sticks.jpg",
  "vocational-training-real-jobs": "/assets/images/blog/vocational-training-real-jobs.jpg",
  "donor-compliance-without-slowdown": "/assets/images/blog/donor-compliance-without-slowdown.jpg",
  "small-business-afghanistan-growth": "/assets/images/blog/small-business-afghanistan-growth.jpg",
  "women-in-the-core-team": "/assets/images/blog/women-in-the-core-team.jpg",
},
  // Colour version for light backgrounds (the white one is invisible there).
  logoColor: "/assets/images/logo/ace-logo-color.png",
  unGlobalCompact: "/assets/images/un-global-compact.png",
  logoWhite: "/assets/images/logo/ace-logo-white.png",
  // Homepage hero slider (src/components/home/HeroSlider.tsx) — 3 rotating
  // background photos, roughly 1920x1080, ideally wide field/office/team
  // shots. Falls back to a plain gradient panel if a file is missing, so
  // the page never shows a broken image while these are still placeholders.
  heroSlides: [
    "/assets/images/hero/slide-1.jpg",
    "/assets/images/hero/slide-2.jpg",
    "/assets/images/hero/slide-3.jpg",
  ],
  // Homepage "About" split section (src/components/home/AboutSplit.tsx) —
  // same idea as aboutSmall/aboutLarge above but its own files, so swapping
  // one doesn't change the other page. Roughly 720x900 (small) / 640x480
  // overlapping inset (large).
  homeAboutSmall: "/assets/images/home/about-small.jpg",
  homeAboutLarge: "/assets/images/home/about-large.jpg",
  // Homepage stats panel (src/components/home/StatsStrip.tsx) — one wide
  // photo, roughly 1200x800.
  homeStats: "/assets/images/home/stats.jpg",
  // Homepage testimonials section (src/components/home/TestimonialsSection.tsx)
  // — one photo, roughly 900x1100 (portrait), a meeting/field-visit shot.
  homeTestimonial: "/assets/images/home/testimonial.jpg",

  // --- Home-02 (Rovix-style variant, /home-02) ---
  // Separate image set so swapping these never touches the main homepage.
  // Hero background, roughly 1600x1200.
  home2Hero: "/assets/images/home2/hero.jpg",
  // About split: large photo (~700x850) + small circular inset (~360x360).
  home2AboutLarge: "/assets/images/home2/about-large.jpg",
  home2AboutSmall: "/assets/images/home2/about-small.jpg",
  // "Why trust us" section: one portrait photo, roughly 700x900.
  home2WhyChoose: "/assets/images/home2/why-choose.jpg",
  // "Client Feedback" (src/components/home2/Testimonials2.tsx) — one
  // fixed photo on the left, roughly 800x800 (square works best, it's
  // shown in a circle).
  home2Testimonial: "/assets/images/home2/testimonial.jpg",
  // "Meet the Team" (src/components/home2/Team2.tsx) — one photo per
  // person, roughly 600x800 (portrait). Names/roles live in Team2.tsx's
  // `team` array; add or remove entries there to match your real staff.
  home2Team: [
    "/assets/images/home2/team/member-1.jpg",
    "/assets/images/home2/team/member-2.jpg",
    "/assets/images/home2/team/member-3.jpg",
    "/assets/images/home2/team/member-4.jpg",
    "/assets/images/home2/team/member-5.jpg",
    "/assets/images/home2/team/member-6.jpg",
  ],
  // Footer2's "Our Gallery" strip (src/components/home2/Footer2.tsx) —
  // four small photos, roughly 300x220 each, landscape.
  home2FooterGallery: [
    "/assets/images/home2/gallery/photo-1.jpg",
    "/assets/images/home2/gallery/photo-2.jpg",
    "/assets/images/home2/gallery/photo-3.jpg",
    "/assets/images/home2/gallery/photo-4.jpg",
  ],
  projectsHero: "/assets/images/home2/projects-hero.jpg",
  galleryHero: "/assets/images/home2/gallery-hero.jpg",
  // Career2.tsx intro photo (tilt + wipe-open animated treatment) — roughly
  // 700x750, portrait/square works best with the aspect-[4/4.3] frame.
  careerIntroImage: "/assets/images/home2/career-intro.jpg",
  // ContactForm2.tsx — photo to the left of the contact form, roughly
  // 700x900, portrait works best against the tall form column.
  contactFormImage: "/assets/images/home2/contact-form.jpg",
};
