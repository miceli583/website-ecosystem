"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import { Star, Sparkles, Zap } from "lucide-react";

export default function MeteorEffectPage() {
  const meteorContainerRef = useRef<HTMLDivElement>(null);
  const particleBurstRef = useRef<HTMLDivElement>(null);

  const triggerParticleBurst = () => {
    if (!particleBurstRef.current) return;

    // Clear existing particles
    const existingParticles =
      particleBurstRef.current.querySelectorAll(".burst-particle");
    existingParticles.forEach((particle) => particle.remove());

    // Create burst particles
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "burst-particle";

      const angle = (360 / particleCount) * i;
      const velocity = 150 + Math.random() * 100;
      const size = 3 + Math.random() * 4;
      const duration = 1 + Math.random() * 1.5;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"][Math.floor(Math.random() * 5)]};
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px currentColor;
        animation: burst-particle ${duration}s ease-out forwards;
        --angle: ${angle}deg;
        --velocity: ${velocity}px;
      `;

      particleBurstRef.current.appendChild(particle);
    }

    // Remove particles after animation
    setTimeout(() => {
      const particles =
        particleBurstRef.current?.querySelectorAll(".burst-particle");
      particles?.forEach((particle) => particle.remove());
    }, 3000);
  };

  useEffect(() => {
    const meteors: HTMLElement[] = [];
    const meteorCount = 20;

    const createMeteors = () => {
      if (!meteorContainerRef.current) return;

      // Clear existing meteors
      meteors.forEach((meteor) => {
        if (meteor.parentNode) {
          meteor.parentNode.removeChild(meteor);
        }
      });
      meteors.length = 0;

      // Create new meteors
      for (let i = 0; i < meteorCount; i++) {
        const meteor = document.createElement("span");
        meteor.className = "meteor";

        // Random positioning and timing
        const leftOffset = Math.floor(Math.random() * 800 - 400);
        const delay = Math.random() * 0.6 + 0.2;
        const duration = Math.floor(Math.random() * 8 + 2);

        meteor.style.cssText = `
          top: 0;
          left: ${leftOffset}px;
          animation-delay: ${delay}s;
          animation-duration: ${duration}s;
        `;

        meteorContainerRef.current.appendChild(meteor);
        meteors.push(meteor);
      }
    };

    createMeteors();

    // Recreate meteors periodically for continuous effect
    const interval = setInterval(createMeteors, 10000);

    return () => {
      clearInterval(interval);
      meteors.forEach((meteor) => {
        if (meteor.parentNode) {
          meteor.parentNode.removeChild(meteor);
        }
      });
    };
  }, []);

  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="via-background dark:via-background min-h-full bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:from-violet-950/20 dark:to-purple-950/20">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-violet-400 dark:to-purple-400">
                  Meteor Effects
                </h1>
              </div>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Animated meteor and particle effects inspired by Svelte
                animations
              </p>
            </div>

            {/* Meteor Showcase */}
            <div className="grid gap-8">
              {/* Main Meteor Effect */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div
                  ref={meteorContainerRef}
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                ></div>

                {/* Starfield background */}
                <div className="absolute inset-0">
                  <div className="star-field">
                    {Array.from({ length: 100 }, (_, i) => (
                      <div
                        key={i}
                        className="star"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Star className="h-5 w-5 text-blue-400" />
                    Enhanced Meteor Shower
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 flex min-h-[400px] items-center justify-center">
                  <div className="space-y-4 text-center">
                    <h3 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                      Cosmic Wonder
                    </h3>
                    <p className="text-lg text-gray-300">
                      Twenty meteors streak across the starfield with realistic
                      trails and timing
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-blue-400" />
                        20 Meteors
                      </span>
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        Realistic Physics
                      </span>
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        Continuous Loop
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Particle Burst */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    Quantum Particle Burst
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="particle-burst-container relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-black/50 to-emerald-900/30">
                    {/* Ambient particles background */}
                    <div className="absolute inset-0">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div
                          key={i}
                          className="ambient-particle"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Particle burst container */}
                    <div
                      ref={particleBurstRef}
                      className="pointer-events-none absolute inset-0"
                    />

                    <button
                      onClick={triggerParticleBurst}
                      className="particle-trigger group relative z-10 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-12 py-6 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/25 active:scale-105"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <Sparkles className="h-6 w-6" />
                        Trigger Explosion
                        <Zap className="h-6 w-6" />
                      </span>
                      {/* Button glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      50 Particles
                    </span>
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-cyan-400" />
                      Physics Based
                    </span>
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-teal-400" />
                      Interactive
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Orbital System */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-900 via-red-900 to-purple-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="h-5 w-5 text-orange-400" />
                    Quantum Orbital System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="orbit-container relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-black/60 to-orange-900/30">
                    {/* Energy field background */}
                    <div className="absolute inset-0">
                      <div className="energy-field"></div>
                      <div className="energy-rings">
                        <div className="energy-ring energy-ring-1"></div>
                        <div className="energy-ring energy-ring-2"></div>
                        <div className="energy-ring energy-ring-3"></div>
                      </div>
                    </div>

                    <div className="orbit-center relative z-10">
                      <div className="relative">
                        {/* Central core with pulsing effect */}
                        <div className="core-container relative">
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 shadow-2xl">
                            <Zap className="h-10 w-10 animate-pulse text-white" />
                          </div>
                          {/* Core energy glow */}
                          <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-30"></div>
                        </div>

                        {/* Multiple orbital rings with different particles */}
                        {/* Inner ring - Fast electrons */}
                        <div className="orbit-particle electron electron-1"></div>
                        <div className="orbit-particle electron electron-2"></div>
                        <div className="orbit-particle electron electron-3"></div>

                        {/* Middle ring - Medium protons */}
                        <div className="orbit-particle proton proton-1"></div>
                        <div className="orbit-particle proton proton-2"></div>

                        {/* Outer ring - Slow neutrons */}
                        <div className="orbit-particle neutron neutron-1"></div>
                        <div className="orbit-particle neutron neutron-2"></div>
                        <div className="orbit-particle neutron neutron-3"></div>

                        {/* Orbital paths (visible rings) */}
                        <div className="orbit-path orbit-path-1"></div>
                        <div className="orbit-path orbit-path-2"></div>
                        <div className="orbit-path orbit-path-3"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
                    <span className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                      Electrons
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      Protons
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      Neutrons
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    Floating Elements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="float-container relative min-h-[200px] overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <div className="float-element float-1"></div>
                    <div className="float-element float-2"></div>
                    <div className="float-element float-3"></div>
                    <div className="float-element float-4"></div>
                    <div className="float-element float-5"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                        Gentle Floating Motion
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .meteor {
            position: absolute;
            left: 50%;
            top: 50%;
            height: 0.5px;
            width: 0.5px;
            border-radius: 9999px;
            background-color: #64748b;
            transform: rotate(215deg);
            animation: meteor-effect 10s linear infinite;
          }

          .meteor::before {
            content: "";
            position: absolute;
            top: 50%;
            height: 1px;
            width: 50px;
            transform: translateY(-50%);
            background: linear-gradient(to right, #64748b, transparent);
          }

          @keyframes meteor-effect {
            0% {
              transform: rotate(215deg) translateX(0);
              opacity: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: rotate(215deg) translateX(-500px);
              opacity: 0;
            }
          }

          .star-field {
            position: absolute;
            inset: 0;
            z-index: 1;
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

          .ambient-particle {
            position: absolute;
            width: 3px;
            height: 3px;
            background: radial-gradient(circle, #10b981, #06b6d4);
            border-radius: 50%;
            animation: ambient-float ease-in-out infinite;
            opacity: 0.6;
          }

          @keyframes ambient-float {
            0%,
            100% {
              transform: translateY(0px) scale(1);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-15px) scale(1.5);
              opacity: 0.8;
            }
          }

          .burst-particle {
            opacity: 1;
          }

          @keyframes burst-particle {
            0% {
              transform: translate(-50%, -50%) rotate(var(--angle))
                translateX(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) rotate(var(--angle))
                translateX(var(--velocity)) scale(0);
              opacity: 0;
            }
          }

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
            width: 120px;
            height: 120px;
            border-color: rgba(59, 130, 246, 0.3);
            animation-duration: 3s;
          }

          .energy-ring-2 {
            width: 180px;
            height: 180px;
            border-color: rgba(239, 68, 68, 0.3);
            animation-duration: 4s;
            animation-delay: 1s;
          }

          .energy-ring-3 {
            width: 240px;
            height: 240px;
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

          .orbit-particle {
            position: absolute;
            border-radius: 50%;
            box-shadow: 0 0 15px currentColor;
          }

          /* Electrons - Small, fast, blue */
          .electron {
            width: 6px;
            height: 6px;
            background: #3b82f6;
          }

          .electron-1 {
            animation: orbit-electron 1.5s linear infinite;
            transform-origin: 60px 50%;
            top: 50%;
            left: 50%;
          }

          .electron-2 {
            animation: orbit-electron 1.5s linear infinite;
            transform-origin: 60px 50%;
            top: 50%;
            left: 50%;
            animation-delay: 0.5s;
          }

          .electron-3 {
            animation: orbit-electron 1.5s linear infinite;
            transform-origin: 60px 50%;
            top: 50%;
            left: 50%;
            animation-delay: 1s;
          }

          /* Protons - Medium, moderate speed, red */
          .proton {
            width: 10px;
            height: 10px;
            background: #ef4444;
          }

          .proton-1 {
            animation: orbit-proton 3s linear infinite;
            transform-origin: 90px 50%;
            top: 50%;
            left: 50%;
          }

          .proton-2 {
            animation: orbit-proton 3s linear infinite reverse;
            transform-origin: 90px 50%;
            top: 50%;
            left: 50%;
            animation-delay: 1.5s;
          }

          /* Neutrons - Large, slow, green */
          .neutron {
            width: 12px;
            height: 12px;
            background: #22c55e;
          }

          .neutron-1 {
            animation: orbit-neutron 5s linear infinite;
            transform-origin: 120px 50%;
            top: 50%;
            left: 50%;
          }

          .neutron-2 {
            animation: orbit-neutron 5s linear infinite;
            transform-origin: 120px 50%;
            top: 50%;
            left: 50%;
            animation-delay: 1.6s;
          }

          .neutron-3 {
            animation: orbit-neutron 5s linear infinite;
            transform-origin: 120px 50%;
            top: 50%;
            left: 50%;
            animation-delay: 3.3s;
          }

          /* Orbital path indicators */
          .orbit-path {
            position: absolute;
            border-radius: 50%;
            border: 1px dashed;
            opacity: 0.2;
          }

          .orbit-path-1 {
            width: 120px;
            height: 120px;
            top: -20px;
            left: -20px;
            border-color: #3b82f6;
          }

          .orbit-path-2 {
            width: 180px;
            height: 180px;
            top: -50px;
            left: -50px;
            border-color: #ef4444;
          }

          .orbit-path-3 {
            width: 240px;
            height: 240px;
            top: -80px;
            left: -80px;
            border-color: #22c55e;
          }

          @keyframes orbit-electron {
            0% {
              transform: rotate(0deg) translateX(60px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(60px) rotate(-360deg);
            }
          }

          @keyframes orbit-proton {
            0% {
              transform: rotate(0deg) translateX(90px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(90px) rotate(-360deg);
            }
          }

          @keyframes orbit-neutron {
            0% {
              transform: rotate(0deg) translateX(120px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(120px) rotate(-360deg);
            }
          }

          .float-container {
            position: relative;
          }

          .float-element {
            position: absolute;
            width: 12px;
            height: 12px;
            background: linear-gradient(45deg, #a855f7, #ec4899);
            border-radius: 50%;
            opacity: 0.7;
          }

          .float-1 {
            top: 20%;
            left: 10%;
            animation: float 4s ease-in-out infinite;
          }

          .float-2 {
            top: 60%;
            left: 80%;
            animation: float 5s ease-in-out infinite reverse;
          }

          .float-3 {
            top: 30%;
            left: 70%;
            animation: float 3s ease-in-out infinite;
          }

          .float-4 {
            top: 70%;
            left: 20%;
            animation: float 6s ease-in-out infinite reverse;
          }

          .float-5 {
            top: 10%;
            left: 50%;
            animation: float 4.5s ease-in-out infinite;
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </PlaygroundLayout>
    </DomainLayout>
  );
}
