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