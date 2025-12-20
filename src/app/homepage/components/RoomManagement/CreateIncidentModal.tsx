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
  Select,
  MenuItem,
  type SelectChangeEvent,
  Box,
} from "@mui/material";

export type IncidentStatus = "Đã xử lý" | "Chưa xử lý";

export type CreateIncidentPayload = {
  facilityId: string;
  facilityName: string;
  description: string;
  status: IncidentStatus;
};

type FacilityOption = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  facilities: FacilityOption[];
  onCreated: (payload: CreateIncidentPayload) => void;
  defaultFacilityId?: string;
  isSubmitting?: boolean;
};

export default function CreateIncidentModal({
  open,
  onClose,
  facilities,
  onCreated,
  defaultFacilityId,
  isSubmitting = false,
}: Props) {
  const firstId = useMemo(() => facilities[0]?.id ?? "", [facilities]);

  const [facilityId, setFacilityId] = useState<string>(defaultFacilityId ?? firstId);
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<IncidentStatus>("Chưa xử lý");

  // mỗi lần mở modal thì reset form cho “sạch”
  useEffect(() => {
    if (!open) return;
    setFacilityId(defaultFacilityId ?? firstId);
    setDescription("");
    setStatus("Chưa xử lý");
  }, [open, defaultFacilityId, firstId]);

  const canSubmit = facilityId.trim() !== "" && description.trim() !== "";

  const handleSubmit = () => {
    if (isSubmitting || !canSubmit || facilities.length === 0) return;

    const facilityName =
      facilities.find((f) => f.id === facilityId)?.name ?? "Thiết bị";

    onCreated({
      facilityId,
      facilityName,
      description: description.trim(),
      status,
    });

    onClose(); // ✅ nên đóng modal ở đây cho nhất quán
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Thêm sự việc</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: "grid", gap: 2.2, mt: 0.5 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="facility-label">Tên thiết bị</InputLabel>
            <Select
              labelId="facility-label"
              label="Tên thiết bị"
              value={facilityId}
              onChange={(e: SelectChangeEvent) => setFacilityId(String(e.target.value))}
              disabled={facilities.length === 0}
            >
              {facilities.length === 0 ? (
                <MenuItem value="">
                  (Chưa có thiết bị trong “Cơ sở vật chất”)
                </MenuItem>
              ) : (
                facilities.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Mô tả sự việc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Ví dụ: Máy chiếu không lên hình..."
          />

          <FormControl size="small" fullWidth>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              label="Trạng thái"
              value={status}
              onChange={(e: SelectChangeEvent) => setStatus(e.target.value as IncidentStatus)}
            >
              <MenuItem value="Chưa xử lý">Chưa xử lý</MenuItem>
              <MenuItem value="Đã xử lý">Đã xử lý</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit || facilities.length === 0 || isSubmitting}
          sx={{ backgroundColor: "#5295f8", "&:hover": { backgroundColor: "#377be1" } }}
        >
          {isSubmitting ? "Đang tạo..." : "Tạo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
