import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';
import { editComplementary, fetchComplementary } from '../api/complementariesApi';

const CreateComplementaries = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        
        if (id) {
          const response = await fetchComplementary(id);
            //const { name, complementary } = response;
            //const selected = complementary.map((perm) => (perm.id));
            console.log(response)
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
    try {
      console.log(data);
      if (id) {
        await editComplementary(data, Number(id));
      }
      setError(null);
      navigate('/complementaries');
    } catch (error) {
      setError(id ? 'Error al actualizar el permission.' : `Error al crear el permission. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'labor_regime',
      label: 'Régimen Laboral',
      type: 'text',
      validation: { required: 'Régimen Laboral es requerido' },
    },
    {
      name: 'occupation',
      label: 'Ocupación',
      type: 'text',
      validation: { required: 'Ocupación es requerida' },
    },
    {
      name: 'disability',
      label: 'Discapacidad',
      type: 'number',
      validation: { required: 'Discapacidad es requerida' },
    },
    {
      name: 'sctr_pension',
      label: 'Pensión SCTR',
      type: 'number',
      validation: { required: 'Pensión SCTR es requerida' },
    },
    {
      name: 'contract_type',
      label: 'Tipo de Contrato',
      type: 'text',
      validation: { required: 'Tipo de Contrato es requerido' },
    },
    {
      name: 'subject_to_atypical_regime',
      label: 'Sujeto a Régimen Atípico',
      type: 'number',
      validation: { required: 'Este campo es requerido' },
    },
    {
      name: 'maximum_working_day',
      label: 'Jornada Máxima',
      type: 'number',
      validation: { required: 'Jornada Máxima es requerida' },
    },
    {
      name: 'night_shift',
      label: 'Turno Nocturno',
      type: 'number',
      validation: { required: 'Turno Nocturno es requerido' },
    },
    {
      name: 'union',
      label: 'Sindicato',
      type: 'number',
      validation: { required: 'Sindicato es requerido' },
    },
    {
      name: 'remuneration_period',
      label: 'Período de Remuneración',
      type: 'text',
      validation: { required: 'Período de Remuneración es requerido' },
    },
    {
      name: 'salary',
      label: 'Salario',
      type: 'text',
      validation: { required: 'Salario es requerido' },
    },
    {
      name: 'situation',
      label: 'Situación',
      type: 'text',
      validation: { required: 'Situación es requerida' },
    },
    {
      name: 'exempt_from_5th_income',
      label: 'Exento de 5ta Categoría',
      type: 'number',
      validation: { required: 'Este campo es requerido' },
    },
    {
      name: 'special_situation',
      label: 'Situación Especial',
      type: 'number',
      validation: { required: 'Situación Especial es requerida' },
    },
    {
      name: 'payment_type',
      label: 'Tipo de Pago',
      type: 'text',
      validation: { required: 'Tipo de Pago es requerido' },
    },
    {
      name: 'occupational_category',
      label: 'Categoría Ocupacional',
      type: 'text',
      validation: { required: 'Categoría Ocupacional es requerida' },
    },
    {
      name: 'double_taxation_treaty',
      label: 'Tratado de Doble Tributación',
      type: 'number',
      validation: { required: 'Este campo es requerido' },
    },
    {
      name: 'cost_sub_center',
      label: 'Subcentro de Costo',
      type: 'text',
      validation: { required: 'Subcentro de Costo es requerido' },
    },
    {
      name: 'cost_center',
      label: 'Centro de Costo',
      type: 'text',
      validation: { required: 'Centro de Costo es requerido' },
    },
    {
      name: 'cost_sub_sub_center',
      label: 'Subsubcentro de Costo',
      type: 'text',
      validation: { required: 'Subsubcentro de Costo es requerido' },
    },
    {
      name: 'area',
      label: 'Área',
      type: 'text',
      validation: { required: 'Área es requerida' },
    },
    {
      name: 'payroll_position',
      label: 'Posición en la Nómina',
      type: 'text',
      validation: { required: 'Posición en la Nómina es requerida' },
    },
  ];
  
  

  const breadcrumbItems = [
    { label: 'Datos complementarios', path: '/complementaries' },
    { label: id ? 'Editar Datos complementarios' : 'Crear Datos complementarios', path: id ? `/edit-complementaries/${id}` : '/create-complementaries' },
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
              <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateComplementaries;
