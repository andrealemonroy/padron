import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { deleteIncidence, fetchIncidences } from '../api/incidencesApi';
import Alert from '../components/Alert';
import { getActions } from '../utils/actions';

const Incidences = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidences();
        setIncidences(data);
      } catch (error) {
        console.error('Error fetching :', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEdit = (data) => {
    navigate(`/edit-incidences/${data.id}`);
  };

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteIncidence(idToDelete);
        setIncidences((prev) => prev.filter((pre) => pre.id !== idToDelete));
        setShowAlert(false);
        navigate('/incidences');
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
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
    { label: 'Incidencias Mensuales', path: '/incidences' },
  ];

  const handleAdd = () => {
    navigate('/create-incidences');
  };

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
              <Breadcrumb items={breadcrumbItems} 
              buttons={[
                  {
                    text: 'Agregar Incidencia',
                    action: handleAdd,
                  },
                ]}/>
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <Table
                columns={[
                  {
                    header: 'Documento',
                    accessorKey: 'user.personal_information.document_number',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Documento"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Nombre',
                    accessorKey: 'user.name',
                    cell: (info) => info.getValue(),
                    meta: {
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
                    header: 'Días',
                    accessorKey: 'days',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Días"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Horas',
                    accessorKey: 'hours',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Horas"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Importe (S/.)',
                    accessorKey: 'amount',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Importe (S/.)"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Mes',
                    accessorKey: 'month',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Mes"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Año',
                    accessorKey: 'year',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Año"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Estado',
                    accessorKey: 'status_id',
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
                data={incidences}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Incidences;
