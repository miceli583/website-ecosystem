"use client";

import {
  FrazierPageShell,
  Prose,
  SectionCard,
} from "~/components/demos/frazier-page-shell";

export default function GeneralTreatmentPage() {
  return (
    <FrazierPageShell
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
    </FrazierPageShell>
  );
}
