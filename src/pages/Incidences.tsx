import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { deleteIncidence, fetchIncidences } from '../api/incidencesApi';
import Button from '../components/Button';
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

  const handleAddUser = () => {
    navigate('/create-incidences');
  };

  const addButton = (
    <>
      <Button
        type="button"
        className="w-80 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        onClick={handleAddUser}
      >
        <svg
          className="fill-current shrink-0 xs:hidden"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
        <span className="max-xs:sr-only">Crear Incidencia</span>
      </Button>
    </>
  );

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
                    header: 'Nombre',
                    accessorKey: 'user.name',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Días',
                    accessorKey: 'days',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Horas',
                    accessorKey: 'hours',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Importe (S/.)',
                    accessorKey: 'amount',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Mes',
                    accessorKey: 'month',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Año',
                    accessorKey: 'year',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Estado',
                    accessorKey: 'status_id',
                    cell: (info) =>
                      info.getValue() == 1 ? 'Activo' : 'Inactivo',
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
