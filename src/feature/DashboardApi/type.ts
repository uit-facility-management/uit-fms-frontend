import type {
  BorrowTicketDevice,
  Student,
} from "@/feature/ToolsApi/type";

/* =======================
 * Room Assets
 * ======================= */
export interface DashboardRoomAssets {
  totalAssets: number;
  activeAssets: number;
  inactiveAssets: number;
}

/* =======================
 * Rooms
 * ======================= */
export interface DashboardRooms {
  totalRooms: number;
  availableRooms: number;
}

/* =======================
 * Borrowed Tickets
 * ======================= */

export interface DashboardBorrowedTicket {
  id: string;
  borrowed_at: string;
  returned_at: string | null;
  status: "BORROWING" | "RETURNED";
  created_at: string;
  updated_at: string;

  device: BorrowTicketDevice;
  student: Student;
}

export interface DashboardBorrowedTickets {
  currentlyBorrowed: number;
  overdueBorrowed: DashboardBorrowedTicket[];
}

/* =======================
 * Schedules
 * ======================= */
export interface DashboardSchedules {
  pendingSchedules: number;
}

/* =======================
 * Incidents
 * ======================= */

export interface WeeklyIncident {
  date: string;
  count: number;
}

export interface MonthlyIncident {
  month: number;
  count: number;
}

export interface DashboardIncident {
  pendingIncidents: number;
  weeklyIncidents: WeeklyIncident[];
  monthlyIncidents: MonthlyIncident[];
}

/* =======================
 * Dashboard Response
 * ======================= */

export interface DashboardResponse {
  roomAssets: DashboardRoomAssets;
  rooms: DashboardRooms;
  borrowedTickets: DashboardBorrowedTickets;
  schedules: DashboardSchedules;
  incident: DashboardIncident;
}
