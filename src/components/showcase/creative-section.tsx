"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Circle,
  Hexagon,
  Star,
  Zap,
  Waves,
  Atom,
  Triangle,
} from "lucide-react";

const HIGHLIGHTS = [
  {
    title: "Orbit Star",
    href: "/showcase/creative/orbit-star",
    icon: <Star className="h-4 w-4" />,
    type: "shader",
  },
  {
    title: "Flower of Life",
    href: "/showcase/creative/flower-of-life",
    icon: <Hexagon className="h-4 w-4" />,
    type: "shader",
  },
  {
    title: "Neural Network",
    href: "/showcase/creative/neural-net",
    icon: <Atom className="h-4 w-4" />,
    type: "shader",
  },
  {
    title: "North Star",
    href: "/showcase/creative/north-star",
    icon: <Triangle className="h-4 w-4" />,
    type: "shader",
  },
  {
    title: "Particle Field",
    href: "/showcase/creative/particle-field",
    icon: <Sparkles className="h-4 w-4" />,
    type: "animation",
  },
  {
    title: "Gradient Orbs",
    href: "/showcase/creative/gradient-waves",
    icon: <Circle className="h-4 w-4" />,
    type: "animation",
  },
  {
    title: "Liquid Morph",
    href: "/showcase/creative/liquid-morph",
    icon: <Waves className="h-4 w-4" />,
    type: "animation",
  },
  {
    title: "Quantum Orbital",
    href: "/showcase/creative/quantum-orbital",
    icon: <Zap className="h-4 w-4" />,
    type: "animation",
  },
];

export function CreativeSection() {
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
          BONUS: CREATIVE EXPLORATION
        </h3>
        <p
          className={`mx-auto mb-10 max-w-xl text-center text-base text-white/50 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Beyond backend systems, I explore visual programming -- GLSL shaders,
          particle systems, and interactive animations.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HIGHLIGHTS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              className={`group rounded-xl border p-4 text-center transition-all duration-700 hover:border-[rgba(212,175,55,0.3)] hover:bg-white/[0.04] ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: "rgba(212, 175, 55, 0.1)",
                transitionDelay: `${(i + 1) * 80}ms`,
              }}
            >
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-[#D4AF37]/50 transition-colors group-hover:text-[#D4AF37]">
                {item.icon}
              </div>
              <p className="text-xs font-medium text-white/60 group-hover:text-white/80">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-white/25">
                {item.type === "shader" ? "GLSL" : "CSS/Canvas"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
