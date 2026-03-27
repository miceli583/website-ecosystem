"use client";

import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

export default function AppointmentRequestPage() {
  return (
    <FrazierPageShell
      title="Appointment Request"
      subtitle="We'll get back to you within one business day"
      accent
    >
      <div className="mx-auto max-w-lg">
        <div
          className="space-y-4 rounded-xl border p-6"
          style={{ borderColor: FRAZIER_COLORS.beige, backgroundColor: "#fff" }}
        >
          {[
            { label: "Full Name", type: "text", placeholder: "Jane Doe" },
            { label: "Email", type: "email", placeholder: "jane@example.com" },
            { label: "Phone", type: "tel", placeholder: "(512) 000-0000" },
            { label: "Preferred Date", type: "date", placeholder: "" },
          ].map((field) => (
            <div key={field.label}>
              <label
                className="mb-1 block text-sm font-medium"
                style={{ color: FRAZIER_COLORS.brown }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: FRAZIER_COLORS.beige,
                  color: FRAZIER_COLORS.brown,
                }}
              />
            </div>
          ))}
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: FRAZIER_COLORS.brown }}
            >
              Reason for Visit
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: FRAZIER_COLORS.beige,
                color: FRAZIER_COLORS.brown,
              }}
            >
              <option>General Checkup</option>
              <option>Teeth Cleaning</option>
              <option>Cosmetic Consultation</option>
              <option>Emergency</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: FRAZIER_COLORS.brown }}
            >
              Additional Notes
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: FRAZIER_COLORS.beige,
                color: FRAZIER_COLORS.brown,
              }}
              placeholder="Anything we should know..."
            />
          </div>
          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: FRAZIER_COLORS.copper }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </FrazierPageShell>
  );
}
