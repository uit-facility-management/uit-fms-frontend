"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Chip } from "@mui/material";

/* ================== Types ================== */
type BorrowStatus = "Đang mượn" | "Đã trả";

type BorrowTicketRow = {
  id: string;
  borrower: string;
  toolName: string;
  roomName: string;
  borrowTime: string;
  returnTime: string;
  status: BorrowStatus;
};

/* ================== Status UI ================== */
const statusChipSx = (s: BorrowStatus) => {
  switch (s) {
    case "Đang mượn":
      return { backgroundColor: "#EFF6FF", color: "#1D4ED8", border: "none" };
    case "Đã trả":
      return { backgroundColor: "#ECFDF3", color: "#027A48", border: "none" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#4B5563", border: "none" };
  }
};

/* ================== Mock data ================== */
const MOCK_DATA: BorrowTicketRow[] = [
  {
    id: "1",
    borrower: "Nguyễn Văn A",
    toolName: "Máy chiếu Epson",
    roomName: "Phòng A101",
    borrowTime: "10/12/2025 08:30",
    returnTime: "-",
    status: "Đang mượn",
  },
  {
    id: "2",
    borrower: "Trần Thị B",
    toolName: "Laptop Dell",
    roomName: "Phòng B203",
    borrowTime: "09/12/2025 13:00",
    returnTime: "09/12/2025 16:30",
    status: "Đã trả",
  },
];

/* ================== Component ================== */
export default function BorrowTicket() {
  const columns = useMemo<MRT_ColumnDef<BorrowTicketRow>[]>(
    () => [
      {
        accessorKey: "borrower",
        header: "Người mượn",
        size: 180,
        Cell: ({ cell }) => (
          <span className="font-bold text-gray-900">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "toolName",
        header: "Tên thiết bị",
        size: 200,
        Cell: ({ cell }) => (
          <span className="text-gray-700">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "roomName",
        header: "Tên phòng",
        size: 160,
      },
      {
        accessorKey: "borrowTime",
        header: "Thời gian mượn",
        size: 180,
      },
      {
        accessorKey: "returnTime",
        header: "Thời gian trả",
        size: 180,
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
                        s === "Đang mượn" ? "#2563EB" : "#12B76A",
                    }}
                  />
                  {s}
                </span>
              }
            />
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: MOCK_DATA,

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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <MaterialReactTable table={table} />
    </div>
  );
}
