import { appApi } from "@/lib/appApi";
import type {
  RoomAssetResponse,
  CreateFacilityRequest,
  UpdateFacilityRequest,
} from "./type";

export const roomAssetApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- GET ----------
    getRoomAssets: builder.query<RoomAssetResponse[], void>({
      query: () => "/room-assets",
      keepUnusedDataFor: 60,
      providesTags: ["RoomAsset"],
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
    updateFacility: builder.mutation<RoomAssetResponse, { id: string; body: UpdateFacilityRequest }>({
      query: ({ id, body }) => ({
        url: `/room-assets/${id}`,
        method: "PATCH",
        body,
      }),
      //  refetch update
      invalidatesTags: ["RoomAsset"]
    }),
  }),
});

export const {
  useGetRoomAssetsQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation, // 👈 export thêm hook
} = roomAssetApi;
