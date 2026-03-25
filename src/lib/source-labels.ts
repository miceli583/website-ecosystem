/**
 * Canonical source labels used across CRM overview, contacts, and leads.
 * Keep this in sync — all source dropdowns and displays pull from here.
 */

export const SOURCE_OPTIONS = [
  { value: "personal_site", label: "Matthew Contact Form" },
  { value: "miracle_mind", label: "Company Contact Form" },
  { value: "banyan_waitlist", label: "Banyan Waitlist Form" },
  { value: "referral", label: "Referral" },
  { value: "portal", label: "Client Portal" },
  { value: "internal", label: "Internal" },
] as const;

/** Lookup map: source key → display label */
export const SOURCE_LABELS: Record<string, string> = Object.fromEntries(
  SOURCE_OPTIONS.map((o) => [o.value, o.label])
);

/** Get display label for a source key, falling back to the raw key */
export function getSourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}
