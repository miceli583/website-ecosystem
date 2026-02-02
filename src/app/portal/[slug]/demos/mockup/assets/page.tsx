"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Libre_Baskerville } from "next/font/google";

const serif = Libre_Baskerville({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

export default function CHW360AssetsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const colors = [
    { name: "Dark Teal", hex: "#2D5A5A", usage: "Nav, Footer, Headings" },
    { name: "Coral", hex: "#C9725B", usage: "CTAs, Accents" },
    { name: "Cream", hex: "#F5EDE6", usage: "Hero & Section Backgrounds" },
    { name: "Light Cream", hex: "#FAF7F4", usage: "Core Supports Background" },
    { name: "Container", hex: "#EDE4DA", usage: "Form Containers" },
    { name: "White", hex: "#FFFFFF", usage: "Cards, Form Fields" },
    { name: "Text Gray", hex: "#4A5568", usage: "Body Text" },
    { name: "Light Gray", hex: "#6B7280", usage: "Secondary Text" },
  ];

  const heroImages = [
    { src: "/chw/hero-image.png", name: "Hero - CHW with Tablet" },
    { src: "/chw/hero-2.jpg", name: "Hero - Team Portrait" },
    { src: "/chw/hero-3.jpg", name: "Hero - Team Collaboration" },
    { src: "/chw/hero-4.jpg", name: "Hero - Medical Team" },
  ];

  const icons = [
    { src: "/chw/icon-chw.png", name: "Community Health Workers" },
    { src: "/chw/icon-health.png", name: "Public Health Departments" },
    { src: "/chw/icon-training.png", name: "Training Programs" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className="border-b px-4 py-4 sm:px-6"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href={`/portal/${slug}/demos/mockup`}
            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Mockup Hub
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Brand Assets
          </h1>
          <p className="text-lg text-gray-400">
            Logo, colors, typography, and imagery for CHW360
          </p>
        </div>

        {/* Logo Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Logo</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Light Background */}
            <Card className="overflow-hidden border-0">
              <CardContent className="p-0">
                <div
                  className="flex h-40 items-center justify-center"
                  style={{ backgroundColor: "#F5EDE6" }}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src="/chw/logo.png"
                      alt="CHW360 Logo"
                      width={50}
                      height={50}
                    />
                    <span className="text-3xl tracking-tight" style={{ color: "#2D5A5A" }}>
                      <span className="font-semibold">CHW</span>
                      <span className="font-light" style={{ color: "#6B8A8A" }}>360</span>
                    </span>
                  </div>
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-sm text-gray-400">On Light Background</p>
                </div>
              </CardContent>
            </Card>

            {/* Dark Background */}
            <Card className="overflow-hidden border-0">
              <CardContent className="p-0">
                <div
                  className="flex h-40 items-center justify-center"
                  style={{ backgroundColor: "#2D5A5A" }}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src="/chw/logo.png"
                      alt="CHW360 Logo"
                      width={50}
                      height={50}
                    />
                    <span className="text-3xl tracking-tight text-white">
                      <span className="font-semibold">CHW</span>
                      <span className="font-light text-white/70">360</span>
                    </span>
                  </div>
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-sm text-gray-400">On Dark Background</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logo Icon Only */}
          <div className="mt-6">
            <Card className="overflow-hidden border-0">
              <CardContent className="p-0">
                <div className="flex items-center gap-8 bg-white/5 p-6">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "#F5EDE6" }}
                  >
                    <Image
                      src="/chw/logo.png"
                      alt="CHW360 Logo Icon"
                      width={60}
                      height={60}
                    />
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-white">Logo Icon</p>
                    <p className="text-sm text-gray-400">
                      5-petal pinwheel design representing community, diversity, and health
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      File: /chw/logo.png
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Typography</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Headings */}
            <Card className="overflow-hidden border-0 bg-white/5">
              <CardContent className="p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Headings
                </p>
                <p
                  className={`${serif.className} mb-2 text-3xl`}
                  style={{ color: "#2D5A5A" }}
                >
                  Libre Baskerville
                </p>
                <p className="mb-4 text-sm text-gray-400">
                  Classic serif font for headings and titles
                </p>
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#F5EDE6" }}
                >
                  <p
                    className={`${serif.className} text-2xl`}
                    style={{ color: "#2D5A5A" }}
                  >
                    Empowering Community
                    <br />
                    Health Workers
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Body Text */}
            <Card className="overflow-hidden border-0 bg-white/5">
              <CardContent className="p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Body Text
                </p>
                <p className="mb-2 text-3xl" style={{ color: "#4A5568" }}>
                  System Sans-Serif
                </p>
                <p className="mb-4 text-sm text-gray-400">
                  Clean, readable font for body copy
                </p>
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#F5EDE6" }}
                >
                  <p className="text-[15px] leading-relaxed" style={{ color: "#4A5568" }}>
                    CHW360 provides training, resources, and support to help
                    Community Health Workers learn, grow, and make a difference.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logo Text Style */}
          <div className="mt-6">
            <Card className="overflow-hidden border-0 bg-white/5">
              <CardContent className="p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Logo Text Style
                </p>
                <div className="flex items-center gap-8">
                  <div
                    className="rounded-lg px-6 py-4"
                    style={{ backgroundColor: "#2D5A5A" }}
                  >
                    <span className="text-2xl tracking-tight text-white">
                      <span className="font-semibold">CHW</span>
                      <span className="font-light text-white/70">360</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      <span className="text-white">CHW</span> → font-semibold (600)
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-white">360</span> → font-light (300), reduced opacity
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Color Palette</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((color) => (
              <Card key={color.hex} className="overflow-hidden border-0">
                <CardContent className="p-0">
                  <div
                    className="h-24"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="bg-white/10 p-4">
                    <p className="font-medium text-white">{color.name}</p>
                    <p className="font-mono text-sm text-gray-400">{color.hex}</p>
                    <p className="mt-1 text-xs text-gray-500">{color.usage}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hero Images Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Hero Images</h2>
          <p className="mb-6 text-gray-400">
            Rotating carousel images showcasing diverse healthcare workers
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {heroImages.map((image) => (
              <Card key={image.src} className="overflow-hidden border-0">
                <CardContent className="p-0">
                  <div className="relative h-40 bg-white/5">
                    <Image
                      src={image.src}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-white/10 p-3">
                    <p className="text-sm text-white">{image.name}</p>
                    <p className="mt-1 font-mono text-xs text-gray-500">{image.src}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Icons Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Audience Icons</h2>
          <p className="mb-6 text-gray-400">
            Illustrated icons for the &quot;Who It&apos;s For&quot; section
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {icons.map((icon) => (
              <Card key={icon.src} className="overflow-hidden border-0">
                <CardContent className="p-0">
                  <div
                    className="flex h-32 items-center justify-center"
                    style={{ backgroundColor: "#F5EDE6" }}
                  >
                    <div className="relative h-20 w-24">
                      <Image
                        src={icon.src}
                        alt={icon.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="bg-white/10 p-4">
                    <p className="font-medium text-white">{icon.name}</p>
                    <p className="mt-1 font-mono text-xs text-gray-500">{icon.src}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-white">Usage Guidelines</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-0 bg-white/5">
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold text-white">Do&apos;s</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Use Dark Teal for primary headings</li>
                  <li>✓ Use Coral for CTAs and interactive elements</li>
                  <li>✓ Maintain contrast between CHW (bold) and 360 (light)</li>
                  <li>✓ Use cream backgrounds for warm, welcoming feel</li>
                  <li>✓ Keep imagery diverse and inclusive</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/5">
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold text-white">Don&apos;ts</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✗ Don&apos;t use logo without the pinwheel icon</li>
                  <li>✗ Don&apos;t alter the color palette drastically</li>
                  <li>✗ Don&apos;t use italic styling on headings</li>
                  <li>✗ Don&apos;t place dark teal text on dark backgrounds</li>
                  <li>✗ Don&apos;t crop the logo icon</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
