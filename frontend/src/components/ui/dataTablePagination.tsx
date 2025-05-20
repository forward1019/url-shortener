import React from 'react';
import ReactPaginate from 'react-paginate';

type DataTablePaginationProps = {
  total: number;
  currentPage: number;
  handlePagination: (page: { selected: number }) => void;
  rowsPerPage: number;
  handlePerPage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showRowsPerPageOptions?: boolean;
};

const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  total,
  currentPage,
  handlePagination,
  rowsPerPage,
  handlePerPage,
  showRowsPerPageOptions = true,
}) => {
  console.log(total, currentPage, handlePagination, showRowsPerPageOptions, rowsPerPage, "inDataTablePagination")
  const pageCount = Math.ceil(total / rowsPerPage) || 1;

  return (
    <div className="flex items-center justify-between px-2 bg-white py-2 gap-4">
      {showRowsPerPageOptions && (
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-sm text-gray-600">
            Show
          </label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handlePerPage}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="10">10 Entries</option>
            <option value="25">25Entries</option>
            <option value="50">50 Entries</option>
          </select>
        </div>
      )}
      <ReactPaginate
        previousLabel={'‹'}
        nextLabel={'›'}
        pageCount={pageCount}
        forcePage={currentPage > 0 ? currentPage - 1 : 0}
        onPageChange={handlePagination}
        containerClassName="pagination flex gap-1"
        pageClassName="page-item"
        pageLinkClassName="page-link px-2 py-1 border rounded"
        activeClassName="bg-blue-500 text-white"
        nextClassName="page-item"
        previousClassName="page-item"
        nextLinkClassName="page-link"
        previousLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
      />
    </div>
  );
};

export default DataTablePagination;
