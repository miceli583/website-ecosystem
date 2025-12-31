"use client";
import { Suspense } from "react";

import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";

export const dynamic = "force-dynamic";

function LiquidMorphPageContent() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-red-50 dark:from-pink-950 dark:via-rose-950 dark:to-red-950">
          {/* Liquid Blob Animations */}
          <div className="absolute inset-0">
            {/* Main Liquid Blob */}
            <div
              className="absolute top-1/4 left-1/4 h-96 w-96 bg-gradient-to-r from-pink-400 to-rose-500 opacity-60"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                filter: "blur(20px)",
                animation: "blob-morph 8s ease-in-out infinite alternate",
              }}
            ></div>

            {/* Secondary Blob */}
            <div
              className="absolute top-1/2 right-1/4 h-80 w-80 bg-gradient-to-r from-rose-400 to-pink-500 opacity-50"
              style={{
                borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%",
                filter: "blur(25px)",
                animation:
                  "blob-morph-reverse 10s ease-in-out infinite alternate",
              }}
            ></div>

            {/* Floating Small Blobs */}
            <div
              className="absolute top-1/6 right-1/3 h-32 w-32 bg-gradient-to-r from-red-400 to-rose-500 opacity-70"
              style={{
                borderRadius: "70% 30% 50% 50% / 40% 50% 60% 60%",
                filter: "blur(15px)",
                animation: "blob-float 6s ease-in-out infinite",
              }}
            ></div>

            <div
              className="absolute bottom-1/4 left-1/6 h-48 w-48 bg-gradient-to-r from-pink-500 to-red-400 opacity-60"
              style={{
                borderRadius: "40% 60% 30% 70% / 60% 40% 50% 50%",
                filter: "blur(30px)",
                animation: "blob-float-reverse 12s ease-in-out infinite",
              }}
            ></div>

            {/* Liquid Ripples */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-20 w-20 rounded-full border-4 border-pink-400/30"
                style={{ animation: "ripple 3s ease-out infinite" }}
              ></div>
              <div
                className="absolute h-40 w-40 rounded-full border-2 border-rose-400/20"
                style={{ animation: "ripple 3s ease-out infinite 1s" }}
              ></div>
              <div
                className="absolute h-60 w-60 rounded-full border border-red-400/10"
                style={{ animation: "ripple 3s ease-out infinite 2s" }}
              ></div>
            </div>

            {/* Floating Liquid Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-4 bg-gradient-to-r from-pink-400 to-rose-500 opacity-70"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  borderRadius: "50% 40% 60% 30%",
                  filter: "blur(2px)",
                  animation: `particle-float ${4 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex min-h-full flex-col items-center justify-center p-8 text-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-5xl font-bold text-transparent">
                Liquid Morph
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Fluid blob animations with organic morphing shapes and ripple
                effects
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <div className="rounded-full border border-pink-200 bg-pink-100/80 px-6 py-3 text-pink-800 backdrop-blur-sm dark:border-pink-700 dark:bg-pink-900/30 dark:text-pink-200">
                  Organic Shapes
                </div>
                <div className="rounded-full border border-rose-200 bg-rose-100/80 px-6 py-3 text-rose-800 backdrop-blur-sm dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200">
                  Morphing Animation
                </div>
                <div className="rounded-full border border-red-200 bg-red-100/80 px-6 py-3 text-red-800 backdrop-blur-sm dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
                  Liquid Effects
                </div>
              </div>
            </div>
          </div>

          {/* Custom Animations */}
          <style jsx>{`
            @keyframes blob-morph {
              0% {
                border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                transform: translate(0px, 0px) rotate(0deg) scale(1);
              }
              25% {
                border-radius: 40% 60% 50% 50% / 70% 50% 60% 40%;
                transform: translate(20px, -20px) rotate(90deg) scale(1.1);
              }
              50% {
                border-radius: 70% 30% 60% 40% / 40% 70% 30% 60%;
                transform: translate(-10px, 10px) rotate(180deg) scale(0.9);
              }
              75% {
                border-radius: 30% 70% 40% 60% / 50% 40% 70% 30%;
                transform: translate(-20px, -10px) rotate(270deg) scale(1.05);
              }
              100% {
                border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                transform: translate(0px, 0px) rotate(360deg) scale(1);
              }
            }

            @keyframes blob-morph-reverse {
              0% {
                border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                transform: translate(0px, 0px) scale(1);
              }
              50% {
                border-radius: 60% 40% 30% 70% / 70% 40% 60% 30%;
                transform: translate(15px, -15px) scale(1.2);
              }
              100% {
                border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                transform: translate(0px, 0px) scale(1);
              }
            }

            @keyframes blob-float {
              0%,
              100% {
                transform: translateY(0px) translateX(0px);
                border-radius: 70% 30% 50% 50% / 40% 50% 60% 60%;
              }
              25% {
                transform: translateY(-20px) translateX(10px);
                border-radius: 50% 50% 70% 30% / 60% 40% 50% 60%;
              }
              75% {
                transform: translateY(10px) translateX(-5px);
                border-radius: 30% 70% 40% 60% / 50% 60% 40% 50%;
              }
            }

            @keyframes blob-float-reverse {
              0%,
              100% {
                transform: translateY(0px) translateX(0px) rotate(0deg);
                border-radius: 40% 60% 30% 70% / 60% 40% 50% 50%;
              }
              33% {
                transform: translateY(15px) translateX(-10px) rotate(120deg);
                border-radius: 60% 40% 70% 30% / 40% 60% 30% 70%;
              }
              66% {
                transform: translateY(-10px) translateX(15px) rotate(240deg);
                border-radius: 30% 70% 50% 50% / 70% 30% 60% 40%;
              }
            }

            @keyframes ripple {
              0% {
                transform: scale(0);
                opacity: 1;
              }
              100% {
                transform: scale(4);
                opacity: 0;
              }
            }

            @keyframes particle-float {
              0%,
              100% {
                transform: translateY(0px) translateX(0px);
                border-radius: 50% 40% 60% 30%;
              }
              25% {
                transform: translateY(-15px) translateX(10px);
                border-radius: 40% 60% 30% 70%;
              }
              75% {
                transform: translateY(10px) translateX(-5px);
                border-radius: 60% 30% 70% 40%;
              }
            }
          `}</style>
        </div>
      </PlaygroundLayout>
    </DomainLayout>
  );
}

export default function LiquidMorphPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LiquidMorphPageContent />
    </Suspense>
  );
}
