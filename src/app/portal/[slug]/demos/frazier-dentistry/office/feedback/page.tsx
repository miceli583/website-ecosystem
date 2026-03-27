"use client";

import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { Star } from "lucide-react";

export default function FeedbackPage() {
  return (
    <FrazierPageShell
      title="Feedback"
      subtitle="We value your opinion — help us improve your experience"
      accent
    >
      <div className="mx-auto max-w-lg">
        <div
          className="space-y-4 rounded-xl border p-6"
          style={{ borderColor: FRAZIER_COLORS.beige, backgroundColor: "#fff" }}
        >
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: FRAZIER_COLORS.brown }}
            >
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: FRAZIER_COLORS.beige }}
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: FRAZIER_COLORS.brown }}
            >
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className="h-8 w-8 cursor-pointer"
                  style={{
                    color:
                      n <= 4 ? FRAZIER_COLORS.copper : FRAZIER_COLORS.beige,
                  }}
                  fill={n <= 4 ? FRAZIER_COLORS.copper : "none"}
                />
              ))}
            </div>
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: FRAZIER_COLORS.brown }}
            >
              Comments
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: FRAZIER_COLORS.beige }}
              placeholder="Tell us about your experience..."
            />
          </div>
          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: FRAZIER_COLORS.copper }}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </FrazierPageShell>
  );
}
