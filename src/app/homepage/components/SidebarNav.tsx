"use client";
import { Home, Calendar, DoorOpen, Wrench } from "lucide-react";

type TabKey = "home" | "calendar" | "room" | "tools";

interface SidebarNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export default function SidebarNav({ active, onChange }: SidebarNavProps) {
  const navItems = [
    { key: "home" as TabKey, label: "Trang chủ", icon: Home },
    { key: "calendar" as TabKey, label: "Lịch sử dụng", icon: Calendar },
    { key: "room" as TabKey, label: "Quản lý phòng", icon: DoorOpen },
    { key: "tools" as TabKey, label: "Quản lý dụng cụ", icon: Wrench },
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;

        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
            <span className="text-sm font-medium">{item.label}</span>
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
