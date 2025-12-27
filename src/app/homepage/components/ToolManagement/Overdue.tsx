"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

type OverdueBorrowRow = {
  asset: string;
  borrower: string;
  overdueDays: number;
};

const overdueStatusStyle = (days: number) => {
  if (days >= 3)
    return {
      label: "Quá hạn",
      className: "bg-orange-100 text-orange-700",
    };
  return {
    label: "Sắp quá hạn",
    className: "bg-yellow-100 text-yellow-700",
  };
};

export default function Overdue() {
  // mock data (sau này thay bằng API)
  const data = useMemo<OverdueBorrowRow[]>(
    () => [
      {
        asset: "Máy chiếu",
        borrower: "Nguyễn Văn A",
        overdueDays: 3,
      },
      {
        asset: "Mic",
        borrower: "Trần Thị B",
        overdueDays: 7,
      },
      {
        asset: "Điều khiển",
        borrower: "Lê Văn C",
        overdueDays: 1,
      },
    ],
    []
  );

  const columns = useMemo<MRT_ColumnDef<OverdueBorrowRow>[]>(
    () => [
      {
        accessorKey: "asset",
        header: "Thiết bị",
        size: 180,
        Cell: ({ cell }) => (
          <span className="font-medium text-gray-900">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "borrower",
        header: "Người mượn",
        size: 140,
      },
      {
        accessorKey: "overdueDays",
        header: "Quá hạn",
        size: 80,
        Cell: ({ cell }) => (
          <span className="font-semibold text-[#fe5c5c]">
            {cell.getValue<number>()} ngày
          </span>
        ),
      },
      {
        id: "status",
        header: "Trạng thái",
        size: 120,
        Cell: ({ row }) => {
          const status = overdueStatusStyle(row.original.overdueDays);
          return (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableSorting: false,
    enableGlobalFilter: false,
    enablePagination: true,

    initialState: {
      pagination: { pageIndex: 0, pageSize: 3 },
      density: "compact",
    },

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#F9FAFB",
        color: "#6B7280",
        fontWeight: 700,
        fontSize: "12px",
        textTransform: "uppercase",
        borderBottom: "none",
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontSize: "13px",
        fontWeight: 500,
        color: "#374151",
        py: 2,
      },
    },

    muiTableBodyRowProps: {
      sx: {
        "&:hover": {
          backgroundColor: "#FAFBFC",
        },
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: "none",
        boxShadow: "none",
      },
    },
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Mượn quá hạn
        </h3>
        <button className="text-sm text-blue-600 hover:underline">
          Xem tất cả
        </button>
      </div>

      <div className="px-3 pb-3">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
}
