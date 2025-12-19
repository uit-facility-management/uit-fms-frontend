'use client';

import { useMemo, useState } from 'react';
import { TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip, 
  Box,
  IconButton,
  Tooltip} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { FacilityRow, FacilityType, FacilityStatus } from './FacilityComponent';
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from 'material-react-table';
import { useUpdateFacilityMutation } from "@/feature/RoomAssetApi/facility.api";
import { RoomAssetResponse } from '@/feature/RoomAssetApi/type';


type Props = {
  facility: FacilityRow;
  onBack: () => void;
  onUpdate: (newFacility: FacilityRow) => void;
};

export type FacilityIssue = {
  name: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
};

export const reverseMapType: Record<FacilityType, RoomAssetResponse["type"]> = {
  "Đồ điện tử": "Electronics",
  "Đồ nội thất": "Furniture",
  "Văn phòng phẩm": "Stationery",
  "Khác": "Other",
};

export const reverseMapStatus: Record<FacilityStatus, RoomAssetResponse["status"]> = {
  "Đang sử dụng": "ACTIVE",
  "Chưa sử dụng": "INACTIVE",
  "Hư hỏng": "MAINTENANCE",
};



const statusChipSx = (s: FacilityRow['status']) => {
  switch (s) {
    case 'Đang sử dụng':
      return { backgroundColor: '#ECFDF3', color: '#027A48' };
    case 'Chưa sử dụng':
      return { backgroundColor: '#dbeafe', color: '#155dfc' };
    case 'Hư hỏng':
      return { backgroundColor: '#ffe5e5', color: '#ff1919' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
};

function InfoRow({
  label,
  value,
  editable,
  isEditing,
  onEdit,
  onChange,
  onSave,
}: {
  label: string;
  value: React.ReactNode;
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onChange?: (v: string) => void;
  onSave?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            autoFocus
            defaultValue={String(value)}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onSave}
            onKeyDown={(e) => e.key === 'Enter' && onSave?.()}
            className="text-sm font-semibold text-gray-800 border rounded px-2 py-1 w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <span className="text-sm font-semibold text-gray-800">
            {value}
          </span>
        )}

        {editable && !isEditing && (
          <EditOutlinedIcon
            onClick={onEdit}
            sx={{
              fontSize: 19,
              marginLeft: 1.5,
              cursor: 'pointer',
              color: '#9CA3AF',
              '&:hover': {
                color: '#2563EB',
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function FacilityDetails({ facility, onBack, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  // update
  const [updateFacility, { isLoading }] = useUpdateFacilityMutation();


  const handleUpdateFacility = async () => {
    try {
      await updateFacility({
        id: facility.id, 
        body: {
          name: form.name!,
          type: reverseMapType[form.type],
          status: reverseMapStatus[form.status],
          room_id: facility.roomId,
        },
      }).unwrap();

      setIsEditing(false);

    } catch (err) {
      console.error("Update facility failed", err);
    }
  };


  const [form, setForm] = useState({
    name: facility.name,
    type: facility.type,
    room: facility.room,
    building: facility.building,
    status: facility.status,
  });


  // const handleSave = (field: keyof FacilityRow) => {
  //   console.log('UPDATE FIELD:', field, 'VALUE:', editedValue);
  //   setEditingField(null);
  // };

  // Lịch sử hư hỏng
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issues, setIssues] = useState<FacilityIssue[]>([]);
  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
  });

  const handleAddIssue = () => {
    if (!issueForm.title || !issueForm.description) return;

    const newIssue: FacilityIssue = {
      name: facility.name,
      type: facility.type,
      title: issueForm.title,
      description: issueForm.description,
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    setIssues((prev) => [newIssue, ...prev]);

    // reset form
    setIssueForm({ title: '', description: '' });
  };

  // table of lịch sử hư hỏng
  const issueColumns = useMemo<MRT_ColumnDef<FacilityIssue>[]>(() => [
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
              onClick={() => console.log("EDIT incident", row.original)}
              sx={{ color: "#2563eb" }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xóa">
            <IconButton
              size="small"
              onClick={() =>
                console.log("DELETE incident", row.original)
              }
              sx={{ color: "#dc2626" }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], []);

  const issueTable = useMaterialReactTable({
    columns: issueColumns,
    data: issues, // issues: IssueRow[]
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
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Chi tiết cơ sở vật chất</p>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            {facility.name}
          </h2>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white bg-[#5295f8] hover:bg-[#377be1] transition"
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          Quay lại
        </button>
      </div>

      {/* Content */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left card */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              Thông tin thiết bị
            </p>
            <button
              type="button"
              onClick={() => { setIsEditing(true)}}
              className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
            >
              Chỉnh sửa thông tin
            </button>

          </div>

          <div className="p-5">
            {!isEditing ? (
            <>
              <InfoRow label="Tên thiết bị" value={facility.name} />
              <InfoRow label="Loại thiết bị" value={facility.type} />
              <InfoRow label="Phòng" value={facility.room} />
              <InfoRow label="Tòa" value={facility.building} />
              <InfoRow
                label="Trạng thái"
                value={
                  <Chip
                    label={facility.status}
                    size="small"
                    sx={{
                      ...statusChipSx(facility.status),
                      fontWeight: 700,
                    }}
                  />
                }
              />
            </>
          ) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên thiết bị */}
            <TextField
              size="small"
              label="Tên thiết bị"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            {/* Loại thiết bị */}
            <FormControl size="small" fullWidth>
              <InputLabel id="type-label">Loại thiết bị</InputLabel>
              <Select
                labelId="type-label"
                label="Loại thiết bị"
                value={form.type}
                onChange={(e: SelectChangeEvent) =>
                  setForm({ ...form, type: e.target.value as FacilityType })
                }
              >
                <MenuItem value="Đồ điện tử">Đồ điện tử</MenuItem>
                <MenuItem value="Đồ nội thất">Đồ nội thất</MenuItem>
                <MenuItem value="Văn phòng phẩm">Văn phòng phẩm</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>

            {/* Phòng */}
            <TextField
              size="small"
              label="Phòng"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              fullWidth
            />

            {/* Tòa */}
            <TextField
              size="small"
              label="Tòa"
              value={form.building}
              onChange={(e) => setForm({ ...form, building: e.target.value })}
              fullWidth
            />

            {/* Trạng thái */}
            <FormControl size="small" fullWidth>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                label="Trạng thái"
                value={form.status}
                onChange={(e: SelectChangeEvent) =>
                  setForm({
                    ...form,
                    status: e.target.value as FacilityRow['status'],
                  })
                }
              >
                <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
                <MenuItem value="Chưa sử dụng">Chưa sử dụng</MenuItem>
                <MenuItem value="Hư hỏng">Hư hỏng</MenuItem>
              </Select>
            </FormControl>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setForm({
                    name: facility.name,
                    type: facility.type,
                    room: facility.room,
                    building: facility.building,
                    status: facility.status,
                  });
                  setIsEditing(false);
                }}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>

              <button
                onClick={async () => {
                  await handleUpdateFacility();

                  onUpdate({
                    ...facility,
                    name: form.name!,
                    type: form.type,
                    status: form.status,
                  });
                }}
                disabled={isLoading}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#5295f8] hover:bg-[#377be1]"
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>


            </div>
          </div>
          )}
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Thao tác</p>
          </div>

          <div className="p-5 space-y-3">
            <button
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-white bg-[#F79009] hover:bg-[#dc6803] transition"
              onClick={() => setShowIssueForm(true)}
            >
              Báo hư thiết bị
            </button>

            <button
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-[#ff6666] bg-[#ffe5e5] hover:bg-[#ffcccc] transition"
              onClick={() => console.log('Xóa thiết bị:', facility)}
            >
              Xóa thiết bị
            </button>
          </div>
        </div>
      </div>

      {/* báo hư thiết bị */}
      { showIssueForm && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mt-4">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Báo hư thiết bị</p>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm text-gray-500">Loại thiết bị</label>
            <input
              value={facility.type}
              disabled
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-gray-100"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-gray-500">Tiêu đề</label>
            <input
              value={issueForm.title}
              onChange={(e) =>
                setIssueForm({ ...issueForm, title: e.target.value })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="VD: Máy hỏng"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-500">Mô tả</label>
            <textarea
              value={issueForm.description}
              onChange={(e) =>
                setIssueForm({ ...issueForm, description: e.target.value })
              }
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Mô tả chi tiết lỗi..."
            />
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => setShowIssueForm(false)}
              className="flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleAddIssue}
              className="flex-1 w-full rounded-xl px-4 py-2.5 font-semibold text-white bg-[#F79009] hover:bg-[#dc6803] transition"
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
      )}
      
      {/* Bảng lịch sử hư hỏng */}
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
          <MaterialReactTable table={issueTable} />
        )}
      </div>

    </div>
  );
}
