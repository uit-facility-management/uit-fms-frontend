"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { IconButton, Tooltip, Chip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetUsersQuery } from "@/feature/UserApi/user.api";
import type { UserResponse } from "@/feature/UserApi/type";
import CreateUserModal from "./CreateUserModal";
import UserDetail from "./UserDetail";


// ---------- Table row type ----------
export type UserRow = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

const roleChipSx = (role: string) => {
  switch (role) {
    case "admin":
      return {
        backgroundColor: "#358597",
        color: "white",
        border: "none",
      };
    case "user":
      return {
        backgroundColor: "#f4a896",
        color: "white",
        border: "none",
      };
    default:
      return {
        backgroundColor: "#E5E7EB",
        color: "#374151",
        border: "none",
      };
  }
};

export default function UserComponent() {
  // get user
  const { data, isLoading, error } = useGetUsersQuery();

  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  // thêm người dùng
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const users: UserRow[] = useMemo(() => {
    if (!data) return [];

    return data.map((u: UserResponse) => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      createdAt: new Date(u.createdAt).toLocaleDateString("vi-VN"),
      updatedAt: new Date(u.updatedAt).toLocaleDateString("vi-VN"),
    }));
  }, [data]);

  // table 
  const columns = useMemo<MRT_ColumnDef<UserRow>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        size: 120,
        Cell: ({ cell }) => (
          <span className="font-semibold text-gray-900">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "fullName",
        header: "Họ tên",
        size: 160,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 220,
      },
      {
        accessorKey: "role",
        header: "Vai trò",
        size: 120,
        Cell: ({ row }) => {
          const role = row.original.role;
          return (
            <Chip
              size="small"
              sx={{
                ...roleChipSx(role),
                fontWeight: 600,
                fontSize: "13px",
                height: 28,
                borderRadius: "8px",
              }}
              label={role}
            />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        size: 120,
      },
      {
        id: "actions",
        header: "Thao tác",
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              onClick={() => setSelectedUser(row.original)}
              sx={{
                color: "#6B7280",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                  color: "#111827",
                },
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  // table config
  const table = useMaterialReactTable({
    columns,
    data: users,
    enableSorting: true,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableGlobalFilter: true,
    enablePagination: true,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#F9FAFB",
        color: "#6B7280",
        fontWeight: 700,
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "none",
        py: 3,
        px: 3,
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        py: 3,
        px: 3,
        borderBottom: "1px solid #F3F4F6",
      },
    },

    muiTableBodyRowProps: {
      sx: {
        transition: "all 0.15s ease",
        "&:hover": {
          backgroundColor: "#FAFBFC",
        },
        "&:last-child td": {
          borderBottom: "none",
        },
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0px",
        border: "none",
        boxShadow: "none",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      },
    },

    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
      density: "comfortable",
    },
    localization: {
      noRecordsToDisplay: "Không có dữ liệu hiển thị",
      rowsPerPage: "Số dòng mỗi trang",
      of: "của",
      goToNextPage: "Trang tiếp",
      goToPreviousPage: "Trang trước",
      goToFirstPage: "Trang đầu",
      goToLastPage: "Trang cuối",
      search: "Tìm kiếm",
    },
  });

  if (isLoading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        Không thể tải dữ liệu
      </div>
    );
  }

  return (
  <div className="w-full">
    {/* chi tiết người dung */}
    {selectedUser ? (
      <UserDetail
        userId={selectedUser.id}
        onBack={() => setSelectedUser(null)}
      />
    ) : (
      <>
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Danh sách người dùng
          </h2>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#0B4DBA] hover:bg-[#0940A3] transition-all shadow-sm"
          >
            Thêm người dùng
          </button>
        </div>

        {/* table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <MaterialReactTable table={table} />
        </div>

        <CreateUserModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
        />
      </>
    )}
  </div>
);

}
