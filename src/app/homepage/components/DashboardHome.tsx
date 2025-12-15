"use client";
import { useState } from "react";
import { DoorOpen, Calendar, Wrench, TrendingUp, Clock } from "lucide-react";

type DashboardTab = "booking" | "tools";

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("booking");

  // Mock data for booking table
  const bookingData = [
    { id: 1, room: "A101", time: "08:00 - 10:00", user: "Nguyễn Văn A", status: "Đang diễn ra" },
    { id: 2, room: "B202", time: "10:00 - 12:00", user: "Trần Thị B", status: "Sắp tới" },
    { id: 3, room: "C301", time: "13:00 - 15:00", user: "Lê Văn C", status: "Sắp tới" },
    { id: 4, room: "D101", time: "15:00 - 17:00", user: "Phạm Thị D", status: "Sắp tới" },
    { id: 5, room: "A102", time: "07:00 - 09:00", user: "Hoàng Văn E", status: "Đã kết thúc" },
  ];

  // Mock data for tools table
  const toolsData = [
    { id: 1, tool: "Máy chiếu", quantity: 15, available: 8, borrowed: 7, status: "Khả dụng" },
    { id: 2, tool: "Micro", quantity: 25, available: 20, borrowed: 5, status: "Khả dụng" },
    { id: 3, tool: "Bảng viết", quantity: 10, available: 3, borrowed: 7, status: "Ít" },
    { id: 4, tool: "Laptop", quantity: 20, available: 15, borrowed: 5, status: "Khả dụng" },
    { id: 5, tool: "Chuột", quantity: 30, available: 25, borrowed: 5, status: "Khả dụng" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đặt phòng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">124</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% so với tuần trước
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Phòng đang dùng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">32</p>
              <p className="text-xs text-gray-500 mt-1">
                / 48 phòng
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <DoorOpen className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dụng cụ đang mượn</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
              <p className="text-xs text-gray-500 mt-1">
                / 156 dụng cụ
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Wrench className="w-7 h-7 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trung bình / ngày</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
              <p className="text-xs text-gray-500 mt-1">
                lượt đặt phòng
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-purple-600" />
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
              onClick={() => setActiveTab("booking")}
              className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "booking"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Đặt phòng hôm nay
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
          {activeTab === "booking" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Phòng</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Thời gian</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Người đặt</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{item.room}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{item.time}</td>
                      <td className="py-4 px-4 text-gray-700">{item.user}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Đang diễn ra"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : item.status === "Sắp tới"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Dụng cụ</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tổng số</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Khả dụng</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Đang mượn</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {toolsData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{item.tool}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{item.quantity}</td>
                      <td className="py-4 px-4 text-gray-700">{item.available}</td>
                      <td className="py-4 px-4 text-gray-700">{item.borrowed}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Khả dụng"
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