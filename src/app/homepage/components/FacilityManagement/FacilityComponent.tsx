"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { IconButton, Tooltip, Chip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import FacilityDetails from "./FacilityDetails";

type FacilityType = "Điều khiển" | "Mic" | "Máy chiếu" | "Loa" | "PC" | "Máy lạnh";
type FacilityStatus = "Đang sử dụng" | "Chưa sử dụng" | "Bị hỏng";

export type FacilityRow = {
  type: FacilityType;
  room: string;
  building: string;
  status: FacilityStatus;
  actions?: string;
};

const MOCK_DATA: FacilityRow[] = [
  {
    type: "Máy chiếu",
    room: "A101",
    building: "A",
    status: "Đang sử dụng",
  },
  {
    type: "Loa",
    room: "A101",
    building: "A",
    status: "Chưa sử dụng",
  },
  {
    type: "Mic",
    room: "A102",
    building: "A",
    status: "Bị hỏng",
  },
  {
    type: "PC",
    room: "A102",
    building: "A",
    status: "Đang sử dụng",
  },
  {
    type: "Máy lạnh",
    room: "A201",
    building: "A",
    status: "Chưa sử dụng",
  },
  {
    type: "Điều khiển",
    room: "A201",
    building: "A",
    status: "Bị hỏng",
  },
  {
    type: "Máy chiếu",
    room: "B101",
    building: "B",
    status: "Chưa sử dụng",
  },
  {
    type: "Loa",
    room: "B101",
    building: "B",
    status: "Đang sử dụng",
  },
  {
    type: "PC",
    room: "B201",
    building: "B",
    status: "Đang sử dụng",
  },
  {
    type: "Mic",
    room: "B202",
    building: "B",
    status: "Chưa sử dụng",
  },
  {
    type: "Máy lạnh",
    room: "C101",
    building: "C",
    status: "Đang sử dụng",
  },
  {
    type: "Máy chiếu",
    room: "C201",
    building: "C",
    status: "Bị hỏng",
  },
  {
    type: "Loa",
    room: "C301",
    building: "C",
    status: "Bị hỏng",
  },
  {
    type: "PC",
    room: "D101",
    building: "D",
    status: "Chưa sử dụng",
  },
  {
    type: "Máy lạnh",
    room: "D201",
    building: "D",
    status: "Đang sử dụng",
  },
];


const facilityStatusChipSx = (s: FacilityStatus) => {
  switch (s) {
    case "Đang sử dụng":
      return {
        backgroundColor: "#ECFDF3",
        color: "#027A48",
        border: "none",
      };
    case "Chưa sử dụng":
      return {
        backgroundColor: "#dbeafe",
        color: "#155dfc",
        border: "none",
      };
    case "Bị hỏng":
      return {
        backgroundColor: "#ffe5e5",
        color: "#ff1919",
        border: "none",
      };
  }
};

export default function ToolsComponent() {
  const handleAddFacility = () => console.log("Thêm tài sản");
  const handleFacility = () => console.log("Bảo trì");

  const [selectedFacility, setSelectedFacility] = useState<FacilityRow | null>(null);

  const columns = useMemo<MRT_ColumnDef<FacilityRow>[]>(
  () => [
    {
      accessorKey: "type",
      header: "Loại thiết bị",
      size: 150,
      Cell: ({ cell }) => (
        <span className="font-medium text-gray-900">
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "room",
      header: "Phòng",
      size: 100,
      Cell: ({ cell }) => (
        <span className="font-semibold text-gray-800">
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "building",
      header: "Tòa",
      size: 80,
      Cell: ({ cell }) => (
        <span className="text-gray-700">
          {cell.getValue<string>()}
        </span>
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
              ...facilityStatusChipSx(s),
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
                        : s === "Chưa sử dụng"
                        ? "#3080ff"
                        : "#F04438",
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
            onClick={() => setSelectedFacility(row.original)}
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
    enableGlobalFilter: true,
    enableRowSelection: false,
    enablePagination: true,
    enableColumnFilters: true,
    
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
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "comfortable",
    },
  });

  return (
    <div className="w-full">
      {selectedFacility ? (
        <FacilityDetails facility={selectedFacility} onBack={() => setSelectedFacility(null)} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Danh sách cơ sở vật chất
            </h2>

            <div className="flex gap-3">
              <button
                onClick={handleFacility}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#0B4DBA] hover:bg-[#0940A3] transition-all shadow-sm"
              >
                Thêm thiết bị
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <MaterialReactTable table={table} />
          </div>
        </>
      )}
    </div>
  );
}
