"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import { HeroSection } from "./hero-section";
import { AboutSection } from "./about-section";
import { BackgroundSection } from "./background-section";
import { TransitionSection } from "./transition-section";
import { MiracleMindSection } from "./miraclemind-section";
import { TechStackSection } from "./tech-stack-section";
import { DemosSection } from "./demos-section";
import { CreativeSection } from "./creative-section";
import { CTASection } from "./cta-section";

function SectionDivider() {
  return (
    <div className="relative">
      <div
        className="mx-auto h-px w-full"
        style={{
          maxWidth: "80vw",
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)",
        }}
      />
    </div>
  );
}

export function ShowcasePage() {
  const scrollStops = useRef<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ready, setReady] = useState(false);

  // After mount, collect all scroll stops in DOM order
  useEffect(() => {
    scrollStops.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-stop]")
    );
    setReady(true);
  }, []);

  // Track which stop is closest to viewport center
  useEffect(() => {
    if (!ready) return;

    const handleScroll = () => {
      const stops = scrollStops.current;
      if (stops.length === 0) return;

      const viewCenter = window.innerHeight / 2;
      let closest = 0;
      let minDist = Infinity;

      stops.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - viewCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });

      setCurrentIndex(closest);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ready]);

  const scrollTo = useCallback((index: number) => {
    const el = scrollStops.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const elCenter = rect.top + rect.height / 2 + window.scrollY;
    // First timeline card (id starts with "timeline-card-0") sits a bit higher
    const offset = el.id === "timeline-card-0" ? 80 : 0;
    const target = elCenter - window.innerHeight / 2 - offset;
    window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, []);

  const goUp = useCallback(() => {
    if (currentIndex > 0) scrollTo(currentIndex - 1);
  }, [currentIndex, scrollTo]);

  const goDown = useCallback(() => {
    if (currentIndex < scrollStops.current.length - 1)
      scrollTo(currentIndex + 1);
  }, [currentIndex, scrollTo]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goUp();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goDown();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goUp, goDown]);

  const isFirst = currentIndex === 0;
  const isLast =
    scrollStops.current.length > 0 &&
    currentIndex === scrollStops.current.length - 1;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-5 left-5 z-50 flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      {/* Fixed scroll arrows */}
      {!isFirst && (
        <button
          onClick={goUp}
          className="fixed top-6 left-1/2 z-40 flex min-h-[44px] min-w-[44px] -translate-x-1/2 animate-bounce items-center justify-center text-white/30 transition-colors hover:text-white/60"
          aria-label="Previous section"
        >
          <ChevronUp className="h-8 w-8" />
        </button>
      )}
      {!isLast && (
        <button
          onClick={goDown}
          className="fixed bottom-6 left-1/2 z-40 flex min-h-[44px] min-w-[44px] -translate-x-1/2 animate-bounce items-center justify-center text-white/30 transition-colors hover:text-white/60"
          aria-label="Next section"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      )}

      {/* Sections */}
      <div data-scroll-stop>
        <HeroSection />
      </div>
      <SectionDivider />
      <div data-scroll-stop>
        <AboutSection />
      </div>
      <SectionDivider />
      {/* BackgroundSection has data-scroll-stop on each timeline card internally */}
      <BackgroundSection />
      <div data-scroll-stop>
        <TransitionSection />
      </div>
      <SectionDivider />
      <div data-scroll-stop>
        <MiracleMindSection />
      </div>
      <SectionDivider />
      <div data-scroll-stop>
        <TechStackSection />
      </div>
      <SectionDivider />
      <div id="demos" data-scroll-stop>
        <DemosSection />
      </div>
      <SectionDivider />
      <div id="creative" data-scroll-stop>
        <CreativeSection />
      </div>
      <div data-scroll-stop>
        <CTASection />
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-white/20">
        &copy; {new Date().getFullYear()} Matthew Miceli / MiracleMind
      </footer>
    </div>
  );
}
