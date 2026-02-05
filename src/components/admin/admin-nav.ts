import {
  LayoutDashboard,
  Users,
  FileText,
  Palette,
  Zap,
  Code2,
  Rocket,
  CalendarClock,
  BookOpen,
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
    title: "CRM",
    icon: Users,
    items: [
      { title: "Clients", href: "/admin/clients" },
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
      { title: "Templates", href: "/admin/templates" },
      { title: "Shaders", href: "/admin/shaders" },
      { title: "Playground", href: "/admin/playground" },
    ],
  },
  {
    title: "Landing Pages",
    icon: Rocket,
    items: [
      { title: "Countdown", href: "/admin/dope-ass-landing" },
      { title: "Waitlist", href: "/admin/join-community-1" },
      { title: "Launch", href: "/admin/launch-landing-1" },
    ],
  },
];

// Footer links for ecosystem sites
export const ADMIN_FOOTER_LINKS = [
  { label: "matthewmiceli.com", href: "https://matthewmiceli.com" },
  { label: "miraclemind.dev", href: "https://miraclemind.dev" },
  { label: "miraclemind.live", href: "https://miraclemind.live" },
];
