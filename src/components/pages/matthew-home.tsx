"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Mail,
  MapPin,
  Sparkles,
  Zap,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Quote,
  X,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { api } from "~/trpc/react";

interface MatthewHomePageProps {
  isDevPreview?: boolean;
  domainParam?: string;
}

export function MatthewHomePage({
  isDevPreview = false,
  domainParam = "",
}: MatthewHomePageProps = {}) {
  // Mobile testimonial slider state
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  // Expanded testimonial modal state
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null);
  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const contactMutation = api.contact.submitPersonal.useMutation({
    onSuccess: () => {
      setContactSubmitted(true);
      setContactForm({ name: "", email: "", phone: "", message: "" });
    },
  });

  // Helper to extract readable error message from tRPC/Zod errors
  const getErrorMessage = (error: { message: string } | null) => {
    if (!error) return null;
    try {
      const parsed = JSON.parse(error.message);
      if (Array.isArray(parsed) && parsed[0]?.message) {
        return parsed[0].message as string;
      }
    } catch {
      // Not JSON, return as-is
    }
    return error.message;
  };

  // Hostname for environment-aware links
  const [hostname, setHostname] = useState("");
  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  // Helper for cross-domain Miracle Mind links
  const getMiracleMindUrl = () => {
    if (hostname.includes("localhost")) {
      return "/?domain=dev";
    }
    return "https://miraclemind.dev";
  };

  // Use admin routes if in dev preview, otherwise use public routes
  const playgroundUrl = isDevPreview
    ? `/admin/playground${domainParam}`
    : "/playground";
  const shadersUrl = isDevPreview ? `/admin/shaders${domainParam}` : "/shaders";

  // Testimonials data
  const testimonials = [
    {
      name: "Austin Terry",
      role: "Director of Ops & Account Manager, The Limitless Agency",
      image: "/testimonials/AustinPhoto.jpeg",
      content: "Matt is one of the most brilliant and kind-hearted individuals I've ever had the pleasure of knowing. He is a true polymath—a powerhouse with prodigious musical talent, an engineer and coder's mind, a steadfast creator's mentality, and the precision and care of a genuine artist. Above all, he carries an unshakable commitment to love, truth, and integrity in everything he does.\n\nHe has an insatiable curiosity for mastering new disciplines and weaving them into his work, while remaining grounded, peaceful, and deeply present in his way of being. Matt has a rare ability to change lives for the better, doing so with ease, clarity, and grace. Whatever he builds or brings into the world, you can expect nothing short of excellence.\n\nMost importantly, he truly cares—about his community, about people, and about humanity at large. He consistently goes above and beyond to serve others, leaving those around him feeling inspired, uplifted, and genuinely seen.\n\nThe world is a better place with Matt in it, and I'm deeply grateful to witness his genius unfold like a beautiful flower for all to behold.",
      excerpt: "Matt is one of the most brilliant and kind-hearted individuals I've ever had the pleasure of knowing. He is a true polymath—a powerhouse with prodigious musical talent..."
    },
    {
      name: "Callan McGuire",
      role: "Co-founder, Papyra",
      image: "/testimonials/CalPhoto.jpeg",
      content: "It's rare to meet someone who so clearly articulates the power of being a generalist, but Matt does exactly that. In a world that pushes overspecialization, he reframed it in a way that immediately clicked for me.\n\nWhen you have a foot in multiple worlds, you gain a holistic perspective. You can connect ideas across disciplines—where deep understanding of a problem meets the skills required to solve it. That's where real innovation happens, and that's where Matt thrives.\n\nMatt's ideas feel genuinely original, which is incredibly rare. If you're considering working with him, give him a shot—you won't regret it.",
      excerpt: "It's rare to meet someone who so clearly articulates the power of being a generalist, but Matt does exactly that. In a world that pushes overspecialization..."
    },
    {
      name: "Anna Madewell",
      role: "Festival Director, EmpowHER ATX",
      image: "/testimonials/AnnaPhoto.jpg",
      content: "Matt has supported me on my music journey in such a profound way. He truly helped me discover my sound—which is a big thing to say, but I mean it deeply. The worlds we create together feel incredibly aligned and intentional.\n\nHe is an exceptional listener and collaborates beautifully with other artists. Working with him in the studio, I immediately felt comfortable, supported, and creatively free. Matt has a rare talent for translating creation—music, emotion, and something truly divine—into sound.\n\nHe strikes a beautiful balance: gentle, open, and welcoming, while also being focused and effective at bringing ideas to life. I have immense appreciation for Matt and his artistry. He is truly a great artist.",
      excerpt: "Matt has supported me on my music journey in such a profound way. He truly helped me discover my sound—which is a big thing to say..."
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Set page title
  useEffect(() => {
    document.title = "Matthew Miceli";
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (expandedTestimonial !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expandedTestimonial]);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Neural Net Shader Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <iframe
          src="/shaders/neural-net/embed"
          className="h-full w-full border-0 opacity-15"
          title="Neural Network Background"
          loading="lazy"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Gradient fade overlay - scrolls with page */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-transparent via-transparent via-30% to-black to-70% pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Hero Section */}
          <section className="mb-12 sm:mb-16">
            <div className="flex items-start justify-between gap-4 sm:gap-6 md:gap-8">
              <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-6">
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                    Hi, I&apos;m Matthew Miceli
                  </h1>
                </div>
                <div className="animate-fade-in-delay-1 max-w-2xl">
                  <p className="text-sm text-gray-100 drop-shadow-md sm:text-base md:text-lg lg:text-xl">
                    Digital Architect & Integrations Specialist. Integrating disciplines to design
                    systems that honor what makes us human.
                    <br />
                    Founder of{" "}
                    <Link
                      href={getMiracleMindUrl()}
                      className="hover:underline"
                      style={{
                        background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      <span style={{ fontWeight: 300 }}>MIRACLE</span>{" "}
                      <span style={{ fontWeight: 700 }}>MIND</span>
                    </Link>.
                  </p>
                </div>
                <div className="animate-fade-in-delay-2 flex flex-col gap-2 text-xs text-gray-200 sm:flex-row sm:gap-4 sm:text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Austin, TX</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    <a href="mailto:matthewmiceli@miraclemind.live" className="hover:underline" style={{ color: '#D4AF37' }}>
                      matthewmiceli@miraclemind.live
                    </a>
                  </div>
                </div>
              </div>
              <div className="animate-fade-in-delay-2 flex-shrink-0">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 shadow-2xl sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-42 lg:w-42" style={{ borderColor: '#D4AF37', boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.25)' }}>
                  <Image
                    src="/images/profile.jpg"
                    alt="Matthew Miceli"
                    width={336}
                    height={336}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative -mx-4 mb-12 sm:-mx-6 sm:mb-16">
            <div className="h-px w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
          </div>

          {/* About Section */}
          <section className="mb-12 sm:mb-16">
            <div className="animate-fade-in-delay-3">
              <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-md sm:text-3xl md:text-4xl">
                About
              </h2>
              <div className="max-w-none space-y-4">
                <p className="text-gray-100 drop-shadow-sm">
                  I&apos;m a systems architect who bridges worlds—transforming vision into reality through the integration of diverse disciplines. My path has taken me through robotics research, satellite testing, software development, high-ticket sales, and music production.
                </p>
                <p className="text-gray-100 drop-shadow-sm">
                  This breadth has shaped my approach: I thrive in the spaces between fields, connecting engineering with business, technology with creativity, individual insight with collective impact. I illuminate unseen patterns and design systems that honor each part within the greater whole.
                </p>
                <p className="text-gray-100 drop-shadow-sm">
                  Today, I apply this integrative thinking alongside deep technical expertise in AI-driven development, creating full-stack applications and enterprise solutions that strengthen human connection and honor our humanity.
                </p>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative -mx-4 mb-12 sm:-mx-6 sm:mb-16">
            <div className="h-px w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
          </div>

          {/* Featured Writing Section */}
          <section className="mb-12 sm:mb-16">
            <div className="animate-fade-in-delay-3-5">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-bold text-white drop-shadow-md sm:text-3xl md:text-4xl">
                  Featured Writing
                </h2>
                <Link
                  href="/blog"
                  className="text-sm font-semibold transition-colors hover:underline"
                  style={{ color: '#D4AF37' }}
                >
                  View All Posts →
                </Link>
              </div>
              <Link href="/blog/honoring-our-humanity">
                <Card className="group cursor-pointer backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl" style={{
                  borderColor: 'rgba(212, 175, 55, 0.4)',
                  borderWidth: '1px',
                  background: 'linear-gradient(135deg, rgba(246, 230, 193, 0.08) 0%, rgba(107, 29, 54, 0.08) 100%)'
                }}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)', boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.3)' }}>
                        <BookOpen className="h-6 w-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs text-gray-400">January 6, 2026</span>
                          <span className="text-xs" style={{ color: '#D4AF37' }}>•</span>
                          <span className="text-xs" style={{ color: '#D4AF37' }}>5 min read</span>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white group-hover:underline sm:text-2xl">
                          Honoring Our Humanity: Technology as Guardian, Not Replacement
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-gray-200 sm:text-base">
                          In an age where AI can outperform us in countless tasks, we must ask: what does it mean to be human? And how do we build technology that strengthens—rather than erodes—the connections that make us whole?
                        </p>
                        <div className="flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3" style={{ color: '#D4AF37' }}>
                          <span>Read full article</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative -mx-4 mb-12 sm:-mx-6 sm:mb-16">
            <div className="h-px w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
          </div>

          {/* Testimonials Section */}
          <section className="mb-12 sm:mb-16">
            <div className="animate-fade-in-delay-4">
              <h2 className="mb-6 text-center text-2xl font-bold text-white drop-shadow-md sm:mb-8 sm:text-3xl md:text-4xl">
                Kind Words
              </h2>

              {/* Desktop: Grid Layout - Hidden on Mobile */}
              <div className="hidden gap-4 md:grid md:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={testimonial.name}
                    className="group cursor-pointer backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      borderWidth: '1px',
                      background: 'linear-gradient(135deg, rgba(246, 230, 193, 0.12) 0%, rgba(107, 29, 54, 0.12) 100%)',
                      animationDelay: `${0.4 + index * 0.1}s`
                    }}
                    onClick={() => setExpandedTestimonial(index)}
                  >
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: '#D4AF37' }}>
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{testimonial.name}</p>
                          <p className="text-xs leading-tight" style={{ color: '#D4AF37' }}>{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-200 line-clamp-3">
                        {testimonial.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: '#D4AF37' }}>
                        <span>Read more</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mobile: Slider - Hidden on Desktop */}
              <div className="md:hidden">
                <div className="relative">
                  <Card
                    className="cursor-pointer backdrop-blur-md"
                    style={{
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      borderWidth: '1px',
                      background: 'linear-gradient(135deg, rgba(246, 230, 193, 0.12) 0%, rgba(107, 29, 54, 0.12) 100%)'
                    }}
                    onClick={() => setExpandedTestimonial(activeTestimonial)}
                  >
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: '#D4AF37' }}>
                          <Image
                            src={testimonials[activeTestimonial]?.image || ''}
                            alt={testimonials[activeTestimonial]?.name || ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white">{testimonials[activeTestimonial]?.name}</p>
                          <p className="text-xs leading-tight" style={{ color: '#D4AF37' }}>{testimonials[activeTestimonial]?.role}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-200 line-clamp-3">
                        {testimonials[activeTestimonial]?.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color: '#D4AF37' }}>
                        <span>Read more</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Navigation Buttons */}
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                      onClick={prevTestimonial}
                      className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110"
                      style={{
                        background: 'rgba(212, 175, 55, 0.2)',
                        borderColor: 'rgba(212, 175, 55, 0.3)',
                        borderWidth: '1px'
                      }}
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-6 w-6" style={{ color: '#D4AF37' }} />
                    </button>

                    {/* Indicator Dots */}
                    <div className="flex gap-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTestimonial(index)}
                          className="h-2 w-2 rounded-full transition-all duration-200"
                          style={{
                            background: index === activeTestimonial ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)',
                            transform: index === activeTestimonial ? 'scale(1.5)' : 'scale(1)'
                          }}
                          aria-label={`Go to testimonial ${index + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextTestimonial}
                      className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110"
                      style={{
                        background: 'rgba(212, 175, 55, 0.2)',
                        borderColor: 'rgba(212, 175, 55, 0.3)',
                        borderWidth: '1px'
                      }}
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-6 w-6" style={{ color: '#D4AF37' }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Testimonial Modal */}
              {expandedTestimonial !== null && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ background: 'rgba(0, 0, 0, 0.85)' }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setExpandedTestimonial(null);
                    }
                  }}
                >
                  <Card
                    className="relative max-w-2xl w-full max-h-[80vh] flex flex-col backdrop-blur-md"
                    style={{
                      borderColor: 'rgba(212, 175, 55, 0.4)',
                      borderWidth: '1px',
                      background: 'linear-gradient(135deg, rgba(246, 230, 193, 0.35) 0%, rgba(107, 29, 54, 0.35) 100%)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setExpandedTestimonial(null)}
                      className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110"
                      style={{
                        background: 'rgba(212, 175, 55, 0.2)',
                        borderColor: 'rgba(212, 175, 55, 0.3)',
                        borderWidth: '1px'
                      }}
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" style={{ color: '#D4AF37' }} />
                    </button>

                    <div className="overflow-y-auto p-6 sm:p-8">
                      {testimonials[expandedTestimonial] && (
                        <>
                          <div className="mb-6 flex items-center gap-4 pr-10">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: '#D4AF37' }}>
                              <Image
                                src={testimonials[expandedTestimonial].image}
                                alt={testimonials[expandedTestimonial].name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-white">{testimonials[expandedTestimonial].name}</p>
                              <p className="text-sm" style={{ color: '#D4AF37' }}>{testimonials[expandedTestimonial].role}</p>
                            </div>
                          </div>

                          <Quote className="mb-4 h-10 w-10 opacity-30" style={{ color: '#D4AF37' }} />

                          <p className="leading-relaxed text-gray-100 whitespace-pre-line">
                            {testimonials[expandedTestimonial].content}
                          </p>
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative -mx-4 mb-12 sm:-mx-6 sm:mb-16">
            <div className="h-px w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
          </div>

          {/* Miracle Mind Section */}
          <section className="mb-12 sm:mb-16">
            <div className="animate-fade-in-delay-5">
              <Card className="backdrop-blur-md transition-all duration-300" style={{
                borderColor: 'rgba(212, 175, 55, 0.4)',
                borderWidth: '1px',
                background: 'linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(107, 29, 54, 0.1) 100%)'
              }}>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-6">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src="/brand/miracle-mind-orbit-star-v3.svg"
                        alt="Miracle Mind Orbit Star"
                        fill
                        className="object-contain drop-shadow-lg"
                        style={{ filter: 'drop-shadow(0 10px 25px rgba(212, 175, 55, 0.3))' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h2
                        className="mb-3 text-2xl drop-shadow-md sm:text-3xl md:text-4xl"
                        style={{
                          background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        <span style={{ fontWeight: 300 }}>MIRACLE</span>{" "}
                        <span style={{ fontWeight: 700 }}>MIND</span>
                      </h2>
                      <p className="mb-4 text-base text-gray-100 drop-shadow-sm sm:text-lg">
                        In 2025, I founded Miracle Mind with a clear mission: develop technology that empowers human sovereignty
                        and genuine connection.
                      </p>
                      <p className="mb-4 text-gray-200 drop-shadow-sm">
                        In a climate where AI&apos;s trajectory remains uncertain, our mission is to serve as both steward and
                        safeguard—nurturing the technologies that enhance our humanity while building protections against those
                        that diminish it.
                      </p>
                      <p className="mb-6 text-gray-200 drop-shadow-sm">
                        Our flagship product, <span className="font-semibold" style={{ color: '#D4AF37' }}>BANYAN</span>, is an AI-assisted
                        Life Operating System that integrates habits, projects, finances, and wellbeing as interdependent
                        elements.
                      </p>
                      <Link href={getMiracleMindUrl()}>
                        <Button
                          size="lg"
                          className="group shadow-lg"
                          style={{
                            background: 'linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)',
                            boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.3)',
                            color: '#000000'
                          }}
                        >
                          <span className="mr-2">Explore Miracle Mind</span>
                          <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative -mx-4 mb-12 sm:-mx-6 sm:mb-16">
            <div className="h-px w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
          </div>

          {/* Current Focus Section */}
          <section className="mb-12 sm:mb-16">
            <div className="animate-fade-in-delay-6">
              <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-md sm:text-3xl md:text-4xl">
                Current Focus
              </h2>
              <div className="max-w-none space-y-4">
                <p className="text-gray-100 drop-shadow-sm">
                  Building full-stack web applications, SaaS platforms, and enterprise-level solutions with
                  AI-driven development. My current tech stack:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Next.js",
                    "React",
                    "TypeScript",
                    "tRPC",
                    "Node.js",
                    "PostgreSQL",
                    "Drizzle ORM",
                    "Supabase",
                    "Tailwind CSS",
                    "Python",
                    "AI Workflows",
                    "Notion",
                    "Zapier",
                  ].map((tech) => (
                    <Badge
                      key={tech}
                      className="backdrop-blur-sm"
                      style={{
                        borderColor: 'rgba(212, 175, 55, 0.3)',
                        backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        color: '#F6E6C1'
                      }}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative -mx-4 mb-12 sm:-mx-6 sm:mb-16">
            <div className="h-px w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
          </div>

          {/* Quick Links Section */}
          <section className="mb-12 sm:mb-16">
            <div className="animate-fade-in-delay-7">
              <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-md sm:mb-6 sm:text-3xl md:text-4xl">
                Creative Exploration
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href={playgroundUrl}>
                  <Card className="group cursor-pointer bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-xl" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', borderWidth: '1px' }}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)', boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.3)' }}>
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            UI Playground
                          </h3>
                          <p className="text-sm text-gray-200">
                            Interactive animation effects
                          </p>
                        </div>
                        <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1" style={{ color: 'rgba(212, 175, 55, 0.7)' }} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href={shadersUrl}>
                  <Card className="group cursor-pointer bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-xl" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', borderWidth: '1px' }}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)', boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.3)' }}>
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            Animation Showcase
                          </h3>
                          <p className="text-sm text-gray-200">
                            GLSL shader gallery
                          </p>
                        </div>
                        <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1" style={{ color: 'rgba(212, 175, 55, 0.7)' }} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative -mx-4 mb-12 sm:-mx-6 sm:mb-16">
            <div className="h-px w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
          </div>

          {/* Education Section */}
          <section className="mb-12 sm:mb-16">
            <div className="animate-fade-in-delay-8">
              <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-md sm:mb-6 sm:text-3xl md:text-4xl">
                Education
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-white font-bold text-lg" style={{
                        background: 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)'
                      }}>
                        BU
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white">
                          MS in Robotics and Autonomous Systems
                        </h3>
                        <p style={{ color: '#D4AF37' }}>Boston University</p>
                        <p className="mt-1 text-sm text-gray-300">
                          2019 - 2022
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-white font-bold text-lg" style={{
                        background: 'linear-gradient(135deg, #461D7C 0%, #FDD023 100%)'
                      }}>
                        LSU
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white">
                          BSE in Mechanical Engineering
                        </h3>
                        <p style={{ color: '#D4AF37' }}>Louisiana State University</p>
                        <p className="mt-1 text-sm text-gray-300">
                          2016 - 2020
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-white font-bold text-lg" style={{
                        background: 'linear-gradient(135deg, #461D7C 0%, #FDD023 100%)'
                      }}>
                        LSU
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white">
                          BSE in Computer Science
                        </h3>
                        <p style={{ color: '#D4AF37' }}>Louisiana State University</p>
                        <p className="mt-1 text-sm text-gray-300">
                          2016 - 2020
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative -mx-4 mb-12 sm:-mx-6 sm:mb-16">
            <div className="h-px w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
          </div>

          {/* Contact Section */}
          <section id="contact" className="mb-12 sm:mb-16 scroll-mt-24">
            <div className="animate-fade-in-delay-9">
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
                Get in Touch
              </h2>
              <p className="mb-6 max-w-2xl text-base text-gray-100 drop-shadow-md sm:mb-8 sm:text-lg">
                Interested in collaborating or have a project in mind? I&apos;d
                love to hear from you.
              </p>

              {contactSubmitted ? (
                <Card
                  className="bg-white/5 backdrop-blur-md"
                  style={{ borderColor: "rgba(212, 175, 55, 0.3)", borderWidth: "1px" }}
                >
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="mx-auto mb-4 h-12 w-12" style={{ color: "#D4AF37" }} />
                    <h3 className="mb-2 text-2xl font-bold text-white">Message Sent</h3>
                    <p className="mb-6 text-gray-300">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setContactSubmitted(false)}
                      className="border-2 bg-white/5"
                      style={{ borderColor: "rgba(212, 175, 55, 0.5)", color: "#D4AF37" }}
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  className="bg-white/5 backdrop-blur-md"
                  style={{ borderColor: "rgba(212, 175, 55, 0.3)", borderWidth: "1px" }}
                >
                  <CardContent className="p-6 sm:p-8">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        contactMutation.mutate(contactForm);
                      }}
                      className="space-y-5"
                    >
                      <div>
                        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-gray-300">
                          Name <span style={{ color: "#D4AF37" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="contact-name"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-gray-300">
                          Email <span style={{ color: "#D4AF37" }}>*</span>
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-gray-300">
                          Phone <span className="text-gray-500">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="contact-phone"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-gray-300">
                          Message <span style={{ color: "#D4AF37" }}>*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                          placeholder="Tell me about your project or question..."
                        />
                      </div>

                      {contactMutation.error && (
                        <p className="text-sm text-red-400">
                          {getErrorMessage(contactMutation.error)}
                        </p>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        disabled={contactMutation.isPending}
                        className="w-full px-8 text-black shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)" }}
                      >
                        {contactMutation.isPending ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 0.6s ease-out 0.1s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.3s both;
        }

        .animate-fade-in-delay-4 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }

        .animate-fade-in-delay-5 {
          animation: fade-in 0.6s ease-out 0.5s both;
        }

        .animate-fade-in-delay-6 {
          animation: fade-in 0.6s ease-out 0.6s both;
        }

        .animate-fade-in-delay-7 {
          animation: fade-in 0.6s ease-out 0.7s both;
        }

        .animate-fade-in-delay-8 {
          animation: fade-in 0.6s ease-out 0.8s both;
        }

        .animate-fade-in-delay-9 {
          animation: fade-in 0.6s ease-out 0.9s both;
        }
      `}</style>
    </div>
  );
}
