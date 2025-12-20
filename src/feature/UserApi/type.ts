// GET /api/v1/user

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  fullName: string;
  password: string;

  role: "admin" | "user" | string;

  createdAt: string; 
  updatedAt: string;
}

// POST /api/v1/user

export interface CreateUserRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

// PATCH /api/v1/user/{id}

export type UpdateUserRequest = {
  username: string;
  fullName: string;
  email?: string;
};

// PUT /api/v1/user/{id}/change-password
export type ChangePasswordRequest = {
  password: string;
};



// API wrapper
export type GetUsersResponse = UserResponse[];
