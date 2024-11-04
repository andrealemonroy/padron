import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { fetchPensionSystems, editPensionSystems } from '../api/pensionSystemApi';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';

const CreatePensionSystem = () => {
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
    
        if (id) {
          const response = await fetchPensionSystems(id);
          setDefaultValues(response);
        }
      } catch (error) {
        setError(`Error al cargar los datos del fetchPensionSystems. ${error}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await editPensionSystems(data, Number(id));
      }
      setError(null);
      navigate('/pension-systems');
    } catch (error) {
      setError(id ? 'Error al actualizar el sistema pensionario.' : `Error al crear el sistema pensionario. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'pension_system',
      label: 'Fondo de Pensión',
      type: 'text',
      validation: { required: 'Fondo de Pensión es requerido' },
    },
    {
      name: 'commission_type',
      label: 'AFP',
      type: 'text',
      validation: { required: 'AFP es requerido' },
    },
    {
      name: 'cuspp',
      label: 'Código AFP',
      type: 'text',
      validation: { required: 'Código AFP es requerido' },
    },
  ];
  
  

  const breadcrumbItems = [
    { label: 'Sistema pensionario', path: '/pension-systems' },
    { label: id ? 'Editar sistema pensionario' : 'Crear sistema pensionario', path: id ? `/edit-pension-systems/${id}` : '/create-pension-systems' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
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

export default CreatePensionSystem;
