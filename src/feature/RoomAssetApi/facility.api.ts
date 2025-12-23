import { appApi } from "@/lib/appApi";
import type {
  RoomAssetResponse,
  CreateFacilityRequest,
  UpdateFacilityRequest,
} from "./type";

export const roomAssetApi = appApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ---------- GET ----------
    getRoomAssets: builder.query<RoomAssetResponse[], void>({
      query: () => "/room-assets",
      keepUnusedDataFor: 1,
      providesTags: ["RoomAsset"],
    }),

    // ---------- GET BY ID ----------
    getRoomAssetById: builder.query<RoomAssetResponse, string>({
      query: (id) => `/room-assets/${id}`,
      keepUnusedDataFor: 1,
      providesTags: (result, error, id) => [{ type: "RoomAsset", id }],
    }),

    // ---------- POST ----------
    createFacility: builder.mutation<RoomAssetResponse, CreateFacilityRequest>({
      query: (body) => ({
        url: "/room-assets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RoomAsset"],
    }),

    // ---------- PATCH ----------
    updateFacility: builder.mutation<
      RoomAssetResponse,
      { id: string; body: UpdateFacilityRequest }
    >({
      query: ({ id, body }) => ({
        url: `/room-assets/${id}`,
        method: "PATCH",
        body,
      }),
      //  refetch update
      invalidatesTags: ["RoomAsset"],
    }),

    // ---------- DELETE ----------
    deleteFacility: builder.mutation<void, string>({
      query: (id) => ({
        url: `/room-assets/${id}`,
        method: "DELETE",
      }),
      // Xóa xong refetch
      invalidatesTags: ["RoomAsset"],
    }),
  }),
});

export const {
  useGetRoomAssetsQuery,
  useGetRoomAssetByIdQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
} = roomAssetApi;
