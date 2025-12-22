"use client";
import { useState } from "react";
import { ClipboardList, Package, Wrench } from "lucide-react";
import BookingRequestsTab from "./BookingRequestsTab";

type ManagementTab = "bookings" | "borrows" | "maintenance";

export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState<ManagementTab>("bookings");
  

  const tabs = [
    {
      id: "bookings" as ManagementTab,
      label: "Đặt phòng",
      icon: ClipboardList,
    },
    {
      id: "borrows" as ManagementTab,
      label: "Phiếu mượn",
      icon: Package,
    },
    {
      id: "maintenance" as ManagementTab,
      label: "Báo hỏng",
      icon: Wrench,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý</h1>
          <p className="text-sm text-gray-500 mt-1">
            Duyệt yêu cầu đặt phòng, phiếu mượn và xử lý báo hỏng
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content with Fixed Height and Scroll */}
          <div className="h-[600px] overflow-y-auto p-6">
            {activeTab === "bookings" && <BookingRequestsTab />}
            {activeTab === "borrows" && (
              <div className="text-gray-500">Component Phiếu mượn sẽ ở đây</div>
            )}
            {activeTab === "maintenance" && (
              <div className="text-gray-500">Component Báo hỏng sẽ ở đây</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
