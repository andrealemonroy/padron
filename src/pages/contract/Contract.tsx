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
import { deleteContract, fetchContracts, fetchImportData } from '../../api/contractApi';
import { HiCloudUpload, HiUserAdd } from 'react-icons/hi';
import Button from '../../components/Button';

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

  const handleAdd = () => {
    navigate('/create-contract');
  };

  const breadcrumbItems = [
    { label: 'Contratos', path: '/contract' },
  ];

  const handleAddMassive = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast.error('No se seleccionó ningún archivo');
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      
      const result = await fetchImportData(formData);
      toast.success('Usuarios importados exitosamente');
      console.log(result);
      const data = await fetchContracts();
      setDataValues(data);
    } catch (error) {
      console.error('Error al importar usuarios:', error);
      toast.error('Error al importar usuarios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const addButton = (
    <div className="flex space-x-4">
      <Button
        type="button"
        className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-md flex gap-1 items-center"
        onClick={handleAdd}
      >
        <HiUserAdd size={20} />
        <span className="max-xs:sr-only">Crear Contrato</span>
      </Button>
      <label className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer flex gap-1 items-center">
        <input
          type="file"
          className="hidden"
          onChange={handleAddMassive}
          accept=".xlsx,.xls,.csv"
        />
        <HiCloudUpload size={20} />
        <span className="max-xs:sr-only">Importar Contratos</span>
      </label>
    </div>
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
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} >
              {addButton}
              </Breadcrumb>
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