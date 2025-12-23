import { Check } from "lucide-react";

type MaintenanceStatus = "pending" | "resolved";

interface MaintenanceReport {
  id: string;
  description: string;
  room_asset_id: string;
  created_by: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
  room_asset: {
    id: string;
    name: string;
    type: string;
    status: string;
    room: {
      id: string;
      name: string;
      status: string;
      stage: number;
      type: string;
      capacity: number;
    };
  };
  created_user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
  };
}

export default function MaintenanceTab() {
  const maintenanceReports: MaintenanceReport[] = [
    {
      id: "1c530b89-60de-4c9b-b377-7a5ce8f5c952",
      description: "Hỏng cánh",
      room_asset_id: "efc47c88-a70e-4e90-bf59-b9143e8ac953",
      created_by: "ebae473a-1a93-4969-b481-533f267db64b",
      status: "pending",
      createdAt: "2025-12-20T06:59:04.956Z",
      updatedAt: "2025-12-20T06:59:04.956Z",
      room_asset: {
        id: "efc47c88-a70e-4e90-bf59-b9143e8ac953",
        name: "Quạt",
        type: "Stationery",
        status: "INACTIVE",
        room: {
          id: "fa819163-964a-4a63-9fd3-8814c86631e1",
          name: "Conference Room ABC",
          status: "active",
          stage: 3,
          type: "meeting",
          capacity: 10,
        },
      },
      created_user: {
        id: "ebae473a-1a93-4969-b481-533f267db64b",
        email: "22520604@gm.uit.edu.vn",
        username: "khi",
        fullName: "Nguyễn Quang Khải",
        role: "admin",
      },
    },
    {
      id: "2d641c9a-71ef-5dac-c488-8b6df9g6d063",
      description: "Màn hình bị vỡ góc dưới bên phải",
      room_asset_id: "asset-002",
      created_by: "user-002",
      status: "pending",
      createdAt: "2025-12-21T10:30:15.441Z",
      updatedAt: "2025-12-21T10:30:15.441Z",
      room_asset: {
        id: "asset-002",
        name: "Máy chiếu",
        type: "Electronics",
        status: "INACTIVE",
        room: {
          id: "room-002",
          name: "Phòng A101",
          status: "active",
          stage: 2,
          type: "classroom",
          capacity: 30,
        },
      },
      created_user: {
        id: "user-002",
        email: "nguyenvana@example.com",
        username: "nguyenvana",
        fullName: "Nguyễn Văn A",
        role: "user",
      },
    },
    {
      id: "3e752d0b-82fg-6ebd-d599-9c7eg0h7e174",
      description: "Không kết nối được với máy tính",
      room_asset_id: "asset-003",
      created_by: "user-003",
      status: "resolved",
      createdAt: "2025-12-19T14:20:30.331Z",
      updatedAt: "2025-12-20T09:15:20.551Z",
      room_asset: {
        id: "asset-003",
        name: "Bàn phím",
        type: "Electronics",
        status: "ACTIVE",
        room: {
          id: "room-003",
          name: "Phòng B202",
          status: "active",
          stage: 1,
          type: "lab",
          capacity: 25,
        },
      },
      created_user: {
        id: "user-003",
        email: "tranthib@example.com",
        username: "tranthib",
        fullName: "Trần Thị B",
        role: "user",
      },
    },
  ];

  const handleResolve = (id: string) => {
    console.log("Xác nhận hoàn tất sửa chữa:", id);
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
          {maintenanceReports.map((report) => (
            <tr
              key={report.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="font-semibold text-gray-900">
                  {report.room_asset.name}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700">
                {report.room_asset.room.name}
              </td>
              <td className="py-4 px-4 text-gray-700">
                {report.created_user.fullName}
              </td>
              <td className="py-4 px-4 text-gray-700">
                {formatDate(report.createdAt)}
              </td>
              <td className="py-4 px-4">{getStatusBadge(report.status)}</td>
              <td className="py-4 px-4">
                {report.status === "pending" ? (
                  <button
                    onClick={() => handleResolve(report.id)}
                    className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
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