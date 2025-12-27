"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Star,
  Music,
  Heart,
  Users,
} from "lucide-react";

interface LaunchLanding1ContentProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export function LaunchLanding1Content({
  timeLeft,
}: LaunchLanding1ContentProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <div className="mb-10 inline-flex items-center justify-center">
          <div className="relative h-20 w-20 drop-shadow-2xl">
            <Image
              src="/brand/miracle-mind-orbit-star-v3.svg"
              alt="New Earth Collective"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="mb-6 text-5xl leading-tight font-bold text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
          <span
            style={{
              fontFamily: "Airwaves, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            NEW EARTH COLLECTIVE
          </span>
          <br />
          <span style={{ fontFamily: "Bourton, sans-serif" }}>
            LAUNCH PARTY
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-xl text-neutral-300 italic md:text-2xl">
          A Day-Long Transformational Festival of Heart, Harmony, and High Vibe
          Connection
        </p>

        {/* Event Details */}
        <div className="mb-10 flex flex-col items-center justify-center gap-4 text-lg text-neutral-300 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#facf39]" />
            <span>December 20th, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#facf39]" />
            <span>12 PM to 12 AM</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#facf39]" />
            <span>Boulder Circus Center, CO</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8 flex w-full justify-center">
          <Card className="w-full border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md sm:w-auto">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center justify-center gap-2 text-[#facf39]">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-semibold tracking-wider uppercase">
                  Event Countdown
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
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-[#facf39] to-[#f59e0b] px-8 py-6 text-lg font-bold text-black shadow-2xl transition-all hover:scale-105 hover:shadow-[#facf39]/50"
            style={{
              fontFamily: "Airwaves, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            Join the New Earth Collective
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* The Invitation Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <Heart className="h-8 w-8 text-[#facf39]" />
              <h2
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "Bourton, sans-serif" }}
              >
                The Invitation
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-neutral-300">
              <p className="text-xl font-bold text-white">
                This isn&apos;t just a party. It&apos;s a pulse.
              </p>
              <p>
                The New Earth is rising—a new way of living, loving, and leading
                rooted in unity, creativity, and heart-centered connection. And
                it begins right here, with us, in Boulder.
              </p>
              <p>
                You&apos;re invited to be the{" "}
                <span className="font-bold text-[#facf39]">heart</span> of the
                New Earth Collective. A diverse, potent, and playful community
                of facilitators, artists, healers, mystics, and visionaries
                ready to co-create something greater than ourselves.
              </p>
              <p>
                This launch party is our first spark. A sacred celebration. A
                living ceremony. A 12-hour journey of self-activation, group
                coherence, soul nourishment, and pure ecstatic expression.
              </p>
            </div>
            <div className="mt-8">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-[#facf39] to-[#f59e0b] font-bold text-black transition-all hover:scale-105 md:w-auto"
                style={{
                  fontFamily: "Airwaves, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                Join the Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* What to Expect Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <Music className="h-8 w-8 text-[#facf39]" />
              <h2
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "Bourton, sans-serif" }}
              >
                What to Expect
              </h2>
            </div>
            <p className="mb-6 text-2xl font-bold text-[#facf39]">
              Heaven on Earth Vibes
            </p>
            <ul className="mb-6 space-y-3">
              {[
                "Soul-stirring workshops to awaken your gifts",
                "Coded conversations & deep connective magic",
                "Potluck community feast & visionary speech",
                "Curated bass music to move your body & spirit",
                "Integration lounges, tea service, tarot, cuddle zones",
                "Acro, aerials, jugglers, and joyful circus energy",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Star className="mt-1 h-5 w-5 shrink-0 text-[#facf39]" />
                  <span className="text-lg text-neutral-300">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mb-4 text-lg text-neutral-200 italic">
              We are weaving together the many beautiful threads of Boulder into
              one Flower of Life field.
            </p>
            <p className="mb-8 text-lg font-semibold text-white">
              This isn&apos;t <span className="italic">our</span> party.
              It&apos;s <span className="italic">ours</span> to co-create.
            </p>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#facf39] to-[#f59e0b] font-bold text-black transition-all hover:scale-105 md:w-auto"
              style={{
                fontFamily: "Airwaves, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              Say Yes to the Frequency
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* How to Attend Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/40 bg-gradient-to-br from-[#facf39]/10 to-[#f59e0b]/10 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <Users className="h-8 w-8 text-[#facf39]" />
              <h2
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "Bourton, sans-serif" }}
              >
                How to Attend
              </h2>
            </div>
            <div className="mb-6 space-y-4 text-lg leading-relaxed text-neutral-200">
              <p className="text-2xl font-bold text-white">
                This party is free—because your presence{" "}
                <span className="italic">is</span> the gift.
              </p>
              <p className="text-xl font-bold text-[#facf39]">
                Your Entry = Joining the Skool Community + Bringing a Dish to
                Share
              </p>
              <p>
                This Skool group will be the living ecosystem of the New Earth
                Collective—a digital temple and sanctuary where we:
              </p>
              <ul className="space-y-2 pl-6">
                {[
                  "Connect with soul-aligned beings",
                  "Share & receive healing, guidance, and support",
                  "Activate purpose & amplify service",
                  "Host weekly connection calls, men&apos;s & women&apos;s circles, and more",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#facf39]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-semibold text-white">
                This in-person event is the{" "}
                <span className="text-[#facf39]">foundational heartbeat</span>{" "}
                of the digital New Earth Collective. YOU are the roots. And the
                world is waiting to bloom from what we grow together.
              </p>
            </div>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#facf39] to-[#f59e0b] font-bold text-black shadow-lg transition-all hover:scale-105"
              style={{
                fontFamily: "Airwaves, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              Enter the Portal
              <Star className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Final CTA Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <h2
              className="mb-6 text-3xl font-bold text-white md:text-4xl"
              style={{ fontFamily: "Bourton, sans-serif" }}
            >
              Come As You Are. Leave More Fully Yourself.
            </h2>
            <div className="mb-8 space-y-4 text-lg leading-relaxed text-neutral-300">
              <p>This is for the ones who feel the call.</p>
              <p>
                The ones who carry medicine in their voice, their touch, their
                laughter, their presence.
              </p>
              <p>The ones ready to live in rhythm with the New Earth.</p>
              <p className="text-xl font-semibold text-white">
                Sound like you?
              </p>
              <p className="text-white">
                Then come dance, dream, and create this vision with us.
              </p>
            </div>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#facf39] to-[#f59e0b] font-bold text-black transition-all hover:scale-105 md:w-auto"
              style={{
                fontFamily: "Airwaves, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              I&apos;m In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Final Details */}
      <section className="text-center">
        <Card className="border-2 border-[#facf39]/20 bg-black/60 shadow-lg backdrop-blur-md">
          <CardContent className="p-6">
            <div className="space-y-2 text-sm text-neutral-300">
              <p className="font-semibold text-[#facf39]">
                Skool Signup Required for Entry
              </p>
              <p>Bring a nourishing potluck dish to contribute</p>
              <p>
                Final party details will be shared via Partiful closer to the
                event
              </p>
            </div>
          </CardContent>
        </Card>
        <p
          className="mt-8 text-2xl text-neutral-300 italic"
          style={{ fontFamily: "Bourton, sans-serif" }}
        >
          Let&apos;s co-create Heaven on Earth, together. 🌿
        </p>
      </section>
    </>
  );
}
