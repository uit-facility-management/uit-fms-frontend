"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete } from "@mui/material";
import { useGetStudentsQuery } from "@/feature/ToolsApi/borrow.api";
import { useGetToolsQuery } from "@/feature/ToolsApi/tool.api";
import { useGetRoomQuery } from "@/feature/RoomApi/room.api";
import type { RoomResponse } from "@/feature/RoomApi/type";
import { useCreateBorrowTicketMutation } from "@/feature/ToolsApi/borrow.api";
import { useUpdateToolMutation } from "@/feature/ToolsApi/tool.api";

/* ================== Types ================== */
export type BorrowTicketForm = {
  studentCode?: number;
  deviceId: string;
  roomId: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: BorrowTicketForm) => void;
};

/* ================== UI Const ================== */
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

/* ================== Component ================== */
export default function BorrowTicketPopup({ open, onClose }: Props) {
  const [form, setForm] = useState<BorrowTicketForm>({
    studentCode: undefined,
    deviceId: "",
    roomId: "",
  });

  const [updateTool] = useUpdateToolMutation();
  const [createBorrowTicket, { isLoading: isCreating }] =
    useCreateBorrowTicketMutation();
  const { data: students = [], isLoading: loadingStudents } =
    useGetStudentsQuery();
  const { data: devices = [], isLoading: loadingDevices } = useGetToolsQuery();
  const selectedDevice = useMemo(
    () => devices.find((d) => d.id === form.deviceId),
    [devices, form.deviceId]
  );

  const { data, isLoading: loadingRooms } = useGetRoomQuery();
  const rooms = useMemo<RoomResponse[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as RoomResponse[];
    if (Array.isArray((data as any).roomsData))
      return (data as any).roomsData as RoomResponse[];
    if (Array.isArray((data as any).data))
      return (data as any).data as RoomResponse[];
    return [];
  }, [data]);

  useEffect(() => {
    if (open) {
      setForm({
        studentCode: undefined,
        deviceId: "",
        roomId: "",
      });
    }
  }, [open]);

  const canSubmit = useMemo(() => {
    return (
      typeof form.studentCode === "number" &&
      form.deviceId !== "" &&
      form.roomId !== ""
    );
  }, [form]);

  const handleSubmit = async () => {
    if (!canSubmit || !selectedDevice) return;

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const createdBy = user?.id || user?.userId || "";

      await createBorrowTicket({
        student_code: form.studentCode!,
        create_by: createdBy,
        device_id: form.deviceId,
        room_id: form.roomId,
        status: "BORROWING",
      }).unwrap();

      await updateTool({
        id: selectedDevice.id,
        body: {
          name: selectedDevice.name,
          description: selectedDevice.description,
          status: "BORROWING",
        },
      }).unwrap();

      onClose();
    } catch (err: any) {
      console.error("Create borrow ticket failed:", err);
    }
  };

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
      {/* ===== Header ===== */}
      <DialogTitle sx={{ pb: 1 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">Tạo phiếu mượn</p>
            <p className="text-sm text-gray-500 mt-1">
              Nhập thông tin để tạo phiếu mượn thiết bị.
            </p>
          </div>

          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      {/* ===== Content ===== */}
      <DialogContent dividers sx={{ borderColor: "#F3F4F6" }}>
        <div className="grid grid-cols-1 gap-6">
          <Autocomplete
            options={students}
            value={
              students.find((s) => s.student_code === form.studentCode) || null
            }
            onChange={(_, value) =>
              setForm((prev) => ({
                ...prev,
                studentCode: value?.student_code,
              }))
            }
            slotProps={{
              listbox: {
                sx: {
                  maxHeight: 200,
                  overflowY: "auto",
                  "& li": {
                    minHeight: 22,
                    fontSize: 14,
                  },
                },
              },
            }}
            renderOption={(props, option) => (
              <li
                {...props}
                key={option.id}
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={option.name}
              >
                {option.name}
              </li>
            )}
            getOptionLabel={(s) => `${s.student_code} – ${s.name}`}
            filterOptions={(options, state) =>
              options.filter((s) =>
                `${s.student_code} ${s.name}`
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mã số sinh viên"
                size="small"
                sx={textFieldSx}
              />
            )}
          />

          <Autocomplete
            options={devices.filter((d) => d.status === "ACTIVE")}
            loading={loadingDevices}
            value={devices.find((d) => d.id === form.deviceId) || null}
            onChange={(_, value) =>
              setForm((prev) => ({
                ...prev,
                deviceId: value?.id ?? "",
              }))
            }
            slotProps={{
              listbox: {
                sx: {
                  maxHeight: 200,
                  overflowY: "auto",
                  "& li": {
                    minHeight: 36,
                    fontSize: 14,
                  },
                },
              },
            }}
            renderOption={(props, option) => (
              <li
                {...props}
                key={option.id}
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={option.name}
              >
                {option.name}
              </li>
            )}
            getOptionLabel={(d) => d.name}
            filterOptions={(options, state) =>
              options.filter((d) =>
                d.name.toLowerCase().includes(state.inputValue.toLowerCase())
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Thiết bị"
                size="small"
                sx={textFieldSx}
              />
            )}
          />

          <Autocomplete<RoomResponse>
            options={rooms}
            loading={loadingRooms}
            value={rooms.find((r) => r.id === form.roomId) || null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) =>
              setForm((prev) => ({
                ...prev,
                roomId: value?.id ?? "",
              }))
            }
            slotProps={{
              listbox: {
                sx: {
                  maxHeight: 200,
                  overflowY: "auto",
                  "& li": {
                    minHeight: 22,
                    fontSize: 14,
                  },
                },
              },
            }}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <li
                {...props}
                key={option.id}
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={option.name}
              >
                {option.name}
              </li>
            )}
            filterOptions={(options, state) =>
              options.filter((r) =>
                r.name.toLowerCase().includes(state.inputValue.toLowerCase())
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Phòng"
                size="small"
                sx={textFieldSx}
              />
            )}
          />
        </div>
      </DialogContent>

      {/* ===== Actions ===== */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>

        <button
          type="button"
          disabled={!canSubmit || isCreating}
          onClick={handleSubmit}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            canSubmit && !isCreating
              ? "bg-[#0B4DBA] hover:bg-[#0940A3]"
              : "bg-[#93B4E6] cursor-not-allowed"
          }`}
        >
          {isCreating ? "Đang tạo..." : "Tạo phiếu mượn"}
        </button>
      </DialogActions>
    </Dialog>
  );
}
