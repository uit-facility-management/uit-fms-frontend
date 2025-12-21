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
import {
  useGetRoomAssetsQuery,
  useCreateFacilityMutation,
} from "@/feature/RoomAssetApi/facility.api";
import { useGetRoomQuery } from "@/feature/RoomApi/room.api";
import { RoomAssetResponse } from "@/feature/RoomAssetApi/type";
import type { RoomResponse } from "@/feature/RoomApi/type";
import CreateFacilityModal, {
  CreateFacilityPayload,
} from "./CreateFacilityModal";
import type { RoomOption } from "./CreateFacilityModal";

export type FacilityType =
  | "Đồ điện tử"
  | "Đồ nội thất"
  | "Văn phòng phẩm"
  | "Khác";
export type FacilityStatus = "Hoạt động" | "Chưa sử dụng" | "Hư hỏng";

export type FacilityRow = {
  id: string;
  roomId: string;
  name: string;
  type: FacilityType;
  room: string;
  building: string;
  status: FacilityStatus;
  actions?: string;
};

export const mapType: Record<RoomAssetResponse["type"], FacilityType> = {
  Electronics: "Đồ điện tử",
  Furniture: "Đồ nội thất",
  Stationery: "Văn phòng phẩm",
  Other: "Khác",
};

export const mapStatus: Record<RoomAssetResponse["status"], FacilityStatus> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Chưa sử dụng",
  MAINTENANCE: "Hư hỏng",
};

const facilityStatusChipSx = (s: FacilityStatus) => {
  switch (s) {
    case "Hoạt động":
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
    case "Hư hỏng":
      return {
        backgroundColor: "#ffe5e5",
        color: "#ff1919",
        border: "none",
      };
  }
};

export default function ToolsComponent() {
  // get api room assets data
  const { data, isLoading, error } = useGetRoomAssetsQuery();

  // console.log("API data room asset:", data);
  // console.log("API error room asset:", error);

  // selected facility để xem chi tiết
  // const [selectedFacility, setSelectedFacility] = useState<FacilityRow | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  // modal thêm thiết bị
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createFacility] = useCreateFacilityMutation();
  const { data: roomsRes } = useGetRoomQuery();

  // console.log("API data rooms for facility:", roomsRes);

  // map rooms data thành options cho select trong modal tạo thiết bị
  const roomOptions: RoomOption[] = useMemo(() => {
    if (!roomsRes) return [];

    return roomsRes.map((r: RoomResponse) => ({
      id: r.id,
      name: `${r.name} - Tầng ${r.stage}`,
      buildingId: r.building.id,
      buildingName: r.building.name,
    }));
  }, [roomsRes]);

  // console.log("Room options for facility:", roomOptions);

  // handle submit tạo thiết bị
  const handleSubmitCreateFacility = async (payload: CreateFacilityPayload) => {
    try {
      await createFacility(payload).unwrap();
      setOpenCreateModal(false);
    } catch (err) {
      console.error("Create facility failed", err);
    }
  };

  // map data to table row
  const facilities: FacilityRow[] = useMemo(() => {
    if (!data) return [];

    return data.map((asset) => ({
      id: asset.id,
      roomId: asset.room.id,
      name: asset.name,

      type: mapType[asset.type as RoomAssetResponse["type"]] ?? "Khác",

      room: asset.room.name,
      building: asset.room.building.name,

      status:
        mapStatus[asset.status as RoomAssetResponse["status"]] ??
        "Chưa sử dụng",
    }));
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<FacilityRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên thiết bị",
        size: 150,
        Cell: ({ cell }) => (
          <span className="font-medium text-gray-900">
            {cell.getValue<string>()}
          </span>
        ),
      },
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
          <span className="text-gray-700">{cell.getValue<string>()}</span>
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
                      s === "Hoạt động"
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
            onClick={() => {setSelectedFacilityId(row.original.id)}}
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
    data: facilities,
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

  if (isLoading) {
    return (
      <div className="py-10 text-center text-gray-500">Đang tải dữ liệu...</div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        Không thể tải dữ liệu
      </div>
    );
  }

  return (
    <div className="w-full">
      {selectedFacilityId ? (
        <FacilityDetails
          facilityId={selectedFacilityId}
          onBack={() => setSelectedFacilityId(null)}
          onUpdate={() => {}}
          rooms={roomOptions}
        />
      ) : (
        <>
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách cơ sở vật chất
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={() => setOpenCreateModal(true)}
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
          <CreateFacilityModal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onSubmit={handleSubmitCreateFacility}
            rooms={roomOptions}
          />
        </>
      )}
    </div>
  );
}
