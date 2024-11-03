import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { fetchPermissions, deletePermissions } from '../api/permissionApi';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { getActions } from '../utils/actions';

const Option = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPermissions();
        setPermissions(data);
      } catch (error) {
        console.error('Error fetching setPermissions:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deletePermissions(idToDelete);
        setPermissions((prev) => prev.filter((rol) => rol.id !== idToDelete));
        setShowAlert(false);
        navigate('/option');
      } catch (error) {
        console.error('Error al eliminar el setPermissions:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const handleEdit = (data) => {
    navigate(`/edit-option/${data.id}`);
  };

  const handleAdd = () => {
    navigate('/create-option');
  };
  const breadcrumbItems = [{ label: 'Opción', path: '/option' }];


  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {showAlert && (
        <Alert
          message="¿Estás seguro de que deseas eliminar este registro?"
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
              <Breadcrumb items={breadcrumbItems} buttons={[{ text: 'Crear Opocion', action: handleAdd }]} />
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
                  data={permissions}
                  actions={getActions({ handleEdit, handleDelete })}
                />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Option;
