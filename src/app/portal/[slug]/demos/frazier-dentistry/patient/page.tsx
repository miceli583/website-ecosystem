"use client";

import { use } from "react";
import Link from "next/link";
import {
  ClipboardList,
  HelpCircle,
  FileText,
  AlertTriangle,
  Siren,
  ShieldCheck,
} from "lucide-react";
import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

const links = [
  {
    icon: ClipboardList,
    title: "First Visit",
    desc: "What to expect at your first appointment",
    href: "first-visit",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    desc: "Common questions answered",
    href: "faq",
  },
  {
    icon: FileText,
    title: "Patient Forms",
    desc: "Download and complete before your visit",
    href: "patient-forms",
  },
  {
    icon: AlertTriangle,
    title: "Common Problems",
    desc: "Dental issues and when to seek care",
    href: "common-problems",
  },
  {
    icon: Siren,
    title: "Emergencies",
    desc: "What to do in a dental emergency",
    href: "emergencies",
  },
  {
    icon: ShieldCheck,
    title: "Prevention",
    desc: "Tips to keep your smile healthy",
    href: "prevention",
  },
];

export default function PatientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const base = `/portal/${slug}/demos/frazier-dentistry/patient`;

  return (
    <FrazierPageShell
      title="Patient Information"
      subtitle="Resources to help you prepare for your visit"
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
              style={{ backgroundColor: FRAZIER_COLORS.cream }}
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
