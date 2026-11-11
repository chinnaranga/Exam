import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith('/auth/');

  if (isLoginPage && location.pathname !== '/auth/sessions' && location.pathname !== '/auth/devices') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-body text-[#2B2350] selection:bg-[#FFF3A3] selection:text-[#2B2350] antialiased pencil-cursor flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
