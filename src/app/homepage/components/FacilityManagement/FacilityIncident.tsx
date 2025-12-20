'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';

export type FacilityIssue = {
  name: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
};

type Props = {
  facilityName: string;
  facilityType: string;
  open: boolean;
  onClose: () => void;
};

export default function FacilityIncident({
  facilityName,
  facilityType,
  open,
  onClose,
}: Props) {
  const [issues, setIssues] = useState<FacilityIssue[]>([]);
  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
  });

  const handleAddIssue = () => {
    if (!issueForm.title || !issueForm.description) return;

    const newIssue: FacilityIssue = {
      name: facilityName,
      type: facilityType,
      title: issueForm.title,
      description: issueForm.description,
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    setIssues((prev) => [newIssue, ...prev]);
    setIssueForm({ title: '', description: '' });
    onClose();
  };

  // table lịch sử hư hỏng

  const columns = useMemo<MRT_ColumnDef<FacilityIssue>[]>(() => [
    {
      accessorKey: "type",
      header: "Loại thiết bị",
      size: 160,
      Cell: ({ cell }) => (
        <span className="font-medium text-gray-900">
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Tiêu đề",
      size: 200,
      Cell: ({ cell }) => (
        <span className="font-semibold text-gray-800">
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      size: 300,
      Cell: ({ cell }) => (
        <span className="text-gray-600">
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian",
      size: 160,
      Cell: ({ cell }) => (
        <span className="text-gray-500">
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      size: 120,
      enableSorting: false,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              sx={{ color: "#2563eb" }}
              onClick={() => console.log("EDIT incident", row.original)}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xóa">
            <IconButton
              size="small"
              sx={{ color: "#dc2626" }}
              onClick={() => console.log("DELETE incident", row.original)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: issues,

    enableSorting: true,
    enableTopToolbar: false,
    enableColumnActions: false,
    enablePagination: true,
    enableColumnFilters: false,
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
        "&:hover": {
          backgroundColor: "#FAFBFC",
        },
        "&:last-child td": {
          borderBottom: "none",
        },
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
      pagination: { pageIndex: 0, pageSize: 5 },
      density: "comfortable",
    },
  });

  return (
    <>
      {/* form báo hư thiết bị */}
      {open && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              Báo hư thiết bị
            </p>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="text-sm text-gray-500">Loại thiết bị</label>
              <input
                value={facilityType}
                disabled
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Tiêu đề</label>
              <input
                value={issueForm.title}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, title: e.target.value })
                }
                placeholder="VD: Máy hỏng"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Mô tả</label>
              <textarea
                rows={3}
                value={issueForm.description}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, description: e.target.value })
                }
                placeholder="Mô tả chi tiết lỗi..."
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold
                  border-2 border-gray-300 text-gray-700
                  hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Hủy bỏ
              </button>

              <button
                onClick={handleAddIssue}
                className="flex-1 rounded-xl px-4 py-2.5 font-semibold
                  text-white bg-[#F79009]
                  hover:bg-[#dc6803] transition"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* bảng lịch sử hư hỏng */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
          <p className="text-sm font-semibold text-blue-700">
            Lịch sử hư hỏng
          </p>
        </div>

        {issues.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            Chưa có lịch sử hư hỏng
          </div>
        ) : (
          <MaterialReactTable table={table} />
        )}
      </div>
    </>
  );
}
