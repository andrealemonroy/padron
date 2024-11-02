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
import { deleteContract, fetchContracts } from '../../api/contractApi';

const Contract = () => {
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
        const data = await fetchContracts();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  const handleEdit = (data) => {
    navigate(`/edit-contract/${data.id}`);
  };

  const handleDelete = async (data) => {
    setShowAlert(true);
    setIdToDelete(data.id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
        try {
            await deleteContract(idToDelete);
            //setDataValues((prev) => prev.filter(dev => dev.id !== idToDelete));
            setShowAlert(false);
            toast.success('Proyecto eliminado exitosamente');
            navigate('/contract');
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
    { label: 'Contrato', path: '/contract' },
  ];

  const handleAdd = () => {
    navigate('/create-contract');
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
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} buttons={[{ text: 'Crear Proyecto', action: handleAdd }]} />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
                <Table
              columns={[
                {
                  header: 'Nombre',
                  accessorKey: 'user.name',
                  cell: (info) => info.getValue(),
                  meta: {
                    width: '350px',
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
                  header: 'Fecha de inicio',
                  accessorKey: 'start_date',
                  cell: (info) => info.getValue(),
                  meta: {
                    filterComponent: (column) => (
                      <input
                        type="date"
                        value={(column.getFilterValue() ?? '') as string}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    ),
                  },
                },
                {
                  header: 'Fecha de finalización',
                  accessorKey: 'end_date',
                  cell: (info) => info.getValue(),
                  meta: {
                    filterComponent: (column) => (
                      <input
                        type="date"
                        value={(column.getFilterValue() ?? '') as string}
                        onChange={(e) => column.setFilterValue(e.target.value)}
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

export default Contract;