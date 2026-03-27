"use client";

import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function MapDirectionsPage() {
  return (
    <FrazierPageShell title="Map & Directions" accent>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: FRAZIER_COLORS.copper }}
              />
              <div>
                <p
                  className="font-bold"
                  style={{ color: FRAZIER_COLORS.brown }}
                >
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
                <p
                  className="font-bold"
                  style={{ color: FRAZIER_COLORS.brown }}
                >
                  Phone
                </p>
                <p className="text-sm" style={{ color: "#5a5550" }}>
                  (512) 453-3879
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: FRAZIER_COLORS.copper }}
              />
              <div>
                <p
                  className="font-bold"
                  style={{ color: FRAZIER_COLORS.brown }}
                >
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
                <p
                  className="font-bold"
                  style={{ color: FRAZIER_COLORS.brown }}
                >
                  Office Hours
                </p>
                <div className="text-sm" style={{ color: "#5a5550" }}>
                  <p>Mon: 8:00am - 4:00pm</p>
                  <p>Tue: 8:00am - 4:00pm</p>
                  <p>Wed: 8:00am - 5:00pm</p>
                  <p>Thu: 8:00am - 4:00pm</p>
                  <p>Fri: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex h-64 items-center justify-center rounded-xl border sm:h-auto"
          style={{
            borderColor: FRAZIER_COLORS.beige,
            backgroundColor: FRAZIER_COLORS.cream,
          }}
        >
          <div className="text-center">
            <MapPin
              className="mx-auto mb-2 h-8 w-8"
              style={{ color: FRAZIER_COLORS.copper }}
            />
            <p className="text-sm" style={{ color: "#5a5550" }}>
              Map placeholder
            </p>
            <p className="text-xs" style={{ color: "#938275" }}>
              Interactive map would go here
            </p>
          </div>
        </div>
      </div>
    </FrazierPageShell>
  );
}
