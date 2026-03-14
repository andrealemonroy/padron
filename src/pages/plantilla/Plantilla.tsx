import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
// 1. IMPORTAR useNavigate PARA REDIRIGIR AL FORMULARIO
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import Alert from '../../components/Alert';
import { getActions } from '../../utils/actions';
// 2. CAMBIAR EL ICONO A UNO DE CREAR
import { HiDownload, HiPlus } from 'react-icons/hi';
import { fetchTemplates, deleteTemplate } from '../../api/templateApi';
import Button from '../../components/Button';

interface TemplateData {
  id: number;
  name: string;
  original_filename: string;
  is_active: number;
  created_at: string;
  file_path: string;
}

const DocumentTemplates = () => {
  // 3. INICIALIZAR useNavigate
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataValues, setDataValues] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data: TemplateData[] = await fetchTemplates();
      setDataValues(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // 4. FUNCIÓN PARA IR A EDITAR LA PLANTILLA
  const handleEdit = (template: TemplateData) => {
    navigate(`/edit-template/${template.id}`);
  };

  // 5. FUNCIÓN PARA IR AL FORMULARIO DE CREACIÓN
  const handleAdd = () => {
    navigate('/create-template');
  };

  const handleDownloadTemplate = async (template: TemplateData) => {
    const fileUrl = `${import.meta.env.VITE_API_URL_BASE}/storage/${template.file_path}`;
    window.open(fileUrl, '_blank');
  };

  const handleDelete = (template: TemplateData) => {
    setShowAlert(true);
    setIdToDelete(template.id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteTemplate(idToDelete);
        setShowAlert(false);
        toast.success('Plantilla eliminada exitosamente');
        await loadTemplates();
      } catch (error) {
        console.error('Error al eliminar:', error);
        toast.error('Error al eliminar la plantilla');
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
    { label: 'Plantillas de Contrato', path: '/templates' },
  ];

  // 6. ACTUALIZAR EL BOTÓN PARA QUE REDIRIJA AL FORMULARIO
  const addButton = (
    <div className="flex space-x-4">
      <Button
        type="button"
        className="w-auto px-4 h-10 btn bg-blue-600 text-white hover:bg-blue-700 rounded-md flex gap-2 items-center transition-colors"
        onClick={handleAdd}
      >
        <HiPlus size={20} />
        <span>Crear Plantilla</span>
      </Button>
    </div>
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      {showAlert && (
        <Alert
          message="¿Estás seguro de que deseas eliminar esta plantilla?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              <Breadcrumb items={breadcrumbItems}>
                {addButton}
              </Breadcrumb>
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <Table
                columns={[
                  {
                    header: 'Nombre de la Plantilla',
                    accessorKey: 'name',
                    cell: (info) => <span className="font-semibold text-gray-800">{info.getValue() as string}</span>,
                    meta: { width: '300px' },
                  },
                  {
                    header: 'Archivo Original',
                    accessorKey: 'original_filename',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Estado',
                    accessorKey: 'is_active',
                    cell: (info) => (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${info.getValue() === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {info.getValue() === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    ),
                  },
                  {
                    header: 'Fecha de Subida',
                    accessorKey: 'created_at',
                    cell: (info) => {
                      const date = new Date(info.getValue() as string);
                      return date.toLocaleDateString();
                    },
                  },
                  {
                    header: 'Descargar Original',
                    id: 'download',
                    cell: ({ row }) => (
                      <button
                        onClick={() => handleDownloadTemplate(row.original)}
                        className="text-blue-500 hover:text-blue-700 p-2"
                        title="Descargar Plantilla Base"
                      >
                        <HiDownload size={22} />
                      </button>
                    ),
                    meta: { width: '100px' },
                  },
                ]}
                data={dataValues}
                // 7. AGREGAR handleEdit a las acciones
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentTemplates;