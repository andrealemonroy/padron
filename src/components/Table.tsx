import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  ColumnFiltersState,
} from '@tanstack/react-table';

import Button from '../components/Button';

// Table Props
interface TableProps {
  columns: ColumnDef<any, any>[];
  data: any[];
  addButton: React.ReactNode;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  addButton, 
  onEdit, 
  onDelete, 
  showEditButton = true, 
  showDeleteButton = true 
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns,
    data,
    state: {
      globalFilter,
      sorting,
      pagination,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleColumnFilterChange = (columnId: string, value: string) => {
    setColumnFilters(prev => {
      const newFilters = prev.filter((filter) => filter.id !== columnId);
      if (value) {
        newFilters.push({ id: columnId, value: value });
      }
      return newFilters;
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
        <header className="px-5 py-4 flex gap-4">
          {addButton}
        </header>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap uppercase">
                      <div className="font-semibold text-left">
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted()
                              ? header.column.getIsSorted() === 'desc'
                                ? ' 🔽'
                                : ' 🔼'
                              : null}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">ACCIONES</div>
                  </th>
                </tr>
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-2 first:pl-5 last:pr-5 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        value={columnFilters.find((filter) => filter.id === header.column.id)?.value as string || ''}
                        onChange={(e) => handleColumnFilterChange(header.column.id, e.target.value)}
                        placeholder={`Filtrar ${header.column.columnDef.header}`}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </th>
                  ))}
                  <th></th>
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap lowercase"
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </td>
                ))}
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="space-x-1">
                    {showEditButton && (
                      <Button 
                        className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
                        type="button" 
                        variant="" 
                        onClick={() => onEdit(row.original.id)}
                      >
                        <span className="sr-only">Editar</span>
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                          <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                        </svg>
                      </Button>
                    )}
                    {showDeleteButton && (
                      <Button 
                        className="text-red-500 hover:text-red-600 rounded-full"
                        type="button" 
                        variant=""
                        onClick={() => onDelete(row.original.id)}
                      >
                        <span className="sr-only">Eliminar</span>
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                          <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                          <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 pl-4 pr-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <nav className="mb-4 sm:mb-0 sm:order-1" role="navigation" aria-label="Navigation">
              <ul className="flex justify-center">
                <li className="ml-3 first:ml-0">
                  <Button
                    type="button" 
                    variant="" 
                    className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-gray-300 dark:text-gray-600"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    &lt;- Anterior
                  </Button>
                </li>
                <li className="ml-3 first:ml-0">
                  <Button 
                    type="button" 
                    variant="" 
                    className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-gray-300 dark:text-gray-600"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Siguiente -&gt;
                  </Button>
                </li>
              </ul>
            </nav>
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Mostrando <span className="font-medium text-gray-600 dark:text-gray-300">{table.getState().pagination.pageIndex + 1}</span> de <span className="font-medium text-gray-600 dark:text-gray-300">{table.getPageCount()}</span> páginas
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;