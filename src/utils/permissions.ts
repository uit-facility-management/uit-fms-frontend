// ============================================
// FILE: utils/permissions.ts
// TẠO FILE MỚI - Copy toàn bộ code này
// ============================================

export type UserRole = "admin" | "manager" | "user";

export type TabKey =
  | "home"
  | "personal"
  | "calendar"
  | "room"
  | "tools"
  | "facility"
  | "user"
  | "management";

// Cấu hình quyền truy cập cho từng role
export const TAB_PERMISSIONS: Record<UserRole, TabKey[]> = {
  // Admin: Truy cập tất cả
  admin: [
    "home",
    "personal",
    "calendar",
    "room",
    "tools",
    "facility",
    "user",
    "management",
  ],

  // Manager: Không có quyền "Quản lý người dùng"
  manager: [
    "home",
    "personal",
    "calendar",
    "room",
    "tools",
    "facility",
    "management",
  ],

  // User: Chỉ có quyền cơ bản
  user: ["personal", "room"],
};

// Kiểm tra xem user có quyền truy cập tab không
export const canAccessTab = (
  userRole: UserRole | undefined,
  tab: TabKey
): boolean => {
  if (!userRole) return false;
  return TAB_PERMISSIONS[userRole]?.includes(tab) ?? false;
};

// Lấy danh sách tabs mà user được phép truy cập
export const getAccessibleTabs = (userRole: UserRole | undefined): TabKey[] => {
  if (!userRole) return ["home"];
  return TAB_PERMISSIONS[userRole] || ["home"];
};
