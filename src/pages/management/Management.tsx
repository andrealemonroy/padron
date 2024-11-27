import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Table from '../../components/Table';
import { Layout } from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import { editManagement, fetchManagement } from '../../api/managementApi';

interface RowData {
  id: number;
  tipoDocumento: string;
  nroDocumento: string;
  nombreCompleto: string;
  // Add other fields as needed
}

const Management = () => {

  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [dataValues, setDataValues] = useState([]);

  const columns: ColumnDef<RowData>[] = [
    {
      header: 'Tipo de Documento',
      accessorKey: 'personal_information.document.abbreviation',
      meta: { width: '150px' },
    },
    {
      header: 'Nro Documento',
      accessorKey: 'personal_information.document_number',
      meta: { width: '150px' },
    },
    {
      header: 'Nombre Completo',
      accessorKey: 'name',
      meta: { width: '200px' },
    },
    // Add other columns if necessary
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchManagement(1);
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

  const actions = [
    {
      label: 'Nominas',
      // icon: <FiEdit />,
      onClick: async (row: RowData)  => {
        // Handle Complementarios action
        try {
          setLoading(true);
          console.log('Complementarios clicked for', row);
          const users = {
            users: [row.id]
          }
          await editManagement(users, 2);
          toast.success('Registro actualizado exitosamente');
          const data = await fetchManagement(1);
          setDataValues(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
          toast.error('Error al cargar los proyectos');
        } finally {
          setLoading(false);
        }
        
      },
    },
  ];

  // Handle select all checkbox
  const handleSelectAll = (isChecked: boolean, currentPageRows: RowData[]) => {
    const newSelectedRows = { ...selectedRows };
    currentPageRows.forEach((row) => {
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

  // Get selected row data
  const selectedRowData = dataValues.filter((row) => selectedRows[row.id]);

  return (
    <Layout>
      <ToastContainer />
      {/* Main Button */}
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Gestión de RRHH</h1>
        <button
          onClick={ async () => {
            // Handle Enviar a Nóminas action
            console.log('Enviar a Nóminas clicked for', selectedRowData);
            try {
              setLoading(true);
              const users = {
                users: selectedRowData.map(e => e.id),
              }
              await editManagement(users, 2);
              toast.success('Registro actualizado exitosamente');
              const data = await fetchManagement(1);
              setDataValues(data);
            } catch (error) {
              console.error('Error fetching projects:', error);
              toast.error('Error al cargar los proyectos');
            } finally {
              setLoading(false);
            }
          }}
          disabled={selectedRowData.length === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Enviar a Nóminas
        </button>
      </div>

      {/* Table with Selection Mechanism */}
      {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" />
            ) : (
<Table
        data={dataValues}
        columns={[
          // Selection Column
          {
            id: 'selection',
            header: ({ table }) => (
              <input
                type="checkbox"
                onChange={(e) =>
                  handleSelectAll(
                    e.target.checked,
                    table.getRowModel().rows.map((row) => row.original)
                  )
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
          ...columns,
        ]}
        actions={actions}
      />
    )}
      
    </Layout>
  );
};

export default Management;
