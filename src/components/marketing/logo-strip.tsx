export function LogoStrip() {
  const logos = [
    "Lumen",
    "Northflow",
    "Vantage",
    "Halcyon",
    "Aperture",
    "Cobalt",
    "Stratum",
  ];
  return (
    <section className="border-y border-border bg-bg-soft/30">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-fg-subtle">
          Trusted by makers and teams worldwide
        </p>
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-7 gap-6 items-center">
          {logos.map((l) => (
            <span
              key={l}
              className="text-center font-display text-base font-semibold text-fg-muted/70"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
