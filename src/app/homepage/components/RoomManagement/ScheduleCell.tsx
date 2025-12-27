"use client";
import { useMemo } from "react";
import { Tooltip } from "@mui/material";
import { Schedule } from "@/feature/ScheduleApi/type";

type Props = {
  period: number;
  date: Date;
  schedules: Schedule[];
  isToday: boolean;
};

export default function ScheduleCell({ period, schedules, isToday }: Props) {
  const primarySchedule = useMemo(() => {
    return schedules.find((s) => s.period_start === period);
  }, [schedules, period]);

  const isContinuation = useMemo(() => {
    return schedules.some(
      (s) => s.period_start < period && s.period_end >= period
    );
  }, [schedules, period]);

  if (isContinuation && !primarySchedule) {
    return null;
  }

  // Empty cell
  if (!primarySchedule) {
    return (
      <div
        className={`border-r border-b border-gray-100 p-3 min-h-[60px] hover:bg-gray-50 transition-all cursor-pointer ${
          isToday ? "bg-blue-50/40" : ""
        }`}
      />
    );
  }

  const periodSpan =
    primarySchedule.period_end - primarySchedule.period_start + 1;

  const tooltipContent = (
    <div className="py-1">
      <div className="font-semibold text-sm mb-2">Chi tiết đặt phòng</div>
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-300">Tiết:</span>
          <span className="text-white font-medium">
            {primarySchedule.period_start} - {primarySchedule.period_end}
          </span>
        </div>
        {primarySchedule.createdBy && (
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Người đặt:</span>
            <span className="text-white">
              {primarySchedule.createdBy.fullName}
            </span>
          </div>
        )}
        <div className="text-xs text-gray-400 pt-2 mt-2 border-t border-gray-700">
          {new Date(primarySchedule.start_time).toLocaleDateString("vi-VN")} -{" "}
          {new Date(primarySchedule.end_time).toLocaleDateString("vi-VN")}
        </div>
      </div>
    </div>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <div
        className="border-r border-b border-gray-200 p-3 cursor-pointer transition-all hover:shadow-lg hover:border-blue-300 relative group bg-white"
        style={{
          gridRow: `span ${periodSpan}`,
          minHeight: `${60 * periodSpan}px`,
        }}
      >
        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 group-hover:w-1.5 transition-all"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col gap-2.5 pl-2">
          {/* Period badge */}
          <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md">
            <svg
              className="w-3.5 h-3.5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-semibold text-blue-700">
              Tiết {primarySchedule.period_start}
              {periodSpan > 1 && `-${primarySchedule.period_end}`}
            </span>
          </div>

          {/* User info */}
          {primarySchedule.createdBy && (
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                {primarySchedule.createdBy.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {primarySchedule.createdBy.fullName}
                </p>
              </div>
            </div>
          )}

          {/* Date range for longer spans */}
          {periodSpan >= 3 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-auto">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {new Date(primarySchedule.start_time).toLocaleDateString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                  }
                )}
                {" - "}
                {new Date(primarySchedule.end_time).toLocaleDateString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                  }
                )}
              </span>
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 transition-all pointer-events-none"></div>
      </div>
    </Tooltip>
  );
}
