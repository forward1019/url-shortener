"use client";

import PerfectScrollbar from 'react-perfect-scrollbar';
import DataTable, { TableColumn } from 'react-data-table-component';
import React from 'react';
import DataTablePagination from './dataTablePagination';


interface CustomTableColumn<T> extends TableColumn<T> {
  ignoreRowClick?: boolean;
}

type DataTableLayoutProps<T> = {
  data: T[];
  columns: CustomTableColumn<T>[];
  total?: number;
  headerContent?: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
  noDataContent?: React.ReactNode;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  rowsPerPage?: number;
  setRowsPerPage?: (n: number) => void;
  pagination?: boolean;
  className?: string;
  onSort?: (column: any, direction: "asc" | "desc") => void;
};

function DataTableLayout<T>({
  data,
  columns,
  total = 0,
  headerContent,
  additionalHeaderContent,
  noDataContent,
  currentPage = 1,
  setCurrentPage,
  rowsPerPage = 10,
  setRowsPerPage,
  pagination = true,
  className,
  onSort
}: DataTableLayoutProps<T>) {

  const handlePagination = (page: { selected: number }) => {
    setCurrentPage && setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage && setRowsPerPage(Number(e.target.value));
    setCurrentPage && setCurrentPage(1);
  };

  return (
    <div className={`data-table-layout flex flex-col bg-white rounded shadow-sm ${className || ""}`}>
      {(headerContent || additionalHeaderContent) && (
        <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
          <div>{headerContent}</div>
          <div>{additionalHeaderContent}</div>
        </div>
      )}
      {data?.length > 0 ? (
        <>
          <div className="max-h-[400px] overflow-y-auto">
          <PerfectScrollbar>
            <div className="p-0">
              <DataTable
                columns={columns}
                data={data}
                noHeader
                highlightOnHover
                pagination={false}
                className="react-dataTable"
                onSort={onSort}
                sortServer
              />
            </div>
          </PerfectScrollbar>
        </div>
        {pagination && setCurrentPage && setRowsPerPage && (
            <DataTablePagination
              total={total}
              currentPage={currentPage}
              handlePagination={handlePagination}
              rowsPerPage={rowsPerPage}
              handlePerPage={handlePerPage}
            />
          )}
        </>
      ) : (
        <div className="p-8 text-gray-400 flex items-center justify-center min-h-[120px]">
          {noDataContent || "No records found."}
        </div>
      )}
    </div>
  );
}

export default DataTableLayout;
