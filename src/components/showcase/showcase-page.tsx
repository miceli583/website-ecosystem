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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionCount = useRef(0);

  // Track which section is most visible
  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean) as HTMLDivElement[];
    sectionCount.current = els.length;

    const handleScroll = () => {
      const viewportMid = window.innerHeight / 2;
      let closest = 0;
      let minDist = Infinity;

      els.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        // Distance from element's top to viewport middle
        const dist = Math.abs(rect.top - viewportMid / 2);
        if (rect.top <= viewportMid && rect.bottom > 0 && dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });

      // If we're at the bottom of the page, select the last section
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 50
      ) {
        closest = els.length - 1;
      }

      setCurrentIndex(closest);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((index: number) => {
    const el = sectionRefs.current[index];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const goUp = useCallback(() => {
    if (currentIndex > 0) scrollTo(currentIndex - 1);
  }, [currentIndex, scrollTo]);

  const goDown = useCallback(() => {
    const total = sectionRefs.current.filter(Boolean).length;
    if (currentIndex < total - 1) scrollTo(currentIndex + 1);
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

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el;
  };

  const isFirst = currentIndex === 0;
  const isLast =
    currentIndex === sectionRefs.current.filter(Boolean).length - 1;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      {/* Fixed scroll arrows */}
      {!isFirst && (
        <button
          onClick={goUp}
          className="fixed top-6 left-1/2 z-40 -translate-x-1/2 animate-bounce text-white/30 transition-colors hover:text-white/60"
          aria-label="Previous section"
        >
          <ChevronUp className="h-8 w-8" />
        </button>
      )}
      {!isLast && (
        <button
          onClick={goDown}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-bounce text-white/30 transition-colors hover:text-white/60"
          aria-label="Next section"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      )}

      {/* Sections — normal flow, no wrappers */}
      <div ref={setRef(0)}>
        <HeroSection />
      </div>
      <SectionDivider />
      <div ref={setRef(1)}>
        <AboutSection />
      </div>
      <SectionDivider />
      <div ref={setRef(2)}>
        <BackgroundSection />
      </div>
      <div ref={setRef(3)}>
        <TransitionSection />
      </div>
      <SectionDivider />
      <div ref={setRef(4)}>
        <MiracleMindSection />
      </div>
      <SectionDivider />
      <div ref={setRef(5)}>
        <TechStackSection />
      </div>
      <SectionDivider />
      <div ref={setRef(6)}>
        <DemosSection />
      </div>
      <SectionDivider />
      <div ref={setRef(7)}>
        <CreativeSection />
      </div>
      <div ref={setRef(8)}>
        <CTASection />
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-white/20">
        &copy; {new Date().getFullYear()} Matthew Miceli / MiracleMind
      </footer>
    </div>
  );
}
