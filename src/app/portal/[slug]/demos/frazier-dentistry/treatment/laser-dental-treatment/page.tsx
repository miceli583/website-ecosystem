"use client";

import {
  FrazierPageShell,
  Prose,
  SectionCard,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { CheckCircle2 } from "lucide-react";

export default function LaserTreatmentPage() {
  return (
    <FrazierPageShell
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
                  style={{ color: FRAZIER_COLORS.copper }}
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
                  style={{ color: FRAZIER_COLORS.copper }}
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </FrazierPageShell>
  );
}
