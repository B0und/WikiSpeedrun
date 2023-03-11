import { Resizable } from "re-resizable";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex flex-col items-stretch max-h-full h-full px-9 pt-4">
      <Header />
      <div className="flex flex-row flex-1 min-h-0">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
