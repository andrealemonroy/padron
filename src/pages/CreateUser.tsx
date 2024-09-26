// src/components/CreateUser.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import DropdownClassic from '../components/DropdownClassic';
import { fetchRoles } from '../api/rolApi';
import {createUser, fetchUser, editUser} from '../api/userApi';

const CreateUser = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const { id } = useParams<{ id: string }>(); // Detecta si hay un id para editar
    const navigate = useNavigate();

    const user = {
        name: 'Luis Monroy',
    };
  
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        roles: [],
    });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const loadRoles = async () => {
        try {
            const data = await fetchRoles();
            setRoles(data);
        } catch (error) {
            setError(`Error al cargar los datos del usuario. ${error}`);
        }
      };

    loadRoles();

    if (id) {
        
      const loadUser = async () => {
        try {
          const response = await fetchUser(id);
          const { name, email, roles } = response;
          console.log(roles);
          setFormData((prev) => ({ ...prev, name, email, roles }));
        } catch (error) {
          setError(`Error al cargar los datos del usuario. ${error}`);
        }
      };
      
      loadUser();
    }
  }, [id]);

  

  const onSubmit = async (data) => {

    try {
      if (id) {

        await editUser(data, Number(id));

      } else {

        await createUser(data);

      }

      setError(null);
      navigate('/dashboard');
    } catch (error) {
      setError(id ? 'Error al actualizar el usuario.' : `Error al crear el usuario. ${error}`);
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
                                {id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
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
                            <FormInput
                                name="email"
                                label="Correo electrónico"
                                type="email"
                                defaultValue={formData.email}
                                validation={{ required: 'Correo electrónico es requerido' }}
                            />
                            
                            {roles.length > 0 ? (
                                <DropdownClassic 
                                label="Rol"
                                name="role"
                                options={roles}
                                defaultSelected={formData.roles?.[0]?.id || roles[0]?.id} // Muestra el primer rol del usuario o el primer rol disponible
                                validation={{ required: 'El rol es requerido' }}
                                />
                            ) : (
                                <p>Cargando roles...</p> // Muestra un mensaje mientras los roles se cargan
                            )}

                            <div className="flex items-center justify-between mt-8">
                                <Button type="submit" variant="primary">
                                    Registrar
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

export default CreateUser;
