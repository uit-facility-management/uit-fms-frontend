"use client";

import { useMemo } from "react";
import { Tooltip } from "@mui/material";

type Schedule = {
  id: string;
  start_time: string;
  end_time: string;
  period_start: number;
  period_end: number;
  status: "approved" | "pending" | "rejected";
};

type Props = {
  period: number;
  date: Date;
  schedules: Schedule[];
  isToday: boolean;
};

const statusColors = {
  approved: {
    bg: "#d4edda",
    border: "#c3e6cb",
    text: "#155724",
  },
  pending: {
    bg: "#fff3cd",
    border: "#ffeaa7",
    text: "#856404",
  },
  rejected: {
    bg: "#f8d7da",
    border: "#f5c6cb",
    text: "#721c24",
  },
};

const statusLabels = {
  approved: "Đã duyệt",
  pending: "Chờ duyệt",
  rejected: "Từ chối",
};

export default function ScheduleCell({ period, schedules, isToday }: Props) {
  // Find the schedule that starts at this period
  const primarySchedule = useMemo(() => {
    return schedules.find((s) => s.period_start === period);
  }, [schedules, period]);

  // Check if this cell is covered by a schedule starting in a previous period
  const isContinuation = useMemo(() => {
    return schedules.some(
      (s) => s.period_start < period && s.period_end >= period
    );
  }, [schedules, period]);

  // If continuation cell (covered by previous span), don't render
  if (isContinuation && !primarySchedule) {
    return null;
  }

  // Empty cell
  if (!primarySchedule) {
    return (
      <div
        className={`border-r last:border-r-0 border-b border-gray-200 p-2 min-h-[60px] hover:bg-gray-50 transition cursor-pointer ${
          isToday ? "bg-blue-50/30" : "bg-white"
        }`}
      >
        <div className="text-[11px] text-gray-300 text-center">—</div>
      </div>
    );
  }

  // Schedule cell with span
  const periodSpan =
    primarySchedule.period_end - primarySchedule.period_start + 1;
  const colors = statusColors[primarySchedule.status];

  const tooltipContent = (
    <div className="text-xs">
      <p className="font-semibold mb-1">Chi tiết lịch</p>
      <p>
        <strong>Tiết:</strong> {primarySchedule.period_start} -{" "}
        {primarySchedule.period_end}
      </p>
      <p>
        <strong>Trạng thái:</strong> {statusLabels[primarySchedule.status]}
      </p>
      <p className="text-[11px] text-gray-400 mt-1">
        {new Date(primarySchedule.start_time).toLocaleDateString("vi-VN")} -{" "}
        {new Date(primarySchedule.end_time).toLocaleDateString("vi-VN")}
      </p>
    </div>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <div
        className="border-r last:border-r-0 border-b border-gray-200 p-2 cursor-pointer hover:opacity-90 transition"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
          gridRow: `span ${periodSpan}`,
          minHeight: `${60 * periodSpan}px`,
        }}
      >
        <div className="flex flex-col h-full">
          <div
            className="text-[11px] font-semibold mb-1"
            style={{ color: colors.text }}
          >
            Tiết {primarySchedule.period_start}
            {periodSpan > 1 && ` - ${primarySchedule.period_end}`}
          </div>

          <div
            className="text-[10px] font-medium px-1.5 py-0.5 rounded inline-block self-start"
            style={{
              backgroundColor: colors.text,
              color: "white",
            }}
          >
            {statusLabels[primarySchedule.status]}
          </div>

          {periodSpan >= 3 && (
            <div className="text-[10px] text-gray-500 mt-auto">
              {new Date(primarySchedule.start_time).toLocaleDateString(
                "vi-VN",
                {
                  day: "2-digit",
                  month: "2-digit",
                }
              )}{" "}
              -{" "}
              {new Date(primarySchedule.end_time).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );
}
