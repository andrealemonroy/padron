import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

// Table Props
interface TableProps {
  columns: ColumnDef<any, any>[];
  data: any[];
  fetchData: (page: number, filters: any) => Promise<any>;
  pageCount: number;
}

const Table: React.FC<TableProps> = ({ columns, data, fetchData, pageCount }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return data.slice(start, end); // Devuelve solo los datos de la página actual
  }, [data, pagination]);

  const table = useReactTable({
    columns,
    data: paginatedData,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
    globalFilterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      return rowValue !== undefined ? String(rowValue).toLowerCase().includes(value.toLowerCase()) : false;
    },
  });

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">

        {/* Global Filter */}
        <header className="px-5 py-4 flex gap-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md leading-5 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            type="text"
            placeholder="Buscar Usuario"
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <button className="w-80 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
          <svg
            className="fill-current shrink-0 xs:hidden"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="max-xs:sr-only">Crear Usuario</span>
        </button>
        <button className="w-80 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
          <svg
            className="fill-current shrink-0 xs:hidden"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="max-xs:sr-only">Crear Usuarios Masivo</span>
        </button>
        </header>

        {/* Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap uppercase "
                  >
                    <div className="font-semibold text-left">
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
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
                  <div className="font-semibold text-left">
                    ACCIONES
                  </div>
                </th>
              </tr>
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
                        <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full">
                          <span className="sr-only">Edit</span>
                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                              <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full">
                          <span className="sr-only">Download</span>
                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                              <path d="M16 20c.3 0 .5-.1.7-.3l5.7-5.7-1.4-1.4-4 4V8h-2v8.6l-4-4L9.6 14l5.7 5.7c.2.2.4.3.7.3zM9 22h14v2H9z" />
                          </svg>
                        </button>
                        <button className="text-red-500 hover:text-red-600 rounded-full">
                          <span className="sr-only">Delete</span>
                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                              <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                              <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-8 pl-4 pr-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <nav className="mb-4 sm:mb-0 sm:order-1" role="navigation" aria-label="Navigation">
              <ul className="flex justify-center">
                <li className="ml-3 first:ml-0">
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                    disabled={pagination.pageIndex === 0}
                  >
                    <span className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-gray-300 dark:text-gray-600">&lt;- Anterior</span>
                  </button>
                </li>
                <li className="ml-3 first:ml-0">
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.min(prev.pageIndex + 1, Math.ceil(data.length / pagination.pageSize) - 1) }))}
                    disabled={pagination.pageIndex >= Math.ceil(data.length / pagination.pageSize) - 1}
                  >
                    <span className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-gray-300 dark:text-gray-600">Siguiente -&gt;</span>
                  </button>
                </li>
              </ul>
            </nav>
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Mostrando <span className="font-medium text-gray-600 dark:text-gray-300">{pagination.pageIndex + 1}</span> a <span className="font-medium text-gray-600 dark:text-gray-300">{Math.ceil(data.length / pagination.pageSize)}</span> de <span className="font-medium text-gray-600 dark:text-gray-300">{Math.ceil(data.length)}</span> 
            </div>
          </div>


        </div>
        

      </div>
      
    </>
  );
};

export default Table;