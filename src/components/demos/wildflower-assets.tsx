"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface WildflowerAssetsProps {
  backHref?: string;
}

export function WildflowerAssets({ backHref }: WildflowerAssetsProps) {
  const colors = [
    { name: "Dusty Rose", hex: "#c4a69f", usage: "Hero, Section Backgrounds" },
    { name: "Cream", hex: "#ede6da", usage: "Page Background, Cards" },
    { name: "Camel", hex: "#b48c76", usage: "Primary / CTAs" },
    { name: "Chocolate", hex: "#7a5c4f", usage: "Body Text" },
    { name: "Chocolate Dark", hex: "#5a433a", usage: "Headings, Dark Sections" },
    { name: "Gold", hex: "#d4b483", usage: "Accents, Borders" },
    { name: "Gold Dark", hex: "#b8965c", usage: "Featured Badges" },
    { name: "Warm Brown", hex: "#8b6b5c", usage: "Section Transitions" },
  ];

  const images = [
    { src: "/wildflower/images/hero-hand.jpg", name: "Hero - Hand / Reach" },
    { src: "/wildflower/images/bloom.jpg", name: "Section Divider - Bloom" },
    { src: "/wildflower/images/texture-shadows.jpg", name: "Section Divider - Shadows" },
    { src: "/wildflower/images/kore.jpg", name: "About - Koré Portrait" },
  ];

  const additionalImages = [
    { src: "/wildflower/images/creamy white bloom.jpg", name: "Creamy White Bloom" },
    { src: "/wildflower/images/website.jpg", name: "Website Reference 1" },
    { src: "/wildflower/images/website2.jpg", name: "Website Reference 2" },
    { src: "/wildflower/images/website 3.jpg", name: "Website Reference 3" },
    { src: "/wildflower/images/website4.jpg", name: "Website Reference 4" },
    { src: "/wildflower/images/HERE Module 1.png", name: "HERE Module 1 Graphic" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Font injection for previews */}
      <style>{`
        @font-face { font-family: 'Moontime'; src: url('/wildflower/fonts/MoonTime-Regular.otf') format('opentype'); font-weight: normal; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Glacial Indifference'; src: url('/wildflower/fonts/GlacialIndifference-Regular.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Glacial Indifference'; src: url('/wildflower/fonts/GlacialIndifference-Bold.otf') format('opentype'); font-weight: 700; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Glacial Indifference'; src: url('/wildflower/fonts/GlacialIndifference-Italic.otf') format('opentype'); font-weight: 400; font-style: italic; font-display: swap; }
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

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{
              fontFamily: "Quattrocento Sans, serif",
              letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Brand Assets
          </h1>
          <p className="text-lg text-gray-400">
            Logo, colors, typography, and imagery for WildFlower Healing Co.
          </p>
        </div>

        {/* ── Logo ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Logo</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Light background */}
            <Card className="overflow-hidden border-0">
              <CardContent className="p-0">
                <div
                  className="flex h-40 items-center justify-center"
                  style={{ backgroundColor: "#ede6da" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/wildflower/brand/logo.svg"
                    alt="WildFlower Healing Co."
                    style={{ height: "64px" }}
                  />
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-sm text-gray-400">On Cream Background</p>
                </div>
              </CardContent>
            </Card>

            {/* Dark background */}
            <Card className="overflow-hidden border-0">
              <CardContent className="p-0">
                <div
                  className="flex h-40 items-center justify-center"
                  style={{ backgroundColor: "#5a433a" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/wildflower/brand/logo.svg"
                    alt="WildFlower Healing Co."
                    style={{ height: "64px", filter: "brightness(0) invert(1)", opacity: 0.9 }}
                  />
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-sm text-gray-400">On Dark Background (inverted)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="overflow-hidden border-0">
              <CardContent className="p-0">
                <div className="flex items-center gap-8 bg-white/5 p-6">
                  <div
                    className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "#ede6da" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/wildflower/brand/logo.svg"
                      alt="WildFlower Healing Co. Logo"
                      style={{ height: "48px" }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-white">Logo Mark</p>
                    <p className="text-sm text-gray-400">
                      SVG logo for WildFlower Healing Co. — botanical / organic aesthetic
                    </p>
                    <p className="mt-2 font-mono text-xs text-gray-500">
                      /wildflower/brand/logo.svg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Typography ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Typography</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Display / Headings */}
            <Card className="overflow-hidden border-0 bg-white/5">
              <CardContent className="p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Display / Headings
                </p>
                <p
                  className="mb-2 text-5xl"
                  style={{ fontFamily: "'Moontime', cursive", color: "#5a433a" }}
                >
                  Moontime
                </p>
                <p className="mb-4 text-sm text-gray-400">
                  Flowing script font for page titles and section headings
                </p>
                <div className="rounded-lg p-4" style={{ backgroundColor: "#ede6da" }}>
                  <p
                    className="text-4xl"
                    style={{ fontFamily: "'Moontime', cursive", color: "#5a433a" }}
                  >
                    HERE
                  </p>
                  <p
                    className="mt-1 text-2xl"
                    style={{ fontFamily: "'Moontime', cursive", color: "#5a433a" }}
                  >
                    Your Homecoming Awaits
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Body */}
            <Card className="overflow-hidden border-0 bg-white/5">
              <CardContent className="p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Body Text
                </p>
                <p
                  className="mb-2 text-3xl"
                  style={{ fontFamily: "'Glacial Indifference', sans-serif", color: "#7a5c4f" }}
                >
                  Glacial Indifference
                </p>
                <p className="mb-4 text-sm text-gray-400">
                  Clean geometric sans-serif for body copy and UI text
                </p>
                <div className="rounded-lg p-4" style={{ backgroundColor: "#ede6da" }}>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ fontFamily: "'Glacial Indifference', sans-serif", color: "#7a5c4f" }}
                  >
                    A trauma-informed homecoming into the safety of the present moment.
                    Reclaim your gifts, remember your power, embody your highest expression.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Font weights */}
          <div className="mt-6">
            <Card className="overflow-hidden border-0 bg-white/5">
              <CardContent className="p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Font Files &amp; Weights
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#c4a69f22" }}>
                    <p className="mb-2 font-medium text-white">Moontime</p>
                    <p
                      className="text-2xl"
                      style={{ fontFamily: "'Moontime', cursive", color: "#d4b483" }}
                    >
                      Regular (400)
                    </p>
                    <p className="mt-2 font-mono text-xs text-gray-500">MoonTime-Regular.otf</p>
                  </div>
                  <div className="space-y-3 rounded-lg p-4" style={{ backgroundColor: "#c4a69f22" }}>
                    <p className="mb-2 font-medium text-white">Glacial Indifference</p>
                    <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 400, color: "#d4b483" }}>
                      Regular (400)
                    </p>
                    <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 700, color: "#d4b483" }}>
                      Bold (700)
                    </p>
                    <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 400, fontStyle: "italic", color: "#d4b483" }}>
                      Italic (400)
                    </p>
                    <p className="mt-2 font-mono text-xs text-gray-500">
                      GlacialIndifference-Regular.otf / Bold.otf / Italic.otf
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Color Palette ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Color Palette</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((color) => (
              <Card key={color.hex} className="overflow-hidden border-0">
                <CardContent className="p-0">
                  <div className="h-24" style={{ backgroundColor: color.hex }} />
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

        {/* ── Hero & Section Images ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Key Images</h2>
          <p className="mb-6 text-gray-400">
            Primary images used across the landing page sections
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <Card key={image.src} className="overflow-hidden border-0">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-white/5">
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

        {/* ── Additional Images ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">Additional Assets</h2>
          <p className="mb-6 text-gray-400">
            Reference images and module graphics
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalImages.map((image) => (
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

        {/* ── Usage Guidelines ── */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-white">Usage Guidelines</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-0 bg-white/5">
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold text-white">Do&apos;s</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>&#10003; Use Moontime for large display headings only</li>
                  <li>&#10003; Use Glacial Indifference for all body text and UI</li>
                  <li>&#10003; Use warm earth tones — cream, dusty rose, chocolate</li>
                  <li>&#10003; Keep imagery soft, organic, and grounded</li>
                  <li>&#10003; Use gold accents sparingly for emphasis</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/5">
              <CardContent className="p-6">
                <h3 className="mb-3 font-semibold text-white">Don&apos;ts</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>&#10007; Don&apos;t use Moontime for body text or small sizes</li>
                  <li>&#10007; Don&apos;t introduce cool-toned blues or greens</li>
                  <li>&#10007; Don&apos;t use high-contrast neons or saturated colors</li>
                  <li>&#10007; Don&apos;t place chocolate text on dark chocolate backgrounds</li>
                  <li>&#10007; Don&apos;t distort or crop the SVG logo</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
