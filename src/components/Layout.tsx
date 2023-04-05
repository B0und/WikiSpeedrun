import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-full max-h-full flex-col items-stretch bg-neutral-50 px-9 pt-4 dark:bg-dark-surface dark:text-dark-primary">
      <Header />

      <div className="flex  min-h-0 flex-1 flex-row">
        <Sidebar />
        <div className="scrollbar flex-1 overflow-auto px-8 pt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
