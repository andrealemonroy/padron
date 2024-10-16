import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import {
  deleteQualityRating,
  fetchQualityRatings,
} from '../../api/qualityRatingsApi';
import { getActions } from '../../utils/actions';

const QualityRatings = () => {
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
        const data = await fetchQualityRatings();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching quality-ratings:', error);
        toast.error('Error al cargar los calificadores');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/edit-quality-ratings/${id}`);
  };

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteQualityRating(idToDelete);
        setDataValues((prev) => prev.filter((dev) => dev.id !== idToDelete));
        setShowAlert(false);
        toast.success('Calificador eliminado exitosamente');
        navigate('/quality-ratings');
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
    { label: 'Calificadores', path: '/quality-ratings' },
  ];

  const handleAdd = () => {
    navigate('/create-quality-ratings');
  };

  const addButton = (
    <>
      <Button
        type="button"
        className="w-80 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        onClick={handleAdd}
      >
        <svg
          className="fill-current shrink-0 xs:hidden"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1z" />
        </svg>
        <span className="max-xs:sr-only">Crear Calificador</span>
      </Button>
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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <Table
                columns={[
                  {
                    header: 'Código',
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

export default QualityRatings;
