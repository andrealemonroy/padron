import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { fetchUsers } from '../api/userApi';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const user = {
    name: 'Luis Monroy',
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(); // Llama a la función para obtener datos
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    loadUsers();
  }, []);

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
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Usuarios
                </h1>
              </div>
            </div>

            <Table
              columns={[
                {
                  header: 'Apellidos y Nombres',
                  accessorKey: 'name', // Accede a 'name' en cada fila
                  cell: (info) => info.getValue(), // Renderiza el valor de 'name'
                },
                {
                  header: 'Correo Electrónico',
                  accessorKey: 'email', // Accede a 'email' en cada fila
                  cell: (info) => info.getValue(), // Renderiza el valor de 'email'
                },
                {
                  header: 'Rol',
                  accessorKey: 'roles', // Accede a 'role' en cada fila
                  cell: (info) => info.getValue()?.[0]?.name || 'Sin rol', // Renderiza el valor de 'role'
                },
              ]}
              data={users}
              fetchData={fetchUsers}
              pageCount={1}
            />

          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
