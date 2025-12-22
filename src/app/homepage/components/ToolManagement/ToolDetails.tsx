"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useUpdateToolMutation } from "@/feature/ToolsApi/tool.api";


type ToolStatus = "Sẵn sàng" | "Đang mượn" | "Hư hỏng";

export type ToolRow = {
  id: string;
  name: string;
  description: string;
  status: ToolStatus;
};

type UsageStatus = "Đã trả" | "Đang mượn";

type ToolUsageRow = {
  id: string;
  borrower: string;
  borrowedAt: string;
  returnedAt?: string;
  status: UsageStatus;
};

type Props = {
  tool: ToolRow;
  onBack: () => void;
};

type ToolStatusApi = "ACTIVE" | "BORROWING" | "INACTIVE";

const uiToApiStatus = (s: ToolStatus): ToolStatusApi => {
  switch (s) {
    case "Sẵn sàng":
      return "ACTIVE";
    case "Đang mượn":
      return "BORROWING";
    default:
      return "INACTIVE";
  }
};

const apiToUiStatus = (s: ToolStatusApi): ToolStatus => {
  switch (s) {
    case "ACTIVE":
      return "Sẵn sàng";
    case "BORROWING":
      return "Đang mượn";
    default:
      return "Hư hỏng";
  }
};


/* ================== Mock history ================== */
const mockUsageHistory: ToolUsageRow[] = [
  {
    id: "1",
    borrower: "Nguyễn Văn A",
    borrowedAt: "10/09/2025 08:30",
    returnedAt: "10/09/2025 11:00",
    status: "Đã trả",
  },
  {
    id: "2",
    borrower: "Trần Thị B",
    borrowedAt: "12/09/2025 13:00",
    status: "Đang mượn",
  },
];

/* ================== Status chip style ================== */
const statusChipSx = (s: ToolStatus) => {
  switch (s) {
    case "Sẵn sàng":
      return { backgroundColor: "#ECFDF3", color: "#027A48" };
    case "Đang mượn":
      return { backgroundColor: "#EFF6FF", color: "#1D4ED8" };
    case "Hư hỏng":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
    default:
      return {};
  }
};

const usageStatusChipSx = (s: UsageStatus) => {
  switch (s) {
    case "Đã trả":
      return { backgroundColor: "#ECFDF3", color: "#027A48" };
    case "Đang mượn":
      return { backgroundColor: "#EFF6FF", color: "#1D4ED8" };
    default:
      return {};
  }
};


function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="text-sm font-semibold text-gray-800 text-right">
        {value}
      </div>
    </div>
  );
}

/* ================== Component ================== */
export default function ToolDetails({ tool, onBack }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(tool.name);
  const [description, setDescription] = useState(tool.description);
  const [status, setStatus] = useState<ToolStatus>(tool.status);
  const [updateTool, { isLoading: isUpdating }] = useUpdateToolMutation();


  const columns = useMemo<MRT_ColumnDef<ToolUsageRow>[]>(
    () => [
      { accessorKey: "borrower", header: "Người mượn", size: 180 },
      { accessorKey: "borrowedAt", header: "Thời gian mượn", size: 180 },
      {
        accessorKey: "returnedAt",
        header: "Thời gian trả",
        size: 180,
        Cell: ({ cell }) =>
          cell.getValue<string>() ?? (
            <span className="italic text-gray-400">Chưa trả</span>
          ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 140,
        Cell: ({ row }) => (
          <Chip
            size="small"
            label={row.original.status}
            sx={{
              ...usageStatusChipSx(row.original.status),
              fontWeight: 700,
              px: 0.5,
            }}
          />
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: mockUsageHistory,

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
        "& .MuiTableSortLabel-icon": {
          color: "white !important",
        },
        "& .MuiIconButton-root": {
          color: "white !important",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.12)",
          },
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

    muiTopToolbarProps: {
      sx: { backgroundColor: "#f8f9fa" },
    },
    muiBottomToolbarProps: {
      sx: { backgroundColor: "#f8f9fa" },
    },

    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
      density: "comfortable",
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
  });


  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Chi tiết dụng cụ</p>
          <h2 className="text-2xl font-semibold text-gray-800">{tool.name}</h2>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white bg-[#5295f8] hover:bg-[#377be1]"
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          Quay lại
        </button>
      </div>

      {/* Tool info */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-8">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Thông tin dụng cụ</p>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1]"
            >
              Chỉnh sửa thông tin
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setName(tool.name);
                  setDescription(tool.description);
                  setStatus(tool.status);
                  setIsEditing(false);
                }}
                className="rounded-lg px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                disabled={isUpdating}
                onClick={async () => {
                  try {
                    await updateTool({
                      id: tool.id,
                      body: {
                        name: name.trim(),
                        description: description.trim(),
                        status: uiToApiStatus(status),
                      },
                    }).unwrap();
                    setIsEditing(false);
                  } catch (err) {
                    console.error("Update tool failed", err);
                  }
                }}
                className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] disabled:opacity-60"
              >
                {isUpdating ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          )}
        </div>

        <div className="p-5">
          {!isEditing ? (
            <div className="flex flex-col gap-3">
              <InfoRow label="Tên dụng cụ" value={name} />
              <InfoRow label="Mô tả" value={description} />
              <InfoRow
                label="Trạng thái"
                value={
                  <Chip
                    size="small"
                    label={status}
                    sx={{
                      ...statusChipSx(status),
                      fontWeight: 700,
                      px: 0.5,
                    }}
                  />
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                size="small"
                label="Tên dụng cụ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  label="Trạng thái"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as ToolStatus)
                  }
                >
                  <MenuItem value="Sẵn sàng">Sẵn sàng</MenuItem>
                  <MenuItem value="Đang mượn">Đang mượn</MenuItem>
                  <MenuItem value="Hư hỏng">Hư hỏng</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                className="md:col-span-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Usage history */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Lịch sử sử dụng</p>
        </div>
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
}
