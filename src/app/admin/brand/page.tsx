"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DomainLayout } from "~/components/domain-layout";
import { BackButton } from "~/components/back-button";
import {
  Download,
  Palette,
  FileType,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useState, Suspense } from "react";

const BRAND_ASSETS = {
  logos: {
    svg: [
      // CORE COLORS: Brand Identity Foundation

      // Pure Black (#000000)
      {
        name: "Brand Symbol on Black",
        file: "miracle-mind-orbit-star-v3.svg",
        bg: "black",
        description: "Orbit star symbol on pure black background",
        bgColors: ["#000000"],
      },
      {
        name: "Golden Logo on Black",
        file: "miracle-mind-logo-color.svg",
        bg: "black",
        description: "Primary gold logo on pure black",
        bgColors: ["#000000"],
      },
      {
        name: "White Logo on Black",
        file: "miracle-mind-logo-white.svg",
        bg: "black",
        description: "White logo on pure black",
        bgColors: ["#000000"],
      },
      {
        name: "Black Logo on Light Gray",
        file: "miracle-mind-logo-black.svg",
        bg: "light",
        description: "Black logo on light gray gradient",
        bgColors: ["#FFFFFF", "#f9fafb", "#fafafa"],
      },

      // Light Gray Gradient
      {
        name: "Brand Symbol on Light Gray",
        file: "miracle-mind-orbit-star-v3.svg",
        bg: "light",
        description: "Orbit star symbol on light gray gradient",
        bgColors: ["#FFFFFF", "#f9fafb", "#fafafa"],
      },
      {
        name: "Golden Logo on Light Gray",
        file: "miracle-mind-logo-color.svg",
        bg: "light",
        description: "Primary gold logo on light gray gradient",
        bgColors: ["#FFFFFF", "#f9fafb", "#fafafa"],
      },
      {
        name: "White Logo on Black",
        file: "miracle-mind-logo-white.svg",
        bg: "black",
        description: "White logo on pure black",
        bgColors: ["#000000"],
      },
      {
        name: "Black Logo on Light Gray",
        file: "miracle-mind-logo-black.svg",
        bg: "light",
        description: "Black logo on light gray gradient",
        bgColors: ["#FFFFFF", "#f9fafb", "#fafafa"],
      },

      // Primary Gold on Deep Blue
      {
        name: "Brand Symbol on Deep Blue",
        file: "miracle-mind-orbit-star-v3.svg",
        bg: "deep-blue",
        description: "Orbit star symbol on deep blue",
        bgColors: ["#121827"],
      },
      {
        name: "Golden Logo on Deep Blue",
        file: "miracle-mind-logo-color.svg",
        bg: "deep-blue",
        description: "Primary gold logo on deep blue",
        bgColors: ["#121827"],
      },
      {
        name: "White Logo on Deep Blue",
        file: "miracle-mind-logo-white.svg",
        bg: "deep-blue",
        description: "White logo on deep blue",
        bgColors: ["#121827"],
      },
      {
        name: "Black Logo on Light Blue",
        file: "miracle-mind-logo-black.svg",
        bg: "light-blue",
        description: "Black logo on light blue",
        bgColors: ["#e3f2fd"],
      },

      // SECONDARY COLORS: Brand Accent Palette

      // Burgundy (#6b1d36)
      {
        name: "Brand Symbol on Burgundy",
        file: "miracle-mind-orbit-star-v3.svg",
        bg: "burgundy",
        description: "Orbit star symbol on burgundy",
        bgColors: ["#6b1d36"],
      },
      {
        name: "Golden Logo on Burgundy",
        file: "miracle-mind-logo-color.svg",
        bg: "burgundy",
        description: "Primary gold logo on burgundy",
        bgColors: ["#6b1d36"],
      },
      {
        name: "White Logo on Burgundy",
        file: "miracle-mind-logo-white.svg",
        bg: "burgundy",
        description: "White logo on burgundy",
        bgColors: ["#6b1d36"],
      },
      {
        name: "Black Logo on Light Rose",
        file: "miracle-mind-logo-black.svg",
        bg: "light-rose",
        description: "Black logo on light rose",
        bgColors: ["#fce4ec"],
      },

      // Neutral Brown (#6B5640)
      {
        name: "Brand Symbol on Neutral Brown",
        file: "miracle-mind-orbit-star-v3.svg",
        bg: "neutral-brown",
        description: "Orbit star symbol on neutral brown",
        bgColors: ["#6B5640"],
      },
      {
        name: "Golden Logo on Neutral Brown",
        file: "miracle-mind-logo-color.svg",
        bg: "neutral-brown",
        description: "Primary gold logo on neutral brown",
        bgColors: ["#6B5640"],
      },
      {
        name: "White Logo on Neutral Brown",
        file: "miracle-mind-logo-white.svg",
        bg: "neutral-brown",
        description: "White logo on neutral brown",
        bgColors: ["#6B5640"],
      },
      {
        name: "Black Logo on Light Peach",
        file: "miracle-mind-logo-black.svg",
        bg: "light-peach",
        description: "Black logo on light peach",
        bgColors: ["#fdf0e6"],
      },

      // Deep Teal (#2C7873)
      {
        name: "Brand Symbol on Deep Teal",
        file: "miracle-mind-orbit-star-v3.svg",
        bg: "deep-teal",
        description: "Orbit star symbol on deep teal",
        bgColors: ["#2C7873"],
      },
      {
        name: "Golden Logo on Deep Teal",
        file: "miracle-mind-logo-color.svg",
        bg: "deep-teal",
        description: "Primary gold logo on deep teal",
        bgColors: ["#2C7873"],
      },
      {
        name: "White Logo on Deep Teal",
        file: "miracle-mind-logo-white.svg",
        bg: "deep-teal",
        description: "White logo on deep teal",
        bgColors: ["#2C7873"],
      },
      {
        name: "Black Logo on Light Teal",
        file: "miracle-mind-logo-black.svg",
        bg: "light-teal",
        description: "Black logo on light teal",
        bgColors: ["#e0f2f1"],
      },

      // BRAND GRADIENTS: Dynamic Expressions

      // Ember Glow (Light Gold → Burgundy)
      {
        name: "White Symbol on Ember Glow",
        file: "miracle-mind-orbit-star-v3-white.svg",
        bg: "gradient-rose-gold",
        description: "White orbit star symbol on ember glow gradient",
        bgColors: ["#F6E6C1", "#6b1d36"],
      },
      {
        name: "Black Logo on Ember Glow",
        file: "miracle-mind-logo-black.svg",
        bg: "gradient-rose-gold",
        description: "Black logo on ember glow gradient",
        bgColors: ["#F6E6C1", "#6b1d36"],
      },
      {
        name: "White Logo on Ember Glow",
        file: "miracle-mind-logo-white.svg",
        bg: "gradient-rose-gold",
        description: "White logo on ember glow gradient",
        bgColors: ["#F6E6C1", "#6b1d36"],
      },
      {
        name: "Black Logo on Ember Glow Light",
        file: "miracle-mind-logo-black.svg",
        bg: "gradient-rose-gold-light",
        description: "Black logo on light ember gradient",
        bgColors: ["#fef6ee", "#fef9f3"],
      },

      // North Star Glow (Golden Gradient)
      {
        name: "White Symbol on North Star Glow",
        file: "miracle-mind-orbit-star-v3-white.svg",
        bg: "gradient-golden-sunrise",
        description: "White orbit star symbol on north star glow",
        bgColors: ["#F6E6C1", "#D4AF37"],
      },
      {
        name: "Black Logo on North Star Glow",
        file: "miracle-mind-logo-black.svg",
        bg: "gradient-golden-sunrise",
        description: "Black logo on north star glow",
        bgColors: ["#F6E6C1", "#D4AF37"],
      },
      {
        name: "White Logo on North Star Glow",
        file: "miracle-mind-logo-white.svg",
        bg: "gradient-golden-sunrise",
        description: "White logo on north star glow",
        bgColors: ["#F6E6C1", "#D4AF37"],
      },
      {
        name: "Black Logo on North Star Glow Light",
        file: "miracle-mind-logo-black.svg",
        bg: "gradient-golden-sunrise-light",
        description: "Black logo on light golden gradient",
        bgColors: ["#fef3c7", "#ffedd5"],
      },

      // Golden Tide (Light Gold → Deep Teal)
      {
        name: "White Symbol on Golden Tide",
        file: "miracle-mind-orbit-star-v3-white.svg",
        bg: "gradient-gold-teal",
        description: "White orbit star symbol on golden tide gradient",
        bgColors: ["#F6E6C1", "#2C7873"],
      },
      {
        name: "Black Logo on Golden Tide",
        file: "miracle-mind-logo-black.svg",
        bg: "gradient-gold-teal",
        description: "Black logo on golden tide gradient",
        bgColors: ["#F6E6C1", "#2C7873"],
      },
      {
        name: "White Logo on Golden Tide",
        file: "miracle-mind-logo-white.svg",
        bg: "gradient-gold-teal",
        description: "White logo on golden tide gradient",
        bgColors: ["#F6E6C1", "#2C7873"],
      },
      {
        name: "Black Logo on Golden Tide Light",
        file: "miracle-mind-logo-black.svg",
        bg: "gradient-gold-teal-light",
        description: "Black logo on light teal gradient",
        bgColors: ["#f0fdf4", "#e0f2f1"],
      },

      // Midnight Gold (Light Gold → Deep Blue)
      {
        name: "White Symbol on Midnight Gold",
        file: "miracle-mind-orbit-star-v3-white.svg",
        bg: "gradient-gold-midnight",
        description: "White orbit star symbol on midnight gold gradient",
        bgColors: ["#F6E6C1", "#121827"],
      },
      {
        name: "Black Logo on Midnight Gold",
        file: "miracle-mind-logo-black.svg",
        bg: "gradient-gold-midnight",
        description: "Black logo on midnight gold gradient",
        bgColors: ["#F6E6C1", "#121827"],
      },
      {
        name: "White Logo on Midnight Gold",
        file: "miracle-mind-logo-white.svg",
        bg: "gradient-gold-midnight",
        description: "White logo on midnight gold gradient",
        bgColors: ["#F6E6C1", "#121827"],
      },
      {
        name: "Black Logo on Midnight Gold Light",
        file: "miracle-mind-logo-black.svg",
        bg: "gradient-gold-midnight-light",
        description: "Black logo on light blue gradient",
        bgColors: ["#eff6ff", "#dbeafe"],
      },
    ],
    png: [
      {
        name: "Brand Symbol on Black",
        file: "symbol.png",
        bg: "black",
        description: "Interconnected unity icon",
        bgColors: ["#000000"],
      },
      {
        name: "Golden Logo on Black",
        file: "Logo Files/png/Color logo - no background.png",
        bg: "black",
        description: "Primary golden logo",
        bgColors: ["#000000"],
      },
      {
        name: "White Logo on Black",
        file: "Logo Files/png/White logo - no background.png",
        bg: "black",
        description: "White version for dark backgrounds",
        bgColors: ["#000000"],
      },
      {
        name: "Black Logo on White Gradient",
        file: "Logo Files/png/Black logo - no background.png",
        bg: "light",
        description: "Black version for light backgrounds",
        bgColors: ["#FFFFFF", "#F5F5F5"],
      },
    ],
  },
  favicons: [
    {
      name: "Android",
      file: "Logo Files/Favicons/Android.png",
      size: "192x192",
    },
    { name: "iPhone", file: "Logo Files/Favicons/iPhone.png", size: "180x180" },
    { name: "Browser", file: "Logo Files/Favicons/browser.png", size: "32x32" },
  ],
  symbolDescription: {
    name: "Miracle Mind North Star",
    description:
      "A radiant golden north star representing guidance, clarity, and the miraculous potential of the mind",
  },
};

const FEATURED_LOGOS = [
  {
    name: "Miracle Mind - Golden",
    description: "Primary logo in brand Primary Gold (#D4AF37)",
    preview: "miracle-mind-logo-color.svg",
    backgroundClass: "bg-black",
    formats: {
      svg: "miracle-mind-logo-color.svg",
    },
  },
  {
    name: "Miracle Mind - White",
    description: "Warm Golden White (#FFF8E7) for dark backgrounds",
    preview: "miracle-mind-logo-white.svg",
    backgroundClass: "bg-black",
    formats: {
      svg: "miracle-mind-logo-white.svg",
    },
  },
  {
    name: "Miracle Mind - Black",
    description: "Warm Black (#0D0A08) for light backgrounds",
    preview: "miracle-mind-logo-black.svg",
    backgroundClass: "bg-gradient-to-br from-white via-gray-50 to-neutral-50",
    formats: {
      svg: "miracle-mind-logo-black.svg",
    },
  },
];

const getBackgroundClass = (bg: string) => {
  switch (bg) {
    case "deep-blue":
      return "bg-[#121827]";
    case "dark":
      return "bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-900";
    case "black":
      return "bg-black";
    case "light":
      return "bg-gradient-to-br from-white via-gray-50 to-neutral-50";
    case "green":
      return "bg-[#1a4d2e]";
    case "light-green":
      return "bg-[#d4edda]";
    case "navy":
      return "bg-[#1e3a5f]";
    case "light-blue":
      return "bg-[#e3f2fd]";
    case "warm-crimson":
      return "bg-[#8B2518]";
    case "burgundy":
      return "bg-[#6b1d36]";
    case "light-rose":
      return "bg-[#fce4ec]";
    case "purple":
      return "bg-[#4a148c]";
    case "light-purple":
      return "bg-[#f3e5f5]";
    case "deep-teal":
      return "bg-[#2C7873]";
    case "teal":
      return "bg-[#00695c]";
    case "light-teal":
      return "bg-[#e0f2f1]";
    case "sage":
      return "bg-[#7a9b8e]";
    case "light-sage":
      return "bg-[#e8ede8]";
    case "terracotta":
      return "bg-[#c1654a]";
    case "light-peach":
      return "bg-[#fdf0e6]";
    case "charcoal":
      return "bg-[#36454f]";
    case "soft-cream":
      return "bg-[#f9f6f0]";
    case "golden-mahogany":
      return "bg-[#704828]";
    case "neutral-brown":
      return "bg-[#6B5640]";
    case "sepia":
      return "bg-[#704214]";
    case "warm-brown":
      return "bg-[#6A4C32]";
    case "earth-brown":
      return "bg-[#5d4e37]";
    case "warm-sand":
      return "bg-[#f5e6d3]";
    case "dark-slate":
      return "bg-[#475569]";
    case "slate":
      return "bg-[#4a5568]";
    case "pale-gray":
      return "bg-[#f7f8f9]";
    case "olive":
      return "bg-[#556b2f]";
    case "light-olive":
      return "bg-[#f0f2e8]";
    case "cosmic-purple":
      return "bg-[#6d28d9]";
    case "soft-violet":
      return "bg-[#ede9fe]";
    case "cosmic-blue":
      return "bg-[#0891b2]";
    case "light-cyan":
      return "bg-[#ecfeff]";
    case "emerald":
      return "bg-[#059669]";
    case "light-emerald":
      return "bg-[#d1fae5]";
    case "sunset-orange":
      return "bg-[#ea580c]";
    case "light-amber":
      return "bg-[#fef3c7]";
    case "cosmic-pink":
      return "bg-[#db2777]";
    case "soft-pink":
      return "bg-[#fce7f3]";
    case "deep-indigo":
      return "bg-[#4338ca]";
    case "light-indigo":
      return "bg-[#e0e7ff]";
    case "gradient-violet-purple":
      return "bg-gradient-to-br from-[#8b5cf6] to-[#a855f7]";
    case "gradient-violet-purple-light":
      return "bg-gradient-to-br from-[#f5f3ff] to-[#faf5ff]";
    case "gradient-blue-cyan":
      return "bg-gradient-to-br from-[#3b82f6] to-[#06b6d4]";
    case "gradient-blue-cyan-light":
      return "bg-gradient-to-br from-[#dbeafe] to-[#cffafe]";
    case "gradient-amber-orange":
      return "bg-gradient-to-br from-[#f59e0b] to-[#f97316]";
    case "gradient-amber-orange-light":
      return "bg-gradient-to-br from-[#fef3c7] to-[#fed7aa]";
    case "gradient-purple-pink":
      return "bg-gradient-to-br from-[#a855f7] to-[#ec4899]";
    case "gradient-purple-pink-light":
      return "bg-gradient-to-br from-[#faf5ff] to-[#fce7f3]";
    case "gradient-emerald-teal":
      return "bg-gradient-to-br from-[#10b981] to-[#14b8a6]";
    case "gradient-emerald-teal-light":
      return "bg-gradient-to-br from-[#d1fae5] to-[#ccfbf1]";
    case "gradient-golden-sunrise":
      return "bg-gradient-to-br from-[#F6E6C1] to-[#D4AF37]";
    case "gradient-golden-sunrise-light":
      return "bg-gradient-to-br from-[#fef3c7] to-[#ffedd5]";
    case "gradient-gold-midnight":
      return "bg-gradient-to-br from-[#F6E6C1] to-[#121827]";
    case "gradient-gold-midnight-light":
      return "bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]";
    case "gradient-gold-teal":
      return "bg-gradient-to-br from-[#F6E6C1] to-[#2C7873]";
    case "gradient-gold-teal-light":
      return "bg-gradient-to-br from-[#f0fdf4] to-[#e0f2f1]";
    case "gradient-rose-gold":
      return "bg-gradient-to-br from-[#F6E6C1] to-[#6b1d36]";
    case "gradient-rose-gold-light":
      return "bg-gradient-to-br from-[#fef6ee] to-[#fef9f3]";
    case "gradient-ocean":
      return "bg-gradient-to-br from-[#1e3a8a] to-[#0f766e]";
    case "gradient-ocean-light":
      return "bg-gradient-to-br from-[#dbeafe] to-[#ccfbf1]";
    case "gradient-sunset-dusk":
      return "bg-gradient-to-br from-[#7c3aed] to-[#f97316]";
    case "gradient-sunset-dusk-light":
      return "bg-gradient-to-br from-[#f5f3ff] to-[#ffedd5]";
    case "gradient-earth-sky":
      return "bg-gradient-to-br from-[#065f46] to-[#0284c7]";
    case "gradient-earth-sky-light":
      return "bg-gradient-to-br from-[#d1fae5] to-[#e0f2fe]";
    case "gradient-dark":
      return "bg-gradient-to-br from-neutral-100 via-amber-50 to-neutral-100 dark:from-neutral-900 dark:via-amber-950 dark:to-neutral-900";
    case "gradient-light":
      return "bg-gradient-to-br from-amber-50 via-[#fdf1b2] to-[#fde7a4]";
    default:
      return "bg-gray-100 dark:bg-gray-900";
  }
};

function BrandPageContent() {
  const [activeFormat, setActiveFormat] = useState<"svg" | "png">("svg");

  const downloadLogoWithBackground = async (
    logoFile: string,
    logoName: string,
    bgColors: string[],
    isSymbol: boolean
  ) => {
    try {
      // Set dimensions based on type
      const width = isSymbol ? 1000 : 2000;
      const height = isSymbol ? 1000 : 1000;
      const padding = isSymbol ? 100 : 150;

      // Fetch the logo file (encode URI to handle spaces in path)
      const encodedPath = logoFile.split("/").map(encodeURIComponent).join("/");
      const response = await fetch(`/brand/${encodedPath}`);
      if (!response.ok) throw new Error("Failed to fetch logo");

      const isSvg = logoFile.endsWith(".svg");
      let imgElement: HTMLImageElement;

      if (isSvg) {
        // For SVG, convert to data URL
        const svgText = await response.text();
        const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);

        imgElement = document.createElement("img");
        imgElement.src = svgUrl;
      } else {
        // For PNG, create object URL from blob
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        imgElement = document.createElement("img");
        imgElement.src = imageUrl;
      }

      // Wait for image to load
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = reject;
      });

      // Create canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");

      canvas.width = width;
      canvas.height = height;

      // Draw background
      if (bgColors.length === 1) {
        ctx.fillStyle = bgColors[0]!;
        ctx.fillRect(0, 0, width, height);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, bgColors[0]!);
        gradient.addColorStop(1, bgColors[1]!);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Calculate dimensions to fit with padding
      const maxWidth = width - padding * 2;
      const maxHeight = height - padding * 2;

      let drawWidth = imgElement.naturalWidth || imgElement.width;
      let drawHeight = imgElement.naturalHeight || imgElement.height;

      // For SVG or if dimensions are 0, use the max available space
      if (drawWidth === 0 || drawHeight === 0) {
        drawWidth = maxWidth;
        drawHeight = maxHeight;
      }

      // Scale to fit - ensure we use maximum available space
      const scale = Math.min(maxWidth / drawWidth, maxHeight / drawHeight);
      drawWidth = drawWidth * scale;
      drawHeight = drawHeight * scale;

      // Center the image
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      ctx.drawImage(imgElement, x, y, drawWidth, drawHeight);

      // Clean up object URL
      URL.revokeObjectURL(imgElement.src);

      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${logoName.replace(/\s+/g, "-").toLowerCase()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error downloading logo:", error);
      alert("Failed to download logo. Please try again.");
    }
  };

  return (
    <DomainLayout>
      <BackButton href="/admin" />
      <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <section className="mb-20 text-center">
            <div className="mb-8 inline-flex items-center justify-center">
              <div className="relative h-20 w-20">
                <Image
                  src="/brand/miracle-mind-orbit-star-v3.svg"
                  alt="Miracle Mind Orbit Star"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <h1
              className="mb-4 text-7xl font-bold text-black uppercase dark:text-white"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Brand Assets
            </h1>
            <p
              className="mx-auto mb-8 max-w-2xl text-xl text-neutral-600 dark:text-neutral-400"
              style={{ fontFamily: "var(--font-muli)" }}
            >
              Technologies that make us more human
            </p>
            <div className="flex items-center justify-center gap-3">
              <Badge className="border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] dark:border-[#D4AF37]/30">
                <FileType className="mr-1.5 h-3.5 w-3.5" />
                SVG · PNG
              </Badge>
              <Badge className="border-black/20 bg-black/5 text-black dark:border-white/20 dark:bg-white/5 dark:text-white">
                <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                High Resolution
              </Badge>
            </div>
          </section>

          {/* Brand Symbol & Colors */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h2
                className="mb-3 text-5xl font-bold"
                style={{
                  fontFamily: "var(--font-muli)",
                  color: "#D4AF37",
                  letterSpacing: "0.02em",
                }}
              >
                Brand Identity
              </h2>
              <p
                className="text-lg text-neutral-600 dark:text-neutral-400"
                style={{ fontFamily: "var(--font-muli)" }}
              >
                Core visual elements and color palette
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Symbol */}
              <Card className="overflow-hidden border border-neutral-800 bg-black text-white shadow-lg dark:border-neutral-700 dark:bg-black">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3
                      className="mb-2 text-2xl font-semibold text-white"
                      style={{ fontFamily: "var(--font-muli)" }}
                    >
                      Brand Symbol
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Primary visual identity mark
                    </p>
                  </div>

                  <div className="mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-black via-neutral-900 to-black p-12">
                    <div className="relative h-48 w-48">
                      <Image
                        src="/brand/miracle-mind-orbit-star-v3.svg"
                        alt="Miracle Mind Orbit Star"
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-1 text-sm font-semibold text-white">
                        Miracle Mind Orbit Star
                      </p>
                      <p className="text-xs text-neutral-400">
                        Cosmic symbol with orbital rings and flowing spiral arms
                        in golden gradient
                      </p>
                    </div>
                    <div>
                      <a href="/brand/miracle-mind-orbit-star-v3.svg" download>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#D4AF37]/40 text-[#D4AF37] hover:border-[#DAA520] hover:text-white"
                        >
                          Download SVG
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Colors */}
              <Card className="overflow-hidden border border-neutral-800 bg-black text-white shadow-lg dark:border-neutral-700 dark:bg-black">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3
                      className="mb-2 text-2xl font-semibold text-white"
                      style={{ fontFamily: "var(--font-muli)" }}
                    >
                      Brand Colors
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Official color palette
                    </p>
                  </div>

                  {/* Two Column Layout for Colors */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Core Colors Column */}
                    <div className="space-y-4">
                      <div className="mb-2">
                        <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                          Core Colors
                        </p>
                      </div>

                      {/* Gold */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{ backgroundColor: "#D4AF37" }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            #D4AF37
                          </p>
                          <p className="text-xs text-neutral-400">
                            Primary Gold
                          </p>
                        </div>
                      </div>

                      {/* Pure Black */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{ backgroundColor: "#000000" }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            #000000
                          </p>
                          <p className="text-xs text-neutral-400">Pure Black</p>
                        </div>
                      </div>

                      {/* Light Gray Gradient */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{
                            background:
                              "linear-gradient(to bottom right, #FFFFFF, #f9fafb, #fafafa)",
                          }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            Light Gray
                          </p>
                          <p className="text-xs text-neutral-400">Gradient</p>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Colors Column */}
                    <div className="space-y-4">
                      <div className="mb-2">
                        <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                          Secondary Colors
                        </p>
                      </div>

                      {/* Burgundy */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{ backgroundColor: "#6b1d36" }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            #6b1d36
                          </p>
                          <p className="text-xs text-neutral-400">Burgundy</p>
                        </div>
                      </div>

                      {/* Neutral Brown */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{ backgroundColor: "#6B5640" }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            #6B5640
                          </p>
                          <p className="text-xs text-neutral-400">
                            Neutral Brown
                          </p>
                        </div>
                      </div>

                      {/* Deep Teal */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{ backgroundColor: "#2C7873" }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            #2C7873
                          </p>
                          <p className="text-xs text-neutral-400">Deep Teal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gradients Section */}
                  <div className="mt-8">
                    <div className="mb-4">
                      <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                        Brand Gradients
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Ember Glow */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{
                            background:
                              "linear-gradient(135deg, #F6E6C1 0%, #6b1d36 100%)",
                          }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            Ember Glow
                          </p>
                          <p className="text-xs text-neutral-400">
                            Light Gold → Burgundy
                          </p>
                        </div>
                      </div>

                      {/* North Star Glow */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{
                            background:
                              "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                          }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            North Star Glow
                          </p>
                          <p className="text-xs text-neutral-400">
                            Light Gold → Gold
                          </p>
                        </div>
                      </div>

                      {/* Golden Tide */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{
                            background:
                              "linear-gradient(135deg, #F6E6C1 0%, #2C7873 100%)",
                          }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            Golden Tide
                          </p>
                          <p className="text-xs text-neutral-400">
                            Light Gold → Teal
                          </p>
                        </div>
                      </div>

                      {/* Midnight Gold */}
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                          style={{
                            background:
                              "linear-gradient(135deg, #F6E6C1 0%, #121827 100%)",
                          }}
                        />
                        <div>
                          <p className="font-mono text-xs font-semibold text-white">
                            Midnight Gold
                          </p>
                          <p className="text-xs text-neutral-400">
                            Light Gold → Deep Blue
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-neutral-800 pt-6 dark:border-neutral-700">
                    <h4
                      className="mb-3 text-sm font-semibold text-white"
                      style={{ fontFamily: "var(--font-muli)" }}
                    >
                      Typography
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">
                          Primary (Titles):
                        </span>
                        <span
                          className="font-medium text-white"
                          style={{
                            fontFamily: "var(--font-quattrocento-sans)",
                          }}
                        >
                          Quattrocento Sans
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">
                          Secondary (Subtitles):
                        </span>
                        <span
                          className="text-white"
                          style={{
                            fontFamily: "var(--font-muli)",
                            fontWeight: 300,
                          }}
                        >
                          Barlow Light
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">
                          Body (Paragraphs):
                        </span>
                        <span
                          className="font-medium text-white"
                          style={{ fontFamily: "var(--font-geist-sans)" }}
                        >
                          Geist
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <div className="mb-6 text-center">
                <h3
                  className="text-3xl font-semibold"
                  style={{
                    fontFamily: "var(--font-quattrocento-sans)",
                    color: "#D4AF37",
                    letterSpacing: "0.02em",
                  }}
                >
                  Signature Logos
                </h3>
                <p
                  className="text-sm text-neutral-600 dark:text-neutral-400"
                  style={{ fontFamily: "var(--font-muli)" }}
                >
                  Available for download in SVG and PNG
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {FEATURED_LOGOS.map((logo) => (
                  <Card
                    key={logo.name}
                    className="overflow-hidden border border-neutral-800 bg-black text-white shadow-lg dark:border-neutral-700 dark:bg-black"
                  >
                    <CardContent className="p-0">
                      <div
                        className={`flex h-64 items-center justify-center p-10 ${logo.backgroundClass}`}
                      >
                        <div
                          className="relative w-full"
                          style={{ height: "100%", maxWidth: "100%" }}
                        >
                          <Image
                            src={`/brand/${logo.preview}`}
                            alt={logo.name}
                            fill
                            className="object-contain drop-shadow-2xl"
                            style={{ objectPosition: "center center" }}
                          />
                        </div>
                      </div>
                      <div className="space-y-4 border-t border-neutral-800 bg-neutral-950/60 p-5">
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {logo.name}
                          </h4>
                          <p className="text-xs text-neutral-400">
                            {logo.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(logo.formats).map(
                            ([format, file]) => (
                              <a key={format} href={`/brand/${file}`} download>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#D4AF37]/40 text-[#D4AF37] hover:border-[#DAA520] hover:text-white"
                                >
                                  {format.toUpperCase()}
                                </Button>
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Logo Variations */}
          <section className="mb-12">
            <div className="mb-8 text-center">
              <h2
                className="mb-3 text-5xl font-bold"
                style={{
                  fontFamily: "var(--font-quattrocento-sans)",
                  color: "#D4AF37",
                  letterSpacing: "0.02em",
                }}
              >
                Logo Variations
              </h2>
              <p
                className="text-lg text-neutral-600 dark:text-neutral-400"
                style={{ fontFamily: "var(--font-muli)" }}
              >
                Explore our complete color palette collection
              </p>
            </div>

            {/* Logo Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {BRAND_ASSETS.logos.svg.map((logo, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border border-neutral-800 bg-black text-white shadow-lg transition-all duration-300 hover:scale-105 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 dark:border-neutral-700 dark:bg-black"
                >
                  <CardContent className="p-0">
                    {/* Preview Area */}
                    <div
                      className={`relative flex h-56 items-center justify-center p-8 ${getBackgroundClass(logo.bg)}`}
                    >
                      <div
                        className="relative w-full"
                        style={{ height: "100%", maxWidth: "100%" }}
                      >
                        <Image
                          src={`/brand/${logo.file}`}
                          alt={logo.name}
                          fill
                          className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                          style={{ objectPosition: "center center" }}
                        />
                      </div>
                    </div>

                    {/* Info Area */}
                    <div className="space-y-4 border-t border-neutral-800 bg-neutral-950/60 p-5">
                      <div>
                        <h3 className="mb-1 font-semibold text-white">
                          {logo.name}
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {logo.description}
                        </p>
                      </div>

                      {/* Background Colors and Download */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line */}
                          {(logo as any).bgColors
                            ?.filter(
                              (color: string, idx: number, arr: string[]) =>
                                arr.length !== 3 || idx !== 1
                            )
                            .map((color: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5"
                              >
                                <div
                                  className="h-4 w-4 rounded border border-neutral-600"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="font-mono text-xs text-neutral-400">
                                  {color}
                                </span>
                              </div>
                            ))}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 border-[#D4AF37]/40 p-0 text-[#D4AF37] hover:border-[#DAA520] hover:bg-[#D4AF37]/10 hover:text-white"
                          onClick={() => {
                            // Determine if this is a symbol or logo
                            const isSymbol = logo.file.includes("orbit-star");
                            downloadLogoWithBackground(
                              logo.file,
                              logo.name,
                              logo.bgColors || ["#000000"],
                              isSymbol
                            );
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Usage Guidelines */}
          <section>
            <Card className="overflow-hidden border-2 border-[#facf39]/20 bg-gradient-to-br from-white to-neutral-50 shadow-lg dark:from-neutral-900 dark:to-black">
              <CardContent className="p-10">
                <div className="flex items-start gap-6">
                  <div className="relative h-16 w-16 shrink-0">
                    <Image
                      src="/brand/miracle-mind-orbit-star-v3.svg"
                      alt="Miracle Mind"
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <h3
                      className="mb-3 text-3xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-quattrocento-sans)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      Brand Guidelines
                    </h3>
                    <div className="space-y-3 text-neutral-700 dark:text-neutral-300">
                      <p>
                        These brand assets are the visual foundation of Miracle
                        Mind. Please maintain proper spacing and avoid altering
                        logo colors or proportions.
                      </p>
                      <p className="font-semibold" style={{ color: "#D4AF37" }}>
                        Best Practices: Use SVG for web applications and PNG for
                        presentations and social media.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </DomainLayout>
  );
}

export default function BrandPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <BrandPageContent />
    </Suspense>
  );
}
