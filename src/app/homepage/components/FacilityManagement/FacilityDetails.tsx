'use client';

import { useState } from 'react';
import { Chip } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { FacilityRow } from './FacilityComponent';

type Props = {
  facility: FacilityRow;
  onBack: () => void;
};

export type FacilityIssue = {
  type: string;
  title: string;
  description: string;
  createdAt: string;
};


const statusChipSx = (s: FacilityRow['status']) => {
  switch (s) {
    case 'Đang sử dụng':
      return { backgroundColor: '#d4edda', color: '#155724' };
    case 'Chưa sử dụng':
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
    case 'Hư hỏng':
      return { backgroundColor: '#fff3cd', color: '#856404' };
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

export default function FacilityDetails({ facility, onBack }: Props) {
  const [editingField, setEditingField] =
    useState<keyof FacilityRow | null>(null);

  const [editedValue, setEditedValue] = useState<unknown>(null);

  const handleSave = (field: keyof FacilityRow) => {
    console.log('UPDATE FIELD:', field, 'VALUE:', editedValue);
    setEditingField(null);
  };

  // Lịch sử hư hỏng
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issues, setIssues] = useState<FacilityIssue[]>([]);

  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
  });

  const handleAddIssue = () => {
    if (!issueForm.title || !issueForm.description) return;

    const newIssue: FacilityIssue = {
      type: facility.type,
      title: issueForm.title,
      description: issueForm.description,
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    setIssues((prev) => [newIssue, ...prev]);

    // reset form
    setIssueForm({ title: '', description: '' });
  };



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
            <InfoRow
              label="Loại thiết bị"
              value={facility.type}
              editable
              isEditing={editingField === 'type'}
              onEdit={() => {
                setEditingField('type');
                setEditedValue(facility.type);
              }}
              onChange={setEditedValue}
              onSave={() => handleSave('type')}
            />

            <InfoRow
              label="Phòng"
              value={facility.room}
              editable
              isEditing={editingField === 'room'}
              onEdit={() => {
                setEditingField('room');
                setEditedValue(facility.room);
              }}
              onChange={setEditedValue}
              onSave={() => handleSave('room')}
            />

            <InfoRow
              label="Tòa"
              value={facility.building}
              editable
              isEditing={editingField === 'building'}
              onEdit={() => {
                setEditingField('building');
                setEditedValue(facility.building);
              }}
              onChange={setEditedValue}
              onSave={() => handleSave('building')}
            />

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
              onClick={() => setShowIssueForm(true)}
            >
              Báo hư thiết bị
            </button>

            <button
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-[#ff6666] bg-[#ffe5e5] hover:bg-[#ffcccc] transition"
              onClick={() => console.log('Xóa thiết bị:', facility)}
            >
              Xóa thiết bị
            </button>
          </div>
        </div>
      </div>

      {/* báo hư thiết bị */}
      { showIssueForm && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mt-4">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Báo hư thiết bị</p>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm text-gray-500">Loại thiết bị</label>
            <input
              value={facility.type}
              disabled
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-gray-100"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-gray-500">Tiêu đề</label>
            <input
              value={issueForm.title}
              onChange={(e) =>
                setIssueForm({ ...issueForm, title: e.target.value })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="VD: Máy hỏng"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-500">Mô tả</label>
            <textarea
              value={issueForm.description}
              onChange={(e) =>
                setIssueForm({ ...issueForm, description: e.target.value })
              }
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Mô tả chi tiết lỗi..."
            />
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => setShowIssueForm(false)}
              className="flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleAddIssue}
              className="flex-1 w-full rounded-xl px-4 py-2.5 font-semibold text-white bg-[#F79009] hover:bg-[#dc6803] transition"
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
      )}
      
      {/* Bảng lịch sử hư hỏng */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">
            Lịch sử hư hỏng
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Loại thiết bị</th>
                <th className="px-4 py-3 text-left">Tiêu đề</th>
                <th className="px-4 py-3 text-left">Mô tả</th>
                <th className="px-4 py-3 text-left">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    Chưa có lịch sử hư hỏng
                  </td>
                </tr>
              ) : (
                issues.map((i, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-3 font-medium">{i.type}</td>
                    <td className="px-4 py-3">{i.title}</td>
                    <td className="px-4 py-3 text-gray-600">{i.description}</td>
                    <td className="px-4 py-3 text-gray-500">{i.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
