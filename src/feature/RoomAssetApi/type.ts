import { RoomResponse } from "../RoomApi/type";

// GET /api/v1/room-assets

export interface RoomAssetResponse {
  id: string;
  name: string;
  type: "Electronics" | "Furniture" | "Stationery" | "Other" | string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | string;
  room: RoomResponse;
}
// POST /api/v1/room-assets

export interface CreateFacilityRequest {
  name: string;
  type: "Electronics" | "Furniture" | "Stationery" | "Other" | string;
  room_id: string; // FK → room.id
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | string;
}

// PATCH /api/v1/room-assets/{id}
export interface UpdateFacilityRequest {
  name: string;
  type: "Electronics" | "Furniture" | "Stationery" | "Other" | string;
  room_id: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | string;
}


// ---------- API wrapper ----------
export type GetRoomAssetsResponse = RoomAssetResponse[];
