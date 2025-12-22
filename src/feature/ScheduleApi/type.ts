import type { UserResponse } from "@/feature/UserApi/type";
import type { RoomResponse } from "@/feature/RoomApi/type";

export interface ScheduleResponseByIdUser {
  id: string;

  start_time: string;
  end_time: string;

  period_start: number;
  period_end: number;

  status: "pending" | "approved" | "rejected" | string;

  room: Pick<
    RoomResponse,
    "id" | "name" | "status" | "stage" | "type" | "capacity"
  >;

  createdBy: UserResponse;
}
