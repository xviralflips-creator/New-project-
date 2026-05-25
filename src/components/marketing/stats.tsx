"use client";
import { motion } from "framer-motion";

const STATS: { v: string; k: string; s?: string }[] = [
  { v: "120k+", k: "Apps generated", s: "since launch" },
  { v: "98%", k: "Build success rate", s: "first try" },
  { v: "<8s", k: "Median generation", s: "p50 latency" },
  { v: "200+", k: "Templates", s: "ready to fork" },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="card p-6"
          >
            <p className="font-display text-3xl sm:text-4xl heading-grad">
              {s.v}
            </p>
            <p className="mt-1 text-sm text-fg">{s.k}</p>
            {s.s && <p className="text-xs text-fg-subtle">{s.s}</p>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
