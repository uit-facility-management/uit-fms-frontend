'use client';

import { Chip } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import type { FacilityRow } from './FacilityComponent';

type Props = {
  facility: FacilityRow;
  onBack: () => void;
};

const statusChipSx = (s: FacilityRow['status']) => {
  switch (s) {
    case 'Đang sử dụng':
      return { backgroundColor: '#d4edda', color: '#155724' };
    case 'Chưa sử dụng':
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
    case 'Bị hỏng':
      return { backgroundColor: '#fff3cd', color: '#856404' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="text-sm font-semibold text-gray-800 text-right">
        {value}
      </div>
    </div>
  );
}

export default function FacilityDetails({ facility, onBack }: Props) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Chi tiết cơ sở vật chất</p>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            {facility.type}
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
            <p className="text-sm font-semibold text-gray-700">
              Thông tin thiết bị
            </p>
          </div>

          <div className="p-5">
            <InfoRow label="Loại thiết bị" value={facility.type} />
            <InfoRow label="Phòng" value={facility.room} />
            <InfoRow label="Tòa" value={facility.building} />
            <InfoRow
              label="Trạng thái"
              value={
                <Chip
                  label={facility.status}
                  size="small"
                  sx={{
                    ...statusChipSx(facility.status),
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
            <p className="text-sm font-semibold text-gray-700">Thao tác</p>
          </div>

          <div className="p-5 space-y-3">
            <button
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-white bg-[#F79009] hover:bg-[#dc6803] transition"
              onClick={() => console.log('Báo hư:', facility)}
            >
              Báo hư thiết bị
            </button>

            <button
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-[#ff6666] bg-[#ffe5e5] hover:bg-[#ffcccc] transition"
              onClick={() => console.log('Đánh dấu Chưa sử dụng:', facility)}
            >
              Xóa thiết bị
            </button>

            {/* <button
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-white bg-[#12B76A] hover:bg-[#0e9f6e] transition"
              onClick={() => console.log('Đánh dấu Chưa sử dụng:', facility)}
            >
              Đánh dấu Chưa sử dụng
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}