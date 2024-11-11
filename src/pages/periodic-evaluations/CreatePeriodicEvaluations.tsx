import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { createPeriodicEvaluation, editPeriodicEvaluation, fetchPeriodicEvaluation } from '../../api/periodicEvaluationsApi';
import { fetchUsers } from '../../api/userApi';
import { fetchQualityRatings } from '../../api/qualityRatingsApi';

interface Option {
  value: number | string;
  label: string;
}

const CreatePeriodicEvaluation = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<{
    users: Option[];
    ratings: Option[];
  }>({
    users: [],
    ratings: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [
          usersData,
          ratingsData,
          responseData,
        ] = await Promise.all([
          fetchUsers(),
          fetchQualityRatings(),
          id ? fetchPeriodicEvaluation(id) : Promise.resolve(null),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatOptions = (data: any[]): Option[] =>
          data.map((value) => ({
            value: value.id,
            label: value.description ?? value.name,
          }));

          setOptions({
            users: formatOptions(usersData),
            ratings: formatOptions(ratingsData),
          });
        
        setDefaultValues(responseData);
      } catch (error) {
        setError(`Error al cargar los datos de la evaluación. ${error}`);
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
        await editPeriodicEvaluation(data, Number(id));
        toast.success('Evaluación actualizado exitosamente');
      } else {
        await createPeriodicEvaluation(data);
        toast.success('Evaluación creada exitosamente');
      }
      setError(null);
      setTimeout(() => {
        navigate('/periodic-evaluations');
      }, 2000); 
    } catch (error) {
      const errorMessage = id ? 'Error al actualizar la evaluación' : 'Error al crear la evaluación';
      toast.error(`${errorMessage}. ${error}`);
      setError(`${errorMessage}. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'user_id',
      label: 'Usuario',
      type: 'select',
      options: options.users,
      validation: { required: 'El ID del usuario es requerido' }
    },
    {
      name: 'period',
      label: 'Período',
      type: 'number',
      validation: { required: 'El período es requerido' }
    },
    {
      name: 'date',
      label: 'Fecha de Evaluación',
      type: 'date',
      validation: { required: 'La fecha de evaluación es requerida' }
    },
    {
      name: 'rating',
      label: 'Calificación',
      type: 'select',
      options: options.ratings,
      validation: { required: 'La calificación es requerida' }
    },
    {
      name: 'development_quality',
      label: 'Calidad de Desarrollo',
      type: 'number',
      validation: { required: 'La calidad de desarrollo es requerida' }
    },
    {
      name: 'software_management',
      label: 'Gestión de Software',
      type: 'number',
      validation: { required: 'La gestión de software es requerida' }
    },
    {
      name: 'learning_capacity',
      label: 'Capacidad de Aprendizaje',
      type: 'number',
      validation: { required: 'La capacidad de aprendizaje es requerida' }
    },
    {
      name: 'process_compliance',
      label: 'Cumplimiento de Procesos',
      type: 'number',
      validation: { required: 'El cumplimiento de procesos es requerido' }
    }
  ];
  
  const breadcrumbItems = [
    { label: 'Evaluación Periodico', path: '/periodic-evaluations' },
    { label: id ? 'Editar Evaluación Periodico' : 'Crear Evaluación Periodico', path: id ? `/edit-periodic-evaluations/${id}` : '/create-periodic-evaluations' },
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

export default CreatePeriodicEvaluation;
