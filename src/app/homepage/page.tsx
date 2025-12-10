"use client";

import { useState } from "react";
import SidebarNav from "./components/SidebarNav";
import Image from "next/image";
import CalendarComponent from "./components/CalendarComponent";
import RoomComponent from "./components/RoomComponent";
import ToolsComponent from "./components/ToolsComponent";
type TabKey = "calendar" | "room" | "tools";

export default function HomePage() {
  const [tab, setTab] = useState<TabKey>("calendar");
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-[#F9FAFB]">
      <aside className="w-64 bg-white border-r border-gray-200 py-6">
        <div className="flex justify-center mb-6">
          <Image
            src="/uit_icon.png"
            alt="UIT logo"
            width={96}
            height={96}
            className="rounded-lg"
          />
        </div>
        <div className="px-4">
          <SidebarNav active={tab} onChange={setTab} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between bg-white border-b border-gray-200 px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-700 tracking-tight">
            UIT Facility Management
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 bg-[#FD735D] hover:bg-[#ff9582] text-white font-medium rounded-lg transition"
          >
            Đăng xuất
          </button>
        </header>

        <main className="flex-1 p-6 text-gray-700">
          {tab === "calendar" && <CalendarComponent />}
          {tab === "room" && <RoomComponent />}
          {tab === "tools" && <ToolsComponent />}
        </main>
      </div>
    </div>
  );
}
