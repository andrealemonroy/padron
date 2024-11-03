import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { fetchRoles, deleteRol } from '../api/rolApi';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { getActions } from '../utils/actions';
import { HiPlusCircle } from 'react-icons/hi';

const Roles = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const data = await fetchRoles();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteRol(idToDelete);
        setRoles((prevRoles) =>
          prevRoles.filter((rol) => rol.id !== idToDelete)
        );
        setShowAlert(false);
        navigate('/roles');
      } catch (error) {
        console.error('Error al eliminar el rol:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const handleAdd = () => {
    navigate('/create-rol');
  };

  const handleEdit = (data) => {
    navigate(`/edit-rol/${data.id}`);
  };

  const breadcrumbItems = [{ label: 'Roles', path: '/roles' }];

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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb
                items={breadcrumbItems}
                buttons={[
                  {
                    text: 'Agregar Rol',
                    action: handleAdd,
                  },
                ]}
              />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <Table
                columns={[
                  {
                    header: 'Descripción',
                    accessorKey: 'name',
                    cell: (info) => info.getValue(),
                  },
                ]}
                data={roles}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Roles;
