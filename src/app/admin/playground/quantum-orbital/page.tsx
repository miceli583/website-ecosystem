"use client";
import { Suspense } from "react";

import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import { Zap, Atom, Orbit, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

function QuantumOrbitalPageContent() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-orange-900 via-red-900 to-purple-900">
          {/* Energy field background */}
          <div className="absolute inset-0">
            <div className="energy-field"></div>
            <div className="energy-rings">
              <div className="energy-ring energy-ring-1"></div>
              <div className="energy-ring energy-ring-2"></div>
              <div className="energy-ring energy-ring-3"></div>
            </div>
          </div>

          {/* Orbital System - Centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="orbit-center relative">
              <div className="relative">
                {/* Central core with pulsing effect */}
                <div className="core-container relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 shadow-2xl">
                    <Zap className="h-12 w-12 animate-pulse text-white" />
                  </div>
                  {/* Core energy glow */}
                  <div className="core-glow absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-30"></div>
                </div>

                {/* Multiple orbital rings with different particles */}
                {/* Shell 1 - Electrons */}
                <div className="orbit-particle electron electron-1"></div>
                <div className="orbit-particle electron electron-2"></div>
                <div className="orbit-particle electron electron-3"></div>

                {/* Shell 2 - Protons */}
                <div className="orbit-particle proton proton-1"></div>
                <div className="orbit-particle proton proton-2"></div>

                {/* Shell 3 - Neutrons */}
                <div className="orbit-particle neutron neutron-1"></div>
                <div className="orbit-particle neutron neutron-2"></div>
                <div className="orbit-particle neutron neutron-3"></div>

                {/* Shell 4 - Additional particles */}
                <div className="orbit-particle shell4 shell4-1"></div>
                <div className="orbit-particle shell4 shell4-2"></div>
                <div className="orbit-particle shell4 shell4-3"></div>

                {/* Shell 5 - Additional particles */}
                <div className="orbit-particle shell5 shell5-1"></div>
                <div className="orbit-particle shell5 shell5-2"></div>

                {/* Shell 6 - Additional particles */}
                <div className="orbit-particle shell6 shell6-1"></div>
                <div className="orbit-particle shell6 shell6-2"></div>
                <div className="orbit-particle shell6 shell6-3"></div>
                <div className="orbit-particle shell6 shell6-4"></div>

                {/* Shell 7 - Additional particles */}
                <div className="orbit-particle shell7 shell7-1"></div>
                <div className="orbit-particle shell7 shell7-2"></div>

                {/* Shell 8 - Additional particles */}
                <div className="orbit-particle shell8 shell8-1"></div>
                <div className="orbit-particle shell8 shell8-2"></div>
                <div className="orbit-particle shell8 shell8-3"></div>

                {/* Orbital paths (visible rings) */}
                <div className="orbit-path orbit-path-1"></div>
                <div className="orbit-path orbit-path-2"></div>
                <div className="orbit-path orbit-path-3"></div>
                <div className="orbit-path orbit-path-4"></div>
                <div className="orbit-path orbit-path-5"></div>
                <div className="orbit-path orbit-path-6"></div>
                <div className="orbit-path orbit-path-7"></div>
                <div className="orbit-path orbit-path-8"></div>
              </div>
            </div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex min-h-full flex-col items-center justify-end p-8 pb-16 text-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent">
                Quantum Orbital
              </h1>
              <p className="text-xl text-gray-300">
                Atomic orbital visualization with particles orbiting around a
                central core
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  <Atom className="h-4 w-4 text-blue-400" />8 Electron Shells
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  <Orbit className="h-4 w-4 text-red-400" />
                  Realistic Physics
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Energy Fields
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .energy-field {
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at center,
              rgba(249, 115, 22, 0.1) 0%,
              rgba(239, 68, 68, 0.05) 30%,
              transparent 70%
            );
            animation: energy-pulse 4s ease-in-out infinite;
          }

          @keyframes energy-pulse {
            0%,
            100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.1);
            }
          }

          .energy-rings {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .energy-ring {
            position: absolute;
            border-radius: 50%;
            border: 1px solid;
            animation: energy-ring-pulse linear infinite;
          }

          .energy-ring-1 {
            width: 140px;
            height: 140px;
            border-color: rgba(59, 130, 246, 0.3);
            animation-duration: 3s;
          }

          .energy-ring-2 {
            width: 200px;
            height: 200px;
            border-color: rgba(239, 68, 68, 0.3);
            animation-duration: 4s;
            animation-delay: 1s;
          }

          .energy-ring-3 {
            width: 260px;
            height: 260px;
            border-color: rgba(34, 197, 94, 0.3);
            animation-duration: 5s;
            animation-delay: 2s;
          }

          @keyframes energy-ring-pulse {
            0%,
            100% {
              opacity: 0.2;
              transform: scale(0.95);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.05);
            }
          }

          .orbit-center {
            position: relative;
          }

          .core-glow {
            animation: core-pulse 8s ease-in-out infinite;
          }

          @keyframes core-pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.3);
              opacity: 0.1;
            }
          }

          .orbit-particle {
            position: absolute;
            border-radius: 50%;
            box-shadow: 0 0 15px currentColor;
            top: 50%;
            left: 50%;
          }

          /* Electrons - Small, fast, blue */
          .electron {
            width: 8px;
            height: 8px;
            background: #3b82f6;
            margin-left: -4px;
            margin-top: -4px;
          }

          .electron-1 {
            animation: orbit-electron 4s linear infinite;
            animation-delay: 0s;
          }

          .electron-2 {
            animation: orbit-electron 4s linear infinite;
            animation-delay: -1.33s; /* 120 degrees */
          }

          .electron-3 {
            animation: orbit-electron 4s linear infinite;
            animation-delay: -2.67s; /* 240 degrees */
          }

          /* Protons - Medium, moderate speed, red */
          .proton {
            width: 12px;
            height: 12px;
            background: #ef4444;
            margin-left: -6px;
            margin-top: -6px;
          }

          .proton-1 {
            animation: orbit-proton 7s linear infinite;
            animation-delay: 0s;
          }

          .proton-2 {
            animation: orbit-proton 7s linear infinite;
            animation-delay: -3.5s; /* 180 degrees - opposite sides */
          }

          /* Neutrons - Large, slow, green */
          .neutron {
            width: 14px;
            height: 14px;
            background: #22c55e;
            margin-left: -7px;
            margin-top: -7px;
          }

          .neutron-1 {
            animation: orbit-neutron 10s linear infinite;
            animation-delay: 0s;
          }

          .neutron-2 {
            animation: orbit-neutron 10s linear infinite;
            animation-delay: -3.33s; /* 120 degrees */
          }

          .neutron-3 {
            animation: orbit-neutron 10s linear infinite;
            animation-delay: -6.67s; /* 240 degrees */
          }

          /* Shell 4 - Amber particles */
          .shell4 {
            width: 10px;
            height: 10px;
            background: #f59e0b;
            margin-left: -5px;
            margin-top: -5px;
          }

          .shell4-1 {
            animation: orbit-shell4 13s linear infinite;
            animation-delay: 0s;
          }

          .shell4-2 {
            animation: orbit-shell4 13s linear infinite;
            animation-delay: -4.33s; /* 120 degrees */
          }

          .shell4-3 {
            animation: orbit-shell4 13s linear infinite;
            animation-delay: -8.67s; /* 240 degrees */
          }

          /* Shell 5 - Pink particles */
          .shell5 {
            width: 11px;
            height: 11px;
            background: #ec4899;
            margin-left: -5.5px;
            margin-top: -5.5px;
          }

          .shell5-1 {
            animation: orbit-shell5 16s linear infinite;
            animation-delay: 0s;
          }

          .shell5-2 {
            animation: orbit-shell5 16s linear infinite;
            animation-delay: -8s; /* 180 degrees - opposite sides */
          }

          /* Shell 6 - Cyan particles */
          .shell6 {
            width: 12px;
            height: 12px;
            background: #06b6d4;
            margin-left: -6px;
            margin-top: -6px;
          }

          .shell6-1 {
            animation: orbit-shell6 19s linear infinite;
            animation-delay: 0s;
          }

          .shell6-2 {
            animation: orbit-shell6 19s linear infinite;
            animation-delay: -4.75s; /* 90 degrees */
          }

          .shell6-3 {
            animation: orbit-shell6 19s linear infinite;
            animation-delay: -9.5s; /* 180 degrees */
          }

          .shell6-4 {
            animation: orbit-shell6 19s linear infinite;
            animation-delay: -14.25s; /* 270 degrees - perfect square */
          }

          /* Shell 7 - Purple particles */
          .shell7 {
            width: 13px;
            height: 13px;
            background: #8b5cf6;
            margin-left: -6.5px;
            margin-top: -6.5px;
          }

          .shell7-1 {
            animation: orbit-shell7 22s linear infinite;
            animation-delay: 0s;
          }

          .shell7-2 {
            animation: orbit-shell7 22s linear infinite;
            animation-delay: -11s; /* 180 degrees - opposite sides */
          }

          /* Shell 8 - Emerald particles */
          .shell8 {
            width: 14px;
            height: 14px;
            background: #10b981;
            margin-left: -7px;
            margin-top: -7px;
          }

          .shell8-1 {
            animation: orbit-shell8 25s linear infinite;
            animation-delay: 0s;
          }

          .shell8-2 {
            animation: orbit-shell8 25s linear infinite;
            animation-delay: -8.33s; /* 120 degrees */
          }

          .shell8-3 {
            animation: orbit-shell8 25s linear infinite;
            animation-delay: -16.67s; /* 240 degrees */
          }

          /* Orbital path indicators */
          .orbit-path {
            position: absolute;
            border-radius: 50%;
            border: 1px dashed;
            opacity: 0.2;
          }

          .orbit-path-1 {
            width: 140px;
            height: 140px;
            top: -22px;
            left: -22px;
            border-color: #3b82f6;
          }

          .orbit-path-2 {
            width: 200px;
            height: 200px;
            top: -52px;
            left: -52px;
            border-color: #ef4444;
          }

          .orbit-path-3 {
            width: 260px;
            height: 260px;
            top: -82px;
            left: -82px;
            border-color: #22c55e;
          }

          .orbit-path-4 {
            width: 320px;
            height: 320px;
            top: -112px;
            left: -112px;
            border-color: #f59e0b;
          }

          .orbit-path-5 {
            width: 380px;
            height: 380px;
            top: -142px;
            left: -142px;
            border-color: #ec4899;
          }

          .orbit-path-6 {
            width: 440px;
            height: 440px;
            top: -172px;
            left: -172px;
            border-color: #06b6d4;
          }

          .orbit-path-7 {
            width: 500px;
            height: 500px;
            top: -202px;
            left: -202px;
            border-color: #8b5cf6;
          }

          .orbit-path-8 {
            width: 560px;
            height: 560px;
            top: -232px;
            left: -232px;
            border-color: #10b981;
          }

          @keyframes orbit-electron {
            from {
              transform: rotate(0deg) translateX(70px);
            }
            to {
              transform: rotate(360deg) translateX(70px);
            }
          }

          @keyframes orbit-proton {
            from {
              transform: rotate(0deg) translateX(100px);
            }
            to {
              transform: rotate(360deg) translateX(100px);
            }
          }

          @keyframes orbit-neutron {
            from {
              transform: rotate(0deg) translateX(130px);
            }
            to {
              transform: rotate(360deg) translateX(130px);
            }
          }

          @keyframes orbit-shell4 {
            from {
              transform: rotate(0deg) translateX(160px);
            }
            to {
              transform: rotate(360deg) translateX(160px);
            }
          }

          @keyframes orbit-shell5 {
            from {
              transform: rotate(0deg) translateX(190px);
            }
            to {
              transform: rotate(360deg) translateX(190px);
            }
          }

          @keyframes orbit-shell6 {
            from {
              transform: rotate(0deg) translateX(220px);
            }
            to {
              transform: rotate(360deg) translateX(220px);
            }
          }

          @keyframes orbit-shell7 {
            from {
              transform: rotate(0deg) translateX(250px);
            }
            to {
              transform: rotate(360deg) translateX(250px);
            }
          }

          @keyframes orbit-shell8 {
            from {
              transform: rotate(0deg) translateX(280px);
            }
            to {
              transform: rotate(360deg) translateX(280px);
            }
          }
        `}</style>
      </PlaygroundLayout>
    </DomainLayout>
  );
}

export default function QuantumOrbitalPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <QuantumOrbitalPageContent />
    </Suspense>
  );
}
