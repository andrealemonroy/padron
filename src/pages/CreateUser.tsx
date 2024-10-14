import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DynamicForm from '../components/DynamicForm';
import Spinner from '../components/Spinner';
import { fetchRoles } from '../api/rolApi';
import { createUser, fetchUser, editUser } from '../api/userApi';
import Breadcrumb from '../components/BreadCrumb';

const CreateUser = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for all data
  const { id } = useParams<{ id: string }>(); // Detect if it's an edit
  const navigate = useNavigate(); // Initialize the navigate function
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        const rolesData = await fetchRoles();
        const formattedRoles = rolesData.map((role) => ({ value: role.id, label: role.name }));
        setRoles(formattedRoles);

        if (id) {
          const response = await fetchUser(id);
          const { name, email, roles } = response;
          setDefaultValues({
            name,
            email,
            role_id: roles[0]?.id, // Set the first role as default
          });
        }

        setLoading(false); // Data has been fetched, stop loading
      } catch (error) {
        setError(`Error al cargar los datos del usuario o los roles. ${error}`);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await editUser(data, Number(id));
      } else {
        await createUser(data);
      }
      navigate('/usuarios'); // Navigate to usuarios after success
    } catch (error) {
      setError(id ? 'Error al actualizar el usuario.' : `Error al crear el usuario. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      validation: { required: 'Nombre es requerido' },
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      validation: { required: 'Correo electrónico es requerido' },
    },
    {
      name: 'role_id',
      label: 'Rol',
      type: 'select',
      options: roles,
      validation: { required: 'El rol es requerido' },
    },
  ];

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: 'Usuarios', path: '/usuarios' },
    { label: id ? 'Editar Usuario' : 'Crear Usuario', path: `${id ? '/edit-user/' + id : '/create-user'}` },
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
                {roles.length > 0 && (
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

export default CreateUser;