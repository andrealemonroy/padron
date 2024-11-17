import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  fetchPersonalInformation,
  editPersonalInformation,
  PersonalInformation,
} from '../../api/personalInformationApi';
import { fetchDocument } from '../../api/documentApi';
import { fetchSex } from '../../api/sexApi';
import { fetchNationality } from '../../api/nationalityApi';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { fetchCountries } from '../../api/countriesApi';
import { fetchBloodGroup } from '../../api/bloodGroupApi';
import { fetchCivilStatus } from '../../api/civilStatusApi';
import { fetchUsers } from '../../api/userApi';

interface Option {
  value: number | string;
  label: string;
}

interface PersonalInformationData {
  document_type: number | null;
  document_number: string;
  document_country: number | null;
  birth_date: string;
  last_name_father: string;
  last_name_mother: string;
  first_name: string;
  second_name: string;
  third_name: string;
  gender: number | null;
  blood_group: number | null;
  civil_status: number | null;
  nationality: number | null;
  phone_number: string;
  emergency_phone_number: string;
  has_children_under_18: boolean;
  number_of_children_under_18: number;
  coordinator: number;
}

const CreatePersonalInformation = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<PersonalInformationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Consolidate options into a single state object
  const [options, setOptions] = useState<{
    documents: Option[];
    countries: Option[];
    bloodGroups: Option[];
    civilStatuses: Option[];
    sexes: Option[];
    nationalities: Option[];
    users: Option[];
  }>({
    documents: [],
    countries: [],
    bloodGroups: [],
    civilStatuses: [],
    sexes: [],
    nationalities: [],
    users: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          documentData,
          countryData,
          bloodGroupData,
          civilStatusData,
          sexData,
          nationalityData,
          usersData,
          personalInfoResponse,
        ] = await Promise.all([
          fetchDocument(),
          fetchCountries(),
          fetchBloodGroup(),
          fetchCivilStatus(),
          fetchSex(),
          fetchNationality(),
          fetchUsers(),
          id ? fetchPersonalInformation(id) : Promise.resolve(null),
        ]);

        // Helper function to format options
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatOptions = (data: any[]): Option[] =>
          data.map((value) => ({
            value: value.id,
            label: value.description ?? value.name,
          }));

        // Update options state
        setOptions({
          documents: formatOptions(documentData),
          countries: formatOptions(countryData),
          bloodGroups: formatOptions(bloodGroupData),
          civilStatuses: formatOptions(civilStatusData),
          sexes: formatOptions(sexData),
          nationalities: formatOptions(nationalityData),
          users: formatOptions(usersData),
        });

        // Set default values if editing
        if (personalInfoResponse) {
          const response = personalInfoResponse;

          const defaultValues: PersonalInformationData = {
            document_type: response.document_type,
            document_number: response.document_number || '',
            document_country: response.document_country,
            birth_date: response.birth_date ? response.birth_date.substring(0, 10) : '',
            last_name_father: response.last_name_father || '',
            last_name_mother: response.last_name_mother || '',
            first_name: response.first_name || '',
            second_name: response.second_name || '',
            third_name: response.third_name || '',
            gender: response.gender,
            blood_group: response.blood_group,
            civil_status: response.civil_status,
            nationality: response.nationality,
            phone_number: response.phone_number || '',
            emergency_phone_number: response.emergency_phone_number || '',
            has_children_under_18: response.has_children_under_18 || false,
            number_of_children_under_18: response.number_of_children_under_18 || 0,
            coordinator: response.coordinator || 0,
          };

          setDefaultValues(defaultValues);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data: PersonalInformation) => {
    try {
      const fileInput = document.getElementById('file') as HTMLInputElement; // Asegúrate de que el input tenga este ID
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string; // Obtener la cadena Base64
          const base64Data = base64String.split(',')[1]; // Extraer solo la parte Base64

          // Agregar la imagen en formato Base64 a los datos
          const personalInfoData = {
            ...data, // Mantener otros campos
            photo: base64Data, // Agregar la imagen en formato Base64
          };

          try {
            if (id) {
              await editPersonalInformation(personalInfoData, Number(id));
            } else {
              // Si se está creando un nuevo registro, puedes tener una función de creación
              // await createPersonalInformation(personalInfoData);
            }
            setError(null);
            navigate('/basic');
          } catch (error) {
            console.error('Error al enviar los datos:', error);
            setError(id ? 'Error al actualizar los datos.' : 'Error al crear los datos.');
          }
        };

        reader.readAsDataURL(file); // Leer el archivo como Data URL (Base64)
      } else {
        // Si no hay archivo, simplemente envía los datos sin la imagen
        if (id) {
          await editPersonalInformation(data, Number(id));
        } else {
          // await createPersonalInformation(data);
        }
        setError(null);
        navigate('/basic');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(id ? 'Error al actualizar los datos.' : 'Error al crear los datos.');
    }
  };

  const formFields = [
    {
      name: 'document_type',
      label: 'Tipo de Documento',
      type: 'select',
      options: options.documents,
      validation: { required: 'Tipo de Documento es requerido' },
      colSpan: 1,
    },
    {
      name: 'document_number',
      label: 'Número de Documento',
      type: 'text',
      validation: { required: 'Número de Documento es requerido' },
      colSpan: 1,
    },
    {
      name: 'document_country',
      label: 'País de Documento',
      type: 'select',
      options: options.countries,
      validation: { required: 'País de Documento es requerido' },
      colSpan: 1,
    },
    {
      name: 'birth_date',
      label: 'Fecha de Nacimiento',
      type: 'date',
      validation: { required: 'Fecha de Nacimiento es requerida' },
      colSpan: 1,
    },
    {
      name: 'last_name_father',
      label: 'Apellido Paterno',
      type: 'text',
      validation: { required: 'Apellido Paterno es requerido' },
      colSpan: 1,
    },
    {
      name: 'last_name_mother',
      label: 'Apellido Materno',
      type: 'text',
      validation: { required: 'Apellido Materno es requerido' },
      colSpan: 1,
    },
    {
      name: 'first_name',
      label: 'Primer Nombre',
      type: 'text',
      validation: { required: 'Primer Nombre es requerido' },
      colSpan: 1,
    },
    {
      name: 'second_name',
      label: 'Segundo Nombre',
      type: 'text',
      validation: {},
      colSpan: 1,
    },
    {
      name: 'third_name',
      label: 'Tercer Nombre',
      type: 'text',
      validation: {},
      colSpan: 1,
    },
    {
      name: 'gender',
      label: 'Género',
      type: 'select',
      options: options.sexes,
      validation: { required: 'Género es requerido' },
      colSpan: 1,
    },
    {
      name: 'blood_group',
      label: 'Grupo Sanguíneo',
      type: 'select',
      options: options.bloodGroups,
      validation: {},
      colSpan: 1,
    },
    {
      name: 'civil_status',
      label: 'Estado Civil',
      type: 'select',
      options: options.civilStatuses,
      validation: {},
      colSpan: 1,
    },
    {
      name: 'nationality',
      label: 'Nacionalidad',
      type: 'select',
      options: options.nationalities,
      validation: { required: 'Nacionalidad es requerida' },
      colSpan: 1,
    },
    {
      name: 'phone_number',
      label: 'Número de Teléfono',
      type: 'text',
      validation: {},
      colSpan: 1,
    },
    {
      name: 'emergency_phone_number',
      label: 'Número de Teléfono de Emergencia',
      type: 'text',
      validation: {},
      colSpan: 1,
    },
    {
      name: 'file',
      label: 'Archivo',
      type: 'file',
      //validation: { required: 'Archivo es requerido' },
      colSpan: 1,
    },
    {
      name: 'coordinator',
      label: 'Cooordinador',
      type: 'select',
      options: options.users,
      validation: { required: 'Coordinador es requerida' },
      colSpan: 1,
    },
    {
      name: 'number_of_children_under_18',
      label: 'Número de hijos menores de 18 años',
      type: 'number',
      validation: {},
      colSpan: 1,
    },
    {
      name: 'has_children_under_18',
      label: 'Tiene hijos menores de 18 años',
      type: 'checkbox',
      validation: {},
      colSpan: 1,
    },
  ];

  const breadcrumbItems = [
    { label: 'Datos Básicos', path: '/basic' },
    {
      label: id ? 'Editar Datos Básicos' : 'Crear Datos Básicos',
      path: id ? `/edit-basic/${id}` : '/create-basic',
    },
  ];

  // Check if all options are loaded
  const allOptionsLoaded = Object.values(options).every(
    (optArray) => optArray.length > 0
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : allOptionsLoaded ? (
              <div className="mt-4">
                <DynamicForm
                  fields={formFields}
                  onSubmit={onSubmit}
                  defaultValues={defaultValues}
                  columns={2}
                />
              </div>
            ) : (
              // If not all options are loaded, show a loader or a message
              <p className="mt-4">Cargando opciones...</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePersonalInformation;
