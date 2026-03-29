"use client";

import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Satellite,
  Code2,
  HandshakeIcon,
} from "lucide-react";

interface TimelineEntry {
  type: "education" | "work";
  icon: React.ReactNode;
  title: string;
  secondTitle?: { icon: React.ReactNode; title: string };
  organization: string;
  years: string;
  description: string;
}

const TIMELINE: TimelineEntry[] = [
  {
    type: "education",
    icon: <GraduationCap className="h-5 w-5" />,
    title: "BSE, Mechanical Engineering",
    secondTitle: {
      icon: <Code2 className="h-5 w-5" />,
      title: "BSE, Computer Science",
    },
    organization: "Louisiana State University",
    years: "2016 — 2020",
    description:
      "Dual-enrolled across both disciplines simultaneously — an unusual path that shaped how I think about building. On the mechanical side: thermodynamics, control systems, materials science, and physical design. On the software side: data structures, algorithms, operating systems, and software architecture. The combination taught me to see problems as systems — interconnected, layered, and solvable when you understand the pieces. This is where I learned to bridge the physical and digital, and fell in love with building things people actually use.",
  },
  {
    type: "education",
    icon: <GraduationCap className="h-5 w-5" />,
    title: "MS, Robotics & Autonomous Systems",
    organization: "Boston University",
    years: "2019 -- 2022",
    description:
      "Graduate research in perception, control systems, and human-robot interaction. Worked on autonomous navigation, sensor fusion, and real-time decision-making — systems where latency and precision matter. Reinforced my ability to work at the intersection of hardware and software, and deepened my instinct for thinking in systems rather than silos.",
  },
  {
    type: "work",
    icon: <Satellite className="h-5 w-5" />,
    title: "Associate Test Engineer",
    organization: "Globalstar",
    years: "2020 -- 2021",
    description:
      "Tested satellite communication systems at the hardware-software boundary — signal verification, integration testing, and building automated test frameworks for mission-critical infrastructure. Learned the discipline of building for environments where failure isn't an option, and the importance of rigorous validation before anything goes live.",
  },
  {
    type: "work",
    icon: <Code2 className="h-5 w-5" />,
    title: "Application Support Engineer",
    organization: "MathWorks",
    years: "2021 -- 2023",
    description:
      "Technical support for MATLAB and Simulink — debugging customer workflows across signal processing, control systems, and simulation toolboxes. Diagnosed complex, cross-domain issues daily and translated deep technical problems into clear, actionable solutions. Sharpened my ability to understand someone else's system fast and communicate across expertise levels.",
  },
  {
    type: "work",
    icon: <HandshakeIcon className="h-5 w-5" />,
    title: "Sales Associate",
    organization: "Kelly Services",
    years: "2023",
    description:
      "High-ticket B2B sales and staffing solutions. Sounds different from engineering, but it taught me how businesses actually operate — budgets, decision-makers, timelines, and the gap between what teams need and what they have. Understanding the business side of technology is what lets me build systems that actually get adopted, not just deployed.",
  },
];

function TimelineCard({
  entry,
  index,
}: {
  entry: TimelineEntry;
  index: number;
}) {
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex w-full items-start gap-6 transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Card */}
      <div className="flex-1 md:w-[calc(50%-2rem)]">
        <div
          className="rounded-xl border p-5 backdrop-blur-md sm:p-6"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "rgba(212, 175, 55, 0.15)",
          }}
        >
          {/* Header */}
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                }}
              >
                <span className="text-[#D4AF37]">{entry.icon}</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white sm:text-lg">
                  {entry.title}
                </h3>
                {!entry.secondTitle && (
                  <p className="font-[family-name:var(--font-muli)] text-sm font-light text-white/60">
                    {entry.organization}
                  </p>
                )}
              </div>
            </div>
            {entry.secondTitle && (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                    }}
                  >
                    <span className="text-[#D4AF37]">
                      {entry.secondTitle.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white sm:text-lg">
                      {entry.secondTitle.title}
                    </h3>
                  </div>
                </div>
                <p className="font-[family-name:var(--font-muli)] text-sm font-light text-white/60">
                  {entry.organization}
                </p>
              </>
            )}
          </div>
          <p className="mb-2 text-xs tracking-wider text-[#D4AF37]/70">
            {entry.years}
          </p>
          <p className="text-sm leading-relaxed text-white/70">
            {entry.description}
          </p>
        </div>
      </div>

      {/* Timeline dot (hidden on mobile, visible on md+) */}
      <div className="hidden w-4 shrink-0 items-start justify-center pt-6 md:flex">
        <div className="h-3 w-3 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
      </div>

      {/* Spacer for the other side */}
      <div className="hidden flex-1 md:block" />
    </div>
  );
}

export function BackgroundSection() {
  return (
    <section className="relative px-6 pt-10 pb-20 sm:pt-14 sm:pb-28">
      <div className="mx-auto max-w-4xl">
        {/* Section intro */}
        <p className="mb-12 text-center text-lg text-white/80 sm:mb-16 sm:text-xl">
          Before I founded{" "}
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
          , I spent years across engineering, software, and business — learning
          how systems work so I could build ones worth owning.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical gold line (desktop only) */}
          <div
            className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(212,175,55,0.3) 10%, rgba(212,175,55,0.3) 90%, transparent)",
            }}
          />

          <div className="space-y-8 md:space-y-12">
            {TIMELINE.map((entry, i) => (
              <TimelineCard key={i} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
