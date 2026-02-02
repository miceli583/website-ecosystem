"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";

const serif = Libre_Baskerville({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});
import {
  ArrowLeft,
  Menu,
  X,
  Facebook,
  Linkedin,
  Twitter,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export default function CHW360MockupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero carousel images - diverse healthcare workers (duplicated for seamless loop)
  const heroImages = [
    { src: "/chw/hero-image.png", alt: "Community Health Worker with tablet" },
    { src: "/chw/hero-2.jpg", alt: "Diverse group of smiling healthcare professionals in scrubs" },
    { src: "/chw/hero-3.jpg", alt: "Healthcare team collaborating around a laptop" },
    { src: "/chw/hero-4.jpg", alt: "Diverse medical team standing together outside hospital" },
  ];

  const coreSupports = [
    {
      icon: "training",
      title: "Training & Education",
      description: "Courses aligned with texas CHW core competencies.",
    },
    {
      icon: "workforce",
      title: "Workforce Development",
      description: "Guidance-an-career growth-ath and professional development.",
    },
    {
      icon: "digital",
      title: "Digital Tools Training",
      description: "Training on essential cigital tools for CHWs.",
    },
    {
      icon: "community",
      title: "Expanded Community & Professional Connections",
      description: "Network opportunities to contract with thilew CHWs and health professionals.",
    },
    {
      icon: "application",
      title: "Application Submission Support",
      description: "Assistance with the submission of CHW certification applications.",
    },
    {
      icon: "application2",
      title: "Application Submission Support",
      description: "Assistance with the submission of CHW certification applications.",
    },
  ];

  const audiences = [
    {
      icon: "chw",
      title: "Community\nHealth Workers",
      description: "Ongoing education and support to advance your CHW career.",
    },
    {
      icon: "health",
      title: "Public Health Departments",
      description: "Enhance outreach and care cordina-tion with skilled CHWs.",
    },
    {
      icon: "training",
      title: "Training\nPrograms",
      description: "Deliver state-aligned training locally and effectively.",
    },
  ];

  // Illustrated icon components matching the mockup style
  const CoreSupportIcon = ({ type }: { type: string }) => {
    const iconStyles = "w-16 h-16 rounded-full flex items-center justify-center";

    switch (type) {
      case "training":
        return (
          <div className={iconStyles} style={{ backgroundColor: "#F5E6DC" }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="12" width="16" height="20" rx="2" fill="#D4A574" />
              <rect x="12" y="8" width="16" height="20" rx="2" fill="#E8C4A0" />
              <rect x="16" y="4" width="16" height="20" rx="2" fill="#C9725B" />
              <path d="M20 8L28 8L28 20L20 20Z" fill="#A85A48" />
            </svg>
          </div>
        );
      case "workforce":
        return (
          <div className={iconStyles} style={{ backgroundColor: "#F5E6DC" }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="14" width="28" height="18" rx="3" fill="#C9725B" />
              <rect x="14" y="8" width="12" height="8" rx="1" fill="#A85A48" />
              <rect x="10" y="18" width="20" height="2" fill="#FFF" opacity="0.5" />
            </svg>
          </div>
        );
      case "digital":
        return (
          <div className={iconStyles} style={{ backgroundColor: "#E8F4F0" }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="8" width="28" height="20" rx="2" fill="#5B8A8A" />
              <rect x="8" y="10" width="24" height="14" fill="#A8D4D4" />
              <rect x="14" y="28" width="12" height="4" fill="#5B8A8A" />
              <rect x="10" y="32" width="20" height="2" fill="#5B8A8A" />
            </svg>
          </div>
        );
      case "community":
        return (
          <div className={iconStyles} style={{ backgroundColor: "#E8F4F0" }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <circle cx="12" cy="14" r="5" fill="#5B8A8A" />
              <circle cx="28" cy="14" r="5" fill="#5B8A8A" />
              <circle cx="20" cy="24" r="5" fill="#3D7A7A" />
              <path d="M12 20C12 20 16 22 20 22C24 22 28 20 28 20" stroke="#5B8A8A" strokeWidth="2" />
            </svg>
          </div>
        );
      case "application":
        return (
          <div className={iconStyles} style={{ backgroundColor: "#E8F4E8" }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="10" y="6" width="20" height="28" rx="2" fill="#A8C4A0" />
              <rect x="14" y="12" width="12" height="2" fill="#5B8A5B" />
              <rect x="14" y="18" width="12" height="2" fill="#5B8A5B" />
              <rect x="14" y="24" width="8" height="2" fill="#5B8A5B" />
              <path d="M16 28L19 31L26 24" stroke="#5B8A5B" strokeWidth="2" />
            </svg>
          </div>
        );
      case "application2":
        return (
          <div className={iconStyles} style={{ backgroundColor: "#E8F4E8" }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="4" width="18" height="24" rx="2" fill="#A8C4A0" />
              <rect x="14" y="6" width="18" height="24" rx="2" fill="#C4D4BC" />
              <rect x="18" y="12" width="10" height="2" fill="#5B8A5B" />
              <rect x="18" y="16" width="10" height="2" fill="#5B8A5B" />
              <rect x="18" y="20" width="6" height="2" fill="#5B8A5B" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const AudienceIcon = ({ type }: { type: string }) => {
    const iconMap: Record<string, string> = {
      chw: "/chw/icon-chw.png",
      health: "/chw/icon-health.png",
      training: "/chw/icon-training.png",
    };

    const src = iconMap[type];
    if (!src) return null;

    return (
      <div className="relative mx-auto mb-4 h-20 w-24">
        <Image
          src={src}
          alt=""
          fill
          className="object-contain"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* Animations */}
      <style jsx global>{`
        @keyframes continuousScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Demo Banner */}
      <div
        className="relative z-50 px-4 py-2 text-center text-sm text-white"
        style={{ backgroundColor: "#2D5A5A" }}
      >
        <Link
          href={`/portal/${slug}/demos/mockup`}
          className="inline-flex items-center gap-2 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          This is a design preview - Back to Demo Hub
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 px-4 py-3" style={{ backgroundColor: "#2D5A5A" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/chw/logo.png"
              alt="CHW360"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-2xl tracking-tight text-white">
              <span className="font-semibold">CHW</span><span className="font-light text-white/80">360</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {["Platform", "Core Supports", "Compliance", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[15px] font-medium text-white/90 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="hidden rounded-full px-5 py-2 text-sm font-medium transition-all hover:opacity-90 sm:flex"
              style={{
                backgroundColor: "#C9725B",
                color: "white",
              }}
            >
              Request a Demo
            </Button>

            {/* Mobile menu button */}
            <button
              className="rounded-lg p-2 text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full px-4 py-4 shadow-lg md:hidden" style={{ backgroundColor: "#2D5A5A" }}>
            {["Platform", "Core Supports", "Compliance", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block py-3 text-sm font-medium text-white/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Button
              className="mt-4 w-full rounded-full"
              style={{ backgroundColor: "#C9725B", color: "white" }}
            >
              Request a Demo
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F5EDE6" }}
      >
        {/* Hero Image Carousel - Positioned absolutely on the right */}
        <div className="absolute bottom-0 right-0 top-0 hidden w-[60%] border-0 lg:block">
          {/* Outer container that clips the view */}
          <div className="relative h-full w-full overflow-hidden">
            {/* Continuous scrolling track - images duplicated for seamless loop */}
            <div
              className="absolute flex h-full hover:[animation-play-state:paused]"
              style={{
                animation: "continuousScroll 50s linear infinite",
              }}
            >
              {/* First set of images */}
              {heroImages.map((image, index) => (
                <div
                  key={`first-${index}`}
                  className="relative h-full flex-shrink-0 px-3"
                  style={{ width: "300px" }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="border-0 object-cover"
                      style={{ objectPosition: "center center", border: "none" }}
                      priority={index === 0}
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {heroImages.map((image, index) => (
                <div
                  key={`second-${index}`}
                  className="relative h-full flex-shrink-0 px-3"
                  style={{ width: "300px" }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="border-0 object-cover"
                      style={{ objectPosition: "center center", border: "none" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left gradient overlay - fade into background */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3"
            style={{
              background: "linear-gradient(to right, #F5EDE6 0%, #F5EDE6 30%, transparent 100%)",
            }}
          />
          {/* Right gradient overlay - subtle fade showing peek */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/5"
            style={{
              background: "linear-gradient(to left, #F5EDE6 0%, transparent 100%)",
            }}
          />
          {/* Top gradient overlay - subtle fade */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/6"
            style={{
              background: "linear-gradient(to bottom, #F5EDE6 0%, transparent 100%)",
            }}
          />
          {/* Bottom gradient overlay */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/6"
            style={{
              background: "linear-gradient(to top, #F5EDE6 0%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-20 mx-auto max-w-6xl px-4">
          <div className="min-h-[380px] py-12 lg:py-16">
            {/* Text Content */}
            <div className="max-w-xl">
              <h1
                className={`${serif.className} mb-4 text-[2.5rem] font-normal leading-[1.15] tracking-tight`}
                style={{ color: "#2D5A5A" }}
              >
                Empowering Community
                <br />
                Health Workers Across Texas
              </h1>
              <p className="mb-6 text-[15px] leading-relaxed" style={{ color: "#5A6A6A" }}>
                CHW360 provides training, resources, and support to help
                <br className="hidden lg:inline" />
                {" "}Community Health Workers learn, grow, and make a difference
                <br className="hidden lg:inline" />
                {" "}in their communities.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="rounded-full px-5 py-2 text-sm font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: "#C9725B", color: "white" }}
                >
                  Request a Demo
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border bg-transparent px-5 py-2 text-sm font-medium transition-all hover:bg-white/20"
                  style={{ borderColor: "#5A6A6A", color: "#5A6A6A" }}
                >
                  Join Updates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Supports Section */}
      <section
        id="core-supports"
        className="px-4 py-16"
        style={{ backgroundColor: "#FAF7F4" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h2
              className={`${serif.className} mb-3 text-3xl font-normal`}
              style={{ color: "#2D5A5A" }}
            >
              Core Supports for CHWs
            </h2>
            <p className="text-base" style={{ color: "#4A5568" }}>
              Equipping CHWs with skills and tools they need to serve Texas communities.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreSupports.map((support, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                style={{ border: "1px solid #E8E4E0" }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <CoreSupportIcon type={support.icon} />
                  <h3
                    className="text-lg font-semibold leading-tight"
                    style={{ color: "#2D5A5A" }}
                  >
                    {support.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                  {support.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For + Get in Touch Section */}
      <section id="contact" className="px-4 py-16" style={{ backgroundColor: "#F5EDE6" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Who It's For */}
            <div>
              <h2
                className={`${serif.className} mb-4 text-3xl font-normal`}
                style={{ color: "#2D5A5A" }}
              >
                Who It&apos;s For
              </h2>
              <p className="mb-8 text-base leading-relaxed" style={{ color: "#4A5568" }}>
                CHW360 delivers practical, standards-aligned training that
                respects the CHW scope of practice and meets Texas state
                requirements.
              </p>

              <div
                className="grid grid-cols-3 gap-4 rounded-xl p-5"
                style={{ backgroundColor: "#FAFAFA" }}
              >
                {audiences.map((audience, index) => (
                  <div key={index} className="flex flex-col text-center">
                    <div className="flex h-20 items-center justify-center">
                      <AudienceIcon type={audience.icon} />
                    </div>
                    <h3
                      className="mb-2 min-h-[40px] whitespace-pre-line text-sm font-semibold"
                      style={{ color: "#2D5A5A" }}
                    >
                      {audience.title}
                    </h3>
                    <p className="min-h-[48px] text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                      {audience.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Contact Form */}
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: "#EDE4DA" }}
            >
              <h2
                className={`${serif.className} mb-4 text-3xl font-normal`}
                style={{ color: "#2D5A5A" }}
              >
                Get in Touch
              </h2>
              <p className="mb-6 text-base" style={{ color: "#4A5568" }}>
                Ready to learn more? Reach out to see how
                CHW360 can support Community Health
                Workers in your organization.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input
                  placeholder="Name"
                  className="h-11 rounded-md border border-gray-100"
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  className="h-11 rounded-md border border-gray-100"
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <Input
                  placeholder="Organization"
                  className="h-11 rounded-md border border-gray-100"
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <Textarea
                  placeholder="Message"
                  className="min-h-[100px] rounded-md border border-gray-100"
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <Button
                  type="submit"
                  className="rounded-full px-8 py-2.5 text-sm font-medium shadow-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "#C9725B", color: "white" }}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#2D5A5A" }}>
        <div className="mx-auto max-w-6xl px-4 py-10">
          {/* Top row: Logo, Nav, Social */}
          <div className="flex flex-col items-center justify-between gap-6 border-b border-white/20 pb-8 md:flex-row">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/chw/logo.png"
                alt="CHW360"
                width={32}
                height={32}
                className="h-8 w-8 brightness-0 invert"
              />
              <span className="text-xl tracking-tight text-white">
                <span className="font-semibold">CHW</span><span className="font-light text-white/80">360</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {["Platform", "Core Supports", "Compliance", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[Facebook, Linkedin, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap justify-center gap-6 py-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              info@chw360.org
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              (22) 123-4567
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              info@mw360.org
            </span>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-white/50">
            © CHW360 | Educational Use Only. | Not Medical Advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
