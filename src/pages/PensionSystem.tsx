import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { fetchPensionSystemses } from '../api/pensionSystemApi';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { getActions } from '../utils/actions';
import { HiCloudUpload } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { fetchImportPensionSystem } from '../api/ImportsApi';

const PensionSystem = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pensionSystemses, setPensionSystemses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPensionSystemses();
        setPensionSystemses(data);
      } catch (error) {
        console.error('Error fetching :', error);
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
              //await editPensionSystems(idToDelete);
              setPensionSystemses((prev) => prev.filter(dev => dev.id !== idToDelete));
              setShowAlert(false);
              navigate('/pension-systems');
          } catch (error) {
              console.error('Error al eliminar:', error);
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
    navigate(`/edit-pension-systems/${data.id}`);
  };

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
        console.log(formData);
        setLoading(true);
        try {
          const result = await fetchImportPensionSystem(formData);
          console.log('Trabajadores importados exitosamente:', result);
          toast.success('Trabajadores importados exitosamente');
        } catch (error) {
          console.error('Error al importar usuarios:', error);
          toast.error('Error al importar usuarios. Por favor, intente de nuevo.');
        } finally {
          setLoading(false);
        }
  };

  const breadcrumbItems = [
    { label: 'Sistema Pensionario', path: '/pension-systems' },
  ];

  const addButton = (
      <div className="flex space-x-4">
        <label className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer flex gap-1 items-center">
          <input
            type="file"
            className="hidden"
            onChange={handleAddMassive}
            accept=".xlsx,.xls,.csv"
          />
          <HiCloudUpload size={20} />
          <span className="max-xs:sr-only">Importar</span>
        </label>
      </div>
    );
    
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
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} >{addButton}</Breadcrumb>
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
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
                  header: 'Fondo de Pensión',
                  accessorKey: 'pension_system.pension_line.description',
                  cell: (info) => info.getValue(),
                  meta: {
                    filterComponent: (column) => (
                      <input
                        type="text"
                        value={(column.getFilterValue() ?? '') as string}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                        placeholder="Filtrar Fondo de Pensión"
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    ),
                  },
                },
                {
                  header: 'Código AFP',
                  accessorKey: 'pension_system.cuspp',
                  cell: (info) => info.getValue(),
                  meta: {
                    filterComponent: (column) => (
                      <input
                        type="text"
                        value={(column.getFilterValue() ?? '') as string}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                        placeholder="Filtrar Código AFP"
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    ),
                  },
                },
                {
                  header: 'Tipo de Comisión',
                  accessorKey: 'pension_system.commission_type',
                  cell: (info) => info.getValue(),
                  meta: {
                    filterComponent: (column) => (
                      <input
                        type="text"
                        value={(column.getFilterValue() ?? '') as string}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                        placeholder="Filtrar Tipo de Comisión"
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    ),
                  },
                },
              ]}
              data={pensionSystemses}
              actions={getActions({ handleEdit, handleDelete })}
            />
            )}
            

          </div>

        </main>
      </div>
    </div>
  );
};

export default PensionSystem;
