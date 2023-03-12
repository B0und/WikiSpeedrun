import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-full max-h-full flex-col items-stretch bg-neutral-50 px-9 pt-4">
      <Header />

      <div className="flex  min-h-0 flex-1 flex-row">
        <Sidebar />
        <div className="pt-8 pl-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
