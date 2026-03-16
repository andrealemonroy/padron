import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { fetchNotificationRule, createNotificationRule, updateNotificationRule } from '../../api/notificationApi';

const CreateNotification = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ruleData = await fetchNotificationRule(Number(id));

        // Ajustamos los datos para que el formulario los entienda correctamente
        setDefaultValues({
          ...ruleData,
          // notify_to ya viene como array desde Laravel (ej: ["rrhh", "gerente"]) gracias al $casts
          notify_to: ruleData.notify_to,
          is_active: ruleData.is_active ? 1 : 0 // Convertimos boolean a 1/0 para el select
        });
      } catch (error) {
        console.error('Error al cargar la regla:', error);
        setError(`Error al cargar los datos de la configuración.`);
        toast.error('Error al cargar la regla de notificación');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Limpiamos los datos antes de enviarlos
      const payload = {
        ...data,
        time_value: Number(data.time_value),
        base_limit_years: data.base_limit_years ? Number(data.base_limit_years) : 5,
        is_active: data.is_active == 1 ? true : false,
        // data.notify_to ya será un array gracias al isMulti: true del formulario
      };

      if (id) {
        await updateNotificationRule(Number(id), payload);
        toast.success('Regla actualizada exitosamente');
      } else {
        await createNotificationRule(payload);
        toast.success('Regla creada exitosamente');
      }

      setError(null);
      setTimeout(() => navigate('/notification-rules'), 1500);

    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError(id ? 'Error al actualizar la regla.' : 'Error al crear la regla.');
      toast.error(error?.response?.data?.message || 'Ocurrió un error en el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Configuración de los campos dinámicos
  const formFields = [
    {
      name: 'type',
      label: 'Tipo de Alerta',
      type: 'select',
      options: [
        { value: 'vencimiento_contrato', label: 'Alerta por Vencimiento de Contrato' },
        { value: 'limite_tiempo_acumulado', label: 'Alerta por Límite de 5 Años' }
      ],
      validation: { required: 'El tipo de alerta es requerido' }
    },
    {
      name: 'description',
      label: 'Descripción (Ej: Aviso 6 meses antes)',
      type: 'text',
      validation: { required: 'La descripción es requerida' }
    },
    {
      name: 'time_value',
      label: 'Cantidad de Tiempo (Ej: 6, 3, 1)',
      type: 'number',
      validation: { required: 'El valor de tiempo es requerido' }
    },
    {
      name: 'time_unit',
      label: 'Unidad de Tiempo',
      type: 'select',
      options: [
        { value: 'months', label: 'Meses' },
        { value: 'days', label: 'Días' },
        { value: 'years', label: 'Años' }
      ],
      validation: { required: 'La unidad de tiempo es requerida' }
    },
    {
      name: 'notify_to',
      label: 'Destinatarios',
      type: 'select',
      isMulti: true, // 🔥 ESTA ES LA CLAVE PARA EL ARRAY MÚLTIPLE
      options: [
        { value: 'coordinador', label: 'Coordinador' },
        { value: 'gerente', label: 'Gerente' },
        { value: 'rrhh', label: 'Recursos Humanos' },
        { value: 'trabajador', label: 'Trabajador' }
      ],
      validation: { required: 'Debes seleccionar al menos un destinatario' }
    },
    {
      name: 'color',
      label: 'Color del Semáforo (Solo para límite de 5 años)',
      type: 'select',
      options: [
        { value: '', label: 'Ninguno (Aplica para vencimientos)' },
        { value: 'verde', label: 'Verde' },
        { value: 'ambar', label: 'Ámbar' },
        { value: 'rojo', label: 'Rojo' }
      ],
    },
    {
      name: 'base_limit_years',
      label: 'Límite Base en Años (Por defecto: 5)',
      type: 'number',
      defaultValue: 5,
    },
  ];

  // Si estamos editando, agregamos la opción de activar/desactivar
  if (id) {
    formFields.push({
      name: 'is_active',
      label: 'Estado de la Regla',
      type: 'select',
      options: [
        { value: 1, label: 'Activo (Enviando correos)' },
        { value: 0, label: 'Inactivo (Pausado)' }
      ],
      validation: { required: 'El estado es requerido' }
    });
  }

  const breadcrumbItems = [
    { label: 'Notificaciones', path: '/notification-rules' },
    { label: id ? 'Editar Regla' : 'Crear Regla', path: id ? `/edit-notification/${id}` : '/create-notification' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <div className="sm:flex sm:justify-between sm:items-center mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <div className="bg-white p-6 shadow rounded-sm border border-slate-200">
                <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues}>
                  <div className="flex gap-4 mt-6 justify-end">
                    <button
                      type="button"
                      onClick={() => navigate('/notification-rules')}
                      className="btn bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {id ? 'Actualizar Regla' : 'Guardar Regla'}
                    </button>
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

export default CreateNotification;