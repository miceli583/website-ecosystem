"use client";

import {
  FrazierPageShell,
  Prose,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

const steps = [
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

export default function SameDayCrownsPage() {
  return (
    <FrazierPageShell
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
        {steps.map((step) => (
          <div key={step.num} className="text-center">
            <div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: FRAZIER_COLORS.copper }}
            >
              {step.num}
            </div>
            <h3
              className="mb-1 font-bold"
              style={{ color: FRAZIER_COLORS.brown }}
            >
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
    </FrazierPageShell>
  );
}
