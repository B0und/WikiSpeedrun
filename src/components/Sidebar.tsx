import { Resizable } from "re-resizable";
import { useClicks } from "../stores/GameStore";
import HistoryTable from "./HistoryTable";
import { Stopwatch } from "./Stopwatch";
import { useI18nContext } from "../i18n/i18n-react";
import { useSettingsStoreActions, useSidebarWidth } from "../stores/SettingsStore";

const Sidebar = () => {
  const { LL } = useI18nContext();
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
        onResizeStop={(e, direction, ref) => {
          setSidebarWidth(ref.offsetWidth);
        }}
        minHeight="100%"
        minWidth={300}
        maxWidth={1000}
        className="border-r-[2px] border-secondary-blue  pr-3 pt-3 hover:border-r-[2px] hover:border-primary-blue sm:hidden"
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
          <div className="mt-auto flex w-full shrink-0 flex-wrap items-baseline justify-between overflow-auto pb-6 pr-6 ">
            <span>{LL["Clicks: {0}"](clicks)}</span>
            <Stopwatch />
          </div>
        </div>
      </Resizable>
    </>
  );
};

export default Sidebar;
