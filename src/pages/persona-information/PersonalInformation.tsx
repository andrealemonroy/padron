import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import { fetchPersonalInformations, deletePersonalInformation } from '../../api/personalInformationApi';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import { ColumnDef } from '@tanstack/react-table';
import { getActions } from '../../utils/actions';

interface PersonalInformationData {
  id: number;
  name: string;
  email: string;
  personal_information: {
    document_type: string;
    document_number: string;
    birth_date: string;
  };
}

const PersonalInformation = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [personalInformation, setPersonalInformation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPersonalInformations();
        setPersonalInformation(data);
      } catch (error) {
        console.error('Error fetching personal information:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = (data: PersonalInformationData) => {
    setShowAlert(true);
    setIdToDelete(data.id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deletePersonalInformation(idToDelete);
        setPersonalInformation((prev) => prev.filter((info) => info.id !== idToDelete));
        setShowAlert(false);
        // Optionally navigate or show a success message
      } catch (error) {
        console.error('Error deleting personal information:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const handleEdit = (data: PersonalInformationData) => {
    navigate(`/edit-basic/${data.id}`);
  };

  const breadcrumbItems = [{ label: 'Datos Básicos', path: '/basic' }];

  // Define the columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<PersonalInformationData, any>[] = [
    {
      header: 'Nombre',
      accessorKey: 'name',
      cell: (info) => info.getValue(),
      meta: {
        width: '400px',
        filterComponent: (column) => (
          <input
            type="text"
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filtrar Nombre"
            className="w-full px-2 py-1 text-sm border rounded"
          />
        ),
      },
      filterFn: 'includesString',
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: (info) => info.getValue(),
      meta: {
        width: '250px',
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
      filterFn: 'includesString',
    },
    {
      header: 'Tipo documento',
      accessorKey: 'personal_information.document_type',
      cell: (info) => info.getValue(),
      meta: {
        width: '150px',
        filterComponent: (column) => (
          <input
            type="text"
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filtrar Tipo Documento"
            className="w-full px-2 py-1 text-sm border rounded"
          />
        ),
      },
      filterFn: 'includesString',
    },
    {
      header: 'Nro documento',
      accessorKey: 'personal_information.document_number',
      cell: (info) => info.getValue(),
      meta: {
        width: '150px',
        filterComponent: (column) => (
          <input
            type="text"
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filtrar Número Documento"
            className="w-full px-2 py-1 text-sm border rounded"
          />
        ),
      },
      filterFn: 'includesString',
    },
    {
      header: 'Nacimiento',
      accessorKey: 'personal_information.birth_date',
      cell: (info) => info.getValue(),
      meta: {
        width: '150px',
        filterComponent: (column) => (
          <input
            type="date"
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
          />
        ),
      },
      filterFn: 'equals', // Assuming you want to filter by exact date
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
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
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              <Breadcrumb items={breadcrumbItems} />
              {/* If you have any add buttons, include them here */}
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <Table
                columns={columns}
                data={personalInformation}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalInformation;