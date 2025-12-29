/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { IconButton, Tooltip, Chip, TextField, Autocomplete } from "@mui/material";
import {
  Visibility,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
} from "@mui/icons-material";
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
import type { RoomAssetQueryParams } from "@/feature/RoomAssetApi/type";

export type FacilityType =
  | "Đồ điện tử"
  | "Đồ nội thất"
  | "Văn phòng phẩm"
  | "Khác";
export type FacilityStatus = "Hoạt động" | "Không hoạt động" | "Hư hỏng";

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
  INACTIVE: "Không hoạt động",
  MAINTENANCE: "Hư hỏng",
};

const facilityStatusChipSx = (s: FacilityStatus) => {
  switch (s) {
    case "Hoạt động":
      return { backgroundColor: "#ECFDF3", color: "#027A48", border: "none" };
    case "Không hoạt động":
      return { backgroundColor: "#dbeafe", color: "#155dfc", border: "none" };
    case "Hư hỏng":
      return { backgroundColor: "#ffe5e5", color: "#ff1919", border: "none" };
  }
};

const toApiType = (t: string): RoomAssetQueryParams["type"] | undefined => {
  switch (t) {
    case "Đồ điện tử":
      return "Electronics";
    case "Đồ nội thất":
      return "Furniture";
    case "Văn phòng phẩm":
      return "Stationery";
    case "Khác":
      return "Other";
    default:
      return undefined;
  }
};

const toApiStatus = (s: string): RoomAssetQueryParams["status"] | undefined => {
  switch (s) {
    case "Hoạt động":
      return "ACTIVE";
    case "Không hoạt động":
      return "INACTIVE";
    case "Hư hỏng":
      return "MAINTENANCE";
    default:
      return undefined;
  }
};

export default function ToolsComponent() {
  const [appliedParams, setAppliedParams] = useState<RoomAssetQueryParams>({});
  const {
    data,
    isLoading,
    error,
    refetch: refetchFacilities,
  } = useGetRoomAssetsQuery(appliedParams);
  
  console.log("appliedParams", appliedParams);

  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(
    null
  );

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createFacility] = useCreateFacilityMutation();

  // rooms data (for modal + room autocomplete in filter UI)
  const { data: roomsRes, isLoading: loadingRooms } = useGetRoomQuery();

  // ===== NEW: search + filter UI state (UI only) =====
  const [searchText, setSearchText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filterType, setFilterType] = useState<string>("");
  const [filterBuildingId, setFilterBuildingId] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterRoom, setFilterRoom] = useState<RoomResponse | null>(null);

  const roomAutocompleteSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      borderRadius: "0.5rem", 
      padding: 0, 
      "& fieldset": { borderColor: "#E5E7EB" }, 
      "&:hover fieldset": { borderColor: "#E5E7EB" },
      "&.Mui-focused fieldset": { borderColor: "#E5E7EB" },
    },
    "& .MuiOutlinedInput-input": {
      padding: "8px 12px", 
      fontSize: "14px",
      color: "#374151",
    },
    "& .MuiAutocomplete-endAdornment": {
      right: 10, 
    },
    "& input::placeholder": {
      opacity: 0.5,
      color: "#6B7280",
    },
  };

  const roomsList = useMemo<any[]>(() => {
    if (!roomsRes) return [];
    if (Array.isArray(roomsRes)) return roomsRes;
    return (roomsRes as any).roomsData ?? (roomsRes as any).data ?? [];
  }, [roomsRes]);

  const roomOptions: RoomOption[] = useMemo(() => {
    return roomsList.map((r: any) => ({
      id: r.id,
      name: `${r.name} - Tầng ${r.stage}`,
      buildingId: r.building.id,
      buildingName: r.building.name,
    }));
  }, [roomsList]);

  // ===== NEW: parse rooms like your BorrowTicketPopup to feed Autocomplete
  const rooms = useMemo<RoomResponse[]>(() => {
    if (!roomsRes) return [];
    if (Array.isArray(roomsRes)) return roomsRes as RoomResponse[];
    if (Array.isArray((roomsRes as any).roomsData))
      return (roomsRes as any).roomsData as RoomResponse[];
    if (Array.isArray((roomsRes as any).data))
      return (roomsRes as any).data as RoomResponse[];
    return [];
  }, [roomsRes]);

  const handleSubmitCreateFacility = async (payload: CreateFacilityPayload) => {
    try {
      await createFacility(payload).unwrap();
      setOpenCreateModal(false);
      refetchFacilities();
    } catch (err) {
      console.error("Create facility failed", err);
    }
  };

  const applySearchAndFilter = () => {
    const q = searchText.trim();

    setAppliedParams({
      q: q || undefined,
      type: filterType ? toApiType(filterType) : undefined,
      status: filterStatus ? toApiStatus(filterStatus) : undefined,
      roomId: filterRoom?.id || undefined,
      buildingId: filterBuildingId || undefined,
    });
  };

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
        "Không hoạt động",
    }));
  }, [data]);

  // dropdown options (UI only)
  const typeOptions: FacilityType[] = useMemo(
    () => ["Đồ điện tử", "Đồ nội thất", "Văn phòng phẩm", "Khác"],
    []
  );

  const buildingFilterOptions = useMemo(() => {
    const map = new Map<string, string>(); // id -> name
    roomsList.forEach((r: any) => {
      if (r?.building?.id) map.set(r.building.id, r.building.name);
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [roomsList]);


  const statusOptions: FacilityStatus[] = useMemo(
    () => ["Hoạt động", "Không hoạt động", "Hư hỏng"],
    []
  );

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
                          : s === "Không hoạt động"
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
              onClick={() => setSelectedFacilityId(row.original.id)}
              sx={{
                color: "#6B7280",
                "&:hover": { backgroundColor: "#F3F4F6", color: "#111827" },
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
    enableRowSelection: false,
    enablePagination: true,
    enableColumnFilters: true,

    // keep UI search bar custom
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
          onIncidentCreated={() => refetchFacilities()}
        />
      ) : (
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

          {/* Search + Filter bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 w-full max-w-md bg-white border border-gray-200 rounded-lg px-3 py-2">
              <button
                type="button"
                onClick={applySearchAndFilter}
                className="p-0 m-0 bg-transparent border-0 cursor-pointer"
                title="Tìm kiếm"
              >
                <SearchIcon sx={{ fontSize: 20, color: "#6B7280" }} />
              </button>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applySearchAndFilter();
                  }
                }}
                placeholder="Search..."
                className="w-full text-sm outline-none text-gray-700 placeholder:opacity-70"
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

          {/* Filter panel (UI only) */}
          {isFilterOpen && (
            <div className="mb-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    {typeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ===== UPDATED: Room = Autocomplete (same design as BorrowTicketPopup) ===== */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Phòng</p>

                  <Autocomplete<RoomResponse>
                    options={rooms}
                    loading={loadingRooms}
                    value={filterRoom}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, value) => setFilterRoom(value)}
                    slotProps={{
                      listbox: {
                        sx: {
                          maxHeight: 200,
                          overflowY: "auto",
                          "& li": { minHeight: 22, fontSize: 14 },
                        },
                      },
                    }}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        key={option.id}
                        style={{
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={option.name}
                      >
                        {option.name}
                      </li>
                    )}
                    filterOptions={(options, state) =>
                      options.filter((r) =>
                        r.name.toLowerCase().includes(state.inputValue.toLowerCase())
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Chọn phòng..."
                        size="small"
                        sx={roomAutocompleteSx}
                      />
                    )}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Tòa
                  </p>
                  <select
                    value={filterBuildingId}
                    onChange={(e) => setFilterBuildingId(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                  >
                    <option value="">Tất cả</option>
                    {buildingFilterOptions.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
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
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFilterType("");
                    setFilterBuildingId("");
                    setFilterStatus("");
                    setFilterRoom(null);
                    setAppliedParams({});
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Xóa lọc
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const q = searchText.trim();

                    setAppliedParams({
                      q: q || undefined,
                      type: filterType ? toApiType(filterType) : undefined,
                      status: filterStatus ? toApiStatus(filterStatus) : undefined,
                      roomId: filterRoom?.id || undefined,
                      buildingId: filterBuildingId || undefined,
                    });
                  }}
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
