import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { fetchWorkExperience, editWorkExperiences } from '../api/WorkExperiencesApi';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';

const CreateWorkExperiences = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const user = {
    name: 'Luis Monroy',
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        if (id) {
          const response = await fetchWorkExperience(id);
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
        await editWorkExperiences(data, Number(id));
      }
      setError(null);
      navigate('/work-experiences');
    } catch (error) {
      setError(id ? 'Error al actualizar el permission.' : `Error al crear el permission. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'last_experience_start_date',
      label: 'Fecha de Inicio de Última Experiencia',
      type: 'date',
      validation: { required: 'Fecha de inicio es requerida' },
    },
    {
      name: 'last_experience_end_date',
      label: 'Fecha de Fin de Última Experiencia',
      type: 'date',
      validation: { required: 'Fecha de fin es requerida' },
    },
    {
      name: 'last_experience_organization',
      label: 'Organización de Última Experiencia',
      type: 'text',
      validation: { required: 'Organización es requerida' },
    },
    {
      name: 'last_experience_dismissal_reason',
      label: 'Razón de Despido de Última Experiencia',
      type: 'text',
      validation: { required: 'Razón de despido es requerida' },
    },
    {
      name: 'last_experience_salary',
      label: 'Salario de Última Experiencia',
      type: 'number',
      validation: { required: 'Salario es requerido' },
    },
    {
      name: 'penultimate_experience_start_date',
      label: 'Fecha de Inicio de Penúltima Experiencia',
      type: 'date',
      validation: { required: 'Fecha de inicio es requerida' },
    },
    {
      name: 'penultimate_experience_end_date',
      label: 'Fecha de Fin de Penúltima Experiencia',
      type: 'date',
      validation: { required: 'Fecha de fin es requerida' },
    },
    {
      name: 'penultimate_experience_organization',
      label: 'Organización de Penúltima Experiencia',
      type: 'text',
      validation: { required: 'Organización es requerida' },
    },
    {
      name: 'penultimate_experience_dismissal_reason',
      label: 'Razón de Despido de Penúltima Experiencia',
      type: 'text',
      validation: { required: 'Razón de despido es requerida' },
    },
    {
      name: 'penultimate_experience_salary',
      label: 'Salario de Penúltima Experiencia',
      type: 'number',
      validation: { required: 'Salario es requerido' },
    },
  ];
  
  

  const breadcrumbItems = [
    { label: 'Datos basicos', path: '/basic' },
    { label: id ? 'Editar Datos basicos' : 'Crear Datos basicos', path: id ? `/edit-basic/${id}` : '/create-basic' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />
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

export default CreateWorkExperiences;
