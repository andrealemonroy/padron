import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { fetchUsers, deleteUser } from '../api/userApi';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { fetchImportUsersData } from '../api/ImportsApi';
import { toast, ToastContainer } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);


  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setUserIdToDelete(id);
  };

  const confirmDelete = async () => {
      if (userIdToDelete) {
        setLoading(true);
          try {
              await deleteUser(userIdToDelete);
              setShowAlert(false);
              navigate('/dashboard');
          } catch (error) {
              console.error('Error al eliminar el usuario:', error);
          } finally {
            setLoading(false);
          }
      }
  };

  const cancelDelete = () => {
      setShowAlert(false);
      setUserIdToDelete(null);
  };

  const handleAddUser = () => {
    navigate('/create-user');
  };

  const handleAddMassiveUsers = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast.error('No se seleccionó ningún archivo');
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const result = await fetchImportUsersData(formData);
      console.log('Usuarios importados exitosamente:', result);
      toast.success('Usuarios importados exitosamente');
    } catch (error) {
      console.error('Error al importar usuarios:', error);
      toast.error('Error al importar usuarios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-user/${id}`);
  };

  const breadcrumbItems = [
    { label: 'Usuarios', path: '/dashboard' },
  ];

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
        <label 
          className="w-80 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer"
        >
          <input
            type="file"
            className="hidden"
            onChange={handleAddMassiveUsers}
            accept=".xlsx,.xls,.csv"
          />
          <svg
            className="fill-current shrink-0 xs:hidden"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="max-xs:sr-only">Crear Usuarios Masivo</span>
        </label>
    </>
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
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
          
        />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} />
            </div>
            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <>
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
                      cell: ({ row }) => {
                        const roles = row.getValue('roles') as { name: string }[];
                        return roles[0]?.name || 'Sin rol';
                      },
                      filterFn: (row, id, value) => {
                        const roles = row.getValue(id) as { name: string }[];
                        return roles[0]?.name?.toLowerCase().includes(value.toLowerCase());
                      },
                    },
                    {
                      header: 'Estado',
                      accessorKey: 'status_id',
                      cell: (info) => info.getValue() === 1 ? 'Activo' : 'Inactivo',
                      filterFn: (row, id, value) => {
                        const statusId = row.getValue(id) as number;
                        const estado = statusId === 1 ? 'Activo' : 'Inactivo';
                        return estado.toLowerCase().includes(value.toLowerCase());
                      },
                    },
                  ]}
                  data={users}
                  fetchData={fetchUsers}
                  pageCount={1}
                  addButton={addButton}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </>
            )}
            

          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
