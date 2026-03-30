"use client";

import { useEffect, useRef, useState } from "react";

export function AboutSection() {
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
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <div ref={ref} className="mx-auto max-w-2xl space-y-8 text-center">
        <p
          className={`text-lg leading-relaxed text-white/80 transition-all duration-700 sm:text-xl ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          I&apos;m a digital architect &amp; integrations specialist —
          transforming vision into reality through the integration of diverse
          disciplines. My path has taken me through robotics research, satellite
          testing, software development, and high-ticket sales.
        </p>
        <p
          className={`text-lg leading-relaxed text-white/80 transition-all duration-700 sm:text-xl ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          This breadth has shaped my approach: I thrive in the spaces between
          fields, connecting engineering with business, technology with
          creativity, individual insight with collective impact. I illuminate
          unseen patterns and design systems that honor each part within the
          greater whole.
        </p>
        <p
          className={`text-lg leading-relaxed text-white/80 transition-all duration-700 sm:text-xl ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          Today, I apply this integrative thinking alongside deep technical
          expertise in AI-driven development, creating full-stack applications
          and solutions that strengthen human connection and coherence.
        </p>
      </div>
    </section>
  );
}
