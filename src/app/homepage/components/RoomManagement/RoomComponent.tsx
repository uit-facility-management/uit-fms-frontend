'use client';

import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  Search,
  FilterAlt,
  ViewColumn,
  DensityMedium,
  Fullscreen,
} from '@mui/icons-material';

type RoomRow = {
  room: string;
  building: string;
  type: string;
  stage: string;
  capacity: number;
  status: string;
  actions: string;
};

export default function RoomComponent() {
  const handleCreateRoom = () => console.log('Tạo phòng');
  const handleBookRoom = () => console.log('Đặt phòng');

  const columns = useMemo<MRT_ColumnDef<RoomRow>[]>(
  () => [
    { accessorKey: 'room', header: 'Phòng', size: 90 },
    { accessorKey: 'building', header: 'Tòa', size: 90 },
    { accessorKey: 'stage', header: 'Tầng', size: 90 },
    { accessorKey: 'type', header: 'Loại', size: 90 },
    { accessorKey: 'capacity', header: 'Sức chứa', size: 90 },
    { accessorKey: 'status', header: 'Trạng thái', size: 140 },
    {
      accessorKey: 'actions',
      header: 'Thao tác',
      size: 140,
      enableSorting: false,
    },
  ],
  [],
);


  const table = useMaterialReactTable({
    columns,
    data: [],
    enableSorting: true,
    enablePagination: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableRowSelection: false,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#5B84C4',
        color: 'white',
        fontWeight: 'bold',
        '& .MuiTableSortLabel-root': { color: 'white !important' },
        '& .MuiTableSortLabel-icon': { color: 'white !important' },
      },
    },
    muiTablePaperProps: {
      elevation: 2,
      sx: {
        borderRadius: '16px',
        overflow: 'hidden',
      },
    },
    muiTopToolbarProps: {
      sx: { backgroundColor: '#fff' },
    },
    muiBottomToolbarProps: {
      sx: { backgroundColor: '#fff' },
    },

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'left', marginLeft: 'auto' }}>
        <Tooltip title="Tìm kiếm">
          <IconButton size="small">
            <Search fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Lọc">
          <IconButton size="small">
            <FilterAlt fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cột">
          <IconButton size="small">
            <ViewColumn fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Mật độ">
          <IconButton size="small">
            <DensityMedium fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toàn màn hình">
          <IconButton size="small">
            <Fullscreen fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      density: 'comfortable',
    },

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
    </div>
  );
}
