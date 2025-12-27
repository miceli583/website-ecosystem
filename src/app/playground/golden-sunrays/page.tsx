"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import { Suspense } from "react";
import { Sun, Sparkles, Eye, Settings } from "lucide-react";

export default function GoldenSunraysPage() {
  return (
    <DomainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <PlaygroundLayout>
          <div className="via-background dark:via-background min-h-full bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:from-amber-950/20 dark:to-orange-950/20">
            <div className="mx-auto max-w-4xl space-y-8">
              {/* Header */}
              <div className="space-y-4 text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600">
                    <Sun className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-4xl font-bold text-transparent dark:from-yellow-400 dark:to-orange-400">
                    Golden Sunrays
                  </h1>
                </div>
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                  Beautiful flowing golden sunrays cascading from above
                </p>
              </div>

              {/* Main Sunrays Demo */}
              <Card className="relative overflow-hidden">
                <div className="sunrays-container absolute inset-0">
                  {/* Generate multiple sunrays */}
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="sunray"
                      style={{
                        left: `${index * 8 + 4}%`,
                        animationDelay: `${index * -0.333}s`,
                        transform: `rotate(${(index - 6) * 3}deg)`,
                      }}
                    ></div>
                  ))}
                </div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-600" />
                    Flowing Golden Rays
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 flex min-h-[400px] items-center justify-center">
                  <div className="space-y-4 text-center">
                    <h3 className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                      Bask in the Golden Light
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      Watch as gentle sunrays flow down from above, creating a
                      warm and inviting atmosphere
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Variations */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Gentle Rays */}
                <Card className="relative overflow-hidden">
                  <div className="sunrays-gentle-container absolute inset-0">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="sunray-gentle"
                        style={{
                          left: `${index * 12 + 6}%`,
                          animationDelay: `${index * -0.75}s`,
                          transform: `rotate(${(index - 4) * 2}deg)`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-amber-600" />
                      Gentle Rays
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex min-h-[200px] items-center justify-center">
                    <div className="text-center">
                      <h4 className="text-xl font-semibold text-amber-700 dark:text-amber-300">
                        Soft Golden Light
                      </h4>
                      <p className="text-muted-foreground mt-2 text-sm">
                        Slower, more subtle animation
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Intense Rays */}
                <Card className="relative overflow-hidden">
                  <div className="sunrays-intense-container absolute inset-0">
                    {Array.from({ length: 15 }).map((_, index) => (
                      <div
                        key={index}
                        className="sunray-intense"
                        style={{
                          left: `${index * 6.5 + 2}%`,
                          animationDelay: `${index * -0.133}s`,
                          transform: `rotate(${(index - 7) * 2.5}deg)`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-orange-600" />
                      Intense Rays
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex min-h-[200px] items-center justify-center">
                    <div className="text-center">
                      <h4 className="text-xl font-semibold text-orange-700 dark:text-orange-300">
                        Brilliant Radiance
                      </h4>
                      <p className="text-muted-foreground mt-2 text-sm">
                        More rays, faster movement
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Sunset Rays */}
                <Card className="relative overflow-hidden">
                  <div className="sunrays-sunset-container absolute inset-0">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div
                        key={index}
                        className="sunray-sunset"
                        style={{
                          left: `${index * 10 + 5}%`,
                          animationDelay: `${index * -0.5}s`,
                          transform: `rotate(${(index - 5) * 4}deg)`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-red-600" />
                      Sunset Rays
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex min-h-[200px] items-center justify-center">
                    <div className="text-center">
                      <h4 className="text-xl font-semibold text-red-700 dark:text-red-300">
                        Warm Sunset Glow
                      </h4>
                      <p className="text-muted-foreground mt-2 text-sm">
                        Reddish-orange gradient rays
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Dawn Rays */}
                <Card className="relative overflow-hidden">
                  <div className="sunrays-dawn-container absolute inset-0">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div
                        key={index}
                        className="sunray-dawn"
                        style={{
                          left: `${index * 11 + 5.5}%`,
                          animationDelay: `${index * -0.778}s`,
                          transform: `rotate(${(index - 4.5) * 3}deg)`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-pink-600" />
                      Dawn Rays
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex min-h-[200px] items-center justify-center">
                    <div className="text-center">
                      <h4 className="text-xl font-semibold text-pink-700 dark:text-pink-300">
                        Morning Light
                      </h4>
                      <p className="text-muted-foreground mt-2 text-sm">
                        Soft pink and golden hues
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <style jsx global>{`
            .sunrays-container,
            .sunrays-gentle-container,
            .sunrays-intense-container,
            .sunrays-sunset-container,
            .sunrays-dawn-container {
              pointer-events: none;
              overflow: hidden;
            }

            .sunray {
              position: absolute;
              top: -20px;
              width: 4px;
              height: 120%;
              background: linear-gradient(
                to bottom,
                rgba(255, 215, 0, 0.8) 0%,
                rgba(255, 193, 7, 0.6) 30%,
                rgba(255, 152, 0, 0.4) 60%,
                rgba(255, 152, 0, 0.2) 80%,
                transparent 100%
              );
              transform-origin: top center;
              animation: sunray-flow 4s ease-in-out infinite;
              border-radius: 2px;
              filter: blur(1px);
            }

            .sunray-gentle {
              position: absolute;
              top: -20px;
              width: 3px;
              height: 120%;
              background: linear-gradient(
                to bottom,
                rgba(255, 215, 0, 0.6) 0%,
                rgba(255, 193, 7, 0.4) 40%,
                rgba(255, 152, 0, 0.2) 70%,
                transparent 100%
              );
              transform-origin: top center;
              animation: sunray-gentle-flow 6s ease-in-out infinite;
              border-radius: 2px;
              filter: blur(1.5px);
            }

            .sunray-intense {
              position: absolute;
              top: -20px;
              width: 2px;
              height: 120%;
              background: linear-gradient(
                to bottom,
                rgba(255, 215, 0, 0.9) 0%,
                rgba(255, 193, 7, 0.7) 25%,
                rgba(255, 152, 0, 0.5) 50%,
                rgba(255, 152, 0, 0.3) 75%,
                transparent 100%
              );
              transform-origin: top center;
              animation: sunray-intense-flow 2s ease-in-out infinite;
              border-radius: 1px;
              filter: blur(0.5px);
            }

            .sunray-sunset {
              position: absolute;
              top: -20px;
              width: 4px;
              height: 120%;
              background: linear-gradient(
                to bottom,
                rgba(255, 99, 71, 0.8) 0%,
                rgba(255, 140, 0, 0.6) 30%,
                rgba(255, 215, 0, 0.4) 60%,
                rgba(255, 215, 0, 0.2) 80%,
                transparent 100%
              );
              transform-origin: top center;
              animation: sunray-sunset-flow 5s ease-in-out infinite;
              border-radius: 2px;
              filter: blur(1px);
            }

            .sunray-dawn {
              position: absolute;
              top: -20px;
              width: 3px;
              height: 120%;
              background: linear-gradient(
                to bottom,
                rgba(255, 182, 193, 0.8) 0%,
                rgba(255, 215, 0, 0.6) 40%,
                rgba(255, 193, 7, 0.4) 70%,
                rgba(255, 193, 7, 0.2) 85%,
                transparent 100%
              );
              transform-origin: top center;
              animation: sunray-dawn-flow 7s ease-in-out infinite;
              border-radius: 2px;
              filter: blur(1.2px);
            }

            @keyframes sunray-flow {
              0%,
              100% {
                opacity: 0.3;
                transform: translateY(0) scaleY(1) skewX(0deg);
              }
              25% {
                opacity: 0.7;
                transform: translateY(10px) scaleY(1.1) skewX(2deg);
              }
              50% {
                opacity: 1;
                transform: translateY(20px) scaleY(1.2) skewX(-1deg);
              }
              75% {
                opacity: 0.8;
                transform: translateY(15px) scaleY(1.05) skewX(1deg);
              }
            }

            @keyframes sunray-gentle-flow {
              0%,
              100% {
                opacity: 0.2;
                transform: translateY(0) scaleY(1) skewX(0deg);
              }
              50% {
                opacity: 0.6;
                transform: translateY(15px) scaleY(1.15) skewX(1deg);
              }
            }

            @keyframes sunray-intense-flow {
              0%,
              100% {
                opacity: 0.4;
                transform: translateY(0) scaleY(1) skewX(0deg);
              }
              33% {
                opacity: 0.9;
                transform: translateY(8px) scaleY(1.3) skewX(3deg);
              }
              66% {
                opacity: 1;
                transform: translateY(16px) scaleY(1.1) skewX(-2deg);
              }
            }

            @keyframes sunray-sunset-flow {
              0%,
              100% {
                opacity: 0.3;
                transform: translateY(0) scaleY(1) skewX(0deg);
              }
              30% {
                opacity: 0.8;
                transform: translateY(12px) scaleY(1.2) skewX(2deg);
              }
              70% {
                opacity: 0.9;
                transform: translateY(25px) scaleY(1.15) skewX(-1deg);
              }
            }

            @keyframes sunray-dawn-flow {
              0%,
              100% {
                opacity: 0.2;
                transform: translateY(0) scaleY(1) skewX(0deg);
              }
              40% {
                opacity: 0.7;
                transform: translateY(18px) scaleY(1.25) skewX(1.5deg);
              }
              80% {
                opacity: 0.5;
                transform: translateY(10px) scaleY(1.1) skewX(-0.5deg);
              }
            }

            /* Add some subtle glow effects */
            .sunray::before {
              content: "";
              position: absolute;
              top: 0;
              left: -2px;
              right: -2px;
              height: 30%;
              background: linear-gradient(
                to bottom,
                rgba(255, 215, 0, 0.3) 0%,
                transparent 100%
              );
              filter: blur(3px);
            }

            .sunray-gentle::before,
            .sunray-intense::before,
            .sunray-sunset::before,
            .sunray-dawn::before {
              content: "";
              position: absolute;
              top: 0;
              left: -1px;
              right: -1px;
              height: 25%;
              filter: blur(2px);
            }

            .sunray-gentle::before {
              background: linear-gradient(
                to bottom,
                rgba(255, 215, 0, 0.2) 0%,
                transparent 100%
              );
            }

            .sunray-intense::before {
              background: linear-gradient(
                to bottom,
                rgba(255, 215, 0, 0.4) 0%,
                transparent 100%
              );
            }

            .sunray-sunset::before {
              background: linear-gradient(
                to bottom,
                rgba(255, 99, 71, 0.3) 0%,
                transparent 100%
              );
            }

            .sunray-dawn::before {
              background: linear-gradient(
                to bottom,
                rgba(255, 182, 193, 0.3) 0%,
                transparent 100%
              );
            }
          `}</style>
        </PlaygroundLayout>
      </Suspense>
    </DomainLayout>
  );
}
