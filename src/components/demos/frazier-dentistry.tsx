"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  MapPin,
  FileText,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  BookOpen,
  CheckCircle2,
  Printer,
  Star,
  ClipboardList,
  HelpCircle,
  AlertTriangle,
  Siren,
  ShieldCheck,
  Stethoscope,
  Baby,
  Crown,
  ExternalLink,
  Download,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const COLORS = {
  brown: "#483932",
  copper: "#A45A11",
  cream: "#f8f2eb",
  white: "#FCFCFC",
  sage: "#CAE2C7",
  tan: "#938275",
  hover: "#f37600",
  beige: "#E7DBD1",
  medBrown: "#5a5550",
};

/* ------------------------------------------------------------------ */
/*  NAV DATA                                                           */
/* ------------------------------------------------------------------ */

interface NavItem {
  name: string;
  page: string;
  children?: { name: string; page: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", page: "home" },
  {
    name: "Office",
    page: "office",
    children: [
      { name: "Meet Dr. Frazier", page: "office/meet-dr-frazier" },
      { name: "Meet Our Team", page: "office/meet-our-team" },
      { name: "Financial", page: "office/financial" },
      { name: "Map & Directions", page: "office/map-directions" },
      { name: "Appointment Request", page: "office/appointment-request" },
      { name: "Feedback", page: "office/feedback" },
      { name: "Our Blog", page: "office/our-blog" },
    ],
  },
  {
    name: "Patient",
    page: "patient",
    children: [
      { name: "First Visit", page: "patient/first-visit" },
      { name: "FAQ", page: "patient/faq" },
      { name: "Patient Forms", page: "patient/patient-forms" },
      { name: "Common Problems", page: "patient/common-problems" },
      { name: "Emergencies", page: "patient/emergencies" },
      { name: "Prevention", page: "patient/prevention" },
    ],
  },
  {
    name: "Treatment",
    page: "treatment",
    children: [
      { name: "General Treatment", page: "treatment/general-treatment" },
      {
        name: "Early Dental Treatment",
        page: "treatment/early-dental-treatment",
      },
      { name: "Cosmetic Dentistry", page: "treatment/cosmetic-dentistry" },
      {
        name: "Same-Day CAD-CAM Crowns",
        page: "treatment/same-day-cad-cam-ceramic-crowns",
      },
      { name: "Laser Treatment", page: "treatment/laser-dental-treatment" },
    ],
  },
  {
    name: "Miscellaneous",
    page: "miscellaneous",
    children: [
      { name: "Related Links", page: "miscellaneous/related-links" },
      { name: "Glossary", page: "miscellaneous/glossary" },
    ],
  },
  { name: "Contact Us", page: "contact-us" },
];

/* ------------------------------------------------------------------ */
/*  SHARED HELPERS / MINI-COMPONENTS                                   */
/* ------------------------------------------------------------------ */

type SetPage = (page: string) => void;

function PageShell({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle?: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        className="px-4 py-12 text-center sm:px-6"
        style={{ backgroundColor: accent ? COLORS.cream : undefined }}
      >
        <h1
          className="mb-2 text-3xl sm:text-4xl"
          style={{ fontFamily: "'Lobster Two', cursive", color: COLORS.copper }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto max-w-2xl text-sm" style={{ color: "#5a5550" }}>
            {subtitle}
          </p>
        )}
        <div
          className="mx-auto mt-4 h-0.5 w-16"
          style={{ backgroundColor: COLORS.copper }}
        />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 leading-relaxed" style={{ color: COLORS.brown }}>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
    >
      <h3 className="mb-3 text-lg font-bold" style={{ color: COLORS.brown }}>
        {title}
      </h3>
      <div className="text-sm leading-relaxed" style={{ color: "#5a5550" }}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NAV COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function DesktopDropdown({
  item,
  currentPage,
  setPage,
}: {
  item: NavItem;
  currentPage: string;
  setPage: SetPage;
}) {
  const [open, setOpen] = useState(false);
  const isActive =
    currentPage === item.page || currentPage.startsWith(item.page + "/");

  if (!item.children) {
    return (
      <button
        onClick={() => setPage(item.page)}
        className="px-3 py-2 text-sm font-medium transition-colors"
        style={{ color: isActive ? COLORS.copper : COLORS.brown }}
        onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.hover)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = isActive
            ? COLORS.copper
            : COLORS.brown)
        }
      >
        {item.name}
      </button>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setPage(item.page)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors"
        style={{ color: isActive ? COLORS.copper : COLORS.brown }}
      >
        {item.name}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-50 min-w-[220px] rounded-md border py-1 shadow-lg"
          style={{ backgroundColor: COLORS.white, borderColor: COLORS.beige }}
        >
          {item.children.map((child) => (
            <button
              key={child.page}
              onClick={() => {
                setPage(child.page);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm transition-colors"
              style={{ color: COLORS.brown }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.copper;
                e.currentTarget.style.backgroundColor = COLORS.cream;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = COLORS.brown;
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {child.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: HOME                                                         */
/* ------------------------------------------------------------------ */

const heroImages = [
  "/frazier-dentistry/home-hero-1.jpg",
  "/frazier-dentistry/home-hero-2.jpg",
  "/frazier-dentistry/home-hero-3.jpg",
  "/frazier-dentistry/home-hero-4.jpg",
];

const homeServices = [
  {
    icon: Shield,
    title: "General Dentistry",
    desc: "Comprehensive exams, cleanings, fillings, crowns, and preventive care.",
    page: "treatment/general-treatment",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    desc: "Whitening, veneers, bonding, and implants for your best smile.",
    page: "treatment/cosmetic-dentistry",
  },
  {
    icon: Zap,
    title: "Laser Treatment",
    desc: "Advanced laser procedures — less pain, faster healing.",
    page: "treatment/laser-dental-treatment",
  },
  {
    icon: Heart,
    title: "Same-Day Crowns",
    desc: "CAD-CAM ceramic crowns in a single visit.",
    page: "treatment/same-day-cad-cam-ceramic-crowns",
  },
];

function HomePage({ setPage }: { setPage: SetPage }) {
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
            <button
              onClick={() => setPage("office/appointment-request")}
              className="rounded-md px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: COLORS.copper }}
            >
              Book Appointment
            </button>
            <button
              onClick={() => setPage("patient/first-visit")}
              className="rounded-md border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              First Visit Info
            </button>
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
              page: "office/map-directions",
            },
            {
              icon: FileText,
              label: "Patient Forms",
              page: "patient/patient-forms",
            },
            { icon: Phone, label: "Contact Us", page: "contact-us" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setPage(item.page)}
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
            </button>
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
            {homeServices.map((s) => (
              <button
                key={s.title}
                onClick={() => setPage(s.page)}
                className="group rounded-xl border p-6 text-left transition-all hover:shadow-lg"
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
              </button>
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
            <button
              onClick={() => setPage("office/meet-dr-frazier")}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: COLORS.copper }}
            >
              Read Full Bio <ArrowRight className="h-4 w-4" />
            </button>
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
                page: "office/our-blog/welcome-to-our-blog",
              },
              {
                img: "/frazier-dentistry/homeandblog-dentalimplants.jpg",
                title: "Dental Implants: Replace Missing Teeth",
                excerpt:
                  "Learn about the options available for replacing missing teeth with implants...",
                page: "office/our-blog/dental-implants",
              },
            ].map((post) => (
              <button
                key={post.title}
                onClick={() => setPage(post.page)}
                className="group overflow-hidden rounded-xl border text-left transition-shadow hover:shadow-lg"
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
              </button>
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
          <button
            onClick={() => setPage("office/appointment-request")}
            className="inline-block rounded-md px-8 py-3 font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLORS.copper }}
          >
            Request an Appointment
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: OFFICE HUB                                                   */
/* ------------------------------------------------------------------ */

function OfficePage({ setPage }: { setPage: SetPage }) {
  const links = [
    {
      icon: Users,
      title: "Meet Dr. Frazier",
      desc: "Learn about our lead dentist",
      page: "office/meet-dr-frazier",
    },
    {
      icon: Users,
      title: "Meet Our Team",
      desc: "Our friendly, skilled staff",
      page: "office/meet-our-team",
    },
    {
      icon: DollarSign,
      title: "Financial",
      desc: "Insurance and payment options",
      page: "office/financial",
    },
    {
      icon: MapPin,
      title: "Map & Directions",
      desc: "Find us in Austin",
      page: "office/map-directions",
    },
    {
      icon: Calendar,
      title: "Appointment Request",
      desc: "Schedule your visit",
      page: "office/appointment-request",
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      desc: "Share your experience",
      page: "office/feedback",
    },
    {
      icon: BookOpen,
      title: "Our Blog",
      desc: "Tips and dental news",
      page: "office/our-blog",
    },
  ];

  return (
    <PageShell
      title="Our Office"
      subtitle="Everything you need to know about Frazier Dentistry"
      accent
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <button
            key={item.page}
            onClick={() => setPage(item.page)}
            className="flex items-start gap-4 rounded-xl border p-5 text-left transition-shadow hover:shadow-md"
            style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: COLORS.cream }}
            >
              <item.icon className="h-5 w-5" style={{ color: COLORS.copper }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: COLORS.brown }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {item.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: MEET DR. FRAZIER                                             */
/* ------------------------------------------------------------------ */

function MeetDrFrazierPage() {
  return (
    <PageShell title="Meet Dr. Frazier" accent>
      <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
        <div
          className="relative h-56 w-56 shrink-0 overflow-hidden rounded-xl border-2"
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
            className="mb-1 text-2xl font-bold"
            style={{ color: COLORS.brown }}
          >
            Dr. Karla Frazier, D.M.D.
          </h2>
          <p className="mb-3 text-sm" style={{ color: COLORS.copper }}>
            Founder &amp; Lead Dentist
          </p>
          <Prose>
            <p>
              Dr. Karla Frazier grew up in Jackson, Mississippi and earned her
              B.S. in Biology from Jackson State University in 1992. She went on
              to receive her Dental Medicine Doctorate from the University of
              Pennsylvania School of Dental Medicine in 1996.
            </p>
          </Prose>
        </div>
      </div>

      <Prose>
        <p>
          After dental school, Dr. Frazier served as a Captain in the United
          States Air Force, practicing dentistry at Beale Air Force Base in
          California. She moved to Austin in 1999, entered private practice as
          an associate, and since 2001 has been the sole practitioner in her own
          dental practice.
        </p>
      </Prose>

      <div className="my-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Advanced Training">
          <ul className="list-inside list-disc space-y-1">
            <li>Hiossen Implant System</li>
            <li>CEREC CAD-CAM Technology</li>
            <li>Er, Cr: YSGG Laser (Biolase Waterlase &amp; Epic Diode)</li>
            <li>Invisalign Orthodontic Therapy</li>
            <li>Zoom! Whitening</li>
            <li>All-On-4 Implant Supported Dentures</li>
            <li>Nitrous Oxide Administration</li>
          </ul>
        </SectionCard>

        <SectionCard title="Professional Memberships">
          <ul className="list-inside list-disc space-y-1">
            <li>American Dental Association</li>
            <li>Texas Dental Association</li>
            <li>Capital Area Dental Society</li>
            <li>World Clinical Laser Institute</li>
          </ul>
        </SectionCard>
      </div>

      <div className="my-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Community Involvement">
          <p>
            Dr. Frazier has served as an Investigator for the State of Texas
            Investigator General&apos;s Office for Dental Medicaid fraud. She
            co-founded The Professional Institute of Dental Assisting and was
            the former official dentist of the NBA D-League Austin Toros (now
            Austin Spurs) and Connally High School Athletics Department.
          </p>
          <p className="mt-2">
            She regularly speaks to children in schools about the dental
            profession and mentors high school students, UT pre-dental students,
            and young professionals.
          </p>
        </SectionCard>

        <SectionCard title="Personal">
          <p>
            Outside the office, Dr. Frazier enjoys traveling, music, helping
            others, and spending time with family and friends. She believes in
            living a fun, low-stress life.
          </p>
        </SectionCard>
      </div>

      {/* Philosophy Quote */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: COLORS.cream,
          borderLeft: `4px solid ${COLORS.copper}`,
        }}
      >
        <p className="leading-relaxed italic" style={{ color: COLORS.brown }}>
          &ldquo;When patients become a part of our dental family our goal is to
          treat them as if they were friends and family, offering the same
          treatment options that we would want for ourselves. We want our
          patients to be able to get the best treatment available to them, and
          we want to do what is right for them. We want to help them get their
          life smile.&rdquo;
        </p>
        <p
          className="mt-3 text-sm font-medium"
          style={{ color: COLORS.copper }}
        >
          — Dr. Karla Frazier
        </p>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: MEET OUR TEAM                                                */
/* ------------------------------------------------------------------ */

const teamMembers = [
  {
    name: "Dr. Karla Frazier",
    role: "Dentist",
    img: "/frazier-dentistry/meet-our-team-drfrazier.jpg",
  },
  {
    name: "Letitia Wilkins",
    role: "Office Manager",
    img: "/frazier-dentistry/meet-our-team-letitia-wilkins.jpg",
  },
  {
    name: "Juli Martinez",
    role: "Financial Coordinator",
    img: "/frazier-dentistry/meet-our-team-juli-martinez.jpg",
  },
  {
    name: "Cindy Reyes",
    role: "Dental Assistant",
    img: "/frazier-dentistry/meet-our-team-cindy-reyes.jpg",
  },
  {
    name: "Carissa Felix",
    role: "Dental Assistant",
    img: "/frazier-dentistry/meet-our-team-carissa-felix.jpg",
  },
  {
    name: "Katie Schulte",
    role: "Hygienist",
    img: "/frazier-dentistry/meet-our-team-katie-schulte.jpg",
  },
];

function MeetOurTeamPage() {
  return (
    <PageShell
      title="Meet Our Team"
      subtitle="Friendly, skilled professionals dedicated to your comfort and care"
      accent
    >
      <Prose>
        <p>
          We know that our office is only as effective and as welcoming as the
          people who work in it, which is why we take pride in our friendly and
          well-trained team members! We put your needs first to achieve
          efficient and comprehensive treatment in a supportive and nurturing
          environment.
        </p>
        <p>
          Our staff is uniquely trained and highly skilled, with specialized
          training and certifications, and years of experience. They regularly
          attend clinical continuing education courses in lasers, implants,
          CEREC, infection control, and OSHA, as well as administrative courses
          in HIPAA, insurance, and billing.
        </p>
      </Prose>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {teamMembers.map((member) => (
          <div key={member.name} className="text-center">
            <div
              className="relative mx-auto mb-3 h-40 w-40 overflow-hidden rounded-full border-2"
              style={{ borderColor: COLORS.beige }}
            >
              <Image
                src={member.img}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold" style={{ color: COLORS.brown }}>
              {member.name}
            </h3>
            <p className="text-sm" style={{ color: COLORS.copper }}>
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: FINANCIAL                                                    */
/* ------------------------------------------------------------------ */

const insurancePlans = [
  "Aetna PPO",
  "Ameritas PPO",
  "Assurant PPO",
  "Cigna PPO",
  "Connection Dental PPO",
  "Delta Dental PPO",
  "GEHA Dental Connect",
  "Guardian PPO",
  "Humana PPO",
  "MetLife PPO",
  "Principal PPO",
  "United Concordia PPO",
  "United Health Care PPO",
];

function FinancialPage() {
  return (
    <PageShell
      title="Financial Information"
      subtitle="We make quality dental care accessible"
      accent
    >
      <Prose>
        <p>
          We accept cash, checks (with picture ID), money orders, and debit
          cards. We also offer low- and no-interest financing options to help
          make your dental care affordable.
        </p>
      </Prose>

      <div className="mt-8">
        <SectionCard title="Insurance Plans Accepted (PPO)">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {insurancePlans.map((plan) => (
              <div key={plan} className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 shrink-0"
                  style={{ color: COLORS.copper }}
                />
                <span>{plan}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: MAP & DIRECTIONS                                             */
/* ------------------------------------------------------------------ */

function MapDirectionsPage() {
  return (
    <PageShell title="Map & Directions" accent>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: COLORS.copper }}
              />
              <div>
                <p className="font-bold" style={{ color: COLORS.brown }}>
                  Address
                </p>
                <p className="text-sm" style={{ color: "#5a5550" }}>
                  7333 E. US Hwy. 290
                  <br />
                  Austin, TX 78723
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: COLORS.copper }}
              />
              <div>
                <p className="font-bold" style={{ color: COLORS.brown }}>
                  Phone
                </p>
                <p className="text-sm" style={{ color: "#5a5550" }}>
                  (512) 453-3879
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: COLORS.copper }}
              />
              <div>
                <p className="font-bold" style={{ color: COLORS.brown }}>
                  Email
                </p>
                <p className="text-sm" style={{ color: "#5a5550" }}>
                  contactus@drkarlafrazier.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: COLORS.copper }}
              />
              <div>
                <p className="font-bold" style={{ color: COLORS.brown }}>
                  Office Hours
                </p>
                <div className="text-sm" style={{ color: "#5a5550" }}>
                  <p>Mon: 8:00am - 4:00pm</p>
                  <p>Tue: 8:00am - 4:00pm</p>
                  <p>Wed: 8:00am - 5:00pm</p>
                  <p>Thu: 8:00am - 4:00pm</p>
                  <p>Fri: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex h-64 items-center justify-center rounded-xl border sm:h-auto"
          style={{
            borderColor: COLORS.beige,
            backgroundColor: COLORS.cream,
          }}
        >
          <div className="text-center">
            <MapPin
              className="mx-auto mb-2 h-8 w-8"
              style={{ color: COLORS.copper }}
            />
            <p className="text-sm" style={{ color: "#5a5550" }}>
              Map placeholder
            </p>
            <p className="text-xs" style={{ color: "#938275" }}>
              Interactive map would go here
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: APPOINTMENT REQUEST                                          */
/* ------------------------------------------------------------------ */

function AppointmentRequestPage() {
  return (
    <PageShell
      title="Appointment Request"
      subtitle="We'll get back to you within one business day"
      accent
    >
      <div className="mx-auto max-w-lg">
        <div
          className="space-y-4 rounded-xl border p-6"
          style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
        >
          {[
            { label: "Full Name", type: "text", placeholder: "Jane Doe" },
            { label: "Email", type: "email", placeholder: "jane@example.com" },
            { label: "Phone", type: "tel", placeholder: "(512) 000-0000" },
            { label: "Preferred Date", type: "date", placeholder: "" },
          ].map((field) => (
            <div key={field.label}>
              <label
                className="mb-1 block text-sm font-medium"
                style={{ color: COLORS.brown }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: COLORS.beige,
                  color: COLORS.brown,
                }}
              />
            </div>
          ))}
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: COLORS.brown }}
            >
              Reason for Visit
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.beige,
                color: COLORS.brown,
              }}
            >
              <option>General Checkup</option>
              <option>Teeth Cleaning</option>
              <option>Cosmetic Consultation</option>
              <option>Emergency</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: COLORS.brown }}
            >
              Additional Notes
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.beige,
                color: COLORS.brown,
              }}
              placeholder="Anything we should know..."
            />
          </div>
          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLORS.copper }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: FEEDBACK                                                     */
/* ------------------------------------------------------------------ */

function FeedbackPage() {
  return (
    <PageShell
      title="Feedback"
      subtitle="We value your opinion — help us improve your experience"
      accent
    >
      <div className="mx-auto max-w-lg">
        <div
          className="space-y-4 rounded-xl border p-6"
          style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
        >
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: COLORS.brown }}
            >
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: COLORS.beige }}
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: COLORS.brown }}
            >
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className="h-8 w-8 cursor-pointer"
                  style={{
                    color: n <= 4 ? COLORS.copper : COLORS.beige,
                  }}
                  fill={n <= 4 ? COLORS.copper : "none"}
                />
              ))}
            </div>
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: COLORS.brown }}
            >
              Comments
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: COLORS.beige }}
              placeholder="Tell us about your experience..."
            />
          </div>
          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLORS.copper }}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: OUR BLOG                                                     */
/* ------------------------------------------------------------------ */

const blogPosts = [
  {
    page: "office/our-blog/welcome-to-our-blog",
    img: "/frazier-dentistry/hom-and-blog-welcometoourblog-whymoisturize.jpg",
    title: "Why Moisturize Your Lips?",
    date: "July 31",
    author: "Dr. Karla Frazier",
    excerpt:
      "Keeping your lips moisturized is more important than you might think. Dry, cracked lips can lead to discomfort and even infection...",
  },
  {
    page: "office/our-blog/dental-implants",
    img: "/frazier-dentistry/homeandblog-dentalimplants.jpg",
    title: "Dental Implants: An Option to Replace Missing Teeth",
    date: "July 9",
    author: "Dr. Karla Frazier",
    excerpt:
      "Dental implants are a popular and effective way to replace missing teeth. They look, feel, and function like natural teeth...",
  },
];

function BlogPage({ setPage }: { setPage: SetPage }) {
  return (
    <PageShell
      title="Our Blog"
      subtitle="Tips, news, and insights from Frazier Dentistry"
      accent
    >
      <div className="space-y-6">
        {blogPosts.map((post) => (
          <button
            key={post.page}
            onClick={() => setPage(post.page)}
            className="group flex w-full flex-col overflow-hidden rounded-xl border text-left transition-shadow hover:shadow-md sm:flex-row"
            style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
          >
            <div className="relative h-48 shrink-0 sm:h-auto sm:w-56">
              <Image
                src={post.img}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-5">
              <p className="mb-1 text-xs" style={{ color: COLORS.copper }}>
                {post.date} · {post.author}
              </p>
              <h3
                className="mb-2 text-lg font-bold"
                style={{ color: COLORS.brown }}
              >
                {post.title}
              </h3>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {post.excerpt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: BLOG POST — Welcome                                          */
/* ------------------------------------------------------------------ */

function WelcomeBlogPostPage() {
  return (
    <PageShell
      title="Why Moisturize Your Lips?"
      subtitle="By Dr. Karla Frazier · July 31"
      accent
    >
      <div className="relative mb-6 h-64 overflow-hidden rounded-xl">
        <Image
          src="/frazier-dentistry/hom-and-blog-welcometoourblog-whymoisturize.jpg"
          alt="Why Moisturize"
          fill
          className="object-cover"
        />
      </div>
      <Prose>
        <p>
          Welcome to the Frazier Dentistry blog! We&apos;re excited to share
          tips, insights, and news to help you maintain a healthy, beautiful
          smile.
        </p>
        <p>
          Keeping your lips moisturized is more important than you might think.
          Your lips are one of the most sensitive parts of your body, with thin
          skin that&apos;s more prone to drying out. Dry, cracked lips can lead
          to discomfort, bleeding, and even infection if not properly cared for.
        </p>
        <h3 style={{ color: COLORS.brown, fontWeight: 700 }}>
          Tips for Healthy Lips
        </h3>
        <ul className="list-inside list-disc space-y-1">
          <li>Use a lip balm with SPF protection, especially in summer</li>
          <li>Stay hydrated — drink plenty of water throughout the day</li>
          <li>Avoid licking your lips, which actually makes them drier</li>
          <li>Use a humidifier in dry weather</li>
          <li>Choose lip products without harsh chemicals or fragrances</li>
        </ul>
        <p>
          If you experience persistent dry or cracked lips, it could be a sign
          of an underlying dental or health issue. Don&apos;t hesitate to bring
          it up at your next appointment!
        </p>
      </Prose>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: BLOG POST — Dental Implants                                  */
/* ------------------------------------------------------------------ */

function DentalImplantsBlogPostPage() {
  return (
    <PageShell
      title="Dental Implants: An Option to Replace Missing Teeth"
      subtitle="By Dr. Karla Frazier · July 9"
      accent
    >
      <div className="relative mb-6 h-64 overflow-hidden rounded-xl">
        <Image
          src="/frazier-dentistry/homeandblog-dentalimplants.jpg"
          alt="Dental Implants"
          fill
          className="object-cover"
        />
      </div>
      <Prose>
        <p>
          Dental implants are a popular and effective long-term solution for
          people who suffer from missing teeth, failing teeth, or chronic dental
          problems. They fit, feel, and function like natural teeth — and with
          proper care, can last a lifetime.
        </p>
        <h3 style={{ color: COLORS.brown, fontWeight: 700 }}>
          What Are Dental Implants?
        </h3>
        <p>
          A dental implant is a titanium post that is surgically positioned into
          the jawbone beneath the gum line, allowing your dentist to mount
          replacement teeth or a bridge into that area. Unlike dentures,
          implants don&apos;t come loose and can benefit general oral health
          because they do not need to be anchored to other teeth.
        </p>
        <h3 style={{ color: COLORS.brown, fontWeight: 700 }}>
          Types of Implants
        </h3>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong>Single tooth implants</strong> — replace individual missing
            teeth
          </li>
          <li>
            <strong>Anterior implants</strong> — restore front teeth aesthetics
          </li>
          <li>
            <strong>Posterior implants</strong> — restore chewing function in
            back teeth
          </li>
          <li>
            <strong>Full upper replacement</strong> — All-On-4 implant-supported
            dentures
          </li>
        </ul>
        <p>
          At Frazier Dentistry, Dr. Frazier is trained in the Hiossen Implant
          System and All-On-4 implant-supported fixed denture restoration.
          Schedule a consultation to see if dental implants are right for you.
        </p>
      </Prose>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: PATIENT HUB                                                  */
/* ------------------------------------------------------------------ */

function PatientPage({ setPage }: { setPage: SetPage }) {
  const links = [
    {
      icon: ClipboardList,
      title: "First Visit",
      desc: "What to expect at your first appointment",
      page: "patient/first-visit",
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      desc: "Common questions answered",
      page: "patient/faq",
    },
    {
      icon: FileText,
      title: "Patient Forms",
      desc: "Download and complete before your visit",
      page: "patient/patient-forms",
    },
    {
      icon: AlertTriangle,
      title: "Common Problems",
      desc: "Dental issues and when to seek care",
      page: "patient/common-problems",
    },
    {
      icon: Siren,
      title: "Emergencies",
      desc: "What to do in a dental emergency",
      page: "patient/emergencies",
    },
    {
      icon: ShieldCheck,
      title: "Prevention",
      desc: "Tips to keep your smile healthy",
      page: "patient/prevention",
    },
  ];

  return (
    <PageShell
      title="Patient Information"
      subtitle="Resources to help you prepare for your visit"
      accent
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <button
            key={item.page}
            onClick={() => setPage(item.page)}
            className="flex items-start gap-4 rounded-xl border p-5 text-left transition-shadow hover:shadow-md"
            style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: COLORS.cream }}
            >
              <item.icon className="h-5 w-5" style={{ color: COLORS.copper }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: COLORS.brown }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {item.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: FIRST VISIT                                                  */
/* ------------------------------------------------------------------ */

function FirstVisitPage() {
  return (
    <PageShell
      title="Your First Visit"
      subtitle="What to expect at Frazier Dentistry"
      accent
    >
      <Prose>
        <p>
          Your initial appointment will last approximately one hour. During this
          visit, we will clean your teeth, take necessary X-rays, and perform a
          thorough examination evaluating for decay, periodontal problems, jaw
          problems, and signs of oral cancer.
        </p>
      </Prose>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Please Bring">
          <ul className="space-y-2">
            {[
              "Panoramic X-ray (within past 6 months)",
              "Insurance card",
              "Photo ID",
              "Completed health information forms",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: COLORS.copper }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="What We'll Do">
          <ul className="space-y-2">
            {[
              "Professional teeth cleaning",
              "Digital X-rays as needed",
              "Comprehensive oral examination",
              "Discuss findings and treatment plan",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: COLORS.copper }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: FAQ                                                          */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: "How often should I visit the dentist?",
    a: "We recommend visits every six months for routine cleanings and exams. Some patients with specific conditions may need more frequent visits.",
  },
  {
    q: "What should I do about bad breath?",
    a: "Bad breath can be caused by many factors including food, dry mouth, or gum disease. Regular brushing, flossing, and dental cleanings help. If it persists, schedule an appointment.",
  },
  {
    q: "How can I prevent cavities?",
    a: "Brush twice daily with fluoride toothpaste, floss daily, maintain a balanced diet, and visit us regularly for professional cleanings and exams.",
  },
  {
    q: "Are dental X-rays safe?",
    a: "Yes. Modern digital X-rays use very low levels of radiation. We use them only when necessary for proper diagnosis and treatment planning.",
  },
  {
    q: "What payment options do you offer?",
    a: "We accept cash, checks, debit cards, and most PPO insurance plans. We also offer low- and no-interest financing options.",
  },
  {
    q: "Do you see children?",
    a: "Yes! We recommend a child's first dental visit around their first birthday. We provide gentle, kid-friendly care.",
  },
];

function FaqPage() {
  return (
    <PageShell title="Frequently Asked Questions" accent>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-xl border p-5"
            style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
          >
            <h3 className="mb-2 font-bold" style={{ color: COLORS.brown }}>
              {faq.q}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#5a5550" }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: PATIENT FORMS                                                */
/* ------------------------------------------------------------------ */

const patientForms = [
  {
    name: "New Patient Registration",
    desc: "Complete before your first visit",
  },
  {
    name: "Medical History Form",
    desc: "Current medications, allergies, and conditions",
  },
  {
    name: "Insurance Information",
    desc: "Primary and secondary insurance details",
  },
  {
    name: "HIPAA Privacy Notice",
    desc: "Acknowledgment of privacy practices",
  },
];

function PatientFormsPage() {
  return (
    <PageShell
      title="Patient Forms"
      subtitle="Download and complete these forms before your visit to save time"
      accent
    >
      <Prose>
        <p>
          Please complete the following forms prior to your appointment. You may
          print them, fill them out at home, and bring them to your visit.
        </p>
      </Prose>
      <div className="mt-6 space-y-3">
        {patientForms.map((form) => (
          <div
            key={form.name}
            className="flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm"
            style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: COLORS.cream }}
            >
              <FileText className="h-5 w-5" style={{ color: COLORS.copper }} />
            </div>
            <div className="flex-1">
              <p className="font-bold" style={{ color: COLORS.brown }}>
                {form.name}
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {form.desc}
              </p>
            </div>
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white"
              style={{ backgroundColor: COLORS.copper }}
            >
              <Download className="h-3 w-3" /> PDF
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: COMMON PROBLEMS                                              */
/* ------------------------------------------------------------------ */

const problems = [
  {
    title: "Tooth Decay",
    desc: "Caused by bacteria producing acids that erode enamel. Regular brushing, flossing, and dental visits help prevent cavities.",
  },
  {
    title: "Gum Disease",
    desc: "Ranges from gingivitis (inflammation) to periodontitis (bone loss). Early treatment prevents tooth loss.",
  },
  {
    title: "Tooth Sensitivity",
    desc: "Pain from hot, cold, or sweet foods may indicate exposed roots, worn enamel, or cavities.",
  },
  {
    title: "Toothache",
    desc: "Can signal decay, infection, or fracture. See us promptly — don't wait for the pain to worsen.",
  },
  {
    title: "Bad Breath",
    desc: "Often caused by bacteria on the tongue, gum disease, or dry mouth. Professional cleaning and good hygiene help.",
  },
  {
    title: "Teeth Grinding (Bruxism)",
    desc: "Often occurs during sleep. Can cause jaw pain, headaches, and worn teeth. Custom night guards help.",
  },
];

function CommonProblemsPage() {
  return (
    <PageShell
      title="Common Dental Problems"
      subtitle="Know the signs and when to seek care"
      accent
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {problems.map((p) => (
          <SectionCard key={p.title} title={p.title}>
            <p>{p.desc}</p>
          </SectionCard>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: EMERGENCIES                                                  */
/* ------------------------------------------------------------------ */

function EmergenciesPage() {
  return (
    <PageShell title="Dental Emergencies" accent>
      <div
        className="mb-6 flex items-center gap-3 rounded-xl p-4"
        style={{ backgroundColor: "#FEE2E2" }}
      >
        <Phone className="h-5 w-5 shrink-0 text-red-600" />
        <p className="text-sm font-medium text-red-800">
          For dental emergencies, call us immediately at{" "}
          <strong>(512) 453-3879</strong>
        </p>
      </div>

      <Prose>
        <p>
          Dental emergencies can happen at any time. Knowing what to do before
          you reach our office can mean the difference between saving and losing
          a tooth.
        </p>
      </Prose>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Knocked-Out Tooth">
          <p>
            Pick up the tooth by the crown (not the root). Rinse gently without
            scrubbing. Try to reinsert it in the socket. If not possible, place
            in milk and get to our office immediately.
          </p>
        </SectionCard>
        <SectionCard title="Broken Tooth">
          <p>
            Rinse your mouth with warm water. Apply a cold compress to reduce
            swelling. Save any pieces if possible and call us right away.
          </p>
        </SectionCard>
        <SectionCard title="Severe Toothache">
          <p>
            Rinse with warm salt water. Gently floss to remove any trapped
            debris. Take over-the-counter pain relief and call for an
            appointment.
          </p>
        </SectionCard>
        <SectionCard title="Lost Filling or Crown">
          <p>
            Apply dental cement or sugar-free gum as a temporary measure. Avoid
            chewing on that side. Contact us to schedule a repair.
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: PREVENTION                                                   */
/* ------------------------------------------------------------------ */

function PreventionPage() {
  return (
    <PageShell
      title="Prevention"
      subtitle="The best dental care starts at home"
      accent
    >
      <Prose>
        <p>
          Preventive dentistry is the practice of caring for your teeth to keep
          them healthy. This helps to avoid cavities, gum disease, enamel wear,
          and more.
        </p>
      </Prose>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Daily Habits">
          <ul className="list-inside list-disc space-y-1">
            <li>Brush at least twice daily with fluoride toothpaste</li>
            <li>Floss daily to remove plaque between teeth</li>
            <li>Use mouthwash to reduce bacteria</li>
            <li>Replace your toothbrush every 3-4 months</li>
          </ul>
        </SectionCard>
        <SectionCard title="Diet & Nutrition">
          <ul className="list-inside list-disc space-y-1">
            <li>Limit sugary and acidic foods and drinks</li>
            <li>Drink plenty of water throughout the day</li>
            <li>Eat crunchy fruits and vegetables</li>
            <li>Avoid tobacco products</li>
          </ul>
        </SectionCard>
        <SectionCard title="Regular Visits">
          <p>
            Visit us every six months for professional cleanings and exams.
            Early detection of problems saves time, money, and discomfort.
          </p>
        </SectionCard>
        <SectionCard title="Protective Measures">
          <ul className="list-inside list-disc space-y-1">
            <li>Wear a mouthguard during sports</li>
            <li>Use a night guard if you grind your teeth</li>
            <li>Consider dental sealants for children</li>
          </ul>
        </SectionCard>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: TREATMENT HUB                                                */
/* ------------------------------------------------------------------ */

function TreatmentPage({ setPage }: { setPage: SetPage }) {
  const treatments = [
    {
      icon: Stethoscope,
      title: "General Treatment",
      desc: "Exams, cleanings, fillings, crowns, bridges, root canals, and extractions.",
      page: "treatment/general-treatment",
    },
    {
      icon: Baby,
      title: "Early Dental Treatment",
      desc: "Teething, baby bottle decay, space maintainers, and children's first visits.",
      page: "treatment/early-dental-treatment",
    },
    {
      icon: Sparkles,
      title: "Cosmetic Dentistry",
      desc: "Whitening, veneers, dental implants, and composite bonding.",
      page: "treatment/cosmetic-dentistry",
    },
    {
      icon: Crown,
      title: "Same-Day CAD-CAM Crowns",
      desc: "Computer-designed ceramic crowns completed in a single visit.",
      page: "treatment/same-day-cad-cam-ceramic-crowns",
    },
    {
      icon: Zap,
      title: "Laser Dental Treatment",
      desc: "Advanced Biolase laser procedures for hard and soft tissue.",
      page: "treatment/laser-dental-treatment",
    },
  ];

  return (
    <PageShell
      title="Our Treatments"
      subtitle="Comprehensive care using the latest technology"
      accent
    >
      <div className="space-y-4">
        {treatments.map((t) => (
          <button
            key={t.page}
            onClick={() => setPage(t.page)}
            className="group flex w-full items-center gap-5 rounded-xl border p-5 text-left transition-shadow hover:shadow-md"
            style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: COLORS.cream }}
            >
              <t.icon className="h-6 w-6" style={{ color: COLORS.copper }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: COLORS.brown }}>
                {t.title}
              </h3>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {t.desc}
              </p>
            </div>
            <ArrowRight
              className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{ color: COLORS.copper }}
            />
          </button>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: GENERAL TREATMENT                                            */
/* ------------------------------------------------------------------ */

function GeneralTreatmentPage() {
  return (
    <PageShell
      title="General Treatment"
      subtitle="Comprehensive dental care for the whole family"
      accent
    >
      <Prose>
        <p>
          We are experienced in every major aspect of general dentistry. From
          routine check-ups and cleanings to more complex procedures, our goal
          is to keep your teeth healthy and your smile bright.
        </p>
      </Prose>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Dental Examination">
          <p>
            Thorough exams including X-rays, oral cancer screening, and
            personalized treatment recommendations.
          </p>
        </SectionCard>
        <SectionCard title="Routine Cleanings">
          <p>
            Professional cleanings twice yearly. Plaque and tartar removal,
            polishing, and fluoride application.
          </p>
        </SectionCard>
        <SectionCard title="Fillings">
          <p>
            We offer silver amalgam, gold, and white (composite) fillings to
            restore teeth damaged by decay.
          </p>
        </SectionCard>
        <SectionCard title="Crowns">
          <p>
            Custom-made coverings in porcelain, gold, acrylic resin, or mixed
            materials to protect damaged teeth.
          </p>
        </SectionCard>
        <SectionCard title="Bridges">
          <p>
            Fixed bridges, Maryland bridges, and cantilever bridges to replace
            missing teeth and restore your smile.
          </p>
        </SectionCard>
        <SectionCard title="Root Canals">
          <p>
            Save infected teeth with root canal therapy, typically completed in
            just one visit.
          </p>
        </SectionCard>
        <SectionCard title="Extractions">
          <p>
            When necessary for severe decay, trauma, gum disease, or impaction,
            we provide gentle tooth extractions.
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: EARLY DENTAL TREATMENT                                       */
/* ------------------------------------------------------------------ */

function EarlyDentalTreatmentPage() {
  return (
    <PageShell
      title="Early Dental Treatment"
      subtitle="Setting the foundation for a lifetime of healthy smiles"
      accent
    >
      <Prose>
        <p>
          We recommend a child&apos;s first dental visit around their first
          birthday. Early dental care establishes good habits and helps us catch
          potential problems before they become serious.
        </p>
      </Prose>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Teething (6-12 months)">
          <p>
            Guidance on teething symptoms, soothing techniques, and when to be
            concerned about your baby&apos;s emerging teeth.
          </p>
        </SectionCard>
        <SectionCard title="Baby Bottle Tooth Decay">
          <p>
            Prevention tips for decay caused by prolonged bottle feeding. Never
            put a baby to bed with a bottle of milk, juice, or sweetened liquid.
          </p>
        </SectionCard>
        <SectionCard title="Primary Teeth">
          <p>
            Baby teeth are important for chewing, speaking, and holding space
            for permanent teeth. Proper care prevents premature loss.
          </p>
        </SectionCard>
        <SectionCard title="Space Maintainers">
          <p>
            If a baby tooth is lost early, space maintainers keep the area open
            for the permanent tooth to grow in properly.
          </p>
        </SectionCard>
        <SectionCard title="Diet & Healthy Teeth">
          <p>
            Nutritional guidance for growing teeth. Limit sugary snacks and
            drinks, encourage water and calcium-rich foods.
          </p>
        </SectionCard>
        <SectionCard title="Child's First Visit">
          <p>
            A gentle, fun introduction to the dental office. We make kids feel
            comfortable and excited about dental care.
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: COSMETIC DENTISTRY                                           */
/* ------------------------------------------------------------------ */

function CosmeticDentistryPage() {
  return (
    <PageShell
      title="Cosmetic Dentistry"
      subtitle="Our passion is making your smile the best it can be"
      accent
    >
      <Prose>
        <p>
          At Frazier Dentistry, our passion is making our patients&apos; smiles
          the best and brightest they can be! We offer a range of cosmetic
          dental procedures to enhance the appearance of your smile.
        </p>
      </Prose>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Teeth Whitening">
          <p>
            Professional whitening using light-activated gels and take-home
            trays. Prescription-level whitening for dramatically brighter
            results compared to over-the-counter products.
          </p>
        </SectionCard>
        <SectionCard title="Porcelain Veneers">
          <p>
            Thin porcelain shells bonded to the front of teeth to correct
            spaces, chips, stains, and crooked teeth. Custom-crafted for a
            natural, beautiful appearance.
          </p>
        </SectionCard>
        <SectionCard title="Dental Implants">
          <p>
            Permanent tooth replacement that looks, feels, and functions like
            natural teeth. Options include single tooth, anterior, posterior,
            and full upper replacement (All-On-4).
          </p>
        </SectionCard>
        <SectionCard title="Composite Bonding">
          <p>
            A quick, conservative, and affordable way to repair chipped,
            cracked, or discolored teeth. Natural-looking results with minimal
            tooth preparation.
          </p>
        </SectionCard>
      </div>

      <div
        className="mt-8 rounded-xl p-6 text-center"
        style={{ backgroundColor: COLORS.cream }}
      >
        <p className="text-lg font-bold" style={{ color: COLORS.brown }}>
          Ready to transform your smile?
        </p>
        <p className="text-sm" style={{ color: "#5a5550" }}>
          Schedule a cosmetic consultation to discuss your options.
        </p>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: SAME-DAY CAD-CAM CROWNS                                      */
/* ------------------------------------------------------------------ */

const crownSteps = [
  {
    num: "1",
    title: "Digital Scan",
    desc: "We take a precise 3-D digital image of your teeth — no messy impressions needed.",
  },
  {
    num: "2",
    title: "Computer Design",
    desc: "CAD software designs your custom crown with exact specifications for a perfect fit.",
  },
  {
    num: "3",
    title: "Milling",
    desc: "The crown is milled from a solid block of ceramic right in our office.",
  },
  {
    num: "4",
    title: "Bonding",
    desc: "Your new crown is polished and permanently bonded — all in the same appointment.",
  },
];

function SameDayCrownsPage() {
  return (
    <PageShell
      title="Same-Day CAD-CAM Ceramic Crowns"
      subtitle="A beautiful, custom crown in just one visit"
      accent
    >
      <Prose>
        <p>
          Using Computer-Aided Design and Computer-Aided Manufacturing (CAD-CAM)
          technology, we can create precise, custom ceramic crowns in a single
          visit — eliminating the need for temporary crowns and multiple
          appointments.
        </p>
      </Prose>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {crownSteps.map((step) => (
          <div key={step.num} className="text-center">
            <div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: COLORS.copper }}
            >
              {step.num}
            </div>
            <h3 className="mb-1 font-bold" style={{ color: COLORS.brown }}>
              {step.title}
            </h3>
            <p className="text-sm" style={{ color: "#5a5550" }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Prose>
          <p>
            The cost of same-day crowns depends on the type of restoration,
            material chosen, cosmetic requirements, and your insurance coverage.
            We&apos;ll provide a clear estimate before proceeding with
            treatment.
          </p>
        </Prose>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: LASER DENTAL TREATMENT                                       */
/* ------------------------------------------------------------------ */

function LaserTreatmentPage() {
  return (
    <PageShell
      title="Laser Dental Treatment"
      subtitle="Advanced technology for gentler, faster procedures"
      accent
    >
      <Prose>
        <p>
          Frazier Dentistry uses state-of-the-art Biolase Waterlase MD and Epic
          Diode lasers for both hard and soft tissue procedures. Laser dentistry
          offers significant advantages over traditional methods.
        </p>
      </Prose>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Benefits of Laser Dentistry">
          <ul className="space-y-2">
            {[
              "Less bleeding during and after procedures",
              "Reduced swelling and discomfort",
              "Faster healing times",
              "Often eliminates need for anesthesia",
              "More precise tissue treatment",
              "Reduced risk of infection",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: COLORS.copper }}
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Procedures">
          <ul className="space-y-2">
            {[
              "Wisdom teeth procedures",
              "Lip pulls and frenectomies",
              "Biopsies",
              "Crown lengthening",
              "Implant therapy preparation",
              "Root canal disinfection",
              "Gum disease treatment",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: COLORS.copper }}
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: MISCELLANEOUS HUB                                            */
/* ------------------------------------------------------------------ */

function MiscellaneousPage({ setPage }: { setPage: SetPage }) {
  return (
    <PageShell title="Miscellaneous" accent>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => setPage("miscellaneous/related-links")}
          className="flex items-start gap-4 rounded-xl border p-5 text-left transition-shadow hover:shadow-md"
          style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
        >
          <ExternalLink
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: COLORS.copper }}
          />
          <div>
            <h3 className="font-bold" style={{ color: COLORS.brown }}>
              Related Links
            </h3>
            <p className="text-sm" style={{ color: "#5a5550" }}>
              Helpful dental and health resources
            </p>
          </div>
        </button>
        <button
          onClick={() => setPage("miscellaneous/glossary")}
          className="flex items-start gap-4 rounded-xl border p-5 text-left transition-shadow hover:shadow-md"
          style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
        >
          <BookOpen
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: COLORS.copper }}
          />
          <div>
            <h3 className="font-bold" style={{ color: COLORS.brown }}>
              Glossary
            </h3>
            <p className="text-sm" style={{ color: "#5a5550" }}>
              Dental terminology explained
            </p>
          </div>
        </button>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: RELATED LINKS                                                */
/* ------------------------------------------------------------------ */

const relatedLinks = [
  { name: "American Dental Association", url: "https://www.ada.org" },
  { name: "Texas Dental Association", url: "https://www.tda.org" },
  { name: "Academy of General Dentistry", url: "https://www.agd.org" },
  { name: "World Clinical Laser Institute", url: "https://www.wcli.org" },
  { name: "MouthHealthy.org (ADA)", url: "https://www.mouthhealthy.org" },
  { name: "Capital Area Dental Society", url: "#" },
];

function RelatedLinksPage() {
  return (
    <PageShell
      title="Related Links"
      subtitle="Helpful dental and health resources"
      accent
    >
      <div className="space-y-3">
        {relatedLinks.map((link) => (
          <div
            key={link.name}
            className="flex items-center gap-3 rounded-xl border p-4"
            style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
          >
            <ExternalLink
              className="h-4 w-4 shrink-0"
              style={{ color: COLORS.copper }}
            />
            <span className="font-medium" style={{ color: COLORS.brown }}>
              {link.name}
            </span>
            <span className="ml-auto text-xs" style={{ color: "#938275" }}>
              {link.url}
            </span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: GLOSSARY                                                     */
/* ------------------------------------------------------------------ */

const glossaryTerms = [
  {
    term: "Amalgam",
    def: "A silver-colored filling material made from a mixture of metals including mercury, silver, tin, and copper.",
  },
  {
    term: "Bonding",
    def: "A tooth-colored composite resin applied to teeth to repair chips, gaps, or discoloration.",
  },
  {
    term: "Bridge",
    def: "A fixed dental restoration used to replace one or more missing teeth by anchoring to adjacent teeth.",
  },
  {
    term: "CAD-CAM",
    def: "Computer-Aided Design / Computer-Aided Manufacturing — technology used to create same-day ceramic crowns.",
  },
  {
    term: "Crown",
    def: "A cap placed over a damaged tooth to restore its shape, size, strength, and appearance.",
  },
  {
    term: "Extraction",
    def: "The removal of a tooth from its socket in the bone.",
  },
  {
    term: "Fluoride",
    def: "A mineral that helps prevent tooth decay by making enamel more resistant to acid.",
  },
  {
    term: "Gingivitis",
    def: "Early-stage gum disease characterized by red, swollen gums that may bleed easily.",
  },
  {
    term: "Implant",
    def: "A titanium post surgically placed in the jawbone to serve as a foundation for replacement teeth.",
  },
  {
    term: "Periodontal",
    def: "Relating to the structures that surround and support the teeth (gums, bone, ligaments).",
  },
  {
    term: "Root Canal",
    def: "A procedure to remove infected tissue from inside a tooth, preserving the natural tooth structure.",
  },
  {
    term: "Veneer",
    def: "A thin shell of porcelain bonded to the front of a tooth to improve its appearance.",
  },
];

function GlossaryPage() {
  return (
    <PageShell
      title="Dental Glossary"
      subtitle="Common dental terms explained"
      accent
    >
      <div className="space-y-3">
        {glossaryTerms.map((t) => (
          <div
            key={t.term}
            className="rounded-xl border p-4"
            style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
          >
            <h3 className="mb-1 font-bold" style={{ color: COLORS.copper }}>
              {t.term}
            </h3>
            <p className="text-sm" style={{ color: "#5a5550" }}>
              {t.def}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE: CONTACT US                                                   */
/* ------------------------------------------------------------------ */

function ContactUsPage() {
  return (
    <PageShell title="Contact Us" subtitle="We'd love to hear from you" accent>
      <div className="grid gap-8 sm:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <MapPin
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: COLORS.brown }}>
                Address
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                7333 E. US Hwy. 290
                <br />
                Austin, TX 78723
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: COLORS.brown }}>
                Phone
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                (512) 453-3879
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Printer
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: COLORS.brown }}>
                Fax
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                512-452-6795
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: COLORS.brown }}>
                Email
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                contactus@drkarlafrazier.com
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: COLORS.brown }}>
                Office Hours
              </p>
              <div className="text-sm" style={{ color: "#5a5550" }}>
                <p>Monday: 8:00am - 4:00pm</p>
                <p>Tuesday: 8:00am - 4:00pm</p>
                <p>Wednesday: 8:00am - 5:00pm</p>
                <p>Thursday: 8:00am - 4:00pm</p>
                <p>Friday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          className="space-y-4 rounded-xl border p-6"
          style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
        >
          <h3 className="font-bold" style={{ color: COLORS.brown }}>
            Send Us a Message
          </h3>
          {[
            { label: "Name", type: "text", placeholder: "Your name" },
            { label: "Email", type: "email", placeholder: "your@email.com" },
            { label: "Phone", type: "tel", placeholder: "(512) 000-0000" },
          ].map((field) => (
            <div key={field.label}>
              <label
                className="mb-1 block text-sm font-medium"
                style={{ color: COLORS.brown }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{
                  borderColor: COLORS.beige,
                  color: COLORS.brown,
                }}
              />
            </div>
          ))}
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: COLORS.brown }}
            >
              Message
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.beige,
                color: COLORS.brown,
              }}
              placeholder="How can we help?"
            />
          </div>
          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLORS.copper }}
          >
            Send Message
          </button>
        </div>
      </div>
    </PageShell>
  );
}

/* ================================================================== */
/*  MAIN EXPORTED COMPONENT                                            */
/* ================================================================== */

export function FrazierDentistryDemo({
  backHref,
  basePath,
}: {
  backHref?: string;
  basePath?: string;
}) {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const setPage = (page: string) => {
    setCurrentPage(page);
    setMobileOpen(false);
    setMobileExpanded(null);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setPage={setPage} />;
      case "office":
        return <OfficePage setPage={setPage} />;
      case "office/meet-dr-frazier":
        return <MeetDrFrazierPage />;
      case "office/meet-our-team":
        return <MeetOurTeamPage />;
      case "office/financial":
        return <FinancialPage />;
      case "office/map-directions":
        return <MapDirectionsPage />;
      case "office/appointment-request":
        return <AppointmentRequestPage />;
      case "office/feedback":
        return <FeedbackPage />;
      case "office/our-blog":
        return <BlogPage setPage={setPage} />;
      case "office/our-blog/welcome-to-our-blog":
        return <WelcomeBlogPostPage />;
      case "office/our-blog/dental-implants":
        return <DentalImplantsBlogPostPage />;
      case "patient":
        return <PatientPage setPage={setPage} />;
      case "patient/first-visit":
        return <FirstVisitPage />;
      case "patient/faq":
        return <FaqPage />;
      case "patient/patient-forms":
        return <PatientFormsPage />;
      case "patient/common-problems":
        return <CommonProblemsPage />;
      case "patient/emergencies":
        return <EmergenciesPage />;
      case "patient/prevention":
        return <PreventionPage />;
      case "treatment":
        return <TreatmentPage setPage={setPage} />;
      case "treatment/general-treatment":
        return <GeneralTreatmentPage />;
      case "treatment/early-dental-treatment":
        return <EarlyDentalTreatmentPage />;
      case "treatment/cosmetic-dentistry":
        return <CosmeticDentistryPage />;
      case "treatment/same-day-cad-cam-ceramic-crowns":
        return <SameDayCrownsPage />;
      case "treatment/laser-dental-treatment":
        return <LaserTreatmentPage />;
      case "miscellaneous":
        return <MiscellaneousPage setPage={setPage} />;
      case "miscellaneous/related-links":
        return <RelatedLinksPage />;
      case "miscellaneous/glossary":
        return <GlossaryPage />;
      case "contact-us":
        return <ContactUsPage />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.white,
        fontFamily: "'Cabin', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,700;1,400;1,700&family=Lobster+Two:wght@700&display=swap');
      `}</style>

      {/* Back to Demos sliver */}
      {backHref && (
        <div
          className="border-b px-4 py-1.5 sm:px-6"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)", background: "#000" }}
        >
          <div className="mx-auto max-w-7xl">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Demos
            </Link>
          </div>
        </div>
      )}

      {/* Top Bar — contact info */}
      <div
        style={{ backgroundColor: COLORS.brown }}
        className="px-4 py-2 text-xs text-white/80 sm:px-6"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> (512) 453-3879
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <Mail className="h-3 w-3" /> contactus@drkarlafrazier.com
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Mon-Thu 8am-4pm · Wed til 5pm
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <header
        className="sticky top-0 z-50 border-b shadow-sm"
        style={{ backgroundColor: COLORS.cream, borderColor: COLORS.beige }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => setPage("home")}
              className="flex shrink-0 items-center"
            >
              <Image
                src="/frazier-dentistry/frazier-dentistry-logo.png"
                alt="Frazier Dentistry"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </button>

            {/* Desktop Nav */}
            <nav className="hidden items-center lg:flex">
              {NAV_ITEMS.map((item) => (
                <DesktopDropdown
                  key={item.name}
                  item={item}
                  currentPage={currentPage}
                  setPage={setPage}
                />
              ))}
              <button
                onClick={() => setPage("office/appointment-request")}
                className="ml-3 rounded-md px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: COLORS.copper }}
              >
                Book Appointment
              </button>
            </nav>

            {/* Mobile toggle */}
            <button
              type="button"
              className="rounded-md p-3 lg:hidden"
              style={{ color: COLORS.brown }}
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <div
              className="border-t pt-2 pb-4 lg:hidden"
              style={{ borderColor: COLORS.beige }}
            >
              {NAV_ITEMS.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        if (!item.children) {
                          setPage(item.page);
                        } else {
                          setPage(item.page);
                        }
                      }}
                      className="flex-1 px-3 py-3 text-left text-sm font-medium"
                      style={{ color: COLORS.brown }}
                    >
                      {item.name}
                    </button>
                    {item.children && (
                      <button
                        className="px-3 py-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileExpanded(
                            mobileExpanded === item.name ? null : item.name
                          );
                        }}
                      >
                        <ChevronDown
                          className="h-4 w-4 transition-transform"
                          style={{
                            color: COLORS.medBrown,
                            transform:
                              mobileExpanded === item.name
                                ? "rotate(180deg)"
                                : undefined,
                          }}
                        />
                      </button>
                    )}
                  </div>
                  {item.children && mobileExpanded === item.name && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <button
                          key={child.page}
                          onClick={() => setPage(child.page)}
                          className="block w-full px-3 py-2.5 text-left text-sm"
                          style={{ color: COLORS.medBrown }}
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => setPage("office/appointment-request")}
                className="mt-2 block w-full rounded-md px-3 py-2 text-center text-sm font-bold text-white"
                style={{ backgroundColor: COLORS.copper }}
              >
                Book Appointment
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main>{renderPage()}</main>

      {/* Footer */}
      <footer
        style={{ backgroundColor: COLORS.brown }}
        className="px-4 py-12 text-white/80 sm:px-6"
      >
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">
              Frazier Dentistry
            </h3>
            <p className="text-xs leading-relaxed">
              7333 E. US Hwy. 290
              <br />
              Austin, TX 78723
              <br />
              (512) 453-3879
              <br />
              contactus@drkarlafrazier.com
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Office Hours</h3>
            <p className="text-xs leading-relaxed">
              Monday: 8:00am - 4:00pm
              <br />
              Tuesday: 8:00am - 4:00pm
              <br />
              Wednesday: 8:00am - 5:00pm
              <br />
              Thursday: 8:00am - 4:00pm
              <br />
              Friday: Closed
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Quick Links</h3>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => setPage("office/appointment-request")}
                className="text-left transition-colors hover:text-white"
              >
                Appointment Request
              </button>
              <button
                onClick={() => setPage("patient/patient-forms")}
                className="text-left transition-colors hover:text-white"
              >
                Patient Forms
              </button>
              <button
                onClick={() => setPage("patient/first-visit")}
                className="text-left transition-colors hover:text-white"
              >
                First Visit
              </button>
              <button
                onClick={() => setPage("office/financial")}
                className="text-left transition-colors hover:text-white"
              >
                Financial Information
              </button>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Services</h3>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => setPage("treatment/general-treatment")}
                className="text-left transition-colors hover:text-white"
              >
                General Dentistry
              </button>
              <button
                onClick={() => setPage("treatment/cosmetic-dentistry")}
                className="text-left transition-colors hover:text-white"
              >
                Cosmetic Dentistry
              </button>
              <button
                onClick={() => setPage("treatment/laser-dental-treatment")}
                className="text-left transition-colors hover:text-white"
              >
                Laser Treatment
              </button>
              <button
                onClick={() =>
                  setPage("treatment/same-day-cad-cam-ceramic-crowns")
                }
                className="text-left transition-colors hover:text-white"
              >
                Same-Day Crowns
              </button>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-white/50">
          &copy; {new Date().getFullYear()} Frazier Dentistry. All rights
          reserved. · Demo by Miracle Mind
        </div>
      </footer>
    </div>
  );
}
