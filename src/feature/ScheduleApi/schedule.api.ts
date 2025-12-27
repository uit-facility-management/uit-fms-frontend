import { appApi } from "@/lib/appApi";
import type { Schedule, ScheduleResponseByIdUser } from "./type";

export const scheduleApi = appApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /api/v1/user/{id}/schedules
    getSchedulesByUserId: builder.query<ScheduleResponseByIdUser[], string>({
      query: (userId) => `/user/${userId}/schedules`,
      keepUnusedDataFor: 60,
      providesTags: (_result, _error, userId) => [
        { type: "Schedule", id: userId },
      ],
    }),

    // GET /api/v1/schedule
    getSchedules: builder.query<ScheduleResponseByIdUser[], void>({
      query: () => `/schedule`,
      keepUnusedDataFor: 5,
      providesTags: ["Schedule"],
    }),

    getRoomSchedules: builder.query<Schedule[], string>({
      query: (roomId) => `/room/${roomId}/schedules`,
      keepUnusedDataFor: 5,
      providesTags: ["Schedule"],
    }),
    // PATCH /api/v1/schedule/{id}/status
    updateScheduleStatus: builder.mutation<
      void,
      { scheduleId: string; status: "approved" | "rejected" }
    >({
      query: ({ scheduleId, status }) => ({
        url: `/schedule/${scheduleId}/status`,
        method: "PATCH",
        body: {
          schedule_status: status,
        },
      }),
      invalidatesTags: ["Schedule"],
    }),
  }),
});

export const {
  useGetSchedulesByUserIdQuery,
  useGetSchedulesQuery,
  useUpdateScheduleStatusMutation,
  useGetRoomSchedulesQuery
} = scheduleApi;
