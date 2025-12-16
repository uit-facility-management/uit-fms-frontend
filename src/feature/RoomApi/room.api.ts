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
  }),
});

export const { useGetRoomQuery, useCreateRoomMutation, useGetBuildingsQuery } = roomApi;
