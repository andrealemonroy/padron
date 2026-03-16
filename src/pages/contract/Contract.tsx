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
import { deleteContract, fetchContracts, fetchImportData } from '../../api/contractApi';
import { downloadContractDocx, uploadSignedContract, markContractAsPhysical } from '../../api/contractApi';
import Button from '../../components/Button';
import { HiCloudUpload, HiUserAdd, HiDocumentText, HiUpload, HiArchive } from 'react-icons/hi';

// 1. Agregamos los estados visuales a la interfaz
interface RowData {
  id: number;
  user: {
    name: string;
  };
  start_date: string;
  end_date: string;
  status: number;
  // Variables opcionales para la reacción visual
  is_emitted?: boolean;
  is_uploaded?: boolean;
  is_physical?: boolean;
}

const Contract = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataValues, setDataValues] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [selectedContractIdForUpload, setSelectedContractIdForUpload] = useState<number | null>(null);

  const [showPhysicalAlert, setShowPhysicalAlert] = useState(false);
  const [contractIdForPhysical, setContractIdForPhysical] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data: RowData[] = await fetchContracts();
        // Inicialmente asumimos que todo está en false o lo traemos de tu base de datos si ya existe
        setDataValues(data.filter((item) => item.status === 1));
      } catch (error) {
        console.error('Error fetching contracts:', error);
        toast.error('Error al cargar los contratos');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEdit = (data: RowData) => {
    navigate(`/edit-contract/${data.id}`);
  };

  const handleDelete = async (data: RowData) => {
    setShowAlert(true);
    setIdToDelete(data.id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteContract(idToDelete);
        setShowAlert(false);
        toast.success('Contrato eliminado exitosamente');
        const data: RowData[] = await fetchContracts();
        setDataValues(data.filter((item) => item.status === 1));
      } catch (error) {
        console.error('Error al eliminar el contrato:', error);
        toast.error('Error al eliminar el contrato');
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

  const handleAddMassive = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast.error('No se seleccionó ningún archivo');
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      await fetchImportData(formData);
      toast.success('Usuarios importados exitosamente');
      const data: RowData[] = await fetchContracts();
      setDataValues(data.filter((item) => item.status === 1));
    } catch (error) {
      console.error('Error al importar usuarios:', error);
      toast.error('Error al importar usuarios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  // 2. Función Emitir (AZUL) - Actualiza el estado visual al terminar
  const handleEmitirContrato = async (contract: RowData) => {
    try {
      setLoading(true);
      const blob = await downloadContractDocx(contract.id);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Contrato_${contract.user.name.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Contrato emitido exitosamente');

      // 🔥 Magia visual: Cambiamos el estado de este contrato específico para encender el botón
      setDataValues((prev) =>
        prev.map((item) =>
          item.id === contract.id ? { ...item, is_emitted: true } : item
        )
      );

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al descargar el documento.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Funciones simuladas para los otros botones para probar la "reacción" visual
  const handleMarcarSubido = (contract: RowData) => {
    // Aquí luego programarás la subida del PDF firmado
    setDataValues((prev) => prev.map((item) => item.id === contract.id ? { ...item, is_uploaded: true } : item));
    toast.success('Marcado como Subido (Simulación)');
  };

  const handleMarcarFisico = (contract: RowData) => {
    // Aquí luego programarás el check en la base de datos
    setDataValues((prev) => prev.map((item) => item.id === contract.id ? { ...item, is_physical: true } : item));
    toast.success('Marcado como Físico (Simulación)');
  };

  const handleMarcarSubidoClick = (contract: RowData) => {
    // Guardamos qué contrato estamos intentando subir
    setSelectedContractIdForUpload(contract.id);
    // Simulamos un clic en el input de archivo oculto
    hiddenFileInput.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Si canceló la selección o no hay contrato seleccionado, no hacemos nada
    if (!file || !selectedContractIdForUpload) return;

    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);

      // Llamamos a Laravel para subir el archivo
      await uploadSignedContract(selectedContractIdForUpload, formData);

      // 🔥 Magia visual: Encendemos el botón naranja en la tabla
      setDataValues((prev) =>
        prev.map((item) =>
          item.id === selectedContractIdForUpload ? { ...item, is_uploaded: true } : item
        )
      );

      toast.success('Contrato firmado subido exitosamente');
    } catch (error: any) {
      console.error('Error uploading contract:', error);
      toast.error(error.response?.data?.message || 'Error al subir el contrato firmado');
    } finally {
      setLoading(false);
      setSelectedContractIdForUpload(null);
      // Limpiamos el input por si quiere subir otro archivo con el mismo nombre luego
      if (hiddenFileInput.current) {
        hiddenFileInput.current.value = '';
      }
    }
  };

  const handleMarcarFisicoClick = (contract: RowData) => {
    // Si ya está marcado, podríamos evitar que salga la alerta de nuevo (opcional)
    if (contract.is_physical) {
      toast.info('Este contrato ya está archivado físicamente');
      return;
    }
    setContractIdForPhysical(contract.id);
    setShowPhysicalAlert(true); // Mostramos el popup
  };

  const confirmMarcarFisico = async () => {
    if (!contractIdForPhysical) return;

    setLoading(true);
    try {
      // Llamamos a Laravel
      await markContractAsPhysical(contractIdForPhysical);

      // Encendemos el botón verde en la tabla
      setDataValues((prev) =>
        prev.map((item) =>
          item.id === contractIdForPhysical ? { ...item, is_physical: true } : item
        )
      );
      toast.success('Contrato registrado en el archivo físico');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al registrar el documento físico');
    } finally {
      setLoading(false);
      setShowPhysicalAlert(false);
      setContractIdForPhysical(null);
    }
  };

  const cancelMarcarFisico = () => {
    setShowPhysicalAlert(false);
    setContractIdForPhysical(null);
  };

  const breadcrumbItems = [
    { label: 'Contratos', path: '/contract' },
  ];

  const addButton = (
    <div className="flex space-x-4">
      <Button
        type="button"
        className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-md flex gap-1 items-center"
        onClick={handleAdd}
      >
        <HiUserAdd size={20} />
        <span className="max-xs:sr-only">Crear Contrato</span>
      </Button>
      <label className="w-44 h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white cursor-pointer flex gap-1 items-center">
        <input type="file" className="hidden" onChange={handleAddMassive} accept=".xlsx,.xls,.csv" />
        <HiCloudUpload size={20} />
        <span className="max-xs:sr-only">Importar</span>
      </label>
    </div>
  );



  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      {showAlert && (
        <Alert message="¿Estás seguro de que deseas eliminar este contrato?" onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}

      {showPhysicalAlert && (
        <Alert
          message="¿Confirmas que tienes el documento firmado en físico y ya fue guardado en su file correspondiente?"
          onConfirm={confirmMarcarFisico}
          onCancel={cancelMarcarFisico}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

            <input
              type="file"
              accept="application/pdf"
              ref={hiddenFileInput}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="sm:flex sm:justify-between sm:items-center">
              <Breadcrumb items={breadcrumbItems}>
                {addButton}
              </Breadcrumb>
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
              <Table
                columns={[
                  {
                    header: 'Nombre',
                    accessorKey: 'user.name',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Fecha de inicio',
                    accessorKey: 'start_date',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Fases del Documento',
                    id: 'document_status',
                    cell: ({ row }) => {
                      const contract = row.original;

                      return (
                        <div className="flex items-center gap-2">

                          {/* 1. Botón Emitido (AZUL) */}
                          <button
                            onClick={() => handleEmitirContrato(contract)}
                            className={`flex items-center justify-center w-8 h-8 rounded transition-colors duration-300 ${contract.is_emitted
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm'
                              : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-500'
                              }`}
                            title={contract.is_emitted ? "Contrato ya emitido (Volver a descargar)" : "Emitir Contrato (Word)"}
                          >
                            <HiDocumentText size={18} />
                          </button>

                          {/* 2. Botón Subido (NARANJA) - AHORA CONECTADO */}
                          <button
                            onClick={() => handleMarcarSubidoClick(contract)}
                            className={`flex items-center justify-center w-8 h-8 rounded transition-colors duration-300 ${contract.is_uploaded
                              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm'
                              : 'bg-slate-100 text-slate-400 hover:bg-orange-50 hover:text-orange-500'
                              }`}
                            title={contract.is_uploaded ? "Reemplazar contrato firmado (PDF)" : "Subir Contrato Firmado (PDF)"}
                          >
                            <HiUpload size={18} />
                          </button>

                          {/* 3. Botón Físico (VERDE) */}
                          <button
                            onClick={() => handleMarcarFisicoClick(contract)}
                            className={`flex items-center justify-center w-8 h-8 rounded transition-colors duration-300 ${contract.is_physical
                                ? 'bg-green-100 text-green-600 hover:bg-green-200 shadow-sm'
                                : 'bg-slate-100 text-slate-400 hover:bg-green-50 hover:text-green-500'
                              }`}
                            title={contract.is_physical ? "Archivado físicamente" : "Marcar como Físico en Archivo"}
                          >
                            <HiArchive size={18} />
                          </button>

                        </div>
                      )
                    },
                  },
                ]}
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

export default Contract;