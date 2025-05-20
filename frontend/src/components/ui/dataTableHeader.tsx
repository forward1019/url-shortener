import React from "react";

interface DataTableHeaderProps {
  headerContent?: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
  search?: string;
  setSearch?: (value: string) => void;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  headerContent,
  additionalHeaderContent,
  search,
  setSearch,
}) => {
  return (
    (headerContent || additionalHeaderContent || setSearch) && (
      <div className="flex flex-wrap items-center justify-between gap-2 w-full px-2 py-2 border-b bg-gray-50">
        <div>{headerContent}</div>
        <div className="flex items-center gap-2">
          {setSearch && (
            <input
              type="text"
              placeholder="Search keyword"
              className="border rounded px-2 py-1 text-sm w-48"
              value={search || ""}
              onChange={(e) => setSearch?.(e.target.value)}
            />
          )}
          {additionalHeaderContent}
        </div>
      </div>
    )
  );
};

export default DataTableHeader;
