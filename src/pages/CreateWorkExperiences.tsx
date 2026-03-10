import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';
import { editWorkExperiences, createWorkExperiences, fetchWorkExperience } from '../api/workExperiencesApi';

const CreateWorkExperiences = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // NUEVO: Estado para saber qué botón se presionó
  const [tipoAccion, setTipoAccion] = useState('actualizar');

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
        await editWorkExperiences(data, Number(id), tipoAccion);
      } else {
        await createWorkExperiences({ ...data, accion: 'grabar' });
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
    },
    {
      name: 'last_experience_end_date',
      label: 'Fecha de Fin de Última Experiencia',
      type: 'date',
    },
    {
      name: 'last_experience_organization',
      label: 'Organización de Última Experiencia',
      type: 'text',
    },
    {
      name: 'last_experience_dismissal_reason',
      label: 'Razón de Despido de Última Experiencia',
      type: 'text',
    },
    {
      name: 'last_experience_salary',
      label: 'Salario de Última Experiencia',
      type: 'number',
    },
    {
      name: 'penultimate_experience_start_date',
      label: 'Fecha de Inicio de Penúltima Experiencia',
      type: 'date',
    },
    {
      name: 'penultimate_experience_end_date',
      label: 'Fecha de Fin de Penúltima Experiencia',
      type: 'date',
    },
    {
      name: 'penultimate_experience_organization',
      label: 'Organización de Penúltima Experiencia',
      type: 'text',
    },
    {
      name: 'penultimate_experience_dismissal_reason',
      label: 'Razón de Despido de Penúltima Experiencia',
      type: 'text',
    },
    {
      name: 'penultimate_experience_salary',
      label: 'Salario de Penúltima Experiencia',
      type: 'number',
    },
  ];
  
  

  const breadcrumbItems = [
    { label: 'Datos Laborales', path: '/basic' },
    { label: id ? 'Editar Datos Laborales' : 'Crear Datos Laborales', path: id ? `/edit-basic/${id}` : '/create-basic' },
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
                        Guardar Experiencia Laboral
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

export default CreateWorkExperiences;
