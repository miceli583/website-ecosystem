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
  organization: string;
  years: string;
  description: string;
}

const TIMELINE: TimelineEntry[] = [
  {
    type: "education",
    icon: <GraduationCap className="h-5 w-5" />,
    title: "BSE, Mechanical Engineering",
    organization: "Louisiana State University",
    years: "2016 -- 2020",
    description:
      "Built a foundation in systems thinking, thermodynamics, and physical design. Learned how to break complex problems into solvable pieces -- a skill that translates directly into software architecture.",
  },
  {
    type: "education",
    icon: <Code2 className="h-5 w-5" />,
    title: "BSE, Computer Science",
    organization: "Louisiana State University",
    years: "2016 -- 2020",
    description:
      "Dual-enrolled alongside mechanical engineering. Data structures, algorithms, operating systems, and software design. This is where I fell in love with building things people actually use.",
  },
  {
    type: "education",
    icon: <GraduationCap className="h-5 w-5" />,
    title: "MS, Robotics & Autonomous Systems",
    organization: "Boston University",
    years: "2019 -- 2022",
    description:
      "Graduate research in perception, control systems, and human-robot interaction. Reinforced my ability to work at the intersection of hardware and software -- and to think in systems, not silos.",
  },
  {
    type: "work",
    icon: <Satellite className="h-5 w-5" />,
    title: "Associate Test Engineer",
    organization: "Globalstar",
    years: "2020 -- 2021",
    description:
      "Tested satellite communication systems -- hardware integration, signal verification, and automated test frameworks. Learned the discipline of building for environments where failure isn't an option.",
  },
  {
    type: "work",
    icon: <Code2 className="h-5 w-5" />,
    title: "Application Support Engineer",
    organization: "MathWorks",
    years: "2021 -- 2023",
    description:
      "Technical support for MATLAB and Simulink -- debugging customer workflows, diagnosing complex issues across toolboxes, and translating deep technical problems into clear solutions. Sharpened my ability to understand someone else's system fast.",
  },
  {
    type: "work",
    icon: <HandshakeIcon className="h-5 w-5" />,
    title: "Sales Associate",
    organization: "Kelly Services",
    years: "2023",
    description:
      "High-ticket B2B sales and staffing solutions. Sounds different from engineering, but it taught me how businesses actually operate -- budgets, decision-makers, timelines, and the gap between what teams need and what they have.",
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
          <div className="mb-3 flex items-start gap-3">
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
              <p className="font-[family-name:var(--font-muli)] text-sm font-light text-white/60">
                {entry.organization}
              </p>
            </div>
          </div>
          <p className="mb-2 text-xs tracking-wider text-[#D4AF37]/70">
            {entry.years}
          </p>
          <p className="text-sm leading-relaxed text-white/50">
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
    <section className="relative px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        {/* Section intro */}
        <p className="mb-12 text-center text-lg text-white/60 sm:mb-16 sm:text-xl">
          Before I founded MiracleMind, I spent years building a foundation
          across engineering, software, and business. Here&apos;s the path that
          shaped how I think about systems.
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
