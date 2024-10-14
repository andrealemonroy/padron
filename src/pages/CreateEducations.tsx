import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { fetchEducation, editEducation } from '../api/EducationsApi';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';

const CreateEducations = () => {
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
          const response = await fetchEducation(id);
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
        await editEducation(data, Number(id));
      }
      setError(null);
      navigate('/educations');
    } catch (error) {
      setError(id ? 'Error al actualizar el permission.' : `Error al crear el permission. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'graduation_year',
      label: 'Año de Graduación',
      type: 'number',
      validation: { required: 'El año de graduación es requerido' },
    },
    {
      name: 'educational_level',
      label: 'Nivel Educativo',
      type: 'text',
      validation: { required: 'El nivel educativo es requerido' },
    },
    {
      name: 'study_center',
      label: 'Centro de Estudios',
      type: 'text',
      validation: { required: 'El centro de estudios es requerido' },
    },
    {
      name: 'profession_name',
      label: 'Nombre de la Profesión',
      type: 'text',
      validation: { required: 'El nombre de la profesión es requerido' },
    },
  ];
  

  const breadcrumbItems = [
    { label: 'Datos Educativos', path: '/educations' },
    { label: id ? 'Editar Educativos' : 'Crear Educativos', path: id ? `/educations/${id}` : '/educations' },
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

export default CreateEducations;
