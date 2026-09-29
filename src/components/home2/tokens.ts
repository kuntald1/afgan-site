/** Shared type scale + easing for every Home-02 section, so headings and
 * motion can't drift apart between components. Matches the "What We
 * Offer" treatment. Kept in its own file (not alongside a component) so
 * React Fast Refresh stays happy. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const headingStyle = {
  fontFamily: "Urbanist, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(1.9rem, 4.2vw, 3rem)",
} as const;

export const bodyStyle = {
  fontFamily: "Urbanist, sans-serif",
  fontWeight: 500,
  fontSize: "18px",
} as const;
