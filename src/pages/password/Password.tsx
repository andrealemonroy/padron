import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import DynamicForm from '../../components/DynamicForm';
import { createPassword } from '../../api/userApi';

const Password = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState(null);

  useEffect(() => {
    setLoading(true);
    const response = {
      password: '',
      password_new: ''
    }
    setDefaultValues(response);
    setLoading(false);
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log(data);

      if (data.password && data.password.length < 8) {
        toast.error(`Las contraseña debe tener minimo 8 caracteres`);
        return;
      }

      if (data.password != data.password_new) {
        toast.error(`Las contraseñas deben ser iguales`);
        return;
      }

      await createPassword(data);
      toast.success('Contraseña creado exitosamente');
      setError(null);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); 
    } catch (error) {
      toast.error(`Error al crear el contraseña. ${error}`);
      setError(`Error al crear el contraseña. ${error}`);
    }
  };

  const formFields = [
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      validation: { required: 'Contraseña es requerido' }
    },
    {
      name: 'password_new',
      label: 'Repita la contraseña',
      type: 'password',
      validation: { required: 'Contraseña es requerido' }
    },
  ]
  ;
  
  

  const breadcrumbItems = [
    { label: 'Cambiar Contraseña', path: '/password' },
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

export default Password;
