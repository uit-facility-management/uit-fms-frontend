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

export const TAB_PERMISSIONS: Record<UserRole, TabKey[]> = {
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

  manager: [
    "home",
    "personal",
    "calendar",
    "room",
    "tools",
    "facility",
    "management",
  ],

  user: ["personal", "room"],
};

export const canAccessTab = (
  userRole: UserRole | undefined,
  tab: TabKey
): boolean => {
  if (!userRole) return false;
  return TAB_PERMISSIONS[userRole]?.includes(tab) ?? false;
};

export const getAccessibleTabs = (userRole: UserRole | undefined): TabKey[] => {
  if (!userRole) return ["home"];
  return TAB_PERMISSIONS[userRole] || ["home"];
};
