"use client";

import {
  FrazierPageShell,
  Prose,
  SectionCard,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

export default function CosmeticDentistryPage() {
  return (
    <FrazierPageShell
      title="Cosmetic Dentistry"
      subtitle="Our passion is making your smile the best it can be"
      accent
    >
      <Prose>
        <p>
          At Frazier Dentistry, our passion is making our patients&apos; smiles
          the best and brightest they can be! We offer a range of cosmetic
          dental procedures to enhance the appearance of your smile.
        </p>
      </Prose>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Teeth Whitening">
          <p>
            Professional whitening using light-activated gels and take-home
            trays. Prescription-level whitening for dramatically brighter
            results compared to over-the-counter products.
          </p>
        </SectionCard>
        <SectionCard title="Porcelain Veneers">
          <p>
            Thin porcelain shells bonded to the front of teeth to correct
            spaces, chips, stains, and crooked teeth. Custom-crafted for a
            natural, beautiful appearance.
          </p>
        </SectionCard>
        <SectionCard title="Dental Implants">
          <p>
            Permanent tooth replacement that looks, feels, and functions like
            natural teeth. Options include single tooth, anterior, posterior,
            and full upper replacement (All-On-4).
          </p>
        </SectionCard>
        <SectionCard title="Composite Bonding">
          <p>
            A quick, conservative, and affordable way to repair chipped,
            cracked, or discolored teeth. Natural-looking results with minimal
            tooth preparation.
          </p>
        </SectionCard>
      </div>

      <div
        className="mt-8 rounded-xl p-6 text-center"
        style={{ backgroundColor: FRAZIER_COLORS.cream }}
      >
        <p
          className="text-lg font-bold"
          style={{ color: FRAZIER_COLORS.brown }}
        >
          Ready to transform your smile?
        </p>
        <p className="text-sm" style={{ color: "#5a5550" }}>
          Schedule a cosmetic consultation to discuss your options.
        </p>
      </div>
    </FrazierPageShell>
  );
}
