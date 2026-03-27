"use client";

import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { MapPin, Phone, Mail, Clock, Printer } from "lucide-react";

export default function ContactUsPage() {
  return (
    <FrazierPageShell
      title="Contact Us"
      subtitle="We'd love to hear from you"
      accent
    >
      <div className="grid gap-8 sm:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <MapPin
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: FRAZIER_COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
                Address
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                7333 E. US Hwy. 290
                <br />
                Austin, TX 78723
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: FRAZIER_COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
                Phone
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                (512) 453-3879
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Printer
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: FRAZIER_COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
                Fax
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                512-452-6795
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: FRAZIER_COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
                Email
              </p>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                contactus@drkarlafrazier.com
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: FRAZIER_COLORS.copper }}
            />
            <div>
              <p className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
                Office Hours
              </p>
              <div className="text-sm" style={{ color: "#5a5550" }}>
                <p>Monday: 8:00am - 4:00pm</p>
                <p>Tuesday: 8:00am - 4:00pm</p>
                <p>Wednesday: 8:00am - 5:00pm</p>
                <p>Thursday: 8:00am - 4:00pm</p>
                <p>Friday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          className="space-y-4 rounded-xl border p-6"
          style={{ borderColor: FRAZIER_COLORS.beige, backgroundColor: "#fff" }}
        >
          <h3 className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
            Send Us a Message
          </h3>
          {[
            { label: "Name", type: "text", placeholder: "Your name" },
            { label: "Email", type: "email", placeholder: "your@email.com" },
            { label: "Phone", type: "tel", placeholder: "(512) 000-0000" },
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
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
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
              Message
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: FRAZIER_COLORS.beige,
                color: FRAZIER_COLORS.brown,
              }}
              placeholder="How can we help?"
            />
          </div>
          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: FRAZIER_COLORS.copper }}
          >
            Send Message
          </button>
        </div>
      </div>
    </FrazierPageShell>
  );
}
