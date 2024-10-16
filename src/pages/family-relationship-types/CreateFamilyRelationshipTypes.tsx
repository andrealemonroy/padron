import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { createFamilyRelationshipType, editFamilyRelationshipType, fetchFamilyRelationshipType } from '../../api/familyRelationshipTypesApi';

const CreateFamilyRelationshipTypes = () => {
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
          const response = await fetchFamilyRelationshipType(id);
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
        await editFamilyRelationshipType(data, Number(id));
        toast.success('Tipo de parentesco actualizado exitosamente');
      } else {
        await createFamilyRelationshipType(data);
        toast.success('Tipo de parentesco creado exitosamente');
      }
      setError(null);
      setTimeout(() => {
        navigate('/family-relationship-types');
      }, 2000); 
    } catch (error) {
      const errorMessage = id ? 'Error al actualizar el tipo de parentesco' : 'Error al crear el tipo de parentesco';
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
      name: 'description',
      label: 'Descripción',
      type: 'text',
      validation: { required: 'La descripción es requerida' }
    },
  ]
  ;
  
  

  const breadcrumbItems = [
    { label: 'Tipos de parentesco', path: '/family-relationship-types' },
    { label: id ? 'Editar Tipo de parentesco' : 'Crear Tipo de parentesco', path: id ? `/edit-family-relationship-types/${id}` : '/create-family-relationship-types' },
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

export default CreateFamilyRelationshipTypes;
