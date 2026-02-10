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
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  badge?: string;
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  href: string;
  badge?: string;
}

export const ADMIN_SIDEBAR_NAV: NavItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Organization",
    href: "/admin/organization",
    icon: Building2,
  },
  {
    title: "CRM",
    icon: Users,
    items: [
      { title: "Dashboard", href: "/admin/crm" },
      { title: "Contacts", href: "/admin/crm/contacts" },
      { title: "Leads", href: "/admin/crm/leads" },
      { title: "Clients", href: "/admin/clients" },
    ],
  },
  {
    title: "Finance",
    icon: DollarSign,
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
    items: [
      { title: "Daily Values", href: "/admin/daily-values" },
      { title: "Blog", href: "/admin/blog" },
    ],
  },
  {
    title: "Assets",
    icon: Palette,
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
  },
  {
    title: "Tooling",
    icon: Wrench,
    items: [
      { title: "Service Inventory", href: "/admin/tooling" },
      { title: "Database Health", href: "/admin/tooling/database" },
    ],
  },
];

// Footer links for ecosystem sites
export const ADMIN_FOOTER_LINKS = [
  { label: "matthewmiceli.com", href: "https://matthewmiceli.com" },
  { label: "miraclemind.dev", href: "https://miraclemind.dev" },
  { label: "miraclemind.live", href: "https://miraclemind.live" },
];
