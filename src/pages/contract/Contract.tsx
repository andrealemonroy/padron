import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import Alert from '../../components/Alert';
import { getActions } from '../../utils/actions';
import { deleteContract, fetchContracts, fetchDownload, fetchImportData } from '../../api/contractApi';
import { HiCloudUpload, HiDownload, HiUserAdd } from 'react-icons/hi';
import Button from '../../components/Button';

interface RowData {
  id: number;
  user: {
    name: string;
  };
  start_date: string;
  end_date: string;
  pdf_contract_url: string;
  // Add other fields as needed
}

const Contract = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataValues, setDataValues] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data: RowData[] = await fetchContracts();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  const handleEdit = (data) => {
    navigate(`/edit-contract/${data.id}`);
  };

  const handleDelete = async (data) => {
    setShowAlert(true);
    setIdToDelete(data.id);
  };

  const btnContract = async (contract) => {
    try {
      console.log(contract);
        setLoading(true);

        // Realiza la solicitud para obtener el archivo
        const blob = await fetchDownload(contract.user_id, 1); // Obtiene el Blob del archivo

        // Crea un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Asigna un nombre al archivo que se descargará
        link.download = `${contract.user.name || 'contrato'}.pdf`; // Cambia `.pdf` según el tipo de archivo

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


const btnContract2 = async (contract) => {
  try {
    console.log(contract);
      setLoading(true);

      // Realiza la solicitud para obtener el archivo
      const blob = await fetchDownload(contract.user_id, 2); // Obtiene el Blob del archivo

      // Crea un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Asigna un nombre al archivo que se descargará
      link.download = `${contract.user.name || 'contrato'}.pdf`; // Cambia `.pdf` según el tipo de archivo

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

const btnContract3 = async (contract) => {
  try {
    console.log(contract);
      setLoading(true);

      // Realiza la solicitud para obtener el archivo
      const blob = await fetchDownload(contract.user_id, 3); // Obtiene el Blob del archivo

      // Crea un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Asigna un nombre al archivo que se descargará
      link.download = `${contract.user.name || 'contrato'}.pdf`; // Cambia `.pdf` según el tipo de archivo

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

const handleMassiveDownload = async (type: number) => {
  try {
    setLoading(true);
    const downloadPromises = selectedRowData.map(async (contract) => {
      const blob = await fetchDownload(contract.id, type);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contract.user.name || 'contrato'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
    await Promise.all(downloadPromises);
    toast.success('Descargas completadas exitosamente');
  } catch (error) {
    console.error('Error en la descarga masiva:', error);
    toast.error('Error al descargar los archivos');
  } finally {
    setLoading(false);
  }
};

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
        try {
            await deleteContract(idToDelete);
            //setDataValues((prev) => prev.filter(dev => dev.id !== idToDelete));
            setShowAlert(false);
            toast.success('Proyecto eliminado exitosamente');
            navigate('/contract');
        } catch (error) {
            console.error('Error al eliminar el proyecto:', error);
            toast.error('Error al eliminar el proyecto');
        } finally {
          setLoading(false);
        }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const handleAdd = () => {
    navigate('/create-contract');
  };

  const breadcrumbItems = [
    { label: 'Contratos', path: '/contract' },
  ];

  // Handle select all checkbox
  const handleSelectAll = (isChecked: boolean) => {
    const newSelectedRows = {};
    dataValues.forEach((row) => {
      newSelectedRows[row.id] = isChecked;
    });
    setSelectedRows(newSelectedRows);
  };

  // Handle individual row checkbox
  const handleSelectRow = (rowId: number, isChecked: boolean) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowId]: isChecked,
    }));
  };

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      if (dataValues.length > 0 && dataValues.every((row) => selectedRows[row.id])) {
        selectAllCheckboxRef.current.checked = true;
      } else {
        selectAllCheckboxRef.current.checked = false;
      }
    }
  }, [selectedRows, dataValues]);

  const handleAddMassive = async (
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
      const result = await fetchImportData(formData);
      toast.success('Usuarios importados exitosamente');
      console.log(result);
      const data: RowData[] = await fetchContracts();
      setDataValues(data);
    } catch (error) {
      console.error('Error al importar usuarios:', error);
      toast.error('Error al importar usuarios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRowData = dataValues.filter((row) => selectedRows[row.id]);
  const addButton = (
    <div className="flex space-x-4">
      <button
        onClick={() => handleMassiveDownload(1)}
        disabled={selectedRowData.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        CITTIAE
      </button>
      <button
        onClick={() => handleMassiveDownload(2)}
        disabled={selectedRowData.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        CTODSE
      </button>
      <button
        onClick={() => handleMassiveDownload(3)}
        disabled={selectedRowData.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        CTPI
      </button>
      <Button
        type="button"
        className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-md flex gap-1 items-center"
        onClick={handleAdd}
      >
        <HiUserAdd size={20} />
        <span className="max-xs:sr-only">Crear Contrato</span>
      </Button>
      <label className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer flex gap-1 items-center">
        <input
          type="file"
          className="hidden"
          onChange={handleAddMassive}
          accept=".xlsx,.xls,.csv"
        />
        <HiCloudUpload size={20} />
        <span className="max-xs:sr-only">Importar</span>
      </label>
    </div>
  );

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
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <Breadcrumb items={breadcrumbItems} >
                {addButton}
              </Breadcrumb>
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <Table
                columns={[
                  {
                    id: 'selection',
                    header: ({ table }) => (
                      <input
                        ref={selectAllCheckboxRef}
                        type="checkbox"
                        onChange={(e) =>
                          handleSelectAll(e.target.checked)
                        }
                        checked={
                          dataValues.length > 0 && dataValues.every((row) => selectedRows[row.id])
                        }
                      />
                    ),
                    cell: ({ row }) => (
                      <input
                        type="checkbox"
                        checked={!!selectedRows[row.original.id]}
                        onChange={(e) =>
                          handleSelectRow(row.original.id, e.target.checked)
                        }
                      />
                    ),
                    meta: { width: '50px' },
                  },
                  {
                    header: 'Nombre',
                    accessorKey: 'user.name',
                    cell: (info) => info.getValue(),
                    meta: {
                      width: '350px',
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
                    header: 'Fecha de inicio',
                    accessorKey: 'start_date',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="date"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Fecha de finalización',
                    accessorKey: 'end_date',
                    cell: (info) => info.getValue(),
                    meta: {
                      filterComponent: (column) => (
                        <input
                          type="date"
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ),
                    },
                  },
                  {
                    header: 'Archivo',
                    accessorKey: 'pdf_contract_url',
                    cell: (info) => {
                      const url = info.getValue();
                      return url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <HiDownload size={20} />
                        </a>
                      ) : null;
                    },
                  },
                ]}
                data={dataValues}
                actions={getActions({ handleEdit, btnContract3, btnContract2, btnContract, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contract;