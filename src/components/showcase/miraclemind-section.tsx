"use client";

import { useEffect, useRef, useState } from "react";
import {
  Users,
  BarChart3,
  Kanban,
  Map,
  LayoutDashboard,
  Plug,
  Building2,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const WHO_WE_SERVE = [
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Community-First Organizations",
    description:
      "Land trusts, eco-villages, and community groups that need real infrastructure -- not off-the-shelf templates they can't modify.",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Mission-Driven Builders",
    description:
      "Early-stage teams that need a technical co-builder who cares about their autonomy as much as their product.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Sovereign Builders",
    description:
      "Founders and teams who want to own their stack -- not rent it. We build systems you control, understand, and can grow without us.",
  },
];

const WHAT_WE_BUILD = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Client Portals & Dashboards",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    label: "Financial Management Systems",
  },
  { icon: <Users className="h-5 w-5" />, label: "CRM & Pipeline Tools" },
  { icon: <Kanban className="h-5 w-5" />, label: "Project Management" },
  { icon: <Map className="h-5 w-5" />, label: "Interactive Maps & Data Viz" },
  { icon: <Plug className="h-5 w-5" />, label: "AI Integrations" },
];

function useReveal(threshold = 0.15) {
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
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function MiracleMindSection() {
  const intro = useReveal();
  const serve = useReveal();
  const build = useReveal();

  return (
    <section className="relative px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Intro */}
        <div
          ref={intro.ref}
          className={`mx-auto mb-16 max-w-2xl text-center transition-all duration-700 ${
            intro.visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-white/60 sm:text-xl">
            At{" "}
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
            </span>
            , we build technology that empowers human sovereignty — custom
            systems for teams who refuse to be locked into platforms they
            outgrow.
          </p>
        </div>

        {/* Who We Serve */}
        <div ref={serve.ref} className="mb-20">
          <h3
            className={`mb-8 text-center font-[family-name:var(--font-quattrocento-sans)] text-sm font-semibold tracking-[0.15em] text-[#D4AF37]/70 transition-all duration-700 ${
              serve.visible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            WHO WE SERVE
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {WHO_WE_SERVE.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border p-6 transition-all duration-700 ${
                  serve.visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  borderColor: "rgba(212, 175, 55, 0.15)",
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                  }}
                >
                  <span className="text-[#D4AF37]">{item.icon}</span>
                </div>
                <h4 className="mb-2 text-base font-semibold text-white">
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed text-white/45">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Build */}
        <div ref={build.ref} className="mb-16">
          <h3
            className={`mb-8 text-center font-[family-name:var(--font-quattrocento-sans)] text-sm font-semibold tracking-[0.15em] text-[#D4AF37]/70 transition-all duration-700 ${
              build.visible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            WHAT WE BUILD
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {WHAT_WE_BUILD.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-700 ${
                  build.visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(212, 175, 55, 0.1)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <span className="text-[#D4AF37]/70">{item.icon}</span>
                <span className="text-sm text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
