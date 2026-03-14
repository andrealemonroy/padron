import { useEffect, useState, useMemo, useRef } from 'react';
import { Layout } from '../../components/Layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import { fetchPadron } from '../../api/userApi';
import { descargarContratoWord, reportsPadron } from '../../api/contractApi';

export const HistoricoPage = () => {
  const [dataValues, setDataValues] = useState<any[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Usaremos una clave en string o number para llevar el control de los seleccionados
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  // Cargar padrón (cabeceras y datos) al montar la página
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchPadron(); // Llama a tu endpoint obtenerUsuariosJson

        // Verificamos que el backend traiga la estructura { headers, data }
        if (response && response.headers && response.data) {
          setTableHeaders(response.headers);
          setDataValues(response.data);
        } else {
          // Fallback por si acaso devuelve directo el arreglo
          setDataValues(response || []);
          if (response && response.length > 0) {
            setTableHeaders(Object.keys(response[0]));
          }
        }
      } catch (error) {
        console.error('Error fetching Padrón:', error);
        toast.error('Error al cargar el padrón');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const memoizedData = useMemo(() => dataValues, [dataValues]);

  // Manejar el estado del checkbox "Seleccionar todos"
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      if (dataValues.length > 0 && dataValues.every((row) => selectedRows[row['IT']])) {
        selectAllCheckboxRef.current.checked = true;
      } else {
        selectAllCheckboxRef.current.checked = false;
      }
    }
  }, [selectedRows, dataValues]);

  // Funciones de selección (Checkboxes) usando 'IT' (correlativo) como identificador único
  const handleSelectAll = (isChecked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {};
    dataValues.forEach((row) => {
      if (row['IT']) {
        newSelectedRows[row['IT']] = isChecked;
      }
    });
    setSelectedRows(newSelectedRows);
  };

  const handleSelectRow = (rowId: string, isChecked: boolean) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowId]: isChecked,
    }));
  };

  // Filtrar los usuarios seleccionados
  const selectedRowData = dataValues.filter((row) => selectedRows[row['IT']]);

  // Función de descarga
  const handleMassiveDownload = async () => {
    // Aquí asumimos que "NroDoc" o "Cd_Trab" se usa como ID si quieres enviarlo al backend para descargar el Excel.
    // Ajusta 'NroDoc' al campo que uses como identificador en tu backend para el whereIn()
    const selectedFields = selectedRowData.map((user) => ({
      value: String(user['IT']), // Cambia 'NroDoc' si tu backend usa otro id
      label: String(user['Nombres']),
    }));

    /*const selectedFields = selectedRowData.map((user) => ({
      value: String(user.id),
      label: user.name,
    }));
*/
    if (selectedFields.length === 0) {
      toast.warning('Por favor, selecciona al menos un trabajador para exportar.');
      return;
    }

    try {
      setLoading(true);
      const response = {
        selectedFields,
      };

      const blob = await descargarContratoWord(response); //await reportsPadron(response);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'contrato_trabajador.docx';//`padron_historico.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Se descargó el reporte correctamente');
    } catch (error) {
      console.error('Error en la descarga masiva:', error);
      toast.error('Error al descargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Padrón Histórico', path: '/historico' },
  ];

  // ==========================================
  // GENERACIÓN DINÁMICA DE COLUMNAS
  // ==========================================
  // Establecer filtro inicial "Activo" para la columna Estado cuando se cargan los headers
  const [initialFilterSet, setInitialFilterSet] = useState(false);

  useEffect(() => {
    if (tableHeaders.length > 0 && !initialFilterSet) {
      const estadoHeader = tableHeaders.find(
        (h) => h.toLowerCase() === 'estado'
      );
      if (estadoHeader) {
        // No se puede llamar a column.setFilterValue directamente aquí,
        // así que usaremos el estado de filtro de la tabla indirectamente
        // estableciendo un valor por defecto que el Table component recogerá
        setInitialFilterSet(true);
      }
    }
  }, [tableHeaders, initialFilterSet]);

  const dynamicColumns = useMemo(() => {
    // 1. Columna fija de Checkboxes al inicio
    const columns: any[] = [
      {
        id: 'selection',
        header: () => (
          <input
            ref={selectAllCheckboxRef}
            type="checkbox"
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={
              dataValues.length > 0 &&
              dataValues.every((row) => selectedRows[row['IT']])
            }
          />
        ),
        cell: ({ row }: any) => (
          <input
            type="checkbox"
            checked={!!selectedRows[row.original['IT']]}
            onChange={(e) =>
              handleSelectRow(row.original['IT'], e.target.checked)
            }
          />
        ),
        meta: { width: '50px' },
      },
    ];

    // 2. Columnas dinámicas basadas en los headers del backend
    tableHeaders.forEach((header) => {
      const isEstado = header.toLowerCase() === 'estado';

      columns.push({
        header: header,
        accessorKey: header,
        cell: (info: any) => info.getValue() ?? '-',
        filterFn: isEstado
          ? (row: any, columnId: string, filterValue: string) => {
            if (!filterValue || filterValue === '') return true;
            const cellValue = String(row.getValue(columnId) ?? '').toLowerCase();
            return cellValue === filterValue.toLowerCase();
          }
          : undefined,
        meta: {
          ...(isEstado
            ? {
              filterComponent: (column: any) => {
                // Establecer "Activo" como valor por defecto si no tiene filtro aún
                if (column.getFilterValue() === undefined && !initialFilterSet) {
                  setTimeout(() => column.setFilterValue('Activo'), 0);
                }
                return (
                  <select
                    value={(column.getFilterValue() ?? 'Activo') as string}
                    onChange={(e) =>
                      column.setFilterValue(
                        e.target.value === '' ? undefined : e.target.value
                      )
                    }
                    className="w-full px-2 py-1 text-sm border rounded bg-[#1e1e1e] text-white border-gray-600"
                  >
                    <option value="">Todos</option>
                    <option value="Activo">Activo</option>
                    <option value="Cesado">Cesado</option>
                  </select>
                );
              },
            }
            : {
              filterComponent: (column: any) => (
                <input
                  type="text"
                  value={(column.getFilterValue() ?? '') as string}
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  placeholder={`Filtrar ${header}`}
                  className="w-full px-2 py-1 text-sm border rounded bg-[#1e1e1e] text-white border-gray-600"
                />
              ),
            }),
        },
      });
    });

    return columns;
  }, [tableHeaders, dataValues, selectedRows, initialFilterSet]);

  return (
    <Layout>
      <ToastContainer />
      <div className="flex h-[100dvh] overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-6">
          <h1 className="text-2xl font-bold mb-4">Padrón General de Trabajadores - Histórico</h1>

          <main className="grow">
            <div className="w-full mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-5">
                <Breadcrumb
                  items={breadcrumbItems}
                  buttons={[
                    {
                      text: 'Descargar Excel',
                      action: handleMassiveDownload,
                    },
                  ]}
                />
              </div>

              {loading ? (
                <Spinner loading={loading} size={50} color="#3498db" />
              ) : (
                <>
                  <Table
                    columns={dynamicColumns}
                    data={memoizedData}
                    actions={null}
                  />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};