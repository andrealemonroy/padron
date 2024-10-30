import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import { fetchUsers, deleteUser, envoForm } from '../../api/userApi';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import { fetchImportUsersData, fetchImportWorkData } from '../../api/ImportsApi';
import { toast, ToastContainer } from 'react-toastify';
import { ColumnDef } from '@tanstack/react-table';
import { HiCloudUpload, HiUserAdd } from 'react-icons/hi';
import { getActions } from '../../utils/actions';

interface UserData {
  id: number;
  name: string;
  email: string;
  roles: { name: string }[];
  status_id: number;
}

const User = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertUsers, setShowAlertUsers] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [userIdToUsers, setUserIdToUsers] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
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
        // Update the users list after deletion
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userIdToDelete)
        );
        toast.success('Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        toast.error(
          'Error al eliminar el usuario. Por favor, intente de nuevo.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmUsers = async () => {
    console.log(userIdToUsers)
    if (userIdToUsers) {
      setLoading(true);
      try {
        await envoForm(userIdToUsers);
        setShowAlertUsers(false);
        toast.success('Formulario enviado exitosamente');
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error al Formulario enviado:', error);
        toast.error(
          'Error al Formulario enviado. Por favor, intente de nuevo.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setUserIdToDelete(null);
  };

  const cancelUsers = async () => {
    setShowAlertUsers(false);
    setUserIdToUsers(null);
    const data = await fetchUsers();
    setUsers(data);
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
      
      setShowAlertUsers(true);
      setUserIdToUsers(result);
      
    } catch (error) {
      console.error('Error al importar usuarios:', error);
      toast.error('Error al importar usuarios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  


  const handleAddMassiveJobs = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    
    if (!event.target.files || event.target.files.length === 0) {
      toast.error('No se seleccionó ningún archivo');
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    setLoading(true);
    try {
      const result = await fetchImportWorkData(formData);
      console.log('Trabajadores importados exitosamente:', result);
      toast.success('Trabajadores importados exitosamente');

    } catch (error) {
      console.error('Error al importar usuarios:', error);
      toast.error('Error al importar usuarios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (data) => {
    navigate(`/edit-user/${data.id}`);
  };

  const breadcrumbItems = [{ label: 'Usuarios', path: '/usuarios' }];

  const addButton = (
    <div className="flex space-x-4">
      <Button
        type="button"
        className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-md flex gap-1 items-center"
        onClick={handleAddUser}
      >
        <HiUserAdd size={20} />
        <span className="max-xs:sr-only">Crear Usuario</span>
      </Button>
      <label className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer flex gap-1 items-center">
        <input
          type="file"
          className="hidden"
          onChange={handleAddMassiveUsers}
          accept=".xlsx,.xls,.csv"
        />
        <HiCloudUpload size={20} />
        <span className="max-xs:sr-only">Importar Usuarios</span>
      </label>
      <label className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer flex gap-1 items-center">
        <input
          type="file"
          className="hidden"
          onChange={handleAddMassiveJobs}
          accept=".xlsx,.xls,.csv"
        />
        <HiCloudUpload size={20} />
        <span className="max-xs:sr-only">Importar Trabajadores</span>
      </label>
    </div>
  );

  // Define the columns with filter components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<UserData, any>[] = [
    {
      accessorKey: 'name',
      header: 'Apellidos y Nombres',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
      meta: {
        width: '400px',
        filterComponent: (column) => (
          <input
            type="text"
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filtrar Nombre"
            className="w-full px-2 py-1 text-sm border rounded"
          />
        ),
      },
    },
    {
      accessorKey: 'email',
      header: 'Correo Electrónico',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
      meta: {
        width: '300px',
        filterComponent: (column) => (
          <input
            type="text"
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filtrar Correo"
            className="w-full px-2 py-1 text-sm border rounded"
          />
        ),
      },
    },
    {
      accessorKey: 'roles',
      header: 'Rol',
      cell: ({ row }) => {
        const roles = row.getValue('roles') as { name: string }[];
        return roles[0]?.name || 'Sin rol';
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filterFn: 'rolesFilter' as any,
      meta: {
        width: '200px',
        filterComponent: (column) => (
          <select
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
          >
            <option value="">Todos los Roles</option>
            {
              // Get all unique roles
              Array.from(
                new Set(users.flatMap((user) => user.roles.map((role) => role.name)))
              ).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))
            }
          </select>
        ),
      },
    },
    {
      accessorKey: 'status_id',
      header: 'Estado',
      cell: (info) => (info.getValue() === 1 ? 'Activo' : 'Inactivo'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filterFn: 'statusFilter' as any,
      meta: {
        width: '200px',
        filterComponent: (column) => (
          <select
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
          >
            <option value="">Todos los Estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        ),
      },
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <ToastContainer />
      {showAlert && (
        <Alert
          message="¿Estás seguro de que deseas eliminar este usuario?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

    {showAlertUsers && (
        <Alert
          message="¿Estás seguro de que deseas enviar formularios?"
          onConfirm={confirmUsers}
          onCancel={cancelUsers}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              <Breadcrumb items={breadcrumbItems}>{addButton}</Breadcrumb>
            </div>
            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <Table
                columns={columns}
                data={users}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default User;
