"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  FileText,
  Phone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  Heart,
} from "lucide-react";

const COLORS = {
  brown: "#483932",
  copper: "#A45A11",
  cream: "#f8f2eb",
  sage: "#CAE2C7",
  beige: "#E7DBD1",
  hover: "#f37600",
};

const heroImages = [
  "/frazier-dentistry/home-hero-1.jpg",
  "/frazier-dentistry/home-hero-2.jpg",
  "/frazier-dentistry/home-hero-3.jpg",
  "/frazier-dentistry/home-hero-4.jpg",
];

const services = [
  {
    icon: Shield,
    title: "General Dentistry",
    desc: "Comprehensive exams, cleanings, fillings, crowns, and preventive care.",
    href: "treatment/general-treatment",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    desc: "Whitening, veneers, bonding, and implants for your best smile.",
    href: "treatment/cosmetic-dentistry",
  },
  {
    icon: Zap,
    title: "Laser Treatment",
    desc: "Advanced laser procedures — less pain, faster healing.",
    href: "treatment/laser-dental-treatment",
  },
  {
    icon: Heart,
    title: "Same-Day Crowns",
    desc: "CAD-CAM ceramic crowns in a single visit.",
    href: "treatment/same-day-cad-cam-ceramic-crowns",
  },
];

export default function FrazierHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const base = `/portal/${slug}/demos/frazier-dentistry`;
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % heroImages.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[480px] overflow-hidden sm:h-[560px]">
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-8">
          <h1
            className="mb-3 text-3xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Lobster Two', cursive" }}
          >
            Your Smile,
            <br />
            Our Passion
          </h1>
          <p className="mb-6 max-w-lg text-lg text-white/90">
            Professional, compassionate dental care in Austin, Texas. Everyone
            deserves a radiant, healthy smile.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`${base}/office/appointment-request`}
              className="rounded-md px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: COLORS.copper }}
            >
              Book Appointment
            </Link>
            <Link
              href={`${base}/patient/first-visit`}
              className="rounded-md border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              First Visit Info
            </Link>
          </div>
        </div>
        {/* Hero nav dots */}
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className="h-2.5 w-2.5 rounded-full transition-all"
              style={{
                backgroundColor:
                  i === heroIdx ? COLORS.copper : "rgba(255,255,255,0.4)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section
        className="border-b"
        style={{ backgroundColor: COLORS.cream, borderColor: COLORS.beige }}
      >
        <div
          className="mx-auto grid max-w-7xl grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          style={{ borderColor: COLORS.beige }}
        >
          {[
            {
              icon: MapPin,
              label: "Map & Directions",
              href: `${base}/office/map-directions`,
            },
            {
              icon: FileText,
              label: "Patient Forms",
              href: `${base}/patient/patient-forms`,
            },
            { icon: Phone, label: "Contact Us", href: `${base}/contact-us` },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-white/60"
            >
              <item.icon className="h-5 w-5" style={{ color: COLORS.copper }} />
              <span
                className="text-sm font-medium"
                style={{ color: COLORS.brown }}
              >
                {item.label}
              </span>
              <ArrowRight
                className="ml-auto h-4 w-4"
                style={{ color: COLORS.copper }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Welcome */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-4 text-3xl sm:text-4xl"
            style={{
              fontFamily: "'Lobster Two', cursive",
              color: COLORS.copper,
            }}
          >
            Welcome to Frazier Dentistry!
          </h2>
          <p className="mb-4 leading-relaxed" style={{ color: COLORS.brown }}>
            Thank you for visiting the website of Frazier Dentistry, a
            distinguished dental care provider conveniently located in Austin,
            Texas. Nothing exudes beauty and confidence like a bright, vibrant
            smile, and at Frazier Dentistry, we believe that everyone deserves
            to experience the life-altering benefits of a radiant, healthy
            smile.
          </p>
          <p className="leading-relaxed" style={{ color: "#5a5550" }}>
            Our friendly, multicultural team, led by Dr. Karla Frazier, will
            work to create an individualized treatment plan specifically
            designed to address your unique needs. We put our patients first and
            provide honest, effective care that helps our patients get the
            smiles they want.
          </p>
        </div>
      </section>

      {/* Services */}
      <section
        className="px-4 py-16 sm:px-6"
        style={{ backgroundColor: COLORS.cream }}
      >
        <div className="mx-auto max-w-7xl">
          <h2
            className="mb-10 text-center text-3xl"
            style={{
              fontFamily: "'Lobster Two', cursive",
              color: COLORS.brown,
            }}
          >
            Our Services
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.title}
                href={`${base}/${s.href}`}
                className="group rounded-xl border p-6 transition-all hover:shadow-lg"
                style={{ backgroundColor: "#fff", borderColor: COLORS.beige }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${COLORS.sage}40` }}
                >
                  <s.icon
                    className="h-6 w-6"
                    style={{ color: COLORS.copper }}
                  />
                </div>
                <h3 className="mb-2 font-bold" style={{ color: COLORS.brown }}>
                  {s.title}
                </h3>
                <p className="text-sm" style={{ color: "#5a5550" }}>
                  {s.desc}
                </p>
                <span
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: COLORS.copper }}
                >
                  Learn More <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dr. Frazier CTA */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 sm:flex-row">
          <div
            className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full border-4 sm:h-64 sm:w-64"
            style={{ borderColor: COLORS.beige }}
          >
            <Image
              src="/frazier-dentistry/meet-dr-frazier.jpg"
              alt="Dr. Karla Frazier"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2
              className="mb-3 text-2xl sm:text-3xl"
              style={{
                fontFamily: "'Lobster Two', cursive",
                color: COLORS.brown,
              }}
            >
              Meet Dr. Karla Frazier
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: "#5a5550" }}>
              &ldquo;When patients become a part of our dental family our goal
              is to treat them as if they were friends and family, offering the
              same treatment options that we would want for ourselves.&rdquo;
            </p>
            <Link
              href={`${base}/office/meet-dr-frazier`}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: COLORS.copper }}
            >
              Read Full Bio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section
        className="px-4 py-16 sm:px-6"
        style={{ backgroundColor: COLORS.cream }}
      >
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-8 text-center text-3xl"
            style={{
              fontFamily: "'Lobster Two', cursive",
              color: COLORS.brown,
            }}
          >
            From Our Blog
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                img: "/frazier-dentistry/hom-and-blog-welcometoourblog-whymoisturize.jpg",
                title: "Why Moisturize Your Lips?",
                excerpt:
                  "Keeping your lips moisturized is more important than you might think...",
                href: `${base}/office/our-blog/welcome-to-our-blog`,
              },
              {
                img: "/frazier-dentistry/homeandblog-dentalimplants.jpg",
                title: "Dental Implants: Replace Missing Teeth",
                excerpt:
                  "Learn about the options available for replacing missing teeth with implants...",
                href: `${base}/office/our-blog/dental-implants`,
              },
            ].map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
                style={{ backgroundColor: "#fff", borderColor: COLORS.beige }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3
                    className="mb-2 font-bold"
                    style={{ color: COLORS.brown }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#5a5550" }}>
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-4 py-16 sm:px-6"
        style={{ backgroundColor: COLORS.brown }}
      >
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2
            className="mb-4 text-3xl"
            style={{ fontFamily: "'Lobster Two', cursive" }}
          >
            Ready for Your Best Smile?
          </h2>
          <p className="mb-6 text-white/80">
            Schedule an appointment today and experience the Frazier Dentistry
            difference.
          </p>
          <Link
            href={`${base}/office/appointment-request`}
            className="inline-block rounded-md px-8 py-3 font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLORS.copper }}
          >
            Request an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
