"use client";

import {
  FrazierPageShell,
  Prose,
  SectionCard,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { CheckCircle2 } from "lucide-react";

export default function FirstVisitPage() {
  return (
    <FrazierPageShell
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
                  style={{ color: FRAZIER_COLORS.copper }}
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
                  style={{ color: FRAZIER_COLORS.copper }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </FrazierPageShell>
  );
}
