"use client";

import { use } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  MapPin,
  Calendar,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

const links = [
  {
    icon: Users,
    title: "Meet Dr. Frazier",
    desc: "Learn about our lead dentist",
    href: "meet-dr-frazier",
  },
  {
    icon: Users,
    title: "Meet Our Team",
    desc: "Our friendly, skilled staff",
    href: "meet-our-team",
  },
  {
    icon: DollarSign,
    title: "Financial",
    desc: "Insurance and payment options",
    href: "financial",
  },
  {
    icon: MapPin,
    title: "Map & Directions",
    desc: "Find us in Austin",
    href: "map-directions",
  },
  {
    icon: Calendar,
    title: "Appointment Request",
    desc: "Schedule your visit",
    href: "appointment-request",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    desc: "Share your experience",
    href: "feedback",
  },
  {
    icon: BookOpen,
    title: "Our Blog",
    desc: "Tips and dental news",
    href: "our-blog",
  },
];

export default function OfficePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const base = `/portal/${slug}/demos/frazier-dentistry/office`;

  return (
    <FrazierPageShell
      title="Our Office"
      subtitle="Everything you need to know about Frazier Dentistry"
      accent
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={`${base}/${item.href}`}
            className="flex items-start gap-4 rounded-xl border p-5 transition-shadow hover:shadow-md"
            style={{
              borderColor: FRAZIER_COLORS.beige,
              backgroundColor: "#fff",
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${FRAZIER_COLORS.cream}` }}
            >
              <item.icon
                className="h-5 w-5"
                style={{ color: FRAZIER_COLORS.copper }}
              />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </FrazierPageShell>
  );
}
