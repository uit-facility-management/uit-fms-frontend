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
import { useCreateUserMutation } from "@/feature/UserApi/user.api";

// type playload

export type CreateUserPayload = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

export default function CreateUserModal({open, onClose,}: {open: boolean; onClose: () => void;}) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  const [passwordError, setPasswordError] = useState("");

  const [emailError, setEmailError] = useState("");

  const [createUser, { isLoading }] = useCreateUserMutation();

  useEffect(() => {
    if (open) {
      setUsername("");
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("user");
    }
  }, [open]);

  const canSubmit = useMemo(() => {
  return (
    username.trim() !== "" &&
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    emailError === "" &&
    passwordError === "" &&
    password.length >= 6
  );
}, [username, fullName, email, password, emailError, passwordError]);


  const handleSubmit = async () => {
    try {
      await createUser({
        username: username.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
      }).unwrap();

      onClose();
    } catch (err) {
      console.error("Create user failed", err);
      alert("Tạo người dùng thất bại");
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
      {/* Title */}
      <DialogTitle sx={{ pb: 1 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              Thêm người dùng
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Nhập thông tin tài khoản mới
            </p>
          </div>

          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers sx={{ borderColor: "#F3F4F6" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            size="small"
            sx={textFieldSx}
          />

          <TextField
            label="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            size="small"
            sx={textFieldSx}
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
                const value = e.target.value;
                setEmail(value);

                if (value.trim() === "") {
                setEmailError("Email không được để trống");
                } else if (!isValidEmail(value)) {
                setEmailError("Email không đúng định dạng");
                } else {
                setEmailError("");
                }
            }}
            error={!!emailError}
            helperText={emailError}
            fullWidth
            size="small"
            sx={textFieldSx}
           />

          <TextField
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => {
                const value = e.target.value;
                setPassword(value);

                if (value.length < 6) {
                setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
                } else {
                setPasswordError("");
                }
            }}
            error={!!passwordError}
            helperText={passwordError || "Ít nhất 6 ký tự"}
            fullWidth
            size="small"
            sx={textFieldSx}
            />

          <TextField
            select
            label="Vai trò"
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "admin" | "user")
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </div>
      </DialogContent>

      {/* Actions */}
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
          disabled={!canSubmit || isLoading}
          onClick={handleSubmit}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            canSubmit
              ? "bg-[#0B4DBA] hover:bg-[#0940A3]"
              : "bg-[#93B4E6] cursor-not-allowed"
          }`}
        >
          {isLoading ? "Đang tạo..." : "Thêm người dùng"}
        </button>
      </DialogActions>
    </Dialog>
  );
}
