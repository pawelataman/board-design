import { useDesignStore, type MobilePanelTab } from "../../store/useDesignStore";

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const LayersIcon = () => (
  <svg {...iconProps}>
    <title>Layers</title>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const SlidersIcon = () => (
  <svg {...iconProps}>
    <title>Properties</title>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

type TabDef = {
  id: MobilePanelTab;
  icon: React.ReactNode;
  label: string;
};

const tabs: TabDef[] = [
  { id: "layers", icon: <LayersIcon />, label: "Layers" },
  { id: "properties", icon: <SlidersIcon />, label: "Properties" },
];

export default function MobileTabBar() {
  const mobilePanelTab = useDesignStore((s) => s.mobilePanelTab);
  const setMobilePanelTab = useDesignStore((s) => s.setMobilePanelTab);

  return (
    <div className="mobile-tab-bar flex items-center justify-around px-2 py-2">
      {tabs.map((tab) => {
        const isActive = mobilePanelTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobilePanelTab(isActive ? null : tab.id)}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-[10px] font-medium transition-colors ${
              isActive
                ? "text-[var(--accent)]"
                : "text-[var(--text-secondary)]"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
