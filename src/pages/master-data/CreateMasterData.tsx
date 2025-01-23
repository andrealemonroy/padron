import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { createMasterData, editMasterData, fetchMasterData } from '../../api/masterDataApi';
import { fetchDocument } from '../../api/documentApi';

const CreateMasterData = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocument] = useState([]);

  useEffect(() => {
    console.log('Effect running');
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchDocument();
        const formattedDocument = data.map((value) => ({
          value: value.id,
          label: value.description,
        }));
        setDocument(formattedDocument);
        if (id) {
          const response = await fetchMasterData(id);
          setDefaultValues(response);
        }
      } catch (error) {
        setError(`Error al cargar los datos del projects. ${error}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      
      if (id) {
        await editMasterData(data, Number(id));
        toast.success('Registro actualizado exitosamente');
      } else {
        await createMasterData(data);
        toast.success('Master Data Base creado exitosamente');
      }
      setError(null);
      setTimeout(() => {
        navigate('/master-data');
      }, 2000); 
    } catch (error) {
      const errorMessage = id ? 'Error al actualizar el Master Data Base' : 'Error al crear el Master Data Base';
      toast.error(`${errorMessage}. ${error}`);
      setError(`${errorMessage}. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'codeid',
      label: 'Código ID',
      type: 'text',
      validation: { required: 'El código ID es requerido' }
    },
    {
      name: 'codigo',
      label: 'Código',
      type: 'text',
      validation: { required: 'El código ID es requerido' }
    },
    {
      name: 'surname1',
      label: 'Primer Apellido',
      type: 'text',
      validation: { required: 'El primer apellido es requerido' }
    },
    {
      name: 'surname2',
      label: 'Segundo Apellido',
      type: 'text',
      validation: { required: 'El segundo apellido es requerido' }
    },
    {
      name: 'name1',
      label: 'Primer Nombre',
      type: 'text',
      validation: { required: 'El primer nombre es requerido' }
    },
    {
      name: 'name2',
      label: 'Segundo Nombre',
      type: 'text',
      validation: { required: 'El segundo nombre es requerido' }
    },
    {
      name: 'name3',
      label: 'Tercer Nombre',
      type: 'text',
      validation: { required: 'El tercer nombre es requerido' }
    },
    {
      name: 'DNINumber',
      label: 'Número de Documento',
      type: 'text',
      validation: { required: 'El número de documento es requerido' }
    },
    {
      name: 'DNIType',
      label: 'Tipo de Documento',
      type: 'select',
      options: documents,
      validation: { required: 'El tipo de documento es requerido' }
    },
    {
      name: 'birthDate',
      label: 'Fecha de Nacimiento',
      type: 'date',
      validation: { required: 'La fecha de nacimiento es requerida' }
    },
    {
      name: 'correlative',
      label: 'Número de Identificación',
      type: 'number',
      validation: { required: 'El número de identificación es requerido' }
    },
    {
      name: 'apellidosy1Nombre',
      label: 'Apellidos y Primer Nombre',
      type: 'text',
      validation: { required: 'Apellidos y primer nombre son requeridos' }
    },
    {
      name: 'apellidosy2Nombres',
      label: 'Apellidos y Dos Nombres',
      type: 'text',
      validation: { required: 'Apellidos y dos nombres son requeridos' }
    },
    {
      name: 'apellidosy3Nombres',
      label: 'Apellidos y Tres Nombres',
      type: 'text',
      validation: { required: 'Apellidos y tres nombres son requeridos' }
    },
    {
      name: 'apellidos',
      label: 'Apellidos',
      type: 'text',
      validation: { required: 'Los apellidos son requeridos' }
    },
    {
      name: 'name',
      label: 'Nombre Completo',
      type: 'text',
      validation: { required: 'El nombre completo es requerido' }
    }
  ]
  ;
  
  

  const breadcrumbItems = [
    { label: 'Master Data Base', path: '/master-data' },
    { label: id ? 'Editar Master Data Base' : 'Crear Master Data Base', path: id ? `/edit-master-data/${id}` : '/create-master-data' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues} />
            )}
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default CreateMasterData;
