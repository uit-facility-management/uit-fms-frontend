"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import {
  Search,
  FilterAlt,
  ViewColumn,
  DensityMedium,
  Fullscreen,
  Visibility,
} from "@mui/icons-material";
import RoomDetails from "./RoomDetails";

type RoomType = "Phòng học" | "Thực hành" | "Hội trường";
type RoomStatus = "Đang sử dụng" | "Trống" | "Bảo trì";

export type RoomRow = {
  room: string;
  building: string;
  stage: number;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
  actions?: string;
};

const MOCK_DATA: RoomRow[] = [
  {
    room: "A101",
    building: "A",
    stage: 1,
    type: "Phòng học",
    capacity: 40,
    status: "Đang sử dụng",
  },
  {
    room: "A102",
    building: "A",
    stage: 1,
    type: "Thực hành",
    capacity: 35,
    status: "Trống",
  },
  {
    room: "A103",
    building: "A",
    stage: 1,
    type: "Phòng học",
    capacity: 50,
    status: "Trống",
  },

  {
    room: "A201",
    building: "A",
    stage: 2,
    type: "Phòng học",
    capacity: 45,
    status: "Đang sử dụng",
  },
  {
    room: "A202",
    building: "A",
    stage: 2,
    type: "Thực hành",
    capacity: 30,
    status: "Bảo trì",
  },

  {
    room: "B101",
    building: "B",
    stage: 1,
    type: "Phòng học",
    capacity: 60,
    status: "Trống",
  },
  {
    room: "B102",
    building: "B",
    stage: 1,
    type: "Thực hành",
    capacity: 40,
    status: "Đang sử dụng",
  },

  {
    room: "B201",
    building: "B",
    stage: 2,
    type: "Phòng học",
    capacity: 55,
    status: "Trống",
  },
  {
    room: "B202",
    building: "B",
    stage: 2,
    type: "Hội trường",
    capacity: 150,
    status: "Đang sử dụng",
  },

  {
    room: "C101",
    building: "C",
    stage: 1,
    type: "Phòng học",
    capacity: 35,
    status: "Trống",
  },
  {
    room: "C201",
    building: "C",
    stage: 2,
    type: "Phòng học",
    capacity: 45,
    status: "Đang sử dụng",
  },
  {
    room: "C301",
    building: "C",
    stage: 3,
    type: "Hội trường",
    capacity: 200,
    status: "Bảo trì",
  },

  {
    room: "D101",
    building: "D",
    stage: 1,
    type: "Thực hành",
    capacity: 25,
    status: "Trống",
  },
  {
    room: "D201",
    building: "D",
    stage: 2,
    type: "Phòng học",
    capacity: 40,
    status: "Đang sử dụng",
  },
  {
    room: "D301",
    building: "D",
    stage: 3,
    type: "Phòng học",
    capacity: 50,
    status: "Trống",
  },
];

const statusChipSx = (s: RoomStatus) => {
  switch (s) {
    case "Đang sử dụng":
      return {
        backgroundColor: "#ECFDF3",
        color: "#027A48",
        border: "1px solid #ABEFC6",
      };

    case "Trống":
      return {
        backgroundColor: "#F9FAFB",
        color: "#344054",
        border: "1px solid #E4E7EC",
      };

    case "Bảo trì":
      return {
        backgroundColor: "#FFF7ED",
        color: "#B45309",
        border: "1px solid #FED7AA",
      };
  }
};

export default function RoomComponent() {
  const handleCreateRoom = () => console.log("Tạo phòng");
  const handleBookRoom = () => console.log("Đặt phòng");

  const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);
  const ROW_HEIGHT = 52;
  const PAGE_SIZE = 10;
  const columns = useMemo<MRT_ColumnDef<RoomRow>[]>(
    () => [
      {
        accessorKey: "room",
        header: "Phòng",
        size: 90,
        Cell: ({ cell }) => (
          <span className="font-semibold text-gray-900">
            {cell.getValue<string>()}
          </span>
        ),
      },
      { accessorKey: "building", header: "Tòa", size: 80 },
      { accessorKey: "stage", header: "Tầng", size: 80 },
      { accessorKey: "type", header: "Loại", size: 120 },
      { accessorKey: "capacity", header: "Sức chứa", size: 100 },

      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 140,
        Cell: ({ row }) => {
          const s = row.original.status;

          return (
            <Chip
              size="small"
              sx={{
                ...statusChipSx(s),
                fontWeight: 600,
                fontSize: "12px",
                height: 24,
                borderRadius: "999px",
              }}
              label={
                <span className="flex items-center gap-1.5">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor:
                        s === "Đang sử dụng"
                          ? "#12B76A"
                          : s === "Trống"
                          ? "#667085"
                          : "#F79009",
                    }}
                  />
                  {s}
                </span>
              }
            />
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              onClick={() => setSelectedRoom(row.original)}
              sx={{ color: "#4b5563" }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: MOCK_DATA,

    enableSorting: true,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableGlobalFilter: true,
    enableRowSelection: false,
    enablePagination: true,
    enableColumnFilters: true,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#ffffff",
        color: "#6b7280",
        fontWeight: 600,
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "2px solid #f3f4f6",
        py: 2,
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#111827",
        py: 2.5,
        borderBottom: "1px solid #f9fafb",
      },
    },

    muiTableBodyRowProps: {
      sx: {
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "#f9fafb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        },
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      },
    },

    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "compact",
    },
  });

  return (
    <div className="w-full">
      {selectedRoom ? (
        <RoomDetails room={selectedRoom} onBack={() => setSelectedRoom(null)} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách phòng
            </h2>

            <div className="flex gap-2">
              <button
                onClick={handleCreateRoom}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Tạo phòng
              </button>

              <button
                onClick={handleBookRoom}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Đặt phòng
              </button>
            </div>
          </div>

          <div className="mt-4">
            <MaterialReactTable table={table} />
          </div>
        </>
      )}
    </div>
  );
}
