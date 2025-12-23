"use client";

import { useEffect, useMemo, useState } from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Chip, SelectChangeEvent, } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useChangePasswordMutation, useGetUserByIdQuery, useUpdateUserMutation } from "@/feature/UserApi/user.api";
import UserDelete from "./UserDelete";

type Props = {
  userId: string;
  onBack: () => void;
  showDelete?: boolean;
};

type UserRole = "admin" | "user";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="text-sm font-semibold text-gray-800 text-right">
        {value}
      </div>
    </div>
  );
}


const roleChipSx = (role: UserRole) => {
  switch (role) {
    case "admin":
      return { backgroundColor: "#358597", color: "white" };
    case "user":
      return { backgroundColor: "#f4a896", color: "white" };
    default:
      return { backgroundColor: "#dcfce7", color: "#166534" };
  }
};


export default function UserDetail({ userId, onBack, showDelete = true }: Props) {
  const { data, isLoading, isError } = useGetUserByIdQuery(userId);

  const [isEditing, setIsEditing] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("user");

  // delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // chang password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [changePassword, { isLoading: isChangingPasswordLoading }] = useChangePasswordMutation();

  const handleChangePassword = async () => {
    if (!newPassword.trim()) return;

    try {
      await changePassword({
        id: userId,
        body: { password: newPassword },
      }).unwrap();

      setIsChangingPassword(false);
      setNewPassword("");
    } catch (e) {
      console.error("Change password failed:", e);
    }
  };


  // update
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleSave = async () => {
    try {
      const payload = {
        email,       
        username,
        fullName,
      };
      console.log("UPDATE USER PAYLOAD:", payload);

      await updateUser({
        id: userId,
        body: payload,
      }).unwrap();

      setIsEditing(false);
    } catch (e) {
      console.error("Update user failed:", e);
    }
  };


  /* sync date */
  useEffect(() => {
    if (!data) return;
    setEmail(data.email);
    setUsername(data.username);
    setFullName(data.fullName);
    setRole(data.role as UserRole);
  }, [data]);


  const roleChip = useMemo(
    () => (
      <Chip
        label={role}
        size="small"
        sx={{
          ...roleChipSx(role),
          fontWeight: 700,
          border: "none",
          px: 0.5,
        }}
      />
    ),
    [role]
  );

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError || !data) return <p>Không tìm thấy người dùng</p>;

  return (
    <div className="w-full">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Chi tiết người dùng</p>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            {data.username}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {showDelete && (
            <button
              className="rounded-xl px-4 py-2 font-semibold text-[#ff6666] bg-[#ffe5e5] hover:bg-[#ffcccc] transition"
              onClick={() => setIsDeleteOpen(true)}
            >
              Xóa người dùng
            </button>
          )}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white bg-[#5295f8] hover:bg-[#377be1] transition"
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            Quay lại
          </button>
        </div>
      </div>

      {/* Thông tin người dùng */}
      <div className="mt-5 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Thông tin người dùng
          </p>

          {!isEditing && !isChangingPassword ? (

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsChangingPassword(true)}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Đổi mật khẩu
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1] transition"
              >
                Chỉnh sửa
              </button>
            </div> 
            ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setIsChangingPassword(false);
                  setNewPassword("");
                  setEmail(data.email);
                  setUsername(data.username);
                  setFullName(data.fullName);
                  setRole(data.role as UserRole);
                }}
                className="rounded-lg px-4 py-2 font-semibold bg-white border border-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={isEditing ? handleSave : handleChangePassword}
                disabled={isUpdating || isChangingPasswordLoading}
                className="rounded-lg px-4 py-2 font-semibold text-white bg-[#5295f8] hover:bg-[#377be1]"
              >
                Lưu
              </button>
            </div>
          )}
        </div>

        <div className="p-5">
          {!isEditing && !isChangingPassword ? (
            <>
              <InfoRow label="Email" value={email} />
              <InfoRow label="Username" value={username} />
              <InfoRow label="Họ tên" value={fullName} />
              <InfoRow label="Vai trò" value={roleChip} />
              <InfoRow
                label="Ngày tạo"
                value={new Date(data.createdAt).toLocaleString("vi-VN")}
              />
              <InfoRow
                label="Cập nhật lần cuối"
                value={new Date(data.updatedAt).toLocaleString("vi-VN")}
              />
            </>
          ) : isEditing ? (
            // form edit user
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                size="small"
                label="Email"
                value={email}
                fullWidth
                disabled
                helperText="Email không thể thay đổi"
              />

              <TextField
                size="small"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />

              <TextField
                size="small"
                label="Họ tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
              />
            </div>
          ) : (
            // form change password
            <div className="max-w-md">
              <TextField
                size="small"
                label="Mật khẩu mới"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                helperText="Nhập mật khẩu mới cho người dùng"
              />
            </div>
          )}

        </div>
      </div>
      {showDelete && (
        <UserDelete
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          userId={data.id}
          username={data.username}
          onDeleted={onBack}
        />
      )}
    </div>
  );
}
