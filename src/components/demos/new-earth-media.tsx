"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Upload,
  BookOpen,
  Users,
  Camera,
  Award,
  Check,
  Star,
  X,
  Clock,
  Calendar,
  Globe,
  ExternalLink,
  Mail,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
} from "lucide-react";

/* ── Data ──────────────────────────────────────────────────────── */

const featuredContent = [
  {
    id: 1,
    title: "Building the New Earth",
    category: "Docuseries",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop",
    type: "Documentary",
  },
  {
    id: 2,
    title: "Soul Story Docuseries",
    category: "Films",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    type: "Documentary",
  },
  {
    id: 3,
    title: "Permaculture Masterclass",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=600&fit=crop",
    type: "Course",
  },
  {
    id: 4,
    title: "Voices of the Regen Era",
    category: "Inspiration",
    image:
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop",
    type: "Series",
  },
  {
    id: 5,
    title: "The Zero Waste Movement",
    category: "Docuseries",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=600&fit=crop",
    type: "Documentary",
  },
  {
    id: 6,
    title: "Sacred Economics",
    category: "Courses",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop",
    type: "Course",
  },
];

const categories = [
  "All",
  "Education",
  "Inspiration",
  "Docuseries",
  "Films",
  "Courses",
];

const features = [
  {
    icon: Play,
    title: "Watch Conscious Content Anytime",
    description:
      "Stream inspiring films, documentaries, and educational series on any device, whenever you want.",
  },
  {
    icon: BookOpen,
    title: "Learn from Regenerative Leaders",
    description:
      "Access masterclasses and courses from pioneering voices in sustainability, wellness, and conscious living.",
  },
  {
    icon: Users,
    title: "Share and Co-Create the New Narrative",
    description:
      "Join a community of changemakers and contribute to the stories that are shaping our future.",
  },
];

const creatorBenefits = [
  {
    icon: Camera,
    title: "Share Your Vision",
    description:
      "Use the soul story guide. Dive into your WHY. Write your story, share your message, your wisdom and help transform the world.",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Users,
    title: "Join the Community",
    description:
      "Connect with like-minded creators and collaborate on projects that matter.",
    gradient: "from-purple-500 to-purple-700",
  },
  {
    icon: Award,
    title: "Amplify Your Voice",
    description:
      "Connect with our conscious co-marketing and distribution network to amplify your mission.",
    gradient: "from-purple-400 to-purple-600",
  },
];

const plans = [
  {
    name: "Free Trial",
    price: "0",
    period: "14 days",
    description: "Perfect to get started",
    features: [
      "Access to 50+ pieces of content",
      "Standard video quality",
      "Mobile and desktop access",
      "Basic community features",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Monthly",
    price: "19",
    period: "month",
    description: "Full access to everything",
    features: [
      "Unlimited access to all content",
      "4K streaming quality",
      "Download for offline viewing",
      "Creator community access",
      "Early access to new releases",
      "Ad-free experience",
    ],
    cta: "Get Monthly Access",
    popular: true,
  },
  {
    name: "Annual",
    price: "199",
    period: "year",
    description: "Best value for committed learners",
    features: [
      "Everything in Monthly",
      "2 months free (save $38)",
      "Exclusive annual subscriber events",
      "Priority customer support",
      "Creator workshop invitations",
    ],
    cta: "Get Annual Access",
    popular: false,
  },
];

const getContentDetails = (id: number) => {
  const contentDetails: Record<
    number,
    {
      title: string;
      type: string;
      duration: string;
      rating: number;
      releaseDate: string;
      views: string;
      description: string;
      fullDescription: string;
      director: string;
      website: string;
      stats: { activeUsers: string; launched: string; lastUpdated: string };
    }
  > = {
    1: {
      title: "The New Earth Manifesto",
      type: "Documentary",
      duration: "2h 15m",
      rating: 4.8,
      releaseDate: "2024",
      views: "2.5M",
      description:
        "A groundbreaking documentary exploring the intersection of consciousness, ecology, and social transformation. Follow visionary leaders as they outline a blueprint for regenerative civilization that works in harmony with natural systems.",
      fullDescription:
        "This powerful documentary takes viewers on a transformative journey through the emerging paradigm of regenerative living. Featuring interviews with leading scientists, philosophers, and activists, it presents a compelling vision for how humanity can transition from destructive industrial systems to life-affirming practices that restore both personal and planetary health.",
      director: "Dr. Sarah Chen",
      website: "#",
      stats: {
        activeUsers: "125K+",
        launched: "3/15/2024",
        lastUpdated: "2 weeks ago",
      },
    },
  };

  return (
    contentDetails[id] ?? {
      title: "Content Title",
      type: "Documentary",
      duration: "1h 45m",
      rating: 4.5,
      releaseDate: "2024",
      views: "1M",
      description:
        "An inspiring piece of conscious media that explores themes of transformation and regeneration.",
      fullDescription:
        "This content piece dives deep into the topics that matter most for our collective future, featuring expert insights and real-world solutions.",
      director: "Various",
      website: "#",
      stats: {
        activeUsers: "50K+",
        launched: "2024",
        lastUpdated: "1 week ago",
      },
    }
  );
};

/* ── Video Modal ───────────────────────────────────────────────── */

function VideoModal({
  content,
  onClose,
}: {
  content: { id: number; title: string; image: string; type: string };
  onClose: () => void;
}) {
  const details = getContentDetails(content.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-purple-900/50 bg-black/95">
        {/* Header image */}
        <div className="relative">
          <img
            src={content.image}
            alt={details.title}
            className="h-64 w-full rounded-t-2xl object-cover md:h-80"
          />
          <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute right-0 bottom-0 left-0 p-6">
            <div className="mb-4 w-fit rounded-full bg-purple-600 px-3 py-1 text-sm font-semibold text-white">
              {details.type}
            </div>
            <h2
              className="mb-2 text-3xl font-bold text-white md:text-4xl"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {details.title}
            </h2>
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {details.duration}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                {details.rating}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {details.releaseDate}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {details.views} views
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-8 lg:col-span-2">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: Users,
                    label: "Active Viewers",
                    value: details.stats.activeUsers,
                  },
                  {
                    icon: Calendar,
                    label: "Released",
                    value: details.stats.launched,
                  },
                  {
                    icon: Clock,
                    label: "Last Updated",
                    value: details.stats.lastUpdated,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-purple-900/30 bg-black/50 p-4 text-center"
                  >
                    <div className="mb-2 flex items-center justify-center text-purple-400">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div
                      className="mb-1 text-2xl font-bold text-white"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div>
                <h3
                  className="mb-4 text-2xl font-bold text-white"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Detailed Overview
                </h3>
                <p
                  className="mb-4 leading-relaxed text-gray-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {details.description}
                </p>
                <p
                  className="leading-relaxed text-gray-400"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {details.fullDescription}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="rounded-xl border border-purple-900/30 bg-black/50 p-6">
                <h4
                  className="mb-4 text-lg font-semibold text-white"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Get Started
                </h4>
                <div className="mb-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white">{details.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Director</span>
                    <span className="text-white">{details.director}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(details.rating) ? "text-yellow-400" : "text-gray-600"}`}
                          fill="currentColor"
                        />
                      ))}
                      <span className="ml-2 text-white">{details.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-purple-500 hover:to-purple-600"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <Play className="h-5 w-5" />
                    Watch Now
                  </button>
                  <a
                    href={details.website}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-purple-700"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <Globe className="h-5 w-5" />
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────── */

export function NewEarthMediaLanding({ backHref }: { backHref?: string }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalContent, setModalContent] = useState<{
    id: number;
    title: string;
    image: string;
    type: string;
  } | null>(null);

  const filteredContent =
    selectedCategory === "All"
      ? featuredContent
      : featuredContent.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');`}</style>

      {/* Portal Back Nav */}
      {backHref && (
        <header
          className="border-b px-4 py-4 sm:px-6"
          style={{
            borderColor: "rgba(212, 175, 55, 0.2)",
            background: "#000",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Demos
            </Link>
          </div>
        </header>
      )}

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl" />
          <div className="absolute right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-purple-600 blur-3xl [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl [animation-delay:0.5s]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <h1
            className="mb-6 text-5xl leading-tight font-bold text-white md:text-7xl"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Streaming the Stories of a{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Regenerative Future
            </span>
          </h1>
          <p
            className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed font-light text-gray-200 md:text-2xl"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            New Earth Media is your hub for conscious entertainment and
            educational media — featuring films, courses, docuseries, and brand
            stories.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <button
              className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/25"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
              Start Watching
            </button>
            <button
              className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-purple-400 hover:to-purple-500 hover:shadow-purple-500/25"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <Upload className="h-5 w-5 transition-transform group-hover:scale-110" />
              Submit Your Project
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      </section>

      {/* ── Featured Content ────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-black to-purple-950 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2
              className="mb-4 text-4xl font-bold text-white md:text-5xl"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Featured Content
            </h2>
            <p
              className="text-xl font-light text-gray-300"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Discover stories that inspire change and transformation
            </p>
          </div>
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-black/50 text-gray-300 hover:bg-purple-900/50 hover:text-white"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
                onClick={() => setModalContent(item)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-purple-500/20">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute right-0 bottom-0 left-0 translate-y-4 p-6 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-3 w-fit rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                      {item.category}
                    </div>
                    <h3
                      className="text-xl leading-tight font-bold text-white"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-purple-950 to-black py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-4xl font-bold text-white md:text-5xl"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              How It Works
            </h2>
            <p
              className="mx-auto max-w-3xl text-xl font-light text-gray-300"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Three simple steps to transform how you consume and create
              conscious media
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-purple-900/30 bg-gradient-to-b from-black/50 to-purple-900/30 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-purple-500/50"
              >
                <div className="relative mb-8">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:shadow-purple-500/50">
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute inset-0 mx-auto h-20 w-20 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
                </div>
                <h3
                  className="mb-4 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-purple-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="leading-relaxed font-light text-gray-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why It Matters ──────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-black to-purple-950 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="group relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 to-purple-700 opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                  alt="New Earth Media Platform"
                  className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                <div className="absolute top-6 left-6 rounded-2xl bg-white/10 p-4 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700" />
                    <div>
                      <div className="mb-2 h-3 w-24 rounded bg-white/80" />
                      <div className="h-2 w-16 rounded bg-white/60" />
                    </div>
                  </div>
                </div>
                <div className="absolute right-6 bottom-6 rounded-2xl bg-white/10 p-4 backdrop-blur-md transition-transform delay-100 duration-300 group-hover:scale-110">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
                    <div className="h-2 w-20 rounded bg-white/80" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h2
                  className="mb-6 text-4xl leading-tight font-bold text-white md:text-5xl"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Why It Matters
                </h2>
                <div className="space-y-6">
                  <p
                    className="text-xl leading-relaxed font-light text-gray-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    We are creating media that uplifts, educates, and empowers
                    change. Every story shared supports regenerative solutions
                    for our planet and communities.
                  </p>
                  <p
                    className="text-lg leading-relaxed font-light text-gray-400"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    In a world overwhelmed by divisive content, New Earth Media
                    offers a sanctuary for stories that inspire hope, showcase
                    solutions, and celebrate the changemakers building a better
                    tomorrow.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "500+", label: "Conscious Creators" },
                  { value: "1000+", label: "Hours of Content" },
                  { value: "50+", label: "Countries Reached" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 text-center">
                    <div
                      className="mb-2 text-3xl font-bold text-purple-400"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-sm font-light text-gray-400"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="group rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/25"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Join the Movement
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Creator Invitation ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-black to-black py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2
              className="mb-6 text-4xl leading-tight font-bold text-white md:text-6xl"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Are You a Filmmaker, Educator, or{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Storyteller?
              </span>
            </h2>
            <p
              className="mx-auto max-w-4xl text-xl leading-relaxed font-light text-gray-200 md:text-2xl"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Submit your series, films, or doc-style content and become a voice
              in the New Earth movement.
            </p>
          </div>
          <div className="mb-16 grid gap-8 md:grid-cols-3">
            {creatorBenefits.map((benefit, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/30"
              >
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${benefit.gradient} transition-transform duration-300 group-hover:scale-110`}
                >
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="mb-4 text-xl font-bold text-white"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="font-light text-gray-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              className="group mb-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-12 py-5 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-yellow-400 hover:to-orange-400 hover:shadow-yellow-500/25"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Become a Creator Partner
            </button>
            <p
              className="font-light text-gray-400"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              No fees to submit. Revenue sharing available for accepted content.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-purple-950 to-black py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-4xl font-bold text-white md:text-5xl"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Choose Your Journey
            </h2>
            <p
              className="mx-auto max-w-3xl text-xl font-light text-gray-300"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Start your conscious media journey today with flexible pricing
              options
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? "border-2 border-purple-500/50 bg-gradient-to-b from-purple-900/50 to-purple-800/50 shadow-2xl shadow-purple-500/20"
                    : "border border-purple-900/30 bg-gradient-to-b from-black/50 to-purple-900/30 hover:border-purple-500/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-2 text-sm font-semibold text-white">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="mb-8 text-center">
                  <h3
                    className="mb-2 text-2xl font-bold text-white"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="mb-6 font-light text-gray-400"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span
                      className="text-5xl font-bold text-white"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      ${plan.price}
                    </span>
                    <span className="font-light text-gray-400">
                      /{plan.period}
                    </span>
                  </div>
                </div>
                <div className="mb-8 space-y-4">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                      <span
                        className="font-light text-gray-300"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className={`w-full rounded-full py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-2xl hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/25"
                      : "bg-gradient-to-r from-black/70 to-purple-900/70 text-white hover:from-purple-600 hover:to-purple-700"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p
              className="font-light text-gray-400"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              All plans include a 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-purple-900/30 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-12 grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3
                className="mb-4 text-2xl font-bold text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                New Earth Media
              </h3>
              <p
                className="mb-6 max-w-md leading-relaxed font-light text-gray-400"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Streaming the stories of a regenerative future. Join our
                community of conscious creators and changemakers building a
                better world.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-full border border-purple-900/50 bg-black/70 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-purple-500 focus:outline-none"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
                <button
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-purple-500 hover:to-purple-600"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Mail className="h-4 w-4" />
                  Subscribe
                </button>
              </div>
            </div>
            <div>
              <h4
                className="mb-4 text-lg font-semibold text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Platform
              </h4>
              <ul className="space-y-3">
                {[
                  "Watch",
                  "Browse Content",
                  "Featured Series",
                  "New Releases",
                ].map((item) => (
                  <li key={item}>
                    <span
                      className="cursor-pointer font-light text-gray-400 transition-colors hover:text-white"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="mb-4 text-lg font-semibold text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Creators
              </h4>
              <ul className="space-y-3">
                {[
                  "Submit Content",
                  "Creator Guidelines",
                  "Partner Program",
                  "Community",
                ].map((item) => (
                  <li key={item}>
                    <span
                      className="cursor-pointer font-light text-gray-400 transition-colors hover:text-white"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-900/30 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-6">
                <span
                  className="font-light text-gray-400"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Follow us:
                </span>
                <div className="flex gap-4">
                  {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                    <span
                      key={i}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/70 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-700 hover:text-white"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                {["About", "Contact", "Privacy Policy", "Terms of Service"].map(
                  (item) => (
                    <span
                      key={item}
                      className="cursor-pointer font-light text-gray-400 transition-colors hover:text-white"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="mt-8 border-t border-purple-900/30 pt-8 text-center">
              <p
                className="font-light text-gray-400"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                &copy; 2024 New Earth Media. All rights reserved. Building the
                future, one story at a time.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {modalContent && (
        <VideoModal
          content={modalContent}
          onClose={() => setModalContent(null)}
        />
      )}
    </div>
  );
}
