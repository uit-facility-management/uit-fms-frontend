'use client';

import { useMemo, useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
  Chip, 
  } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { FacilityRow, FacilityType, FacilityStatus } from './FacilityComponent';
import { RoomOption, textFieldSx } from './CreateFacilityModal';
import FacilityIncident from './FacilityIncident';
import FacilityDelete from './FacilityDelete';
import { useUpdateFacilityMutation } from "@/feature/RoomAssetApi/facility.api";
import { RoomAssetResponse } from '@/feature/RoomAssetApi/type';

type Props = {
  facility: FacilityRow;
  onBack: () => void;
  onUpdate: (newFacility: FacilityRow) => void;
  rooms: RoomOption[];
};

export const reverseMapType: Record<FacilityType, RoomAssetResponse["type"]> = {
  "Đồ điện tử": "Electronics",
  "Đồ nội thất": "Furniture",
  "Văn phòng phẩm": "Stationery",
  "Khác": "Other",
};

export const reverseMapStatus: Record<FacilityStatus, RoomAssetResponse["status"]> = {
  "Đang sử dụng": "ACTIVE",
  "Chưa sử dụng": "INACTIVE",
  "Hư hỏng": "MAINTENANCE",
};

const statusChipSx = (s: FacilityRow['status']) => {
  switch (s) {
    case 'Đang sử dụng':
      return { backgroundColor: '#ECFDF3', color: '#027A48' };
    case 'Chưa sử dụng':
      return { backgroundColor: '#dbeafe', color: '#155dfc' };
    case 'Hư hỏng':
      return { backgroundColor: '#ffe5e5', color: '#ff1919' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
};

function InfoRow({
  label,
  value,
  editable,
  isEditing,
  onEdit,
  onChange,
  onSave,
}: {
  label: string;
  value: React.ReactNode;
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onChange?: (v: string) => void;
  onSave?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            autoFocus
            defaultValue={String(value)}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onSave}
            onKeyDown={(e) => e.key === 'Enter' && onSave?.()}
            className="text-sm font-semibold text-gray-800 border rounded px-2 py-1 w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <span className="text-sm font-semibold text-gray-800">
            {value}
          </span>
        )}

        {editable && !isEditing && (
          <EditOutlinedIcon
            onClick={onEdit}
            sx={{
              fontSize: 19,
              marginLeft: 1.5,
              cursor: 'pointer',
              color: '#9CA3AF',
              '&:hover': {
                color: '#2563EB',
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function FacilityDetails({ facility, onBack, onUpdate, rooms }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  // facilityincident form
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  // update
  const [updateFacility, { isLoading }] = useUpdateFacilityMutation();

  // delete
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleUpdateFacility = async () => {
    try {
      await updateFacility({
        id: facility.id, 
        body: {
          name: form.name,
          type: reverseMapType[form.type],
          status: reverseMapStatus[form.status],
          room_id: form.roomId,
        },
      }).unwrap();

      setIsEditing(false);

    } catch (err) {
      console.error("Update facility failed", err);
    }
  };


  const [form, setForm] = useState({
    name: facility.name,
    type: facility.type,
    status: facility.status,
    room: facility.room,
    building: facility.building,
    roomId: facility.roomId
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Chi tiết cơ sở vật chất</p>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            {facility.name}
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
          <div className="flex items-center justify-between px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              Thông tin thiết bị
            </p>
            <button
              type="button"
              onClick={() => { setIsEditing(true)}}
              className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
            >
              Chỉnh sửa thông tin
            </button>

          </div>

          <div className="p-5">
            {!isEditing ? (
            <>
              <InfoRow label="Tên thiết bị" value={facility.name} />
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
                    }}
                  />
                }
              />
            </>
          ) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên thiết bị */}
            <TextField
              size="small"
              label="Tên thiết bị"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            {/* Loại thiết bị */}
            <FormControl size="small" fullWidth>
              <InputLabel id="type-label">Loại thiết bị</InputLabel>
              <Select
                labelId="type-label"
                label="Loại thiết bị"
                value={form.type}
                onChange={(e: SelectChangeEvent) =>
                  setForm({ ...form, type: e.target.value as FacilityType })
                }
              >
                <MenuItem value="Đồ điện tử">Đồ điện tử</MenuItem>
                <MenuItem value="Đồ nội thất">Đồ nội thất</MenuItem>
                <MenuItem value="Văn phòng phẩm">Văn phòng phẩm</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>

            {/* Phòng */}
            <TextField
              select
              label="Phòng"
              value={form.roomId}
              onChange={(e) =>
                setForm({ ...form, roomId: e.target.value })
              }
              fullWidth
              size="small"
              sx={textFieldSx}
            >
              <MenuItem value="">Chọn phòng</MenuItem>

              {rooms.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>


            {/* Tòa */}
            <TextField
              label="Tòa"
              value={
                rooms.find((r) => r.id === form.roomId)?.buildingName || ""
              }
              fullWidth
              size="small"
              disabled
            />


            {/* Trạng thái */}
            <FormControl size="small" fullWidth>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                label="Trạng thái"
                value={form.status}
                onChange={(e: SelectChangeEvent) =>
                  setForm({
                    ...form,
                    status: e.target.value as FacilityRow['status'],
                  })
                }
              >
                <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
                <MenuItem value="Chưa sử dụng">Chưa sử dụng</MenuItem>
                <MenuItem value="Hư hỏng">Hư hỏng</MenuItem>
              </Select>
            </FormControl>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setForm({
                    name: facility.name,
                    type: facility.type,
                    room: facility.room,
                    building: facility.building,
                    status: facility.status,
                    roomId: facility.roomId
                  });
                  setIsEditing(false);
                }}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>

              <button
                onClick={async () => {
                  await handleUpdateFacility();
                  const selectedRoom = rooms.find(r => r.id === form.roomId);
                  onUpdate({
                    ...facility,
                    name: form.name!,
                    type: form.type,
                    status: form.status,
                    roomId: form.roomId,
                    room: selectedRoom?.name ?? "",
                    building: selectedRoom?.buildingName ?? "",
                  });
                }}
                disabled={isLoading}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#5295f8] hover:bg-[#377be1]"
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>


            </div>
          </div>
          )}
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Thao tác</p>
          </div>

          <div className="p-5 space-y-3">
            <button
              onClick={() => setShowIncidentForm(true)}
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-white bg-[#F79009] hover:bg-[#dc6803] transition"
            >
              Báo hư thiết bị
            </button>

            <button
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-[#ff6666] bg-[#ffe5e5] hover:bg-[#ffcccc] transition"
              onClick={() => setOpenDeleteDialog(true)}
            >
              Xóa thiết bị
            </button>
          </div>
        </div>
      </div>

      {/* báo hư thiết bị */}
      
      {/* Bảng lịch sử hư hỏng */}
      
      <FacilityIncident
        facilityName={facility.name}
        facilityType={facility.type}
        open={showIncidentForm}
        onClose={() => setShowIncidentForm(false)}
      />


      <FacilityDelete
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        facilityId={facility.id}
        facilityName={facility.name}
        onDeleted={onBack}
      />
    </div>
    
  );
}
