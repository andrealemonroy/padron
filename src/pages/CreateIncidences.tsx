import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DynamicForm from '../components/DynamicForm';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { fetchIncidence, createIncidence, editIncidence } from '../api/incidencesApi';
import { fetchUsers } from '../api/userApi';
import { fetchQuality } from '../api/qualityApi';

interface Option {
  value: number | string;
  label: string;
}

const CreateIncidences = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          usersData,
          ratingsData,
          responseData,
        ] = await Promise.all([
          fetchUsers(),
          fetchQuality(),
          id ? fetchIncidence(id) : Promise.resolve(null),
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
      options: options.users,
      validation: { required: 'El Trabajador es requerido' },
    },
    {
      name: 'code',
      label: 'Calificación',
      type: 'select',
      options: options.ratings,
      validation: { required: 'El código es requerido' },
    },
    {
      name: 'days',
      label: 'Días',
      type: 'number',
      validation: {
        required: 'El número de días es requerido',
        min: { value: 1, message: 'El número de días debe ser positivo' },
      },
    },
    {
      name: 'hours',
      label: 'Horas',
      type: 'number',
      validation: {
        required: 'El número de horas es requerido',
        min: { value: 1, message: 'El número de horas debe ser positivo' },
      },
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
      type: 'select',
      options: [
        {
          value: 1,
          label: 'Enero',
        },
        {
          value: 2,
          label: 'Febrero',
        },
        {
          value: 3,
          label: 'Marzo',
        },
        {
          value: 4,
          label: 'Abril',
        },
        {
          value: 5,
          label: 'Mayo',
        },
        {
          value: 6,
          label: 'Junio',
        },
        {
          value: 7,
          label: 'Julio',
        },
        {
          value: 8,
          label: 'Agosto',
        },
        {
          value: 9,
          label: 'Septiembre',
        },
        {
          value: 10,
          label: 'Octubre',
        },
        {
          value: 11,
          label: 'Noviembre',
        },
        {
          value: 12,
          label: 'Diciembre',
        }
      ],
      validation: { required: 'El mes es requerido' },
    },
    {
      name: 'year',
      label: 'Año',
      type: 'select',
      options: [
        {
          value: 2024,
          label: '2024',
        },
        {
          value: 2025,
          label: '2025',
        }       
      ],
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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <>
                <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateIncidences;