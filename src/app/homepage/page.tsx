"use client";
import { useState } from "react";
import { LogOut, Search, Bell, User } from "lucide-react";
import Image from "next/image";
import SidebarNav from "./components/SidebarNav";
import DashboardHome from "./components/DashboardHome";
import CalendarComponent from "./components/CalendarComponent";
import RoomComponent from "./components/RoomManagement/RoomComponent";
import ToolsComponent from "./components/ToolManagement/ToolsComponent";

export type TabKey = "home" | "calendar" | "room" | "tools" | "facility";

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
      case "facility":
        return "Quản lý cơ sở vật chất";
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-[#0B4DBA]" />
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo Section */}
        <div className="absolute left-0 top-0 h-full w-1 bg-[#0B4DBA]" />
        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white p-2">
              <Image
                src="/uit_icon.png"
                alt="UIT logo"
                width={90}
                height={90}
                className="rounded-xl bg-white p-1"
              />
            </div>

            <div className="flex-1">
              <p className="text-xl font-bold text-[#0B4DBA] tracking-tight leading-tight">
                UIT Facility
              </p>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
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
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-[1800px] mx-auto">
            {/* Dashboard Home - Show on home tab */}
            {tab === "home" && <DashboardHome />}

            {/* Main Content Card */}
            {tab !== "home" && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className={tab === "calendar" ? "" : "p-10"}>
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
