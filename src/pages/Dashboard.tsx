import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { fetchUsers, deleteUser } from '../api/userApi';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert'; 

const Dashboard = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setUserIdToDelete(id);
  };

  const confirmDelete = async () => {
      if (userIdToDelete) {
          try {
              await deleteUser(userIdToDelete);
              setShowAlert(false);
              navigate('/dashboard');
          } catch (error) {
              console.error('Error al eliminar el usuario:', error);
          }
      }
  };

  const cancelDelete = () => {
      setShowAlert(false);
      setUserIdToDelete(null);
  };

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

  const handleAddUser = () => {
    navigate('/create-user');
  };

  const handleAddMassiveUsers = () => {
    console.log('Agregar usuarios masivos');
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-user/${id}`);
  };

  const addButton = (
    <>
        <Button 
          type='button' 
          className="w-80 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          onClick={handleAddUser}
        >
          <svg
            className="fill-current shrink-0 xs:hidden"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="max-xs:sr-only">Crear Usuario</span>
        </Button>
        <Button 
          type='button' 
          className="w-80 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          onClick={handleAddMassiveUsers}
        >
          <svg
            className="fill-current shrink-0 xs:hidden"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="max-xs:sr-only">Crear Usuarios Masivo</span>
        </Button>
    </>
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {showAlert && (
                <Alert
                    message="¿Estás seguro de que deseas eliminar este usuario?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
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
                  accessorKey: 'name',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Correo Electrónico',
                  accessorKey: 'email',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Rol',
                  accessorKey: 'roles',
                  cell: (info) => info.getValue()?.[0]?.name || 'Sin rol',
                },
                {
                  header: 'Estado',
                  accessorKey: 'status_id',
                  cell: (info) => info.getValue() == 1 ? 'Activo' : 'Inactivo' ,
                },
              ]}
              data={users}
              fetchData={fetchUsers}
              pageCount={1}
              addButton={addButton}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
