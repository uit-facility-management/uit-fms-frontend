"use client";

import { useMemo, useState } from "react";
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
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  useUpdateRoomMutation,
  useGetRoomAssetsQuery,
  useDeleteRoomAssetMutation,
} from "@/feature/RoomApi/room.api";
import type {
  CreateRoomRequest,
  RoomAssetResponse,
} from "@/feature/RoomApi/type";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import type { RoomRow } from "./RoomComponent";
import CreateRoomAssetModal from "./CreateRoomAssetModal";
import EditRoomAssetModal from "./EditRoomAssetModal";
import CreateIncidentModal, {
  type CreateIncidentPayload,
} from "./CreateIncidentModal";
import {
  useGetIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
} from "@/feature/RoomAssetApi/incident.api";
import EditIncidentModal, {
  type EditIncidentPayload,
} from "./EditIncidentModal";

type BuildingOption = { id: string; name: string };

type Props = {
  room: RoomRow;
  onBack: () => void;
  buildings: BuildingOption[];
  onUpdated?: () => void;
};

type RoomType = "Phòng học" | "Thực hành" | "Hội trường";
type RoomStatus = "Hoạt động" | "Hư hỏng" | "Bảo trì";

type RoomRowWithName = RoomRow & {
  name?: string;
  id: string;
  building_id?: string;
};
type FacilityStatus = "Hoạt động" | "Hư hỏng";
export type IncidentStatus = "Đã xử lý" | "Chưa xử lý";

type FacilityRow = {
  id: string;
  name: string;
  type: string;
  status: FacilityStatus;
  roomName: string;
};

type IncidentRow = {
  id: string;
  facilityId: string;
  facilityName: string;
  description: string;
  happenedAt: string;
  status: IncidentStatus;
};

const roomStatusChipSx = (s: RoomStatus) => {
  switch (s) {
    case "Hoạt động":
      return { backgroundColor: "#d4edda", color: "#155724" };
    case "Hư hỏng":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
    case "Bảo trì":
      return { backgroundColor: "#fff3cd", color: "#856404" };
    default:
      return { backgroundColor: "#e2e3e5", color: "#383d41" };
  }
};

const facilityStatusChipSx = (s: FacilityStatus) => {
  switch (s) {
    case "Hoạt động":
      return { backgroundColor: "#d4edda", color: "#155724" };
    case "Hư hỏng":
      return { backgroundColor: "#fde2e2", color: "#b91c1c" };
    default:
      return { backgroundColor: "#e2e3e5", color: "#383d41" };
  }
};

export const incidentStatusChipSx = (s: IncidentStatus) => {
  switch (s) {
    case "Đã xử lý":
      return { backgroundColor: "#d4edda", color: "#155724" };
    case "Chưa xử lý":
      return { backgroundColor: "#fde2e2", color: "#b91c1c" };
    default:
      return { backgroundColor: "#e2e3e5", color: "#383d41" };
  }
};

const mapAssetTypeToUI = (t: string) => {
  switch (t) {
    case "Electronics":
      return "Thiết bị điện tử";
    case "Furniture":
      return "Nội thất";
    case "Stationery":
      return "Văn phòng phẩm";
    case "Other":
      return "Khác";
    default:
      return t;
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

const mapStatusToApi = (s: RoomStatus) =>
  s === "Hoạt động" ? "active" : s === "Bảo trì" ? "maintenance" : "inactive";

const mapTypeToApi = (t: RoomType) =>
  t === "Hội trường" ? "meeting" : t === "Thực hành" ? "lab" : "classroom";

const mapAssetStatusToUI = (s: RoomAssetResponse["status"]): FacilityStatus =>
  s === "ACTIVE" ? "Hoạt động" : "Hư hỏng";

const mapIncidentStatusToUI = (s: string): IncidentStatus =>
  s === "resolved" ? "Đã xử lý" : "Chưa xử lý";

export const mapIncidentStatusToApi = (s: "Đã xử lý" | "Chưa xử lý") =>
  s === "Đã xử lý" ? "resolved" : "pending";

export default function RoomDetails({
  room,
  onBack,
  buildings,
  onUpdated,
}: Props) {
  const r = room as RoomRowWithName;
  const [isEditing, setIsEditing] = useState(false);
  const [openCreateAsset, setOpenCreateAsset] = useState(false);
  const [openEditAsset, setOpenEditAsset] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FacilityRow | null>(null);
  const [deleteRoomAsset, { isLoading: isDeletingAsset }] =
    useDeleteRoomAssetMutation();

  // báo hỏng facility
  const [incidentFacilityId, setIncidentFacilityId] = useState<string | undefined>(undefined);


  const [name, setName] = useState<string>(r.name ?? r.room);
  const [stage, setStage] = useState<number>(Number(r.stage));
  const [capacity, setCapacity] = useState<number>(r.capacity);

  const [buildingId, setBuildingId] = useState<string>(r.building_id ?? "");
  const buildingName = useMemo(() => {
    return buildings.find((b) => b.id === buildingId)?.name ?? r.building ?? "";
  }, [buildings, buildingId, r.building]);
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [createIncident, { isLoading: isCreatingIncident }] =
    useCreateIncidentMutation();
  const [updateIncident] = useUpdateIncidentMutation();
  const [deleteIncident, { isLoading: isDeletingIncident }] =
    useDeleteIncidentMutation();

  const [type, setType] = useState<RoomType>(r.type as RoomType);
  const [status, setStatus] = useState<RoomStatus>(r.status as RoomStatus);
  const [openCreateIncident, setOpenCreateIncident] = useState(false);
  const [openEditIncident, setOpenEditIncident] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRow | null>(
    null
  );

  const {
    data: roomAssets = [],
    isLoading: isLoadingAssets,
    isFetching: isFetchingAssets,
    isError: isAssetsError,
    refetch: refetchAssets,
  } = useGetRoomAssetsQuery();

  const {
    data: incidentsApi = [],
    isLoading: isLoadingIncidents,
    isFetching: isFetchingIncidents,
    isError: isIncidentsError,
    refetch: refetchIncidents,
  } = useGetIncidentsQuery();

  const facilitiesFromApi: FacilityRow[] = useMemo(() => {
    return roomAssets
      .filter((a) => a.room?.id === r.id)
      .map((a) => ({
        id: a.id,
        name: a.name,
        type: mapAssetTypeToUI(a.type),
        status: mapAssetStatusToUI(a.status),
        roomName: a.room?.name ?? (name || r.room),
      }));
  }, [roomAssets, r.id, r.room, name]);

  const incidentsFromApi: IncidentRow[] = useMemo(() => {
    return incidentsApi
      .filter((i) => i.room_asset?.room?.id === r.id)
      .map((i) => ({
        id: i.id,
        facilityId: i.room_asset?.id ?? "",
        facilityName: i.room_asset?.name ?? "Thiết bị",
        description: i.description,
        happenedAt: new Date(i.createdAt).toLocaleString("vi-VN"),
        status: mapIncidentStatusToUI(i.status),
      }));
  }, [incidentsApi, r.id]);

  const currentRoomStatusChip = useMemo(
    () => (
      <Chip
        label={status}
        size="small"
        sx={{
          ...roomStatusChipSx(status),
          fontWeight: 700,
          border: "none",
          px: 0.5,
        }}
      />
    ),
    [status]
  );

  const handleCancel = () => {
    setName(r.name ?? r.room);
    setStage(Number(r.stage));
    setCapacity(r.capacity);
    setBuildingId(r.building_id ?? "");
    setType(r.type as RoomType);
    setStatus(r.status as RoomStatus);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const body: CreateRoomRequest = {
      name,
      status: mapStatusToApi(status),
      stage,
      type: mapTypeToApi(type),
      capacity,
      building_id: buildingId,
    };

    try {
      await updateRoom({ id: r.id, body }).unwrap();
      onUpdated?.();
      setIsEditing(false);
    } catch (e) {
      console.error("Update room failed:", e);
    }
  };

  // ===== Facilities table columns =====
  const facilityColumns = useMemo<MRT_ColumnDef<FacilityRow>[]>(
    () => [
      { accessorKey: "name", header: "Tên", size: 240 },
      { accessorKey: "type", header: "Loại", size: 180 },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 160,
        Cell: ({ row }) => (
          <Chip
            label={row.original.status}
            size="small"
            sx={{
              ...facilityStatusChipSx(row.original.status),
              fontWeight: 700,
              border: "none",
              px: 0.5,
            }}
          />
        ),
      },
      { accessorKey: "roomName", header: "Tên phòng", size: 160 },
      {
        id: "actions",
        header: "Thao tác",
        size: 120,
        enableSorting: false,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="">
              {/* <IconButton
                size="small"
                onClick={() => {
                  setIncidentFacilityId(row.original.id);
                  setOpenCreateIncident(true);           
                }}
                sx={{ color: "#f97316" }} // cam (warning)
              >
                <AddRoundedIcon fontSize="small" />
              </IconButton> */}
              <button
                onClick={() => {
                  setIncidentFacilityId(row.original.id);
                  setOpenCreateIncident(true);
                }}
                className="whitespace-nowrap text-[13px] font-semibold text-white bg-[#fe5c5c] px-2 rounded hover:bg-[#cd5c5c] transition"
              >
                Báo hỏng
              </button>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedAsset(row.original);
                  setOpenEditAsset(true);
                }}
                sx={{ color: "#2563eb" }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton
                size="small"
                disabled={isDeletingAsset}
                onClick={async () => {
                  const id = row.original.id;
                  try {
                    await deleteRoomAsset({ id }).unwrap();
                    refetchAssets();
                  } catch (e) {
                    console.error("Delete room asset failed:", e);
                  }
                }}
                sx={{ color: "#dc2626" }}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [deleteRoomAsset, isDeletingAsset, refetchAssets]
  );

  const facilitiesTable = useMaterialReactTable({
    columns: facilityColumns,
    data: facilitiesFromApi,
    state: {
      isLoading: isLoadingAssets || isFetchingAssets,
      showAlertBanner: isAssetsError,
    },
    muiToolbarAlertBannerProps: isAssetsError
      ? { color: "error", children: "Không tải được danh sách cơ sở vật chất" }
      : undefined,

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
        "& .MuiTableSortLabel-icon": { color: "white !important" },
        "& .MuiIconButton-root": {
          color: "white !important",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
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

    muiTopToolbarProps: { sx: { backgroundColor: "#f8f9fa" } },
    muiBottomToolbarProps: { sx: { backgroundColor: "#f8f9fa" } },

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

  const incidentColumns = useMemo<MRT_ColumnDef<IncidentRow>[]>(
    () => [
      { accessorKey: "facilityName", header: "Tên thiết bị", size: 200 },
      { accessorKey: "description", header: "Mô tả", size: 360 },
      { accessorKey: "happenedAt", header: "Thời gian xảy ra", size: 200 },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 160,
        Cell: ({ row }) => (
          <Chip
            label={row.original.status}
            size="small"
            sx={{
              ...incidentStatusChipSx(row.original.status),
              fontWeight: 700,
              border: "none",
              px: 0.5,
            }}
          />
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
                onClick={() => {
                  setSelectedIncident(row.original);
                  setOpenEditIncident(true);
                }}
                sx={{ color: "#2563eb" }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xóa">
              <IconButton
                size="small"
                disabled={isDeletingIncident}
                onClick={async () => {
                  const ok = window.confirm(
                    "Bạn có chắc chắn muốn xóa sự việc này?"
                  );
                  if (!ok) return;

                  try {
                    await deleteIncident({ id: row.original.id }).unwrap();
                    refetchIncidents();
                  } catch (e) {
                    console.error("Delete incident failed:", e);
                  }
                }}
                sx={{ color: "#dc2626" }}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  const incidentsTable = useMaterialReactTable({
    columns: incidentColumns,
    data: incidentsFromApi,
    state: {
      isLoading: isLoadingIncidents || isFetchingIncidents,
      showAlertBanner: isIncidentsError,
    },

    enableSorting: true,
    enablePagination: true,
    enableTopToolbar: false,
    enableBottomToolbar: true,

    enableColumnActions: false,
    enableGlobalFilter: true,
    enableColumnFilters: false,
    enableRowSelection: false,

    // giữ style y chang facilitiesTable
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
        "& .MuiTableSortLabel-icon": { color: "white !important" },
        "& .MuiIconButton-root": {
          color: "white !important",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
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

    muiTopToolbarProps: { sx: { backgroundColor: "#f8f9fa" } },
    muiBottomToolbarProps: { sx: { backgroundColor: "#f8f9fa" } },
    muiToolbarAlertBannerProps: isIncidentsError
      ? { color: "error", children: "Không tải được danh sách sự việc" }
      : undefined,

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
            <p className="text-sm font-semibold text-gray-700">
              Thông tin phòng
            </p>

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
                <InfoRow label="Tòa" value={buildingName} />
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
                    value={buildingId}
                    onChange={(e) => setBuildingId(String(e.target.value))}
                  >
                    {buildings.map((b) => (
                      <MenuItem key={b.id} value={b.id}>
                        {b.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  label="Tầng"
                  type="number"
                  value={Number.isFinite(stage) ? stage : ""}
                  onChange={(e) =>
                    setStage(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                  slotProps={{ input: { inputProps: { min: 0 } } }}
                  fullWidth
                />

                <FormControl size="small" fullWidth>
                  <InputLabel id="type-label">Loại</InputLabel>
                  <Select
                    labelId="type-label"
                    label="Loại"
                    value={type}
                    onChange={(e: SelectChangeEvent) =>
                      setType(e.target.value as RoomType)
                    }
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
                  value={Number.isFinite(capacity) ? capacity : ""}
                  onChange={(e) =>
                    setCapacity(
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                  slotProps={{ input: { inputProps: { min: 0 } } }}
                  fullWidth
                />

                <FormControl size="small" fullWidth>
                  <InputLabel id="status-label">Trạng thái</InputLabel>
                  <Select
                    labelId="status-label"
                    label="Trạng thái"
                    value={status}
                    onChange={(e: SelectChangeEvent) =>
                      setStatus(e.target.value as RoomStatus)
                    }
                  >
                    <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                    <MenuItem value="Hư hỏng">Hư hỏng</MenuItem>
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
          <p className="text-sm font-semibold text-gray-700">Cơ sở vật chất</p>

          <button
            type="button"
            onClick={() => setOpenCreateAsset(true)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            Thêm thiết bị
          </button>
        </div>
        <CreateRoomAssetModal
          open={openCreateAsset}
          onClose={() => setOpenCreateAsset(false)}
          roomId={r.id}
          onCreated={() => refetchAssets()}
        />
        <EditRoomAssetModal
          open={openEditAsset}
          onClose={() => setOpenEditAsset(false)}
          roomId={r.id}
          asset={selectedAsset}
          onUpdated={() => {
            setSelectedAsset(null);
            refetchAssets();
          }}
        />
        <div className="border-t border-gray-100">
          <MaterialReactTable table={facilitiesTable} />
        </div>
      </div>
      {/* ===== Sự việc ===== */}
      <div className="mt-10 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Sự việc</p>

          {/* <button
            type="button"
            onClick={() => setOpenCreateIncident(true)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            Thêm sự việc
          </button> */}
        </div>
        <CreateIncidentModal
          open={openCreateIncident}
          onClose={() => {
            setOpenCreateIncident(false);
            setIncidentFacilityId(undefined);
          }}
          facilities={facilitiesFromApi.map((f) => ({
            id: f.id,
            name: f.name,
          }))}
          defaultFacilityId={incidentFacilityId}
          onCreated={async (payload: CreateIncidentPayload) => {
            try {
              const userStr = localStorage.getItem("user");
              const user = userStr ? JSON.parse(userStr) : null;
              const createdBy = user?.id || user?.userId || "";
              console.log(
                "Creating incident with payload:",
                payload,
                "by user:",
                createdBy
              );
              console.log(
                "Mapped status to API value:",
                mapIncidentStatusToApi(payload.status)
              );

              await createIncident({
                description: payload.description,
                room_asset_id: payload.facilityId,
                created_by: createdBy,
                status: mapIncidentStatusToApi(payload.status),
              }).unwrap();

              setOpenCreateIncident(false);
              refetchIncidents();
              refetchAssets();
            } catch (e) {
              console.error("Create incident failed:", e);
            }
          }}
        />
        <EditIncidentModal
          open={openEditIncident}
          onClose={() => {
            setOpenEditIncident(false);
            setSelectedIncident(null);
          }}
          facilities={facilitiesFromApi.map((f) => ({
            id: f.id,
            name: f.name,
          }))}
          incident={
            selectedIncident
              ? {
                  id: selectedIncident.id,
                  facilityId: selectedIncident.facilityId,
                  description: selectedIncident.description,
                  status: selectedIncident.status,
                }
              : null
          }
          onUpdated={async (payload: EditIncidentPayload) => {
            try {
              const userStr = localStorage.getItem("user");
              const user = userStr ? JSON.parse(userStr) : null;
              const createdBy = user?.id || user?.userId || "";

              await updateIncident({
                id: payload.id,
                body: {
                  description: payload.description,
                  room_asset_id: payload.facilityId,
                  created_by: createdBy,
                  status: mapIncidentStatusToApi(payload.status), // pending/resolved
                },
              }).unwrap();

              setOpenEditIncident(false);
              setSelectedIncident(null);
              refetchIncidents();
            } catch (e) {
              console.error("Update incident failed:", e);
            }
          }}
        />
        <div className="border-t border-gray-100">
          <MaterialReactTable table={incidentsTable} />
        </div>
      </div>
    </div>
  );
}
