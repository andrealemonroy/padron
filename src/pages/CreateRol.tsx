import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { fetchRol, createRol, editRol } from '../api/rolApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPermissions } from '../api/permissionApi';
import FormMultiSelect from '../components/FormMultiSelect';

interface Option {
  id: number;
  name: string;
}

const CreateRol = () => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState<{ value: number, label: string }[]>([]);

    const user = {
        name: 'Luis Monroy',
    };
  
    const [formData, setFormData] = useState({
        name: '',
        permissions: [],
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

      const loadRoles = async () => {
          try {
              const data = await fetchPermissions();
              const fetchedOptions = data.map((option: Option) => ({
                value: option.id,
                label: option.name,
              }));
              if (id) {
                try {
                  const response = await fetchRol(id);
                  const { name } = response;
                  const permissions = response.permissions.map((option: Option) => ({
                    value: option.id,
                    label: option.name,
                  }));
                  setFormData((prev) => ({ ...prev, name, permissions }));

                } catch (error) {
                  setError(`Error al cargar los datos del usuario. ${error}`);
                } finally {
                  setLoading(false);
                }
              }
              setOptions(fetchedOptions);
          } catch (error) {

              setError(`Error al cargar los datos del usuario. ${error}`);

          } finally {

            setLoading(false);

          }
        };

      loadRoles();

    }, [id]);

    if (loading) {
      return <LoadingSpinner />;
    }
  
    const onSubmit = async (data) => {
      
      try {
        if (id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.permissions = data.permissions.map((option: any) => (option.label));
          await editRol(data, Number(id));

        } else {

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.permissions = data.permissions.map((option: any) => (option.label));
          await createRol(data);

        }

        setError(null);
        navigate('/roles');
      } catch (error) {
        setError(id ? 'Error al actualizar el roles.' : `Error al crear el roles. ${error}`);
      }

    };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            />

            <main className="grow">

                <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

                    <div className="sm:flex sm:justify-between sm:items-center mb-5">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                                {id ? 'Editar Rol' : 'Crear Rol'}
                            </h1>
                        </div>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    
                    <Form onSubmit={onSubmit}>
                        <div className="space-y-4 max-w-sm w-full px-4 py-8">
                            
                            <FormInput
                                name="name"
                                label="Nombre"
                                type="text"
                                validation={{ required: 'Nombre es requerido' }}
                                defaultValue={formData.name}
                            />

                            <FormMultiSelect
                                name="permissions"
                                label="Opciones"
                                options={options}
                                placeholder="Opciones"
                                defaultValue={formData.permissions || []}
                                validation={{ required: 'Opciones es requerido' }}
                            />
                            
                            <div className="flex items-center justify-between mt-8">
                                <Button type="submit" variant="primary">
                                {id ? 'Actualizar' : 'Registrar'}
                                </Button>
                            </div>
                        
                        </div>

                    </Form>
                </div>
                
            </main>
            

            
        

        </div>

    </div>
    
  );
};

export default CreateRol;
