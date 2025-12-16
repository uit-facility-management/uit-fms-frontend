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
