import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Table from '../../components/Table';
import { Layout } from '../../components/Layout';

interface RowData {
  id: number;
  tipoDocumento: string;
  nroDocumento: string;
  nombreCompleto: string;
  // Add other fields as needed
}

const Management = () => {
  const [data, setData] = useState<RowData[]>([
    {
      id: 1,
      tipoDocumento: 'DNI',
      nroDocumento: '12345678',
      nombreCompleto: 'Juan Pérez',
      // Add other fields as needed
    },
    // Add more data
  ]);

  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});

  const columns: ColumnDef<RowData>[] = [
    {
      header: 'Tipo de Documento',
      accessorKey: 'tipoDocumento',
      meta: { width: '150px' },
    },
    {
      header: 'Nro Documento',
      accessorKey: 'nroDocumento',
      meta: { width: '150px' },
    },
    {
      header: 'Nombre Completo',
      accessorKey: 'nombreCompleto',
      meta: { width: '200px' },
    },
    // Add other columns if necessary
  ];

  const actions = [
    {
      label: 'Complementarios',
      // icon: <FiEdit />,
      onClick: (row: RowData) => {
        // Handle Complementarios action
        console.log('Complementarios clicked for', row);
      },
    },
    {
      label: 'Derecho Hab.',
      // icon: <FiEye />,
      onClick: (row: RowData) => {
        // Handle Derecho Hab. action
        console.log('Derecho Hab. clicked for', row);
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
  const selectedRowData = data.filter((row) => selectedRows[row.id]);

  return (
    <Layout>
      {/* Main Button */}
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Gestión de Nóminas</h1>
        <button
          onClick={() => {
            // Handle Enviar a Nóminas action
            console.log('Enviar a Nóminas clicked for', selectedRowData);
          }}
          disabled={selectedRowData.length === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Enviar a Nóminas
        </button>
      </div>

      {/* Table with Selection Mechanism */}
      <Table
        data={data}
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
                  data.length > 0 && data.every((row) => selectedRows[row.id])
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
    </Layout>
  );
};

export default Management;
