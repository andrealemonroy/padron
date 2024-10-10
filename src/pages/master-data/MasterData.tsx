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
import { deleteMasterData, fetchMasterDatas } from '../../api/masterDataApi';
import { fetchImportMasterData } from '../../api/ImportsApi';

const MasterData = () => {
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
        const data = await fetchMasterDatas();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/edit-master-data/${id}`);
  };

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
        try {
            await deleteMasterData(idToDelete);
            setDataValues((prev) => prev.filter(dev => dev.id !== idToDelete));
            setShowAlert(false);
            toast.success('Master Data Base eliminado exitosamente');
            navigate('/master-data');
        } catch (error) {
            console.error('Error al eliminar el Master Data Base:', error);
            toast.error('Error al eliminar el Master Data Base');
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
    { label: 'Master Data Base', path: '/master-data' },
  ];

  const handleAdd = () => {
    navigate('/create-master-data');
  };

  const handleAddMassiveMasterData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast.error('No se seleccionó ningún archivo');
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const result = await fetchImportMasterData(formData);
      console.log('Master Data Base importados exitosamente:', result);
      toast.success('Master Data Base importados exitosamente');
    } catch (error) {
      console.error('Error al importar Master Data Base:', error);
      toast.error('Error al importar Master Data Base. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
      navigate('/master-data');
    }
  };

  const addButton = (
    <>
        <Button 
          type='button' 
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
          <span className="max-xs:sr-only">Crear Master Data Base</span>
        </Button>

        <label 
          className="w-80 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer"
        >
          <input
            type="file"
            className="hidden"
            onChange={handleAddMassiveMasterData}
            accept=".xlsx,.xls,.csv"
          />
          <svg
            className="fill-current shrink-0 xs:hidden"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="max-xs:sr-only">Crear Data Base Masivo</span>
        </label>
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
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <>
                <Table
              columns={[
                {
                  header: 'Nombres',
                  accessorKey: 'name',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Tipo de Documento',
                  accessorKey: 'document.description',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Documento',
                  accessorKey: 'DNINumber',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Apellidos',
                  accessorKey: 'surname1',
                  cell: (info) => info.getValue(),
                },
              ]}
              data={dataValues}
              fetchData={fetchMasterDatas}
              pageCount={1}
              addButton={addButton}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
              </>
            )}
            

          </div>

        </main>
      </div>
    </div>
  );
};

export default MasterData;
