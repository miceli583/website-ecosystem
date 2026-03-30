"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MapPin } from "lucide-react";

export function CTASection() {
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
    <section className="relative px-6 py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-lg">
        {/* Divider */}
        <div className="mb-16">
          <div
            className="mx-auto h-px w-full max-w-xs"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
            }}
          />
        </div>

        <div
          className={`text-center transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h3
            className="mb-4 font-[family-name:var(--font-quattrocento-sans)] text-2xl font-bold tracking-[0.06em] sm:text-3xl"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thanks for stopping by.
          </h3>
        </div>

        <div
          className={`flex flex-col items-center gap-4 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <a
            href="mailto:matthewmiceli@miraclemind.live"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm transition-colors hover:text-white"
            style={{ color: "#D4AF37" }}
          >
            <Mail className="h-4 w-4" />
            matthewmiceli@miraclemind.live
          </a>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <MapPin className="h-4 w-4" />
            Austin, TX
          </div>
        </div>
      </div>
    </section>
  );
}
