"use client";

import { useEffect, useState } from "react";
import { DomainLayout } from "~/components/domain-layout";
import { LaunchLanding1Content } from "~/components/launch-landing-1-content";
import { BackButton } from "~/components/back-button";

export default function LaunchLanding1Page() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set target date - December 20th, 2025 at 12 PM
  const targetDate = new Date("2025-12-20T12:00:00");

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
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <div className="relative min-h-screen overflow-hidden bg-black">
        {/* Flower of Life Shader Background - Subtle & Non-Distracting */}
        <div className="absolute inset-0 opacity-15">
          <iframe
            src="/admin/shaders/flower-of-life/embed"
            className="h-full w-full border-0"
            style={{ pointerEvents: "none" }}
          />
        </div>

        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Content */}
        <div className="relative z-10 px-4 py-16">
          <div className="container mx-auto max-w-4xl">
            <LaunchLanding1Content timeLeft={timeLeft} />
          </div>
        </div>
      </div>
    </DomainLayout>
  );
}
