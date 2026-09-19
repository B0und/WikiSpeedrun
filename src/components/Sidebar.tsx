import { Resizable } from "re-resizable";
import { useLingui } from "@lingui/react";
import { useClicks } from "../stores/GameStore";
import { useSettingsStoreActions, useSidebarWidth } from "../stores/SettingsStore";
import HistoryTable from "./HistoryTable";
import { Stopwatch } from "./Stopwatch";

const Sidebar = () => {
  const { i18n } = useLingui();
  const sidebarWidth = useSidebarWidth();
  const { setSidebarWidth } = useSettingsStoreActions();

  const clicks = useClicks();
  return (
    <>
      <Resizable
        size={{
          width: sidebarWidth,
          height: "100%",
        }}
        onResizeStop={(_e, _direction, ref) => {
          setSidebarWidth(ref.offsetWidth);
        }}
        minHeight="100%"
        minWidth={300}
        maxWidth={1000}
        className="border-r-[2px] border-secondary-blue pt-3 pr-3 hover:border-r-[2px] hover:border-primary-blue md:hidden"
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-start gap-8">
          <HistoryTable />
          <div className="mt-auto flex w-full shrink-0 flex-wrap items-baseline justify-between overflow-auto pr-6 pb-6">
            <span>
              {i18n._(
                /** i18n */
                { id: "Clicks: {clicks}", values: { clicks } },
              )}
            </span>
            <Stopwatch />
          </div>
        </div>
      </Resizable>
    </>
  );
};

export default Sidebar;
