import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { createQuality, editQuality, fetchQualitys } from '../../api/qualityApi';

const CreateQualirfication = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null); // Asegurarse de limpiar errores previos
        if (id) {
          const response = await fetchQualitys(id);
          setDefaultValues(response);
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error); // Agregar logging para depuración
        setError(`Error al cargar los datos del proyecto. ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      setLoading(true); // Mostrar spinner durante la operación
      if (id) {
        await editQuality(data, Number(id));
        toast.success('Calificador actualizado exitosamente');
      } else {
        await createQuality(data);
        toast.success('Calificador creado exitosamente');
      }
      setError(null);
      setTimeout(() => {
        navigate('/qualirfication');
      }, 2000); 
    } catch (error) {
      console.error('Error en el envío del formulario:', error); // Agregar logging para depuración
      const errorMessage = id ? 'Error al actualizar el calificador' : 'Error al crear el calificador';
      toast.error(`${errorMessage}. ${error.message || error}`);
      setError(`${errorMessage}. ${error.message || error}`);
    } finally {
      setLoading(false); // Asegurarse de ocultar el spinner
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
      name: 'description',
      label: 'Descripción',
      type: 'text',
      validation: { required: 'La descripción es requerida' }
    },
  ]
  ;
  
  

  const breadcrumbItems = [
    { label: 'Calificacion', path: '/qualirfication' },
    { label: id ? 'Editar Calificacion' : 'Crear Calificacion', path: id ? `/edit-qualirfication/${id}` : '/create-qualirfication' },
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

export default CreateQualirfication;
