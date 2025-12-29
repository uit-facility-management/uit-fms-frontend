import { RoomResponse } from "../RoomApi/type";
import { UserResponse } from "../UserApi/type";


export interface RoomAssetResponse {
  id: string;
  name: string;
  type: "Electronics" | "Furniture" | "Stationery" | "Other" | string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | string;
  room: RoomResponse;
}

export interface CreateFacilityRequest {
  name: string;
  type: "Electronics" | "Furniture" | "Stationery" | "Other" | string;
  room_id: string; // FK → room.id
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | string;
}

export interface UpdateFacilityRequest {
  name: string;
  type: "Electronics" | "Furniture" | "Stationery" | "Other" | string;
  room_id: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | string;
}

export interface CreateIncidentRequest {
  description: string;
  room_asset_id: string;
  created_by: string;
  status: "pending" | "resolved";
}

export interface RoomIncidentResponse {
  id: string;
  description: string;
  room_asset_id: string;
  created_user: UserResponse;
  status: "pending" | "resolved";
  createdAt: string;
  updatedAt: string;
  room_asset?: RoomAssetResponse;
}

export interface UpdateIncidentRequest {
  description: string;
  room_asset_id: string;
  created_by: string;
  status: "pending" | "resolved";
}

export type RoomAssetQueryParams = {
  q?: string;
  type?: "Electronics" | "Furniture" | "Stationery" | "Other";
  status?: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  roomId?: string;
  buildingId?: string;
};

export type GetRoomAssetsResponse = RoomAssetResponse[];
export type GetRoomIncidentsResponse = RoomIncidentResponse[];
