import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { fetchTemplate, createTemplate, editTemplate } from '../../api/templateApi';
import { HiInformationCircle, HiX } from 'react-icons/hi'; // Agregamos HiX para cerrar el modal

// --- ACTUALIZADO: Variables con el formato ${VARIABLE} ---
const variablesLegend = [
  { tag: '${NOMBRE}', desc: 'Nombre completo del trabajador' },
  { tag: '${NAME}', desc: 'Nombre del trabajador (Firma)' },
  { tag: '${TIPO_DOC}', desc: 'Tipo de documento (DNI, CE)' },
  { tag: '${NUM_DOC}', desc: 'Número de documento' },
  { tag: '${SEXO}', desc: 'Género del trabajador' },
  { tag: '${ESTADO_CIVIL}', desc: 'Estado civil' },
  { tag: '${EMAIL}', desc: 'Correo electrónico' },
  { tag: '${DIRECCION}', desc: 'Dirección completa' },
  { tag: '${DISTRITO}', desc: 'Distrito' },
  { tag: '${PROVINCIA}', desc: 'Provincia' },
  { tag: '${DEPARTAMENTO}', desc: 'Departamento' },
  { tag: '${PROFESION}', desc: 'Profesión o grado' },
  { tag: '${PUESTO}', desc: 'Puesto o cargo a ocupar' },
  { tag: '${SUELDO}', desc: 'Salario en números' },
  { tag: '${SUELDO_LETRA}', desc: 'Salario en letras' },
  { tag: '${FECHA_INICIO}', desc: 'Fecha inicio de contrato' },
  { tag: '${FECHA_FIN}', desc: 'Fecha fin de contrato' },
  { tag: '${FECHA_PRUEBA}', desc: 'Fin periodo de prueba' },
  { tag: '${FECHA_HOY}', desc: 'Fecha de generación/firma' },
];

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // NUEVO: Estado para controlar si el popup de leyenda está abierto o cerrado
  const [showLegendModal, setShowLegendModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const templateData = await fetchTemplate(id);
        setDefaultValues(templateData);
      } catch (error) {
        console.error('Error al cargar la plantilla:', error);
        setError(`Error al cargar los datos de la plantilla.`);
        toast.error('Error al cargar la plantilla');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);

      if (id && data.is_active !== undefined) {
        formData.append('is_active', data.is_active);
      }

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];

        if (file.size > 5 * 1024 * 1024) {
          setError('El archivo Word debe ser menor de 5MB.');
          setLoading(false);
          return;
        }
        if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
          setError('Solo se permiten archivos de Word (.docx o .doc).');
          setLoading(false);
          return;
        }

        formData.append('file', file);
      } else if (!id) {
        setError('Debes adjuntar un archivo Word (.docx) para crear la plantilla.');
        setLoading(false);
        return;
      }

      if (id) {
        formData.append('_method', 'PUT');
        await editTemplate(formData, Number(id));
        toast.success('Plantilla actualizada exitosamente');
      } else {
        await createTemplate(formData);
        toast.success('Plantilla creada exitosamente');
      }

      setError(null);
      setTimeout(() => navigate('/templates'), 1500);

    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError(id ? 'Error al actualizar la plantilla.' : 'Error al crear la plantilla.');
      toast.error(error?.response?.data?.message || 'Ocurrió un error en el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Nombre de la Plantilla (Ej: Contrato Indefinido)',
      type: 'text',
      validation: { required: 'El nombre de la plantilla es requerido' }
    },
    {
      name: 'file',
      label: id ? 'Reemplazar Archivo Word (Opcional)' : 'Subir Archivo Word (.docx)',
      type: 'file',
      validation: id ? {} : { required: 'Debes subir un documento' }
    },
  ];

  if (id) {
    formFields.push({
      name: 'is_active',
      label: 'Estado de la Plantilla',
      type: 'select',
      options: [
        { value: 1, label: 'Activo (Visible al generar contratos)' },
        { value: 0, label: 'Inactivo (Oculto)' }
      ],
      validation: { required: 'El estado es requerido' }
    });
  }

  const breadcrumbItems = [
    { label: 'Plantillas', path: '/templates' },
    { label: id ? 'Editar Plantilla' : 'Crear Plantilla', path: id ? `/edit-template/${id}` : '/create-template' },
  ];

  const buttonPlantilla = (
    <button
      type="button"
      onClick={() => setShowLegendModal(true)}
      className="mt-4 sm:mt-0 flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-md font-medium transition-colors border border-indigo-200"
    >
      <HiInformationCircle size={20} />
      <span>Variables</span>
    </button>
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Header con Breadcrumb y Botón del Popup */}
            <div className="sm:flex sm:justify-between sm:items-center mb-6">
              <Breadcrumb items={breadcrumbItems} >
                {buttonPlantilla}
              </Breadcrumb>
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
                      onClick={() => navigate('/templates')}
                      className="btn bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {id ? 'Actualizar Plantilla' : 'Guardar Plantilla'}
                    </button>
                  </div>
                </DynamicForm>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- NUEVO: MODAL (POPUP) DE LEYENDA --- */}
      {showLegendModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900 bg-opacity-50 px-4 transition-opacity">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Cabecera del Modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HiInformationCircle className="text-indigo-600 text-2xl" />
                Diccionario de Variables para Plantillas
              </h2>
              <button
                onClick={() => setShowLegendModal(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Cuerpo del Modal (Scrolleable) */}
            <div className="px-6 py-4 overflow-y-auto">
              <p className="text-sm text-slate-600 mb-5">
                Copia y pega estas variables dentro de tu documento de Word. Asegúrate de incluir el símbolo de dólar y las llaves <strong>(ejemplo: {'${NOMBRE}'})</strong>. El sistema las reemplazará automáticamente con la información del trabajador al generar el contrato.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {variablesLegend.map((variable) => (
                  <div key={variable.tag} className="flex flex-col bg-slate-50 px-4 py-3 rounded border border-slate-200 hover:border-indigo-300 transition-colors">
                    <span className="font-mono font-bold text-indigo-700 text-sm mb-1">{variable.tag}</span>
                    <span className="text-xs text-slate-600 leading-snug">{variable.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowLegendModal(false)}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --------------------------------------- */}
    </div>
  );
};

export default CreateTemplate;