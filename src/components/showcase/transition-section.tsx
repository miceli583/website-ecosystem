"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function TransitionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* Background gradient shift */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)",
          opacity: visible ? 1 : 0,
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Opening line */}
        <p
          className={`mb-10 font-[family-name:var(--font-muli)] text-2xl font-light text-white/50 transition-all duration-1000 sm:text-3xl ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Then I asked a different question.
        </p>

        {/* Gold expanding line */}
        <div className="relative mx-auto mb-10 h-px w-full max-w-md overflow-hidden">
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 transition-all duration-[1500ms] ease-out"
            style={{
              width: visible ? "100%" : "0%",
              background:
                "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)",
              transitionDelay: "400ms",
            }}
          />
        </div>

        {/* Orbit Star logo */}
        <div
          className={`mx-auto mb-8 transition-all duration-[1500ms] ${
            visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <Image
            src="/brand/miracle-mind-orbit-star-v3.svg"
            alt="MiracleMind"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Founding statement */}
        <h2
          className={`mb-6 font-[family-name:var(--font-quattrocento-sans)] text-3xl font-bold tracking-[0.06em] transition-all duration-1000 sm:text-4xl md:text-5xl ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transitionDelay: "800ms",
          }}
        >
          In 2025, I founded Miracle Mind.
        </h2>

        {/* Narrative */}
        <p
          className={`text-base leading-relaxed text-white/50 transition-all duration-1000 sm:text-lg ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          Not to build another agency -- but to build the kind of technology
          that mission-driven organizations actually need. Custom systems, real
          infrastructure, built from the ground up for teams doing work that
          matters.
        </p>
      </div>
    </section>
  );
}
