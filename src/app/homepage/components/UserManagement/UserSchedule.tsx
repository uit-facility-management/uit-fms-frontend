/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Chip, CircularProgress, Typography } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import { useGetSchedulesByUserIdQuery } from "@/feature/ScheduleApi/schedule.api";
import type { ScheduleResponseByIdUser } from "@/feature/ScheduleApi/type";

const formatDate = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN");
};

const statusLabelMap: Record<string, string> = {
  pending: "Chưa duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};


const statusClassMap: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

// const statusColorMap: Record<string, any> = {
//   pending: "warning",
//   approved: "success",
//   rejected: "error",
// };

export default function UserSchedule({ userId }: { userId: string }) {
    // get schedule by user id
  const { data: schedules = [], isLoading, isError } =
    useGetSchedulesByUserIdQuery(userId, { skip: !userId });

    // bảng schedule của user   
  const columns = useMemo<MRT_ColumnDef<ScheduleResponseByIdUser>[]>(
    () => [
      {
        accessorFn: (row) => row.room?.name,
        id: "roomName",
        header: "Phòng",
        size: 160,
      },
      {
        accessorKey: "start_time",
        header: "Thời gian bắt đầu",
        size: 180,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: "end_time",
        header: "Thời gian kết thúc",
        size: 180,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: "period_start",
        header: "Từ tiết",
        size: 100,
      },
      {
        accessorKey: "period_end",
        header: "Đến tiết",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 140,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();

          return (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                statusClassMap[status] ?? "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {statusLabelMap[status] ?? status}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: schedules,
    enableSorting: true,
    enablePagination: true,
    enableTopToolbar: false,
    enableBottomToolbar: true,
    enableColumnActions: false,
    enableGlobalFilter: true,
    enableColumnFilters: false,
    enableRowSelection: false,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "var(--primary01)",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
        px: 2.5,
        py: 1.6,
        "& .MuiTableSortLabel-root": {
          color: "white !important",
          "&:hover": { color: "white !important" },
        },
        "& .MuiTableSortLabel-icon": { color: "white !important" },
        "& .MuiIconButton-root": {
          color: "white !important",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#1f2937",
        px: 2.5,
        py: 2,
        borderBottom: "1px solid #e5e7eb",
      },
    },
    muiTableBodyRowProps: {
      sx: {
        "&:hover": { backgroundColor: "var(--secondary01)" },
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
        backgroundColor: "#fff",
      },
    },
    muiTopToolbarProps: { sx: { backgroundColor: "#f8f9fa" } },
    muiBottomToolbarProps: { sx: { backgroundColor: "#f8f9fa" } },
    initialState: { pagination: { pageIndex: 0, pageSize: 5 }, density: "comfortable" },
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
  });


  if (isLoading) return <CircularProgress size={28} />;
  if (isError)
    return <Typography color="error">Không thể tải lịch đặt phòng</Typography>;

  return (
    <div className="mt-10 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Lịch đặt phòng</p>
      </div>

      {/* Table */}
      <div className="border-t border-gray-100">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
}
