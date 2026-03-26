/**
 * Role-based access control constants and helpers.
 * Shared between server (tRPC) and client (nav filtering, UI gating).
 */

export const COMPANY_ROLES = [
  "founder",
  "admin",
  "developer",
  "account_manager",
  "connector",
] as const;

export type CompanyRole = (typeof COMPANY_ROLES)[number];

/** Roles with full admin-level access */
const FULL_ACCESS_ROLES: CompanyRole[] = ["founder", "admin"];

/**
 * Nav visibility map: which companyRoles can see each admin section.
 * Empty array = visible to all authenticated admins.
 * Founder always bypasses (handled in hasAccess).
 * Uses string[] to allow future role extensions without type changes.
 */
export const NAV_VISIBILITY: Record<string, string[]> = {
  // Visible to all
  "/admin": [],
  "/admin/profile": [],

  // Founder + Admin only
  "/admin/analytics": [...FULL_ACCESS_ROLES],
  "/admin/finance": [...FULL_ACCESS_ROLES],
  "/admin/finance/revenue": [...FULL_ACCESS_ROLES],
  "/admin/finance/expenses": [...FULL_ACCESS_ROLES],
  "/admin/finance/yearly": [...FULL_ACCESS_ROLES],
  "/admin/finance/tax": [...FULL_ACCESS_ROLES],
  "/admin/daily-values": [...FULL_ACCESS_ROLES],
  "/admin/blog": [...FULL_ACCESS_ROLES],
  "/admin/ecosystem": [...FULL_ACCESS_ROLES],

  // Founder + Admin + Account Manager + Connector
  "/admin/crm": [...FULL_ACCESS_ROLES, "account_manager", "connector"],
  "/admin/crm/contacts": [...FULL_ACCESS_ROLES, "account_manager", "connector"],
  "/admin/crm/leads": [...FULL_ACCESS_ROLES, "account_manager", "connector"],
  "/admin/clients": [
    ...FULL_ACCESS_ROLES,
    "account_manager",
    "developer",
    "connector",
  ],

  // Projects — all roles
  "/admin/projects": [
    ...FULL_ACCESS_ROLES,
    "account_manager",
    "developer",
    "connector",
  ],

  // Team — read-only for non-admins (enforced at procedure level)
  "/admin/organization": [
    ...FULL_ACCESS_ROLES,
    "account_manager",
    "developer",
    "connector",
  ],

  // Assets
  "/admin/brand": [...FULL_ACCESS_ROLES, "designer"],
  "/admin/web-design": [...FULL_ACCESS_ROLES, "developer", "designer"],
  "/admin/shaders": [...FULL_ACCESS_ROLES, "developer"],
  "/admin/playground": [...FULL_ACCESS_ROLES, "developer"],

  // Tooling
  "/admin/tooling": [...FULL_ACCESS_ROLES, "developer"],
  "/admin/tooling/database": [...FULL_ACCESS_ROLES, "developer"],
};

/**
 * Check if a user with the given roles can access a path.
 * Founder always has access. Empty allowedRoles = open to all admins.
 */
export function hasAccess(userRoles: string[], path: string): boolean {
  if (userRoles.includes("founder")) return true;

  const allowedRoles = NAV_VISIBILITY[path];
  // If path not in map or empty array, allow all authenticated admins
  if (!allowedRoles || allowedRoles.length === 0) return true;

  return allowedRoles.some((r) => userRoles.includes(r));
}

/** Check if roles include founder or admin (full access tier) */
export function isFullAccess(userRoles: string[]): boolean {
  return FULL_ACCESS_ROLES.some((r) => userRoles.includes(r));
}

/** Check if roles include a specific role */
export function hasRole(userRoles: string[], role: CompanyRole): boolean {
  return userRoles.includes("founder") || userRoles.includes(role);
}
