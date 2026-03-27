"use client";

import {
  FrazierPageShell,
  Prose,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { FileText, Download } from "lucide-react";

const forms = [
  {
    name: "New Patient Registration",
    desc: "Complete before your first visit",
  },
  {
    name: "Medical History Form",
    desc: "Current medications, allergies, and conditions",
  },
  {
    name: "Insurance Information",
    desc: "Primary and secondary insurance details",
  },
  { name: "HIPAA Privacy Notice", desc: "Acknowledgment of privacy practices" },
];

export default function PatientFormsPage() {
  return (
    <FrazierPageShell
      title="Patient Forms"
      subtitle="Download and complete these forms before your visit to save time"
      accent
    >
      <Prose>
        <p>
          Please complete the following forms prior to your appointment. You may
          print them, fill them out at home, and bring them to your visit.
        </p>
      </Prose>
      <div className="mt-6 space-y-3">
        {forms.map((form) => (
          <div
            key={form.name}
            className="flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm"
            style={{
              borderColor: FRAZIER_COLORS.beige,
              backgroundColor: "#fff",
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: FRAZIER_COLORS.cream }}
            >
              <FileText
                className="h-5 w-5"
                style={{ color: FRAZIER_COLORS.copper }}
              />
            </div>
            <div className="flex-1">
              <p className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
                {form.name}
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {form.desc}
              </p>
            </div>
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white"
              style={{ backgroundColor: FRAZIER_COLORS.copper }}
            >
              <Download className="h-3 w-3" /> PDF
            </button>
          </div>
        ))}
      </div>
    </FrazierPageShell>
  );
}
