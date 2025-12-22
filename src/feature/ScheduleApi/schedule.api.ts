import { appApi } from "@/lib/appApi";
import type { ScheduleResponseByIdUser } from "./type";

export const scheduleApi = appApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /api/v1/user/{id}/schedules
    getSchedulesByUserId: builder.query<
      ScheduleResponseByIdUser[],
      string
    >({
      query: (userId) => `/user/${userId}/schedules`,
      keepUnusedDataFor: 60,
      providesTags: (_result, _error, userId) => [
        { type: "Schedule", id: userId },
      ],
    }),
  }),
});

export const {
  useGetSchedulesByUserIdQuery,
} = scheduleApi;
