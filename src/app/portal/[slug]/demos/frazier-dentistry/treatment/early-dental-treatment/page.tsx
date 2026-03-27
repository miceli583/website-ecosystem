"use client";

import {
  FrazierPageShell,
  Prose,
  SectionCard,
} from "~/components/demos/frazier-page-shell";

export default function EarlyDentalTreatmentPage() {
  return (
    <FrazierPageShell
      title="Early Dental Treatment"
      subtitle="Setting the foundation for a lifetime of healthy smiles"
      accent
    >
      <Prose>
        <p>
          We recommend a child&apos;s first dental visit around their first
          birthday. Early dental care establishes good habits and helps us catch
          potential problems before they become serious.
        </p>
      </Prose>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Teething (6-12 months)">
          <p>
            Guidance on teething symptoms, soothing techniques, and when to be
            concerned about your baby&apos;s emerging teeth.
          </p>
        </SectionCard>
        <SectionCard title="Baby Bottle Tooth Decay">
          <p>
            Prevention tips for decay caused by prolonged bottle feeding. Never
            put a baby to bed with a bottle of milk, juice, or sweetened liquid.
          </p>
        </SectionCard>
        <SectionCard title="Primary Teeth">
          <p>
            Baby teeth are important for chewing, speaking, and holding space
            for permanent teeth. Proper care prevents premature loss.
          </p>
        </SectionCard>
        <SectionCard title="Space Maintainers">
          <p>
            If a baby tooth is lost early, space maintainers keep the area open
            for the permanent tooth to grow in properly.
          </p>
        </SectionCard>
        <SectionCard title="Diet & Healthy Teeth">
          <p>
            Nutritional guidance for growing teeth. Limit sugary snacks and
            drinks, encourage water and calcium-rich foods.
          </p>
        </SectionCard>
        <SectionCard title="Child's First Visit">
          <p>
            A gentle, fun introduction to the dental office. We make kids feel
            comfortable and excited about dental care.
          </p>
        </SectionCard>
      </div>
    </FrazierPageShell>
  );
}
