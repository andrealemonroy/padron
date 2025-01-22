import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { deleteMasterData, fetchMasterDatas } from '../../api/masterDataApi';
import { fetchImportMasterData } from '../../api/ImportsApi';
import { getActions } from '../../utils/actions';
import { HiCloudUpload, HiUserAdd } from 'react-icons/hi';
import { ColumnDef } from '@tanstack/react-table';
import { fetchDownloadMasterData } from '../../api/contractApi';

const MasterData = () => {
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
        const data = await fetchMasterDatas();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEdit = (data) => {
    navigate(`/edit-master-data/${data.id}`);
  };

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteMasterData(idToDelete);
        setDataValues((prev) => prev.filter((dev) => dev.id !== idToDelete));
        setShowAlert(false);
        toast.success('Master Data Base eliminado exitosamente');
        navigate('/master-data');
      } catch (error) {
        console.error('Error al eliminar el Master Data Base:', error);
        toast.error('Error al eliminar el Master Data Base');
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const breadcrumbItems = [{ label: 'Master Data Base', path: '/master-data' }];

  const handleAdd = () => {
    navigate('/create-master-data');
  };

  const handleAddMassiveMasterData = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast.error('No se seleccionó ningún archivo');
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const result = await fetchImportMasterData(formData);
      console.log('Master Data Base importados exitosamente:', result);
      toast.success('Master Data Base importados exitosamente');
    } catch (error) {
      console.error('Error al importar Master Data Base:', error);
      toast.error(
        'Error al importar Master Data Base. Por favor, intente de nuevo.'
      );
    } finally {
      setLoading(false);
      navigate('/master-data');
    }
  };

  const btnExport = async () => {
    try {
        setLoading(true);

        // Realiza la solicitud para obtener el archivo
        const blob = await fetchDownloadMasterData(); // Obtiene el Blob del archivo

        // Crea un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Asigna un nombre al archivo que se descargará
        link.download = `${'mastedata'}.xlsx`; // Cambia `.pdf` a `.xlsx` para un archivo Excel

        // Simula un clic para iniciar la descarga
        document.body.appendChild(link);
        link.click();

        // Limpia el URL creado y elimina el enlace
        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error fetching contract:', error);
        toast.error('Error al descargar el archivo');
    } finally {
        setLoading(false);
    }
};

  const addButton = (
    <div className="flex space-x-4">
      <Button
        type="button"
        className="w-fit h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-md flex gap-1 items-center"
        onClick={btnExport}
      >
        <HiUserAdd size={20} />
        <span className="max-xs:sr-only">Exportar Data Base</span>
      </Button>
      <Button
        type="button"
        className="w-fit h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-md flex gap-1 items-center"
        onClick={handleAdd}
      >
        <HiUserAdd size={20} />
        <span className="max-xs:sr-only">Crear Master Data Base</span>
      </Button>
      <label className="w-fit h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer flex gap-1 items-center">
        <input
          type="file"
          className="hidden"
          onChange={handleAddMassiveMasterData}
          accept=".xlsx,.xls,.csv"
        />
        <HiCloudUpload size={20} />
        <span className="max-xs:sr-only">Importar Master Data Base</span>
      </label>
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: 'document',
      header: 'Tipo de Documento',
      cell: ({ row }) => {
        const document = row.getValue('document') as { description: string };
        return document?.description || 'Sin Documento';
      },
      filterFn: (row, columnId, filterValue) => {
        const document = row.getValue(columnId) as { description: string };
        if (!filterValue) return true; // Si no hay filtro, mostrar todos los documentos
        return document?.description === filterValue;
      },
      meta: {
        width: '200px',
        filterComponent: (column) => (
          <select
            value={(column.getFilterValue() ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
          >
            <option value="">Todos los Documentos</option>
            {Array.from(
              new Set(dataValues.flatMap((data) => data.document.description))
            ).map((document) => (
              <option key={document} value={document}>
                {document}
              </option>
            ))}
          </select>
        ),
      },
    },
    
    {
      accessorKey: 'DNINumber',
      header: 'Nº Documento',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
      meta: {
        width: '200px',
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
    },
    {
      accessorKey: 'surname1',
      header: 'Apellidos',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
      meta: {
        width: '200px',
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
    },
    {
      accessorKey: 'name',
      header: 'Nombres',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
      meta: {
        width: '300px',
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
    },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      {showAlert && (
        <Alert
          message="¿Estás seguro de que deseas eliminar este usuario?"
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
              <Breadcrumb items={breadcrumbItems}>{addButton}</Breadcrumb>
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <Table
                columns={columns}
                data={dataValues}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MasterData;
