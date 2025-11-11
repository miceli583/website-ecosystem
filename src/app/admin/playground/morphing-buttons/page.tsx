"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import {
  MousePointer,
  Heart,
  Download,
  Send,
  Play,
  Square,
  ArrowRight,
  Check,
  Sparkles,
  Zap,
} from "lucide-react";

export default function MorphingButtonsPage() {
  const [likeCount, setLikeCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [downloadState, setDownloadState] = useState<
    "idle" | "downloading" | "complete"
  >("idle");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">(
    "idle"
  );

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleDownload = () => {
    if (downloadState === "idle") {
      setDownloadState("downloading");
      setTimeout(() => setDownloadState("complete"), 2000);
      setTimeout(() => setDownloadState("idle"), 4000);
    }
  };

  const handleSend = () => {
    if (sendState === "idle") {
      setSendState("sending");
      setTimeout(() => setSendState("sent"), 1500);
      setTimeout(() => setSendState("idle"), 3000);
    }
  };

  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="via-background dark:via-background min-h-full bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:from-violet-950/20 dark:to-purple-950/20">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <MousePointer className="h-6 w-6 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-violet-400 dark:to-purple-400">
                  Morphing Buttons
                </h1>
              </div>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Interactive buttons with Svelte-inspired morphing animations
              </p>
            </div>

            {/* Button Examples */}
            <div className="grid gap-8">
              {/* State-Based Morphing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-600" />
                    State-Based Morphing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    {/* Like Button */}
                    <button
                      onClick={handleLike}
                      className={`group relative overflow-hidden rounded-full px-6 py-3 font-medium transition-all duration-500 ${
                        isLiked
                          ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                          : "border-2 border-pink-200 text-pink-600 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-950/30"
                      } `}
                    >
                      <div className="flex items-center gap-2">
                        <Heart
                          className={`h-4 w-4 transition-all duration-300 ${isLiked ? "scale-110 fill-white" : "group-hover:scale-110"} `}
                        />
                        <span className="transition-all duration-300">
                          {likeCount}
                        </span>
                      </div>
                      {isLiked && (
                        <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-pink-400 opacity-30"></div>
                      )}
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={handleDownload}
                      disabled={downloadState !== "idle"}
                      className={`relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all duration-500 ${
                        downloadState === "idle"
                          ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg"
                          : downloadState === "downloading"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                      } `}
                    >
                      <div className="flex items-center gap-2">
                        {downloadState === "idle" && (
                          <Download className="h-4 w-4" />
                        )}
                        {downloadState === "downloading" && (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        )}
                        {downloadState === "complete" && (
                          <Check className="h-4 w-4" />
                        )}
                        <span>
                          {downloadState === "idle" && "Download"}
                          {downloadState === "downloading" && "Downloading..."}
                          {downloadState === "complete" && "Complete!"}
                        </span>
                      </div>
                    </button>

                    {/* Send Button */}
                    <button
                      onClick={handleSend}
                      disabled={sendState !== "idle"}
                      className={`relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all duration-500 ${
                        sendState === "idle"
                          ? "bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg"
                          : sendState === "sending"
                            ? "bg-orange-500 text-white"
                            : "bg-green-500 text-white"
                      } `}
                    >
                      <div className="flex items-center gap-2">
                        {sendState === "idle" && <Send className="h-4 w-4" />}
                        {sendState === "sending" && (
                          <Zap className="h-4 w-4 animate-bounce" />
                        )}
                        {sendState === "sent" && <Check className="h-4 w-4" />}
                        <span>
                          {sendState === "idle" && "Send Message"}
                          {sendState === "sending" && "Sending..."}
                          {sendState === "sent" && "Sent!"}
                        </span>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Hover Morphing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5 text-emerald-600" />
                    Hover Morphing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    {/* Play/Pause Morph */}
                    <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Play className="h-4 w-4 transition-all duration-300 group-hover:scale-0 group-hover:opacity-0" />
                          <Square className="absolute inset-0 h-4 w-4 scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                        </div>
                        <span className="relative">
                          <span className="transition-all duration-300 group-hover:opacity-0">
                            Play
                          </span>
                          <span className="absolute inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100">
                            Pause
                          </span>
                        </span>
                      </div>
                    </button>

                    {/* Expand Button */}
                    <button className="group relative overflow-hidden rounded-lg border-2 border-violet-300 px-6 py-3 font-medium text-violet-600 transition-all duration-500 hover:bg-violet-600 hover:text-white dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-600">
                      <div className="flex items-center gap-2">
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-500 group-hover:w-full"></div>
                    </button>

                    {/* Ripple Effect */}
                    <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-3 font-medium text-white transition-all duration-300">
                      <span className="relative z-10">Click Me</span>
                      <div className="absolute inset-0 scale-0 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-100"></div>
                      <div className="absolute inset-0 scale-0 rounded-lg bg-white/10 transition-transform delay-75 duration-500 group-hover:scale-110"></div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Magnetic Effects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Magnetic & Elastic Effects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    {/* Magnetic Button */}
                    <button className="magnetic-btn group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl">
                      <span className="relative z-10">Magnetic Effect</span>
                      <div className="absolute inset-0 scale-x-0 bg-gradient-to-r from-red-600 to-orange-500 transition-transform duration-300 group-hover:scale-x-100"></div>
                    </button>

                    {/* Elastic Button */}
                    <button className="group rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-110 active:scale-95">
                      <span className="block transition-transform duration-150 group-active:scale-75">
                        Elastic Press
                      </span>
                    </button>

                    {/* Glow Button */}
                    <button className="group relative overflow-hidden rounded-lg border border-cyan-400 bg-transparent px-8 py-4 font-medium text-cyan-400 transition-all duration-300 hover:text-white">
                      <span className="relative z-10">Glow Effect</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30"></div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Quantum Particle Burst */}
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
                      className="pointer-events-none absolute inset-0"
                      id="particle-burst-container"
                    />

                    <button
                      onClick={() => {
                        const container = document.getElementById(
                          "particle-burst-container"
                        );
                        if (!container) return;

                        // Clear existing particles
                        const existingParticles =
                          container.querySelectorAll(".burst-particle");
                        existingParticles.forEach((particle) =>
                          particle.remove()
                        );

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

                          container.appendChild(particle);
                        }

                        // Remove particles after animation
                        setTimeout(() => {
                          const particles =
                            container.querySelectorAll(".burst-particle");
                          particles.forEach((particle) => particle.remove());
                        }, 3000);
                      }}
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
                      40 Particles
                    </span>
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-cyan-400" />
                      Physics Based
                    </span>
                    <span className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-teal-400" />
                      Interactive
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .magnetic-btn {
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .magnetic-btn:hover {
            transform: translateY(-2px);
          }

          .magnetic-btn:active {
            transform: translateY(0px);
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
        `}</style>
      </PlaygroundLayout>
    </DomainLayout>
  );
}
