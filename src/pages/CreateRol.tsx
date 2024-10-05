import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { fetchRol, createRol, editRol } from '../api/rolApi';
import Spinner from '../components/Spinner';
import { fetchPermissions } from '../api/permissionApi';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';

const CreateRol = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const data = await fetchPermissions();
        const formatted = data.map((permission) => ({
          value: permission.id,
          label: permission.name,
        }));
        
        if (id) {
          try {
            const response = await fetchRol(id);
            const { name, permissions } = response;
            const selectedPermissions = permissions.map((perm) => (perm.id));
            setDefaultValues({
              name,
              id: selectedPermissions,
            });
          } catch (error) {
            setError(`Error al cargar los datos del rol. ${error}`);
          } finally {
            setLoading(false);
          }
        }
        setPermissions(formatted);
      } catch (error) {
        setError(`Error al cargar los datos del rol. ${error}`);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      data.permissions = data.id;
      if (id) {
        await editRol(data, Number(id));
      } else {
        await createRol(data);
      }
      setError(null);
      navigate('/roles');
    } catch (error) {
      setError(id ? 'Error al actualizar el rol.' : `Error al crear el rol. ${error}`);
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
      name: 'id',
      label: 'Permisos',
      type: 'select',
      options: permissions,
      validation: { required: 'Al menos un permiso es requerido' },
      isMulti: true, // Habilitar multiselección
    },
  ];

  const breadcrumbItems = [
    { label: 'Roles', path: '/dashboard' },
    { label: id ? 'Editar Rol' : 'Crear Rol', path: id ? `/edit-rol/${id}` : '/create-rol' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
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
              permissions.length > 0 && (
                <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues} />
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateRol;
