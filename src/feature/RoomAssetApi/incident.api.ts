import { appApi } from "@/lib/appApi";
import type { RoomIncidentResponse, CreateIncidentRequest, UpdateIncidentRequest } from "./type"; 

export const incidentApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getIncidents: build.query<RoomIncidentResponse[], void>({
      query: () => ({
        url: "/incident",
        method: "GET",
        keepUnusedDataFor: 60,
      }),
    }),

    createIncident: build.mutation<RoomIncidentResponse, CreateIncidentRequest>({
      query: (body) => ({
        url: "/incident",
        method: "POST",
        body,
      }),
    }),

    updateIncident: build.mutation<
      RoomIncidentResponse,
      { id: string; body: UpdateIncidentRequest }
    >({
      query: ({ id, body }) => ({
        url: `/incident/${id}`,
        method: "PATCH",
        body,
      }),
    }),

    deleteIncident: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/incident/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useGetIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
} = incidentApi;
