import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import {
  editComplementary,
  fetchComplementary,
} from '../../api/complementariesApi';
import { fetchContractType, fetchOccupationalCategory, fetchOccupations, fetchPaymentPeriod, fetchPaymentType, fetchSit } from '../../api/occupationsApi';
import { fetchWorkLine } from '../../api/contractApi';
import { fetchProjects } from '../../api/projectApi';

interface Option {
  value: number | string;
  label: string;
}

const CreateComplementaries = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<{
    occupations: Option[];
    typeWorker: Option[]; // labor_regime fetchTypeWorker
    contractType: Option[]; // contract_type fetchContractType
    paymentPeriod: Option[]; // remuneration_period fetchPaymentPeriod
    situation: Option[]; // situation fetchSit
    paymentType: Option[]; // payment_type fetchPaymentType
    occupationalCategory: Option[]; // occupational_category fetchOccupationalCategory
    //cost_sub_center: Option[]; // fetchCen
    //cost_center: Option[];
    cost_sub_sub_center: Option[];
    //area: Option[];
  }>({
    occupations: [],
    typeWorker: [],
    contractType: [],
    paymentPeriod: [],
    situation: [],
    paymentType: [],
    occupationalCategory: [],
    //cost_sub_center: [],
    //cost_center: [],
    cost_sub_sub_center: [],
    //area: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Mover el formateo de datos a una función separada para evitar cálculos innecesarios en el render.
        const formatOptions = (data: any[]): Option[] =>
          data.map((value) => ({
            value: value.id,
            label: value.description ?? value.code ?? value.name,
          }));

        // Dividir las llamadas a la API en partes más pequeñas para evitar bloqueos.
        const fetchData = async () => {
          const [
            occupationsData,
            typeWorkerData,
            contractTypeData,
            paymentPeriodData,
            situationData,
            paymentTypeData,
            occupationalCategoryData,
            cost_sub_centerData,
          ] = await Promise.all([
            fetchOccupations(),
            fetchWorkLine(),
            fetchContractType(),
            fetchPaymentPeriod(),
            fetchSit(),
            fetchPaymentType(),
            fetchOccupationalCategory(),
            fetchProjects(),
          ]);

          setOptions({
            occupations: formatOptions(occupationsData),
            typeWorker: formatOptions(typeWorkerData),
            contractType: formatOptions(contractTypeData),
            paymentPeriod: formatOptions(paymentPeriodData),
            situation: formatOptions(situationData),
            paymentType: formatOptions(paymentTypeData),
            occupationalCategory: formatOptions(occupationalCategoryData),
            cost_sub_sub_center: formatOptions(cost_sub_centerData),
          });
        };

        const fetchDefaultValues = async () => {
          if (id) {
            const responseData = await fetchComplementary(id);
            setDefaultValues(responseData.id ? responseData : null);
          } else {
            setDefaultValues({
              labor_regime: 1,
              disability: 0,
              sctr_pension: 0,
              subject_to_atypical_regime: 0,
              maximum_working_day: 0,
              night_shift: 0,
              union: 0,
              remuneration_period: 1,
              situation: 1,
              exempt_from_5th_income: 0,
              special_situation: 0,
              payment_type: 1,
              occupational_category: 1,
              double_taxation_treaty: 0,
            });
          }
        };

        await Promise.all([fetchData(), fetchDefaultValues()]);
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
      setError(
        id
          ? 'Error al actualizar el permission.'
          : `Error al crear el permission. ${error}`
      );
    }
  };

  const formFields = [
    {
      name: 'labor_regime',
      label: 'Régimen Laboral',
      type: 'select',
      options: options.typeWorker,
      validation: { required: 'Régimen Laboral es requerido' },
      colSpan: 1,
    },
    {
      name: 'occupation',
      label: 'Ocupación',
      type: 'select',
      options: options.occupations,
      validation: { required: 'Ocupación es requerida' },
      colSpan: 1,
    },
    {
      name: 'disability',
      label: 'Discapacidad',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Discapacidad es requerida' },
    },
    {
      name: 'sctr_pension',
      label: 'Pensión SCTR',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Pensión SCTR es requerida' },
    },
    {
      name: 'contract_type',
      label: 'Tipo de Contrato',
      type: 'select',
      options: options.contractType,
      validation: { required: 'Tipo de Contrato es requerido' },
    },
    {
      name: 'subject_to_atypical_regime',
      label: 'Sujeto a Régimen Atípico',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Este campo es requerido' },
    },
    {
      name: 'maximum_working_day',
      label: 'Jornada Máxima',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Jornada Máxima es requerida' },
    },
    {
      name: 'night_shift',
      label: 'Turno Nocturno',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Turno Nocturno es requerido' },
    },
    {
      name: 'union',
      label: 'Sindicato',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Sindicato es requerido' },
    },
    {
      name: 'remuneration_period',
      label: 'Período de Remuneración',
      type: 'select',
      options: options.paymentPeriod,
      validation: { required: 'Período de Remuneración es requerido' },
    },
    {
      name: 'salary',
      label: 'Salario',
      type: 'number',
      validation: { required: 'Salario es requerido' },
    },
    {
      name: 'situation',
      label: 'Situación',
      type: 'select',
      options: options.situation,
      validation: { required: 'Situación es requerida' },
    },
    {
      name: 'exempt_from_5th_income',
      label: 'Exento de 5ta Categoría',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Este campo es requerido' },
    },
    {
      name: 'special_situation',
      label: 'Situación Especial',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Situación Especial es requerida' },
    },
    {
      name: 'payment_type',
      label: 'Tipo de Pago',
      type: 'select',
      options: options.paymentType,
      validation: { required: 'Tipo de Pago es requerido' },
    },
    {
      name: 'occupational_category',
      label: 'Categoría Ocupacional',
      type: 'select',
      options: options.occupationalCategory,
      validation: { required: 'Categoría Ocupacional es requerida' },
    },
    {
      name: 'double_taxation_treaty',
      label: 'Tratado de Doble Tributación',
      type: 'select',
      options: [
        {
          value: 0,
          label: 'NO',
        },
        {
          value: 1,
          label: 'SI',
        }
      ],
      validation: { required: 'Este campo es requerido' },
    },
    /*
    {
      name: 'cost_sub_center',
      label: 'Subcentro de Costo',
      type: 'select',
      options: options.cost_sub_center,
      validation: { required: 'Subcentro de Costo es requerido' },
    },
    */
    /*
    {
      name: 'cost_center',
      label: 'Centro de Costo',
      type: 'select',
      options: options.cost_center,
      validation: { required: 'Centro de Costo es requerido' },
    },
    */
    {
      name: 'cost_sub_sub_center',
      label: 'Subsubcentro de Costo',
      type: 'select',
      options: options.cost_sub_sub_center,
      validation: { required: 'Subsubcentro de Costo es requerido' },
    },
    /*
    {
      name: 'area',
      label: 'Área',
      type: 'select',
      options: options.area,
      validation: { required: 'Área es requerida' },
    },
    */
    {
      name: 'payroll_position',
      label: 'Posición en la Nómina',
      type: 'text',
      validation: { required: 'Posición en la Nómina es requerida' },
    },
  ];

  const breadcrumbItems = [
    { label: 'Datos complementarios', path: '/complementaries' },
    {
      label: id
        ? 'Editar Datos complementarios'
        : 'Crear Datos complementarios',
      path: id ? `/edit-complementaries/${id}` : '/create-complementaries',
    },
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
              <DynamicForm
                fields={formFields}
                onSubmit={onSubmit}
                defaultValues={defaultValues}
                columns={2}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateComplementaries;
