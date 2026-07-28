import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="layout-main">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
