import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type React from "react";

export const BaseLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-full max-h-full flex-col items-stretch bg-neutral-50 px-9 pt-4 sm:px-4 dark:bg-dark-surface dark:text-dark-primary">
      <Header />

      <div className="flex min-h-0 flex-1 flex-row">
        <Sidebar />
        <div className="scrollbar md:-mx-4 flex-1 overflow-auto px-8 pt-8 md:px-4 md:pt-4">{children}</div>
      </div>
    </div>
  );
};
const Layout = () => {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
};

export default Layout;
