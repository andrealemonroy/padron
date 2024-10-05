import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/BreadCrumb';
import { fetchComplementaries } from '../api/complementariesApi';



const Complementaries = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [complementary, setComplementary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchComplementaries();
        setComplementary(data);
      } catch (error) {
        console.error('Error fetching :', error);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/edit-complementaries/${id}`);
  };

  const handleDelete = async (id: number) => {
    console.log(id);
  };

  const breadcrumbItems = [
    { label: 'Datos complementarios', path: '/complementaries' },
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
                  header: 'Apellidos y Nombres',
                  accessorKey: 'name',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Sueldo',
                  accessorKey: 'complementary.salary',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Regimen',
                  accessorKey: 'complementary.labor_regime',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Ocupacion',
                  accessorKey: 'complementary.occupation',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Tipo contrato',
                  accessorKey: 'complementary.contract_type',
                  cell: (info) => info.getValue(),
                },
                {
                  header: 'Posicion',
                  accessorKey: 'complementary.payroll_position',
                  cell: (info) => info.getValue(),
                },
              ]}
              data={complementary}
              fetchData={fetchComplementaries}
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

export default Complementaries;
