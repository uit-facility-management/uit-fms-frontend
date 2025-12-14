'use client';

import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
import {
  Search,
  FilterAlt,
  ViewColumn,
  DensityMedium,
  Fullscreen,
  Visibility
} from '@mui/icons-material';
import RoomDetails from './RoomDetails';

type RoomType = 'Phòng học' | 'Thực hành' | 'Hội trường';
type RoomStatus = 'Đang sử dụng' | 'Trống' | 'Bảo trì';

export type RoomRow = {
  room: string;
  building: string;
  stage: string;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
  actions?: string;
};

const MOCK_DATA: RoomRow[] = [
  { room: 'A101', building: 'A', stage: '1', type: 'Phòng học', capacity: 40, status: 'Đang sử dụng' },
  { room: 'A102', building: 'A', stage: '1', type: 'Thực hành', capacity: 35, status: 'Trống' },
  { room: 'B201', building: 'B', stage: '2', type: 'Phòng học', capacity: 60, status: 'Trống' },
  { room: 'C301', building: 'C', stage: '3', type: 'Hội trường', capacity: 200, status: 'Bảo trì' },
];

const statusChipSx = (s: RoomStatus) => {
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




export default function RoomComponent() {
  const handleCreateRoom = () => console.log('Tạo phòng');
  const handleBookRoom = () => console.log('Đặt phòng');

  const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);

  const columns = useMemo<MRT_ColumnDef<RoomRow>[]>(
    () => [
      { accessorKey: 'room', header: 'Phòng', size: 90 },
      { accessorKey: 'building', header: 'Tòa', size: 90 },
      { accessorKey: 'stage', header: 'Tầng', size: 90 },
      { accessorKey: 'type', header: 'Loại', size: 120 },
      { accessorKey: 'capacity', header: 'Sức chứa', size: 90 },
      { accessorKey: 'status',
        header: 'Trạng thái',
        size: 140,
        Cell: ({ row }) => {
          const s = row.original.status;
          return (
            <Chip
              label={s}
              size="small"
              sx={{
                ...statusChipSx(s),
                fontWeight: 600,
                border: 'none',
                px: 0.5,
              }}
            />
          );
        },
      },
      { id: 'actions',
        header: 'Thao tác',
        size: 140,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              onClick={() => setSelectedRoom(row.original)}
              sx={{ color: '#6b7280' }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [],
  );


  const table = useMaterialReactTable({
    columns,
    data: MOCK_DATA,

    enableSorting: true,
    enablePagination: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,

    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableRowSelection: false,
    enableColumnOrdering: false,

    muiTableBodyCellProps: {
      sx: {
        fontSize: '15px',
        lineHeight: '20px',
        fontWeight: 500,
        color: '#1f2937',
        px: 2.5,
        py: 2,
        borderBottom: '1px solid #e5e7eb',
      },
    },

    muiTableBodyRowProps: {
      sx: {
        '&:hover': {
          backgroundColor: 'var(--secondary01)',
        },
      },
    },

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: 'var(--primary01)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '15px',
        letterSpacing: '0.2px',
        px: 2.5,
        py: 1.6,

        '& .MuiTableSortLabel-root': {
          color: 'white !important',
          '&:hover': { color: 'white !important' },
        },
        '& .MuiTableSortLabel-icon': { color: 'white !important' },

        '& .MuiButtonBase-root': {
          color: 'white !important',
          '&:hover': {
            color: 'white !important',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },

        '& .MuiSvgIcon-root': { color: 'white !important' },

        '& .MuiIconButton-root': {
          color: 'white !important',
          '&:hover': {
            color: 'white !important',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },

    muiTablePaperProps: {
      elevation: 2,
      sx: {
        borderRadius: '8px',
        overflow: 'hidden',
      },
    },

    muiTopToolbarProps: {
      sx: {
        backgroundColor: '#f8f9fa',
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: '#f8f9fa',
      },
    },

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: 0.5, marginLeft: 'auto' }}>
        <Tooltip title="Tìm kiếm"><IconButton size="small"><Search fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Lọc"><IconButton size="small"><FilterAlt fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Cột"><IconButton size="small"><ViewColumn fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Mật độ"><IconButton size="small"><DensityMedium fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Toàn màn hình"><IconButton size="small"><Fullscreen fontSize="small" /></IconButton></Tooltip>
      </Box>
    ),

    initialState: { pagination: { pageIndex: 0, pageSize: 10 }, density: 'comfortable' },

    localization: {
      noRecordsToDisplay: 'Không có dữ liệu hiển thị',
      rowsPerPage: 'Số dòng mỗi trang',
      of: 'của',
      goToNextPage: 'Trang tiếp',
      goToPreviousPage: 'Trang trước',
      goToFirstPage: 'Trang đầu',
      goToLastPage: 'Trang cuối',
    },
  });


  return (
    <div className="w-full">
      {selectedRoom ? (
        <RoomDetails
          room={selectedRoom}
          onBack={() => setSelectedRoom(null)}
        />
      ) : (
        <>
          <div className="flex items-start justify-end gap-2">
            <button
              onClick={handleCreateRoom}
              className="rounded-lg px-4 py-2 font-medium text-white bg-[#5295f8] hover:bg-[#377be1] transition"
            >
              Tạo phòng
            </button>

            <button
              onClick={handleBookRoom}
              className="rounded-lg px-4 py-2 font-medium text-white bg-[#5295f8] hover:bg-[#377be1] transition"
            >
              Đặt phòng
            </button>
          </div>

          <div className="mt-4">
            <MaterialReactTable table={table} />
          </div>
        </>
      )}
    </div>
  );
}