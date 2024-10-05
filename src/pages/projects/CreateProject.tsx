import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { createProject, editProject, fetchProject } from '../../api/projectApi';

const CreateProject = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Effect running');
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await fetchProject(id);
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
      console.log(data);
      if (id) {
        await editProject(data, Number(id));
        toast.success('Proyecto actualizado exitosamente');
      } else {
        await createProject(data);
        toast.success('Proyecto creado exitosamente');
      }
      setError(null);
      setTimeout(() => {
        navigate('/projects');
      }, 2000); 
    } catch (error) {
      const errorMessage = id ? 'Error al actualizar el proyecto' : 'Error al crear el proyecto';
      toast.error(`${errorMessage}. ${error}`);
      setError(`${errorMessage}. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'code',
      label: 'Código',
      type: 'text',
      validation: { required: 'El código es requerido' }
    },
    {
      name: 'name',
      label: 'Nombre del Proyecto',
      type: 'text',
      validation: { required: 'El nombre del proyecto es requerido' }
    },
    {
      name: 'client',
      label: 'Cliente',
      type: 'text',
      validation: { required: 'El cliente es requerido' }
    },
    {
      name: 'start_date',
      label: 'Fecha de Inicio',
      type: 'date',
      validation: { required: 'La fecha de inicio es requerida' }
    },
    {
      name: 'end_date',
      label: 'Fecha de Finalización',
      type: 'date',
      validation: { required: 'La fecha de finalización es requerida' }
    },
  ]
  ;
  
  

  const breadcrumbItems = [
    { label: 'Proyectos', path: '/projects' },
    { label: id ? 'Editar Proyecto' : 'Crear Proyecto', path: id ? `/edit-project/${id}` : '/create-project' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
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

export default CreateProject;
