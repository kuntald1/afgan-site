import { serviceDetails } from "../../content";
import { assets } from "../../assets";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * useServicePillars — the four service pillars (Assess / Transform /
 * Empower / Comply) with every field overridable from the admin panel
 * (page="Services", keys "services.<pillar>.*").
 *
 * Shared by ServicesDetail2 (the /home-02/services page) and Services2 (the
 * homepage pillar cards), so one admin edit updates both places.
 *
 * content.ts's serviceDetails stays the fallback AND the source of the
 * structure: the number of pillars and the number of items per pillar come
 * from there. serviceDetails is a module-level constant, so the loops below
 * always call the hooks in the same order (rules of hooks are satisfied).
 */
const IMAGES: Record<string, string> = {
  assess: assets.serviceAssess,
  transform: assets.serviceTransform,
  empower: assets.serviceEmpower,
  comply: assets.serviceComply,
};

export function useServicePillars() {
  return serviceDetails.map((p) => {
    const base = `services.${p.key}`;
    const title = useDynamicContent(`${base}.title`, p.title);
    const intro1 = useDynamicContent(`${base}.intro_1`, p.intro[0] ?? "");
    const intro2 = useDynamicContent(`${base}.intro_2`, p.intro[1] ?? "");
    const image = resolveMediaUrl(useDynamicContent(`${base}.image`, IMAGES[p.key] ?? ""));
    const items = p.items.map((item, i) => ({
      title: useDynamicContent(`${base}.item_${i + 1}_title`, item.title),
      body: useDynamicContent(`${base}.item_${i + 1}_body`, item.body),
    }));
    return {
      key: p.key,
      title,
      intro: [intro1, intro2].filter(Boolean),
      image,
      items,
    };
  });
}
