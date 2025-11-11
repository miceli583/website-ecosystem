"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { ArrowRight, Users, Heart, Sparkles, Star, Zap } from "lucide-react";

export function JoinCommunity1Content() {
  return (
    <>
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="relative h-20 w-20 drop-shadow-2xl">
            <Image
              src="/brand/symbol.svg"
              alt="New Earth Collective"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h1
          className="mb-4 text-6xl font-bold text-white drop-shadow-2xl md:text-7xl"
          style={{ fontFamily: "Bourton, sans-serif" }}
        >
          THE NEW EARTH
          <br />
          COLLECTIVE
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-2xl text-neutral-300 italic">
          A global sanctuary for awakened souls ready to connect, co-create, and
          rise together.
        </p>
        <Button
          size="lg"
          className="group bg-gradient-to-r from-[#facf39] to-[#f59e0b] px-8 py-6 text-lg font-bold text-black shadow-2xl transition-all hover:scale-105 hover:shadow-[#facf39]/50"
          style={{
            fontFamily: "Airwaves, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          Join the Waitlist
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </section>

      {/* You're Not Alone Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <Heart className="h-8 w-8 text-[#facf39]" />
              <h2
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "Bourton, sans-serif" }}
              >
                You&apos;re Not Alone. You&apos;re Early.
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-neutral-300">
              <p>The world has changed. You feel it.</p>
              <p>
                You&apos;ve started waking up. You see through the old systems.
                You crave real connection and a place to belong.
              </p>
              <p className="font-semibold text-white">This is that place.</p>
              <p>
                The <span className="text-[#facf39]">New Earth Collective</span>{" "}
                is a grounded, heart-led digital community built for people on
                the path of awakening. A space to meet others who get it, share
                your truth, and be supported while stepping into the next
                version of you.
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
                Be First In Line
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* What Is Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <Users className="h-8 w-8 text-[#facf39]" />
              <h2
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "Bourton, sans-serif" }}
              >
                What Is the New Earth Collective?
              </h2>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-neutral-300">
              An online Skool community where seekers, healers, creatives, and
              conscious humans gather to grow and serve—together.
            </p>
            <div className="mb-6">
              <p className="mb-4 text-lg font-semibold text-white">
                Inside, you&apos;ll find:
              </p>
              <ul className="space-y-3">
                {[
                  "Weekly community calls to connect and be seen",
                  "Bi-weekly men&apos;s and women&apos;s circles",
                  "Relationship coaching calls for real partnership",
                  "Guided breathwork, meditations, astrology & more",
                  "A space to offer your gifts and receive others&apos;",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Sparkles className="mt-1 h-5 w-5 shrink-0 text-[#facf39]" />
                    <span className="text-lg text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mb-8 text-lg font-semibold text-white italic">
              It&apos;s not just content. It&apos;s connection.
            </p>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#facf39] to-[#f59e0b] font-bold text-black transition-all hover:scale-105 md:w-auto"
              style={{
                fontFamily: "Airwaves, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              Save Your Spot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Founding Member Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/40 bg-gradient-to-br from-[#facf39]/10 to-[#f59e0b]/10 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <Star className="h-8 w-8 text-[#facf39]" />
              <h2
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "Bourton, sans-serif" }}
              >
                Become a Founding Member
              </h2>
            </div>
            <div className="mb-6 space-y-4 text-lg leading-relaxed text-neutral-200">
              <p className="text-2xl font-bold text-[#facf39]">
                The first 100 members get free lifetime access to everything.
              </p>
              <p>
                After that, it becomes $20/month, and will rise as the community
                grows.
              </p>
              <p className="font-semibold text-white">
                Act now, and you become a foundational part of something
                designed to last.
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
              Claim Lifetime Access
              <Star className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Why This, Why Now Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <Zap className="h-8 w-8 text-[#facf39]" />
              <h2
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "Bourton, sans-serif" }}
              >
                Why This, Why Now?
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-neutral-300">
              <p>Because awakening alone is hard.</p>
              <p>Because your voice, gifts, and presence matter.</p>
              <p>
                Because the world needs communities built on truth, connection,
                and mutual support.
              </p>
              <p className="text-xl font-bold text-white">
                This isn&apos;t just a group. It&apos;s a movement.
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
                Join the Movement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Who Is This For Section */}
      <section className="mb-20">
        <Card className="border-2 border-[#facf39]/20 bg-black/60 shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <h2
              className="mb-6 text-3xl font-bold text-white md:text-4xl"
              style={{ fontFamily: "Bourton, sans-serif" }}
            >
              Who Is This For?
            </h2>
            <ul className="mb-8 space-y-3">
              {[
                "The seekers who feel like outsiders",
                "The newly awakened looking for direction",
                "The empaths and artists ready to be seen",
                "The quiet leaders who know they came here for more",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 shrink-0 text-[#facf39]" />
                  <span className="text-lg text-neutral-300">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mb-8 text-lg font-semibold text-white">
              If that&apos;s you, this is your space.
            </p>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#facf39] to-[#f59e0b] font-bold text-black transition-all hover:scale-105 md:w-auto"
              style={{
                fontFamily: "Airwaves, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              Enter the Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="text-center">
        <p
          className="mb-6 text-2xl text-neutral-300 italic"
          style={{ fontFamily: "Bourton, sans-serif" }}
        >
          The New Earth is here. Let&apos;s build it together.
        </p>
        <Badge className="border-[#facf39]/40 bg-[#facf39]/10 px-4 py-2 text-sm text-[#facf39]">
          <Sparkles className="mr-2 h-4 w-4" />
          First 100 Members Get Lifetime Free Access
        </Badge>
      </section>
    </>
  );
}
