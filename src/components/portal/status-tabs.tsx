"use client";

interface StatusTabsProps {
  activeTab: "active" | "archived";
  onTabChange: (tab: "active" | "archived") => void;
  activeCount: number;
  archivedCount: number;
  activeLabel?: string;
  archivedLabel?: string;
}

export function StatusTabs({
  activeTab,
  onTabChange,
  activeCount,
  archivedCount,
  activeLabel = "Active",
  archivedLabel = "Archived",
}: StatusTabsProps) {
  const tabs = [
    { id: "active" as const, label: activeLabel, count: activeCount },
    { id: "archived" as const, label: archivedLabel, count: archivedCount },
  ];

  return (
    <div className="mb-6 flex gap-1 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "text-[#D4AF37]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeTab === tab.id
                  ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                  : "bg-white/5 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </span>
          {activeTab === tab.id && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: "#D4AF37" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
