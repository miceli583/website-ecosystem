"use client";

import { use } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Baby,
  Sparkles,
  Crown,
  Zap,
  ArrowRight,
} from "lucide-react";
import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

const treatments = [
  {
    icon: Stethoscope,
    title: "General Treatment",
    desc: "Exams, cleanings, fillings, crowns, bridges, root canals, and extractions.",
    href: "general-treatment",
  },
  {
    icon: Baby,
    title: "Early Dental Treatment",
    desc: "Teething, baby bottle decay, space maintainers, and children's first visits.",
    href: "early-dental-treatment",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    desc: "Whitening, veneers, dental implants, and composite bonding.",
    href: "cosmetic-dentistry",
  },
  {
    icon: Crown,
    title: "Same-Day CAD-CAM Crowns",
    desc: "Computer-designed ceramic crowns completed in a single visit.",
    href: "same-day-cad-cam-ceramic-crowns",
  },
  {
    icon: Zap,
    title: "Laser Dental Treatment",
    desc: "Advanced Biolase laser procedures for hard and soft tissue.",
    href: "laser-dental-treatment",
  },
];

export default function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const base = `/portal/${slug}/demos/frazier-dentistry/treatment`;

  return (
    <FrazierPageShell
      title="Our Treatments"
      subtitle="Comprehensive care using the latest technology"
      accent
    >
      <div className="space-y-4">
        {treatments.map((t) => (
          <Link
            key={t.href}
            href={`${base}/${t.href}`}
            className="group flex items-center gap-5 rounded-xl border p-5 transition-shadow hover:shadow-md"
            style={{
              borderColor: FRAZIER_COLORS.beige,
              backgroundColor: "#fff",
            }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: FRAZIER_COLORS.cream }}
            >
              <t.icon
                className="h-6 w-6"
                style={{ color: FRAZIER_COLORS.copper }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
                {t.title}
              </h3>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {t.desc}
              </p>
            </div>
            <ArrowRight
              className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{ color: FRAZIER_COLORS.copper }}
            />
          </Link>
        ))}
      </div>
    </FrazierPageShell>
  );
}
