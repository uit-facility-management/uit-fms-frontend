"use client";
import { useState } from "react";
import {
  DoorOpen,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { selectCurrentUser } from "@/feature/auth/auth.slice";
import { useSelector } from "react-redux";

type DashboardTab = "requests" | "tools";
type RequestStatus = "Chờ duyệt" | "Chấp nhận" | "Từ chối";

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("requests");
  const user = useSelector(selectCurrentUser);
  console.log("Current User:", user);
  // Mock data for booking requests
  const requestsData = [
    {
      id: 1,
      room: "A101",
      time: "08:00 - 10:00",
      date: "15/12/2024",
      user: "Nguyễn Văn A",
      purpose: "Họp nhóm",
      status: "Chờ duyệt" as RequestStatus,
    },
    {
      id: 2,
      room: "B202",
      time: "10:00 - 12:00",
      date: "15/12/2024",
      user: "Trần Thị B",
      purpose: "Thuyết trình",
      status: "Chờ duyệt" as RequestStatus,
    },
    {
      id: 3,
      room: "C301",
      time: "13:00 - 15:00",
      date: "16/12/2024",
      user: "Lê Văn C",
      purpose: "Học tập",
      status: "Chấp nhận" as RequestStatus,
    },
    {
      id: 4,
      room: "D101",
      time: "15:00 - 17:00",
      date: "16/12/2024",
      user: "Phạm Thị D",
      purpose: "Workshop",
      status: "Từ chối" as RequestStatus,
    },
    {
      id: 5,
      room: "A102",
      time: "07:00 - 09:00",
      date: "17/12/2024",
      user: "Hoàng Văn E",
      purpose: "Seminar",
      status: "Chờ duyệt" as RequestStatus,
    },
  ];

  // Mock data for tools table
  const toolsData = [
    {
      id: 1,
      tool: "Máy chiếu",
      quantity: 15,
      available: 8,
      borrowed: 7,
      status: "Chưa sử dụng",
    },
    {
      id: 2,
      tool: "Micro",
      quantity: 25,
      available: 20,
      borrowed: 5,
      status: "Chưa sử dụng",
    },
    {
      id: 3,
      tool: "Bảng viết",
      quantity: 10,
      available: 3,
      borrowed: 7,
      status: "Ít",
    },
    {
      id: 4,
      tool: "Laptop",
      quantity: 20,
      available: 15,
      borrowed: 5,
      status: "Chưa sử dụng",
    },
    {
      id: 5,
      tool: "Chuột",
      quantity: 30,
      available: 25,
      borrowed: 5,
      status: "Chưa sử dụng",
    },
  ];

  const handleApprove = (id: number) => {
    console.log("Chấp nhận yêu cầu:", id);
  };

  const handleReject = (id: number) => {
    console.log("Từ chối yêu cầu:", id);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số phòng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">48</p>
              <p className="text-xs text-gray-500 mt-1">Toàn bộ cơ sở</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <DoorOpen className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                93.75% Chưa sử dụng
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Cơ sở vật chất
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
              <p className="text-xs text-gray-500 mt-1">Tổng thiết bị</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Wrench className="w-7 h-7 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cần bảo trì</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />3 phòng + 5 thiết bị
              </p>
            </div>
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Header */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "requests"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Yêu cầu đặt phòng
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "tools"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Dụng cụ đang mượn
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6">
          {activeTab === "requests" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Phòng
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Ngày
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Thời gian
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Người đặt
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Mục đích
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
                  {requestsData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {item.room}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{item.date}</td>
                      <td className="py-4 px-4 text-gray-700">{item.time}</td>
                      <td className="py-4 px-4 text-gray-700">{item.user}</td>
                      <td className="py-4 px-4 text-gray-700">
                        {item.purpose}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Chờ duyệt"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : item.status === "Chấp nhận"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {item.status === "Chờ duyệt" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                              title="Chấp nhận"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Đã xử lý
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Dụng cụ
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Tổng số
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Chưa sử dụng
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Đang mượn
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {toolsData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {item.tool}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {item.available}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {item.borrowed}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Chưa sử dụng"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
