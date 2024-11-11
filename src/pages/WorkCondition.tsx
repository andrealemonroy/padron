import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { fetchWorkConditions } from '../api/workConditionApi';
import { getActions } from '../utils/actions';

const WorkCondition = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workConditions, setfetchWorkConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkConditions();
        setfetchWorkConditions(data);
      } catch (error) {
        console.error('Error fetching work conditions:', error);
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
        // Uncomment this when the delete API is ready
        // await deleteWorkCondition(idToDelete);
        setfetchWorkConditions((prev) =>
          prev.filter((dev) => dev.id !== idToDelete)
        );
        setShowAlert(false);
        navigate('/work-condition');
      } catch (error) {
        console.error('Error deleting work condition:', error);
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
    navigate(`/edit-work-condition/${data.id}`);
  };

  const breadcrumbItems = [
    { label: 'Trabajo Remoto', path: '/work-condition' },
  ];

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
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <Table
                columns={[
                  {
                    header: 'Nombre',
                    accessorKey: 'name',
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
                    header: 'Trabajo remoto',
                    accessorKey: 'work_condition.remote_work_condition',
                    cell: (info) => (info.getValue() === 1 ? 'SI' : info.getValue() === 0 ? 'NO' : ''),
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
                          <option value="">Seleccione</option>
                          <option value="1">SI</option>
                          <option value="0">NO</option>
                        </select>
                      ),
                    },
                  },
                  {
                    header: 'Tipo de Computadora',
                    accessorKey: 'work_condition.computer_type',
                    cell: (info) => (info.getValue() === 1 ? 'Laptop' : info.getValue() === 2 ? 'Desktop' : ''),
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
                          <option value="">Seleccione</option>
                          <option value="1">Laptop</option>
                          <option value="2">Desktop</option>
                        </select>
                      ),
                    },
                  },
                  {
                    header: 'Conexión a Internet',
                    accessorKey: 'work_condition.internet_connection',
                    cell: (info) => (info.getValue() === 1 ? 'WIFI' : info.getValue() === 2 ? 'CABLE' : ''),
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
                          <option value="">Seleccione</option>
                          <option value="1">WIFI</option>
                          <option value="2">CABLE</option>
                        </select>
                      ),
                    },
                  },
                  {
                    header: 'Ambiente en Casa',
                    accessorKey: 'work_condition.adequate_home_environment',
                    cell: (info) => (info.getValue() === 1 ? 'SI' : info.getValue() === 0 ? 'NO' : ''),
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
                          <option value="">Seleccione</option>
                          <option value="1">SI</option>
                          <option value="0">NO</option>
                        </select>
                      ),
                    },
                  },
                ]}
                data={workConditions}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkCondition;