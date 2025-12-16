import { appApi } from "@/lib/appApi";
import type { RoomResponse, CreateRoomRequest, BuildingDTO } from "./type";

export const roomApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoom: builder.query<{ roomsData: RoomResponse[] }, void>({
      query: () => "/room",
      keepUnusedDataFor: 60,
    }),

    getBuildings: builder.query<BuildingDTO[], void>({
      query: () => "/building",
      keepUnusedDataFor: 60,
    }),

    createRoom: builder.mutation<RoomResponse, CreateRoomRequest>({
      query: (body) => ({
        url: "/room",
        method: "POST",
        body,
      }),
    }),

    updateRoom: builder.mutation<RoomResponse, { id: string; body: CreateRoomRequest }>({
      query: ({ id, body }) => ({
        url: `/room/${id}`,
        method: "PATCH",
        body,
      }),
    }),

  }),
});

export const { useGetRoomQuery, useCreateRoomMutation, useGetBuildingsQuery , useUpdateRoomMutation,} = roomApi;
