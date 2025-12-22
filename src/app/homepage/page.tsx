"use client";
import { useState } from "react";
import {
  LogOut,
  Search,
  Bell,
  User,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import SidebarNav from "./components/SidebarNav";
import DashboardHome from "./components/DashboardHome";
import CalendarComponent from "./components/CalendarComponent";
import RoomComponent from "./components/RoomManagement/RoomComponent";
import ToolsComponent from "./components/ToolManagement/ToolsComponent";
import FacilityComponent from "./components/FacilityManagement/FacilityComponent";
import UserComponent from "./components/UserManagement/UserComponent";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/feature/auth/auth.slice";
import Cookies from "js-cookie";
import ManagementComponent from "./components/Management/ManagementComponent";

export type TabKey =
  | "home"
  | "personal"
  | "calendar"
  | "room"
  | "tools"
  | "facility"
  | "user"
  | "management";

export default function HomePage() {
  const [tab, setTab] = useState<TabKey>("home");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  console.log("Current User:", user);

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    (await Cookies).remove("access_token");
    window.location.href = "/login";
  };

  const mapUserRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "user":
        return "Nhân sự";
      default:
        return "Nhân sự";
    }
  };

  const getPageTitle = () => {
    switch (tab) {
      case "home":
        return "Trang chủ";
      case "room":
        return "Quản lý phòng";
      case "personal":
        return "Trang cá nhân";
      case "tools":
        return "Quản lý dụng cụ";
      case "calendar":
        return "Lịch sử dụng";
      case "facility":
        return "Quản lý cơ sở vật chất";
      case "user":
        return "Quản lý người dùng";
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

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 pl-1 pr-3 py-1 hover:bg-gray-50 rounded-full transition-all duration-200 border border-transparent hover:border-gray-200 group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#0B4DBA] to-[#0847A8] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.fullName || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mapUserRole(user?.role)}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
                      isUserMenuOpen ? "rotate-180 text-[#0B4DBA]" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Card */}
                      <div className="px-5 py-4 bg-gradient-to-br from-[#0B4DBA] to-[#0847A8]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                              {user?.fullName || "Admin User"}
                            </p>
                            <p className="text-xs text-blue-100 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setTab("personal");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group mb-1"
                        >
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <UserCircle className="w-4 h-4 text-[#0B4DBA]" />
                          </div>
                          <span>Trang cá nhân</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
                  {tab === "management" && <ManagementComponent />}
                  {tab === "personal" && <UserComponent />}
                  {tab === "room" && <RoomComponent />}
                  {tab === "tools" && <ToolsComponent />}
                  {tab === "facility" && <FacilityComponent />}
                  {tab === "user" && <UserComponent />}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
