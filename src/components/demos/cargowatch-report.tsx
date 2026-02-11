"use client";

/**
 * CargoWatch Report Incident Page Demo
 * Incident reporting form (display-only — no actual submission).
 * Uses static data, Lucide icons.
 */

import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Camera,
  Upload,
  CheckCircle,
} from "lucide-react";
import { REGIONS } from "~/lib/cargowatch-data";

const INCIDENT_TYPES = [
  { value: "theft", label: "Cargo Theft", desc: "Confirmed theft of cargo or trailer" },
  { value: "suspicious", label: "Suspicious Activity", desc: "Unusual behavior near cargo areas" },
  { value: "tampering", label: "Tampering", desc: "Evidence of seal, lock, or GPS tampering" },
  { value: "attempted_break_in", label: "Attempted Break-in", desc: "Signs of forced entry attempt" },
];

const SEVERITY_LEVELS = [
  { value: "critical", label: "Critical", color: "bg-red-500", desc: "Active theft, immediate danger" },
  { value: "high", label: "High", color: "bg-orange-500", desc: "Confirmed tampering, significant loss" },
  { value: "medium", label: "Medium", color: "bg-yellow-500", desc: "Suspicious activity, investigation needed" },
  { value: "low", label: "Low", color: "bg-green-500", desc: "Minor concern, documentation purposes" },
];

const CARGO_TYPES = [
  "Electronics", "Pharmaceuticals", "Food & Beverage", "Automotive Parts",
  "Textiles", "Chemicals", "Machinery", "Consumer Goods", "Other",
];

export function CargoWatchReport({ baseUrl }: { baseUrl: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("");

  if (submitted) {
    return (
      <div className="w-full bg-cw-navy-dark">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Report Submitted</h1>
          <p className="mt-4 text-lg text-gray-300">
            Thank you for helping protect America&apos;s freight network. Your
            report has been logged and will be reviewed by our team.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Reference ID: INC-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setSubmitted(false)}
              className="rounded-md bg-cw-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-cw-red-hover"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-cw-navy-dark">
      {/* Header */}
      <div className="cw-gradient-navy-section border-b border-gray-700 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
              <AlertTriangle className="h-6 w-6 text-cw-red" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Report an Incident</h1>
              <p className="text-sm text-gray-400">
                Help protect the freight community by reporting suspicious activity or cargo theft
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-8"
        >
          {/* Incident Type */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Incident Type</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {INCIDENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setIncidentType(type.value)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    incidentType === type.value
                      ? "border-cw-red bg-cw-red/10"
                      : "border-gray-700 bg-cw-navy-light hover:border-gray-600"
                  }`}
                >
                  <div className="font-medium text-white">{type.label}</div>
                  <div className="mt-1 text-xs text-gray-400">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Level */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Severity Level</h2>
            <div className="grid gap-3 sm:grid-cols-4">
              {SEVERITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setSeverity(level.value)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    severity === level.value
                      ? "border-cw-red bg-cw-red/10"
                      : "border-gray-700 bg-cw-navy-light hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${level.color}`} />
                    <span className="text-sm font-medium text-white">{level.label}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Location</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Region</label>
                <select className="w-full rounded-md border border-gray-600 bg-cw-navy-light px-4 py-2.5 text-sm text-white">
                  <option value="">Select a region...</option>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Specific Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="e.g. Truck Stop, Warehouse District"
                    className="w-full rounded-md border border-gray-600 bg-cw-navy-light py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Incident Details</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Title</label>
                <input
                  type="text"
                  placeholder="Brief description of the incident"
                  className="w-full rounded-md border border-gray-600 bg-cw-navy-light px-4 py-2.5 text-sm text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Description</label>
                <textarea
                  rows={5}
                  placeholder="Provide as much detail as possible: what happened, when, who was involved, vehicle descriptions, etc."
                  className="w-full rounded-md border border-gray-600 bg-cw-navy-light px-4 py-2.5 text-sm text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Cargo Type</label>
                  <select className="w-full rounded-md border border-gray-600 bg-cw-navy-light px-4 py-2.5 text-sm text-white">
                    <option value="">Select...</option>
                    {CARGO_TYPES.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Date</label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-600 bg-cw-navy-light px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Estimated Loss ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-md border border-gray-600 bg-cw-navy-light px-4 py-2.5 text-sm text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Upload */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Evidence</h2>
            <div className="rounded-lg border-2 border-dashed border-gray-600 bg-cw-navy-light p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
                <Camera className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-300">
                Drag and drop photos or videos here
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, MP4 up to 50MB each
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:border-gray-400 hover:text-white"
              >
                <Upload className="h-4 w-4" />
                Browse Files
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                All reports are reviewed within 24 hours. False reports may result in account suspension.
              </p>
              <button
                type="submit"
                className="rounded-md bg-cw-red px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cw-red-hover"
              >
                Submit Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
