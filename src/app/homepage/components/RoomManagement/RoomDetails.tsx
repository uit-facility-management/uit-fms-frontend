'use client';

import { useMemo, useState } from 'react';
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  IconButton,
  Box,
  type SelectChangeEvent,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

import type { RoomRow } from './RoomComponent';

type Props = {
  room: RoomRow;
  onBack: () => void;
};

type Building = 'A' | 'B' | 'C' | 'E';
type RoomType = 'Phòng học' | 'Thực hành' | 'Hội trường';
type RoomStatus = 'Đang sử dụng' | 'Trống' | 'Bảo trì';

type RoomRowWithName = RoomRow & { name?: string };
type FacilityStatus = 'Hoạt động' | 'Hư hỏng';
type IncidentStatus = 'Đã xử lý' | 'Chưa xử lý';

type FacilityRow = {
  id: string;
  name: string;
  status: FacilityStatus;
  roomName: string;
};


type IncidentRow = {
  id: string;
  facilityName: string;     
  description: string; 
  happenedAt: string;
  status: IncidentStatus;
};

// demo data
const INITIAL_FACILITIES: FacilityRow[] = [
  { id: '1', name: 'Máy chiếu', status: 'Hoạt động', roomName: 'A101' },
  { id: '2', name: 'Máy lạnh', status: 'Hư hỏng', roomName: 'A101' },
];

const INITIAL_INCIDENTS: IncidentRow[] = [
  {
    id: 'i1',
    facilityName: 'Máy chiếu',
    description: 'Hư hỏng do cũ kỹ',
    happenedAt: '15:40:00 01/12/2025',
    status: 'Chưa xử lý',
  },
  {
    id: 'i2',
    facilityName: 'Máy lạnh',
    description: 'Rò rỉ nước',
    happenedAt: '09:10:00 02/12/2025',
    status: 'Đã xử lý',
  },
];

const roomStatusChipSx = (s: RoomStatus) => {
  switch (s) {
    case 'Đang sử dụng':
      return { backgroundColor: '#d4edda', color: '#155724' };
    case 'Trống':
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
    case 'Bảo trì':
      return { backgroundColor: '#fff3cd', color: '#856404' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
};

const facilityStatusChipSx = (s: FacilityStatus) => {
  switch (s) {
    case 'Hoạt động':
      return { backgroundColor: '#d4edda', color: '#155724' };
    case 'Hư hỏng':
      return { backgroundColor: '#fde2e2', color: '#b91c1c' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
};

const incidentStatusChipSx = (s: IncidentStatus) => {
  switch (s) {
    case 'Đã xử lý':
      return { backgroundColor: '#d4edda', color: '#155724' };
    case 'Chưa xử lý':
      return { backgroundColor: '#fde2e2', color: '#b91c1c' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="text-sm font-semibold text-gray-800 text-right">{value}</div>
    </div>
  );
}

export default function RoomDetails({ room, onBack }: Props) {
  const r = room as RoomRowWithName;

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState<string>(r.name ?? r.room);
  const [stage, setStage] = useState<number>(Number(r.stage));
  const [capacity, setCapacity] = useState<number>(r.capacity);

  const [building, setBuilding] = useState<Building>((r.building as Building) ?? 'A');
  const [type, setType] = useState<RoomType>(r.type as RoomType);
  const [status, setStatus] = useState<RoomStatus>(r.status as RoomStatus);

  const [facilities, setFacilities] = useState<FacilityRow[]>(
    INITIAL_FACILITIES.map((x) => ({ ...x, roomName: name || r.room })),
  );
  const [incidents, setIncidents] = useState<IncidentRow[]>(INITIAL_INCIDENTS);


  const currentRoomStatusChip = useMemo(
    () => (
      <Chip
        label={status}
        size="small"
        sx={{
          ...roomStatusChipSx(status),
          fontWeight: 700,
          border: 'none',
          px: 0.5,
        }}
      />
    ),
    [status],
  );

  const handleCancel = () => {
    setName(r.name ?? r.room);
    setStage(Number(r.stage));
    setCapacity(r.capacity);
    setBuilding(((r.building as Building) ?? 'A') as Building);
    setType(r.type as RoomType);
    setStatus(r.status as RoomStatus);
    setIsEditing(false);
  };

  const handleSave = () => {
    console.log('SAVE ROOM', {
      code: r.room,
      name,
      building,
      stage,
      type,
      capacity,
      status,
    });

    // update roomName on facilities display
    setFacilities((prev) => prev.map((x) => ({ ...x, roomName: name || r.room })));

    setIsEditing(false);
  };

  // ===== Facilities table columns =====
  const facilityColumns = useMemo<MRT_ColumnDef<FacilityRow>[]>(
    () => [
      { accessorKey: 'name', header: 'Tên', size: 240 },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 160,
        Cell: ({ row }) => (
          <Chip
            label={row.original.status}
            size="small"
            sx={{
              ...facilityStatusChipSx(row.original.status),
              fontWeight: 700,
              border: 'none',
              px: 0.5,
            }}
          />
        ),
      },
      { accessorKey: 'roomName', header: 'Tên phòng', size: 160 },
      {
        id: 'actions',
        header: 'Thao tác',
        size: 120,
        enableSorting: false,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                size="small"
                onClick={() => console.log('EDIT facility', row.original)}
                sx={{ color: '#2563eb' }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xóa">
              <IconButton
                size="small"
                onClick={() => setFacilities((prev) => prev.filter((x) => x.id !== row.original.id))}
                sx={{ color: '#dc2626' }}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );

  const facilitiesTable = useMaterialReactTable({
    columns: facilityColumns,
    data: facilities,

    enableSorting: true,
    enablePagination: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,

    enableColumnActions: false,
    enableGlobalFilter: true,
    enableColumnFilters: false,
    enableRowSelection: false,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: 'var(--primary01)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        px: 2.5,
        py: 1.6,
        '& .MuiTableSortLabel-root': {
          color: 'white !important',
          '&:hover': { color: 'white !important' },
        },
        '& .MuiTableSortLabel-icon': { color: 'white !important' },
        '& .MuiIconButton-root': {
          color: 'white !important',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
        },
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#1f2937',
        px: 2.5,
        py: 2,
        borderBottom: '1px solid #e5e7eb',
      },
    },

    muiTableBodyRowProps: {
      sx: {
        '&:hover': { backgroundColor: 'var(--secondary01)' },
        '&:last-child td': { borderBottom: 'none' },
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0px',
        border: 'none',
        boxShadow: 'none',
        overflow: 'hidden',
        backgroundColor: '#fff',
      },
    },

    muiTopToolbarProps: { sx: { backgroundColor: '#f8f9fa' } },
    muiBottomToolbarProps: { sx: { backgroundColor: '#f8f9fa' } },

    initialState: { pagination: { pageIndex: 0, pageSize: 5 }, density: 'comfortable' },

    localization: {
      noRecordsToDisplay: 'Không có dữ liệu hiển thị',
      rowsPerPage: 'Số dòng mỗi trang',
      of: 'của',
      goToNextPage: 'Trang tiếp',
      goToPreviousPage: 'Trang trước',
      goToFirstPage: 'Trang đầu',
      goToLastPage: 'Trang cuối',
      search: 'Tìm kiếm',
    },
  });

  const incidentColumns = useMemo<MRT_ColumnDef<IncidentRow>[]>(
  () => [
    { accessorKey: 'facilityName', header: 'Tên thiết bị', size: 200 },
    { accessorKey: 'description', header: 'Mô tả', size: 360 },
    { accessorKey: 'happenedAt', header: 'Thời gian xảy ra', size: 200 },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 160,
      Cell: ({ row }) => (
        <Chip
          label={row.original.status}
          size="small"
          sx={{
            ...incidentStatusChipSx(row.original.status),
            fontWeight: 700,
            border: 'none',
            px: 0.5,
          }}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      size: 120,
      enableSorting: false,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              onClick={() => console.log('EDIT incident', row.original)}
              sx={{ color: '#2563eb' }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xóa">
            <IconButton
              size="small"
              onClick={() =>
                setIncidents((prev) => prev.filter((x) => x.id !== row.original.id))
              }
              sx={{ color: '#dc2626' }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ],
  [],
);

const incidentsTable = useMaterialReactTable({
  columns: incidentColumns,
  data: incidents,

  enableSorting: true,
  enablePagination: true,
  enableTopToolbar: true,
  enableBottomToolbar: true,

  enableColumnActions: false,
  enableGlobalFilter: true,
  enableColumnFilters: false,
  enableRowSelection: false,

  // giữ style y chang facilitiesTable
  muiTableHeadCellProps: {
    sx: {
      backgroundColor: 'var(--primary01)',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px',
      px: 2.5,
      py: 1.6,
      '& .MuiTableSortLabel-root': {
        color: 'white !important',
        '&:hover': { color: 'white !important' },
      },
      '& .MuiTableSortLabel-icon': { color: 'white !important' },
      '& .MuiIconButton-root': {
        color: 'white !important',
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
      },
    },
  },

  muiTableBodyCellProps: {
    sx: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#1f2937',
      px: 2.5,
      py: 2,
      borderBottom: '1px solid #e5e7eb',
    },
  },

  muiTableBodyRowProps: {
    sx: {
      '&:hover': { backgroundColor: 'var(--secondary01)' },
      '&:last-child td': { borderBottom: 'none' },
    },
  },

  muiTablePaperProps: {
    elevation: 0,
    sx: {
      borderRadius: '0px',
      border: 'none',
      boxShadow: 'none',
      overflow: 'hidden',
      backgroundColor: '#fff',
    },
  },

  muiTopToolbarProps: { sx: { backgroundColor: '#f8f9fa' } },
  muiBottomToolbarProps: { sx: { backgroundColor: '#f8f9fa' } },

  initialState: { pagination: { pageIndex: 0, pageSize: 5 }, density: 'comfortable' },

  localization: {
    noRecordsToDisplay: 'Không có dữ liệu hiển thị',
    rowsPerPage: 'Số dòng mỗi trang',
    of: 'của',
    goToNextPage: 'Trang tiếp',
    goToPreviousPage: 'Trang trước',
    goToFirstPage: 'Trang đầu',
    goToLastPage: 'Trang cuối',
    search: 'Tìm kiếm',
  },
});


  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Chi tiết phòng</p>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            {r.room}
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

      {/* Thông tin phòng */}
      <div className="mt-5">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Thông tin phòng</p>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
              >
                Chỉnh sửa thông tin
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
                >
                  Lưu
                </button>
              </div>
            )}
          </div>

          <div className="p-5">
            {!isEditing ? (
              <>
                <InfoRow label="Tên phòng" value={name} />
                <InfoRow label="Tòa" value={building} />
                <InfoRow label="Tầng" value={stage} />
                <InfoRow label="Loại" value={type} />
                <InfoRow label="Sức chứa" value={capacity} />
                <InfoRow label="Trạng thái" value={currentRoomStatusChip} />
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  size="small"
                  label="Tên phòng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />

                <FormControl size="small" fullWidth>
                  <InputLabel id="building-label">Tòa</InputLabel>
                  <Select
                    labelId="building-label"
                    label="Tòa"
                    value={building}
                    onChange={(e: SelectChangeEvent) => setBuilding(e.target.value as Building)}
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="E">E</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  label="Tầng"
                  type="number"
                  value={Number.isFinite(stage) ? stage : ''}
                  onChange={(e) => setStage(e.target.value === '' ? 0 : Number(e.target.value))}
                  slotProps={{ input: { inputProps: { min: 0 } } }}
                  fullWidth
                />

                <FormControl size="small" fullWidth>
                  <InputLabel id="type-label">Loại</InputLabel>
                  <Select
                    labelId="type-label"
                    label="Loại"
                    value={type}
                    onChange={(e: SelectChangeEvent) => setType(e.target.value as RoomType)}
                  >
                    <MenuItem value="Phòng học">Phòng học</MenuItem>
                    <MenuItem value="Thực hành">Thực hành</MenuItem>
                    <MenuItem value="Hội trường">Hội trường</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  label="Sức chứa"
                  type="number"
                  value={Number.isFinite(capacity) ? capacity : ''}
                  onChange={(e) => setCapacity(e.target.value === '' ? 0 : Number(e.target.value))}
                  slotProps={{ input: { inputProps: { min: 0 } } }}
                  fullWidth
                />

                <FormControl size="small" fullWidth>
                  <InputLabel id="status-label">Trạng thái</InputLabel>
                  <Select
                    labelId="status-label"
                    label="Trạng thái"
                    value={status}
                    onChange={(e: SelectChangeEvent) => setStatus(e.target.value as RoomStatus)}
                  >
                    <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
                    <MenuItem value="Trống">Trống</MenuItem>
                    <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Cơ sở vật chất ===== */}
      <div className="mt-10 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Cơ sở vật chất
          </p>

          <button
            type="button"
            onClick={() => {
              console.log('ADD facility');
              setFacilities((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  name: 'Thiết bị mới',
                  status: 'Hoạt động',
                  roomName: name || r.room,
                },
              ]);
            }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            Thêm thiết bị
          </button>
        </div>

        <div className="border-t border-gray-100">
          <MaterialReactTable table={facilitiesTable} />
        </div>
      </div>
      {/* ===== Sự việc ===== */}
      <div className="mt-10 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Sự việc</p>

          <button
            type="button"
            onClick={() => {
              console.log('ADD incident');
              setIncidents((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  facilityName: facilities[0]?.name ?? 'Thiết bị',
                  description: 'Mô tả sự việc...',
                  happenedAt: new Date().toLocaleString('vi-VN'),
                  status: 'Chưa xử lý',
                },
              ]);
            }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            Thêm sự việc
          </button>
        </div>

        <div className="border-t border-gray-100">
          <MaterialReactTable table={incidentsTable} />
        </div>
      </div>
    </div>
  );
}
