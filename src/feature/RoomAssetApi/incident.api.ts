import { appApi } from "@/lib/appApi";
import type {
  RoomIncidentResponse,
  CreateIncidentRequest,
  UpdateIncidentRequest,
} from "./type";

export const incidentApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getIncidents: build.query<RoomIncidentResponse[], void>({
      query: () => ({
        url: "/incident",
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Incident"],
    }),

    getRoomIncidents: build.query<RoomIncidentResponse[], { roomId: string }>({
      query: ({ roomId }) => ({
        url: `/room/${roomId}/incidents`,
        method: "GET",
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Incident" as const, id })),
              { type: "Incident", id: "LIST" },
            ]
          : [{ type: "Incident", id: "LIST" }],
    }),

    createIncident: build.mutation<RoomIncidentResponse, CreateIncidentRequest>(
      {
        query: (body) => ({
          url: "/incident",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "Incident", id: "LIST" }],
      }
    ),

    updateIncident: build.mutation<
      RoomIncidentResponse,
      { id: string; body: UpdateIncidentRequest }
    >({
      query: ({ id, body }) => ({
        url: `/incident/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Incident", id: arg.id },
        { type: "Incident", id: "LIST" },
      ],
    }),

    deleteIncident: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/incident/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Incident", id: arg.id },
        { type: "Incident", id: "LIST" },
      ],
    }),
    updateIncidentStatus: build.mutation<
      void,
      { incidentId: string; status: "resolved" | "pending" }
    >({
      query: ({ incidentId, status }) => ({
        url: `/incident/${incidentId}/status`,
        method: "PATCH",
        body: {
          status,
        },
      }),
      invalidatesTags: ["Incident"],
    }),
  }),
});

export const {
  useGetIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
  useGetRoomIncidentsQuery,
  useUpdateIncidentStatusMutation,
} = incidentApi;
