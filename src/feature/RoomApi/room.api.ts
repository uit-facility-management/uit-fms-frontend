import { appApi } from "@/lib/appApi";
import type {RoomResponse} from "./type";

export const roomApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoom: builder.query<RoomResponse[], void>({
      query: () => ({ url: "/room", method: "GET" }),
    }),
  }),
});

export const { useGetRoomQuery } = roomApi;
