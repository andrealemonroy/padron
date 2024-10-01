import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { fetchDependents } from '../api/dependentApi';



const Dependent = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dependents, seDependents] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = {
    name: 'Luis Monroy',
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchDependents();
        seDependents(data);
      } catch (error) {
        console.error('Error fetching :', error);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/edit-dependent/${id}`);
  };

  const handleDelete = async (id: number) => {
    console.log(id);
  };

  const breadcrumbItems = [
    { label: 'Derecho habientes', path: '/dependent' },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
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
                  header: 'Tipo de doc',
                  accessorKey: 'dependent.document_type',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Número',
                  accessorKey: 'dependent.document_number',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'País',
                  accessorKey: 'dependent.document_country',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'nacimiento',
                  accessorKey: 'dependent.birth_date',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Apellido paterno',
                  accessorKey: 'dependent.last_name_father',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Apellido materno',
                  accessorKey: 'dependent.last_name_mother',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Nombres',
                  accessorKey: 'dependent.first_name',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Sexo',
                  accessorKey: 'dependent.gender',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Vínculo',
                  accessorKey: 'dependent.family_relationship',
                  cell: (info) => info.getValue(),
                },
              ]}
              data={dependents}
              fetchData={fetchDependents}
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

export default Dependent;
