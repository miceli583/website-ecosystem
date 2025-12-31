"use client";

import { PlaygroundLayout } from "~/components/playground/playground-layout";
import { Star, Sparkles, Zap } from "lucide-react";

export default function MeteorEffectPage() {
  return (
    
      <PlaygroundLayout>
        <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Meteor container */}
          <div className="meteors-container absolute inset-0">
            {/* Create 50 meteors with JSX - no hydration issues */}
            {[...Array(50)].map((_, i) => {
              const delay = i * 0.5;
              const duration = 5 + (i % 5);
              // Use prime numbers and different modulos for more random-looking distribution
              const startPosTop = -10 - ((i * 7) % 23) * 4; // More varied top positions
              const startPosLeft = 20 + ((i * 13) % 37) * 3.2; // Shifted right by 20%

              return (
                <span
                  key={i}
                  className="meteor"
                  style={{
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                    top: `${startPosTop}%`,
                    left: `${startPosLeft}%`,
                  }}
                />
              );
            })}
          </div>

          {/* Starfield background */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${(i * 7.3) % 100}%`,
                  top: `${(i * 9.7) % 100}%`,
                  animationDelay: `${(i * 0.05) % 3}s`,
                  animationDuration: `${2 + (i % 2)}s`,
                }}
              />
            ))}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex min-h-full flex-col items-center justify-center p-8 text-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-bold text-transparent">
                Meteor Shower
              </h1>
              <p className="text-xl text-gray-300">
                Constant stream of meteors streaking across the starfield with
                realistic trails
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Realistic Physics
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Continuous Loop
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .meteors-container {
            pointer-events: none;
            z-index: 20;
          }

          .meteor {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
            animation: meteor-fall linear infinite;
          }

          .meteor::before {
            content: "";
            position: absolute;
            top: 50%;
            transform: translateY(-50%) rotate(-45deg);
            width: 80px;
            height: 1px;
            background: linear-gradient(90deg, #fff, transparent);
            transform-origin: 0% 50%;
          }

          @keyframes meteor-fall {
            0% {
              transform: translateX(0) translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateX(-50vw) translateY(120vh);
              opacity: 0;
            }
          }

          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            animation: star-twinkle linear infinite;
          }

          @keyframes star-twinkle {
            0%,
            100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}</style>
      </PlaygroundLayout>
    
  );
}
