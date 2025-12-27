"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FacilityStatus } from "./FacilityComponent";

/* ================= TYPES ================= */

export type FacilityType =
  | "Đồ điện tử"
  | "Đồ nội thất"
  | "Văn phòng phẩm"
  | "Khác";

// export type FacilityStatus = "Hoạt động" | "Không hoạt động" | "Hư hỏng";

export type RoomOption = {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
};

export type CreateFacilityPayload = {
  name: string;
  type: FacilityType;
  status: FacilityStatus;
  room_id: string; // uuid
};

/* ================= STYLE ================= */

const BLUE = "#0B4DBA";
const BORDER = "#D1D5DB";

export const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: BORDER },
    "&:hover fieldset": { borderColor: BORDER },
    "&.Mui-focused fieldset": { borderColor: BLUE },
  },
  "& .MuiInputLabel-root": {
    color: "#6B7280",
    "&.Mui-focused": { color: BLUE },
  },
};

/* ================= COMPONENT ================= */

export default function CreateFacilityModal({
  open,
  onClose,
  onSubmit,
  rooms,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateFacilityPayload) => void;
  rooms: RoomOption[];
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FacilityType>("Đồ điện tử");
  const [status, setStatus] = useState<FacilityStatus>("Hoạt động");
  const [roomId, setRoomId] = useState("");

  /* reset form khi mở modal */
  useEffect(() => {
    if (open) {
      setName("");
      setType("Đồ điện tử");
      setStatus("Hoạt động");
      setRoomId("");
    }
  }, [open]);

  const canSubmit = useMemo(() => {
    return name.trim() !== "" && roomId.trim() !== "";
  }, [name, roomId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: { sx: { borderRadius: "14px" } },
      }}
    >
      {/* ===== Title ===== */}
      <DialogTitle sx={{ pb: 1 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">Thêm thiết bị mới</p>
            <p className="text-sm text-gray-500 mt-1">
              Nhập thông tin cơ sở vật chất.
            </p>
          </div>

          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      {/* ===== Content ===== */}
      <DialogContent dividers sx={{ borderColor: "#F3F4F6" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Tên thiết bị"
            placeholder="VD: Máy chiếu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            sx={textFieldSx}
          />

          <TextField
            select
            label="Phòng"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            fullWidth
            size="small"
            sx={textFieldSx}
            slotProps={{
              select: {
                MenuProps: {
                  disablePortal: true,
                  PaperProps: {
                    sx: {
                      maxHeight: 260, 
                      mt: 0.5,
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                },
              },
            }}
          >
            <MenuItem value="">Chọn phòng</MenuItem>
            {rooms.map((r) => (
              <MenuItem key={r.id} value={r.id} 
                sx={{
                  py: 1.3,         
                  fontSize: "16px",
                }}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Loại thiết bị"
            value={type}
            onChange={(e) => setType(e.target.value as FacilityType)}
            fullWidth
            size="small"
            sx={textFieldSx}
          >
            <MenuItem value="Electronics">Đồ điện tử</MenuItem>
            <MenuItem value="Furniture">Đồ nội thất</MenuItem>
            <MenuItem value="Stationery">Văn phòng phẩm</MenuItem>
            <MenuItem value="Other">Khác</MenuItem>
          </TextField>

          <TextField
            select
            label="Trạng thái"
            value={status}
            onChange={(e) => setStatus(e.target.value as FacilityStatus)}
            fullWidth
            size="small"
            sx={textFieldSx}
          >
            <MenuItem value="ACTIVE">Hoạt động</MenuItem>
            <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
            <MenuItem value="MAINTENANCE">Hư hỏng</MenuItem>
          </TextField>
        </div>
      </DialogContent>

      {/* ===== Actions ===== */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
        >
          Hủy
        </button>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() =>
            onSubmit({
              name: name.trim(),
              type,
              status,
              room_id: roomId,
            })
          }
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            canSubmit
              ? "bg-[#0B4DBA] hover:bg-[#0940A3]"
              : "bg-[#93B4E6] cursor-not-allowed"
          }`}
        >
          Thêm thiết bị
        </button>
      </DialogActions>
    </Dialog>
  );
}
