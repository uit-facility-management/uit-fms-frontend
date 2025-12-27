import {
  DoorOpen,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export default function DashboardHome() {
  const [chartView, setChartView] = useState<"week" | "month">("week");
  const stats = {
    totalRooms: 48,
    availableRooms: 45,
    totalAssets: 156,
    maintenanceNeeded: 8,
  };
  const pendingRequests = [
    { type: "Đặt phòng", count: 5 },
    { type: "Phiếu mượn", count: 3 },
    { type: "Báo hỏng", count: 2 },
  ];

  // Dữ liệu biểu đồ incident theo tuần (7 ngày gần nhất)
  const incidentDataWeek = [
    { date: "17/12", count: 2 },
    { date: "18/12", count: 5 },
    { date: "19/12", count: 3 },
    { date: "20/12", count: 7 },
    { date: "21/12", count: 4 },
    { date: "22/12", count: 6 },
    { date: "23/12", count: 3 },
  ];

  // Dữ liệu biểu đồ incident theo tháng (30 ngày, nhóm theo tuần)
  const incidentDataMonth = [
    { date: "Tuần 1", count: 12 },
    { date: "Tuần 2", count: 18 },
    { date: "Tuần 3", count: 15 },
    { date: "Tuần 4", count: 22 },
  ];

  const incidentData =
    chartView === "week" ? incidentDataWeek : incidentDataMonth;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số phòng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalRooms}
              </p>
              <p className="text-xs text-gray-500 mt-1">Toàn cơ sở</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khả dụng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.availableRooms}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {((stats.availableRooms / stats.totalRooms) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CSVC</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalAssets}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tổng thiết bị</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cần bảo trì</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.maintenanceNeeded}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                3 phòng + 5 thiết bị
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests & Incident Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending Requests */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Yêu cầu chờ duyệt
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {pendingRequests.map((req, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {req.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-full">
                    {req.count}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Báo hỏng {chartView === "week" ? "7 ngày qua" : "tháng này"}
            </h3>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartView("week")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartView === "week"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setChartView("month")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartView === "month"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tháng
              </button>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={incidentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Số báo cáo"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">Tổng báo cáo:</span>
              <span className="font-bold text-gray-900">
                {incidentData.reduce((sum, item) => sum + item.count, 0)} báo
                cáo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
