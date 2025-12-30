import { Check, X } from "lucide-react";
import {
  useGetSchedulesQuery,
  useUpdateScheduleStatusMutation,
} from "@/feature/ScheduleApi/schedule.api";

export default function BookingRequestsTab() {
  const { data: schedules = [], isLoading, isError } = useGetSchedulesQuery();
  const [updateScheduleStatus, { isLoading: isUpdating }] =
    useUpdateScheduleStatusMutation();

  console.log("schedules", schedules);

  // Sử dụng data từ API
  const bookingRequests = schedules;

  const handleApprove = async (id: string) => {
    try {
      await updateScheduleStatus({
        scheduleId: id,
        status: "approved",
      }).unwrap();
      console.log("Đã chấp nhận yêu cầu:", id);
    } catch (error) {
      console.error("Lỗi khi chấp nhận yêu cầu:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateScheduleStatus({
        scheduleId: id,
        status: "rejected",
      }).unwrap();
      console.log("Đã từ chối yêu cầu:", id);
    } catch (error) {
      console.error("Lỗi khi từ chối yêu cầu:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };

    const labels: Record<string, string> = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Từ chối",
    };

    return (
      <span
        className={`whitespace-nowrap inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</div>
      </div>
    );
  }

  // Empty state
  if (bookingRequests.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Không có yêu cầu đặt phòng nào</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Phòng
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Người đặt
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Ngày
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Tiết
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Trạng thái
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {bookingRequests.map((booking) => (
            <tr
              key={booking.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="font-semibold text-gray-900">
                  {booking.room.name}
                </span>
              </td>
              <td className="whitespace-nowrap py-4 px-4 text-gray-700">
                {booking.createdBy.fullName}
              </td>
              <td className="py-4 px-4 text-gray-700">
                {formatDate(booking.start_time)} -{" "}
                {formatDate(booking.end_time)}
              </td>
              <td className="py-4 px-4 text-gray-700">
                {booking.period_start} - {booking.period_end}
              </td>
              <td className="py-4 px-4">{getStatusBadge(booking.status)}</td>
              <td className="py-4 px-4">
                {booking.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(booking.id)}
                      disabled={isUpdating}
                      className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Chấp nhận"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      disabled={isUpdating}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Từ chối"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Đã xử lý</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
