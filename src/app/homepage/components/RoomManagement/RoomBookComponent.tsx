/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Chip } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Search as SearchIcon, FilterAlt as FilterIcon } from "@mui/icons-material";
import {
  useGetFreeRoomsQuery,
  useCreateScheduleMutation,
} from "@/feature/RoomApi/booking.api";
import type {
  GetFreeRoomsParams,
  RoomResponse,
  CreateScheduleRequest,
} from "@/feature/RoomApi/type";
import Swal from "sweetalert2";

type RoomType = "Phòng học" | "Thực hành" | "Hội trường";
type RoomStatus = "Hoạt động" | "Hư hỏng" | "Bảo trì";

export type RoomRow = {
  id: string;
  room: string;
  building: string;
  stage: number;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
};

type Props = {
  onBack: () => void;
};

// ✅ Danh sách ngày trong tuần theo enum của BE
const DAYS_OF_WEEK = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 7, label: "Chủ nhật" },
];

const statusChipSx = (s: RoomStatus) => {
  switch (s) {
    case "Hoạt động":
      return { backgroundColor: "#ECFDF3", color: "#027A48", border: "none" };
    case "Hư hỏng":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C", border: "none" };
    case "Bảo trì":
      return { backgroundColor: "#FFF7ED", color: "#B45309", border: "none" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#4B5563", border: "none" };
  }
};

export default function RoomBookComponent({ onBack }: Props) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [queryParams, setQueryParams] = useState<GetFreeRoomsParams | null>(null);
  const [createSchedule, { isLoading: isBooking }] = useCreateScheduleMutation();
  const [startPeriod, setStartPeriod] = useState<string>("");
  const [endPeriod, setEndPeriod] = useState<string>("");
  const [dayOfWeek, setDayOfWeek] = useState<string>(""); // ✅ State cho ngày trong tuần

  const [optimisticHiddenIds, setOptimisticHiddenIds] = useState<Set<string>>(
    () => new Set()
  );

  const toIsoStartOfDay = (dateStr: string) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
    return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
  };

  const toIsoEndOfDay = (dateStr: string) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d, 23, 59, 59, 999);
    return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
  };

  const [periodError, setPeriodError] = useState<string>("");

  const validatePeriods = (sp: string, ep: string) => {
    if (!sp || !ep) {
      setPeriodError("");
      return true;
    }
    const a = Number(sp);
    const b = Number(ep);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      setPeriodError("Tiết không hợp lệ.");
      return false;
    }
    if (a >= b) {
      setPeriodError("Tiết bắt đầu phải nhỏ hơn tiết kết thúc.");
      return false;
    }
    setPeriodError("");
    return true;
  };

  const {
    data: freeRoomsApi = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetFreeRoomsQuery(queryParams as GetFreeRoomsParams, {
    skip: !queryParams,
  });

  const mapTypeToUI = (t: RoomResponse["type"]): RoomType => {
    switch (t) {
      case "classroom":
        return "Phòng học";
      case "lab":
        return "Thực hành";
      case "meeting":
        return "Hội trường";
      default:
        return "Phòng học";
    }
  };

  const mapStatusToUI = (s: RoomResponse["status"]): RoomStatus => {
    switch (s) {
      case "active":
        return "Hoạt động";
      case "maintenance":
        return "Bảo trì";
      case "inactive":
      default:
        return "Hư hỏng";
    }
  };

  const roomsFromApi: RoomRow[] = useMemo(() => {
    return freeRoomsApi.map((r) => ({
      id: r.id,
      room: r.name,
      building: r.building?.name ?? "",
      stage: r.stage,
      type: mapTypeToUI(r.type),
      capacity: r.capacity,
      status: mapStatusToUI(r.status),
    }));
  }, [freeRoomsApi]);

  // Search + filter (giống style RoomComponent)
  const [searchText, setSearchText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterBuilding, setFilterBuilding] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterStage, setFilterStage] = useState<string>("");
  const [filterCapacity, setFilterCapacity] = useState<string>("");

  const [hasSearched, setHasSearched] = useState(false);

  const filteredData = useMemo(() => {
    if (!hasSearched) return [];

    let rows = roomsFromApi.filter((r) => !optimisticHiddenIds.has(r.id));

    const q = searchText.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.room.toLowerCase().includes(q) ||
          r.building.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }

    if (filterBuilding) rows = rows.filter((r) => r.building === filterBuilding);
    if (filterType) rows = rows.filter((r) => r.type === (filterType as RoomType));
    if (filterStatus)
      rows = rows.filter((r) => r.status === (filterStatus as RoomStatus));
    if (filterStage) rows = rows.filter((r) => String(r.stage) === String(filterStage));
    if (filterCapacity) {
      const cap = Number(filterCapacity);
      if (!Number.isNaN(cap)) rows = rows.filter((r) => r.capacity >= cap);
    }

    return rows;
  }, [
    roomsFromApi,
    optimisticHiddenIds,
    hasSearched,
    searchText,
    filterBuilding,
    filterType,
    filterStatus,
    filterStage,
    filterCapacity,
  ]);

  const handleBookRoom = async (room: RoomRow) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const createdBy = user?.id || user?.userId || "";

      const startIso = toIsoStartOfDay(startDate);
      const endIso = toIsoEndOfDay(endDate);

      if (!startIso || !endIso) {
        await Swal.fire({
          icon: "warning",
          title: "Ngày không hợp lệ",
          text: "Vui lòng chọn Ngày bắt đầu / Ngày kết thúc hợp lệ.",
          confirmButtonText: "OK",
        });
        return;
      }

      if (!createdBy) {
        await Swal.fire({
          icon: "warning",
          title: "Bạn chưa đăng nhập",
          text: "Vui lòng đăng nhập để đặt phòng.",
          confirmButtonText: "OK",
        });
        return;
      }

      Swal.fire({
        title: "Đang đặt phòng...",
        text: `Phòng ${room.room}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload: CreateScheduleRequest = {
        room_id: room.id,
        created_by: createdBy,
        start_time: startIso,
        end_time: endIso,
        period_start: Number(startPeriod),
        period_end: Number(endPeriod),
        day_of_week: dayOfWeek ? Number(dayOfWeek) : undefined,
        status: "pending",
      };

      const result = await createSchedule(payload).unwrap();
      console.log("Đặt phòng thành công:", result);
      Swal.close();

      setOptimisticHiddenIds((prev) => {
        const next = new Set(prev);
        next.add(room.id);
        return next;
      });

      if (queryParams) refetch();

      await Swal.fire({
        icon: "success",
        title: "Đặt phòng thành công",
        text: `Phòng ${room.room} đã được đặt.`,
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err: any) {
      // đảm bảo đóng loading nếu có lỗi
      Swal.close();

      const msg =
        err?.data?.message || err?.error || "Đặt phòng thất bại. Vui lòng thử lại!";

      await Swal.fire({
        icon: "error",
        title: "Đặt phòng thất bại ❌",
        text: msg,
        confirmButtonText: "OK",
      });
    } finally {
      // ✅ chắc chắn không kẹt overlay
      Swal.close();
    }
  };

  const columns = useMemo<MRT_ColumnDef<RoomRow>[]>(
    () => [
      {
        accessorKey: "room",
        header: "Phòng",
        size: 110,
        Cell: ({ cell }) => (
          <span className="font-bold text-gray-900 text-base">
            {cell.getValue<string>()}
          </span>
        ),
      },
      { accessorKey: "building", header: "Tòa", size: 90 },
      { accessorKey: "stage", header: "Tầng", size: 80 },
      { accessorKey: "type", header: "Loại", size: 140 },
      {
        accessorKey: "capacity",
        header: "Sức chứa",
        size: 120,
        Cell: ({ cell }) => (
          <span className="text-gray-700">{cell.getValue<number>()} người</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 150,
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
                        s === "Hoạt động"
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
        size: 120,
        enableSorting: false,
        Cell: ({ row }) => (
          <button
            type="button"
            disabled={isBooking}
            onClick={() => handleBookRoom(row.original)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition
              ${
                isBooking
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#347aea] hover:bg-[#0e4fc8]"
              }
            `}
          >
            {isBooking ? "Đang đặt..." : "Đặt phòng"}
          </button>
        ),
      },
    ],
    [isBooking, startDate, endDate, startPeriod, endPeriod, dayOfWeek, queryParams]
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableSorting: true,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableRowSelection: false,
    enablePagination: true,
    enableColumnFilters: true,
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
  });

  const canSearch = useMemo(() => {
    return (
      startDate.trim() !== "" &&
      endDate.trim() !== "" &&
      startPeriod.trim() !== "" &&
      endPeriod.trim() !== "" &&
      periodError === ""
    );
  }, [startDate, endDate, startPeriod, endPeriod, periodError]);

  const handleSearch = () => {
    const ok = validatePeriods(startPeriod, endPeriod);
    if (!ok) return;

    const startIso = toIsoStartOfDay(startDate);
    const endIso = toIsoEndOfDay(endDate);

    if (!startIso || !endIso) {
      Swal.fire({
        icon: "warning",
        title: "Ngày không hợp lệ",
        text: "Vui lòng chọn Ngày bắt đầu / Ngày kết thúc hợp lệ.",
        confirmButtonText: "OK",
      });
      return;
    }

    // mỗi lần search mới thì reset optimistic hide
    setOptimisticHiddenIds(new Set());
    setHasSearched(true);

    setQueryParams({
      start_time: startIso,
      end_time: endIso,
      period_start: Number(startPeriod),
      period_end: Number(endPeriod),
      day_of_week: dayOfWeek ? Number(dayOfWeek) : undefined, // ✅ Thêm day_of_week vào query
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            Đặt phòng
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

      {/* Form theo sketch */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <p className="w-28 text-sm font-semibold text-gray-700">Ngày bắt đầu</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <p className="w-28 text-sm font-semibold text-gray-700">Ngày kết thúc</p>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <p className="w-28 text-sm font-semibold text-gray-700">Tiết bắt đầu</p>
            <input
              type="number"
              min={1}
              value={startPeriod}
              onChange={(e) => {
                const v = e.target.value;
                setStartPeriod(v);
                validatePeriods(v, endPeriod);
              }}
              placeholder="VD: 1"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none placeholder:opacity-60"
            />
          </div>

          <div className="flex items-center gap-3">
            <p className="w-28 text-sm font-semibold text-gray-700">Tiết kết thúc</p>
            <input
              type="number"
              min={1}
              value={endPeriod}
              onChange={(e) => {
                const v = e.target.value;
                setEndPeriod(v);
                validatePeriods(startPeriod, v);
              }}
              placeholder="VD: 3"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none placeholder:opacity-60"
            />
          </div>

          {/* ✅ Thêm dropdown chọn ngày trong tuần */}
          <div className="flex items-center gap-3 md:col-span-2">
            <p className="w-28 text-sm font-semibold text-gray-700">Ngày trong tuần</p>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
            >
              <option value="">Tất cả (không chọn)</option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {periodError && <p className="mt-2 text-sm text-red-600">{periodError}</p>}

        <div className="mt-4">
          <button
            type="button"
            onClick={handleSearch}
            disabled={!canSearch}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-sm
              ${canSearch ? "bg-[#2b72e3] hover:bg-[#1259dc]" : "bg-[#9bb7e6] cursor-not-allowed"}
            `}
          >
            Tìm phòng
          </button>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 w-full max-w-md bg-white border border-gray-200 rounded-lg px-3 py-2">
          <SearchIcon sx={{ fontSize: 20, color: "#6B7280" }} />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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

      {/* Filter panel (UI-only) */}
      {isFilterOpen && (
        <div className="mb-4 bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Tòa</p>
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
              <p className="text-xs font-semibold text-gray-600 mb-1">Loại</p>
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
              <p className="text-xs font-semibold text-gray-600 mb-1">Trạng thái</p>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
              >
                <option value="">Tất cả</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Hư hỏng">Hư hỏng</option>
                <option value="Bảo trì">Bảo trì</option>
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Tầng</p>
              <input
                type="number"
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                placeholder="VD: 1"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:opacity-70 outline-none"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Sức chứa ({">"}=)</p>
              <input
                type="number"
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
                placeholder="VD: 40"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:opacity-70 outline-none"
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
                setFilterStage("");
                setFilterCapacity("");
              }}
              className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              Xóa lọc
            </button>

            <button
              type="button"
              onClick={() => console.log("APPLY FILTER (UI only)")}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#0B4DBA] hover:bg-[#0940A3] transition"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}

      {/* Table result */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!hasSearched ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">
              Nhập thông tin và bấm <b>Tìm phòng</b> để xem danh sách phù hợp.
            </p>
          </div>
        ) : isLoading || isFetching ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <p className="text-red-600 font-semibold">
                Không tải được danh sách phòng trống
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#2b72e3] hover:bg-[#1259dc] transition"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : (
          <MaterialReactTable table={table} />
        )}
      </div>
    </div>
  );
}