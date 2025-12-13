'use client';

import Image from 'next/image';

type TabKey = 'calendar' | 'room' | 'tools';

export default function SidebarNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  const items: { key: TabKey; label: string; icon: string }[] = [
    { key: 'room', label: 'Quản lý phòng', icon: '/calendar-icon.png' },
    { key: 'tools', label: 'Quản lý dụng cụ', icon: '/tools-icon.png' },
  ];

  return (
    <nav className="space-y-2">
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold tracking-tight transition-all duration-200 text-left
              ${
                isActive
                  ? 'bg-[#86b3f8] text-white shadow-sm scale-[1.02]'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#FD735D]'
              }`}
          >
            <Image
              src={it.icon}
              alt={it.label}
              width={28}
              height={28}
              className={`object-contain ${isActive ? 'brightness-0 invert' : ''}`}
            />
            <span className="text-[15px]">{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
