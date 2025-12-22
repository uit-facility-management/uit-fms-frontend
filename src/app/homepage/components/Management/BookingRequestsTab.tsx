import { Check, X } from "lucide-react";

type BookingStatus = "pending" | "approved" | "rejected";

interface BookingRequest {
  id: string;
  start_time: string;
  end_time: string;
  period_start: number;
  period_end: number;
  status: BookingStatus;
  room: {
    id: string;
    name: string;
    status: string;
    stage: number;
    type: string;
    capacity: number;
  };
  createdBy: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
  };
}

export default function BookingRequestsTab() {
  const bookingRequests: BookingRequest[] = [
    {
      id: "3e7de074-2ebf-4bb6-85b8-0832a6d2fdc9",
      start_time: "2024-07-01T10:00:00.000Z",
      end_time: "2024-07-01T12:00:00.000Z",
      period_start: 1,
      period_end: 1,
      status: "approved",
      room: {
        id: "fa819163-964a-4a63-9fd3-8814c86631e1",
        name: "Conference Room ABC",
        status: "active",
        stage: 3,
        type: "meeting",
        capacity: 10,
      },
      createdBy: {
        id: "6616d07f-c900-4b23-8e81-a06a97951a40",
        email: "22520716@gm.uit.edu.vn",
        username: "kietlac",
        fullName: "Hoàng Thế Kiệt",
        role: "admin",
      },
    },
    {
      id: "bdcb45b7-2d72-40c8-af00-e1a6cbe923f6",
      start_time: "2024-07-01T10:00:00.000Z",
      end_time: "2024-07-01T12:00:00.000Z",
      period_start: 1,
      period_end: 1,
      status: "pending",
      room: {
        id: "fa819163-964a-4a63-9fd3-8814c86631e1",
        name: "Conference Room ABC",
        status: "active",
        stage: 3,
        type: "meeting",
        capacity: 10,
      },
      createdBy: {
        id: "3f792df0-9249-43e5-89bf-f338e78b662f",
        email: "khoadaubuu@gmail.com",
        username: "JohnDoe",
        fullName: "John Doe",
        role: "admin",
      },
    },
    {
      id: "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
      start_time: "2024-07-02T14:00:00.000Z",
      end_time: "2024-07-02T16:00:00.000Z",
      period_start: 3,
      period_end: 4,
      status: "pending",
      room: {
        id: "room-002",
        name: "Phòng A101",
        status: "active",
        stage: 2,
        type: "classroom",
        capacity: 30,
      },
      createdBy: {
        id: "user-003",
        email: "nguyenvana@example.com",
        username: "nguyenvana",
        fullName: "Nguyễn Văn A",
        role: "user",
      },
    },
    {
      id: "q1r2s3t4-5u6v-7w8x-9y0z-a1b2c3d4e5f6",
      start_time: "2024-07-03T08:00:00.000Z",
      end_time: "2024-07-03T10:00:00.000Z",
      period_start: 1,
      period_end: 2,
      status: "rejected",
      room: {
        id: "room-003",
        name: "Phòng B202",
        status: "active",
        stage: 1,
        type: "lab",
        capacity: 25,
      },
      createdBy: {
        id: "user-004",
        email: "tranthib@example.com",
        username: "tranthib",
        fullName: "Trần Thị B",
        role: "user",
      },
    },
    {
      id: "q1r2s3t4-5u6v-7w8x-9y0z-a1b2c3d4e5f3",
      start_time: "2024-07-03T08:00:00.000Z",
      end_time: "2024-07-03T10:00:00.000Z",
      period_start: 1,
      period_end: 2,
      status: "rejected",
      room: {
        id: "room-003",
        name: "Phòng B202",
        status: "active",
        stage: 1,
        type: "lab",
        capacity: 25,
      },
      createdBy: {
        id: "user-004",
        email: "tranthib@example.com",
        username: "tranthib",
        fullName: "Trần Thị B",
        role: "user",
      },
    },
    {
      id: "q1r2s3t4-5u6v-7w8x-9y4z-a1b2c3d4e5f6",
      start_time: "2024-07-03T08:00:00.000Z",
      end_time: "2024-07-03T10:00:00.000Z",
      period_start: 1,
      period_end: 2,
      status: "rejected",
      room: {
        id: "room-003",
        name: "Phòng B202",
        status: "active",
        stage: 1,
        type: "lab",
        capacity: 25,
      },
      createdBy: {
        id: "user-004",
        email: "tranthib@example.com",
        username: "tranthib",
        fullName: "Trần Thị B",
        role: "user",
      },
    },
  ];

  const handleApprove = (id: string) => {
    console.log("Chấp nhận yêu cầu:", id);
  };

  const handleReject = (id: string) => {
    console.log("Từ chối yêu cầu:", id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Từ chối",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

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
              <td className="py-4 px-4 text-gray-700">
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
                      className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                      title="Chấp nhận"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
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
