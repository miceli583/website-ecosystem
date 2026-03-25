import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Palette,
  Map,
  Wrench,
  DollarSign,
  BarChart3,
  UserCircle,
  FolderKanban,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  badge?: string;
  /** Roles that can see this item. Empty/undefined = all admins. */
  requiredRoles?: string[];
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  href: string;
  badge?: string;
  /** Roles that can see this sub-item. Empty/undefined = inherits parent. */
  requiredRoles?: string[];
}

export const ADMIN_SIDEBAR_NAV: NavItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    requiredRoles: ["founder", "admin"],
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    requiredRoles: ["founder", "admin"],
  },
  {
    title: "Team",
    href: "/admin/organization",
    icon: Building2,
    // All roles can see (non-admins get read-only, enforced server-side)
  },
  {
    title: "CRM",
    icon: Users,
    requiredRoles: ["founder", "admin", "account_manager", "connector"],
    items: [
      { title: "Overview", href: "/admin/crm" },
      { title: "Leads", href: "/admin/crm/leads" },
      { title: "Contacts", href: "/admin/crm/contacts" },
      {
        title: "Clients",
        href: "/admin/clients",
        requiredRoles: [
          "founder",
          "admin",
          "account_manager",
          "developer",
          "connector",
        ],
      },
    ],
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    requiredRoles: [
      "founder",
      "admin",
      "account_manager",
      "developer",
      "connector",
    ],
  },
  {
    title: "Finance",
    icon: DollarSign,
    requiredRoles: ["founder", "admin"],
    items: [
      { title: "Overview", href: "/admin/finance" },
      { title: "Revenue", href: "/admin/finance/revenue" },
      { title: "Expenses", href: "/admin/finance/expenses" },
      { title: "Yearly Review", href: "/admin/finance/yearly" },
      { title: "Tax & Deductions", href: "/admin/finance/tax" },
    ],
  },
  {
    title: "CMS",
    icon: FileText,
    requiredRoles: ["founder", "admin"],
    items: [
      { title: "Daily Values", href: "/admin/daily-values" },
      { title: "Blog", href: "/admin/blog" },
    ],
  },
  {
    title: "Assets",
    icon: Palette,
    requiredRoles: ["founder", "admin", "developer"],
    items: [
      { title: "Brand", href: "/admin/brand" },
      { title: "Web Design", href: "/admin/web-design" },
      { title: "Shaders", href: "/admin/shaders" },
      { title: "UI Playground", href: "/admin/playground" },
    ],
  },
  {
    title: "Ecosystem",
    href: "/admin/ecosystem",
    icon: Map,
    requiredRoles: ["founder", "admin"],
  },
  {
    title: "Tooling",
    icon: Wrench,
    requiredRoles: ["founder", "admin", "developer"],
    items: [
      { title: "Service Inventory", href: "/admin/tooling" },
      { title: "Database Health", href: "/admin/tooling/database" },
    ],
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: UserCircle,
    // Visible to all
  },
];

// Footer links for ecosystem sites
export const ADMIN_FOOTER_LINKS = [
  { label: "matthewmiceli.com", href: "https://matthewmiceli.com" },
  { label: "miraclemind.dev", href: "https://miraclemind.dev" },
  { label: "miraclemind.live", href: "https://miraclemind.live" },
];
