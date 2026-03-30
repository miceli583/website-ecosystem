"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, Satellite, Code2, HandshakeIcon } from "lucide-react";

interface TimelineEntry {
  type: "education" | "work";
  icon: React.ReactNode;
  title: string;
  secondTitle?: { icon: React.ReactNode; title: string };
  organization: string;
  years: string;
  description: React.ReactNode;
  /** Negative margin to visually overlap with the previous card (e.g. "md:-mt-40") */
  overlapClass?: string;
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
    description: (
      <>
        I completed dual degrees in <u>Mechanical Engineering</u> and{" "}
        <u>Computer Science</u> — building a foundation that bridges the
        physical and digital sides of engineering. Coursework spanned{" "}
        <u>System Dynamics & Modeling</u>, <u>Machine Design</u>,{" "}
        <u>Physical Simulations</u>, <u>Programming Languages</u>,{" "}
        <u>Optimization</u>, and <u>Data Structures & Algorithm Analysis</u>.
        <br />
        <br />I also served as a <u>Teaching Assistant for Machine Design</u>,
        mentoring 150+ students — developing curriculum, delivering lectures,
        and working one-on-one on problem-solving and design optimization.
        <br />
        <br />
        For my capstone, I designed and built a{" "}
        <u>3D-printed aerial survey drone</u> that could identify structural
        defects and record their geolocation and dimensions — with{" "}
        <u>20-minute flight time</u>, <u>1-mile range</u>, and{" "}
        <u>image recognition AI</u> trained on a custom dataset.
      </>
    ),
  },
  {
    type: "work",
    icon: <Satellite className="h-5 w-5" />,
    title: "Associate Test Engineer",
    organization: "Globalstar",
    years: "2020 — 2021",
    overlapClass: "md:-mt-64",
    description: (
      <>
        My first industry role put me at the <u>hardware-software boundary</u>{" "}
        of satellite communication systems — designing and executing{" "}
        <u>comprehensive test frameworks</u> for IoT devices, building{" "}
        <u>automated test pipelines</u>, and interfacing directly with{" "}
        <u>embedded systems</u> during device validation. This is where I first
        learned the discipline of building for environments where failure
        isn&apos;t an option.
        <br />
        <br />I led <u>cross-functional test plan reviews</u> across
        engineering, operations, and QA, and authored{" "}
        <u>technical specifications</u> and <u>QA documentation</u> for hardware
        validation.
        <br />
        <br />I also ran <u>performance analysis</u> to catch system issues
        early and built <u>troubleshooting workflows</u> for recurring problems
        — habits of rigorous validation I carry into everything I build.
      </>
    ),
  },
  {
    type: "education",
    icon: <GraduationCap className="h-5 w-5" />,
    title: "MS, Robotics & Autonomous Systems",
    organization: "Boston University",
    years: "2021 — 2022",
    overlapClass: "md:-mt-24",
    description: (
      <>
        I went deeper into <u>perception</u>, <u>control systems</u>, and{" "}
        <u>human-robot interaction</u>. Coursework spanned{" "}
        <u>Robotic Motion Planning</u>, <u>Machine Learning</u>,{" "}
        <u>Cyber-Physical Systems</u>, and <u>Soft Robotics</u> — reinforcing my
        ability to work at the intersection of hardware and software, and
        deepening my instinct for thinking in systems.
        <br />
        <br />
        In one of my favorite projects, I built a{" "}
        <u>drone control application</u> — a mobile web app hosted on a Flask
        server that allowed remote control of an aerial drone. The system
        included a <u>live video feed</u> and control link using Python socket
        programming, custom <u>control algorithms</u>, and an{" "}
        <u>autonomous face tracker</u> built with OpenCV.
      </>
    ),
  },
  {
    type: "work",
    icon: <Code2 className="h-5 w-5" />,
    title: "Application Support Engineer",
    organization: "MathWorks",
    years: "2021 — 2023",
    overlapClass: "md:-mt-56",
    description: (
      <>
        I provided real-time <u>technical support</u> for clients across{" "}
        <u>Control Design</u>, <u>Signal Processing</u>, and <u>Robotics</u> —
        diagnosing complex, cross-domain issues daily and translating deep
        technical problems into clear, actionable solutions. This role sharpened
        my ability to understand someone else&apos;s system fast and communicate
        across expertise levels.
        <br />
        <br />
        On the R&amp;D side, I trained an <u>AI-driven quadcopter</u> to perform
        acrobatics in simulation using the <u>DAgger</u> iterative policy
        algorithm, a <u>visual-inertial state estimator</u> for camera and IMU
        data, <u>minimum-jerk trajectory generation</u>, and{" "}
        <u>3D occupancy mapping</u>. I also built a{" "}
        <u>collision-aware robotic arm controller</u> integrating MATLAB with
        third-party mapping tools for real-time{" "}
        <u>cross-platform coordination</u>.
      </>
    ),
  },
  {
    type: "work",
    icon: <HandshakeIcon className="h-5 w-5" />,
    title: "Sales Associate",
    organization: "Kelly Services",
    years: "2024 — 2025",
    overlapClass: "md:-mt-32",
    description: (
      <>
        A sharp pivot — I moved into high-ticket <u>B2C sales</u> as part of a
        nationwide roadshow program. Consistently <u>top-ranked nationally</u>,
        averaging <u>$20,000+</u> in sales per 10-day roadshow and closing over{" "}
        <u>$120,000</u> in five months using <u>values-based selling</u>.
        <br />
        <br />I delivered product demonstrations to hundreds of prospects daily,
        building trust through genuine connection. Sharpened my skills in{" "}
        <u>deep listening</u>, <u>identifying real needs</u>, and{" "}
        <u>delivering solutions that actually fit</u> — selling through
        understanding, not pressure.
      </>
    ),
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
      id={`timeline-card-${index}`}
      data-scroll-stop
      className={`relative flex w-full items-start gap-0 transition-all duration-700 md:gap-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${isEven ? "md:flex-row" : "md:flex-row-reverse"} ${entry.overlapClass ?? ""}`}
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
          <div className="text-sm leading-relaxed text-white/70 [&_u]:decoration-[rgba(212,175,55,0.4)] [&_u]:underline-offset-2">
            {entry.description}
          </div>
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
          how systems work so I could build ones designed around people, not the
          other way around.
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
