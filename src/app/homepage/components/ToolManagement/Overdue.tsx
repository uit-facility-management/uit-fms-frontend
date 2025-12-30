"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { ClockAlert } from "lucide-react";


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

    localization: {
      noRecordsToDisplay: "Không có dữ liệu hiển thị",
      rowsPerPage: "Số dòng mỗi trang",
      of: "của",
      goToNextPage: "Trang tiếp",
      goToPreviousPage: "Trang trước",
      goToFirstPage: "Trang đầu",
      goToLastPage: "Trang cuối",
      search: "Tìm kiếm",
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
        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <ClockAlert className="w-5 h-5 text-amber-500" />
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
