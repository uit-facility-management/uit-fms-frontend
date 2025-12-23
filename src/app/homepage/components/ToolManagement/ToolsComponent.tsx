"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { IconButton, Tooltip, Chip } from "@mui/material";
import { Visibility, Search as SearchIcon } from "@mui/icons-material";
import ToolDetails from "./ToolDetails";
import type { ToolsResponse } from "@/feature/ToolsApi/type";
import { useCreateToolMutation, useGetToolsQuery } from "@/feature/ToolsApi/tool.api";
import CreateToolModal from "./CreateToolModal";
import BorrowTicket from "./BorrowTicket";

type TabKey = "tools" | "borrow";
type ToolStatus = "Sẵn sàng" | "Đang mượn" | "Hư hỏng";

const mapStatusToUI = (
  s: ToolsResponse["status"]
): ToolStatus => {
  switch (s) {
    case "ACTIVE":
      return "Sẵn sàng";
    case "BORROWING":
      return "Đang mượn";
    case "INACTIVE":
    default:
      return "Hư hỏng";
  }
};

type ToolRow = {
  id: string;
  name: string;
  description: string;
  status: ToolStatus;
};

const statusChipSx = (s: ToolStatus) => {
  switch (s) {
    case "Sẵn sàng":
      return { backgroundColor: "#ECFDF3", color: "#027A48", border: "none" };
    case "Đang mượn":
      return { backgroundColor: "#EFF6FF", color: "#1D4ED8", border: "none" };
    case "Hư hỏng":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C", border: "none" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#4B5563", border: "none" };
  }
};


/* ================== Component ================== */
export default function ToolsComponent() {
  const [searchText, setSearchText] = useState("");
  const [selectedTool, setSelectedTool] = useState<ToolRow | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("tools");
  const [openCreateTool, setOpenCreateTool] = useState(false);
  const [createTool, { isLoading }] = useCreateToolMutation();

  const {
    data,
    isFetching,
    isError,
    refetch,
  } = useGetToolsQuery();

  const toolsFromApi: ToolRow[] = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      status: mapStatusToUI(t.status),
    }));
  }, [data]);


  /* FE-only search */
  const tableData = useMemo(() => {
    if (!searchText) return toolsFromApi;
    const q = searchText.toLowerCase();
    return toolsFromApi.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [searchText, toolsFromApi]);


  const columns = useMemo<MRT_ColumnDef<ToolRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên dụng cụ",
        size: 180,
        Cell: ({ cell }) => (
          <span className="font-bold text-gray-900 text-base">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        size: 320,
        Cell: ({ cell }) => (
          <span className="text-gray-700">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 160,
        Cell: ({ row }) => {
          const s = row.original.status;
          return (
            <Chip
              size="small"
              sx={{
                ...statusChipSx(s),
                fontWeight: 600,
                fontSize: "13px",
                height: 28,
                borderRadius: "8px",
              }}
              label={
                <span className="flex items-center gap-1.5">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor:
                        s === "Sẵn sàng"
                          ? "#12B76A"
                          : s === "Hư hỏng"
                          ? "#EF4444"
                          : "#2563EB",
                    }}
                  />
                  {s}
                </span>
              }
            />
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              onClick={() => setSelectedTool(row.original)}
              sx={{
                color: "#6B7280",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                  color: "#111827",
                },
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,

    state: {
      isLoading: isLoading || isFetching,
      showAlertBanner: isError,
    },

    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Không tải được danh sách dụng cụ" }
      : undefined,

    enableSorting: true,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableRowSelection: false,
    enablePagination: true,
    enableColumnFilters: true,

    enableGlobalFilter: false,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#F9FAFB",
        color: "#6B7280",
        fontWeight: 700,
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "none",
        py: 3,
        px: 3,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        py: 3,
        px: 3,
        borderBottom: "1px solid #F3F4F6",
      },
    },
    muiTableBodyRowProps: {
      sx: {
        transition: "all 0.15s ease",
        "&:hover": { backgroundColor: "#FAFBFC" },
        "&:last-child td": { borderBottom: "none" },
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0px",
        border: "none",
        boxShadow: "none",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      },
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "comfortable",
    },
  });


  return (
    <div className="w-full">
      {selectedTool ? (
        <ToolDetails
          tool={selectedTool}
          onBack={() => setSelectedTool(null)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Danh sách dụng cụ
            </h2>

            <div className="flex gap-3">
              <button
                className="rounded-lg px-5 py-2.5 text-sm font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenCreateTool(true)}
              >
                Tạo công cụ
              </button>

              <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#0B4DBA] hover:bg-[#0940A3]">
                Phiếu mượn
              </button>
            </div>
          </div>
          <CreateToolModal
            open={openCreateTool}
            onClose={() => setOpenCreateTool(false)}
            isSubmitting={isLoading}
            onSubmit={async (payload) => {
              try {
                await createTool(payload).unwrap();
                setOpenCreateTool(false);
                refetch();
              } catch (err) {
                console.error("Create tool failed", err);
              }
            }}
          />

          {/* Search */}
          <div className="flex items-center gap-2 max-w-md mb-6 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <SearchIcon sx={{ fontSize: 20, color: "#6B7280" }} />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm outline-none text-gray-700 placeholder:opacity-70"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab("tools")}
              className={`pb-3 text-sm font-semibold transition ${
                activeTab === "tools"
                  ? "text-[#0B4DBA] border-b-2 border-[#0B4DBA]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Quản lý dụng cụ
            </button>

            <button
              onClick={() => setActiveTab("borrow")}
              className={`pb-3 text-sm font-semibold transition ${
                activeTab === "borrow"
                  ? "text-[#0B4DBA] border-b-2 border-[#0B4DBA]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Quản lý phiếu mượn
            </button>
          </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {activeTab === "tools" ? (
            <MaterialReactTable table={table} />
          ) : (
            <BorrowTicket />
          )}
        </div>
        </>
      )}
    </div>
  );
}
