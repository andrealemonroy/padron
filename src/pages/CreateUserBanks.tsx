import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import DynamicForm from '../components/DynamicForm';
import { editUserBank, fetchUserBank } from '../api/userBanksApi';
import { fetchBanks } from '../api/BanksApi';

const CreateUserBanks = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchBanks();
        const formatted = data.map((permission) => ({
          value: permission.id,
          label: permission.description,
        }));
        setBanks(formatted);
        if (id) {
          const response = await fetchUserBank(id);
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
      if (id) {
        await editUserBank(data, Number(id));
      }
      setError(null);
      navigate('/user-banks');
    } catch (error) {
      setError(id ? 'Error al actualizar el addresses.' : `Error al crear el addresses. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'bank_code',
      label: 'Código del Banco',
      type: 'select',
      options: banks,
      validation: { required: 'Código del Banco es requerido' },
    },
    {
      name: 'account_number',
      label: 'Número de Cuenta',
      type: 'text',
      validation: { required: 'Número de Cuenta es requerido' },
    },
    {
      name: 'interbank_code',
      label: 'Código Interbancario',
      type: 'text',
      validation: { required: 'Código Interbancario es requerido' },
    },
  ];
  
  

  const breadcrumbItems = [
    { label: 'Datos Bancarios', path: '/user-banks' },
    { label: id ? 'Editar Datos Bancarios' : 'Crear Datos Bancarios', path: id ? `/edit-user-banks/${id}` : '/create-user-banks' },
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

export default CreateUserBanks;
