/**
 * Brand Themes for Daily Value Post Generation
 * Aligned with brand assets from /admin/brand
 */

export interface BrandTheme {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  backgroundGradient?: { from: string; to: string };
  textColor: string;
  accentColor: string;
  secondaryAccentColor?: string; // Optional secondary accent for UI chrome (falls back to accentColor)
  logoFile: string; // Path relative to /brand/
  logoVariant: "color" | "white" | "black";
}

export const BRAND_THEMES: Record<string, BrandTheme> = {
  // Core Color Themes
  blackGold: {
    id: "blackGold",
    name: "Black & Gold",
    description: "Primary brand identity - Pure black with golden logo",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    accentColor: "#D4AF37",
    logoFile: "miracle-mind-logo-color.svg",
    logoVariant: "color",
  },
  lightGray: {
    id: "lightGray",
    name: "Light Gray",
    description: "Clean and minimal - Black UI with golden content accents",
    backgroundColor: "#FFFFFF",
    backgroundGradient: { from: "#FFFFFF", to: "#f9fafb" },
    textColor: "#000000",
    accentColor: "#D4AF37", // Gold for content accents (labels, author, decorative lines)
    secondaryAccentColor: "#000000", // Black for UI chrome (branding, indicators)
    logoFile: "miracle-mind-logo-black.svg",
    logoVariant: "black",
  },
  deepBlue: {
    id: "deepBlue",
    name: "Deep Blue",
    description: "Professional and trust - Deep blue with golden logo",
    backgroundColor: "#121827",
    textColor: "#FFFFFF",
    accentColor: "#D4AF37",
    logoFile: "miracle-mind-logo-color.svg",
    logoVariant: "color",
  },

  // Secondary Color Themes
  burgundy: {
    id: "burgundy",
    name: "Burgundy",
    description: "Rich and elegant - Burgundy with golden logo",
    backgroundColor: "#6b1d36",
    textColor: "#FFFFFF",
    accentColor: "#D4AF37",
    logoFile: "miracle-mind-logo-color.svg",
    logoVariant: "color",
  },
  neutralBrown: {
    id: "neutralBrown",
    name: "Neutral Brown",
    description: "Warm and earthy - White UI with golden content accents",
    backgroundColor: "#6B5640",
    textColor: "#FFFFFF",
    accentColor: "#D4AF37", // Gold for content accents (labels, author, decorative lines)
    secondaryAccentColor: "#FFFFFF", // White for UI chrome (branding, indicators)
    logoFile: "miracle-mind-logo-white.svg",
    logoVariant: "white",
  },
  deepTeal: {
    id: "deepTeal",
    name: "Deep Teal",
    description: "Calm and focused - Deep teal with golden logo",
    backgroundColor: "#2C7873",
    textColor: "#FFFFFF",
    accentColor: "#D4AF37",
    logoFile: "miracle-mind-logo-color.svg",
    logoVariant: "color",
  },

  // Gradient Themes
  emberGlow: {
    id: "emberGlow",
    name: "Ember Glow",
    description: "Dynamic gradient - Entirely black text and logo",
    backgroundColor: "#F6E6C1",
    backgroundGradient: { from: "#F6E6C1", to: "#6b1d36" },
    textColor: "#000000", // Black for all text
    accentColor: "#000000", // Black for content accents
    secondaryAccentColor: "#000000", // Black for UI chrome
    logoFile: "miracle-mind-logo-black.svg",
    logoVariant: "black",
  },
  northStarGlow: {
    id: "northStarGlow",
    name: "North Star Glow",
    description: "Golden radiance - Entirely black text and logo",
    backgroundColor: "#F6E6C1",
    backgroundGradient: { from: "#F6E6C1", to: "#D4AF37" },
    textColor: "#000000", // Black for all text
    accentColor: "#000000", // Black for content accents
    secondaryAccentColor: "#000000", // Black for UI chrome
    logoFile: "miracle-mind-logo-black.svg",
    logoVariant: "black",
  },
  goldenTide: {
    id: "goldenTide",
    name: "Golden Tide",
    description: "Flowing gradient - Entirely black text and logo",
    backgroundColor: "#F6E6C1",
    backgroundGradient: { from: "#F6E6C1", to: "#2C7873" },
    textColor: "#000000", // Black for all text
    accentColor: "#000000", // Black for content accents
    secondaryAccentColor: "#000000", // Black for UI chrome
    logoFile: "miracle-mind-logo-black.svg",
    logoVariant: "black",
  },
  midnightGold: {
    id: "midnightGold",
    name: "Midnight Gold",
    description: "Dramatic gradient - Entirely white text and logo",
    backgroundColor: "#F6E6C1",
    backgroundGradient: { from: "#F6E6C1", to: "#121827" },
    textColor: "#FFFFFF", // White for all text
    accentColor: "#FFFFFF", // White for content accents
    secondaryAccentColor: "#FFFFFF", // White for UI chrome
    logoFile: "miracle-mind-logo-white.svg",
    logoVariant: "white",
  },
};

// Default theme for generation
export const DEFAULT_THEME = BRAND_THEMES.blackGold!;

// Get a random theme
export function getRandomTheme(): BrandTheme {
  const themes = Object.values(BRAND_THEMES);
  return themes[Math.floor(Math.random() * themes.length)]!;
}

// Typography settings aligned with brand
// Based on brand page: Quattrocento Sans (titles), Barlow Light (subtitles), Geist (body)
export const BRAND_TYPOGRAPHY = {
  fonts: {
    title: "Quattrocento Sans, serif", // Primary - Titles
    subtitle: "Barlow, sans-serif", // Secondary - Subtitles (always use weight 300 for Barlow Light)
    body: "Geist, -apple-system, BlinkMacSystemFont, sans-serif", // Body - Paragraphs
  },
  sizes: {
    title: 76, // Large value text (slightly bigger)
    subtitle: 54, // Supporting values, section titles
    body: 40, // Description paragraphs (increased for readability)
    caption: 30, // Small labels like "TODAY'S VALUE" (slightly smaller for hierarchy)
    quote: 58, // Quote text (dynamic, can scale down)
    author: 44, // Author attribution
  },
};
