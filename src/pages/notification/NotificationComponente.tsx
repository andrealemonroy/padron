import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import Alert from '../../components/Alert';
import { getActions } from '../../utils/actions';
import { HiPlus } from 'react-icons/hi';
import Button from '../../components/Button';

// 1. IMPORTAR LAS FUNCIONES DE LA NUEVA API
import { fetchNotificationRules, deleteNotificationRule } from '../../api/notificationApi';

// 2. DEFINIR LA INTERFAZ DE LOS DATOS DE LA TABLA
interface NotificationRuleData {
  id: number;
  type: string;
  description: string;
  time_value: number;
  time_unit: string;
  notify_to: string[]; // Es un arreglo de JSON
  color: string | null;
  base_limit_years: number | null;
  is_active: number | boolean;
}

const NotificationComponente = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataValues, setDataValues] = useState<NotificationRuleData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotificationRules = async () => {
    try {
      setLoading(true);
      const data: NotificationRuleData[] = await fetchNotificationRules();
      setDataValues(data);
    } catch (error) {
      console.error('Error fetching notification rules:', error);
      toast.error('Error al cargar las reglas de notificación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationRules();
  }, []);

  const handleEdit = (rule: NotificationRuleData) => {
    navigate(`/edit-notification/${rule.id}`);
  };

  const handleAdd = () => {
    navigate('/create-notification');
  };

  const handleDelete = (rule: NotificationRuleData) => {
    setShowAlert(true);
    setIdToDelete(rule.id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteNotificationRule(idToDelete);
        setShowAlert(false);
        toast.success('Regla de notificación eliminada exitosamente');
        await loadNotificationRules();
      } catch (error) {
        console.error('Error al eliminar:', error);
        toast.error('Error al eliminar la regla');
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
    { label: 'Reglas de Notificación', path: '/notifications' },
  ];

  const addButton = (
    <div className="flex space-x-4">
      <Button
        type="button"
        className="w-auto px-4 h-10 btn bg-blue-600 text-white hover:bg-blue-700 rounded-md flex gap-2 items-center transition-colors"
        onClick={handleAdd}
      >
        <HiPlus size={20} />
        <span>Crear Regla</span>
      </Button>
    </div>
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      {showAlert && (
        <Alert
          message="¿Estás seguro de que deseas eliminar esta regla de notificación?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
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
                    header: 'Tipo de Alerta',
                    accessorKey: 'type',
                    cell: (info) => {
                      const value = info.getValue() as string;
                      return (
                        <span className="font-semibold text-gray-800">
                          {value === 'vencimiento_contrato' ? 'Vencimiento' : 'Límite de Tiempo'}
                        </span>
                      );
                    },
                  },
                  {
                    header: 'Descripción',
                    accessorKey: 'description',
                    cell: (info) => info.getValue(),
                    meta: { width: '300px' },
                  },
                  {
                    header: 'Tiempo',
                    accessorKey: 'time_value',
                    cell: ({ row }) => {
                      // Traduce de inglés a español
                      const unit = row.original.time_unit === 'months' ? 'meses'
                        : row.original.time_unit === 'years' ? 'años'
                          : 'días';
                      return `${row.original.time_value} ${unit} antes`;
                    },
                  },
                  {
                    header: 'Destinatarios',
                    accessorKey: 'notify_to',
                    cell: (info) => {
                      const arr = info.getValue() as string[];
                      return (
                        <div className="flex flex-wrap gap-1">
                          {arr.map((role) => (
                            <span key={role} className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 text-[10px] uppercase font-bold rounded">
                              {role}
                            </span>
                          ))}
                        </div>
                      );
                    },
                  },
                  {
                    header: 'Color',
                    accessorKey: 'color',
                    cell: (info) => {
                      const color = info.getValue() as string;
                      if (!color) return <span className="text-gray-400">-</span>;

                      // Clases condicionales para pintar la bolita del color exacto
                      let bgClass = 'bg-gray-400';
                      if (color === 'verde') bgClass = 'bg-green-500';
                      if (color === 'ambar') bgClass = 'bg-yellow-500';
                      if (color === 'rojo') bgClass = 'bg-red-500';

                      return (
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${bgClass}`}></span>
                          <span className="capitalize">{color}</span>
                        </div>
                      );
                    },
                  },
                  {
                    header: 'Estado',
                    accessorKey: 'is_active',
                    cell: (info) => {
                      // Maneja si viene como boolean o como tinyint (1/0)
                      const isActive = info.getValue() === 1 || info.getValue() === true;
                      return (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      );
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

export default NotificationComponente;