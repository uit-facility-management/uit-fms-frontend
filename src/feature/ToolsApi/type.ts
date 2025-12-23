export interface ToolsResponse {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "BORROWING";
}

export type CreateToolRequest = {
  name: string;
  description: string;
};

export type UpdateToolRequest = {
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "BORROWING";
};

export interface BorrowTicketUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
}

export interface BorrowTicketRoom {
  id: string;
  name: string;
  status: string;
  stage: number;
  type: string;
  capacity: number;
}

export interface BorrowTicketDevice {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface BorrowTicketStudent {
  id: string;
  studentId: string;
  name: string;
  entryYear: number;
}

export interface BorrowTicket {
  id: string;
  borrowed_at: string;
  returned_at: string | null;
  status: "BORROWING" | "RETURNED";
  created_at: string;
  updated_at: string;
  user: BorrowTicketUser;
  room: BorrowTicketRoom;
  device: BorrowTicketDevice;
  student: BorrowTicketStudent;
}

export type Student = {
  id: string;
  student_code: number;
  name: string;
  entry_year: number;
  created_at: string;
  updated_at: string;
};

export type CreateBorrowTicketRequest = {
  student_code: number;
  create_by: string;
  device_id: string;
  room_id: string;
  status: "BORROWING" | "RETURNED";
};

export type BorrowTicketResponse = {
  id: string;
  student_code: string;
  device_id: string;
  room_id: string;
  status: string;
  created_at: string;
};

