import { Resizable } from "re-resizable";
import { useI18nContext } from "../i18n/i18n-react";
import { useClicks } from "../stores/GameStore";
import { useSettingsStoreActions, useSidebarWidth } from "../stores/SettingsStore";
import HistoryTable from "./HistoryTable";
import { Stopwatch } from "./Stopwatch";

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
        onResizeStop={(_e, _direction, ref) => {
          setSidebarWidth(ref.offsetWidth);
        }}
        minHeight="100%"
        minWidth={300}
        maxWidth={1000}
        className="border-secondary-blue border-r-[2px] pt-3 pr-3 hover:border-primary-blue hover:border-r-[2px] md:hidden"
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
          <div className="mt-auto flex w-full shrink-0 flex-wrap items-baseline justify-between overflow-auto pr-6 pb-6 ">
            <span>{LL["Clicks: {0}"](clicks)}</span>
            <Stopwatch />
          </div>
        </div>
      </Resizable>
    </>
  );
};

export default Sidebar;
