import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { fetchUsers } from '../../api/userApi';
import { createContract, editContract, fetchcessationReasons, fetchContract, fetchHealthEntity, fetchHealthType, fetchTypeWorker } from '../../api/contractApi';
// NUEVO: Importamos la función para traer las plantillas
import { fetchTemplates } from '../../api/templateApi';

interface Option {
  value: number | string;
  label: string;
}

const CreateContract = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const [tipoAccion, setTipoAccion] = useState('actualizar');

  const [options, setOptions] = useState<{
    users: Option[];
    healthType: Option[];
    healthEntity: Option[];
    typeWorker: Option[];
    cessationReasons: Option[];
    templates: Option[]; // NUEVO: Estado para las plantillas
  }>({
    users: [],
    healthType: [],
    healthEntity: [],
    typeWorker: [],
    cessationReasons: [],
    templates: [], // Inicializado vacío
  });

  useEffect(() => {
    console.log('Effect running');
    const load = async () => {
      try {
        setLoading(true);

        const [
          usersData,
          healthTypeData,
          healthEntityData,
          typeWorkerData,
          cessationReasonsData,
          templatesData, // NUEVO: Traemos las plantillas
          defaultValuesData
        ] = await Promise.all([
          fetchUsers(),
          fetchHealthType(),
          fetchHealthEntity(),
          fetchTypeWorker(),
          fetchcessationReasons(),
          fetchTemplates(), // Llamada a la API de plantillas
          id ? fetchContract(id) : Promise.resolve(null),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatOptions = (data: any[]): Option[] =>
          data.map((value) => ({
            value: value.id,
            label: value.description ?? value.name,
          }));

        setOptions({
          users: formatOptions(usersData),
          healthType: formatOptions(healthTypeData),
          healthEntity: formatOptions(healthEntityData),
          typeWorker: formatOptions(typeWorkerData),
          cessationReasons: formatOptions(cessationReasonsData),
          // Solo mostramos plantillas que estén activas (is_active === 1)
          templates: formatOptions(templatesData.filter((t: any) => t.is_active === 1)),
        });

        setDefaultValues(defaultValuesData);
      } catch (error) {
        setError(`Error al cargar los datos del Contract. ${error}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Ya no necesitamos leer archivos Base64 aquí.
      // Simplemente enviamos los datos del formulario, que ahora incluyen el ID de la plantilla seleccionada (template_id)

      const contractData = {
        ...data,
      };

      if (id) {
        await editContract(contractData, Number(id), tipoAccion);
        toast.success('Contrato actualizado exitosamente');
      } else {
        await createContract({ ...contractData, accion: 'grabar' });
        toast.success('Contrato creado exitosamente');
      }

      setError(null);
      navigate('/contract');

    } catch (error) {
      console.error('Error submitting form:', error);
      setError(id ? 'Error al actualizar los datos.' : 'Error al crear los datos.');
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: 'user_id',
      label: 'Usuario',
      type: 'select',
      options: options.users,
      validation: { required: 'El ID del usuario es requerido' }
    },
    // --- NUEVO: CAMPO DE PLANTILLAS REEMPLAZANDO AL DE ARCHIVO ---
    {
      name: 'template_id', // Asegúrate de que tu base de datos y backend de contratos espere este campo
      label: 'Tipo de Contrato (Plantilla)',
      type: 'select',
      options: options.templates,
      validation: { required: 'Debes seleccionar una plantilla para generar el contrato' }
    },
    // -----------------------------------------------------------
    {
      name: 'health_regime',
      label: 'Régimen de Salud',
      type: 'select',
      options: options.healthEntity
    },
    {
      name: 'sctr_health',
      label: 'SCTR Salud',
      type: 'select',
      options: [
        { value: 1, label: 'Essalud' },
        { value: 2, label: 'EPS' }
      ]
    },
    {
      name: 'start_date',
      label: 'Fecha de Inicio',
      type: 'date',
      validation: { required: 'La fecha de inicio es requerida' }
    },
    {
      name: 'end_date',
      label: 'Fecha de Finalización',
      type: 'date',
      validation: { required: 'La fecha de finalización es requerida' }
    },
    {
      name: 'termination_reason',
      label: 'Razón de Terminación',
      type: 'select',
      options: options.cessationReasons
    },
    {
      name: 'worker_type',
      label: 'Tipo de Trabajador',
      type: 'select',
      options: options.typeWorker,
      validation: { required: 'El campo es requerido' },
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 1, label: 'Renovación' },
        { value: 2, label: 'Baja' },
        { value: 3, label: 'Alta' }
      ],
      validation: { required: 'El estado es requerido' }
    }
  ];

  const breadcrumbItems = [
    { label: 'Contratos', path: '/Contract' },
    { label: id ? 'Editar Contrato' : 'Crear Contrato', path: id ? `/edit-contract/${id}` : '/create-contract' },
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
            {error && <p style={{ color: 'red', marginTop: '1rem', marginBottom: '1rem' }}>{error}</p>}

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <div className="bg-white p-6 shadow rounded-sm border border-slate-200">
                <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues}>
                  {/* LÓGICA CONDICIONAL DE BOTONES */}
                  <div className="flex gap-4 mt-6 justify-end">
                    {id ? (
                      // 🔵 SI TIENE ID (MODO EDICIÓN)
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
                      // 🟢 SI NO TIENE ID (MODO CREACIÓN)
                      <button
                        type="submit"
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                        onClick={() => setTipoAccion('grabar')}
                      >
                        Guardar Contrato
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

export default CreateContract;