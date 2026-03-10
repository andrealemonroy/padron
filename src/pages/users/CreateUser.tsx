import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DynamicForm from '../../components/DynamicForm';
import Spinner from '../../components/Spinner';
import { fetchRoles } from '../../api/rolApi';
import { createUser, fetchUser, editUser } from '../../api/userApi';
import Breadcrumb from '../../components/BreadCrumb';

const CreateUser = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // NUEVO: Estado para saber qué botón se presionó
  const [tipoAccion, setTipoAccion] = useState('actualizar');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const rolesData = await fetchRoles();
        const formattedRoles = rolesData.map((role) => ({ value: role.id, label: role.name }));
        setRoles(formattedRoles);

        if (id) {
          const response = await fetchUser(id);
          const { name, email, roles } = response;
          setDefaultValues({
            name,
            email,
            role_id: roles[0]?.id,
          });
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
    try {
      let response;
      if (id) {
        // NUEVO: Pasamos el tipoAccion al servicio editUser
        response = await editUser(data, Number(id), tipoAccion);
      } else {
        // Si es creación nueva, siempre debería guardar en auditoría ('grabar')
        response = await createUser({ ...data, accion: 'grabar' });
      }
      console.log(response);
      navigate('/usuarios');
    } catch (error) {
      console.log(error.response?.data?.errors);
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        const errorMessage = validationErrors[firstErrorKey].message || 'Error desconocido';
        setError(`Error: ${errorMessage}`);
      } else {
        setError(id ? 'Error al actualizar el usuario.' : `Error al crear el usuario: ${error.message}`);
      }
    }
  };

  const formFields = [
    { name: 'name', label: 'Nombre', type: 'text', validation: { required: 'Nombre es requerido' } },
    { name: 'email', label: 'Correo electrónico', type: 'email', validation: { required: 'Correo electrónico es requerido' } },
    { name: 'role_id', label: 'Rol', type: 'select', options: roles, validation: { required: 'El rol es requerido' } },
  ];

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
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <>
                {roles.length > 0 && (
                  <div className="bg-white p-6 shadow rounded-sm border border-slate-200">
                    <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues}>

                      {/* LÓGICA CONDICIONAL DE BOTONES */}
                      <div className="flex gap-4 mt-6 justify-end">

                        {id ? (
                          // 🔵 SI TIENE ID (MODO EDICIÓN): MOSTRAMOS LOS DOS BOTONES
                          <>
                            <button
                              type="submit"
                              className="btn bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600"
                              onClick={() => setTipoAccion('actualizar')}
                            >
                              Actualizar (Sin historial)
                            </button>

                            <button
                              type="submit"
                              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                              onClick={() => setTipoAccion('grabar')}
                            >
                              Grabar (Crear historial)
                            </button>
                          </>
                        ) : (
                          // 🟢 SI NO TIENE ID (MODO CREACIÓN): MOSTRAMOS UN SOLO BOTÓN
                          <button
                            type="submit"
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                            onClick={() => setTipoAccion('grabar')}
                          >
                            Guardar Usuario
                          </button>
                        )}

                      </div>

                    </DynamicForm>
                  </div>
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