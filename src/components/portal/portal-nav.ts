import {
  Play,
  FileText,
  Wrench,
  StickyNote,
  CreditCard,
  FolderKanban,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

export interface PortalNavItem {
  title: string;
  /** Path segment appended to /portal/[slug]/ */
  path: string;
  icon: LucideIcon;
  /** If set, only users with role "admin" or these roles can see this item */
  adminOnly?: boolean;
}

export const PORTAL_NAV: PortalNavItem[] = [
  { title: "Demos", path: "demos", icon: Play },
  { title: "Proposals", path: "proposals", icon: FileText },
  { title: "Tooling", path: "tooling", icon: Wrench },
  { title: "Notes", path: "notes", icon: StickyNote },
  { title: "Billing", path: "billing", icon: CreditCard },
  { title: "Projects", path: "projects", icon: FolderKanban, adminOnly: true },
  { title: "Profile", path: "profile", icon: UserCircle },
];
