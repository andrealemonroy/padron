import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DynamicForm from '../components/DynamicForm';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { fetchIncidence, createIncidence, editIncidence } from '../api/incidencesApi';
import { fetchUsers } from '../api/userApi';

const CreateIncidences = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const usersData = await fetchUsers();
        const formatted = usersData.map((role) => ({ value: role.id, label: role.name }));
        setUsers(formatted);

        if (id) {
          const response = await fetchIncidence(id);
          setDefaultValues(response);
        }

        setLoading(false);
      } catch (error) {
        setError(`Error al cargar los datos del usuario o los roles. ${error}`);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      if (id) {
        await editIncidence(data, Number(id));
      } else {
        await createIncidence(data);
      }
      navigate('/incidences');
    } catch (error) {
      setError(id ? 'Error al actualizar el incidences.' : `Error al crear el incidences. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'user_id',
      label: 'Trabajador',
      type: 'select',
      options: users,
      validation: { required: 'El Trabajador es requerido' },
    },
    {
      name: 'code',
      label: 'Código',
      type: 'text',
      validation: { required: 'El código es requerido' },
    },
    {
      name: 'days',
      label: 'Días',
      type: 'number',
      validation: { required: 'El número de días es requerido' },
    },
    {
      name: 'hours',
      label: 'Horas',
      type: 'number',
      validation: { required: 'Las horas son requeridas' },
    },
    {
      name: 'amount',
      label: 'Monto',
      type: 'text',
      validation: { required: 'El monto es requerido' },
    },
    {
      name: 'month',
      label: 'Mes',
      type: 'number',
      validation: { required: 'El mes es requerido' },
    },
    {
      name: 'year',
      label: 'Año',
      type: 'number',
      validation: { required: 'El año es requerido' },
    },
  ];

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: 'Incidencias Mensuales', path: '/incidences' },
    { label: id ? 'Editar Incidencias Mensuales' : 'Crear Incidencias Mensuales', path: `${id ? '/edit-incidences/' + id : '/create-incidences'}` },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={{ name: 'Luis Monroy' }} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <>
                {users.length > 0 && (
                  <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateIncidences;