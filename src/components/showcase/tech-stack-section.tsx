"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "~/components/ui/badge";

const CATEGORIES = [
  {
    label: "Frontend",
    techs: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Radix UI",
      "shadcn/ui",
    ],
  },
  {
    label: "Backend",
    techs: ["Node.js", "tRPC", "Drizzle ORM", "PostgreSQL", "Supabase"],
  },
  {
    label: "Infrastructure",
    techs: ["Vercel", "GitHub Actions", "Cloudflare", "Docker"],
  },
  {
    label: "Integrations",
    techs: ["Stripe", "Mercury API", "Resend", "Mapbox GL", "Puppeteer"],
  },
  {
    label: "Visualization",
    techs: ["WebGL / GLSL", "Canvas API", "Mapbox", "HTML2Canvas", "jsPDF"],
  },
  {
    label: "Languages",
    techs: ["TypeScript", "Python", "GLSL", "SQL"],
  },
];

export function TechStackSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative px-6 py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-4xl">
        <h3
          className={`mb-4 text-center font-[family-name:var(--font-quattrocento-sans)] text-sm font-semibold tracking-[0.15em] text-[#D4AF37]/70 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          TECH STACK
        </h3>
        <p
          className={`mx-auto mb-12 max-w-xl text-center text-base text-white/50 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Everything below is actively used in production across the
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            <span style={{ fontWeight: 300 }}>MIRACLE</span>{" "}
            <span style={{ fontWeight: 700 }}>MIND</span>
          </span>{" "}
          ecosystem.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.label}
              className={`rounded-xl border p-5 transition-all duration-700 ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: "rgba(212, 175, 55, 0.1)",
                transitionDelay: `${(i + 1) * 100}ms`,
              }}
            >
              <h4 className="mb-3 text-xs font-semibold tracking-wider text-white/40">
                {cat.label.toUpperCase()}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.techs.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.05)] text-xs text-white/70"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
