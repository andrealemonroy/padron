import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';

import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { fetchEducations } from '../api/EducationsApi';


const Educations = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = {
    name: 'Luis Monroy',
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchEducations();
        setEducation(data);
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
              //await editPensionSystems(idToDelete);
              setEducation((prev) => prev.filter(dev => dev.id !== idToDelete));
              setShowAlert(false);
              navigate('/educations');
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
    navigate(`/edit-educations/${id}`);
  };

  const breadcrumbItems = [
    { label: 'Datos Educativos', path: '/educations' },
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
                  header: 'Año de Egreso',
                  accessorKey: 'education.graduation_year',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Profesión',
                  accessorKey: 'education.profession_name',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Especialización',
                  accessorKey: 'education.educational_level',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Institución',
                  accessorKey: 'education.study_center',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'País',
                  accessorKey: 'education.last_experience_dismissal_reason',
                  cell: (info) => info.getValue(),
                },
              ]}
              data={education}
              fetchData={fetchEducations}
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

export default Educations;
