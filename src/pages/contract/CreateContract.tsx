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
import { createContract, editContract, fetchcessationReasons, fetchContract, fetchHealthType, fetchTypeWorker } from '../../api/contractApi';

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
  
  const [options, setOptions] = useState<{
    users: Option[];
    healthType: Option[];
    healthEntity: Option[];
    typeWorker: Option[];
    cessationReasons: Option[];
  }>({
    users: [],
    healthType: [],
    healthEntity: [],
    typeWorker: [],
    cessationReasons: [],
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
          defaultValuesData
        ] = await Promise.all([
          fetchUsers(),
          fetchHealthType(),
          fetchHealthType(),
          fetchTypeWorker(),
          fetchcessationReasons(),
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

  /*const onSubmit = async (data) => {
    try {
      console.log(data);
      if (id) {
        await editContract(data, Number(id));
        toast.success('Registro actualizado exitosamente');
      } else {
        await createContract(data);
        toast.success('Proyecto creado exitosamente');
      }
      setError(null);
      setTimeout(() => {
        navigate('/contract');
      }, 2000); 
    } catch (error) {
      const errorMessage = id ? 'Error al actualizar el proyecto' : 'Error al crear el proyecto';
      toast.error(`${errorMessage}. ${error}`);
      setError(`${errorMessage}. ${error}`);
    }
  };*/

  const onSubmit = async (data) => {
      try {
        const fileInput = document.getElementById('pdf_contract') as HTMLInputElement; // Asegúrate de que el input tenga este ID
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
  
          console.log(file.size)
          if (file.size > 2 * 1024 * 1024) {
            setError('El archivo debe ser menor de 2MB.');
            return; // Detener el proceso si el archivo excede el tamaño permitido
        }
  
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = reader.result as string; // Obtener la cadena Base64
            const base64Data = base64String.split(',')[1]; // Extraer solo la parte Base64
  
            // Agregar la imagen en formato Base64 a los datos
            const personalInfoData = {
              ...data, // Mantener otros campos
              pdf_contract: base64Data, // Agregar la imagen en formato Base64
            };
  
            try {
              if (id) {
                await editContract(personalInfoData, Number(id));
                toast.success('Proyecto actualizado exitosamente');
              } else {
                await createContract(personalInfoData);
                toast.success('Proyecto creado exitosamente');
              }
              setError(null);
              navigate('/contract');
            } catch (error) {
              console.error('Error al enviar los datos:', error);
              setError(id ? 'Error al actualizar los datos.' : 'Error al crear los datos.');
            }
          };
  
          reader.readAsDataURL(file); // Leer el archivo como Data URL (Base64)
        } else {
          // Si no hay archivo, simplemente envía los datos sin la imagen
          if (id) {
            await editContract(data, Number(id));
            toast.success('Proyecto actualizado exitosamente');
          } else {
            await createContract(data);
            toast.success('Proyecto creado exitosamente');
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
      name: 'user_id',
      label: 'Usuario',
      type: 'select',
      options: options.users,
      validation: { required: 'El ID del usuario es requerido' }
    },
    {
      name: 'health_regime',
      label: 'Régimen de Salud',
      type: 'select',
      options: options.healthEntity,
      validation: { required: 'El régimen de salud es requerido' }
    },
    {
      name: 'sctr_health',
      label: 'SCTR Salud',
      type: 'select',
      options: [
        {
          value: 1,
          label: 'Essalud',
        },
        {
          value: 2,
          label: 'EPS',
        }
      ],
      validation: { required: 'El SCTR de salud es requerido' }
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
      options: options.cessationReasons,
      validation: { required: 'La razón de terminación es requerida' }
    },
    {
      name: 'worker_type',
      label: 'Tipo trabajdor',
      type: 'select',
      options: options.typeWorker,
      validation: { required: 'El campo es requerido' },
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        {
          value: 1,
          label: 'Renovación',
        },
        {
          value: 2,
          label: 'Baja',
        },
        {
          value: 3,
          label: 'Alta',
        }
      ],
      validation: { required: 'El estado es requerido' }
    },
    {
      name: 'pdf_contract',
      label: 'Contrato Firmado',
      type: 'file',
      validation: { required: 'El campo es requerido' },
      //colSpan: 1,
    },
  ]
  ;
  
  

  const breadcrumbItems = [
    { label: 'Contratos', path: '/Contract' },
    { label: id ? 'Editar Contrato' : 'Crear Contrato', path: id ? `/edit-project/${id}` : '/create-project' },
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

export default CreateContract;


