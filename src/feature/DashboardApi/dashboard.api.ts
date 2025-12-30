import { appApi } from "@/lib/appApi";
import type { DashboardResponse } from "@/feature/DashboardApi/type";

export const dashboardApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /dashboard
    getDashboard: build.query<DashboardResponse, void>({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardQuery,
} = dashboardApi;
