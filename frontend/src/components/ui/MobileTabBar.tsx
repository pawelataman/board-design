import { Stack, SlidersHorizontal } from "@phosphor-icons/react";
import { useDesignStore, type MobilePanelTab } from "../../store/useDesignStore";

type TabDef = {
  id: MobilePanelTab;
  icon: React.ReactNode;
  label: string;
};

const tabs: TabDef[] = [
  { id: "layers", icon: <Stack size={18} />, label: "Layers" },
  { id: "properties", icon: <SlidersHorizontal size={18} />, label: "Properties" },
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
