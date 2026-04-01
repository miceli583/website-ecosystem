"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Download,
  Copy,
  Check,
  Palette,
  Type,
  Image,
  FileText,
  Grid3X3,
  List,
  ChevronDown,
} from "lucide-react";

const COLORS = [
  { name: "Primary", hex: "#D4AF37", rgb: "212, 175, 55" },
  { name: "Primary Light", hex: "#F6E6C1", rgb: "246, 230, 193" },
  { name: "Background", hex: "#0A0A0A", rgb: "10, 10, 10" },
  { name: "Surface", hex: "#111111", rgb: "17, 17, 17" },
  { name: "Surface Hover", hex: "#1A1A1A", rgb: "26, 26, 26" },
  { name: "Border", hex: "#D4AF3733", rgb: "212, 175, 55, 0.2" },
  { name: "Text Primary", hex: "#FFFFFF", rgb: "255, 255, 255" },
  { name: "Text Secondary", hex: "#9CA3AF", rgb: "156, 163, 175" },
  { name: "Text Muted", hex: "#6B7280", rgb: "107, 114, 128" },
  { name: "Success", hex: "#4ADE80", rgb: "74, 222, 128" },
  { name: "Warning", hex: "#FBBF24", rgb: "251, 191, 36" },
  { name: "Error", hex: "#F87171", rgb: "248, 113, 113" },
];

const FONTS = [
  {
    name: "Quattrocento Sans",
    role: "Headings",
    weights: ["400", "700"],
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Barlow",
    role: "Subtitles",
    weights: ["300", "400", "500"],
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Geist",
    role: "Body",
    weights: ["400", "500", "600"],
    sample: "The quick brown fox jumps over the lazy dog",
  },
];

const LOGOS = [
  { name: "Logo — Dark BG", variant: "primary", bg: "#0A0A0A" },
  { name: "Logo — Light BG", variant: "inverted", bg: "#FFFFFF" },
  { name: "Icon Only", variant: "icon", bg: "#0A0A0A" },
  { name: "Wordmark", variant: "wordmark", bg: "#0A0A0A" },
];

const COMPONENTS = [
  { name: "Primary Button", type: "button" },
  { name: "Secondary Button", type: "button-secondary" },
  { name: "Danger Button", type: "button-danger" },
  { name: "Input Field", type: "input" },
  { name: "Badge — Active", type: "badge-active" },
  { name: "Badge — Pending", type: "badge-pending" },
  { name: "Badge — Inactive", type: "badge-inactive" },
  { name: "Card", type: "card" },
];

function ColorSwatch({ color }: { color: (typeof COLORS)[number] }) {
  const [copied, setCopied] = useState(false);
  const copyHex = () => {
    void navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copyHex}
      className="group rounded-lg border bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/5"
      style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
    >
      <div
        className="mb-3 h-16 w-full rounded-md border border-white/10"
        style={{
          backgroundColor:
            color.hex.length <= 7 ? color.hex : `rgba(${color.rgb})`,
        }}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">{color.name}</p>
          <p className="mt-0.5 font-mono text-xs text-gray-500">{color.hex}</p>
        </div>
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
    </button>
  );
}

function ComponentPreview({ type }: { type: string }) {
  switch (type) {
    case "button":
      return (
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium text-black"
          style={{
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
          }}
        >
          Primary Action
        </button>
      );
    case "button-secondary":
      return (
        <button
          className="rounded-lg border px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          Secondary
        </button>
      );
    case "button-danger":
      return (
        <button className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          Delete
        </button>
      );
    case "input":
      return (
        <input
          type="text"
          placeholder="Input placeholder..."
          className="w-full rounded-lg border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        />
      );
    case "badge-active":
      return (
        <span className="inline-flex rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">
          Active
        </span>
      );
    case "badge-pending":
      return (
        <span className="inline-flex rounded-full bg-[#D4AF37]/15 px-2.5 py-1 text-xs font-medium text-[#D4AF37]">
          Pending
        </span>
      );
    case "badge-inactive":
      return (
        <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-400">
          Inactive
        </span>
      );
    case "card":
      return (
        <div
          className="w-full rounded-lg border bg-white/5 p-4"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <h4 className="text-sm font-medium text-white">Card Title</h4>
          <p className="mt-1 text-xs text-gray-500">
            Card description with supporting text.
          </p>
        </div>
      );
    default:
      return null;
  }
}

type Tab = "colors" | "typography" | "logos" | "components";

export default function DemoAssetsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>("colors");
  const [search, setSearch] = useState("");

  const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
    { id: "colors", label: "Colors", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
    { id: "logos", label: "Logos", icon: Image },
    { id: "components", label: "Components", icon: Grid3X3 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link
            href={`/portal/${slug}/demos`}
            className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ fontFamily: "'Quattrocento Sans', serif" }}
              >
                Brand Assets
              </h1>
              <p className="mt-2 text-gray-400">
                Design system reference — colors, typography, logos, and UI
                components.
              </p>
            </div>
            <button
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <Download className="h-4 w-4" />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-[#D4AF37]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div
                    className="absolute right-0 bottom-0 left-0 h-0.5"
                    style={{ backgroundColor: "#D4AF37" }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border bg-white/5 py-2 pr-4 pl-10 text-sm text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Colors */}
        {activeTab === "colors" && (
          <div>
            <h2 className="mb-6 text-lg font-semibold">Color Palette</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {COLORS.filter(
                (c) =>
                  !search ||
                  c.name.toLowerCase().includes(search.toLowerCase()) ||
                  c.hex.toLowerCase().includes(search.toLowerCase())
              ).map((color) => (
                <ColorSwatch key={color.name} color={color} />
              ))}
            </div>

            {/* Gradient reference */}
            <h3 className="mt-12 mb-4 text-sm font-medium text-gray-400">
              Gradients
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
              >
                <div
                  className="mb-3 h-20 rounded-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                />
                <p className="text-sm font-medium text-white">Gold Gradient</p>
                <p className="mt-0.5 font-mono text-xs text-gray-500">
                  135deg, #F6E6C1 → #D4AF37
                </p>
              </div>
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
              >
                <div
                  className="mb-3 h-20 rounded-md"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                  }}
                />
                <p className="text-sm font-medium text-white">
                  Icon Background
                </p>
                <p className="mt-0.5 font-mono text-xs text-gray-500">
                  135deg, gold/10% → gold/15%
                </p>
              </div>
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
              >
                <div
                  className="mb-3 h-20 rounded-md"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
                  }}
                />
                <p className="text-sm font-medium text-white">Divider</p>
                <p className="mt-0.5 font-mono text-xs text-gray-500">
                  to right, transparent → gold/40%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Typography */}
        {activeTab === "typography" && (
          <div className="space-y-10">
            <h2 className="text-lg font-semibold">Typography Scale</h2>
            {FONTS.filter(
              (f) =>
                !search ||
                f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.role.toLowerCase().includes(search.toLowerCase())
            ).map((font) => (
              <div
                key={font.name}
                className="rounded-lg border p-6"
                style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {font.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {font.role} — Weights: {font.weights.join(", ")}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      color: "#D4AF37",
                    }}
                  >
                    {font.role}
                  </span>
                </div>
                <div className="space-y-4">
                  {font.weights.map((w) => (
                    <div key={w}>
                      <p className="mb-1 text-xs text-gray-600">Weight {w}</p>
                      <p
                        className="text-2xl text-gray-300"
                        style={{
                          fontFamily: `'${font.name}', sans-serif`,
                          fontWeight: parseInt(w),
                        }}
                      >
                        {font.sample}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Size scale */}
            <div
              className="rounded-lg border p-6"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <h3 className="mb-4 text-base font-semibold text-white">
                Size Scale
              </h3>
              <div className="space-y-3">
                {[
                  { size: "text-4xl", label: "4xl — 36px", text: "Page Title" },
                  {
                    size: "text-3xl",
                    label: "3xl — 30px",
                    text: "Section Heading",
                  },
                  { size: "text-2xl", label: "2xl — 24px", text: "Card Title" },
                  { size: "text-xl", label: "xl — 20px", text: "Subheading" },
                  {
                    size: "text-base",
                    label: "base — 16px",
                    text: "Body Text",
                  },
                  {
                    size: "text-sm",
                    label: "sm — 14px",
                    text: "Secondary Text",
                  },
                  {
                    size: "text-xs",
                    label: "xs — 12px",
                    text: "Caption / Label",
                  },
                ].map((item) => (
                  <div key={item.size} className="flex items-baseline gap-4">
                    <span className="w-32 shrink-0 font-mono text-xs text-gray-600">
                      {item.label}
                    </span>
                    <span className={`${item.size} text-gray-300`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logos */}
        {activeTab === "logos" && (
          <div>
            <h2 className="mb-6 text-lg font-semibold">Logo Variants</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {LOGOS.map((logo) => (
                <div
                  key={logo.name}
                  className="overflow-hidden rounded-lg border"
                  style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                >
                  <div
                    className="flex h-40 items-center justify-center"
                    style={{ backgroundColor: logo.bg }}
                  >
                    {/* Placeholder logo */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{
                          background:
                            logo.bg === "#FFFFFF"
                              ? "#0A0A0A"
                              : "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                        }}
                      >
                        <span
                          className="text-lg font-bold"
                          style={{
                            color: logo.bg === "#FFFFFF" ? "#D4AF37" : "#000",
                          }}
                        >
                          M
                        </span>
                      </div>
                      {logo.variant !== "icon" && (
                        <span
                          className="text-xl font-semibold tracking-tight"
                          style={{
                            fontFamily: "'Quattrocento Sans', serif",
                            color: logo.bg === "#FFFFFF" ? "#0A0A0A" : "#FFF",
                          }}
                        >
                          Miracle Mind
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
                    <p className="text-sm text-gray-400">{logo.name}</p>
                    <div className="flex gap-2">
                      <button className="rounded px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-white/5 hover:text-white">
                        SVG
                      </button>
                      <button className="rounded px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-white/5 hover:text-white">
                        PNG
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage guidelines */}
            <div
              className="mt-10 rounded-lg border p-6"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <h3 className="mb-4 text-base font-semibold text-white">
                Usage Guidelines
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-green-400">
                    Do
                  </h4>
                  <ul className="space-y-1.5 text-sm text-gray-400">
                    <li>Use the gold gradient on dark backgrounds</li>
                    <li>Maintain minimum clear space around the logo</li>
                    <li>Use the inverted version on light backgrounds</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-red-400">
                    Don&apos;t
                  </h4>
                  <ul className="space-y-1.5 text-sm text-gray-400">
                    <li>Place the logo on busy or low-contrast backgrounds</li>
                    <li>Stretch, rotate, or add effects to the logo</li>
                    <li>Change the logo colors outside the approved palette</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Components */}
        {activeTab === "components" && (
          <div>
            <h2 className="mb-6 text-lg font-semibold">UI Components</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {COMPONENTS.filter(
                (c) =>
                  !search || c.name.toLowerCase().includes(search.toLowerCase())
              ).map((comp) => (
                <div
                  key={comp.name}
                  className="rounded-lg border p-6"
                  style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                >
                  <p className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
                    {comp.name}
                  </p>
                  <div className="flex items-center">
                    <ComponentPreview type={comp.type} />
                  </div>
                </div>
              ))}
            </div>

            {/* Spacing reference */}
            <div
              className="mt-10 rounded-lg border p-6"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <h3 className="mb-4 text-base font-semibold text-white">
                Spacing Scale
              </h3>
              <div className="flex flex-wrap items-end gap-4">
                {[1, 2, 3, 4, 6, 8, 10, 12, 16].map((n) => (
                  <div key={n} className="flex flex-col items-center gap-2">
                    <div
                      className="rounded"
                      style={{
                        width: `${n * 4}px`,
                        height: `${n * 4}px`,
                        backgroundColor: "rgba(212, 175, 55, 0.3)",
                      }}
                    />
                    <span className="font-mono text-[10px] text-gray-600">
                      {n * 4}px
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
