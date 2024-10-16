import React from 'react';
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  SortingState,
  FilterFn,
} from '@tanstack/react-table';

import {
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
} from 'react-icons/hi';

interface ActionConfig<TData> {
  label?: string;
  icon?: React.ReactNode;
  onClick: (row: TData) => void;
}

interface TableProps<TData extends object> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  actions?: ActionConfig<TData>[]; // Updated: Use actions prop instead of renderActions
}

function Table<TData extends object>({
  columns,
  data,
  actions,
}: TableProps<TData>) {
  const [state, setState] = React.useState({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [] as SortingState,
    columnFilters: [] as ColumnFiltersState,
  });

  // Define custom filter functions
  const rolesFilterFn: FilterFn<TData> = (row, columnId, filterValue) => {
    const roles = row.getValue(columnId) as { name: string }[];
    if (!filterValue) return true; // Show all if filter is empty
    return roles.some((role) =>
      role.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const statusFilterFn: FilterFn<TData> = (row, columnId, filterValue) => {
    const statusId = row.getValue(columnId) as number;
    const status = statusId === 1 ? 'Activo' : 'Inactivo';
    if (!filterValue) return true; // Show all if filter is empty
    return status.toLowerCase().includes(filterValue.toLowerCase());
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / state.pagination.pageSize),
    state: {
      pagination: state.pagination,
      sorting: state.sorting,
      columnFilters: state.columnFilters,
    },
    onPaginationChange: (updater) => {
      setState((prev) => ({
        ...prev,
        pagination:
          typeof updater === 'function' ? updater(prev.pagination) : updater,
      }));
    },
    onSortingChange: (sorting) => {
      setState((prev) => ({
        ...prev,
        sorting:
          typeof sorting === 'function' ? sorting(prev.sorting) : sorting,
      }));
    },
    onColumnFiltersChange: (updater) => {
      setState((prev) => {
        const newFilters =
          typeof updater === 'function' ? updater(prev.columnFilters) : updater;
        return { ...prev, columnFilters: newFilters ?? [] };
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      rolesFilter: rolesFilterFn,
      statusFilter: statusFilterFn,
    },
  });

  const {
    getState,
    setPageIndex,
    setPageSize,
    previousPage,
    nextPage,
    getCanPreviousPage,
    getCanNextPage,
    getPageCount,
  } = table;

  const { pageIndex, pageSize } = getState().pagination;

  return (
    <div className="table-container">
      {/* Scrollable container with fixed height and overflow */}
      <div
        style={{
          maxHeight: '480px', // Set the desired max height
          overflowY: 'auto',
          overflowX: 'auto', // Enable horizontal scrolling
        }}
        className="rounded-lg"
      >
        <table
          className="table"
          style={{
            tableLayout: 'fixed',
            width: 'max-content',
            minWidth: '100%',
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {/* First Header Row */}
                <tr>
                  {headerGroup.headers.map((header: any) => {
                    const customWidth =
                      header.column.columnDef.meta?.width ?? 'auto';
                    return (
                      <th
                        key={header.id}
                        style={{
                          width: customWidth,
                          minWidth: customWidth,
                        }}
                        className="sticky top-0 z-10 p-2 bg-white dark:bg-gray-800"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  })}
                  {actions && actions.length > 0 && (
                    <th
                      className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-2"
                      style={{ minWidth: '100px' }}
                    >
                      Acciones
                    </th>
                  )}
                </tr>
                {/* Filter Row */}
                <tr>
                  {headerGroup.headers.map((header: any) => {
                    const customWidth =
                      header.column.columnDef.meta?.width ?? 'auto';
                    return (
                      <th
                        key={header.id}
                        style={{
                          width: customWidth,
                          minWidth: customWidth,
                        }}
                        className="sticky top-[40px] bg-white dark:bg-gray-800 z-10 p-2"
                      >
                        {header.column.getCanFilter() &&
                        header.column.columnDef.meta?.filterComponent
                          ? header.column.columnDef.meta.filterComponent(
                              header.column
                            )
                          : null}
                      </th>
                    );
                  })}
                  {actions && actions.length > 0 && (
                    <th
                      className="sticky top-[40px] bg-white dark:bg-gray-800 z-10 p-2"
                      style={{ minWidth: '100px' }}
                    />
                  )}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => {
                  const customWidth =
                    cell.column.columnDef.meta?.width ?? 'auto';
                  return (
                    <td
                      key={cell.id}
                      style={{
                        width: customWidth,
                        minWidth: customWidth,
                      }}
                      className="whitespace-nowrap overflow-hidden text-ellipsis p-2 bg-white border-b dark:bg-gray-800"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
                {actions && actions.length > 0 && (
                  <td style={{ minWidth: '100px' }} className='bg-white border-b dark:bg-gray-800'>
                    <div className="flex justify-center gap-2">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick(row.original)}
                          className="p-2"
                        >
                          {action.icon}
                          {action.label && (
                            <span className="sr-only">{action.label}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="pagination-container flex items-center justify-between mt-4">
        {/* Page Size Selector */}
        <div className="flex items-center">
          <span className="mr-2 text-sm">Ver por página:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="border rounded px-2 py-1 w-20"
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center">
          <button
            onClick={() => setPageIndex(0)}
            disabled={!getCanPreviousPage()}
            className="border rounded p-1 mr-2 disabled:opacity-50"
            aria-label="First Page"
          >
            <HiChevronDoubleLeft size={20} />
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
            className="border rounded p-1 mr-2 disabled:opacity-50"
            aria-label="Previous Page"
          >
            <HiChevronLeft size={20} />
          </button>
          <span className="mr-2">
            Página{' '}
            <strong>
              {pageIndex + 1} de {getPageCount()}
            </strong>
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
            className="border rounded p-1 mr-2 disabled:opacity-50"
            aria-label="Next Page"
          >
            <HiChevronRight size={20} />
          </button>
          <button
            onClick={() => setPageIndex(getPageCount() - 1)}
            disabled={!getCanNextPage()}
            className="border rounded p-1 disabled:opacity-50"
            aria-label="Last Page"
          >
            <HiChevronDoubleRight size={20} />
          </button>
        </div>

        {/* Page Number Input */}
        <div className="flex items-center">
          <span className="mr-2">Ir a la página:</span>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageIndex(page);
            }}
            className="border rounded px-2 py-1 w-16"
          />
        </div>
      </div>
    </div>
  );
}

export default Table;