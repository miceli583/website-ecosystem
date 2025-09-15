"use client";

import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";

export default function AuroraGlowPage() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
          {/* Aurora Background Layers */}
          <div className="absolute inset-0">
            {/* Base Aurora Layer */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-500/30 to-purple-600/20"
              style={{
                filter: "blur(40px)",
                animation: "aurora-wave 8s ease-in-out infinite alternate",
              }}
            ></div>

            {/* Secondary Aurora Layer */}
            <div
              className="absolute inset-0 scale-110 transform bg-gradient-to-r from-emerald-500/15 via-cyan-400/25 to-blue-600/20"
              style={{
                filter: "blur(60px)",
                animation:
                  "aurora-wave 12s ease-in-out infinite alternate-reverse",
              }}
            ></div>

            {/* Tertiary Aurora Layer */}
            <div
              className="absolute inset-0 scale-125 transform bg-gradient-to-r from-teal-400/10 via-green-500/20 to-emerald-600/15"
              style={{
                filter: "blur(80px)",
                animation: "aurora-wave 16s ease-in-out infinite",
              }}
            ></div>

            {/* Shimmer Effects */}
            <div className="absolute top-0 left-0 h-1/3 w-full">
              <div
                className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
                style={{
                  animation: "shimmer 3s ease-in-out infinite",
                }}
              ></div>
            </div>

            <div className="absolute bottom-0 left-0 h-1/4 w-full">
              <div
                className="h-full w-full bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
                style={{
                  animation: "shimmer 4s ease-in-out infinite reverse",
                }}
              ></div>
            </div>

            {/* Floating Light Particles */}
            <div className="absolute top-1/4 left-1/6 h-2 w-2 animate-ping rounded-full bg-green-400"></div>
            <div
              className="absolute top-1/3 right-1/4 h-1 w-1 rounded-full bg-cyan-400"
              style={{ animation: "float-particle 6s ease-in-out infinite" }}
            ></div>
            <div
              className="absolute top-2/3 left-1/3 h-3 w-3 rounded-full bg-blue-400 opacity-70"
              style={{
                animation: "float-particle 8s ease-in-out infinite reverse",
              }}
            ></div>
            <div className="absolute top-1/2 right-1/6 h-1 w-1 animate-pulse rounded-full bg-emerald-400"></div>
            <div
              className="absolute bottom-1/4 left-1/2 h-2 w-2 rounded-full bg-teal-400"
              style={{ animation: "float-particle 10s ease-in-out infinite" }}
            ></div>
          </div>

          {/* Stars */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 animate-pulse rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex min-h-full flex-col items-center justify-center p-8 text-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="bg-gradient-to-r from-green-300 via-cyan-300 to-blue-300 bg-clip-text text-5xl font-bold text-transparent text-white">
                Aurora Glow
              </h1>
              <p className="text-xl text-gray-300">
                Northern lights effect with shimmering layers and floating light
                particles
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <div className="rounded-full border border-green-400/30 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  Layered Gradients
                </div>
                <div className="rounded-full border border-cyan-400/30 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  Blur Effects
                </div>
                <div className="rounded-full border border-blue-400/30 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  Particle System
                </div>
              </div>
            </div>
          </div>

          {/* Custom Animations */}
          <style jsx>{`
            @keyframes aurora-wave {
              0% {
                transform: translateX(-10%) translateY(-5%) rotate(-1deg);
                opacity: 0.7;
              }
              25% {
                transform: translateX(5%) translateY(-10%) rotate(1deg);
                opacity: 0.8;
              }
              50% {
                transform: translateX(-5%) translateY(5%) rotate(-0.5deg);
                opacity: 0.9;
              }
              75% {
                transform: translateX(10%) translateY(-2%) rotate(0.5deg);
                opacity: 0.8;
              }
              100% {
                transform: translateX(-10%) translateY(-5%) rotate(-1deg);
                opacity: 0.7;
              }
            }

            @keyframes shimmer {
              0%,
              100% {
                transform: translateX(-100%);
              }
              50% {
                transform: translateX(100%);
              }
            }

            @keyframes float-particle {
              0%,
              100% {
                transform: translateY(0px) translateX(0px);
                opacity: 0.6;
              }
              25% {
                transform: translateY(-20px) translateX(10px);
                opacity: 1;
              }
              75% {
                transform: translateY(10px) translateX(-5px);
                opacity: 0.8;
              }
            }
          `}</style>
        </div>
      </PlaygroundLayout>
    </DomainLayout>
  );
}
