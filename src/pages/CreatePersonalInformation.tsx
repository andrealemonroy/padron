import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { fetchPersonalInformation, editPersonalInformation } from '../api/personalInformationApi';
import { fetchDocument } from '../api/documentApi';
import { fetchSex } from '../api/sexApi';
import { fetchNationality } from '../api/nationalityApi';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';

const CreatePersonalInformation = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocument] = useState([]);
  const [sexs, setSex] = useState([]);
  const [nationality, setNationality] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchDocument();
        const formatted = data.map((value) => ({
          value: value.id,
          label: value.description,
        }));
        setDocument(formatted);

        const dataSex = await fetchSex();
        const formattedSex = dataSex.map((value) => ({
          value: value.id,
          label: value.description,
        }));
        setSex(formattedSex);

        const dataNationality = await fetchNationality();
        const formattedNationality = dataNationality.map((value) => ({
          value: value.id,
          label: value.description,
        }));
        setNationality(formattedNationality);

        if (id) {
          const response = await fetchPersonalInformation(id);
            console.log(response);
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
        await editPersonalInformation(data, Number(id));
      }
      setError(null);
      navigate('/basic');
    } catch (error) {
      setError(id ? 'Error al actualizar el permission.' : `Error al crear el permission. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'document_type',
      label: 'Tipo de Documento',
      type: 'select',
      options: documents,
      validation: { required: 'Tipo de Documento es requerido' },
    },
    {
      name: 'document_number',
      label: 'Número de Documento',
      type: 'text',
      validation: { required: 'Número de Documento es requerido' },
    },
    {
      name: 'document_country',
      label: 'País de Documento',
      type: 'text',
      validation: { required: 'País de Documento es requerido' },
    },
    {
      name: 'birth_date',
      label: 'Fecha de Nacimiento',
      type: 'date',
      validation: { required: 'Fecha de Nacimiento es requerida' },
    },
    {
      name: 'last_name_father',
      label: 'Apellido Paterno',
      type: 'text',
      validation: { required: 'Apellido Paterno es requerido' },
    },
    {
      name: 'last_name_mother',
      label: 'Apellido Materno',
      type: 'text',
      validation: { required: 'Apellido Materno es requerido' },
    },
    {
      name: 'first_name',
      label: 'Primer Nombre',
      type: 'text',
      validation: { required: 'Primer Nombre es requerido' },
    },
    {
      name: 'second_name',
      label: 'Segundo Nombre',
      type: 'text',
      validation: {},
    },
    {
      name: 'third_name',
      label: 'Tercer Nombre',
      type: 'text',
      validation: {},
    },
    {
      name: 'gender',
      label: 'Género',
      type: 'select',
      options: sexs,
      validation: { required: 'Género es requerido' },
    },
    {
      name: 'blood_group',
      label: 'Grupo Sanguíneo',
      type: 'text',
      validation: {},
    },
    {
      name: 'civil_status',
      label: 'Estado Civil',
      type: 'text',
      validation: {},
    },
    {
      name: 'nationality',
      label: 'Nacionalidad',
      type: 'select',
      options: nationality,
      validation: { required: 'Nacionalidad es requerida' },
    },
    {
      name: 'phone_number',
      label: 'Número de Teléfono',
      type: 'text',
      validation: {},
    },
    {
      name: 'emergency_phone_number',
      label: 'Número de Teléfono de Emergencia',
      type: 'text',
      validation: {},
    },
    {
      name: 'has_children_under_18',
      label: 'Tiene hijos menores de 18 años',
      type: 'checkbox',
      validation: {},
    },
    {
      name: 'number_of_children_under_18',
      label: 'Número de hijos menores de 18 años',
      type: 'number',
      validation: {},
    },
  ];
  

  const breadcrumbItems = [
    { label: 'Datos basicos', path: '/basic' },
    { label: id ? 'Editar Datos basicos' : 'Crear Datos basicos', path: id ? `/edit-basic/${id}` : '/create-basic' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              sexs.length > 0 && documents.length > 0 && nationality.length > 0 && (
                <DynamicForm fields={formFields} onSubmit={onSubmit} defaultValues={defaultValues} />
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePersonalInformation;
