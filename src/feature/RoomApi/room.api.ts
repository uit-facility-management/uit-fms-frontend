import { appApi } from "@/lib/appApi";
import type { RoomResponse } from "./type";

export const roomApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoom: builder.query<{ roomsData: RoomResponse[] }, void>({
      query: () => "/room",
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetRoomQuery } = roomApi;
