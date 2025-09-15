"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import { Sparkles, Type, Palette } from "lucide-react";

export default function TextShimmerPage() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="via-background dark:via-background min-h-full bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:from-violet-950/20 dark:to-purple-950/20">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-violet-400 dark:to-purple-400">
                  Text Shimmer Effects
                </h1>
              </div>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Svelte-inspired text animations and shimmer effects
              </p>
            </div>

            {/* Shimmer Text Examples */}
            <div className="grid gap-8">
              {/* Basic Shimmer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-violet-600" />
                    Basic Shimmer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative">
                    <h2 className="shimmer-text text-4xl font-bold">
                      Magic Happens Here
                    </h2>
                  </div>
                  <div className="relative">
                    <h3 className="shimmer-text-slow text-2xl font-semibold text-purple-600">
                      Slower Animation
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* Gradient Shimmer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-emerald-600" />
                    Gradient Shimmer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative">
                    <h2 className="gradient-shimmer text-4xl font-bold">
                      Rainbow Dreams
                    </h2>
                  </div>
                  <div className="relative">
                    <h3 className="gradient-shimmer-purple text-3xl font-semibold">
                      Purple Haze
                    </h3>
                  </div>
                  <div className="relative">
                    <h3 className="gradient-shimmer-emerald text-2xl font-medium">
                      Emerald Glow
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Shimmer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                    Interactive Effects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="cursor-pointer">
                    <h2 className="hover-shimmer text-3xl font-bold transition-all duration-300 hover:scale-105">
                      Hover to Activate
                    </h2>
                  </div>
                  <div className="cursor-pointer">
                    <h3 className="pulse-shimmer text-2xl font-semibold">
                      Pulsing Energy
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .shimmer-text {
            background: linear-gradient(
              90deg,
              #000 25%,
              #fff 50%,
              #000 75%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 2s linear infinite;
          }

          .shimmer-text-slow {
            background: linear-gradient(
              90deg,
              #8b5cf6 25%,
              #f3e8ff 50%,
              #8b5cf6 75%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 4s linear infinite;
          }

          .gradient-shimmer {
            background: linear-gradient(
              90deg,
              #ff0000 0%,
              #ff8c00 16.66%,
              #ffd700 33.33%,
              #00ff00 50%,
              #0000ff 66.66%,
              #8b00ff 83.33%,
              #ff0000 100%
            );
            background-size: 300% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbow-shimmer 3s linear infinite;
          }

          .gradient-shimmer-purple {
            background: linear-gradient(
              90deg,
              #8b5cf6 25%,
              #ec4899 50%,
              #8b5cf6 75%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 2.5s linear infinite;
          }

          .gradient-shimmer-emerald {
            background: linear-gradient(
              90deg,
              #10b981 25%,
              #34d399 50%,
              #10b981 75%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s linear infinite;
          }

          .hover-shimmer {
            background: linear-gradient(
              90deg,
              #6366f1 25%,
              #f8fafc 50%,
              #6366f1 75%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: none;
            transition: all 0.3s ease;
          }

          .hover-shimmer:hover {
            animation: shimmer 1s linear infinite;
          }

          .pulse-shimmer {
            background: linear-gradient(
              90deg,
              #f97316 25%,
              #fed7aa 50%,
              #f97316 75%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 1.5s ease-in-out infinite alternate;
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          @keyframes rainbow-shimmer {
            0% {
              background-position: 0% 0;
            }
            100% {
              background-position: 300% 0;
            }
          }

          .dark .shimmer-text {
            background: linear-gradient(
              90deg,
              #fff 25%,
              #000 50%,
              #fff 75%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .dark .shimmer-text-slow {
            background: linear-gradient(
              90deg,
              #a855f7 25%,
              #1e1b4b 50%,
              #a855f7 75%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}</style>
      </PlaygroundLayout>
    </DomainLayout>
  );
}