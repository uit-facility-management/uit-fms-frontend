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
  borrowedAt: string;
  status: string;
};
export default function Overdue({
  data,
}: {
  data: OverdueBorrowRow[];
}) {
  // mock data (sau này thay bằng API dashboard)
  // const data = useMemo<OverdueBorrowRow[]>(
  //   () => [
  //     {
  //       asset: "Máy chiếu",
  //       borrower: "Nguyễn Văn A",
  //       borrowedAt: "27/12/2025",
  //     },
  //     {
  //       asset: "Mic",
  //       borrower: "Trần Thị B",
  //       borrowedAt: "26/12/2025",
  //     },
  //     {
  //       asset: "Điều khiển",
  //       borrower: "Lê Văn C",
  //       borrowedAt: "25/12/2025",
  //     },
  //   ],
  //   []
  // );

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
        size: 160,
      },
      {
        accessorKey: "borrowedAt",
        header: "Ngày mượn",
        size: 140,
      },
      {
        id: "status",
        header: "Trạng thái",
        size: 120,
        Cell: () => (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            Quá hạn
          </span>
        ),
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
        color: "#9CA3AF",
        fontWeight: 700,
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        borderBottom: "1px solid #E5E7EB",
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
        {/* <button className="text-sm text-blue-600 hover:underline">
          Xem tất cả
        </button> */}
      </div>

      <div className="px-3 pb-3">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
}
