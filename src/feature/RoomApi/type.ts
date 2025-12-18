export interface RoomResponse {
  id: string;
  name: string;
  stage: number;
  capacity: number;

  status: "active" | "inactive" | "maintenance";
  type: "meeting" | "classroom" | "lab" | string;

  building: BuildingDTO;
}

export interface BuildingDTO {
  id: string;
  name: string;
  status: "active" | "inactive";
}


export interface CreateRoomRequest {
  name: string;
  status: "active" | "inactive" | "maintenance";
  stage: number;
  type: "meeting" | "lab" | "classroom";
  capacity: number;
  building_id: string;
};

export type RoomAssetResponse = {
  id: string;
  name: string;
  type: "Electronics" | "Furniture" | "Stationery" | "Other";
  status: "ACTIVE" | "INACTIVE";
  room: {
    id: string;
    name: string;
    status: "active" | "inactive" | "maintenance";
    stage: number;
    type: "meeting" | "lab" | "classroom";
    capacity: number;
    building: {
      id: string;
      name: string;
      status: "active" | "inactive";
    };
  };
};

export type CreateRoomAssetRequest = {
  name: string;
  type: "Electronics" | "Furniture" | "Stationery" | "Other";
  room_id: string;
  status: "ACTIVE" | "INACTIVE";
};
