"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  HeartPulse,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  Target,
  Users,
  Briefcase,
  Award,
  Handshake,
  Globe,
  CheckCircle2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Play,
  Star,
  Quote,
  Sparkles,
  Shield,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

// Animated counter hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, start: () => setHasStarted(true) };
}

export default function CHW360WebsiteDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      icon: BookOpen,
      title: "CHW Training Programs",
      description:
        "Comprehensive certification courses designed to prepare community health workers for real-world impact",
      badge: "Most Popular",
    },
    {
      icon: Briefcase,
      title: "Workforce Development",
      description:
        "Career pathways, continuing education, and professional growth opportunities for CHWs",
      badge: null,
    },
    {
      icon: Laptop,
      title: "Digital Learning Tools",
      description:
        "Modern e-learning platforms and mobile resources for flexible, accessible training",
      badge: "New",
    },
    {
      icon: Target,
      title: "Program Consulting",
      description:
        "Strategic guidance for organizations launching or scaling CHW programs",
      badge: null,
    },
    {
      icon: Award,
      title: "Certification Support",
      description:
        "Exam preparation, credential tracking, and continuing education credit management",
      badge: null,
    },
    {
      icon: Handshake,
      title: "Partnership Development",
      description:
        "Building bridges between healthcare systems, community organizations, and CHW networks",
      badge: null,
    },
  ];

  const audiences = [
    {
      icon: HeartPulse,
      title: "Community Health Workers",
      description: "Advance your career with recognized certifications",
    },
    {
      icon: Building2,
      title: "Health Departments",
      description: "Build and scale effective CHW programs",
    },
    {
      icon: GraduationCap,
      title: "Universities & Colleges",
      description: "Partner on curriculum development and research",
    },
    {
      icon: Stethoscope,
      title: "Healthcare Systems",
      description: "Integrate CHWs into care delivery models",
    },
    {
      icon: Users,
      title: "Community Organizations",
      description: "Empower your team with CHW training",
    },
    {
      icon: Globe,
      title: "Policymakers",
      description: "Shape the future of community health workforce",
    },
  ];

  const testimonials = [
    {
      quote:
        "CHW360 transformed our community health program. Their training curriculum is world-class and their support team is incredibly responsive.",
      author: "Dr. Maria Santos",
      role: "Director of Community Health",
      org: "Metro Health Department",
      rating: 5,
    },
    {
      quote:
        "The certification process was smooth and the digital learning platform made it easy for our team to complete training on their own schedule.",
      author: "James Mitchell",
      role: "Program Manager",
      org: "Regional Medical Center",
      rating: 5,
    },
    {
      quote:
        "As a CHW, this certification opened doors I never thought possible. The career resources and continuing education are invaluable.",
      author: "Keisha Washington",
      role: "Certified CHW",
      org: "Community First Initiative",
      rating: 5,
    },
  ];

  const stats = [
    { value: 5000, suffix: "+", label: "CHWs Trained" },
    { value: 150, suffix: "+", label: "Partner Organizations" },
    { value: 48, suffix: "", label: "States Served" },
    { value: 98, suffix: "%", label: "Satisfaction Rate" },
  ];

  const partners = [
    "National Health Service Corps",
    "CDC Foundation",
    "APHA",
    "HRSA",
    "Community Health Center",
    "State Health Collaborative",
  ];

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: "#FDF8F3" }}>
      {/* Demo Banner */}
      <div
        className="relative z-50 px-4 py-2 text-center text-sm text-white"
        style={{ backgroundColor: "#0D7377" }}
      >
        <Link
          href={`/portal/${slug}/demos/website`}
          className="inline-flex items-center gap-2 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          This is a design preview - Back to Demo Hub
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b bg-white/80 px-4 py-4 backdrop-blur-lg"
        style={{ borderColor: "rgba(13, 115, 119, 0.1)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "#0D7377" }}
          >
            CHW360
          </span>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {["Services", "Who We Serve", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium transition-all hover:text-[#E07A5F]"
                style={{ color: "#0D7377" }}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="hidden shadow-lg shadow-[#E07A5F]/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#E07A5F]/30 sm:flex"
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)",
                color: "white",
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started
            </Button>

            {/* Mobile menu button */}
            <button
              className="rounded-lg p-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: "#0D7377" }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-b bg-white px-4 py-4 shadow-lg md:hidden">
            {["Services", "Who We Serve", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block py-3 text-sm font-medium"
                style={{ color: "#0D7377" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Button
              className="mt-4 w-full shadow-lg"
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)",
                color: "white",
              }}
            >
              Get Started
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24 lg:py-32">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #14919B 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #E07A5F 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <h1
                className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ color: "#0D7377" }}
              >
                Empowering the{" "}
                <span className="relative inline-block" style={{ color: "#E07A5F" }}>
                  Future
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 8C50 2 150 2 198 8"
                      stroke="#E07A5F"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  </svg>
                </span>{" "}
                of Community Health
              </h1>

              <p
                className="mb-8 text-lg leading-relaxed sm:text-xl"
                style={{ color: "#4A5568" }}
              >
                CHW360 provides comprehensive training, certification, and
                workforce development solutions for Community Health Workers and
                the organizations that support them.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  className="group w-full px-8 shadow-xl shadow-[#E07A5F]/25 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#E07A5F]/30 sm:w-auto"
                  style={{
                    background: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)",
                    color: "white",
                  }}
                >
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group w-full px-8 transition-all hover:scale-105 sm:w-auto"
                  style={{
                    borderColor: "#0D7377",
                    color: "#0D7377",
                    borderWidth: "2px",
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-col items-center gap-4 lg:items-start">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    4.9/5 from 500+ reviews
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Trusted by 150+ health organizations nationwide
                </p>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-[350px] w-[350px] animate-pulse rounded-full opacity-20 sm:h-[450px] sm:w-[450px]"
                  style={{ border: "2px dashed #0D7377" }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-[280px] w-[280px] rounded-full opacity-30 sm:h-[350px] sm:w-[350px]"
                  style={{ border: "2px solid #14919B" }}
                />
              </div>

              {/* Main visual container */}
              <div
                className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #0D7377 0%, #14919B 50%, #2D9596 100%)",
                }}
              >
                {/* Abstract pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="heroPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="2" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#heroPattern)" />
                  </svg>
                </div>

                {/* Floating cards */}
                <div className="absolute left-4 top-8 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:left-8 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">This Month</p>
                      <p className="font-bold text-gray-900">+247 CHWs</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-4 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:right-8 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#E07A5F]/10 p-2">
                      <Award className="h-5 w-5 text-[#E07A5F]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Certified</p>
                      <p className="font-bold text-gray-900">5,000+ CHWs</p>
                    </div>
                  </div>
                </div>

                {/* Center content */}
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center text-white">
                    <HeartPulse className="mx-auto mb-4 h-20 w-20 opacity-90 sm:h-24 sm:w-24" />
                    <p className="text-lg font-semibold opacity-90">
                      Building Healthier Communities
                    </p>
                    <p className="mt-2 text-sm opacity-70">
                      One trained CHW at a time
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -right-4 top-1/2 -translate-y-1/2 rotate-12 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg sm:-right-8"
                style={{ background: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)" }}
              >
                ACCREDITED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="border-y bg-white/50 px-4 py-8" style={{ borderColor: "rgba(13, 115, 119, 0.1)" }}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-gray-500">
            Trusted by leading health organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
            {partners.map((partner) => (
              <div
                key={partner}
                className="text-sm font-semibold text-gray-600"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="relative overflow-hidden px-4 py-12 sm:py-16"
        style={{
          background: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)",
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="statsPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M0 30h60M30 0v60" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#statsPattern)" />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="group">
              <p className="text-4xl font-extrabold text-white transition-transform group-hover:scale-110 sm:text-5xl">
                {stat.value.toLocaleString()}{stat.suffix}
              </p>
              <p className="mt-2 text-sm font-medium text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2
              className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
              style={{ color: "#0D7377" }}
            >
              Comprehensive CHW Solutions
            </h2>
            <p className="mx-auto text-lg" style={{ color: "#4A5568" }}>
              Everything you need to build, train, and sustain an effective community health workforce
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group relative overflow-hidden bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    border: "1px solid rgba(13, 115, 119, 0.15)",
                  }}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(135deg, rgba(13, 115, 119, 0.03) 0%, rgba(224, 122, 95, 0.03) 100%)",
                    }}
                  />

                  {service.badge && (
                    <Badge
                      className="absolute right-4 top-4 border-0 text-xs"
                      style={{
                        background: service.badge === "New" ? "#E07A5F" : "#0D7377",
                        color: "white",
                      }}
                    >
                      {service.badge}
                    </Badge>
                  )}

                  <CardContent className="relative p-6 sm:p-8">
                    <div
                      className="mb-5 inline-flex items-center justify-center rounded-2xl p-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, rgba(13, 115, 119, 0.1) 0%, rgba(20, 145, 155, 0.15) 100%)",
                      }}
                    >
                      <Icon className="h-7 w-7" style={{ color: "#0D7377" }} />
                    </div>
                    <h3
                      className="mb-3 text-xl font-bold"
                      style={{ color: "#0D7377" }}
                    >
                      {service.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed" style={{ color: "#4A5568" }}>
                      {service.description}
                    </p>
                    <span
                      className="inline-flex cursor-pointer items-center text-sm font-semibold transition-colors hover:text-[#E07A5F]"
                      style={{ color: "#0D7377" }}
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section
        id="who-we-serve"
        className="px-4 py-16 sm:py-24"
        style={{ backgroundColor: "rgba(13, 115, 119, 0.04)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2
              className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
              style={{ color: "#0D7377" }}
            >
              Built for Everyone in the CHW Ecosystem
            </h2>
            <p
              className="mx-auto max-w-2xl text-lg"
              style={{ color: "#4A5568" }}
            >
              From individual CHWs to national health systems, we meet you where
              you are
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <Card
                  key={audience.title}
                  className="group cursor-pointer bg-white transition-all duration-300 hover:shadow-xl"
                  style={{ border: "1px solid rgba(13, 115, 119, 0.15)" }}
                >
                  <CardContent className="flex items-start gap-4 p-6">
                    <div
                      className="flex-shrink-0 rounded-xl p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)",
                      }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3
                        className="mb-1 font-bold"
                        style={{ color: "#0D7377" }}
                      >
                        {audience.title}
                      </h3>
                      <p className="text-sm" style={{ color: "#4A5568" }}>
                        {audience.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2
              className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
              style={{ color: "#0D7377" }}
            >
              What Our Partners Say
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
                style={{ border: "1px solid rgba(13, 115, 119, 0.15)" }}
              >
                <CardContent className="p-6 sm:p-8">
                  <Quote
                    className="mb-4 h-8 w-8 opacity-20"
                    style={{ color: "#0D7377" }}
                  />
                  <div className="mb-4 flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p
                    className="mb-6 text-sm italic leading-relaxed"
                    style={{ color: "#4A5568" }}
                  >
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)",
                      }}
                    >
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: "#0D7377" }}>
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.role}, {testimonial.org}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About/Mission Section */}
      <section
        id="about"
        className="relative overflow-hidden px-4 py-16 sm:py-24"
        style={{
          background: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/5" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Transforming Community Health,
            <br />
            <span className="text-[#E07A5F]">One CHW at a Time</span>
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-white/90 sm:text-xl">
            CHW360 exists to strengthen community health systems by developing,
            supporting, and empowering community health workers. We believe that
            well-trained, well-supported CHWs are essential to achieving health
            equity and improving outcomes in underserved communities.
          </p>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Excellence",
                description: "Evidence-based training meeting national standards",
              },
              {
                icon: Users,
                title: "Community",
                description: "Building networks that amplify CHW impact",
              },
              {
                icon: Target,
                title: "Equity",
                description: "Accessible programs for all communities",
              },
            ].map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group rounded-2xl bg-white/10 p-6 backdrop-blur transition-all hover:bg-white/20"
                >
                  <Icon className="mx-auto mb-4 h-10 w-10 text-white transition-transform group-hover:scale-110" />
                  <h3 className="mb-2 text-lg font-bold text-white">
                    {value.title}
                  </h3>
                  <p className="text-sm text-white/80">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <Card
            className="relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #FDF8F3 0%, #fff 100%)",
              border: "2px solid rgba(13, 115, 119, 0.2)",
            }}
          >
            {/* Decorative gradient */}
            <div
              className="absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-50 blur-3xl"
              style={{ background: "#E07A5F" }}
            />
            <div
              className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full opacity-50 blur-3xl"
              style={{ background: "#14919B" }}
            />

            <CardContent className="relative p-8 text-center sm:p-12">
              <h2
                className="mb-4 text-2xl font-extrabold sm:text-3xl md:text-4xl"
                style={{ color: "#0D7377" }}
              >
                Ready to Strengthen Your CHW Program?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-gray-600">
                Join 150+ organizations that have transformed their community health
                outcomes with CHW360's comprehensive training solutions.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="w-full px-8 shadow-xl shadow-[#E07A5F]/25 transition-all hover:scale-105 sm:w-auto"
                  style={{
                    background: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)",
                    color: "white",
                  }}
                >
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full px-8 sm:w-auto"
                  style={{ borderColor: "#0D7377", color: "#0D7377" }}
                >
                  Download Program Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-4 py-16 sm:py-24" style={{ backgroundColor: "rgba(13, 115, 119, 0.04)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2
                className="mb-4 text-3xl font-extrabold sm:text-4xl"
                style={{ color: "#0D7377" }}
              >
                Let's Start a Conversation
              </h2>
              <p className="mb-8 text-lg" style={{ color: "#4A5568" }}>
                Ready to strengthen your community health workforce? Our team is
                here to help.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "info@chw360.org" },
                  { icon: Phone, label: "Phone", value: "(555) 360-0000" },
                  { icon: MapPin, label: "Location", value: "Serving communities nationwide" },
                ].map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <div key={contact.label} className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, rgba(13, 115, 119, 0.1) 0%, rgba(20, 145, 155, 0.15) 100%)",
                        }}
                      >
                        <Icon className="h-6 w-6" style={{ color: "#0D7377" }} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{contact.label}</p>
                        <p className="font-semibold" style={{ color: "#0D7377" }}>
                          {contact.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social links */}
              <div className="mt-10">
                <p className="mb-4 text-sm font-medium text-gray-500">Follow us</p>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-110"
                      style={{ background: "rgba(13, 115, 119, 0.1)" }}
                    >
                      <Icon className="h-5 w-5" style={{ color: "#0D7377" }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <Card
              className="overflow-hidden bg-white shadow-xl"
              style={{ border: "1px solid rgba(13, 115, 119, 0.15)" }}
            >
              <CardContent className="p-6 sm:p-8">
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: "#0D7377" }}>
                        First Name
                      </label>
                      <Input
                        placeholder="John"
                        className="h-12 transition-all focus:border-[#0D7377] focus:ring-[#0D7377]" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: "#0D7377" }}>
                        Last Name
                      </label>
                      <Input
                        placeholder="Doe"
                        className="h-12 transition-all focus:border-[#0D7377] focus:ring-[#0D7377]" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: "#0D7377" }}>
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 transition-all focus:border-[#0D7377] focus:ring-[#0D7377]" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: "#0D7377" }}>
                      Organization
                    </label>
                    <Input
                      placeholder="Your organization"
                      className="h-12 transition-all focus:border-[#0D7377] focus:ring-[#0D7377]" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: "#0D7377" }}>
                      Message
                    </label>
                    <Textarea
                      placeholder="Tell us about your CHW program needs..."
                      className="min-h-[130px] transition-all focus:border-[#0D7377] focus:ring-[#0D7377]" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full text-base shadow-lg shadow-[#E07A5F]/25 transition-all hover:scale-[1.02] hover:shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)",
                      color: "white",
                    }}
                  >
                    Send Message
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    We'll respond within 24 hours. Your information is secure.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative overflow-hidden px-4 py-12 sm:py-16"
        style={{
          background: "linear-gradient(135deg, #0D7377 0%, #0a5c5f 100%)",
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="footerPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footerPattern)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <span className="text-2xl font-bold text-white">CHW360</span>
              </div>
              <p className="mb-6 text-sm text-white/70">
                Empowering community health workers to transform health outcomes
                in underserved communities across America.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-all hover:bg-white/20"
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm text-white/70">
                {["About Us", "Programs", "Resources", "Careers", "Blog"].map((link) => (
                  <li key={link}>
                    <a href="#" className="transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">For Partners</h4>
              <ul className="space-y-3 text-sm text-white/70">
                {["Health Departments", "Healthcare Systems", "Academic Partners", "Funders", "Community Orgs"].map(
                  (link) => (
                    <li key={link}>
                      <a href="#" className="transition-colors hover:text-white">
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">Contact</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>info@chw360.org</li>
                <li>(555) 360-0000</li>
                <li>Nationwide Coverage</li>
              </ul>
              <div className="mt-6">
                <Badge className="border-white/20 bg-white/10 text-white">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Nationally Accredited
                </Badge>
              </div>
            </div>
          </div>

          <div
            className="mt-12 border-t pt-8 text-center text-sm text-white/50"
            style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <p>&copy; 2024 CHW360. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
