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
import { useState } from "react";

const BRAND_ASSETS = {
  logos: {
    svg: [
      // CLASSIC: Black & White
      {
        name: "Brand Symbol on Black",
        file: "symbol.svg",
        bg: "black",
        description: "Interconnected unity icon",
        bgColors: ["#000000"],
      },
      {
        name: "Golden Logo on Black",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "black",
        description: "Primary golden logo",
        bgColors: ["#000000"],
      },
      {
        name: "White Logo on Black",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "black",
        description: "White version for dark backgrounds",
        bgColors: ["#000000"],
      },
      {
        name: "Black Logo on White Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light",
        description: "Black version for light backgrounds",
        bgColors: ["#FFFFFF", "#F5F5F5"],
      },

      // EARTH TONES: Grounded & Natural
      {
        name: "Brand Symbol on Sage",
        file: "symbol.svg",
        bg: "sage",
        description: "Interconnected unity icon",
        bgColors: ["#7a9b8e"],
      },
      {
        name: "Golden Logo on Sage",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "sage",
        description: "Primary golden logo",
        bgColors: ["#7a9b8e"],
      },
      {
        name: "White Logo on Sage",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "sage",
        description: "White version for dark backgrounds",
        bgColors: ["#7a9b8e"],
      },
      {
        name: "Black Logo on Light Sage",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-sage",
        description: "Black version for light backgrounds",
        bgColors: ["#e8ede8"],
      },
      {
        name: "Brand Symbol on Terracotta",
        file: "symbol.svg",
        bg: "terracotta",
        description: "Interconnected unity icon",
        bgColors: ["#c1654a"],
      },
      {
        name: "Golden Logo on Terracotta",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "terracotta",
        description: "Primary golden logo",
        bgColors: ["#c1654a"],
      },
      {
        name: "White Logo on Terracotta",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "terracotta",
        description: "White version for dark backgrounds",
        bgColors: ["#c1654a"],
      },
      {
        name: "Black Logo on Light Peach",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-peach",
        description: "Black version for light backgrounds",
        bgColors: ["#fdf0e6"],
      },
      {
        name: "Brand Symbol on Earth Brown",
        file: "symbol.svg",
        bg: "earth-brown",
        description: "Interconnected unity icon",
        bgColors: ["#5d4e37"],
      },
      {
        name: "Golden Logo on Earth Brown",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "earth-brown",
        description: "Primary golden logo",
        bgColors: ["#5d4e37"],
      },
      {
        name: "White Logo on Earth Brown",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "earth-brown",
        description: "White version for dark backgrounds",
        bgColors: ["#5d4e37"],
      },
      {
        name: "Black Logo on Warm Sand",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "warm-sand",
        description: "Black version for light backgrounds",
        bgColors: ["#f5e6d3"],
      },
      {
        name: "Brand Symbol on Deep Olive",
        file: "symbol.svg",
        bg: "olive",
        description: "Interconnected unity icon",
        bgColors: ["#556b2f"],
      },
      {
        name: "Golden Logo on Deep Olive",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "olive",
        description: "Primary golden logo",
        bgColors: ["#556b2f"],
      },
      {
        name: "White Logo on Deep Olive",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "olive",
        description: "White version for dark backgrounds",
        bgColors: ["#556b2f"],
      },
      {
        name: "Black Logo on Light Olive",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-olive",
        description: "Black version for light backgrounds",
        bgColors: ["#f0f2e8"],
      },

      // SOPHISTICATED NEUTRALS: Elegant Simplicity
      {
        name: "Brand Symbol on Charcoal",
        file: "symbol.svg",
        bg: "charcoal",
        description: "Interconnected unity icon",
        bgColors: ["#36454f"],
      },
      {
        name: "Golden Logo on Charcoal",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "charcoal",
        description: "Primary golden logo",
        bgColors: ["#36454f"],
      },
      {
        name: "White Logo on Charcoal",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "charcoal",
        description: "White version for dark backgrounds",
        bgColors: ["#36454f"],
      },
      {
        name: "Black Logo on Soft Cream",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "soft-cream",
        description: "Black version for light backgrounds",
        bgColors: ["#f9f6f0"],
      },
      {
        name: "Brand Symbol on Slate",
        file: "symbol.svg",
        bg: "slate",
        description: "Interconnected unity icon",
        bgColors: ["#4a5568"],
      },
      {
        name: "Golden Logo on Slate",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "slate",
        description: "Primary golden logo",
        bgColors: ["#4a5568"],
      },
      {
        name: "White Logo on Slate",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "slate",
        description: "White version for dark backgrounds",
        bgColors: ["#4a5568"],
      },
      {
        name: "Black Logo on Pale Gray",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "pale-gray",
        description: "Black version for light backgrounds",
        bgColors: ["#f7f8f9"],
      },

      // JEWEL TONES: Rich & Prestigious
      {
        name: "Brand Symbol on Forest Green",
        file: "symbol.svg",
        bg: "green",
        description: "Interconnected unity icon",
        bgColors: ["#1a4d2e"],
      },
      {
        name: "Golden Logo on Forest Green",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "green",
        description: "Primary golden logo",
        bgColors: ["#1a4d2e"],
      },
      {
        name: "White Logo on Forest Green",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "green",
        description: "White version for dark backgrounds",
        bgColors: ["#1a4d2e"],
      },
      {
        name: "Black Logo on Light Green",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-green",
        description: "Black version for light backgrounds",
        bgColors: ["#d4edda"],
      },
      {
        name: "Brand Symbol on Teal",
        file: "symbol.svg",
        bg: "teal",
        description: "Interconnected unity icon",
        bgColors: ["#00695c"],
      },
      {
        name: "Golden Logo on Teal",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "teal",
        description: "Primary golden logo",
        bgColors: ["#00695c"],
      },
      {
        name: "White Logo on Teal",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "teal",
        description: "White version for dark backgrounds",
        bgColors: ["#00695c"],
      },
      {
        name: "Black Logo on Light Teal",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-teal",
        description: "Black version for light backgrounds",
        bgColors: ["#e0f2f1"],
      },
      {
        name: "Brand Symbol on Navy Blue",
        file: "symbol.svg",
        bg: "navy",
        description: "Interconnected unity icon",
        bgColors: ["#1e3a5f"],
      },
      {
        name: "Golden Logo on Navy Blue",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "navy",
        description: "Primary golden logo",
        bgColors: ["#1e3a5f"],
      },
      {
        name: "White Logo on Navy Blue",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "navy",
        description: "White version for dark backgrounds",
        bgColors: ["#1e3a5f"],
      },
      {
        name: "Black Logo on Light Blue",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-blue",
        description: "Black version for light backgrounds",
        bgColors: ["#e3f2fd"],
      },
      {
        name: "Brand Symbol on Deep Purple",
        file: "symbol.svg",
        bg: "purple",
        description: "Interconnected unity icon",
        bgColors: ["#4a148c"],
      },
      {
        name: "Golden Logo on Deep Purple",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "purple",
        description: "Primary golden logo",
        bgColors: ["#4a148c"],
      },
      {
        name: "White Logo on Deep Purple",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "purple",
        description: "White version for dark backgrounds",
        bgColors: ["#4a148c"],
      },
      {
        name: "Black Logo on Light Purple",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-purple",
        description: "Black version for light backgrounds",
        bgColors: ["#f3e5f5"],
      },
      {
        name: "Brand Symbol on Burgundy",
        file: "symbol.svg",
        bg: "burgundy",
        description: "Interconnected unity icon",
        bgColors: ["#6b1d36"],
      },
      {
        name: "Golden Logo on Burgundy",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "burgundy",
        description: "Primary golden logo",
        bgColors: ["#6b1d36"],
      },
      {
        name: "White Logo on Burgundy",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "burgundy",
        description: "White version for dark backgrounds",
        bgColors: ["#6b1d36"],
      },
      {
        name: "Black Logo on Light Rose",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-rose",
        description: "Black version for light backgrounds",
        bgColors: ["#fce4ec"],
      },

      // COSMIC VIBRANT: Modern Energy
      {
        name: "Brand Symbol on Cosmic Purple",
        file: "symbol.svg",
        bg: "cosmic-purple",
        description: "Interconnected unity icon",
        bgColors: ["#6d28d9"],
      },
      {
        name: "Golden Logo on Cosmic Purple",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "cosmic-purple",
        description: "Primary golden logo",
        bgColors: ["#6d28d9"],
      },
      {
        name: "White Logo on Cosmic Purple",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "cosmic-purple",
        description: "White version for dark backgrounds",
        bgColors: ["#6d28d9"],
      },
      {
        name: "Black Logo on Soft Violet",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "soft-violet",
        description: "Black version for light backgrounds",
        bgColors: ["#ede9fe"],
      },
      {
        name: "Brand Symbol on Deep Indigo",
        file: "symbol.svg",
        bg: "deep-indigo",
        description: "Interconnected unity icon",
        bgColors: ["#4338ca"],
      },
      {
        name: "Golden Logo on Deep Indigo",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "deep-indigo",
        description: "Primary golden logo",
        bgColors: ["#4338ca"],
      },
      {
        name: "White Logo on Deep Indigo",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "deep-indigo",
        description: "White version for dark backgrounds",
        bgColors: ["#4338ca"],
      },
      {
        name: "Black Logo on Light Indigo",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-indigo",
        description: "Black version for light backgrounds",
        bgColors: ["#e0e7ff"],
      },
      {
        name: "Brand Symbol on Cosmic Blue",
        file: "symbol.svg",
        bg: "cosmic-blue",
        description: "Interconnected unity icon",
        bgColors: ["#0891b2"],
      },
      {
        name: "Golden Logo on Cosmic Blue",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "cosmic-blue",
        description: "Primary golden logo",
        bgColors: ["#0891b2"],
      },
      {
        name: "White Logo on Cosmic Blue",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "cosmic-blue",
        description: "White version for dark backgrounds",
        bgColors: ["#0891b2"],
      },
      {
        name: "Black Logo on Light Cyan",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-cyan",
        description: "Black version for light backgrounds",
        bgColors: ["#ecfeff"],
      },
      {
        name: "Brand Symbol on Emerald",
        file: "symbol.svg",
        bg: "emerald",
        description: "Interconnected unity icon",
        bgColors: ["#059669"],
      },
      {
        name: "Golden Logo on Emerald",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "emerald",
        description: "Primary golden logo",
        bgColors: ["#059669"],
      },
      {
        name: "White Logo on Emerald",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "emerald",
        description: "White version for dark backgrounds",
        bgColors: ["#059669"],
      },
      {
        name: "Black Logo on Light Emerald",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-emerald",
        description: "Black version for light backgrounds",
        bgColors: ["#d1fae5"],
      },
      {
        name: "Brand Symbol on Cosmic Pink",
        file: "symbol.svg",
        bg: "cosmic-pink",
        description: "Interconnected unity icon",
        bgColors: ["#db2777"],
      },
      {
        name: "Golden Logo on Cosmic Pink",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "cosmic-pink",
        description: "Primary golden logo",
        bgColors: ["#db2777"],
      },
      {
        name: "White Logo on Cosmic Pink",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "cosmic-pink",
        description: "White version for dark backgrounds",
        bgColors: ["#db2777"],
      },
      {
        name: "Black Logo on Soft Pink",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "soft-pink",
        description: "Black version for light backgrounds",
        bgColors: ["#fce7f3"],
      },
      {
        name: "Brand Symbol on Sunset Orange",
        file: "symbol.svg",
        bg: "sunset-orange",
        description: "Interconnected unity icon",
        bgColors: ["#ea580c"],
      },
      {
        name: "Golden Logo on Sunset Orange",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "sunset-orange",
        description: "Primary golden logo",
        bgColors: ["#ea580c"],
      },
      {
        name: "White Logo on Sunset Orange",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "sunset-orange",
        description: "White version for dark backgrounds",
        bgColors: ["#ea580c"],
      },
      {
        name: "Black Logo on Light Amber",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "light-amber",
        description: "Black version for light backgrounds",
        bgColors: ["#fef3c7"],
      },

      // GRADIENTS: Dynamic & Transformative
      {
        name: "Brand Symbol on Violet-Purple Gradient",
        file: "symbol.svg",
        bg: "gradient-violet-purple",
        description: "Interconnected unity icon",
        bgColors: ["#8b5cf6", "#a855f7"],
      },
      {
        name: "Golden Logo on Violet-Purple Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-violet-purple",
        description: "Primary golden logo",
        bgColors: ["#8b5cf6", "#a855f7"],
      },
      {
        name: "White Logo on Violet-Purple Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-violet-purple",
        description: "White version for dark backgrounds",
        bgColors: ["#8b5cf6", "#a855f7"],
      },
      {
        name: "Black Logo on Violet-Purple Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-violet-purple-light",
        description: "Black version for light backgrounds",
        bgColors: ["#f5f3ff", "#faf5ff"],
      },
      {
        name: "Brand Symbol on Blue-Cyan Gradient",
        file: "symbol.svg",
        bg: "gradient-blue-cyan",
        description: "Interconnected unity icon",
        bgColors: ["#3b82f6", "#06b6d4"],
      },
      {
        name: "Golden Logo on Blue-Cyan Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-blue-cyan",
        description: "Primary golden logo",
        bgColors: ["#3b82f6", "#06b6d4"],
      },
      {
        name: "White Logo on Blue-Cyan Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-blue-cyan",
        description: "White version for dark backgrounds",
        bgColors: ["#3b82f6", "#06b6d4"],
      },
      {
        name: "Black Logo on Blue-Cyan Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-blue-cyan-light",
        description: "Black version for light backgrounds",
        bgColors: ["#dbeafe", "#cffafe"],
      },
      {
        name: "Brand Symbol on Amber-Orange Gradient",
        file: "symbol.svg",
        bg: "gradient-amber-orange",
        description: "Interconnected unity icon",
        bgColors: ["#f59e0b", "#f97316"],
      },
      {
        name: "Golden Logo on Amber-Orange Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-amber-orange",
        description: "Primary golden logo",
        bgColors: ["#f59e0b", "#f97316"],
      },
      {
        name: "White Logo on Amber-Orange Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-amber-orange",
        description: "White version for dark backgrounds",
        bgColors: ["#f59e0b", "#f97316"],
      },
      {
        name: "Black Logo on Amber-Orange Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-amber-orange-light",
        description: "Black version for light backgrounds",
        bgColors: ["#fef3c7", "#fed7aa"],
      },
      {
        name: "Brand Symbol on Purple-Pink Gradient",
        file: "symbol.svg",
        bg: "gradient-purple-pink",
        description: "Interconnected unity icon",
        bgColors: ["#a855f7", "#ec4899"],
      },
      {
        name: "Golden Logo on Purple-Pink Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-purple-pink",
        description: "Primary golden logo",
        bgColors: ["#a855f7", "#ec4899"],
      },
      {
        name: "White Logo on Purple-Pink Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-purple-pink",
        description: "White version for dark backgrounds",
        bgColors: ["#a855f7", "#ec4899"],
      },
      {
        name: "Black Logo on Purple-Pink Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-purple-pink-light",
        description: "Black version for light backgrounds",
        bgColors: ["#faf5ff", "#fce7f3"],
      },
      {
        name: "Brand Symbol on Emerald-Teal Gradient",
        file: "symbol.svg",
        bg: "gradient-emerald-teal",
        description: "Interconnected unity icon",
        bgColors: ["#10b981", "#14b8a6"],
      },
      {
        name: "Golden Logo on Emerald-Teal Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-emerald-teal",
        description: "Primary golden logo",
        bgColors: ["#10b981", "#14b8a6"],
      },
      {
        name: "White Logo on Emerald-Teal Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-emerald-teal",
        description: "White version for dark backgrounds",
        bgColors: ["#10b981", "#14b8a6"],
      },
      {
        name: "Black Logo on Emerald-Teal Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-emerald-teal-light",
        description: "Black version for light backgrounds",
        bgColors: ["#d1fae5", "#ccfbf1"],
      },
      {
        name: "Brand Symbol on Golden Sunrise Gradient",
        file: "symbol.svg",
        bg: "gradient-golden-sunrise",
        description: "Interconnected unity icon",
        bgColors: ["#fbbf24", "#fb923c"],
      },
      {
        name: "Golden Logo on Golden Sunrise Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-golden-sunrise",
        description: "Primary golden logo",
        bgColors: ["#fbbf24", "#fb923c"],
      },
      {
        name: "White Logo on Golden Sunrise Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-golden-sunrise",
        description: "White version for dark backgrounds",
        bgColors: ["#fbbf24", "#fb923c"],
      },
      {
        name: "Black Logo on Golden Sunrise Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-golden-sunrise-light",
        description: "Black version for light backgrounds",
        bgColors: ["#fef3c7", "#ffedd5"],
      },
      {
        name: "Brand Symbol on Rose Gold Gradient",
        file: "symbol.svg",
        bg: "gradient-rose-gold",
        description: "Interconnected unity icon",
        bgColors: ["#e8a87c", "#d4af37"],
      },
      {
        name: "Golden Logo on Rose Gold Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-rose-gold",
        description: "Primary golden logo",
        bgColors: ["#e8a87c", "#d4af37"],
      },
      {
        name: "White Logo on Rose Gold Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-rose-gold",
        description: "White version for dark backgrounds",
        bgColors: ["#e8a87c", "#d4af37"],
      },
      {
        name: "Black Logo on Rose Gold Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-rose-gold-light",
        description: "Black version for light backgrounds",
        bgColors: ["#fef6ee", "#fef9f3"],
      },
      {
        name: "Brand Symbol on Deep Ocean Gradient",
        file: "symbol.svg",
        bg: "gradient-ocean",
        description: "Interconnected unity icon",
        bgColors: ["#1e3a8a", "#0f766e"],
      },
      {
        name: "Golden Logo on Deep Ocean Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-ocean",
        description: "Primary golden logo",
        bgColors: ["#1e3a8a", "#0f766e"],
      },
      {
        name: "White Logo on Deep Ocean Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-ocean",
        description: "White version for dark backgrounds",
        bgColors: ["#1e3a8a", "#0f766e"],
      },
      {
        name: "Black Logo on Deep Ocean Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-ocean-light",
        description: "Black version for light backgrounds",
        bgColors: ["#dbeafe", "#ccfbf1"],
      },
      {
        name: "Brand Symbol on Sunset Dusk Gradient",
        file: "symbol.svg",
        bg: "gradient-sunset-dusk",
        description: "Interconnected unity icon",
        bgColors: ["#7c3aed", "#f97316"],
      },
      {
        name: "Golden Logo on Sunset Dusk Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-sunset-dusk",
        description: "Primary golden logo",
        bgColors: ["#7c3aed", "#f97316"],
      },
      {
        name: "White Logo on Sunset Dusk Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-sunset-dusk",
        description: "White version for dark backgrounds",
        bgColors: ["#7c3aed", "#f97316"],
      },
      {
        name: "Black Logo on Sunset Dusk Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-sunset-dusk-light",
        description: "Black version for light backgrounds",
        bgColors: ["#f5f3ff", "#ffedd5"],
      },
      {
        name: "Brand Symbol on Earth to Sky Gradient",
        file: "symbol.svg",
        bg: "gradient-earth-sky",
        description: "Interconnected unity icon",
        bgColors: ["#065f46", "#0284c7"],
      },
      {
        name: "Golden Logo on Earth to Sky Gradient",
        file: "Logo Files/svg/Color logo - no background.svg",
        bg: "gradient-earth-sky",
        description: "Primary golden logo",
        bgColors: ["#065f46", "#0284c7"],
      },
      {
        name: "White Logo on Earth to Sky Gradient",
        file: "Logo Files/svg/White logo - no background.svg",
        bg: "gradient-earth-sky",
        description: "White version for dark backgrounds",
        bgColors: ["#065f46", "#0284c7"],
      },
      {
        name: "Black Logo on Earth to Sky Gradient",
        file: "Logo Files/svg/Black logo - no background.svg",
        bg: "gradient-earth-sky-light",
        description: "Black version for light backgrounds",
        bgColors: ["#d1fae5", "#e0f2fe"],
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
};

const FEATURED_LOGOS = [
  {
    name: "Color logo - no background",
    description: "Primary luminescent mark",
    preview: "Logo Files/png/Color logo - no background.png",
    backgroundClass: "bg-black",
    formats: {
      svg: "Logo Files/svg/Color logo - no background.svg",
      png: "Logo Files/png/Color logo - no background.png",
    },
  },
  {
    name: "White logo - no background",
    description: "Inverted mark for dark canvases",
    preview: "Logo Files/png/White logo - no background.png",
    backgroundClass: "bg-black",
    formats: {
      svg: "Logo Files/svg/White logo - no background.svg",
      png: "Logo Files/png/White logo - no background.png",
    },
  },
  {
    name: "Black logo - no background",
    description: "Solid mark for bright surfaces",
    preview: "Logo Files/png/Black logo - no background.png",
    backgroundClass: "bg-white",
    formats: {
      svg: "Logo Files/svg/Black logo - no background.svg",
      png: "Logo Files/png/Black logo - no background.png",
    },
  },
];

const getBackgroundClass = (bg: string) => {
  switch (bg) {
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
    case "burgundy":
      return "bg-[#6b1d36]";
    case "light-rose":
      return "bg-[#fce4ec]";
    case "purple":
      return "bg-[#4a148c]";
    case "light-purple":
      return "bg-[#f3e5f5]";
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
    case "earth-brown":
      return "bg-[#5d4e37]";
    case "warm-sand":
      return "bg-[#f5e6d3]";
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
      return "bg-gradient-to-br from-[#fbbf24] to-[#fb923c]";
    case "gradient-golden-sunrise-light":
      return "bg-gradient-to-br from-[#fef3c7] to-[#ffedd5]";
    case "gradient-rose-gold":
      return "bg-gradient-to-br from-[#e8a87c] to-[#d4af37]";
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

export default function BrandPage() {
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
                  src="/brand/symbol.svg"
                  alt="New Earth Collective"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <h1
              className="mb-4 text-7xl font-bold text-black dark:text-white"
              style={{
                fontFamily: "Airwaves, sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              Brand Assets
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-neutral-600 dark:text-neutral-400">
              Visual identity system for New Earth Collective
            </p>
            <div className="flex items-center justify-center gap-3">
              <Badge className="border-[#facf39]/40 bg-[#facf39]/10 text-[#facf39] dark:border-[#facf39]/30">
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
                style={{ fontFamily: "Bourton, sans-serif", color: "#facf39" }}
              >
                Brand Identity
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Core visual elements and color palette
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Symbol */}
              <Card className="overflow-hidden border border-neutral-800 bg-black text-white shadow-lg dark:border-neutral-700 dark:bg-black">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black p-8">
                    <div className="relative h-64 w-64">
                      <Image
                        src="/brand/symbol.svg"
                        alt="New Earth Collective Symbol"
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 border-t border-neutral-800 bg-neutral-950/60 p-5">
                    <div>
                      <h3 className="mb-1 font-semibold text-white">
                        Brand Symbol
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Interconnected unity icon
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <a href="/brand/symbol.svg" download>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#facf39]/40 text-[#facf39] hover:border-[#ffe067] hover:text-white"
                          >
                            SVG
                          </Button>
                        </a>
                        <a href="/brand/symbol.png" download>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#facf39]/40 text-[#facf39] hover:border-[#ffe067] hover:text-white"
                          >
                            PNG
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Colors */}
              <Card className="overflow-hidden border border-neutral-800 bg-black text-white shadow-lg dark:border-neutral-700 dark:bg-black">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="mb-2 text-2xl font-semibold text-white">
                      Brand Colors
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Official color palette
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Primary Golden */}
                    <div className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                        style={{ backgroundColor: "#facf39" }}
                      />
                      <div>
                        <p className="font-mono text-sm font-semibold text-white">
                          #FACF39
                        </p>
                        <p className="text-xs text-neutral-400">
                          Primary Golden
                        </p>
                      </div>
                    </div>

                    {/* Secondary Black */}
                    <div className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                        style={{ backgroundColor: "#000000" }}
                      />
                      <div>
                        <p className="font-mono text-sm font-semibold text-white">
                          #000000
                        </p>
                        <p className="text-xs text-neutral-400">
                          Secondary Black
                        </p>
                      </div>
                    </div>

                    {/* Tertiary White */}
                    <div className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 rounded-xl shadow-lg ring-2 ring-neutral-200 dark:ring-neutral-700"
                        style={{
                          background:
                            "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
                        }}
                      />
                      <div>
                        <p className="font-mono text-sm font-semibold text-white">
                          #FFFFFF → #F5F5F5
                        </p>
                        <p className="text-xs text-neutral-400">
                          Tertiary White Gradient
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-neutral-800 pt-6 dark:border-neutral-700">
                    <h4 className="mb-3 text-sm font-semibold text-white">
                      Typography
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Wordmark:</span>
                        <span
                          className="font-medium text-white"
                          style={{ fontFamily: "Airwaves, sans-serif" }}
                        >
                          Airwaves Regular
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Slogan:</span>
                        <span
                          className="font-medium text-white"
                          style={{ fontFamily: "Bourton, sans-serif" }}
                        >
                          Bourton Bold
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
                    fontFamily: "Bourton, sans-serif",
                    color: "#facf39",
                  }}
                >
                  Signature Logos
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
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
                        <div className="relative h-full w-full">
                          <Image
                            src={`/brand/${logo.preview}`}
                            alt={logo.name}
                            fill
                            className="object-contain drop-shadow-2xl"
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
                                  className="border-[#facf39]/40 text-[#facf39] hover:border-[#ffe067] hover:text-white"
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
                style={{ fontFamily: "Bourton, sans-serif", color: "#facf39" }}
              >
                Logo Variations
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
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
                      <div className="relative h-full w-full">
                        <Image
                          src={`/brand/${logo.file}`}
                          alt={logo.name}
                          fill
                          className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
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

                      {/* Background Colors */}
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line */}
                        {(logo as any).bgColors?.map(
                          (color: string, idx: number) => (
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
                          )
                        )}
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
                      src="/brand/symbol.svg"
                      alt="New Earth Collective"
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <h3
                      className="mb-3 text-3xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "Airwaves, sans-serif",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Brand Guidelines
                    </h3>
                    <div className="space-y-3 text-neutral-700 dark:text-neutral-300">
                      <p>
                        These brand assets are the visual foundation of New
                        Earth Collective. Please maintain proper spacing and
                        avoid altering logo colors or proportions.
                      </p>
                      <p className="font-semibold" style={{ color: "#facf39" }}>
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
