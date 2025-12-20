import { appApi } from "@/lib/appApi";
import type {UserResponse, CreateUserRequest, UpdateUserRequest,} from "./type";

export const userApi = appApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get
    getUsers: builder.query<UserResponse[], void>({
      query: () => "/user",
      keepUnusedDataFor: 60,
      providesTags: ["User"],
    }),

    // get by id
    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/user/${id}`,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    // post
    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // patch
    updateUser: builder.mutation<UserResponse, { id: string; body: UpdateUserRequest }>({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),

    // change password
    changePassword: builder.mutation<UserResponse,{ id: string; body: { password: string } }>({
      query: ({ id, body }) => ({
        url: `/user/${id}/change-password`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),

    // delete
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
} = userApi;
