"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { BarChart3, Map, LayoutDashboard, Kanban, Users } from "lucide-react";
import { SAMPLE_PROJECTS, SAMPLE_CONTACTS } from "./sample-data";
import type { ProjectWithMeta } from "~/components/projects/types";
import type { ContactRow } from "~/components/crm/types";

// Lazy-load heavy demo components
const CargoWatchDashboard = dynamic(
  () =>
    import("~/components/demos/cargowatch-dashboard").then((m) => ({
      default: m.CargoWatchDashboard,
    })),
  { ssr: false, loading: () => <DemoSkeleton /> }
);

const CargoWatchMap = dynamic(
  () =>
    import("~/components/demos/cargowatch-map").then((m) => ({
      default: m.CargoWatchMap,
    })),
  { ssr: false, loading: () => <DemoSkeleton /> }
);

const CHW360AdminDemo = dynamic(
  () =>
    import("~/components/demos/chw360-admin").then((m) => ({
      default: m.CHW360AdminDemo,
    })),
  { ssr: false, loading: () => <DemoSkeleton /> }
);

const ProjectKanban = dynamic(
  () =>
    import("~/components/projects/project-kanban").then((m) => ({
      default: m.ProjectKanban,
    })),
  { ssr: false, loading: () => <DemoSkeleton /> }
);

const ContactKanban = dynamic(
  () =>
    import("~/components/crm/contact-kanban").then((m) => ({
      default: m.ContactKanban,
    })),
  { ssr: false, loading: () => <DemoSkeleton /> }
);

function DemoSkeleton() {
  return (
    <div className="flex h-[500px] items-center justify-center">
      <div className="animate-pulse text-sm text-white/30">Loading demo...</div>
    </div>
  );
}

const TABS = [
  {
    id: "dashboard",
    label: "Operations Dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    description:
      "Real-time monitoring -- the kind of system I build for tracking field operations, incidents, and regional hotspots.",
  },
  {
    id: "map",
    label: "Interactive Map",
    icon: <Map className="h-4 w-4" />,
    description:
      "Geographic data visualization with incident markers, severity filtering, and cargo route overlays.",
  },
  {
    id: "admin",
    label: "Admin Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    description:
      "Full admin interface with analytics, user management tables, and reporting -- the backbone of any business platform.",
  },
  {
    id: "projects",
    label: "Project Management",
    icon: <Kanban className="h-4 w-4" />,
    description:
      "Drag-and-drop project boards for managing multi-phase initiatives. Try dragging a card between columns.",
  },
  {
    id: "crm",
    label: "CRM Pipeline",
    icon: <Users className="h-4 w-4" />,
    description:
      "Sales pipeline from lead to client. Drag contacts between stages to see how pipeline management works.",
  },
];

export function DemosSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Local state for interactive demos
  const [projects, setProjects] = useState<ProjectWithMeta[]>(SAMPLE_PROJECTS);
  const [contacts, setContacts] = useState<ContactRow[]>(SAMPLE_CONTACTS);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleProjectMove = useCallback((id: number, newStatus: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: newStatus, updatedAt: new Date() } : p
      )
    );
  }, []);

  const handleContactStatusChange = useCallback(
    (contactId: string, newStatus: string) => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c))
      );
    },
    []
  );

  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <section className="relative px-6 py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-6xl">
        <h3
          className={`mb-4 text-center font-[family-name:var(--font-quattrocento-sans)] text-sm font-semibold tracking-[0.15em] text-[#D4AF37]/70 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          LIVE DEMOS
        </h3>
        <p
          className={`mx-auto mb-10 max-w-xl text-center text-base text-white/50 transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Real, working components from systems I&apos;ve built -- not mockups.
          Click through the tabs to explore.
        </p>

        <div
          className={`transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Tab triggers */}
            <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-center gap-1 border border-[rgba(212,175,55,0.1)] bg-white/[0.02] p-1.5">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-white/50 transition-all data-[state=active]:bg-[rgba(212,175,55,0.1)] data-[state=active]:text-[#D4AF37] sm:text-sm"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Description */}
            {activeTabData && (
              <p className="mb-4 text-center text-sm text-white/40">
                {activeTabData.description}
              </p>
            )}

            {/* Demo container */}
            <div
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <TabsContent
                value="dashboard"
                className="mt-0 max-h-[650px] overflow-y-auto"
              >
                <CargoWatchDashboard baseUrl="/showcase" />
              </TabsContent>

              <TabsContent value="map" className="mt-0 h-[600px]">
                <CargoWatchMap baseUrl="/showcase" />
              </TabsContent>

              <TabsContent
                value="admin"
                className="mt-0 max-h-[650px] overflow-y-auto"
              >
                <CHW360AdminDemo backHref="/showcase" />
              </TabsContent>

              <TabsContent
                value="projects"
                className="mt-0 max-h-[650px] overflow-x-auto overflow-y-auto bg-gray-950 p-4"
              >
                <ProjectKanban
                  projects={projects}
                  mode="admin"
                  onMoveStatus={handleProjectMove}
                  onViewDetail={() => {}}
                />
              </TabsContent>

              <TabsContent
                value="crm"
                className="mt-0 max-h-[650px] overflow-x-auto overflow-y-auto bg-gray-950 p-4"
              >
                <ContactKanban
                  contacts={contacts}
                  onStatusChange={handleContactStatusChange}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
