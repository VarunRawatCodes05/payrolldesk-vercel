import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-area">
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onLogout={onLogout} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
