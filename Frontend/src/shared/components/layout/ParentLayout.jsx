import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function ParentLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-transparent relative">
      <Sidebar role="parent" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main key={location.pathname} className="flex-1 overflow-y-auto p-6 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
}