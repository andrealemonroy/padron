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
import { getActions } from '../../utils/actions';
import { deleteEvaluation, fetchEvaluations } from '../../api/EvaluationsApi';

const Evaluations = () => {
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
        const data = await fetchEvaluations();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching periodic evaluations:', error);
        toast.error('Error al cargar las evaluaciones');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/edit-evaluations/${id}`);
  };

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteEvaluation(idToDelete);
        setDataValues((prev) => prev.filter((dev) => dev.id !== idToDelete));
        setShowAlert(false);
        toast.success('Evaluación eliminada exitosamente');
        navigate('/evaluations');
      } catch (error) {
        console.error('Error al eliminar la evaluación:', error);
        toast.error('Error al eliminar la evaluación');
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const breadcrumbItems = [{ label: 'Evaluación', path: '/evaluations' }];

  const handleAdd = () => {
    navigate('/create-evaluations');
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      {showAlert && (
        <Alert
          message="¿Estás seguro de que deseas eliminar esta evaluación?"
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
                    header: 'Periodo',
                    accessorKey: 'evaluation_date',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Opciones',
                    accessorKey: 'predefined_options',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Detalles',
                    accessorKey: 'details',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Estado',
                    accessorKey: 'status',
                    cell: (info) =>
                      info.getValue() == 1 ? 'Activo' : 'Inactivo',
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

export default Evaluations;
