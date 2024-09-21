import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = {
    name: 'Luis Monroy',
  };
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />

        <main className="grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
            {/* Page content */}
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <Table
              columns={[
                { header: 'Name', cell: 'name' },
                { header: 'Email', cell: 'email' },
                { header: 'Role', cell: 'role' },
              ]}
              data={[{ name: 'Luis Monroy', email: 'test@gmail.com' }]}
              fetchData={function (page: number, filters: any): Promise<any> {
                throw new Error('Function not implemented.');
              }}
              pageCount={0}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
