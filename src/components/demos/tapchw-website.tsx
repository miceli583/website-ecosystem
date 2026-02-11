"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Users,
  Target,
  Scale,
  Shield,
  Lightbulb,
  Handshake,
  BookOpen,
  GraduationCap,
  Building2,
  Mail,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Quote,
  Star,
  Sparkles,
  Play,
  FileText,
  Video,
  TrendingUp,
  Award,
  MapPin,
  Heart,
  LogOut,
  BarChart3,
  Lock,
  ChevronUp,
  Calendar,
  UserCheck,
  DollarSign,
  Download,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

// Logo wash filter — minimal wash, palette is close to logo now
const LOGO_FILTER = "saturate(0.93) brightness(1.01) contrast(1.04)";

// Brand colors — 70% toward logo's vivid red/blue from original dark palette
const COLORS = {
  maroon: "#C13040",
  maroonDark: "#A02838",
  maroonLight: "#DC4858",
  navy: "#3570B2",
  navyLight: "#5590D0",
  navyDark: "#2C5590",
  cream: "#FDF8F3",
  gold: "#F0D04A",
};

// Navigation items
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
  { id: "resources", label: "Resources" },
  { id: "training", label: "Training Center" },
  { id: "membership", label: "Membership" },
  { id: "contact", label: "Contact" },
];

// Core values data
const CORE_VALUES = [
  { icon: Target, title: "Advocacy", description: "We champion for CHW priorities.", color: COLORS.maroon },
  { icon: Scale, title: "Equity", description: "We support fair access in advancement.", color: COLORS.navy },
  { icon: Shield, title: "Integrity", description: "We remain true to the CHW/Promotor role.", color: COLORS.maroonLight },
  { icon: Lightbulb, title: "Self-Empowerment", description: "We honor the intrinsic value of lived experiences.", color: COLORS.navyLight },
  { icon: Users, title: "Intersectionality", description: "We acknowledge and engage different perspectives.", color: COLORS.maroon },
  { icon: Handshake, title: "Unity", description: "We connect CHWs/Promotores, allies, & communities.", color: COLORS.navy },
];

// Goals data
const GOALS = [
  "Offer a statewide annual CHW conference",
  "Promote statewide projects and opportunities for CHWs",
  "Amplify and promote local CHW associations projects/events",
  "Support CHW and CHW Instructor continuing education efforts",
  "Engage in advocacy for the CHW/Promotora workforce",
];

// Stats data
const STATS = [
  { value: 5000, suffix: "+", label: "CHWs Supported", icon: Users },
  { value: 25, suffix: "+", label: "Member Organizations", icon: Building2 },
  { value: 254, suffix: "", label: "Counties Reached", icon: MapPin },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: Star },
];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "TAPCHW has transformed how we approach community health in our region. The training and resources are invaluable.",
    author: "Maria Garcia",
    role: "CHW Instructor",
    org: "Austin Health Coalition",
  },
  {
    quote: "Being part of this network has opened doors I never knew existed. The continuing education opportunities are outstanding.",
    author: "James Thompson",
    role: "Certified CHW",
    org: "Border Region Health Center",
  },
  {
    quote: "The advocacy work TAPCHW does at the state level directly impacts our ability to serve our communities effectively.",
    author: "Dr. Sarah Chen",
    role: "Program Director",
    org: "Cook Children's Health Plan",
  },
];

// Member organizations for logo carousel
const MEMBER_LOGOS = [
  { name: "Prevent Blindness Texas", logo: "/demos/tapchw-members/prevent-blindness-texas.png" },
  { name: "Planned Parenthood Gulf Coast", logo: "/demos/tapchw-members/planned-parenthood-gulf-coast.png" },
  { name: "UMEMBA Health", logo: "/demos/tapchw-members/umemba-health.png" },
  { name: "Border Region Behavioral Health Center", logo: "/demos/tapchw-members/border-region-behavioral-health.png" },
  { name: "Cook Children's Health Plan", logo: "/demos/tapchw-members/member-01.png" },
  { name: "Foundation Communities", logo: "/demos/tapchw-members/member-02.png" },
  { name: "Austin Asian Community Health Initiative", logo: "/demos/tapchw-members/member-03.png" },
  { name: "Empowering the Masses", logo: "/demos/tapchw-members/member-04.png" },
  { name: "UT Tyler School of Medicine", logo: "/demos/tapchw-members/member-05.png" },
  { name: "The Center for Children's Health", logo: "/demos/tapchw-members/member-06.png" },
  { name: "Food Freedom Research Team", logo: "/demos/tapchw-members/member-07.png" },
  { name: "Shurrun's House Sober Living", logo: "/demos/tapchw-members/member-08.png" },
  { name: "Texas Health Resources", logo: "/demos/tapchw-members/member-09.png" },
];

// Events data
const EVENTS = [
  { date: "February 14th", title: "Heart Disease Prevention", speaker: "TAPCHW", month: "FEB", day: "14" },
  { date: "May 9th", title: "Immunizations and Anti-Immunizations Movement", speaker: "Rosalia Guerrero, MBA, CHWI", month: "MAY", day: "9" },
  { date: "July 11th", title: "Special Member Meeting in Spanish/Español", speaker: "", month: "JUL", day: "11" },
  { date: "August 9th", title: "TBA", speaker: "Tarri Wyre, CHWI", month: "AUG", day: "9" },
];

// Resources data
const RESOURCES = {
  training: [
    "Texas Health Steps",
    "Cardea Training Center",
    "MCD Public Health FREE CHW Trainings",
    "CHW Disaster Preparedness",
    "CDC AMIGAS Toolkit",
    "NKDEP Riñones Education Program",
  ],
  toolkits: [
    "CDC CHW Toolkit",
    "RHIHub Rural CHW Toolkit",
    "CDC Policy and Systems Change",
    "Resources for Promotores de la Salud",
  ],
  research: [
    "Workforce Development Survey",
    "Power of Measurement",
    "Research Roundup",
    "Sustainable Financing Report",
  ],
  videos: [
    "COVID-19 and CHWs in Latino Community",
    "CHWs in the Time of COVID-19",
  ],
};

// Training curricula
const CURRICULA = [
  "What the Health! Finding Health Information",
  "Learning How to Be a Community Leader",
  "Self-Compassion (La Autovaloración)",
  "Relaxation Technique for Health",
  "Reflective Listening",
  "Understanding Different Types of Rest",
  "Practical Tools for Health Outcomes",
  "Communication & Organizational Skills",
  "Trauma Informed Care",
  "Compassion Fatigue",
  "Addressing Misinformation Toolkit",
  "Effective Health Communication",
];

// Membership tiers
const MEMBERSHIP_TIERS = [
  {
    name: "Organization",
    price: 50,
    period: "year",
    description: "CHW Employers, Networks, & Training Centers",
    benefits: [
      "Discounted booth at Annual State Conference",
      "Logo on website, newsletter, communications",
      "Promote org on TAPCHW website",
      "Partner to offer CE trainings",
      "Access to private member platform",
      "Serve on TAPCHW Advisory Council",
    ],
    color: COLORS.maroon,
    gradient: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)`,
    popular: false,
  },
  {
    name: "Individual",
    price: 15,
    period: "year",
    description: "CHW/CHW Instructor Annual",
    benefits: [
      "Certified & noncertified CEs",
      "Advocacy environment",
      "Board representation opportunity",
      "Private CHW network access",
      "Events calendar access",
      "Conference registration discount",
      "Mentorship opportunities",
      "Employment resources",
    ],
    color: COLORS.navy,
    gradient: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
    popular: false,
  },
  {
    name: "Bi-Annual",
    price: 25,
    period: "2 years",
    description: "Best Value — 2-Year Membership",
    benefits: ["All Individual Member benefits", "17% savings vs annual", "Priority conference registration"],
    color: COLORS.gold,
    gradient: `linear-gradient(135deg, ${COLORS.gold} 0%, #E8B923 100%)`,
    popular: true,
  },
];

// Demo users for login
type DemoUser = { email: string; password: string; name: string; role: "member" | "admin"; tier: string; memberSince: string };

const DEMO_USERS: DemoUser[] = [
  { email: "maria@tapchw.org", password: "demo123", name: "Maria Garcia", role: "member", tier: "Individual", memberSince: "2023" },
  { email: "admin@tapchw.org", password: "admin123", name: "Dr. Sarah Chen", role: "admin", tier: "Organization", memberSince: "2021" },
];

// Admin analytics sample data
const ANALYTICS_DATA = {
  totalMembers: 5247,
  newMembersThisMonth: 142,
  activeOrgs: 28,
  monthlyRevenue: 8450,
  eventRegistrations: 384,
  resourceDownloads: 1923,
  memberGrowth: [
    { month: "Sep", value: 4200 },
    { month: "Oct", value: 4450 },
    { month: "Nov", value: 4680 },
    { month: "Dec", value: 4890 },
    { month: "Jan", value: 5100 },
    { month: "Feb", value: 5247 },
  ],
  topResources: [
    { name: "CHW Disaster Preparedness", downloads: 428 },
    { name: "CDC CHW Toolkit", downloads: 356 },
    { name: "Trauma Informed Care", downloads: 298 },
    { name: "Sustainable Financing Report", downloads: 245 },
    { name: "Misinformation Toolkit", downloads: 189 },
  ],
  recentMembers: [
    { name: "Carlos Mendez", type: "Individual", date: "Feb 10, 2025" },
    { name: "Austin Health Coalition", type: "Organization", date: "Feb 8, 2025" },
    { name: "Lisa Nguyen", type: "Bi-Annual", date: "Feb 7, 2025" },
    { name: "Rural Health Network", type: "Organization", date: "Feb 5, 2025" },
    { name: "David Washington", type: "Individual", date: "Feb 3, 2025" },
  ],
};

// Animated Counter Hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let rafId: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutQuart — slow start, smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(progress >= 1 ? end : Math.round(eased * end));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, hasStarted]);

  return { count, ref };
}

// Animated Stat Component
function AnimatedStat({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: typeof Users }) {
  const { count, ref } = useCountUp(value, 2500);

  return (
    <div ref={ref} className="group text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm transition-all duration-500 group-hover:scale-110">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <p className="font-serif text-3xl font-bold text-white sm:text-5xl md:text-6xl">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/60">{label}</p>
    </div>
  );
}

// Logo Carousel Component - with infinite rotation
function LogoCarousel({ title }: { title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed;

      // Reset when we've scrolled one full set of logos
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => { animationId = requestAnimationFrame(animate); };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Double the logos for seamless infinite scroll
  const doubledLogos = [...MEMBER_LOGOS, ...MEMBER_LOGOS];

  return (
    <div className="py-16">
      <p className="mb-10 text-center text-sm font-semibold uppercase tracking-widest" style={{ color: COLORS.navy }}>
        {title}
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent sm:w-48" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent sm:w-48" />

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden pb-4"
          style={{ scrollBehavior: "auto" }}
        >
          {doubledLogos.map((member, i) => (
            <div
              key={i}
              className="group relative flex h-24 min-w-[180px] flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white px-6 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{ borderColor: `${COLORS.navy}15` }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle at center, ${COLORS.navy}08 0%, transparent 70%)` }}
              />
              <Image
                src={member.logo}
                alt={member.name}
                width={140}
                height={70}
                className="relative max-h-16 w-auto object-contain transition-all duration-500 group-hover:scale-105"
                style={{ filter: LOGO_FILTER }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Testimonial Carousel
function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setCurrent((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
        className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 md:block"
        style={{ color: COLORS.maroon }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrent((current + 1) % TESTIMONIALS.length)}
        className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 md:block"
        style={{ color: COLORS.maroon }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <Quote className="mx-auto mb-8 h-16 w-16 opacity-10" style={{ color: COLORS.maroon }} />

        <div className="relative h-[280px] overflow-hidden sm:h-[240px]">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-700 ${
                i === current ? "translate-x-0 opacity-100" : i < current ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"
              }`}
            >
              <p className="font-serif mb-8 text-2xl italic leading-relaxed text-gray-700 sm:text-3xl">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.navy} 100%)` }}
                >
                  {testimonial.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="text-left">
                  <p className="font-bold" style={{ color: COLORS.maroon }}>{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.org}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-3">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${i === current ? "w-10" : "w-2.5"}`}
              style={{ backgroundColor: i === current ? COLORS.maroon : "#e5e7eb" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Home Page Component
function HomePage({ setPage }: { setPage: (page: string) => void }) {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${COLORS.navyDark} 0%, ${COLORS.navy} 25%, ${COLORS.navyLight} 55%, #D0E0F0 85%, #E8F0F8 100%)` }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative flex min-h-[90vh] items-center px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-300" />
                  </span>
                  <span className="text-sm font-medium text-white">Texas CHW Association</span>
                </div>

                <h1
                  className="font-serif mb-6 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl xl:text-8xl"
                  style={{ color: COLORS.gold, textShadow: `1px 1px 0 rgba(0,0,0,0.15), 2px 2px 6px rgba(0,0,0,0.2)` }}
                >
                  Howdy!
                </h1>

                <p className="mb-8 text-lg leading-relaxed text-white/80 sm:text-xl">
                  As the state CHW Association, TAPCHW is here to serve CHWs and promotoras across Texas.
                  Let us know what we can do to support you and your community!
                </p>

                <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                  <Button
                    size="lg"
                    className="group w-full px-8 text-white shadow-2xl transition-all duration-500 hover:scale-105 sm:w-auto"
                    style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)`, boxShadow: `0 0 30px ${COLORS.maroon}40, 0 0 60px ${COLORS.maroon}20` }}
                    onClick={() => setPage("membership")}
                  >
                    Join Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-white/30 bg-white/10 px-8 text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
                    onClick={() => setPage("about")}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Video
                  </Button>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4 lg:items-start">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-white/70">Trusted by 25+ organizations</span>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center px-6 py-8 sm:px-0 sm:py-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[260px] w-[260px] rounded-full border-2 border-dashed border-white/20 sm:h-[400px] sm:w-[400px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[200px] w-[200px] rounded-full border border-white/10 sm:h-[320px] sm:w-[320px]" />
                </div>

                <div className="relative z-10 flex items-center justify-center">
                  {/* Outer soft glow */}
                  <div className="absolute h-[260px] w-[260px] rounded-full bg-white/[0.22] blur-3xl sm:h-[420px] sm:w-[420px]" />
                  {/* Inner frosted disc — gives depth */}
                  <div
                    className="absolute h-[180px] w-[180px] rounded-full border border-white/20 sm:h-[280px] sm:w-[280px]"
                    style={{ background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 70%, transparent 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                  />
                  <Image
                    src="/demos/tapchw-logo.png"
                    alt="TAPCHW"
                    width={280}
                    height={280}
                    className="relative h-[200px] w-[200px] translate-x-[1px] translate-y-[5px] object-contain sm:h-[320px] sm:w-[320px] sm:translate-x-[2px] sm:translate-y-[9px]"
                    style={{ filter: "saturate(1) brightness(1.05) contrast(1.05)" }}
                  />
                </div>

                <div className="absolute left-0 top-1/4 hidden rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:block sm:-left-8">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">This Year</p>
                      <p className="font-bold text-gray-900">+500 CHWs</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1/4 right-0 hidden rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:block sm:-right-8">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full p-2" style={{ backgroundColor: `${COLORS.maroon}15` }}>
                      <Award className="h-4 w-4" style={{ color: COLORS.maroon }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Certified</p>
                      <p className="font-bold text-gray-900">DSHS #69</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Organizations Carousel */}
      <section className="border-y bg-white py-4" style={{ borderColor: "rgba(53, 79, 139, 0.1)" }}>
        <LogoCarousel title="Trusted by Leading Texas Organizations" />
      </section>

      {/* Section Divider */}
      <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${COLORS.gold}40, transparent)` }} />

      {/* Stats Section */}
      <section
        className="relative overflow-hidden px-4 py-12 sm:py-16 lg:py-24"
        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonDark} 100%)` }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4 md:gap-10">
            {STATS.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${COLORS.gold}40, transparent)` }} />

      {/* Goals Section */}
      <section className="px-4 py-12 sm:py-16 lg:py-24" style={{ backgroundColor: COLORS.cream }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <Badge className="mb-4" style={{ backgroundColor: `${COLORS.maroon}15`, color: COLORS.maroon }}>
              What We Do
            </Badge>
            <h2 className="font-serif text-4xl font-bold sm:text-5xl" style={{ color: COLORS.navy }}>Our Goals</h2>
          </div>

          <div className="space-y-4">
            {GOALS.map((goal, i) => (
              <div
                key={i}
                className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <span
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 font-medium text-gray-700">{goal}</span>
                <ArrowRight className="h-5 w-5 text-gray-300 transition-all group-hover:translate-x-2 group-hover:text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <Badge className="mb-4" style={{ backgroundColor: `${COLORS.navy}15`, color: COLORS.navy }}>
              Testimonials
            </Badge>
            <h2 className="font-serif text-4xl font-bold sm:text-5xl" style={{ color: COLORS.maroon }}>
              What Our{" "}<br className="sm:hidden" />Members Say
            </h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-12 sm:py-16 lg:py-24" style={{ backgroundColor: COLORS.cream }}>
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" style={{ backgroundColor: `${COLORS.navy}15`, color: COLORS.navy }}>
            About Us
          </Badge>
          <h2 className="font-serif mb-6 text-4xl font-bold sm:text-5xl" style={{ color: COLORS.maroon }}>
            Empowering Texas{" "}<br className="sm:hidden" />CHWs Since{" "}<br className="sm:hidden" />Day One
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            We are a 501(c)3 non-profit professional organization that offers membership and supports
            the Community Health Worker (CHW) workforce through continuing education, job opportunities,
            and various CHW-led projects across Texas.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="group overflow-hidden border border-transparent bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl" style={{ borderImage: "none" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${COLORS.navy}25`; e.currentTarget.style.boxShadow = `0 25px 50px -12px ${COLORS.navy}15`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = ""; }}>
              <CardContent className="p-8">
                <div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)` }}
                >
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif mb-4 text-3xl font-bold" style={{ color: COLORS.navy }}>Our Mission</h3>
                <p className="text-lg text-gray-600">
                  To support and expand opportunities for the CHW profession at the state and local level
                  through Advocacy, Education, Employment, Empowerment, and Policy.
                </p>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border border-transparent bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl" style={{ borderImage: "none" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${COLORS.maroon}25`; e.currentTarget.style.boxShadow = `0 25px 50px -12px ${COLORS.maroon}15`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = ""; }}>
              <CardContent className="p-8">
                <div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif mb-4 text-3xl font-bold" style={{ color: COLORS.maroon }}>Vision</h3>
                <p className="text-lg text-gray-600">
                  Elevate the voices of Texas Community Health Workers and Promotores.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section
        className="relative overflow-hidden px-4 py-12 sm:py-16 lg:py-24"
        style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-white/20 bg-white/10 text-white">Our Foundation</Badge>
            <h2 className="font-serif text-4xl font-bold text-white sm:text-5xl">Core Values</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition-all duration-500 hover:border-white/30 hover:bg-white/10"
                >
                  <div
                    className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-all duration-500 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}cc 100%)` }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-serif mb-3 text-xl font-bold text-white">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative overflow-hidden px-4 py-14 sm:py-20 lg:py-28"
        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonDark} 100%)` }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Heart className="h-4 w-4 text-white" />
            <span className="text-sm text-white/90">Join 5,000+ CHWs across Texas</span>
          </div>
          <h2 className="font-serif mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Ready to Join Our Community?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80">
            Connect with CHWs across Texas, access exclusive resources, and grow your career.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-white px-10 py-6 text-lg font-semibold shadow-2xl transition-all duration-500 hover:scale-105 sm:w-auto"
              style={{ color: COLORS.maroon }}
              onClick={() => setPage("membership")}
            >
              View Membership Options
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 border-white/30 bg-white/10 px-8 py-6 text-lg text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
              onClick={() => setPage("contact")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// About Page Component
function AboutPage() {
  return (
    <div>
      <section
        className="relative overflow-hidden px-4 py-14 sm:py-20 lg:py-28"
        style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}
      >
        <div className="relative mx-auto max-w-4xl text-center">
          <Badge className="mb-4 border-white/20 bg-white/10 text-white">About</Badge>
          <h1 className="font-serif mb-6 text-5xl font-bold text-white sm:text-6xl">About TAPCHW</h1>
          <p className="text-xl text-white/80">
            We are a 501(c)3 non-profit professional organization dedicated to supporting
            the Community Health Worker workforce across Texas.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div
              className="relative overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8 lg:aspect-square"
              style={{ background: `linear-gradient(160deg, ${COLORS.navyDark} 0%, ${COLORS.navy} 25%, ${COLORS.navyLight} 60%, #B8D0E8 100%)` }}
            >
              <div className="flex h-full items-center justify-center py-8 sm:py-12 lg:py-0">
                <div className="relative flex items-center justify-center">
                  {/* Outer soft glow */}
                  <div className="absolute h-[170px] w-[170px] rounded-full bg-white/[0.22] blur-3xl sm:h-[295px] sm:w-[295px]" />
                  {/* Inner frosted disc */}
                  <div
                    className="absolute h-[130px] w-[130px] rounded-full border border-white/20 sm:h-[225px] sm:w-[225px]"
                    style={{ background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 70%, transparent 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                  />
                  <Image src="/demos/tapchw-logo.png" alt="TAPCHW" width={250} height={250} className="relative h-[150px] w-[150px] translate-x-[1px] translate-y-[4px] object-contain sm:h-[250px] sm:w-[250px] sm:translate-y-[8px]" style={{ filter: "saturate(1) brightness(1.05) contrast(1.05)" }} />
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="font-serif mb-4 text-4xl font-bold" style={{ color: COLORS.maroon }}>Our Mission</h2>
                <p className="text-lg text-gray-600">
                  To support and expand opportunities for the CHW profession at the state and local level
                  through Advocacy, Education, Employment, Empowerment, and Policy.
                </p>
              </div>
              <div>
                <h2 className="font-serif mb-4 text-4xl font-bold" style={{ color: COLORS.navy }}>Our Vision</h2>
                <p className="text-lg text-gray-600">
                  Elevate the voices of Texas Community Health Workers and Promotores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:py-14 lg:py-20" style={{ backgroundColor: COLORS.cream }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif mb-12 text-center text-4xl font-bold" style={{ color: COLORS.maroon }}>Core Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="group cursor-default overflow-hidden border-0 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <CardContent className="relative p-7">
                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{ backgroundColor: `${value.color}20` }}
                    />
                    {/* Animated border accent */}
                    <div
                      className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
                      style={{ background: `linear-gradient(to right, ${value.color}, ${value.color}88)` }}
                    />
                    <div
                      className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}cc 100%)` }}
                    >
                      <Icon className="h-7 w-7 transition-transform duration-500 group-hover:rotate-6" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold transition-colors duration-300" style={{ color: COLORS.maroon }}>{value.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// Demo Calendar Component
function DemoCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1)); // February 2025

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  // Event dates for the current month
  const eventDates: Record<string, { title: string; color: string }> = {
    "2025-2-14": { title: "Heart Disease Prevention", color: COLORS.maroon },
    "2025-5-9": { title: "Immunizations Meeting", color: COLORS.navy },
    "2025-7-11": { title: "Special Member Meeting", color: COLORS.maroon },
    "2025-8-9": { title: "TBA - Tarri Wyre", color: COLORS.navy },
  };

  const getEventForDay = (day: number) => {
    const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${day}`;
    return eventDates[key];
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <Card className="border-0 bg-white shadow-xl">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h3 className="text-lg font-bold sm:text-xl" style={{ color: COLORS.navy }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevMonth} style={{ borderColor: COLORS.navy, color: COLORS.navy }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth} style={{ borderColor: COLORS.navy, color: COLORS.navy }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7">
          {daysOfWeek.map((day) => (
            <div key={day} className="border-b py-2 text-center text-xs font-semibold text-gray-400" style={{ borderColor: `${COLORS.navy}15` }}>
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-1 sm:p-2" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const event = getEventForDay(day);
            return (
              <div key={day} className="flex items-center justify-center p-1 sm:p-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all sm:h-10 sm:w-10 sm:text-sm ${
                    event ? "cursor-pointer font-bold text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  style={event ? { backgroundColor: event.color } : {}}
                  title={event?.title}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t pt-4 text-xs sm:mt-6 sm:pt-4" style={{ borderColor: `${COLORS.navy}15` }}>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.maroon }} />
            <span className="text-gray-600">Member Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.navy }} />
            <span className="text-gray-600">Training Event</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Events Page Component
function EventsPage() {
  return (
    <div>
      <section
        className="px-4 py-12 sm:py-16 lg:py-24"
        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonDark} 100%)` }}
      >
        <div className="mx-auto max-w-4xl">
          <Badge className="mb-4 border-white/20 bg-white/10 text-white">Events</Badge>
          <h1 className="font-serif text-3xl font-bold text-white sm:text-5xl">Upcoming Events</h1>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Calendar */}
            <div>
              <h2 className="mb-6 text-2xl font-bold" style={{ color: COLORS.navy }}>Event Calendar</h2>
              <DemoCalendar />
            </div>

            {/* Event List */}
            <div>
              <h2 className="mb-6 text-2xl font-bold" style={{ color: COLORS.navy }}>2025 Quarterly Member Meetings</h2>
              <p className="mb-6 text-gray-600">Third Fridays of the month, quarterly, 12:00 pm - 1:30 pm CST</p>

              <div className="space-y-4">
                {EVENTS.map((event, i) => (
                  <Card key={i} className="group overflow-hidden border-0 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                    <CardContent className="flex items-center gap-0 p-0">
                      <div
                        className="flex h-full w-20 flex-shrink-0 flex-col items-center justify-center py-6"
                        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
                      >
                        <span className="text-xs font-semibold uppercase text-white/70">{event.month}</span>
                        <span className="text-2xl font-bold text-white">{event.day}</span>
                      </div>
                      <div className="flex-1 p-4">
                        <p className="font-semibold" style={{ color: COLORS.maroon }}>{event.title}</p>
                        {event.speaker && <p className="text-sm text-gray-500">{event.speaker}</p>}
                      </div>
                      <div className="pr-4">
                        <Button
                          size="sm"
                          className="text-white transition-all group-hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)` }}
                        >
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Resources Page Component
function ResourcesPage() {
  const sections = [
    { title: "Training Materials", icon: BookOpen, items: RESOURCES.training, color: COLORS.maroon },
    { title: "Program Toolkits", icon: Wrench, items: RESOURCES.toolkits, color: COLORS.navy },
    { title: "Research & Reports", icon: FileText, items: RESOURCES.research, color: COLORS.maroonLight },
    { title: "Videos & Recordings", icon: Video, items: RESOURCES.videos, color: COLORS.navyLight },
  ];

  return (
    <div>
      <section
        className="px-4 py-12 sm:py-16 lg:py-24"
        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonDark} 100%)` }}
      >
        <div className="mx-auto max-w-4xl">
          <Badge className="mb-4 border-white/20 bg-white/10 text-white">Library</Badge>
          <h1 className="font-serif mb-6 text-3xl font-bold text-white sm:text-5xl">CHW Resources</h1>
          <Button className="bg-white hover:bg-white/90" style={{ color: COLORS.maroon }}>
            TAPCHW Instructor Resources
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title} className="border bg-white shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${section.color}15` }}>
                        <Icon className="h-5 w-5" style={{ color: section.color }} />
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: section.color }}>{section.title}</h2>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <a key={i} href="#" className="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                          <ExternalLink className="h-4 w-4 flex-shrink-0" style={{ color: section.color }} />
                          {item}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// Training Center Page Component
function TrainingPage() {
  const requestTypes = [
    { title: "Curriculum Development", description: "Develop NEW training curriculum", icon: BookOpen },
    { title: "Training for Members", description: "Provide training to TAPCHW members", icon: Users },
    { title: "Training for Orgs", description: "TAPCHW training for your organization", icon: Building2 },
  ];

  return (
    <div>
      <section
        className="px-4 py-12 sm:py-16 lg:py-24"
        style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-8">
          <div className="flex h-36 w-36 flex-shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 backdrop-blur-sm">
            <div className="text-center text-white">
              <GraduationCap className="mx-auto h-14 w-14" />
              <span className="text-sm font-bold">#69</span>
            </div>
          </div>
          <div>
            <Badge className="mb-4 border-white/20 bg-white/10 text-white">DSHS Certified</Badge>
            <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">Training Center</h1>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold" style={{ color: COLORS.navy }}>Training Requests</h2>
            <p className="text-gray-600">Contact within 7-10 business days</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {requestTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card key={type.title} className="group border-0 bg-white text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, ${COLORS.navy}15 0%, ${COLORS.navy}25 100%)` }}
                    >
                      <Icon className="h-8 w-8" style={{ color: COLORS.navy }} />
                    </div>
                    <h3 className="mb-2 font-bold" style={{ color: COLORS.maroon }}>{type.title}</h3>
                    <p className="mb-4 text-sm text-gray-600">{type.description}</p>
                    <Button variant="outline" size="sm" style={{ borderColor: COLORS.maroon, color: COLORS.maroon }}>
                      Request Form
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16" style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Available Curricula</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CURRICULA.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-white/10 p-3 text-sm text-white">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Membership Page Component
function MembershipPage() {
  return (
    <div>
      <section className="px-4 py-12 sm:py-16 lg:py-24" style={{ backgroundColor: COLORS.cream }}>
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" style={{ backgroundColor: `${COLORS.navy}15`, color: COLORS.navy }}>Membership</Badge>
          <h1 className="font-serif text-5xl font-bold sm:text-6xl" style={{ color: COLORS.navy }}>Choose Your Plan</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Join thousands of CHWs across Texas and unlock exclusive benefits
          </p>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {MEMBERSHIP_TIERS.map((tier) => (
              <Card
                key={tier.name}
                className={`group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  tier.popular ? "ring-2 ring-amber-400 ring-offset-2 sm:ring-offset-4" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-amber-400 px-12 py-1 text-xs font-bold text-white">
                    BEST VALUE
                  </div>
                )}
                <div className="p-6" style={{ background: tier.gradient }}>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-white sm:text-5xl">${tier.price}</span>
                    <span className="ml-2 text-white/70">/{tier.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/80">{tier.description}</p>
                </div>
                <CardContent className="p-6">
                  <Button className="mb-6 w-full text-white transition-all group-hover:scale-105" style={{ background: tier.gradient }}>
                    Join Now
                  </Button>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: tier.color }} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12" style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-white">
            Questions? Contact us at{" "}
            <a href="mailto:membership@tapchw.org" className="font-semibold underline">membership@tapchw.org</a>
          </p>
        </div>
      </section>
    </div>
  );
}

// Contact Page Component
function ContactPage() {
  return (
    <div>
      <section
        className="px-4 py-14 sm:py-20 lg:py-28"
        style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 border-white/20 bg-white/10 text-white">Get in Touch</Badge>
          <h1 className="font-serif mb-4 text-5xl font-bold text-white sm:text-6xl">Contact Us</h1>
          <p className="text-xl text-white/80">We&apos;d love to hear from you!</p>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-2xl font-bold" style={{ color: COLORS.maroon }}>Get in Touch</h2>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "General Inquiries", value: "info@tapchw.org" },
                { icon: Users, label: "Membership", value: "membership@tapchw.org" },
                { icon: GraduationCap, label: "Training", value: "training@tapchw.org" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${COLORS.navy}15 0%, ${COLORS.navy}25 100%)` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: COLORS.navy }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: COLORS.maroon }}>{item.label}</p>
                      <a href={`mailto:${item.value}`} className="text-gray-600 hover:underline">{item.value}</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="border bg-white shadow-xl" style={{ borderColor: `${COLORS.navy}15` }}>
            <CardContent className="p-6 sm:p-8">
              <h3 className="mb-6 text-xl font-bold" style={{ color: COLORS.navy }}>Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="First Name" className="h-12 text-base !border-gray-200 !bg-white !text-gray-900 !ring-0 placeholder:!text-gray-400 focus:!border-gray-300 focus:!bg-white focus:!ring-0 sm:text-sm" />
                  <Input placeholder="Last Name" className="h-12 text-base !border-gray-200 !bg-white !text-gray-900 !ring-0 placeholder:!text-gray-400 focus:!border-gray-300 focus:!bg-white focus:!ring-0 sm:text-sm" />
                </div>
                <Input type="email" placeholder="Email" className="h-12 text-base !border-gray-200 !bg-white !text-gray-900 !ring-0 placeholder:!text-gray-400 focus:!border-gray-300 focus:!bg-white focus:!ring-0 sm:text-sm" />
                <Input placeholder="Subject" className="h-12 text-base !border-gray-200 !bg-white !text-gray-900 !ring-0 placeholder:!text-gray-400 focus:!border-gray-300 focus:!bg-white focus:!ring-0 sm:text-sm" />
                <Textarea placeholder="Your message..." className="min-h-[120px] text-base !border-gray-200 !bg-white !text-gray-900 !ring-0 placeholder:!text-gray-400 focus:!border-gray-300 focus:!bg-white focus:!ring-0 sm:text-sm" />
                <Button
                  className="h-12 w-full text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
                >
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Login Page Component
function LoginPage({ onLogin }: { onLogin: (user: DemoUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid email or password. Try the demo credentials below.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-20" style={{ backgroundColor: COLORS.cream }}>
      <Card className="w-full max-w-md border bg-white shadow-2xl" style={{ borderColor: `${COLORS.navy}15` }}>
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <Image src="/demos/tapchw-logo.png" alt="TAPCHW" width={80} height={80} className="mx-auto mb-4 object-contain" style={{ filter: LOGO_FILTER }} />
            <h2 className="font-serif text-2xl font-bold" style={{ color: COLORS.navy }}>Welcome Back</h2>
            <p className="mt-1 text-sm text-gray-500">Sign in to your TAPCHW account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base !border-gray-200 !bg-white pl-10 !text-gray-900 !ring-0 placeholder:!text-gray-400 focus:!border-gray-300 focus:!bg-white focus:!ring-0 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base !border-gray-200 !bg-white pl-10 !text-gray-900 !ring-0 placeholder:!text-gray-400 focus:!border-gray-300 focus:!bg-white focus:!ring-0 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <X className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="h-12 w-full text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Demo Credentials</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Member:</span> maria@tapchw.org / demo123</p>
              <p><span className="font-medium">Admin:</span> admin@tapchw.org / admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Member Dashboard Component
function MemberDashboard({ user, setPage }: { user: DemoUser; setPage: (page: string) => void }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }}>
      <section className="px-4 py-12" style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-white backdrop-blur-sm">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user.name.split(" ")[0]}!</h1>
              <p className="text-white/70">{user.role === "admin" ? "Administrator" : "Member"} · Since {user.memberSince}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border bg-white shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${COLORS.navy}15` }}>
                    <UserCheck className="h-5 w-5" style={{ color: COLORS.navy }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membership</p>
                    <p className="font-bold" style={{ color: COLORS.navy }}>{user.tier} Plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Active — Renews Jan 2026
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-white shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${COLORS.maroon}15` }}>
                    <Award className="h-5 w-5" style={{ color: COLORS.maroon }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CEs Earned</p>
                    <p className="font-bold" style={{ color: COLORS.maroon }}>12 / 20</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: "60%", background: `linear-gradient(90deg, ${COLORS.maroon}, ${COLORS.maroonLight})` }} />
                </div>
                <p className="mt-2 text-xs text-gray-500">8 more needed by Dec 2025</p>
              </CardContent>
            </Card>

            <Card className="border bg-white shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
              <CardContent className="p-6">
                <p className="mb-4 text-sm text-gray-500">Quick Actions</p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start !border-gray-200 !bg-white !text-gray-700 hover:!bg-gray-50" onClick={() => setPage("events")}>
                    <Calendar className="mr-2 h-4 w-4" style={{ color: COLORS.navy }} /> View Events
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start !border-gray-200 !bg-white !text-gray-700 hover:!bg-gray-50" onClick={() => setPage("resources")}>
                    <BookOpen className="mr-2 h-4 w-4" style={{ color: COLORS.navy }} /> Browse Resources
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start !border-gray-200 !bg-white !text-gray-700 hover:!bg-gray-50" onClick={() => setPage("training")}>
                    <GraduationCap className="mr-2 h-4 w-4" style={{ color: COLORS.navy }} /> Training Center
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold" style={{ color: COLORS.navy }}>Upcoming Events</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {EVENTS.slice(0, 2).map((event, i) => (
                <Card key={i} className="group overflow-hidden border bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
                  <CardContent className="flex items-center gap-0 p-0">
                    <div className="flex w-20 flex-shrink-0 flex-col items-center justify-center py-6" style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}>
                      <span className="text-xs font-semibold uppercase text-white/70">{event.month}</span>
                      <span className="text-2xl font-bold text-white">{event.day}</span>
                    </div>
                    <div className="flex-1 p-4">
                      <p className="font-semibold" style={{ color: COLORS.maroon }}>{event.title}</p>
                      {event.speaker && <p className="text-sm text-gray-500">{event.speaker}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold" style={{ color: COLORS.navy }}>Recent Activity</h2>
            <Card className="border bg-white shadow-md" style={{ borderColor: `${COLORS.navy}15` }}>
              <CardContent className="p-0">
                {[
                  { action: "Completed CE: Trauma Informed Care", time: "2 days ago", icon: CheckCircle2 },
                  { action: "Registered for Heart Disease Prevention Meeting", time: "1 week ago", icon: Calendar },
                  { action: "Downloaded: CDC CHW Toolkit", time: "2 weeks ago", icon: Download },
                  { action: "Membership renewed for 2025", time: "1 month ago", icon: UserCheck },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className={`flex items-center gap-4 px-6 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                      <Icon className="h-5 w-5 flex-shrink-0" style={{ color: i % 2 === 0 ? COLORS.navy : COLORS.maroon }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{item.action}</p>
                        <p className="text-xs text-gray-400">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }}>
      <section className="px-4 py-8" style={{ background: `linear-gradient(135deg, ${COLORS.maroonDark} 0%, ${COLORS.navyDark} 100%)` }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="mt-1 text-white/60">TAPCHW Site Analytics & Management</p>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Members", value: ANALYTICS_DATA.totalMembers.toLocaleString(), change: "+142 this month", icon: Users, color: COLORS.navy },
              { label: "Monthly Revenue", value: `$${ANALYTICS_DATA.monthlyRevenue.toLocaleString()}`, change: "+12% vs last month", icon: DollarSign, color: COLORS.maroon },
              { label: "Event Registrations", value: ANALYTICS_DATA.eventRegistrations.toString(), change: "Next: Feb 14", icon: Calendar, color: COLORS.navyLight },
              { label: "Resource Downloads", value: ANALYTICS_DATA.resourceDownloads.toLocaleString(), change: "+89 this week", icon: Download, color: COLORS.maroonLight },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className="border bg-white shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm text-gray-500">{kpi.label}</p>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${kpi.color}15` }}>
                        <Icon className="h-4 w-4" style={{ color: kpi.color }} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      {kpi.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card className="border bg-white shadow-lg lg:col-span-2" style={{ borderColor: `${COLORS.navy}15` }}>
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: COLORS.navy }}>Member Growth</h3>
                    <p className="text-sm text-gray-500">Last 6 months</p>
                  </div>
                  <Badge style={{ backgroundColor: `${COLORS.navy}15`, color: COLORS.navy }}>
                    <TrendingUp className="mr-1 h-3 w-3" /> +24.9%
                  </Badge>
                </div>
                <div className="flex h-48 gap-3">
                  {ANALYTICS_DATA.memberGrowth.map((item) => {
                    const maxVal = Math.max(...ANALYTICS_DATA.memberGrowth.map((d) => d.value));
                    const height = (item.value / maxVal) * 100;
                    return (
                      <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">{item.value.toLocaleString()}</span>
                        <div className="relative w-full flex-1">
                          <div
                            className="absolute bottom-0 left-1/2 w-3/5 -translate-x-1/2 rounded-t-lg transition-all duration-500 hover:opacity-80"
                            style={{ height: `${height}%`, background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-white shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold" style={{ color: COLORS.maroon }}>Top Resources</h3>
                <div className="space-y-4">
                  {ANALYTICS_DATA.topResources.map((resource, i) => (
                    <div key={i}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="mr-2 truncate text-gray-600">{resource.name}</span>
                        <span className="flex-shrink-0 font-medium text-gray-800">{resource.downloads}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(resource.downloads / ANALYTICS_DATA.topResources[0]!.downloads) * 100}%`,
                            background: `linear-gradient(90deg, ${COLORS.maroon}, ${COLORS.maroonLight})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card className="border bg-white shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold" style={{ color: COLORS.navy }}>Recent Members</h3>
                  <Badge variant="outline" className="!border-gray-200 !text-gray-500">Last 30 days</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-3 text-left font-medium text-gray-500">Name</th>
                        <th className="py-3 text-left font-medium text-gray-500">Plan</th>
                        <th className="py-3 text-left font-medium text-gray-500">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ANALYTICS_DATA.recentMembers.map((member, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="py-3 font-medium text-gray-800">{member.name}</td>
                          <td className="py-3">
                            <Badge variant="outline" className="text-xs" style={{ borderColor: `${COLORS.navy}30`, color: COLORS.navy }}>
                              {member.type}
                            </Badge>
                          </td>
                          <td className="py-3 text-gray-500">{member.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {MEMBERSHIP_TIERS.map((tier) => {
              const memberCounts: Record<string, number> = { Organization: 28, Individual: 4830, "Bi-Annual": 389 };
              const count = memberCounts[tier.name] ?? 0;
              return (
                <Card key={tier.name} className="border bg-white shadow-lg" style={{ borderColor: `${COLORS.navy}15` }}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tier.color }} />
                      <p className="font-bold text-gray-800">{tier.name}</p>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: tier.color }}>{count.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">members</p>
                    <p className="mt-2 text-xs text-gray-400">
                      ${(count * tier.price).toLocaleString()} revenue / {tier.period}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// Main Exported Component
export function TAPCHWWebsiteDemo({ backHref }: { backHref?: string }) {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const handleLogin = (user: DemoUser) => {
    setCurrentUser(user);
    setCurrentPage("member-dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("home");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthPage = currentPage === "login" || currentPage === "member-dashboard" || currentPage === "admin-dashboard";

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setPage={setCurrentPage} />;
      case "about": return <AboutPage />;
      case "events": return <EventsPage />;
      case "resources": return <ResourcesPage />;
      case "training": return <TrainingPage />;
      case "membership": return <MembershipPage />;
      case "contact": return <ContactPage />;
      case "login": return <LoginPage onLogin={handleLogin} />;
      case "member-dashboard": return currentUser ? <MemberDashboard user={currentUser} setPage={setCurrentPage} /> : <LoginPage onLogin={handleLogin} />;
      case "admin-dashboard": return currentUser?.role === "admin" ? <AdminDashboard /> : <LoginPage onLogin={handleLogin} />;
      default: return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">

      {/* Demo Banner */}
      {backHref && (
        <div className="relative z-50 px-4 py-2 text-center text-sm text-white" style={{ backgroundColor: COLORS.maroon }}>
          <Link href={backHref} className="inline-flex items-center gap-2 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            This is a design preview — Back to Demo Hub
          </Link>
        </div>
      )}

      {/* Announcement Bar */}
      {!announcementDismissed && !isAuthPage && (
        <div className="relative z-40 px-4 py-2 text-center text-sm text-white" style={{ background: `linear-gradient(90deg, ${COLORS.navyDark} 0%, ${COLORS.navy} 50%, ${COLORS.navyDark} 100%)` }}>
          <span className="mr-2 inline-flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-yellow-300" />
            </span>
            <span className="font-medium">Next Quarterly Meeting: May 9th</span>
            <span className="hidden text-white/60 sm:inline">— Immunizations & Anti-Immunizations Movement</span>
          </span>
          <button onClick={() => setAnnouncementDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-white/50 transition-colors hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-lg backdrop-blur-md" : "bg-white shadow-sm"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button onClick={() => setCurrentPage("home")} className="flex items-center gap-3">
            <Image src="/demos/tapchw-logo.png" alt="TAPCHW" width={44} height={44} className="object-contain" style={{ filter: LOGO_FILTER }} />
            <span className="text-lg font-bold" style={{ color: COLORS.maroon }}>TAPCHW</span>
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${currentPage === item.id ? "" : "hover:bg-gray-50"}`}
                style={{ color: currentPage === item.id ? COLORS.maroon : COLORS.navy }}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full" style={{ backgroundColor: COLORS.maroon }} />
                )}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {currentUser ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  style={{ borderColor: `${COLORS.navy}30`, color: COLORS.navy }}
                  onClick={() => setCurrentPage("member-dashboard")}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
                {currentUser.role === "admin" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    style={{ borderColor: `${COLORS.maroon}30`, color: COLORS.maroon }}
                    onClick={() => setCurrentPage("admin-dashboard")}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Admin
                  </Button>
                )}
                <div className="mx-1 h-5 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.navy} 100%)` }}
                  >
                    {currentUser.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <button onClick={handleLogout} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <Button
                size="sm"
                className="text-white"
                style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
                onClick={() => setCurrentPage("login")}
              >
                Log In
              </Button>
            )}
          </div>

          <button className="rounded-lg p-2 lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: COLORS.navy }}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t bg-white px-4 py-4 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-medium ${currentPage === item.id ? "bg-gray-50" : ""}`}
                style={{ color: currentPage === item.id ? COLORS.maroon : COLORS.navy }}
              >
                {item.label}
              </button>
            ))}
            <div className="mt-2 border-t border-gray-100 pt-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => { setCurrentPage("member-dashboard"); setMobileMenuOpen(false); }}
                    className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium"
                    style={{ color: COLORS.navy }}
                  >
                    Dashboard
                  </button>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => { setCurrentPage("admin-dashboard"); setMobileMenuOpen(false); }}
                      className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium"
                      style={{ color: COLORS.maroon }}
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-400"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setCurrentPage("login"); setMobileMenuOpen(false); }}
                  className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium"
                  style={{ color: COLORS.maroon }}
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main>{renderPage()}</main>

      {/* Footer */}
      <footer style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-4 md:gap-12">
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2">
                  <Image src="/demos/tapchw-logo.png" alt="TAPCHW" width={36} height={36} className="object-contain" style={{ filter: LOGO_FILTER }} />
                </div>
                <span className="text-xl font-bold text-white">TAPCHW</span>
              </div>
              <p className="max-w-sm text-sm text-white/70">
                A 501(c)(3) non-profit serving all Community Health Workers across Texas,
                led by certified CHWs and CHW Instructors.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {NAV_ITEMS.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <button onClick={() => setCurrentPage(item.id)} className="text-white/70 transition-colors hover:text-white">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">Contact</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>info@tapchw.org</li>
                <li>membership@tapchw.org</li>
                <li>training@tapchw.org</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/50">
            © 2025 Texas Association of Promotores & Community Health Workers. All rights reserved.
          </div>
          <div className="mt-4 text-center text-xs text-white/30">
            Website designed and developed in partnership with CHW360
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 ${showBackToTop ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}
        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}
