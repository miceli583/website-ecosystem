"use client";

import Link from "next/link";
import { ArrowLeft, Mic, Clock, MessageSquare, ArrowRightLeft } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface SlidesTalkingTracksDemoProps {
  basePath?: string;
  backHref?: string;
}

const STATS = [
  { icon: MessageSquare, label: "Slides with Talking Points", value: "61" },
  { icon: Mic, label: "Presenter Tips", value: "61" },
  { icon: ArrowRightLeft, label: "Slide Transitions", value: "60" },
  { icon: Clock, label: "Estimated Duration", value: "~3 hrs" },
];

const SAMPLE_TRACKS = [
  {
    slide: 1,
    title: "Welcome & Introduction",
    preview: "Begin by welcoming participants and establishing a comfortable learning environment...",
  },
  {
    slide: 2,
    title: "Course Overview",
    preview: "Walk through the module structure and set expectations for the training session...",
  },
  {
    slide: 3,
    title: "Learning Objectives",
    preview: "Highlight the key competencies participants will develop by the end of this module...",
  },
];

export function SlidesTalkingTracksDemo({ backHref }: SlidesTalkingTracksDemoProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      {backHref && (
        <header
          className="border-b px-4 py-4 sm:px-6"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Slides Hub
            </Link>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
            }}
          >
            <Mic className="h-8 w-8" style={{ color: "#D4AF37" }} />
          </div>
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{
              fontFamily: "Quattrocento Sans, serif",
              letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Talking Tracks
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Presenter scripts and talking points for each slide, with transition
            cues and timing guidance for Module 1.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border p-4 text-center"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.2)",
                  background: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <Icon
                  className="mx-auto mb-2 h-5 w-5"
                  style={{ color: "#D4AF37" }}
                />
                <p
                  className="text-2xl font-bold"
                  style={{ color: "#D4AF37" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Sample Tracks */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Sample Talking Points
          </h2>
          <div className="space-y-4">
            {SAMPLE_TRACKS.map((track) => (
              <Card
                key={track.slide}
                className="overflow-hidden border-0 bg-white/5"
              >
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-black"
                      style={{ backgroundColor: "#D4AF37" }}
                    >
                      {track.slide}
                    </span>
                    <h3 className="font-semibold text-white">{track.title}</h3>
                  </div>
                  <p className="pl-11 text-sm leading-relaxed text-gray-400">
                    {track.preview}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Portal CTA */}
        <div
          className="rounded-xl border p-8 text-center"
          style={{
            borderColor: "rgba(212, 175, 55, 0.3)",
            background:
              "linear-gradient(135deg, rgba(246,230,193,0.05) 0%, rgba(212,175,55,0.08) 100%)",
          }}
        >
          <Mic className="mx-auto mb-4 h-8 w-8 text-gray-500" />
          <p className="mb-2 text-lg font-semibold text-white">
            Full Talking Tracks Available in the Portal
          </p>
          <p className="mx-auto max-w-md text-sm text-gray-500">
            The complete set of 61 presenter scripts with detailed talking
            points, transition cues, and timing notes is accessible through the
            client portal.
          </p>
        </div>
      </main>
    </div>
  );
}
