"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useUpdateRoomAssetMutation } from "@/feature/RoomApi/room.api";
import type { CreateRoomAssetRequest, RoomAssetResponse } from "@/feature/RoomApi/type";

type Props = {
  open: boolean;
  onClose: () => void;
  roomId: string;
  asset: {
    id: string;
    name: string;
    type: string; // UI Vietnamese or raw? (mình sẽ map về API)
    status: "Hoạt động" | "Hư hỏng";
  } | null;
  onUpdated?: () => void;
};

const TYPE_OPTIONS = [
  { value: "Electronics", label: "Thiết bị điện tử" },
  { value: "Furniture", label: "Nội thất" },
  { value: "Stationery", label: "Văn phòng phẩm" },
  { value: "Other", label: "Khác" },
] as const;

const mapUiTypeToApi = (ui: string) => {
  // nếu bạn đang lưu type trong table là tiếng Việt, map lại về API
  const found = TYPE_OPTIONS.find((x) => x.label === ui);
  return found?.value ?? ui; // nếu ui đã là Electronics/Furniture... thì giữ nguyên
};

const mapUiStatusToApi = (ui: "Hoạt động" | "Hư hỏng"): CreateRoomAssetRequest["status"] =>
  ui === "Hoạt động" ? "ACTIVE" : "INACTIVE";

const mapApiStatusToUi = (api: CreateRoomAssetRequest["status"]) =>
  api === "ACTIVE" ? "Hoạt động" : "Hư hỏng";

export default function EditRoomAssetModal({ open, onClose, roomId, asset, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]["value"]>("Electronics");
  const [status, setStatus] = useState<CreateRoomAssetRequest["status"]>("ACTIVE");

  const [updateRoomAsset, { isLoading }] = useUpdateRoomAssetMutation();

  useEffect(() => {
    if (!open || !asset) return;

    setName(asset.name ?? "");
    setType(mapUiTypeToApi(asset.type) as any);
    setStatus(mapUiStatusToApi(asset.status));
  }, [open, asset]);

  const canSubmit = useMemo(() => name.trim() !== "" && !!asset?.id, [name, asset?.id]);

  const handleSubmit = async () => {
    if (!asset) return;

    const body: CreateRoomAssetRequest = {
      name: name.trim(),
      type,
      room_id: roomId,
      status,
    };

    try {
      await updateRoomAsset({ id: asset.id, body }).unwrap();
      onClose();
      onUpdated?.();
    } catch (e) {
      console.error("Update room asset failed:", e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh sửa thiết bị</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <div className="grid grid-cols-1 gap-4 mt-2">
          <TextField
            label="Tên thiết bị"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <FormControl size="small" fullWidth>
            <InputLabel id="asset-type-label">Loại</InputLabel>
            <Select
              labelId="asset-type-label"
              label="Loại"
              value={type}
              onChange={(e: SelectChangeEvent) => setType(e.target.value as any)}
            >
              {TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="asset-status-label">Trạng thái</InputLabel>
            <Select
              labelId="asset-status-label"
              label="Trạng thái"
              value={status}
              onChange={(e: SelectChangeEvent) =>
                setStatus(e.target.value as CreateRoomAssetRequest["status"])
              }
            >
              <MenuItem value="ACTIVE">Hoạt động</MenuItem>
              <MenuItem value="INACTIVE">Hư hỏng</MenuItem>
            </Select>
          </FormControl>
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !canSubmit}
          sx={{
            backgroundColor: "#5295f8",
            "&:hover": { backgroundColor: "#377be1" },
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
