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

type RoomType = "Phòng học" | "Thực hành" | "Hội trường";
type RoomStatus = "Đang sử dụng" | "Hư hỏng" | "Bảo trì";

export type BuildingOption = { id: string; name: string }; // A/B/C...

export type CreateRoomPayload = {
  name: string;
  building_id: string; // ✅ uuid
  stage: number;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
};

const BLUE = "#0B4DBA";
const BORDER = "#D1D5DB";

const textFieldSx = {
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

export default function CreateRoomModal({
  open,
  onClose,
  onSubmit,
  buildings,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRoomPayload) => void;
  buildings: BuildingOption[];
}) {
  const [name, setName] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [stage, setStage] = useState<string>("");
  const [type, setType] = useState<RoomType>("Phòng học");
  const [capacity, setCapacity] = useState<string>("");
  const [status, setStatus] = useState<RoomStatus>("Đang sử dụng");

  useEffect(() => {
    if (open) {
      setName("");
      setBuildingId("");
      setStage("");
      setType("Phòng học");
      setCapacity("");
      setStatus("Đang sử dụng");
    }
  }, [open]);

  const canSubmit = useMemo(() => {
    return (
      name.trim() !== "" &&
      buildingId.trim() !== "" &&
      stage !== "" &&
      Number(stage) >= 0 &&
      capacity !== "" &&
      Number(capacity) > 0
    );
  }, [name, buildingId, stage, capacity]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: "14px" },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">Tạo phòng mới</p>
            <p className="text-sm text-gray-500 mt-1">Nhập thông tin để tạo phòng.</p>
          </div>

          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "#F3F4F6" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Tên phòng"
            placeholder="VD: A101"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            sx={textFieldSx}
          />

          <TextField
            select
            label="Tòa"
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
            fullWidth
            size="small"
            sx={textFieldSx}
          >
            <MenuItem value="">Chọn tòa</MenuItem>
            {buildings.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Tầng"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: { inputProps: { min: 0 } },
            }}
            sx={textFieldSx}
          />

          <TextField
            type="number"
            label="Sức chứa"
            placeholder="VD: 40"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: { inputProps: { min: 1 }},
            }}
            sx={textFieldSx}
          />

          <TextField
            select
            label="Loại"
            value={type}
            onChange={(e) => setType(e.target.value as RoomType)}
            fullWidth
            size="small"
            sx={textFieldSx}
          >
            <MenuItem value="Phòng học">Phòng học</MenuItem>
            <MenuItem value="Thực hành">Thực hành</MenuItem>
            <MenuItem value="Hội trường">Hội trường</MenuItem>
          </TextField>

          <TextField
            select
            label="Trạng thái"
            value={status}
            onChange={(e) => setStatus(e.target.value as RoomStatus)}
            fullWidth
            size="small"
            sx={textFieldSx}
          >
            <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
            <MenuItem value="Hư hỏng">Hư hỏng</MenuItem>
            <MenuItem value="Bảo trì">Bảo trì</MenuItem>
          </TextField>
        </div>
      </DialogContent>

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
              building_id: buildingId,
              stage: Number(stage),
              capacity: Number(capacity),
              type,
              status,
            })
          }
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            canSubmit ? "bg-[#0B4DBA] hover:bg-[#0940A3]" : "bg-[#93B4E6] cursor-not-allowed"
          }`}
        >
          Tạo phòng
        </button>
      </DialogActions>
    </Dialog>
  );
}
