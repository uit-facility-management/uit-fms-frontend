"use client";

import { useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ScheduleCell from "./ScheduleCell";

type Props = {
  roomId: string;
};

// Mock type
type Schedule = {
  id: string;
  start_time: string; // ISO date string
  end_time: string; // ISO date string
  period_start: number; // 1-12
  period_end: number; // 1-12
  status: "approved" | "pending" | "rejected";
};

// Mock data
const MOCK_SCHEDULES: Schedule[] = [
  {
    id: "1",
    start_time: "2025-12-23T00:00:00.000Z",
    end_time: "2025-12-23T00:00:00.000Z",
    period_start: 1,
    period_end: 3, // Lịch này sẽ hiện ở tiết 1, 2 và 3
    status: "approved",
  },
  {
    id: "2",
    start_time: "2025-12-24T00:00:00.000Z",
    end_time: "2025-12-26T00:00:00.000Z",
    period_start: 7,
    period_end: 9,
    status: "approved",
  },
  {
    id: "3",
    start_time: "2025-12-25T00:00:00.000Z",
    end_time: "2025-12-25T00:00:00.000Z",
    period_start: 4,
    period_end: 6,
    status: "pending",
  },
];

const PERIODS = Array.from({ length: 12 }, (_, i) => i + 1);
const WEEKDAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

// --- HELPER FUNCTIONS ---

// Lấy ngày thứ 2 đầu tuần
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Tạo Key chuẩn YYYY-MM-DD (Local Time) để tránh lỗi Timezone
function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function formatDateRange(start: Date, end: Date): string {
  return `${start.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} - ${end.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function parseSchedulesForWeek(
  schedules: Schedule[],
  weekStart: Date
): Map<string, Schedule[]> {
  const result = new Map<string, Schedule[]>();

  // Tạo mảng 7 ngày
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    weekDays.push(day);
  }

  schedules.forEach((schedule) => {
    const scheduleStart = new Date(schedule.start_time);
    scheduleStart.setHours(0, 0, 0, 0);

    const scheduleEnd = new Date(schedule.end_time);
    scheduleEnd.setHours(23, 59, 59, 999);

    weekDays.forEach((day) => {
      const currentDayCheck = new Date(day);
      currentDayCheck.setHours(0, 0, 0, 0);
      if (currentDayCheck >= scheduleStart && currentDayCheck <= scheduleEnd) {
        const key = getDateKey(day);

        if (!result.has(key)) {
          result.set(key, []);
        }
        result.get(key)!.push(schedule);
      }
    });
  });

  return result;
}

export default function RoomScheduleView({}: Props) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getMonday(new Date())
  );

  const schedules = MOCK_SCHEDULES;

  const goToPrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const goToToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const weekEnd = useMemo(() => {
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);
    return end;
  }, [currentWeekStart]);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentWeekStart]);

  const weekScheduleMap = useMemo(() => {
    return parseSchedulesForWeek(schedules, currentWeekStart);
  }, [schedules, currentWeekStart]);

  const isCurrentWeek = useMemo(() => {
    const today = getMonday(new Date());
    return isSameDay(currentWeekStart, today);
  }, [currentWeekStart]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Lịch phòng</p>

          {/* Week Navigator */}
          <div className="flex items-center gap-3">
            <IconButton
              size="small"
              onClick={goToPrevWeek}
              sx={{
                color: "#5295f8",
                "&:hover": { backgroundColor: "#e3f2fd" },
              }}
            >
              <ArrowBackIosNewRoundedIcon fontSize="small" />
            </IconButton>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-[240px] text-center">
                {formatDateRange(currentWeekStart, weekEnd)}
              </span>

              {!isCurrentWeek && (
                <button
                  onClick={goToToday}
                  className="text-xs font-semibold text-[#5295f8] hover:text-[#377be1] transition px-2 py-1 rounded hover:bg-blue-50"
                >
                  Hôm nay
                </button>
              )}
            </div>

            <IconButton
              size="small"
              onClick={goToNextWeek}
              sx={{
                color: "#5295f8",
                "&:hover": { backgroundColor: "#e3f2fd" },
              }}
            >
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="p-5 overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Grid container */}
          <div
            className="grid grid-cols-8 gap-0 border border-gray-200 rounded-lg overflow-hidden"
            style={{ gridAutoFlow: "dense" }}
          >
            {/* Header Row - Weekdays */}
            <div className="bg-white border-r border-b border-gray-200 p-3 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">Tiết</span>
            </div>

            {weekDays.map((day, idx) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={idx}
                  className={`border-r last:border-r-0 border-b border-gray-200 p-3 text-center ${
                    isToday ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      isToday ? "text-[#5295f8]" : "text-gray-700"
                    }`}
                  >
                    {WEEKDAYS[idx]}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      isToday ? "text-[#5295f8]" : "text-gray-500"
                    }`}
                  >
                    {formatShortDate(day)}
                  </p>
                </div>
              );
            })}

            {/* Body Rows - Periods */}
            {PERIODS.map((period) => [
              // Period Label
              <div
                key={`period-label-${period}`}
                className="bg-gray-50 border-r border-b border-gray-200 p-3 flex items-center justify-center"
              >
                <span className="text-xs font-semibold text-gray-600">
                  Tiết {period}
                </span>
              </div>,

              // Cells for each day
              ...weekDays.map((day, dayIdx) => {
                const key = getDateKey(day);
                // Lấy toàn bộ lịch của ngày hôm đó
                const daySchedules = weekScheduleMap.get(key) || [];

                // LỌC: Chỉ lấy những lịch mà "Tiết hiện tại" nằm trong khoảng [start, end]
                const matchingSchedules = daySchedules.filter(
                  (s) => period >= s.period_start && period <= s.period_end
                );

                const isToday = isSameDay(day, new Date());

                return (
                  <ScheduleCell
                    key={`${period}-${dayIdx}`}
                    period={period}
                    date={day}
                    schedules={matchingSchedules}
                    isToday={isToday}
                  />
                );
              }),
            ])}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 justify-end">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#d4edda] border border-[#c3e6cb]" />
            <span className="text-xs text-gray-600">Đã duyệt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#fff3cd] border border-[#ffeaa7]" />
            <span className="text-xs text-gray-600">Chờ duyệt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#f8d7da] border border-[#f5c6cb]" />
            <span className="text-xs text-gray-600">Từ chối</span>
          </div>
        </div>
      </div>
    </div>
  );
}
