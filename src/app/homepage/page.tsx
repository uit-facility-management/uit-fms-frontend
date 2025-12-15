"use client";
import { useState } from "react";
import { LogOut, Search, Bell, User } from "lucide-react";
import Image from "next/image";
import SidebarNav from "./components/SidebarNav";
import CalendarComponent from "./components/CalendarComponent";
import RoomComponent from "./components/RoomManagement/RoomComponent";
import ToolsComponent from "./components/ToolManagement/ToolsComponent";
import { Wrench, DoorOpen, Calendar } from "lucide-react";
type TabKey = "home" | "calendar" | "room" | "tools";

export default function HomePage() {
  const [tab, setTab] = useState<TabKey>("home");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  const getPageTitle = () => {
    switch (tab) {
      case "home":
        return "Trang chủ";
      case "room":
        return "Quản lý phòng";
      case "tools":
        return "Quản lý dụng cụ";
      case "calendar":
        return "Lịch sử dụng";
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/uit_icon.png"
                alt="UIT logo"
                width={40}
                height={40}
                className="rounded-xl shadow-md"
              />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900">UIT Facility</p>
              <p className="text-xs text-gray-500 font-medium">
                Management System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <SidebarNav active={tab} onChange={setTab} />
        </nav>

        {/* User Section */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500">admin@uit.edu.vn</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Hệ thống quản lý cơ sở vật chất
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards - Show on home tab */}
            {tab === "home" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tổng phòng
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        48
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <DoorOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Đang sử dụng
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        32
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Còn trống
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        16
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <DoorOpen className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tổng dụng cụ
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        156
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Đang mượn
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        89
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Khả dụng
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        67
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Card */}
            {tab !== "home" && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className={tab === "calendar" ? "" : "p-8"}>
                  {tab === "calendar" && <CalendarComponent />}
                  {tab === "room" && <RoomComponent />}
                  {tab === "tools" && <ToolsComponent />}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}