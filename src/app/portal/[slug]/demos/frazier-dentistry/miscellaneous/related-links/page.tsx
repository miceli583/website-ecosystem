"use client";

import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { ExternalLink } from "lucide-react";

const links = [
  { name: "American Dental Association", url: "https://www.ada.org" },
  { name: "Texas Dental Association", url: "https://www.tda.org" },
  { name: "Academy of General Dentistry", url: "https://www.agd.org" },
  { name: "World Clinical Laser Institute", url: "https://www.wcli.org" },
  { name: "MouthHealthy.org (ADA)", url: "https://www.mouthhealthy.org" },
  { name: "Capital Area Dental Society", url: "#" },
];

export default function RelatedLinksPage() {
  return (
    <FrazierPageShell
      title="Related Links"
      subtitle="Helpful dental and health resources"
      accent
    >
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.name}
            className="flex items-center gap-3 rounded-xl border p-4"
            style={{
              borderColor: FRAZIER_COLORS.beige,
              backgroundColor: "#fff",
            }}
          >
            <ExternalLink
              className="h-4 w-4 shrink-0"
              style={{ color: FRAZIER_COLORS.copper }}
            />
            <span
              className="font-medium"
              style={{ color: FRAZIER_COLORS.brown }}
            >
              {link.name}
            </span>
            <span className="ml-auto text-xs" style={{ color: "#938275" }}>
              {link.url}
            </span>
          </div>
        ))}
      </div>
    </FrazierPageShell>
  );
}
