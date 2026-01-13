"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Code,
  Users,
  Target,
  Heart,
  Leaf,
  Boxes,
  Mail,
  Zap,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";

export function MiracleMindLiveHomePage() {
  // Update page title for Miracle Mind
  useEffect(() => {
    document.title = "Miracle Mind";

    // Cleanup: restore default on unmount
    return () => {
      document.title = "Miracle Mind";
    };
  }, []);

  // Responsive carousel spacing
  const [carouselSpacing, setCarouselSpacing] = useState({
    translateX: 380,
    marginLeft: -320
  });

  useEffect(() => {
    const updateSpacing = () => {
      const isMobile = window.innerWidth < 640;
      setCarouselSpacing({
        translateX: isMobile ? 290 : 380,
        marginLeft: isMobile ? -260 : -320
      });
    };

    updateSpacing();
    window.addEventListener('resize', updateSpacing);

    return () => window.removeEventListener('resize', updateSpacing);
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Contribution",
      description: "Technology in service of humanity. We build systems that amplify human potential, deepen connection, and honor what makes us most alive.",
    },
    {
      icon: Target,
      title: "Sovereignty",
      description: "Empowering individuals and organizations to operate from their own authority—making technology that serves human agency, not replaces it.",
    },
    {
      icon: Leaf,
      title: "Cultivation",
      description: "Playing the long game. We build infrastructure that compounds—where patient, intentional development creates sustainable momentum and lasting transformation.",
    },
    {
      icon: Boxes,
      title: "Integration",
      description: "Holistic systems thinking meets AI innovation. We synthesize diverse disciplines into coherent systems that work as integrated wholes, not fragmented parts.",
    },
    {
      icon: Sparkles,
      title: "Coherence",
      description: "Where AI-driven development meets human-centered design. Bridging technical excellence with deep understanding of how people actually want to live and work.",
    },
  ];

  const [currentValueIndex, setCurrentValueIndex] = useState(values.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  // Create infinite loop by duplicating cards
  const extendedValues = [...values, ...values, ...values];
  const offset = values.length; // Start at middle set

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentValueIndex((prev) => prev + 1);
    }, 7000);

    return () => clearInterval(interval);
  }, [autoRotate]);

  const nextValue = () => {
    setAutoRotate(false); // Disable auto-rotation when user clicks
    setIsTransitioning(true);
    setCurrentValueIndex((prev) => prev + 1);
  };

  const prevValue = () => {
    setAutoRotate(false); // Disable auto-rotation when user clicks
    setIsTransitioning(true);
    setCurrentValueIndex((prev) => prev - 1);
  };

  // Handle infinite loop reset
  useEffect(() => {
    if (currentValueIndex >= values.length + offset) {
      // Let transition complete, then instantly reset to middle
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentValueIndex(offset);
        // Re-enable transitions after reset
        setTimeout(() => setIsTransitioning(true), 50);
      }, 700);
      return () => clearTimeout(timer);
    } else if (currentValueIndex < offset) {
      // Let transition complete, then instantly reset to middle
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentValueIndex(offset + values.length - 1);
        // Re-enable transitions after reset
        setTimeout(() => setIsTransitioning(true), 50);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentValueIndex, values.length, offset]);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Neural Net Shader Background */}
      <div className="fixed inset-0 z-0">
        <iframe
          src="/shaders/neural-net/embed"
          className="h-full w-full border-0"
          style={{ pointerEvents: "none" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black"
          style={{ pointerEvents: "none" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {/* Hero Section */}
          <section className="mb-16 text-center sm:mb-24">
            <div className="mb-6 inline-flex items-center justify-center sm:mb-8">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                <Image
                  src="/brand/miracle-mind-orbit-star-v3.svg"
                  alt="Miracle Mind Orbit Star"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>

            <h1
              className="mb-4 px-4 text-4xl font-bold text-white sm:mb-6 sm:text-6xl md:text-7xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Building Technology
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Empowering Human Sovereignty
              </span>
            </h1>

            <p
              className="mx-auto mb-8 max-w-3xl px-4 text-base text-gray-200 sm:mb-12 sm:text-xl"
              style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 300 }}
            >
              From AI integrations to complete software platforms—empowering human sovereignty, deepening connection, and honoring what makes us most human
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#contact">
                <Button
                  size="lg"
                  className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                >
                  Work With Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>

              <a href="#banyan">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 bg-white/5 px-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                  style={{
                    borderColor: "rgba(212, 175, 55, 0.5)",
                    color: "#D4AF37",
                  }}
                >
                  Explore BANYAN
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </section>

          {/* Divider */}
          <div className="mb-16 w-full border-t sm:mb-24" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }} />

          {/* Mission Section */}
          <section id="mission" className="mb-16 scroll-mt-20 sm:mb-24">
            <div className="text-center">
              <h2
                className="mb-4 text-3xl font-bold text-white sm:mb-6 sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: "var(--font-quattrocento-sans)",
                  letterSpacing: "0.02em",
                }}
              >
                Our Mission
              </h2>

              <p
                className="mx-auto max-w-4xl px-4 text-base leading-relaxed text-gray-200 sm:text-lg"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Technology in service of humanity and human connection. We specialize
                in <span style={{ color: "#D4AF37", fontWeight: 600 }}>AI-driven development</span> that shortens time to market and
                enables <span style={{ color: "#D4AF37", fontWeight: 600 }}>real-time solutions emergent from customer needs</span>. We develop AI-powered
                software in-house and build custom solutions for companies, founders, and
                businesses—whether building new systems from scratch or integrating AI into
                robust existing systems so companies can keep up.
              </p>
            </div>
          </section>

          {/* Who We Serve Section */}
          <section id="services" className="mb-16 scroll-mt-20 sm:mb-24">
            <h2
              className="mb-8 text-center text-3xl font-bold text-white sm:mb-12 sm:text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Who We Serve
            </h2>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card
                className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:hover:scale-105"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-3 inline-flex items-center justify-center rounded-lg p-2.5 sm:mb-4 sm:p-3" style={{
                    background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}>
                    <Target className="h-7 w-7 text-black sm:h-8 sm:w-8" />
                  </div>
                  <h3
                    className="mb-2 text-xl font-semibold text-white sm:mb-3 sm:text-2xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Founders & Entrepreneurs
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    Turning vision into reality. We build the systems that bring your ideas to life—from rapid prototypes to production platforms that scale with your growth
                  </p>
                </CardContent>
              </Card>

              <Card
                className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:hover:scale-105"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-3 inline-flex items-center justify-center rounded-lg p-2.5 sm:mb-4 sm:p-3" style={{
                    background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}>
                    <Code className="h-7 w-7 text-black sm:h-8 sm:w-8" />
                  </div>
                  <h3
                    className="mb-2 text-xl font-semibold text-white sm:mb-3 sm:text-2xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Technologists & Developers
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    Partnering with technical teams to weave AI into existing infrastructure, modernize legacy systems, and build next-generation applications without disrupting what already works
                  </p>
                </CardContent>
              </Card>

              <Card
                className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:hover:scale-105"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-3 inline-flex items-center justify-center rounded-lg p-2.5 sm:mb-4 sm:p-3" style={{
                    background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}>
                    <Sparkles className="h-7 w-7 text-black sm:h-8 sm:w-8" />
                  </div>
                  <h3
                    className="mb-2 text-xl font-semibold text-white sm:mb-3 sm:text-2xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Creators & Innovators
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    Empowering makers, artists, and visionaries with technology that amplifies their impact—from automating the mundane to building platforms that scale their unique gifts
                  </p>
                </CardContent>
              </Card>

              <Card
                className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:hover:scale-105"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-3 inline-flex items-center justify-center rounded-lg p-2.5 sm:mb-4 sm:p-3" style={{
                    background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}>
                    <Building2 className="h-7 w-7 text-black sm:h-8 sm:w-8" />
                  </div>
                  <h3
                    className="mb-2 text-xl font-semibold text-white sm:mb-3 sm:text-2xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Leaders & Organizations
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    Helping established teams modernize legacy systems, integrate AI capabilities, and build infrastructure that serves your mission for the long term
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* What We Offer Section */}
          <section className="mb-16 sm:mb-24">
            <h2
              className="mb-8 text-center text-3xl font-bold text-white sm:mb-12 sm:text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              What We Offer
            </h2>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              <Card
                className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:hover:scale-105"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-3 sm:mb-4">
                    <Zap className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: "#D4AF37" }} />
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold text-white sm:mb-3 sm:text-xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    AI-Driven Development
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    Rapid prototyping to production. We build 10x faster, bringing ideas to
                    market in weeks instead of months
                  </p>
                </CardContent>
              </Card>

              <Card
                className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:hover:scale-105"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-3 sm:mb-4">
                    <Boxes className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: "#D4AF37" }} />
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold text-white sm:mb-3 sm:text-xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Custom Software Solutions
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    From greenfield projects to AI integration in existing systems—we build
                    what you need, aligned with how you want to work
                  </p>
                </CardContent>
              </Card>

              <Card
                className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:hover:scale-105"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-3 sm:mb-4">
                    <Code className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: "#D4AF37" }} />
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold text-white sm:mb-3 sm:text-xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Integration & Modernization
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    Helping established companies stay competitive by weaving AI
                    capabilities into their existing infrastructure
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Values Section - 3D Carousel */}
          <section id="values" className="mb-16 scroll-mt-20 sm:mb-24">
            <h2
              className="mb-8 text-center text-3xl font-bold text-white sm:mb-12 sm:text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Our Values
            </h2>

            <div className="relative mx-auto h-[450px] overflow-hidden sm:h-[550px]">
              {/* 3D Carousel Container */}
              <div
                className="relative flex h-full items-center justify-center"
                style={{
                  perspective: "1500px",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {extendedValues.map((value, index) => {
                    const Icon = value.icon;
                    const cardOffset = index - currentValueIndex;
                    const absOffset = Math.abs(cardOffset);

                    // Calculate transforms for 3D effect
                    const rotateY = cardOffset * 40;
                    const translateZ = absOffset === 0 ? 0 : -250;
                    const scale = absOffset === 0 ? 1 : 0.8;
                    const opacity = absOffset <= 1 ? (absOffset === 0 ? 1 : 0.6) : 0;

                    return (
                      <div
                        key={`${value.title}-${index}`}
                        className="flex-shrink-0"
                        style={{
                          transform: `translateX(${cardOffset * carouselSpacing.translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                          opacity,
                          transformStyle: "preserve-3d",
                          marginLeft: index === 0 ? "0" : `${carouselSpacing.marginLeft}px`,
                          transition: isTransitioning ? "all 700ms ease-in-out" : "none",
                        }}
                      >
                        <Card
                          className="h-[400px] w-[260px] overflow-hidden bg-black/80 backdrop-blur-md sm:h-[480px] sm:w-[320px]"
                          style={{
                            borderColor: absOffset === 0 ? "rgba(212, 175, 55, 0.6)" : "rgba(212, 175, 55, 0.25)",
                            borderWidth: absOffset === 0 ? "2px" : "1px",
                            backfaceVisibility: "hidden",
                          }}
                        >
                          <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center sm:p-10">
                            <h3
                              className="mb-6 text-3xl font-bold sm:mb-8 sm:text-5xl"
                              style={{
                                fontFamily: "var(--font-quattrocento-sans)",
                                letterSpacing: "0.02em",
                                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                              }}
                            >
                              {value.title}
                            </h3>
                            <p
                              className="text-sm leading-relaxed text-gray-300 sm:text-lg"
                              style={{ fontFamily: "var(--font-geist-sans)" }}
                            >
                              {value.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="absolute top-1/2 left-4 right-4 z-20 flex -translate-y-1/2 justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevValue}
                  className="h-12 w-12 rounded-full border-2 bg-black/70 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80"
                  style={{ borderColor: "rgba(212, 175, 55, 0.5)" }}
                >
                  <ChevronLeft className="h-6 w-6" style={{ color: "#D4AF37" }} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextValue}
                  className="h-12 w-12 rounded-full border-2 bg-black/70 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80"
                  style={{ borderColor: "rgba(212, 175, 55, 0.5)" }}
                >
                  <ChevronRight className="h-6 w-6" style={{ color: "#D4AF37" }} />
                </Button>
              </div>

            </div>

            {/* Indicator Dots */}
            <div className="mt-8 flex justify-center gap-3">
              {values.map((_, index) => {
                const actualIndex = currentValueIndex % values.length;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setAutoRotate(false); // Disable auto-rotation when user clicks
                      setIsTransitioning(true);
                      setCurrentValueIndex(offset + index);
                    }}
                    className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        index === actualIndex
                          ? "#D4AF37"
                          : "rgba(212, 175, 55, 0.3)",
                      transform: index === actualIndex ? "scale(1.3)" : "scale(1)",
                    }}
                    aria-label={`Go to value ${index + 1}`}
                  />
                );
              })}
            </div>
          </section>

          {/* Banyan Highlight Section */}
          <section id="banyan" className="mb-16 scroll-mt-20 sm:mb-24">
            <Card
              className="overflow-hidden bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.4)",
                borderWidth: "2px",
                background:
                  "linear-gradient(135deg, rgba(246, 230, 193, 0.05) 0%, rgba(18, 24, 39, 0.05) 100%)",
              }}
            >
              <CardContent className="p-6 text-left sm:p-10 md:p-12">
                <div className="mb-4">
                  <Badge
                    style={{
                      background: "rgba(212, 175, 55, 0.2)",
                      borderColor: "rgba(212, 175, 55, 0.4)",
                      color: "#D4AF37",
                    }}
                  >
                    Sign Up for Early Access
                  </Badge>
                </div>

                <h2
                  className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-4xl md:text-5xl"
                  style={{
                    fontFamily: "var(--font-quattrocento-sans)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Introducing <span style={{ color: "#D4AF37" }}>BANYAN</span>
                </h2>
                <p
                  className="mb-2 text-xl text-gray-200 sm:mb-3 sm:text-2xl"
                  style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 300 }}
                >
                  Your Life Operating System
                </p>

                <p
                  className="mb-6 max-w-3xl text-sm text-gray-300 sm:mb-8 sm:text-base md:text-lg"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  AI-powered platform that integrates all your life domains. Where your
                  goals become the natural byproduct of aligned habits and values.
                </p>

                <Link href="/banyan">
                  <Button
                    size="lg"
                    className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    }}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          {/* Meet the Founder Section */}
          <section className="mb-16 sm:mb-24">
            <h2
              className="mb-8 text-center text-3xl font-bold text-white sm:mb-12 sm:text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Meet the Founder
            </h2>

            <Card
              className="bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-6 sm:p-8">
                <div className="grid items-center gap-6 sm:gap-8 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <div
                      className="overflow-hidden rounded-full border-2 shadow-2xl"
                      style={{
                        borderColor: "#D4AF37",
                        boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.25)",
                      }}
                    >
                      <Image
                        src="/images/profile.jpg"
                        alt="Matthew Miceli"
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3
                      className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl"
                      style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                    >
                      Matthew Miceli
                    </h3>
                    <p
                      className="mb-4 text-base leading-relaxed text-gray-300 sm:mb-6 sm:text-lg"
                      style={{ fontFamily: "var(--font-geist-sans)" }}
                    >
                      My journey spans robotics research, satellite testing, software
                      development, high-ticket sales, and music production. This diverse
                      background has fostered my passion to discover what it means to be a
                      modern polymath—one who harmonizes seemingly disparate disciplines and
                      builds systems that foster integration.
                    </p>

                    <Link href="https://matthewmiceli.com">
                      <Button
                        variant="outline"
                        className="border-2 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                        style={{
                          borderColor: "rgba(212, 175, 55, 0.5)",
                          color: "#D4AF37",
                        }}
                      >
                        Read Full Story
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Work With Us Contact Section */}
          <section id="contact" className="mb-16 scroll-mt-20 sm:mb-24">
            <Card
              className="overflow-hidden bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.4)",
                borderWidth: "2px",
                background:
                  "linear-gradient(135deg, rgba(246, 230, 193, 0.05) 0%, rgba(212, 175, 55, 0.05) 100%)",
              }}
            >
              <CardContent className="p-6 text-center sm:p-10 md:p-12">
                <h2
                  className="mb-3 px-2 text-2xl font-bold text-white sm:mb-4 sm:text-4xl md:text-5xl"
                  style={{
                    fontFamily: "var(--font-quattrocento-sans)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Ready to Build Together?
                </h2>

                <p
                  className="mx-auto mb-6 max-w-3xl px-4 text-base text-gray-200 sm:mb-8 sm:text-xl"
                  style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 300 }}
                >
                  Whether you're launching a new venture or modernizing an existing system,
                  let's explore how AI-driven development can serve your vision
                </p>

                <a href="mailto:connect@miraclemind.live">
                  <Button
                    size="lg"
                    className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    }}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Get in Touch
                  </Button>
                </a>

                <p className="mt-6 text-sm text-gray-400">
                  connect@miraclemind.live
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
