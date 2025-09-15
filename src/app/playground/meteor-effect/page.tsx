"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import { Star, Sparkles, Zap } from "lucide-react";

export default function MeteorEffectPage() {
  const meteorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createMeteor = () => {
      if (!meteorContainerRef.current) return;

      const meteor = document.createElement('div');
      meteor.className = 'meteor';

      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = -50;

      meteor.style.left = `${startX}px`;
      meteor.style.top = `${startY}px`;

      meteorContainerRef.current.appendChild(meteor);

      // Remove meteor after animation
      setTimeout(() => {
        if (meteor.parentNode) {
          meteor.parentNode.removeChild(meteor);
        }
      }, 3000);
    };

    const interval = setInterval(createMeteor, 800);
    return () => clearInterval(interval);
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
                Animated meteor and particle effects inspired by Svelte animations
              </p>
            </div>

            {/* Meteor Showcase */}
            <div className="grid gap-8">
              {/* Main Meteor Effect */}
              <Card className="relative overflow-hidden">
                <div
                  ref={meteorContainerRef}
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                ></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-violet-600" />
                    Falling Meteors
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 min-h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      Watch the Magic
                    </h3>
                    <p className="text-muted-foreground">
                      Meteors falling across the screen with trailing effects
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Particle Burst */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    Particle Burst
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="particle-burst-container relative flex items-center justify-center min-h-[200px] overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
                    <button className="particle-trigger group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105">
                      <span className="relative z-10">Click for Burst</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Orbiting Particles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Orbiting Effects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="orbit-container relative flex items-center justify-center min-h-[200px] overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                    <div className="orbit-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div className="orbit-particle orbit-1"></div>
                        <div className="orbit-particle orbit-2"></div>
                        <div className="orbit-particle orbit-3"></div>
                        <div className="orbit-particle orbit-4"></div>
                      </div>
                    </div>
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
            width: 3px;
            height: 3px;
            background: linear-gradient(45deg, #fff, #60a5fa);
            border-radius: 50%;
            box-shadow: 0 0 10px #60a5fa;
            animation: meteor-fall 3s linear forwards;
          }

          .meteor::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 1px;
            background: linear-gradient(90deg, #60a5fa, transparent);
            transform: translate(-50%, -50%) rotate(45deg);
            transform-origin: center;
          }

          @keyframes meteor-fall {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) translateX(50px);
              opacity: 0;
            }
          }

          .particle-trigger {
            position: relative;
            overflow: hidden;
          }

          .particle-trigger:active::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: particle-burst 0.6s ease-out;
          }

          @keyframes particle-burst {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(3);
              opacity: 0;
            }
          }

          .orbit-center {
            position: relative;
          }

          .orbit-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, #f97316, #ef4444);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
          }

          .orbit-1 {
            animation: orbit 2s linear infinite;
            transform-origin: 40px 32px;
          }

          .orbit-2 {
            animation: orbit 3s linear infinite reverse;
            transform-origin: 60px 32px;
          }

          .orbit-3 {
            animation: orbit 2.5s linear infinite;
            transform-origin: 80px 32px;
          }

          .orbit-4 {
            animation: orbit 3.5s linear infinite reverse;
            transform-origin: 100px 32px;
          }

          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(40px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(40px) rotate(-360deg);
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
            0%, 100% {
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