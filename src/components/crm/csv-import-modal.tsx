"use client";

import { useState, useCallback, useRef } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  ChevronDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  TeamMemberPicker,
  TagPicker,
  inputClass,
  selectClass,
  labelClass,
  borderStyle,
  STATUS_CONFIG,
} from "~/components/crm";
import { SOURCE_OPTIONS } from "~/lib/source-labels";
import { api } from "~/trpc/react";

interface CsvImportModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type ParsedRow = Record<string, string>;

const CRM_FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "phone", label: "Phone", required: false },
  { key: "company", label: "Company", required: false },
] as const;

function parseCsv(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = lines[0]!
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]!.split(",").map((v) =>
      v.trim().replace(/^"|"$/g, "")
    );
    const row: ParsedRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

function autoMapColumn(header: string): string {
  const h = header.toLowerCase().trim();
  if (h.includes("name") || h === "full name" || h === "fullname")
    return "name";
  if (h.includes("email") || h.includes("e-mail")) return "email";
  if (h.includes("phone") || h.includes("tel") || h.includes("mobile"))
    return "phone";
  if (h.includes("company") || h.includes("org") || h.includes("business"))
    return "company";
  return "";
}

type Step = "upload" | "map" | "meta" | "preview" | "done";

export function CsvImportModal({ onClose, onSuccess }: CsvImportModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<ParsedRow[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [meta, setMeta] = useState({
    status: "lead",
    source: "internal",
    tags: [] as string[],
    accountManagerId: null as string | null,
  });
  const [result, setResult] = useState<{
    created: number;
    skipped: number;
  } | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const bulkCreate = api.crm.bulkCreateContacts.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setStep("done");
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCsv(text);
      if (headers.length === 0) {
        setError("Could not parse CSV — ensure it has a header row");
        return;
      }
      setCsvHeaders(headers);
      setCsvRows(rows);

      // Auto-map columns
      const autoMap: Record<string, string> = {};
      for (const h of headers) {
        const mapped = autoMapColumn(h);
        if (mapped) autoMap[h] = mapped;
      }
      setMapping(autoMap);
      setStep("map");
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const mappedContacts = csvRows.map((row) => {
    const mapped: Record<string, string> = {};
    for (const [csvHeader, crmField] of Object.entries(mapping)) {
      if (crmField) mapped[crmField] = row[csvHeader] ?? "";
    }
    return mapped;
  });

  const validContacts = mappedContacts.filter((c) => c.name && c.email);

  const handleImport = () => {
    setError("");
    bulkCreate.mutate({
      contacts: validContacts.map((c) => ({
        name: c.name!,
        email: c.email!,
        phone: c.phone || null,
        company: c.company || null,
      })),
      status: meta.status,
      source: meta.source,
      tags: meta.tags.length > 0 ? meta.tags : undefined,
      accountManagerId: meta.accountManagerId,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative mx-4 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" style={{ color: "#D4AF37" }} />
            <h2 className="text-lg font-semibold text-white">
              Import Contacts
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="mb-5 flex gap-2">
          {(["upload", "map", "meta", "preview"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  step === s
                    ? "text-black"
                    : i < ["upload", "map", "meta", "preview"].indexOf(step)
                      ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                      : "bg-white/5 text-gray-500"
                }`}
                style={
                  step === s
                    ? {
                        background:
                          "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                      }
                    : undefined
                }
              >
                {i + 1}
              </span>
              <span
                className={`text-xs ${step === s ? "text-white" : "text-gray-500"}`}
              >
                {s === "upload"
                  ? "Upload"
                  : s === "map"
                    ? "Map"
                    : s === "meta"
                      ? "Details"
                      : "Preview"}
              </span>
              {i < 3 && <span className="mx-1 text-gray-600">→</span>}
            </div>
          ))}
        </div>

        {/* Step: Upload */}
        {step === "upload" && (
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 transition-colors hover:bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mb-3 h-10 w-10 text-gray-500" />
            <p className="text-sm text-gray-400">
              Drop a CSV file here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Must have a header row with name and email columns
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        )}

        {/* Step: Map columns */}
        {step === "map" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Map your CSV columns to CRM fields. Found{" "}
              <span className="font-medium text-white">{csvRows.length}</span>{" "}
              rows.
            </p>

            <div className="space-y-3">
              {csvHeaders.map((header) => (
                <div key={header} className="flex items-center gap-3">
                  <span className="w-32 truncate text-sm text-gray-300">
                    {header}
                  </span>
                  <span className="text-gray-600">→</span>
                  <div className="relative flex-1">
                    <select
                      value={mapping[header] ?? ""}
                      onChange={(e) =>
                        setMapping((m) => ({ ...m, [header]: e.target.value }))
                      }
                      className={selectClass}
                      style={borderStyle}
                    >
                      <option value="">Skip</option>
                      {CRM_FIELDS.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                          {f.required ? " *" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>

            {!Object.values(mapping).includes("name") ||
            !Object.values(mapping).includes("email") ? (
              <p className="flex items-center gap-1 text-xs text-amber-400">
                <AlertCircle className="h-3 w-3" />
                Name and Email mappings are required
              </p>
            ) : null}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep("upload")}
                className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                style={borderStyle}
              >
                Back
              </button>
              <button
                onClick={() => setStep("meta")}
                disabled={
                  !Object.values(mapping).includes("name") ||
                  !Object.values(mapping).includes("email")
                }
                className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: Shared metadata */}
        {step === "meta" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Set shared metadata for all imported contacts.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Status</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    style={borderStyle}
                    value={meta.status}
                    onChange={(e) =>
                      setMeta((m) => ({ ...m, status: e.target.value }))
                    }
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Source</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    style={borderStyle}
                    value={meta.source}
                    onChange={(e) =>
                      setMeta((m) => ({ ...m, source: e.target.value }))
                    }
                  >
                    {SOURCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Tags</label>
              <TagPicker
                selected={meta.tags}
                onChange={(tags) => setMeta((m) => ({ ...m, tags }))}
              />
            </div>

            <div>
              <label className={labelClass}>Account Manager</label>
              <TeamMemberPicker
                placeholder="Select account manager..."
                value={meta.accountManagerId}
                onChange={(id) =>
                  setMeta((m) => ({ ...m, accountManagerId: id }))
                }
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep("map")}
                className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                style={borderStyle}
              >
                Back
              </button>
              <button
                onClick={() => setStep("preview")}
                className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                Preview
              </button>
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Preview of first 5 rows. Ready to import{" "}
              <span className="font-medium text-white">
                {validContacts.length}
              </span>{" "}
              valid contacts
              {csvRows.length - validContacts.length > 0 && (
                <span className="text-amber-400">
                  {" "}
                  ({csvRows.length - validContacts.length} skipped — missing
                  name or email)
                </span>
              )}
              .
            </p>

            <div
              className="overflow-x-auto rounded-lg border"
              style={borderStyle}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b text-left text-xs tracking-wider text-gray-500 uppercase"
                    style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                  >
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Company</th>
                  </tr>
                </thead>
                <tbody>
                  {validContacts.slice(0, 5).map((c, i) => (
                    <tr
                      key={i}
                      className="border-b"
                      style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                    >
                      <td className="px-3 py-2 text-white">{c.name}</td>
                      <td className="px-3 py-2 text-gray-400">{c.email}</td>
                      <td className="px-3 py-2 text-gray-400">
                        {c.phone || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        {c.company || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span>
                Status:{" "}
                <span className="text-white">
                  {STATUS_CONFIG[meta.status]?.label}
                </span>
              </span>
              <span>·</span>
              <span>
                Source:{" "}
                <span className="text-white">
                  {SOURCE_OPTIONS.find((o) => o.value === meta.source)?.label ??
                    meta.source}
                </span>
              </span>
              {meta.tags.length > 0 && (
                <>
                  <span>·</span>
                  <span>
                    Tags:{" "}
                    <span className="text-white">{meta.tags.join(", ")}</span>
                  </span>
                </>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep("meta")}
                className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                style={borderStyle}
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={bulkCreate.isPending || validContacts.length === 0}
                className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                {bulkCreate.isPending
                  ? "Importing..."
                  : `Import ${validContacts.length} Contacts`}
              </button>
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && result && (
          <div className="flex flex-col items-center py-8">
            <CheckCircle
              className="mb-3 h-12 w-12"
              style={{ color: "#4ade80" }}
            />
            <h3 className="text-lg font-semibold text-white">
              Import Complete
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-medium text-white">{result.created}</span>{" "}
              contacts created
              {result.skipped > 0 && (
                <span className="text-amber-400">
                  {" "}
                  · {result.skipped} skipped (duplicate email)
                </span>
              )}
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-lg px-4 py-2 text-sm font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
