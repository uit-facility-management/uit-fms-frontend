'use client';

import { Chip } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import type { RoomRow } from './RoomComponent';

type Props = {
  room: RoomRow;
  onBack: () => void;
};

const statusChipSx = (s: RoomRow['status']) => {
  switch (s) {
    case 'Đang sử dụng':
      return { backgroundColor: '#d4edda', color: '#155724' };
    case 'Trống':
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
    case 'Bảo trì':
      return { backgroundColor: '#fff3cd', color: '#856404' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="text-sm font-semibold text-gray-800 text-right">{value}</div>
    </div>
  );
}

export default function RoomDetails({ room, onBack }: Props) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Chi tiết phòng</p>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            {room.room}
          </h2>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white bg-[#5295f8] hover:bg-[#377be1] transition"
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          Quay lại
        </button>
      </div>

      {/* Content */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left card */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Thông tin phòng</p>
          </div>

          <div className="p-5">
            <InfoRow label="Tòa" value={room.building} />
            <InfoRow label="Tầng" value={room.stage} />
            <InfoRow label="Loại" value={room.type} />
            <InfoRow label="Sức chứa" value={`${room.capacity}`} />
            <InfoRow
              label="Trạng thái"
              value={
                <Chip
                  label={room.status}
                  size="small"
                  sx={{
                    ...statusChipSx(room.status),
                    fontWeight: 700,
                    border: 'none',
                    px: 0.5,
                  }}
                />
              }
            />
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Tóm tắt</p>
          </div>

          <div className="p-5 space-y-3">
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500">Mã phòng</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">{room.room}</p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500">Vị trí</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                Tòa {room.building} • Tầng {room.stage}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500">Trạng thái</p>
              <div className="mt-2">
                <Chip
                  label={room.status}
                  size="small"
                  sx={{
                    ...statusChipSx(room.status),
                    fontWeight: 700,
                    border: 'none',
                    px: 0.5,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => console.log('Đặt phòng:', room.room)}
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
            >
              Đặt phòng này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
