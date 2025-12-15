"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { IconButton, Tooltip, Chip } from "@mui/material";
import {
  Visibility,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
} from "@mui/icons-material";
import RoomDetails from "./RoomDetails";

type RoomType = "Phòng học" | "Thực hành" | "Hội trường";
type RoomStatus = "Đang sử dụng" | "Hư hỏng" | "Bảo trì";

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
    status: "Hư hỏng",
  },
  {
    room: "A103",
    building: "A",
    stage: 1,
    type: "Phòng học",
    capacity: 50,
    status: "Hư hỏng",
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
    status: "Hư hỏng",
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
    status: "Hư hỏng",
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
    status: "Hư hỏng",
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
    status: "Hư hỏng",
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
    status: "Hư hỏng",
  },
];

const statusChipSx = (s: RoomStatus) => {
  switch (s) {
    case "Đang sử dụng":
      return { backgroundColor: "#ECFDF3", color: "#027A48", border: "none" };
    case "Hư hỏng":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C", border: "none" };
    case "Bảo trì":
      return { backgroundColor: "#FFF7ED", color: "#B45309", border: "none" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#4B5563", border: "none" };
  }
};


export default function RoomComponent() {
  const handleCreateRoom = () => console.log("Tạo phòng");
  const handleBookRoom = () => console.log("Đặt phòng");

  const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);

  // search + filter UI state
  const [searchText, setSearchText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  //  filter fields
  const [filterBuilding, setFilterBuilding] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterStage, setFilterStage] = useState<string>("");
  const [filterCapacity, setFilterCapacity] = useState<string>("");

  const columns = useMemo<MRT_ColumnDef<RoomRow>[]>(
    () => [
      {
        accessorKey: "room",
        header: "Phòng",
        size: 100,
        Cell: ({ cell }) => (
          <span className="font-bold text-gray-900 text-base">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "building",
        header: "Tòa",
        size: 90,
        Cell: ({ cell }) => (
          <span className="text-gray-700">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "stage",
        header: "Tầng",
        size: 90,
        Cell: ({ cell }) => (
          <span className="text-gray-700">{cell.getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "type",
        header: "Loại",
        size: 130,
        Cell: ({ cell }) => (
          <span className="text-gray-700">{cell.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "capacity",
        header: "Sức chứa",
        size: 110,
        Cell: ({ cell }) => (
          <span className="text-gray-700">{cell.getValue<number>()} người</span>
        ),
      },
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
                fontSize: "13px",
                height: 28,
                borderRadius: "8px",
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
                          : s === "Hư hỏng"
                          ? "#EF4444"
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
              sx={{
                color: "#6B7280",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                  color: "#111827",
                },
              }}
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
    enableRowSelection: false,
    enablePagination: true,
    enableColumnFilters: true,

    // NEW: dùng globalFilter theo searchText (FE-only)
    enableGlobalFilter: true,
    onGlobalFilterChange: setSearchText,
    state: { globalFilter: searchText },

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
        "&:hover": { backgroundColor: "#FAFBFC" },
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
        backgroundColor: "#ffffff",
      },
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "comfortable",
    },
  });

  return (
    <div className="w-full">
      {selectedRoom ? (
        <RoomDetails room={selectedRoom} onBack={() => setSelectedRoom(null)} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Danh sách phòng</h2>

            <div className="flex gap-3">
              <button
                onClick={handleCreateRoom}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Tạo phòng
              </button>

              <button
                onClick={handleBookRoom}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#0B4DBA] hover:bg-[#0940A3] transition-all shadow-sm"
              >
                Đặt phòng
              </button>
            </div>
          </div>

          {/* NEW: Search + Filter bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 w-full max-w-md bg-white border border-gray-200 rounded-lg px-3 py-2">
              <SearchIcon sx={{ fontSize: 20, color: "#6B7280" }} />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <FilterIcon sx={{ fontSize: 18, color: "#6B7280" }} />
              Filter
            </button>
          </div>

          {/* NEW: Filter panel (UI only) */}
          {isFilterOpen && (
            <div className="mb-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Tòa
                  </p>
                  <select
                    value={filterBuilding}
                    onChange={(e) => setFilterBuilding(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                  >
                    <option value="">Tất cả</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Loại
                  </p>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                  >
                    <option value="">Tất cả</option>
                    <option value="Phòng học">Phòng học</option>
                    <option value="Thực hành">Thực hành</option>
                    <option value="Hội trường">Hội trường</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Trạng thái
                  </p>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                  >
                    <option value="">Tất cả</option>
                    <option value="Đang sử dụng">Đang sử dụng</option>
                    <option value="Hư hỏng">Hư hỏng</option>
                    <option value="Bảo trì">Bảo trì</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Tầng
                  </p>
                  <input
                    type="number"
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value)}
                    placeholder="VD: 1"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Sức chứa
                  </p>
                  <input
                    type="number"
                    value={filterCapacity}
                    onChange={(e) => setFilterCapacity(e.target.value)}
                    placeholder="VD: 40"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFilterBuilding("");
                    setFilterType("");
                    setFilterStatus("");
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Xóa lọc
                </button>
                <button
                  type="button"
                  onClick={() =>
                    console.log("APPLY FILTER (UI only)", {
                      filterBuilding,
                      filterType,
                      filterStatus,
                    })
                  }
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#0B4DBA] hover:bg-[#0940A3] transition"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <MaterialReactTable table={table} />
          </div>
        </>
      )}
    </div>
  );
}
