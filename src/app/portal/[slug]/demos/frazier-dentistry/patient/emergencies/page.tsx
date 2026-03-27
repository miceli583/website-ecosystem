"use client";

import {
  FrazierPageShell,
  Prose,
  SectionCard,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { Phone } from "lucide-react";

export default function EmergenciesPage() {
  return (
    <FrazierPageShell title="Dental Emergencies" accent>
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
    </FrazierPageShell>
  );
}
