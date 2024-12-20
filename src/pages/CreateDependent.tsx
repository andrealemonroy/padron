import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { fetchDocument } from '../api/documentApi';
import { fetchSex } from '../api/sexApi';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';
import { editDependent, fetchDependent } from '../api/dependentApi';
import { fetchCountries } from '../api/countriesApi';
import { fetchBeneficiaryProofDocuments } from '../api/beneficiaryProofDocuments';
import { fetchFamilyRelationshipTypes } from '../api/familyRelationshipTypesApi';

interface Option {
  value: number | string;
  label: string;
}

const CreateDependent = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);
  // beneficiary

  const [options, setOptions] = useState<{
    document: Option[];
    countries: Option[];
    sex: Option[];
    beneficiary: Option[];
    relationshipTypes: Option[]
  }>({
    document: [],
    countries: [],
    sex: [],
    beneficiary: [],
    relationshipTypes: []
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        
        const [
          documentData,
          countriesData,
          sexData,
          beneficiaryPeriodData,
          relationshipTypesData,
          responseData
        ] = await Promise.all([
          fetchDocument(),
          fetchCountries(),
          fetchSex(),
          fetchBeneficiaryProofDocuments(),
          fetchFamilyRelationshipTypes(),
          id ? fetchDependent(id) : Promise.resolve(null),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatOptions = (data: any[]): Option[] =>
          data.map((value) => ({
            value: value.id,
            label: value.description,
          }));

          console.log(relationshipTypesData)
          setOptions({
            document: formatOptions(documentData),
            countries: formatOptions(countriesData),
            sex: formatOptions(sexData),
            beneficiary: formatOptions(beneficiaryPeriodData),
            relationshipTypes: formatOptions(relationshipTypesData),
          });

        setDefaultValues(responseData);
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
        await editDependent(data, Number(id));
      }
      setError(null);
      navigate('/dependent');
    } catch (error) {
      setError(id ? 'Error al actualizar el permission.' : `Error al crear el permission. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'document_type',
      label: 'Tipo de Documento',
      type: 'select',
      options: options.document,
      validation: { required: 'Tipo de Documento es requerido' },
      //onChange: (value) => handleChange(value),
    },
    {
      name: 'document_number',
      label: 'Número de Documento',
      type: 'text',
      validation: { required: 'Número de Documento es requerido' },
     // onBlur: () => console.log('Saliste del input'),
    },
    {
      name: 'document_country',
      label: 'País del Documento',
      type: 'select',
      options: options.countries,
      validation: { required: 'País del Documento es requerido' }
    },
    {
      name: 'birth_date',
      label: 'Fecha de Nacimiento',
      type: 'date',
      validation: { required: 'Fecha de Nacimiento es requerida' }
    },
    {
      name: 'last_name_father',
      label: 'Apellido Paterno',
      type: 'text',
      validation: { required: 'Apellido Paterno es requerido' }
    },
    {
      name: 'last_name_mother',
      label: 'Apellido Materno',
      type: 'text',
      validation: { required: 'Apellido Materno es requerido' }
    },
    {
      name: 'first_name',
      label: 'Nombre',
      type: 'text',
      validation: { required: 'Nombre es requerido' }
    },
    {
      name: 'gender',
      label: 'Género',
      type: 'select',
      options: options.sex,
      validation: { required: 'Género es requerido' }
    },
    {
      name: 'family_relationship',
      label: 'Relación Familiar',
      type: 'select',
      options: options.relationshipTypes,
      validation: { required: 'Relación Familiar es requerida' }
    },
    {
      name: 'relationship_document_type',
      label: 'Tipo de Documento de Relación',
      type: 'select',
      options: options.beneficiary,
      validation: { required: 'Tipo de Documento de Relación es requerido' }
    },
    {
      name: 'relationship_document_number',
      label: 'Número de Documento de Relación',
      type: 'text',
      validation: { required: 'Número de Documento de Relación es requerido' }
    },
    {
      name: 'conception_month',
      label: 'Mes de Concepción',
      type: 'month',
      validation: { required: 'Mes de Concepción es requerido' }
    },
  ]
  ;
  
  

  const breadcrumbItems = [
    { label: 'Derecho habientes', path: '/dependent' },
    { label: id ? 'Editar Derecho habientes' : 'Crear Derecho habientes', path: id ? `/edit-dependent/${id}` : '/create-dependent' },
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

export default CreateDependent;
