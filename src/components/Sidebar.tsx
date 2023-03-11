import { Resizable } from "re-resizable";
import React from "react";
import HistoryTable from "./HistoryTable";
import Test from "./Test";

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
        maxWidth={500}
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
        <div className="w-full h-full flex flex-col items-center justify-start gap-16">
          <HistoryTable />
          <div>Time</div>
        </div>
      </Resizable>
    </>
  );
};

export default Sidebar;
