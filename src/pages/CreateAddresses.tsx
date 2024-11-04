import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { fetchAddresses, editAddresses, fetchViaType, fetchZoneType } from '../api/addressesApi';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';

interface Option {
  value: number | string;
  label: string;
}

const CreateAddresses = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<{
    viaType: Option[];
    zoneType: Option[];
  }>({
    viaType: [],
    zoneType: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [
          viaTypeData,
          zoneTypeData,
          addressResponse,
        ] = await Promise.all([
          fetchViaType(),
          fetchZoneType(),
          id ? fetchAddresses(id) : Promise.resolve(null),
        ]);

        // Helper function to format options
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatOptions = (data: any[]): Option[] =>
          data.map((value) => ({
            value: value.id,
            label: value.description,
          }));

          setOptions({
            viaType: formatOptions(viaTypeData),
            zoneType: formatOptions(zoneTypeData),
          });
          setDefaultValues(addressResponse);
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
      if (id) {
        await editAddresses(data, Number(id));
      }
      setError(null);
      navigate('/addresses');
    } catch (error) {
      setError(id ? 'Error al actualizar el addresses.' : `Error al crear el addresses. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'address_type',
      label: 'Tipo de Dirección',
      type: 'select',
      options: options.viaType,
      validation: { required: 'Tipo de Dirección es requerido' },
    },
    {
      name: 'address_name',
      label: 'Nombre de la Dirección',
      type: 'text',
      validation: { required: 'Nombre de la Dirección es requerido' },
    },
    {
      name: 'address_number',
      label: 'Número de la Dirección',
      type: 'text',
      validation: { required: 'Número de la Dirección es requerido' },
    },
    {
      name: 'department_number',
      label: 'Número del Departamento',
      type: 'text',
      validation: {},
    },
    {
      name: 'interior',
      label: 'Interior',
      type: 'text',
      validation: {},
    },
    {
      name: 'block',
      label: 'Bloque',
      type: 'text',
      validation: {},
    },
    {
      name: 'lot',
      label: 'Lote',
      type: 'text',
      validation: {},
    },
    {
      name: 'km',
      label: 'Kilómetro',
      type: 'text',
      validation: {},
    },
    {
      name: 'stage',
      label: 'Etapa',
      type: 'text',
      validation: {},
    },
    {
      name: 'zone_type',
      label: 'Tipo de Zona',
      type: 'select',
      options: options.zoneType,
      validation: {},
    },
    {
      name: 'zone_name',
      label: 'Nombre de la Zona',
      type: 'text',
      validation: {},
    },
    {
      name: 'reference',
      label: 'Referencia',
      type: 'text',
      validation: {},
    },
    {
      name: 'department',
      label: 'Departamento',
      type: 'select',
      options: [
        { value: 1, label: 'Lima' },
        { value: 2, label: 'Arequipa' },
        { value: 3, label: 'Cusco' },
        { value: 4, label: 'Piura' },
      ],
      validation: { required: 'Departamento es requerido' },
    },
    {
      name: 'province',
      label: 'Provincia',
      type: 'select',
      options: [
        { value: 1, label: 'Lima' },
        { value: 2, label: 'Callao' },
        { value: 3, label: 'Cusco' },
        { value: 4, label: 'Piura' },
      ],
      validation: { required: 'Provincia es requerida' },
    },
    {
      name: 'district',
      label: 'Distrito',
      type: 'select',
      options: [
        { value: 1, label: 'Miraflores' },
        { value: 2, label: 'San Isidro' },
        { value: 3, label: 'Surco' },
        { value: 4, label: 'San Borja' },
      ],
      validation: { required: 'Distrito es requerido' },
    }
  ];
  
  

  const breadcrumbItems = [
    { label: 'Dirección', path: '/addresses' },
    { label: id ? 'Editar Dirección' : 'Crear Dirección', path: id ? `/edit-addresses/${id}` : '/create-addresses' },
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
              <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateAddresses;
