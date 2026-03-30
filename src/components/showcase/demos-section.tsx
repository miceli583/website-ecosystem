"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Kanban,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

const DEMOS = [
  {
    title: "Interactive Map",
    description:
      "Geographic data visualization with incident markers, severity filtering, and route overlays.",
    icon: <LayoutDashboard className="h-6 w-6" />,
    href: "/showcase/map",
  },
  {
    title: "Financial Dashboard",
    description:
      "Revenue tracking, bank integrations, and infrastructure cost management.",
    icon: <DollarSign className="h-6 w-6" />,
    href: "/showcase/finance",
  },
  {
    title: "Project Management",
    description:
      "Drag-and-drop project boards for managing multi-phase initiatives.",
    icon: <Kanban className="h-6 w-6" />,
    href: "/showcase/projects",
  },
  {
    title: "CRM Pipeline",
    description:
      "Sales pipeline from lead to client. Drag contacts between stages.",
    icon: <Users className="h-6 w-6" />,
    href: "/showcase/crm",
  },
];

export function DemosSection() {
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
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative px-6 py-10 sm:py-16">
      <div ref={ref} className="mx-auto max-w-4xl">
        <h3
          className={`mb-2 text-center font-[family-name:var(--font-quattrocento-sans)] text-sm font-semibold tracking-[0.15em] text-[#D4AF37]/70 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          LIVE DEMOS
        </h3>
        <p
          className={`mx-auto mb-4 max-w-xl text-center text-base text-white/50 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Real components from systems I&apos;ve built. Click a card to explore.
        </p>

        {/* Data Disclaimer */}
        <p
          className={`mb-8 text-center text-[10px] text-white/25 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <ShieldCheck className="mr-1 inline h-3 w-3 text-[#D4AF37]/40" />
          All demos use fabricated data to protect client privacy.
        </p>

        {/* Demo Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {DEMOS.map((demo, i) => (
            <Link
              key={demo.href}
              href={demo.href}
              target="_blank"
              className={`group rounded-xl border p-6 transition-all duration-700 hover:border-[rgba(212,175,55,0.3)] hover:bg-white/[0.04] ${
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
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                  }}
                >
                  <span className="text-[#D4AF37]">{demo.icon}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#D4AF37]" />
              </div>
              <h4 className="mb-2 text-base font-semibold text-white">
                {demo.title}
              </h4>
              <p className="text-sm leading-relaxed text-white/45">
                {demo.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
