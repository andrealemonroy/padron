import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import Alert from '../../components/Alert';
import {
  deleteFamilyRelationshipType,
  fetchFamilyRelationshipTypes,
} from '../../api/familyRelationshipTypesApi';
import { getActions } from '../../utils/actions';

const FamilyRelationshipTypes = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataValues, setDataValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchFamilyRelationshipTypes();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching family-relationship-types:', error);
        toast.error('Error al cargar los tipos de parentesco');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEdit = (data) => {
    navigate(`/edit-family-relationship-types/${data.id}`);
  };

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteFamilyRelationshipType(idToDelete);
        setDataValues((prev) => prev.filter((dev) => dev.id !== idToDelete));
        setShowAlert(false);
        toast.success('Tipo de parentesco eliminado exitosamente');
        navigate('/family-relationship-types');
      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        toast.error('Error al eliminar el proyecto');
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const breadcrumbItems = [
    { label: 'Tipos de parentesco', path: '/family-relationship-types' },
  ];

  const handleAdd = () => {
    navigate('/create-family-relationship-types');
  };

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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb
                items={breadcrumbItems}
                buttons={[
                  { text: 'Crear Tipo de parentesco', action: handleAdd },
                ]}
              />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <Table
                columns={[
                  {
                    header: 'Codigo',
                    accessorKey: 'code',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Descripción',
                    accessorKey: 'description',
                    cell: (info) => info.getValue(),
                  },
                ]}
                data={dataValues}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FamilyRelationshipTypes;
