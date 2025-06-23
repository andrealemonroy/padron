import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';
import { editWorkCondition, fetchWorkCondition } from '../api/workConditionApi';


const CreateWorkCondition = () => {
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
          const response = await fetchWorkCondition(id);
            setDefaultValues(response);
        }
      } catch (error) {
        setError(`Error al cargar los datos del permission. ${error}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      if (id) {
        await editWorkCondition(data, Number(id));
      }
      setError(null);
      navigate('/work-condition');
    } catch (error) {
      setError(id ? 'Error al actualizar el permission.' : `Error al crear el permission. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'remote_work_condition',
      label: 'Trabajo remoto',
      type: 'select',
      options: [
        {
          value: 2,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'El año de Trabajo remoto es requerido' },
    },
    {
      name: 'computer_type',
      label: 'Tipo de Computadora',
      type: 'select',
      options: [
        {
          value: 1,
          label: 'Laptop',
        },
        {
          value: 2,
          label: 'PC de escritorio',
        }
      ],
      validation: { required: 'El nivel Tipo de Computadora es requerido' },
    },
    {
      name: 'work_type',
      label: 'Tipo Trabajo',
      type: 'text',
      validation: { required: 'El Tipo Trabajo es requerido' },
    },
    {
      name: 'internet_connection',
      label: 'Conexión a Internet',
      type: 'select',
      options: [
        {
          value: 1,
          label: 'FIJA',
        },
        {
          value: 2,
          label: 'WIFI',
        }
      ],
      validation: { required: 'El Conexión a Internet es requerido' },
    },
    {
      name: 'adequate_home_environment',
      label: 'Ambiente Hogareño Adecuado',
      type: 'select',
      options: [
        {
          value: 2,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'El Ambiente en Casa es requerido' },
    },
    {
      name: 'home_furniture',
      label: 'Ambiente en Casa',
      type: 'select',
      options: [
        {
          value: 1,
          label: 'Mesa',
        },
        {
          value: 2,
          label: 'Escritorio para el trabajo',
        },
        {
          value: 3,
          label: 'Silla ergonómica',
        }
      ],
      validation: { required: 'El Ambiente en Casa es requerido' },
    },
  ];
  

  const breadcrumbItems = [
    { label: 'Trabajo Remoto', path: '/work-condition' },
    { label: id ? 'Editar Trabajo Remoto' : 'Crear Trabajo Remoto', path: id ? `/work-condition/${id}` : '/work-condition' },
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

export default CreateWorkCondition;
