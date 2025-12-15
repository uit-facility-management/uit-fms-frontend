'use client';

import { useMemo, useState } from 'react';
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import type { RoomRow } from './RoomComponent';

type Props = {
  room: RoomRow;
  onBack: () => void;
};

type Building = 'A' | 'B' | 'C' | 'E';
type RoomType = 'Phòng học' | 'Thực hành' | 'Hội trường';
type RoomStatus = 'Đang sử dụng' | 'Trống' | 'Bảo trì';

type RoomRowWithName = RoomRow & { name?: string };

const statusChipSx = (s: RoomStatus) => {
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
  const r = room as RoomRowWithName;

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState<string>(r.name ?? r.room);
  const [stage, setStage] = useState<number>(Number(r.stage));
  const [capacity, setCapacity] = useState<number>(r.capacity);

  const [building, setBuilding] = useState<Building>((r.building as Building) ?? 'A');
  const [type, setType] = useState<RoomType>(r.type as RoomType);
  const [status, setStatus] = useState<RoomStatus>(r.status as RoomStatus);

  const currentStatusChip = useMemo(
    () => (
      <Chip
        label={status}
        size="small"
        sx={{
          ...statusChipSx(status),
          fontWeight: 700,
          border: 'none',
          px: 0.5,
        }}
      />
    ),
    [status],
  );

  const handleCancel = () => {
    setName(r.name ?? r.room);
    setStage(Number(r.stage));
    setCapacity(r.capacity);
    setBuilding(((r.building as Building) ?? 'A') as Building);
    setType(r.type as RoomType);
    setStatus(r.status as RoomStatus);
    setIsEditing(false);
  };

  const handleSave = () => {
    console.log('SAVE ROOM', {
      code: r.room,
      name,
      building,
      stage,
      type,
      capacity,
      status,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Chi tiết phòng</p>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            {r.room}
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
      <div className="mt-5">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Thông tin phòng</p>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
              >
                Chỉnh sửa thông tin
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
                >
                  Lưu
                </button>
              </div>
            )}
          </div>

          <div className="p-5">
            {!isEditing ? (
              <>
                <InfoRow label="Tên phòng" value={name} />
                <InfoRow label="Tòa" value={building} />
                <InfoRow label="Tầng" value={stage} />
                <InfoRow label="Loại" value={type} />
                <InfoRow label="Sức chứa" value={capacity} />
                <InfoRow label="Trạng thái" value={currentStatusChip} />
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextField
                    size="small"
                    label="Tên phòng"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />

                  <FormControl size="small" fullWidth>
                    <InputLabel id="building-label">Tòa</InputLabel>
                    <Select
                      labelId="building-label"
                      label="Tòa"
                      value={building}
                      onChange={(e: SelectChangeEvent) =>
                        setBuilding(e.target.value as Building)
                      }
                    >
                      <MenuItem value="A">A</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                      <MenuItem value="E">E</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Tầng"
                    type="number"
                    value={Number.isFinite(stage) ? stage : ''}
                    onChange={(e) => setStage(e.target.value === '' ? 0 : Number(e.target.value))}
                    fullWidth
                  />

                  <FormControl size="small" fullWidth>
                    <InputLabel id="type-label">Loại</InputLabel>
                    <Select
                      labelId="type-label"
                      label="Loại"
                      value={type}
                      onChange={(e: SelectChangeEvent) =>
                        setType(e.target.value as RoomType)
                      }
                    >
                      <MenuItem value="Phòng học">Phòng học</MenuItem>
                      <MenuItem value="Thực hành">Thực hành</MenuItem>
                      <MenuItem value="Hội trường">Hội trường</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Sức chứa"
                    type="number"
                    value={Number.isFinite(capacity) ? capacity : ''}
                    onChange={(e) => setCapacity(e.target.value === '' ? 0 : Number(e.target.value))}
                    inputProps={{ min: 0 }}
                    fullWidth
                  />

                  <FormControl size="small" fullWidth>
                    <InputLabel id="status-label">Trạng thái</InputLabel>
                    <Select
                      labelId="status-label"
                      label="Trạng thái"
                      value={status}
                      onChange={(e: SelectChangeEvent) =>
                        setStatus(e.target.value as RoomStatus)
                      }
                    >
                      <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
                      <MenuItem value="Trống">Trống</MenuItem>
                      <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                    </Select>
                  </FormControl>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
