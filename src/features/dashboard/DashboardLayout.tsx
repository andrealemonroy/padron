import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;