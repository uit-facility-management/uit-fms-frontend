import {
  useGetIncidentsQuery,
  useUpdateIncidentStatusMutation,
} from "@/feature/RoomAssetApi/incident.api";
import { Check } from "lucide-react";

type MaintenanceStatus = "pending" | "resolved";

export default function MaintenanceTab() {
  const { data: incidents = [], isLoading, isError } = useGetIncidentsQuery();
  const [updateIncidentStatus, { isLoading: isUpdating }] =
    useUpdateIncidentStatusMutation();
  const maintainanceData = incidents;

  const handleResolve = async (id: string) => {
    try {
      const res = await updateIncidentStatus({
        incidentId: id,
        status: "resolved",
      }).unwrap();

      console.log("Response từ backend:", res);
      console.log("Đã hoàn tất sửa chữa:", id);
    } catch (error) {
      console.error("Lỗi khi hoàn tất sửa chữa:", error);
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

  const getStatusBadge = (status: MaintenanceStatus) => {
    const styles = {
      pending: "bg-red-100 text-red-700 border-red-200",
      resolved: "bg-green-100 text-green-700 border-green-200",
    };

    const labels = {
      pending: "Chưa xử lý",
      resolved: "Đã xử lý",
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
  if (incidents.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Không có báo cáo hỏng hóc nào</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Thiết bị
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Phòng
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Người tạo
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Ngày tạo
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
          {maintainanceData.map((report) => (
            <tr
              key={report.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="font-semibold text-gray-900">
                  {report.room_asset?.name}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700">
                {report.room_asset?.room?.name}
              </td>
              <td className="py-4 px-4 text-gray-700">
                {report.created_user?.fullName}
              </td>
              <td className="py-4 px-4 text-gray-700">
                {report.createdAt && formatDate(report.createdAt)}
              </td>
              <td className="py-4 px-4">
                {report.status && getStatusBadge(report.status)}
              </td>
              <td className="py-4 px-4">
                {report.status === "pending" ? (
                  <button
                    onClick={() => handleResolve(report.id!)}
                    disabled={isUpdating}
                    className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Hoàn tất sửa chữa"
                  >
                    <Check className="w-4 h-4" />
                  </button>
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
