"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export type CreateToolPayload = {
  name: string;
  description: string;
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

export default function CreateToolModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateToolPayload) => void;
  isSubmitting?: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  const canSubmit = useMemo(() => {
    return name.trim() !== "" && description.trim() !== "";
  }, [name, description]);

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
      <DialogTitle sx={{ pb: 1 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">Tạo dụng cụ mới</p>
            <p className="text-sm text-gray-500 mt-1">
              Nhập thông tin để tạo dụng cụ.
            </p>
          </div>

          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "#F3F4F6" }}>
        <div className="grid grid-cols-1 gap-6">
          <TextField
            label="Tên dụng cụ"
            placeholder="VD: Máy chiếu Epson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            sx={textFieldSx}
          />

          <TextField
            label="Mô tả"
            placeholder="VD: Máy chiếu dùng cho phòng học"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="small"
            multiline
            minRows={3}
            sx={textFieldSx}
          />
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>

        <button
          type="button"
          disabled={!canSubmit || isSubmitting}
          onClick={() =>
            onSubmit({
              name: name.trim(),
              description: description.trim(),
            })
          }
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            canSubmit && !isSubmitting
              ? "bg-[#0B4DBA] hover:bg-[#0940A3]"
              : "bg-[#93B4E6] cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Đang tạo..." : "Tạo dụng cụ"}
        </button>
      </DialogActions>
    </Dialog>
  );
}
