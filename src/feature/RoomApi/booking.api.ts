import { appApi } from "@/lib/appApi";
import type { RoomResponse, GetFreeRoomsParams, ScheduleResponse, CreateScheduleRequest } from "@/feature/RoomApi/type";

export const bookingApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getFreeRooms: build.query<RoomResponse[], GetFreeRoomsParams>({
      query: (params) => ({
        url: "/room/free",
        method: "GET",
        params,
      }),
      providesTags: ["Room"],
    }),

    createSchedule: build.mutation<ScheduleResponse, CreateScheduleRequest>({
      query: (body) => ({
        url: "/schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Room"],
    }),

  }),
});

export const { 
  useGetFreeRoomsQuery,
   useCreateScheduleMutation,
} = bookingApi;