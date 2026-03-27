"use client";

import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

const terms = [
  {
    term: "Amalgam",
    def: "A silver-colored filling material made from a mixture of metals including mercury, silver, tin, and copper.",
  },
  {
    term: "Bonding",
    def: "A tooth-colored composite resin applied to teeth to repair chips, gaps, or discoloration.",
  },
  {
    term: "Bridge",
    def: "A fixed dental restoration used to replace one or more missing teeth by anchoring to adjacent teeth.",
  },
  {
    term: "CAD-CAM",
    def: "Computer-Aided Design / Computer-Aided Manufacturing — technology used to create same-day ceramic crowns.",
  },
  {
    term: "Crown",
    def: "A cap placed over a damaged tooth to restore its shape, size, strength, and appearance.",
  },
  {
    term: "Extraction",
    def: "The removal of a tooth from its socket in the bone.",
  },
  {
    term: "Fluoride",
    def: "A mineral that helps prevent tooth decay by making enamel more resistant to acid.",
  },
  {
    term: "Gingivitis",
    def: "Early-stage gum disease characterized by red, swollen gums that may bleed easily.",
  },
  {
    term: "Implant",
    def: "A titanium post surgically placed in the jawbone to serve as a foundation for replacement teeth.",
  },
  {
    term: "Periodontal",
    def: "Relating to the structures that surround and support the teeth (gums, bone, ligaments).",
  },
  {
    term: "Root Canal",
    def: "A procedure to remove infected tissue from inside a tooth, preserving the natural tooth structure.",
  },
  {
    term: "Veneer",
    def: "A thin shell of porcelain bonded to the front of a tooth to improve its appearance.",
  },
];

export default function GlossaryPage() {
  return (
    <FrazierPageShell
      title="Dental Glossary"
      subtitle="Common dental terms explained"
      accent
    >
      <div className="space-y-3">
        {terms.map((t) => (
          <div
            key={t.term}
            className="rounded-xl border p-4"
            style={{
              borderColor: FRAZIER_COLORS.beige,
              backgroundColor: "#fff",
            }}
          >
            <h3
              className="mb-1 font-bold"
              style={{ color: FRAZIER_COLORS.copper }}
            >
              {t.term}
            </h3>
            <p className="text-sm" style={{ color: "#5a5550" }}>
              {t.def}
            </p>
          </div>
        ))}
      </div>
    </FrazierPageShell>
  );
}
