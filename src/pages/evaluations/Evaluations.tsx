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

  const handleEdit = (data) => {
    navigate(`/edit-evaluations/${data.id}`);
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

  const breadcrumbItems = [{ label: 'Evaluación de Campo', path: '/evaluations' }];

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
                    header: 'Nombre',
                    accessorKey: 'user.name',
                    cell: (info) => info.getValue(),
                    meta: {
                      width: '500px',
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
                    header: 'Periodo',
                    accessorKey: 'evaluation_date',
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
                    header: 'Opciones',
                    accessorKey: 'predefined_options',
                    cell: (info) => info.getValue(),
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
                          <option value="Opcion A">Opcion A</option>
                          <option value="Opcion B">Opcion B</option>
                          <option value="Opcion C">Opcion C</option>
                        </select>
                      ),
                    },
                  },
                  {
                    header: 'Detalles',
                    accessorKey: 'details',
                    cell: (info) => info.getValue(),
                    meta: {
                      width: '500px',
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Detalles"
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
