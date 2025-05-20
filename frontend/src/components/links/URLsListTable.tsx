import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUrls, LinkData, getUserUrls, deleteUserUrl, editUserUrl } from "@/lib/api";
import DataTableLayout from "../ui/dataTableLayout";
import DataTableHeader from "../ui/dataTableHeader";
import { getColumns } from "./columns";
import { cleanParams, extractSlugFromShortUrl } from "@/lib/utils";
import { toast } from "sonner";
import EditLinkModal from "./EditLinkModal";


interface URLsListTableProps {
  refreshFlag?: boolean;
}

export default function URLsListTable({ refreshFlag, handleRefresh }: URLsListTableProps) {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { isAuthenticated, token } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<LinkData | null>(null);

  const handleEditClick= (row: LinkData) => {
    console.log(row, "++++++++++++++///////////////////")
    setEditRow(row);
    setModalOpen(true);
  };

  const handleEditConfirm = async (newSlug: string) => {
  if (!editRow) return;
  try {
    await editUserUrl(editRow.id, { shortSlug: newSlug }, token!);
    toast.success("Short link updated!");
    setEditRow(null);
    handleRefresh()
  } catch (error: any) {
    toast.error(error.message || "Failed to update short link.");
  }
};

  const handleDelete = async (row: LinkData) => {
    if (!window.confirm("Are you sure you want to delete this short link?")) {
      return;
    }
    try {
      await deleteUserUrl(row.id, token!);
      toast.success("Short link deleted successfully!");
      handleRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete short link.");
    }
  };

  const handleSort = (column: any, direction: "asc" | "desc") => {
    setSortField(column.selector ? column.selector({}) : column.name);
    setSortOrder(direction);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      const params = cleanParams({
        page: currentPage,
        limit: rowsPerPage,
        search: search.trim(),
        sort_field: sortField,
        sort_order: sortOrder,
      });

      try {
        let res;
        if (isAuthenticated) {
          if (!token) {
            setError("User token missing, please re-login.");
            setIsLoading(false);
            setLinks([]);
            setTotal(0);
            return;
          }
          res = await getUserUrls(token, params);
        } else {
          res = await getAllUrls(params);
        }
        setLinks(res.data || []);
        setTotal(res.meta?.totalCount ?? 0);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching URLs"
        );
        setLinks([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    currentPage,
    rowsPerPage,
    search,
    refreshFlag,
    sortOrder,
    sortField,
    isAuthenticated,
    token,
  ]);

  return (
    <div>
      <div className="container py-10">
        <div className="flex flex-col space-y-6">
          <h1 className="text-4xl font-bold text-center">URLs List</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            View shorten Urls List
          </p>

          <DataTableLayout
            data={links}
            columns={getColumns(isAuthenticated, handleEditClick, handleDelete)}
            total={total}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            headerContent={
              <DataTableHeader
                headerContent={<span>Shortened URLs</span>}
                search={search}
                setSearch={setSearch}
              />
            }
            onSort={handleSort}
            noDataContent={
              isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center p-6 text-red-500">{error}</div>
              ) : (
                <span className="text-muted-foreground">No URLs have been shortened yet</span>
              )
            }
            pagination
            className="w-full"
          />
          <EditLinkModal
          open={!!editRow}
          onOpenChange={val => { if (!val) setEditRow(null); }}
          onConfirm={handleEditConfirm}
          defaultValue={editRow ? extractSlugFromShortUrl(editRow.shortUrl) : ""}
          editRow={editRow}
        />
        </div>
      </div>
    </div>
  );
}
