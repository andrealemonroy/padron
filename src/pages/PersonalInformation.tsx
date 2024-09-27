import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { fetchPersonalInformations, deletePersonalInformation} from '../api/personalInformationApi';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';

const PersonalInformation = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [PpersonalInformation, setPersonalInformation] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = {
    name: 'Luis Monroy',
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPersonalInformations();
        setPersonalInformation(data);
      } catch (error) {
        console.error('Error fetching :', error);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
      if (idToDelete) {
        setLoading(true);
          try {
              await deletePersonalInformation(idToDelete);
              setPersonalInformation((prev) => prev.filter(rol => rol.id !== idToDelete));
              setShowAlert(false);
              navigate('/basic');
          } catch (error) {
              console.error('Error al eliminar:', error);
          } finally {
            setLoading(false);
          }
      }
  };

  const cancelDelete = () => {
      setShowAlert(false);
      setIdToDelete(null);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-basic/${id}`);
  };

  const breadcrumbItems = [
    { label: 'Datos Basicos', path: '/basic' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {showAlert && (
                <Alert
                    message="¿Estás seguro de que deseas eliminar este registro?"
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
          user={user}
        />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <>
                <Table
              columns={[
                {
                  header: 'Nombre',
                  accessorKey: 'name',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Email',
                  accessorKey: 'email',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Tipo documento',
                  accessorKey: 'personal_information.document_type',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Número documento',
                  accessorKey: 'personal_information.document_number',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Nacimiento',
                  accessorKey: 'personal_information.birth_date',
                  cell: (info) => info.getValue(),
                },
              ]}
              data={PpersonalInformation}
              fetchData={fetchPersonalInformations}
              pageCount={1}
              addButton={null}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showDeleteButton={false}
            />
              </>
            )}
            

          </div>

        </main>
      </div>
    </div>
  );
};

export default PersonalInformation;
