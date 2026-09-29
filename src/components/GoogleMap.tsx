import { Reveal } from "./motion/Reveal";

/**
 * Uses the key-free Google Maps embed URL (maps.google.com/maps?...&output=
 * embed) rather than the newer Maps Embed API, which requires a billing-
 * enabled API key. No API key needed for this to work.
 *
 * Currently centred on a text search for "Afghanistan Center for
 * Excellence, Kabul, Afghanistan" since no exact street address was
 * available. Once you have ACE's real office address, replace the `q`
 * value below for a precise pin.
 */
export default function GoogleMap() {
  const query = encodeURIComponent(
    "Afghanistan Center for Excellence, Kabul, Afghanistan"
  );

  return (
    <Reveal delay={0.1}>
      <div className="overflow-hidden rounded-2xl border border-black/10 shadow-[0_20px_60px_rgba(22,33,43,0.10)]">
        <iframe
          title="ACE office location"
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          width="100%"
          height="360"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Reveal>
  );
}
