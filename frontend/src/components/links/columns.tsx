import { LinkData } from "@/lib/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { truncateUrl, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import ActionDropdown from "./ActionDropdown";
import { Copy } from "lucide-react";
import { TableColumn } from "react-data-table-component";

interface CustomTableColumn<T> extends TableColumn<T> {
  ignoreRowClick?: boolean;
}

export function getColumns(
  isAuthenticated: boolean,
  onEdit: (row: LinkData) => void,
  onDelete: (row: LinkData) => void
): CustomTableColumn<LinkData>[] {

  const baseColumns: CustomTableColumn<LinkData>[] = [
    {
      name: "Original URL",
      selector: (row: LinkData) => row.originalUrl,
      cell: (row: LinkData) => (
        <span title={row.originalUrl} className="font-medium">
          {truncateUrl(row.originalUrl)}
        </span>
      ),
      wrap: true,
      sortable: true,
    },
    {
      name: "Short URL",
      selector: (row: LinkData) => row.shortUrl,
      cell: (row: LinkData) => {
        return (
          <div className="flex items-center space-x-2">
            <a
              href={row.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {row.shortUrl}
            </a>
            <CopyToClipboard text={row.shortUrl} onCopy={() => toast.success("URL copied to clipboard!")}>
              <Copy size={16} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
            </CopyToClipboard>
          </div>
        );
      },
      wrap: true,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row: LinkData) => row.createdAt,
      cell: (row: LinkData) => <span>{formatDate(row.createdAt)}</span>,
      sortable: true,
      width: "150px",
    },
    {
      name: "Visit Count",
      selector: (row: LinkData) => row.visitCount,
      cell: (row: LinkData) => (
        <span className="text-right block">{row.visitCount}</span>
      ),
      sortable: true,
      width: "120px",
    },
  ];

  if (isAuthenticated) {
    baseColumns.push({
      name: "Action",
      cell: (row: LinkData) => (
        <ActionDropdown
          onEdit={() => onEdit(row)}
          onDelete={() => onDelete(row)}
        />
      ),
      ignoreRowClick: true,
      width: "90px",
    });
  }

  return baseColumns;
}
