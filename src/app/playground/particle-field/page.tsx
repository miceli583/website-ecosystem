"use client";

import { useMemo } from "react";
import { PlaygroundLayout } from "~/components/playground/playground-layout";

export default function ParticleFieldPage() {
  // Generate random particles (memoized to prevent regeneration on re-render)
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * -20,
        color: [
          "#8b5cf6", // violet
          "#a855f7", // purple
          "#ec4899", // pink
          "#06b6d4", // cyan
          "#10b981", // emerald
          "#f59e0b", // amber
        ][Math.floor(Math.random() * 6)],
      })),
    []
  );

  return (
    
      <PlaygroundLayout>
        <div className="relative min-h-full overflow-hidden bg-black">
          {/* Particle Field */}
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animation: `particle-float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                  filter: `blur(0.5px)`,
                }}
              >
                {/* Core particle */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    transform: "translate(-50%, -50%)",
                  }}
                />
                {/* Glow layer 1 */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: `${particle.size * 8}px`,
                    height: `${particle.size * 8}px`,
                    background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                    transform: "translate(-50%, -50%)",
                    opacity: 0.6,
                    animation: `particle-glow ${particle.duration * 0.7}s ease-in-out ${particle.delay}s infinite alternate`,
                  }}
                />
                {/* Glow layer 2 */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: `${particle.size * 16}px`,
                    height: `${particle.size * 16}px`,
                    background: `radial-gradient(circle, ${particle.color} 0%, transparent 60%)`,
                    transform: "translate(-50%, -50%)",
                    opacity: 0.4,
                    animation: `particle-glow ${particle.duration * 0.8}s ease-in-out ${particle.delay * 0.5}s infinite alternate`,
                  }}
                />
                {/* Glow layer 3 - largest aura */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: `${particle.size * 24}px`,
                    height: `${particle.size * 24}px`,
                    background: `radial-gradient(circle, ${particle.color} 0%, transparent 50%)`,
                    transform: "translate(-50%, -50%)",
                    opacity: 0.3,
                    animation: `particle-glow ${particle.duration}s ease-in-out ${particle.delay * 0.3}s infinite alternate`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Connecting Lines Effect - CSS Grid Pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px),
                linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
              animation: "grid-drift 40s linear infinite",
            }}
          />

          {/* Content Overlay */}
          <div className="relative z-10 flex min-h-full flex-col items-center justify-center p-8 text-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-5xl font-bold text-transparent">
                Particle Field
              </h1>
              <p className="text-xl text-gray-300">
                Floating particles with mesmerizing glow effects
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  CSS Animation
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  Particle Physics
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm">
                  Glow Effects
                </div>
              </div>
            </div>
          </div>

          {/* Custom Animations */}
          <style jsx>{`
            @keyframes particle-float {
              0%,
              100% {
                transform: translate(0, 0);
              }
              25% {
                transform: translate(30px, -40px);
              }
              50% {
                transform: translate(-20px, 30px);
              }
              75% {
                transform: translate(35px, 15px);
              }
            }

            @keyframes particle-glow {
              0% {
                opacity: 0.3;
                transform: translate(-50%, -50%) scale(0.9);
              }
              50% {
                opacity: 0.7;
                transform: translate(-50%, -50%) scale(1.1);
              }
              100% {
                opacity: 0.3;
                transform: translate(-50%, -50%) scale(0.9);
              }
            }

            @keyframes grid-drift {
              0% {
                transform: translate(0, 0);
              }
              100% {
                transform: translate(100px, 100px);
              }
            }
          `}</style>
        </div>
      </PlaygroundLayout>
    
  );
}
