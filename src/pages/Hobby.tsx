import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';

import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { fetchHobbies } from '../api/hobbyApi';
import { getActions } from '../utils/actions';

const Hobby = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchHobbies();
        setHobbies(data);
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
        setHobbies((prev) => prev.filter((dev) => dev.id !== idToDelete));
        setShowAlert(false);
        navigate('/hobbie');
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

  const handleEdit = (data) => {
    navigate(`/edit-hobbie/${data.id}`);
  };

  const breadcrumbItems = [{ label: 'Hobbies', path: '/hobbie' }];

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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <Table
                columns={[
                  {
                    header: 'Nombre',
                    accessorKey: 'name',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Código',
                    cell: (info) => {
                      const hobbies = info.row.original.hobbies_user || [];
                      return hobbies.length > 0
                        ? hobbies.map((hobby) => hobby.code).join(' / ')
                        : '';
                    },
                  },
                  {
                    header: 'Descripción',
                    cell: (info) => {
                      const hobbies = info.row.original.hobbies_user || [];
                      return hobbies.length > 0
                        ? hobbies.map((hobby) => hobby.description).join(' / ')
                        : '';
                    },
                  },
                ]}
                data={hobbies}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Hobby;
