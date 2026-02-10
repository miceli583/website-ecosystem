"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, Sparkles, Zap } from "lucide-react";

const SHADERS = [
  {
    id: "north-star",
    title: "North Star",
    description: "Golden guiding beacon with radiant rays and pulsing energy",
    href: "/admin/shaders/north-star",
  },
  {
    id: "neural-net",
    title: "Neural Network",
    description: "Mesmerizing interconnected nodes pulsing with consciousness",
    href: "/admin/shaders/neural-net",
  },
  {
    id: "flower-of-life",
    title: "Flower of Life",
    description: "Sacred geometry with glowing circles and mystical energy",
    href: "/admin/shaders/flower-of-life",
  },
  {
    id: "fractal-pyramid",
    title: "Fractal Pyramid",
    description: "Raymarched fractal geometry with rotating transformations",
    href: "/admin/shaders/fractal-pyramid",
  },
  {
    id: "the-way",
    title: "The Way",
    description:
      "A journey through flowing light, spiraling paths, and infinite consciousness",
    href: "/admin/shaders/the-way",
  },
  {
    id: "metatrons-cube",
    title: "Metatron's Cube",
    description:
      "Sacred geometry containing all five Platonic solids and the blueprint of creation",
    href: "/admin/shaders/metatrons-cube",
  },
  {
    id: "icosahedron",
    title: "Icosahedron",
    description:
      "Floating 3D Platonic solid with 20 triangular faces, rotating in space",
    href: "/admin/shaders/icosahedron",
  },
];

function ShadersContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(246,230,193,0.15) 0%, rgba(212,175,55,0.25) 100%)",
            }}
          >
            <Zap className="h-5 w-5" style={{ color: "#D4AF37" }} />
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Quattrocento Sans', serif",
              letterSpacing: "0.08em",
              background:
                "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GLSL Shaders
          </h1>
        </div>
        <p className="text-sm text-white/50">
          WebGL shader animations powered by GLSL — each opens in a new tab
        </p>
      </div>

      {/* Shader Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SHADERS.map((shader) => (
          <Link key={shader.id} href={shader.href} target="_blank">
            <div
              className="group flex h-full cursor-pointer flex-col rounded-xl p-5 transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                  }}
                >
                  <Sparkles
                    className="h-4 w-4"
                    style={{ color: "#D4AF37" }}
                  />
                </div>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-white">
                {shader.title}
              </h3>
              <p className="mb-4 flex-1 text-xs leading-relaxed text-white/40">
                {shader.description}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ExternalLink
                  className="h-3 w-3"
                  style={{ color: "#D4AF37" }}
                />
                <span style={{ color: "#D4AF37" }}>Open Shader</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ShadersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ShadersContent />
    </Suspense>
  );
}
