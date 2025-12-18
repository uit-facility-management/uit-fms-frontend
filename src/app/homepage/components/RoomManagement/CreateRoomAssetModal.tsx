"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCreateRoomAssetMutation } from "@/feature/RoomApi/room.api";
import type { CreateRoomAssetRequest } from "@/feature/RoomApi/type";

type Props = {
  open: boolean;
  onClose: () => void;
  roomId: string;
  onCreated?: () => void;
};

// Nếu Min đã export type RoomAssetType ở type.ts thì dùng luôn.
// Còn không thì để union local như vầy cũng OK.
type RoomAssetType = "Electronics" | "Furniture" | "Stationery" | "Other";

export default function CreateRoomAssetModal({
  open,
  onClose,
  roomId,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<RoomAssetType>("Electronics");
  const [status, setStatus] =
    useState<CreateRoomAssetRequest["status"]>("ACTIVE");

  const [createRoomAsset, { isLoading }] = useCreateRoomAssetMutation();

  useEffect(() => {
    if (!open) return;
    setName("");
    setType("Electronics");
    setStatus("ACTIVE");
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const body: CreateRoomAssetRequest = {
      name: name.trim(),
      type, // ✅ select box nên khỏi trim
      room_id: roomId,
      status,
    };

    try {
      await createRoomAsset(body).unwrap();
      onClose();
      onCreated?.();
    } catch (e) {
      console.error("Create room asset failed:", e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Thêm thiết bị</DialogTitle>

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

          {/* ✅ Type = Select box */}
          <FormControl size="small" fullWidth>
            <InputLabel id="asset-type-label">Loại</InputLabel>
            <Select
              labelId="asset-type-label"
              label="Loại"
              value={type}
              onChange={(e: SelectChangeEvent) =>
                setType(e.target.value as RoomAssetType)
              }
            >
              <MenuItem value="Electronics">Thiết bị điện tử</MenuItem>
              <MenuItem value="Furniture">Nội thất</MenuItem>
              <MenuItem value="Stationery">Văn phòng phẩm</MenuItem>
              <MenuItem value="Other">Khác</MenuItem>
            </Select>
          </FormControl>


          {/* ✅ Status = ACTIVE/INACTIVE */}
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
              <MenuItem value="INACTIVE">Ngưng hoạt động</MenuItem>
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
          disabled={isLoading || !name.trim()}
          sx={{
            backgroundColor: "#5295f8",
            "&:hover": { backgroundColor: "#377be1" },
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {isLoading ? "Đang tạo..." : "Tạo thiết bị"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
