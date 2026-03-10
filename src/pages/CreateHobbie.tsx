import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';
import { createHobbie, editHobbie, fetchHobbie, fetchHobbiesList } from '../api/hobbyApi';

const CreateHobbie = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [hobbies, setHobbies] = useState(null);

  // NUEVO: Estado para saber qué botón se presionó
  const [tipoAccion, setTipoAccion] = useState('actualizar');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchHobbiesList();
        const formatted = data.map((value) => ({
          value: value.id,
          label: value.description,
        }));
        setHobbies(formatted);

        if (id) {
          const response = await fetchHobbie(id);
            const { name, hobbies } = response;
            const selected = hobbies.map((perm) => (perm.hobby_id));
            console.log(selected)
            setDefaultValues({
              name,
              hoobies: selected,
            });
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
    try {
      console.log(data);
      if (id) {
        await editHobbie(data, Number(id), tipoAccion);
      } else {
        await createHobbie({ ...data, accion: 'grabar' });
      }
      setError(null);
      navigate('/hobbie');
    } catch (error) {
      setError(id ? 'Error al actualizar el permission.' : `Error al crear el permission. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'hoobies',
      label: 'Hoobie',
      type: 'select',
      options: hobbies,
      isMulti: true,
      validation: { required: 'Hoobie es requerida' },
    },
  ];
  
  

  const breadcrumbItems = [
    { label: 'Hobbies', path: '/hobbie' },
    { label: id ? 'Editar Hobby' : 'Crear Hobby', path: id ? `/edit-hobbie/${id}` : '/create-hobbie' },
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
                        Guardar Hobbies
                      </button>
                    )}
                  </div>
                </DynamicForm>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateHobbie;
