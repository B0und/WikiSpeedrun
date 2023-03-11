import { Resizable } from "re-resizable";
import HistoryTable from "./HistoryTable";

const Sidebar = () => {
  return (
    <>
      <Resizable
        defaultSize={{
          width: 400,
          height: "100%",
        }}
        minHeight="100%"
        minWidth={220}
        maxWidth={1000}
        className="border-r-[1px] border-primary-border  pt-3 pr-6"
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
        <div className="flex h-full w-full flex-col items-center justify-start gap-16">
          <HistoryTable />
          <div>Time</div>
        </div>
      </Resizable>
    </>
  );
};

export default Sidebar;
