"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
  type SelectChangeEvent, Box,
} from "@mui/material";

export type IncidentStatus = "Đã xử lý" | "Chưa xử lý";

type FacilityOption = { id: string; name: string };

export type EditIncidentPayload = {
  id: string;
  facilityId: string;
  description: string;
  status: IncidentStatus;
};

type Props = {
  open: boolean;
  onClose: () => void;
  facilities: FacilityOption[];
  incident: { id: string; facilityId: string; description: string; status: IncidentStatus } | null;
  onUpdated: (payload: EditIncidentPayload) => void;
  isSubmitting?: boolean;
};

export default function EditIncidentModal({
  open,
  onClose,
  facilities,
  incident,
  onUpdated,
  isSubmitting,
}: Props) {
  const firstId = useMemo(() => facilities[0]?.id ?? "", [facilities]);

  const [facilityId, setFacilityId] = useState<string>(firstId);
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<IncidentStatus>("Chưa xử lý");

  useEffect(() => {
    if (!open) return;
    setFacilityId(incident?.facilityId ?? firstId);
    setDescription(incident?.description ?? "");
    setStatus(incident?.status ?? "Chưa xử lý");
  }, [open, incident, firstId]);

  const canSubmit =
    (incident?.id ?? "").trim() !== "" &&
    facilityId.trim() !== "" &&
    description.trim() !== "";

  const handleSubmit = () => {
    if (!incident) return;

    onUpdated({
      id: incident.id,
      facilityId,
      description: description.trim(),
      status,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh sửa sự việc</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: "grid", gap: 2.2, mt: 1 }}>
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
                <MenuItem value="">(Chưa có thiết bị)</MenuItem>
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
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit || facilities.length === 0 || isSubmitting}
          sx={{ backgroundColor: "#5295f8", "&:hover": { backgroundColor: "#377be1" } }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
