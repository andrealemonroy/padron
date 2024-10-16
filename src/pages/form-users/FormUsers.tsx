import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import Alert from '../../components/Alert';
import { fetchFormUsers } from '../../api/formUserApi';
import { deleteProject } from '../../api/projectApi';
import { getActions } from '../../utils/actions';
import { sendEmailApi } from '../../api/userApi';

const FormUsers = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataValues, setDataValues] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchFormUsers();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching Formulario:', error);
        toast.error('Error al cargar los Formulario');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  const handleEdit = (data) => {
    navigate(`/edit-form/${data.id}`);
  };

  const sendEmail = async (data) => {
    try {
      const response = await sendEmailApi(data.id);
      toast.success('Correo enviado correctamente');
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error('Error al enviar el correo');
    }
  }

  const sendUrl = async (data) => {
    console.log(data.url)
    window.open(data.url, '_blank');
  }

  const handleDelete = async (data) => {
    console.log(data.id);
    setShowAlert(true);
    setIdToDelete(data.id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      console.log(idToDelete);
      setLoading(true);
        try {
            await deleteProject(idToDelete);
            setDataValues((prev) => prev.filter(dev => dev.id !== idToDelete));
            setShowAlert(false);
            toast.success('Formulario eliminado exitosamente');
            navigate('/form');
        } catch (error) {
            console.error('Error al eliminar el formulario:', error);
            toast.error('Error al eliminar el formulario');
        } finally {
          setLoading(false);
        }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const breadcrumbItems = [
    { label: 'Formularios', path: '/form' },
  ];

  const handleAdd = () => {
    navigate('/create-form');
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      {showAlert && (
                <Alert
                    message="¿Estás seguro de que deseas eliminar este formulario?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              {/* Add breadcrumb here */}
              <Breadcrumb 
                items={breadcrumbItems}
                buttons={[
                  {
                    text: 'Agregar Formulario',
                    action: handleAdd,
                  },
                ]}
              />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <>

              <Table
                columns={[
                  {
                    header: 'Descripción',
                    accessorKey: 'description',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Descripción"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Usuario',
                    accessorKey: 'user.name',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Usuario"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Email',
                    accessorKey: 'user.email',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Email"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Estado',
                    accessorKey: 'form_status.description',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Estado"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Tipo',
                    accessorKey: 'form_type.description',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="text"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          placeholder="Filtrar Tipo"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                ]}
                data={dataValues}
                actions={getActions({ handleEdit, handleDelete, sendEmail, sendUrl })}
              />
              </>
            )}
            

          </div>

        </main>
      </div>
    </div>
  );
};

export default FormUsers;
