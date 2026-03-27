"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  ChevronDown,
} from "lucide-react";

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

interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

function buildNav(base: string): NavItem[] {
  return [
    { name: "Home", href: base },
    {
      name: "Office",
      href: `${base}/office`,
      children: [
        { name: "Meet Dr. Frazier", href: `${base}/office/meet-dr-frazier` },
        { name: "Meet Our Team", href: `${base}/office/meet-our-team` },
        { name: "Financial", href: `${base}/office/financial` },
        { name: "Map & Directions", href: `${base}/office/map-directions` },
        {
          name: "Appointment Request",
          href: `${base}/office/appointment-request`,
        },
        { name: "Feedback", href: `${base}/office/feedback` },
        { name: "Our Blog", href: `${base}/office/our-blog` },
      ],
    },
    {
      name: "Patient",
      href: `${base}/patient`,
      children: [
        { name: "First Visit", href: `${base}/patient/first-visit` },
        { name: "FAQ", href: `${base}/patient/faq` },
        { name: "Patient Forms", href: `${base}/patient/patient-forms` },
        { name: "Common Problems", href: `${base}/patient/common-problems` },
        { name: "Emergencies", href: `${base}/patient/emergencies` },
        { name: "Prevention", href: `${base}/patient/prevention` },
      ],
    },
    {
      name: "Treatment",
      href: `${base}/treatment`,
      children: [
        {
          name: "General Treatment",
          href: `${base}/treatment/general-treatment`,
        },
        {
          name: "Early Dental Treatment",
          href: `${base}/treatment/early-dental-treatment`,
        },
        {
          name: "Cosmetic Dentistry",
          href: `${base}/treatment/cosmetic-dentistry`,
        },
        {
          name: "Same-Day CAD-CAM Crowns",
          href: `${base}/treatment/same-day-cad-cam-ceramic-crowns`,
        },
        {
          name: "Laser Treatment",
          href: `${base}/treatment/laser-dental-treatment`,
        },
      ],
    },
    {
      name: "Miscellaneous",
      href: `${base}/miscellaneous`,
      children: [
        { name: "Related Links", href: `${base}/miscellaneous/related-links` },
        { name: "Glossary", href: `${base}/miscellaneous/glossary` },
      ],
    },
    { name: "Contact Us", href: `${base}/contact-us` },
  ];
}

function DesktopDropdown({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  if (!item.children) {
    return (
      <Link
        href={item.href}
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
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors"
        style={{ color: isActive ? COLORS.copper : COLORS.brown }}
      >
        {item.name}
        <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div
          className="absolute top-full left-0 z-50 min-w-[220px] rounded-md border py-1 shadow-lg"
          style={{ backgroundColor: COLORS.white, borderColor: COLORS.beige }}
        >
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2 text-sm transition-colors"
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FrazierDentistryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const baseUrl = `/portal/${slug}/demos/frazier-dentistry`;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const nav = buildNav(baseUrl);

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
      <div
        className="border-b px-4 py-1.5 sm:px-6"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)", background: "#000" }}
      >
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/portal/${slug}/demos`}
            className="inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Demos
          </Link>
        </div>
      </div>

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
            <Link href={baseUrl} className="flex shrink-0 items-center">
              <Image
                src="/frazier-dentistry/frazier-dentistry-logo.png"
                alt="Frazier Dentistry"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center lg:flex">
              {nav.map((item) => (
                <DesktopDropdown
                  key={item.name}
                  item={item}
                  pathname={pathname}
                />
              ))}
              <Link
                href={`${baseUrl}/office/appointment-request`}
                className="ml-3 rounded-md px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: COLORS.copper }}
              >
                Book Appointment
              </Link>
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
              {nav.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className="flex-1 px-3 py-3 text-sm font-medium"
                      style={{ color: COLORS.brown }}
                      onClick={() => !item.children && setMobileOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <button
                        className="px-3 py-3"
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === item.name ? null : item.name
                          )
                        }
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
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2.5 text-sm"
                          style={{ color: COLORS.medBrown }}
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href={`${baseUrl}/office/appointment-request`}
                className="mt-2 block rounded-md px-3 py-2 text-center text-sm font-bold text-white"
                style={{ backgroundColor: COLORS.copper }}
                onClick={() => setMobileOpen(false)}
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>

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
              <Link
                href={`${baseUrl}/office/appointment-request`}
                className="transition-colors hover:text-white"
              >
                Appointment Request
              </Link>
              <Link
                href={`${baseUrl}/patient/patient-forms`}
                className="transition-colors hover:text-white"
              >
                Patient Forms
              </Link>
              <Link
                href={`${baseUrl}/patient/first-visit`}
                className="transition-colors hover:text-white"
              >
                First Visit
              </Link>
              <Link
                href={`${baseUrl}/office/financial`}
                className="transition-colors hover:text-white"
              >
                Financial Information
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Services</h3>
            <div className="flex flex-col gap-1 text-xs">
              <Link
                href={`${baseUrl}/treatment/general-treatment`}
                className="transition-colors hover:text-white"
              >
                General Dentistry
              </Link>
              <Link
                href={`${baseUrl}/treatment/cosmetic-dentistry`}
                className="transition-colors hover:text-white"
              >
                Cosmetic Dentistry
              </Link>
              <Link
                href={`${baseUrl}/treatment/laser-dental-treatment`}
                className="transition-colors hover:text-white"
              >
                Laser Treatment
              </Link>
              <Link
                href={`${baseUrl}/treatment/same-day-cad-cam-ceramic-crowns`}
                className="transition-colors hover:text-white"
              >
                Same-Day Crowns
              </Link>
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
