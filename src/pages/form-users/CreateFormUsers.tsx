import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { createFormUser, editFormUser, fetchFormUser } from '../../api/formUserApi';
import { fetchUsers } from '../../api/userApi';
import { fetchFormStatus } from '../../api/formStatusApi';
import { fetchFormType } from '../../api/formTypeApi';

const CreateProject = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState([]);
  const [formStatus, setFormStatus] = useState([]);
  const [formType, setFormType] = useState([]);

  useEffect(() => {
    console.log('Effect running');
    const load = async () => {
      try {
        setLoading(true);
        const usersData = await fetchUsers();
        const formatted = usersData.map((value) => ({ value: value.id, label: value.name }));
        setUsers(formatted);
        const formStatusData = await fetchFormStatus();
        const formattedFormStatus = formStatusData.map((value) => ({ value: value.id, label: value.description }));
        setFormStatus(formattedFormStatus);
        const formTypeData = await fetchFormType();
        const formattedFormType = formTypeData.map((role) => ({ value: role.id, label: role.description }));
        setFormType(formattedFormType);
        if (id) {
          const response = await fetchFormUser(id);
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
        await editFormUser(data, Number(id));
        toast.success('Proyecto actualizado exitosamente');
      } else {
        await createFormUser(data);
        toast.success('Proyecto creado exitosamente');
      }
      setError(null);
      setTimeout(() => {
        navigate('/form');
      }, 2000); 
    } catch (error) {
      const errorMessage = id ? 'Error al actualizar el proyecto' : 'Error al crear el proyecto';
      toast.error(`${errorMessage}. ${error}`);
      setError(`${errorMessage}. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      validation: { required: 'La descripción es requerida' }
    },
    {
      name: 'user_id',
      label: 'Usuario',
      type: 'select',
      options: users,
      validation: { required: 'El usuario es requerido' }
    },
    {
      name: 'form_status_id',
      label: 'Estado',
      type: 'select',
      options: formStatus,
      validation: { required: 'El estado es requerido' }
    },
    {
      name: 'form_type_id',
      label: 'Tipo',
      type: 'select',
      options: formType,
      validation: { required: 'El tipo es requerido' }
    },
  ]
  ;
  
  

  const breadcrumbItems = [
    { label: 'Formularios', path: '/form' },
    { label: id ? 'Editar Formulario' : 'Crear Formulario', path: id ? `/edit-form/${id}` : '/create-form' },
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

export default CreateProject;
