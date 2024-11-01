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
  deletePeriodicEvaluation,
  fetchPeriodicEvaluations,
} from '../../api/periodicEvaluationsApi';
import { getActions } from '../../utils/actions';

const PeriodicEvaluations = () => {
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
        const data = await fetchPeriodicEvaluations();
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

  const handleEdit = (data) => {
    navigate(`/edit-periodic-evaluations/${data.id}`);
  };

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deletePeriodicEvaluation(idToDelete);
        setDataValues((prev) => prev.filter((dev) => dev.id !== idToDelete));
        setShowAlert(false);
        toast.success('Proyecto eliminado exitosamente');
        navigate('/periodic-evaluations');
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
    { label: 'Evaluación Periodico', path: '/periodic-evaluations' },
  ];

  const handleAdd = () => {
    navigate('/create-periodic-evaluations');
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
              <Breadcrumb 
              items={breadcrumbItems}
              buttons={[
                {
                  text: 'Agregar evaluación',
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
                    header: 'Periodo',
                    accessorKey: 'period',
                    cell: (info) => info.getValue(),
                    meta: {
                      width: '200px',
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Periodo"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Fecha',
                    accessorKey: 'date',
                    cell: (info) => info.getValue(),
                    meta: {
                      width: '150px',
                      filterComponent: (column) => (
                        <input
                          type="date"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                    filterFn: 'equals',
                  },
                  {
                    header: 'Rating',
                    accessorKey: 'rating',
                    cell: (info) => info.getValue(),
                    meta: {
                      width: '200px',
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Rating"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Estado',
                    accessorKey: 'status',
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
                  {
                    header: 'Calidad del desarrollo',
                    accessorKey: 'development_quality',
                    cell: (info) => info.getValue(),
                    meta: {
                      width: '350px',
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Calidad del desarrollo"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
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

export default PeriodicEvaluations;
