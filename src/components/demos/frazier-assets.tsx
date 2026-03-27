"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface FrazierAssetsProps {
  backHref?: string;
}

export function FrazierAssets({ backHref }: FrazierAssetsProps) {
  const colors = [
    { name: "Dark Brown", hex: "#483932", usage: "Headings, Dark Backgrounds" },
    {
      name: "Burnt Copper",
      hex: "#A45A11",
      usage: "Links, CTAs, Accent Color",
    },
    { name: "Warm Cream", hex: "#f8f2eb", usage: "Page Backgrounds, Cards" },
    { name: "Off White", hex: "#FCFCFC", usage: "Light Backgrounds" },
    { name: "Medium Brown", hex: "#5a5550", usage: "Secondary Text, Borders" },
    { name: "Sage Green", hex: "#CAE2C7", usage: "Accent Backgrounds" },
    { name: "Dark Sage", hex: "#596359", usage: "Secondary Green Accents" },
    { name: "Tan", hex: "#938275", usage: "Borders, Decorative" },
    {
      name: "Orange Hover",
      hex: "#f37600",
      usage: "Hover States, Active Links",
    },
    { name: "Light Beige", hex: "#E7DBD1", usage: "Background Accents" },
  ];

  const heroImages = [
    { src: "/frazier-dentistry/home-hero-1.jpg", name: "Home Hero 1" },
    { src: "/frazier-dentistry/home-hero-2.jpg", name: "Home Hero 2" },
    { src: "/frazier-dentistry/home-hero-2.jpeg", name: "Home Hero 2 (alt)" },
    { src: "/frazier-dentistry/home-hero-3.jpg", name: "Home Hero 3" },
    { src: "/frazier-dentistry/home-hero-4.jpg", name: "Home Hero 4" },
  ];

  const teamImages = [
    {
      src: "/frazier-dentistry/meet-dr-frazier.jpg",
      name: "Dr. Karla Frazier",
    },
    {
      src: "/frazier-dentistry/meet-our-team-drfrazier.jpg",
      name: "Dr. Frazier (Team)",
    },
    {
      src: "/frazier-dentistry/meet-our-team-letitia-wilkins.jpg",
      name: "Letitia Wilkins",
    },
    {
      src: "/frazier-dentistry/meet-our-team-juli-martinez.jpg",
      name: "Juli Martinez",
    },
    {
      src: "/frazier-dentistry/meet-our-team-cindy-reyes.jpg",
      name: "Cindy Reyes",
    },
    {
      src: "/frazier-dentistry/meet-our-team-carissa-felix.jpg",
      name: "Carissa Felix",
    },
    {
      src: "/frazier-dentistry/meet-our-team-katie-schulte.jpg",
      name: "Katie Schulte",
    },
  ];

  const blogImages = [
    {
      src: "/frazier-dentistry/hom-and-blog-welcometoourblog-whymoisturize.jpg",
      name: "Blog — Why Moisturize",
    },
    {
      src: "/frazier-dentistry/homeandblog-dentalimplants.jpg",
      name: "Blog — Dental Implants",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Google Fonts for previews */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,700;1,400;1,700&family=Lobster+Two:wght@700&display=swap');
      `}</style>

      {/* Header */}
      {backHref && (
        <header
          className="border-b px-4 py-4 sm:px-6"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Demos
            </Link>
          </div>
        </header>
      )}

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Title */}
        <div className="mb-10 text-center">
          <h1
            className="mb-2 text-3xl font-bold tracking-wide sm:text-4xl"
            style={{ color: "#A45A11" }}
          >
            Frazier Dentistry
          </h1>
          <p className="text-gray-400">Brand Assets &amp; Style Guide</p>
        </div>

        {/* Logo */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">Logo</h2>
          <Card className="border-white/10 bg-white/5">
            <CardContent className="flex items-center justify-center p-8">
              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: "#f8f2eb" }}
              >
                <Image
                  src="/frazier-dentistry/frazier-dentistry-logo.png"
                  alt="Frazier Dentistry Logo"
                  width={300}
                  height={120}
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {colors.map((c) => (
              <Card key={c.hex} className="border-white/10 bg-white/5">
                <CardContent className="p-3">
                  <div
                    className="mb-2 h-16 w-full rounded-md"
                    style={{ backgroundColor: c.hex }}
                  />
                  <p className="text-xs font-medium text-white">{c.name}</p>
                  <p className="font-mono text-xs text-gray-500">{c.hex}</p>
                  <p className="mt-1 text-xs text-gray-400">{c.usage}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">Typography</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Display / Decorative
                </p>
                <p
                  className="text-3xl"
                  style={{
                    fontFamily: "'Lobster Two', cursive",
                    color: "#A45A11",
                  }}
                >
                  Lobster Two
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Used for headings and decorative elements. Weight 700.
                </p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Body / UI
                </p>
                <p
                  className="text-3xl"
                  style={{
                    fontFamily: "'Cabin', sans-serif",
                    color: "#483932",
                  }}
                >
                  Cabin
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Primary body and interface font. Weights 400, 400i, 700, 700i.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Hero Images */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">Hero Images</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heroImages.map((img) => (
              <Card
                key={img.src}
                className="overflow-hidden border-white/10 bg-white/5"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={img.src}
                    alt={img.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-400">{img.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Photos */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">Team Photos</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {teamImages.map((img) => (
              <Card
                key={img.src}
                className="overflow-hidden border-white/10 bg-white/5"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={img.src}
                    alt={img.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-400">{img.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Blog Images */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">Blog Images</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {blogImages.map((img) => (
              <Card
                key={img.src}
                className="overflow-hidden border-white/10 bg-white/5"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={img.src}
                    alt={img.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-400">{img.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Brand Notes */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">Brand Notes</h2>
          <Card className="border-white/10 bg-white/5">
            <CardContent className="space-y-3 p-6 text-sm text-gray-300">
              <p>
                <span className="font-medium text-white">Tone:</span> Warm,
                professional, welcoming. Earthy brown/cream palette with copper
                accents.
              </p>
              <p>
                <span className="font-medium text-white">Practice:</span>{" "}
                Frazier Dentistry — Austin, TX. Led by Dr. Karla Frazier.
                General, cosmetic, laser, and same-day CAD/CAM dentistry.
              </p>
              <p>
                <span className="font-medium text-white">Taglines:</span>{" "}
                &quot;Professional, Compassionate Care&quot; · &quot;Everyone
                deserves a radiant, healthy smile&quot; · &quot;Help them get
                their life smile&quot;
              </p>
              <p>
                <span className="font-medium text-white">Contact:</span> (512)
                453-3879 · 7333 E. US Hwy. 290, Austin, TX 78723 ·
                contactus@drkarlafrazier.com
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
