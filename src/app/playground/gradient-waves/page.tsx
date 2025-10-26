"use client";

import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";

export default function GradientOrbsPage() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="relative min-h-full overflow-hidden bg-black">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0">
            {/* Wave 1 */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30"></div>

            {/* Wave 2 */}
            <div
              className="absolute inset-0 scale-110 transform bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-purple-500/20"
              style={{
                animation: "wave-float 8s ease-in-out infinite alternate",
              }}
            ></div>

            {/* Wave 3 */}
            <div
              className="absolute inset-0 scale-125 transform bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-blue-500/15"
              style={{
                animation:
                  "wave-float 12s ease-in-out infinite alternate-reverse",
              }}
            ></div>

            {/* Floating Orbs */}
            <div className="absolute top-1/4 left-1/4 h-32 w-32 animate-bounce rounded-full bg-gradient-to-r from-violet-500 to-purple-600 opacity-50 blur-xl"></div>
            <div
              className="absolute top-3/4 right-1/4 h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 opacity-40 blur-xl"
              style={{ animation: "float-slow 6s ease-in-out infinite" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-pink-500 to-rose-600 opacity-30 blur-2xl"
              style={{
                animation: "float-slow 10s ease-in-out infinite reverse",
              }}
            ></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex min-h-full flex-col items-center justify-center p-8 text-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-5xl font-bold text-transparent text-white">
                Gradient Orbs
              </h1>
              <p className="text-xl text-gray-300">
                Flowing animated gradient orbs creating a mesmerizing background
                effect
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  CSS Gradients
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  Keyframe Animations
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  Blur Effects
                </div>
              </div>
            </div>
          </div>

          {/* Custom Animations */}
          <style jsx>{`
            @keyframes wave-float {
              0% {
                transform: translateY(0px) rotate(0deg) scale(1);
              }
              50% {
                transform: translateY(-20px) rotate(3deg) scale(1.05);
              }
              100% {
                transform: translateY(10px) rotate(-2deg) scale(0.95);
              }
            }

            @keyframes float-slow {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-30px);
              }
            }
          `}</style>
        </div>
      </PlaygroundLayout>
    </DomainLayout>
  );
}
