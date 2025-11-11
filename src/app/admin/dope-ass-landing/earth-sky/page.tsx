"use client";

import { useEffect, useState } from "react";
import { DomainLayout } from "~/components/domain-layout";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import { BackButton } from "~/components/back-button";

export default function EarthSkyLandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set target date - 30 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <DomainLayout
      headerClassName="border-b border-white/10 bg-gradient-to-r from-[#065f46] to-[#0284c7] backdrop-blur-sm"
      footerClassName="mt-auto border-t border-white/10 bg-gradient-to-r from-[#065f46] to-[#0284c7] backdrop-blur-sm"
    >
      <BackButton href="/admin" label="Back to Hub" />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#065f46] to-[#0284c7]">
        {/* Flower of Life Shader Background - Subtle & Non-Distracting */}
        <div className="absolute inset-0 opacity-20">
          <iframe
            src="/admin/shaders/flower-of-life/embed"
            className="h-full w-full border-0"
            style={{ pointerEvents: "none" }}
          />
        </div>

        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

        {/* Content */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
          {/* Logo */}
          <div className="mb-8">
            <div className="relative h-24 w-24 drop-shadow-2xl">
              <Image
                src="/brand/Logo Files/svg/White logo - no background.svg"
                alt="New Earth Collective"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-6 text-center">
            <Badge className="mb-6 border-[#facf39]/40 bg-[#facf39]/10 text-[#facf39] backdrop-blur-sm">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Coming Soon
            </Badge>
            <h1
              className="mb-4 text-7xl font-bold text-white drop-shadow-2xl"
              style={{ fontFamily: "Bourton, sans-serif" }}
            >
              EARTH TO SKY
              <br />
              LANDING PAGE
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-neutral-300">
              From the depths of the earth to the vastness of the sky.
              <br />
              Get ready for the most epic experience.
            </p>
          </div>

          {/* Countdown Timer */}
          <Card className="mb-12 border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center justify-center gap-2 text-[#facf39]">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-semibold tracking-wider uppercase">
                  Launch Countdown
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#facf39] to-[#f59e0b] shadow-lg">
                      <span
                        className="text-3xl font-bold text-black"
                        style={{ fontFamily: "Bourton, sans-serif" }}
                      >
                        {String(item.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Button
            size="lg"
            className="group bg-gradient-to-r from-[#facf39] to-[#f59e0b] px-8 py-6 text-lg font-bold text-black shadow-2xl transition-all hover:scale-105 hover:shadow-[#facf39]/50"
            style={{
              fontFamily: "Airwaves, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            Notify Me
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Footer Text */}
          <p className="mt-12 text-sm text-white/70">
            Crafted with intention by New Earth Collective
          </p>
        </div>
      </div>
    </DomainLayout>
  );
}
