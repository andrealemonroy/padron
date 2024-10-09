import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { fetchUsers } from '../../api/userApi';
import { createEvaluation, editEvaluation, fetchEvaluation } from '../../api/EvaluationsApi';

const CreateEvaluation = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        const formattedUsers = data.map((value) => ({
          value: value.id,
          label: value.name,
        }));
        setUsers(formattedUsers);
        if (id) {
          const response = await fetchEvaluation(id);
          setDefaultValues(response);
        }
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
        await editEvaluation(data, Number(id));
        toast.success('Evaluación actualizado exitosamente');
      } else {
        await createEvaluation(data);
        toast.success('Evaluación creada exitosamente');
      }
      setError(null);
      setTimeout(() => {
        navigate('/evaluations');
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
      options: users,
      validation: { required: 'El ID del usuario es requerido' }
    },
    {
      name: 'evaluation_date',
      label: 'Fecha de Evaluación',
      type: 'date',
      validation: { required: 'La fecha de evaluación es requerida' }
    },
    {
      name: 'predefined_options',
      label: 'Opciones Predefinidas',
      type: 'select', // Asumiendo que es un campo de selección
      options: [
        { value: 'Option A', label: 'Opción A' },
        { value: 'Option B', label: 'Opción B' },
        { value: 'Option C', label: 'Opción C' }
      ],
      validation: { required: 'La opción predefinida es requerida' }
    },
    {
      name: 'details',
      label: 'Detalles',
      type: 'textarea', // Asumiendo que los detalles requieren un área de texto
      validation: { required: 'Los detalles son requeridos' }
    }
  ];
  
  const breadcrumbItems = [
    { label: 'Evaluaciones', path: '/evaluations' },
    { label: id ? 'Editar Evaluación' : 'Crear Evaluación', path: id ? `/edit-evaluations/${id}` : '/create-evaluations' },
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

export default CreateEvaluation;