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
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

// Brand colors
const COLORS = {
  maroon: "#8B2332",
  maroonDark: "#6B1A26",
  maroonLight: "#A83244",
  navy: "#354F8B",
  navyLight: "#4A6AAF",
  navyDark: "#263A66",
  cream: "#FDF8F3",
  gold: "#C9A227",
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
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
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
      <p className="font-serif text-5xl font-bold text-white sm:text-6xl">
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
              className="group flex h-24 min-w-[180px] flex-shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <Image
                src={member.logo}
                alt={member.name}
                width={140}
                height={70}
                className="max-h-16 w-auto object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
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

        <div className="relative h-[280px] overflow-visible sm:h-[240px]">
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
        style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 50%, ${COLORS.maroonDark} 100%)` }}
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
                  style={{ color: COLORS.gold }}
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
                    style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
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

              <div className="relative flex justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[400px] w-[400px] rounded-full border-2 border-dashed border-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[320px] w-[320px] rounded-full border border-white/10" />
                </div>

                <div className="relative z-10 flex items-center justify-center">
                  <Image
                    src="/demos/tapchw-logo.png"
                    alt="TAPCHW"
                    width={280}
                    height={280}
                    className="object-contain drop-shadow-2xl sm:h-[320px] sm:w-[320px]"
                  />
                </div>

                <div className="absolute -left-4 top-1/4 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:-left-8">
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

                <div className="absolute -right-4 bottom-1/4 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:-right-8">
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

      {/* Stats Section */}
      <section
        className="relative overflow-hidden px-4 py-24"
        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonDark} 100%)` }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {STATS.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-24" style={{ backgroundColor: COLORS.cream }}>
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" style={{ backgroundColor: `${COLORS.navy}15`, color: COLORS.navy }}>
            About Us
          </Badge>
          <h2 className="font-serif mb-6 text-4xl font-bold sm:text-5xl" style={{ color: COLORS.maroon }}>
            Empowering Texas CHWs Since Day One
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            We are a 501(c)3 non-profit professional organization that offers membership and supports
            the Community Health Worker (CHW) workforce through continuing education, job opportunities,
            and various CHW-led projects across Texas.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="group overflow-hidden border-0 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
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

            <Card className="group overflow-hidden border-0 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
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
        className="relative overflow-hidden px-4 py-24"
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

      {/* Goals Section */}
      <section className="px-4 py-24" style={{ backgroundColor: COLORS.cream }}>
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
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <Badge className="mb-4" style={{ backgroundColor: `${COLORS.navy}15`, color: COLORS.navy }}>
              Testimonials
            </Badge>
            <h2 className="font-serif text-4xl font-bold sm:text-5xl" style={{ color: COLORS.maroon }}>
              What Our Members Say
            </h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Member Organizations Carousel */}
      <section className="border-y bg-white py-4" style={{ borderColor: "rgba(53, 79, 139, 0.1)" }}>
        <LogoCarousel title="Trusted by Leading Texas Organizations" />
      </section>

      {/* CTA Section */}
      <section
        className="relative overflow-hidden px-4 py-28"
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
        className="relative overflow-hidden px-4 py-28"
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

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div
              className="aspect-square rounded-3xl p-8 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)` }}
            >
              <div className="flex h-full items-center justify-center">
                <Image src="/demos/tapchw-logo.png" alt="TAPCHW" width={250} height={250} className="object-contain drop-shadow-2xl" />
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

      <section className="px-4 py-20" style={{ backgroundColor: COLORS.cream }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif mb-12 text-center text-4xl font-bold" style={{ color: COLORS.maroon }}>Core Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="group border-0 bg-white shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white transition-all group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}cc 100%)` }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-bold" style={{ color: COLORS.maroon }}>{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
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
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold" style={{ color: COLORS.navy }}>
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

        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const event = getEventForDay(day);
            return (
              <div
                key={day}
                className={`group relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                  event ? "cursor-pointer font-bold text-white" : "hover:bg-gray-50"
                }`}
                style={event ? { backgroundColor: event.color } : {}}
                title={event?.title}
              >
                {day}
                {event && (
                  <div className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: COLORS.maroon }} />
            <span className="text-gray-600">Member Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: COLORS.navy }} />
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
        className="px-4 py-24"
        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonDark} 100%)` }}
      >
        <div className="mx-auto max-w-4xl">
          <Badge className="mb-4 border-white/20 bg-white/10 text-white">Events</Badge>
          <h1 className="font-serif text-5xl font-bold text-white">Upcoming Events</h1>
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
        className="px-4 py-24"
        style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonDark} 100%)` }}
      >
        <div className="mx-auto max-w-4xl">
          <Badge className="mb-4 border-white/20 bg-white/10 text-white">Library</Badge>
          <h1 className="font-serif mb-6 text-5xl font-bold text-white">CHW Resources</h1>
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
                <Card key={section.title} className="border-0 bg-white shadow-lg">
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
        className="px-4 py-24"
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
      <section className="px-4 py-24" style={{ backgroundColor: COLORS.cream }}>
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
                  tier.popular ? "ring-2 ring-amber-400 ring-offset-4" : ""
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
                    <span className="text-5xl font-bold text-white">${tier.price}</span>
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
        className="px-4 py-28"
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

          <Card className="border-0 bg-white shadow-xl">
            <CardContent className="p-6">
              <h3 className="mb-6 text-xl font-bold" style={{ color: COLORS.navy }}>Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="First Name" className="h-12" />
                  <Input placeholder="Last Name" className="h-12" />
                </div>
                <Input type="email" placeholder="Email" className="h-12" />
                <Input placeholder="Subject" className="h-12" />
                <Textarea placeholder="Your message..." className="min-h-[120px]" />
                <Button
                  className="h-12 w-full text-white"
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

// Main Exported Component
export function TAPCHWWebsiteDemo({ backHref }: { backHref?: string }) {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setPage={setCurrentPage} />;
      case "about": return <AboutPage />;
      case "events": return <EventsPage />;
      case "resources": return <ResourcesPage />;
      case "training": return <TrainingPage />;
      case "membership": return <MembershipPage />;
      case "contact": return <ContactPage />;
      default: return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Demo Banner */}
      {backHref && (
        <div className="relative z-50 px-4 py-2 text-center text-sm text-white" style={{ backgroundColor: COLORS.maroon }}>
          <Link href={backHref} className="inline-flex items-center gap-2 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            This is a design preview — Back to Demo Hub
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-lg backdrop-blur-md" : "bg-white shadow-sm"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button onClick={() => setCurrentPage("home")} className="flex items-center gap-3">
            <Image src="/demos/tapchw-logo.png" alt="TAPCHW" width={44} height={44} className="object-contain" />
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

          <Button
            size="sm"
            className="hidden text-white lg:flex"
            style={{ background: `linear-gradient(135deg, ${COLORS.maroon} 0%, ${COLORS.maroonLight} 100%)` }}
          >
            Log In
          </Button>

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
          </div>
        )}
      </nav>

      <main>{renderPage()}</main>

      {/* Footer */}
      <footer style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2">
                  <Image src="/demos/tapchw-logo.png" alt="TAPCHW" width={36} height={36} className="object-contain" />
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
        </div>
      </footer>
    </div>
  );
}
