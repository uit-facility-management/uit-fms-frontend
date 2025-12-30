import { appApi } from "@/lib/appApi";
import type { 
  RoomResponse, 
  CreateRoomRequest, 
  BuildingDTO, 
  RoomAssetResponse, 
  CreateRoomAssetRequest ,
  RoomQueryParams
} from "./type";

export const roomApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoom: builder.query<{ roomsData: RoomResponse[] }, RoomQueryParams | void>({
      query: (params) => ({
        url: "/room",
        params: params ?? undefined,
      }),
      keepUnusedDataFor: 60,
    }),

    getBuildings: builder.query<BuildingDTO[], void>({
      query: () => "/building",
      keepUnusedDataFor: 60,
    }),

    createRoom: builder.mutation<RoomResponse, CreateRoomRequest>({
      query: (body) => ({
        url: "/room",
        method: "POST",
        body,
      }),
    }),

    updateRoom: builder.mutation<RoomResponse, { id: string; body: CreateRoomRequest }>({
      query: ({ id, body }) => ({
        url: `/room/${id}`,
        method: "PATCH",
        body,
      }),
    }),

    getRoomAssets: builder.query<RoomAssetResponse[], void>({
      query: () => "/room-assets",
      keepUnusedDataFor: 60,
    }),

    createRoomAsset: builder.mutation<RoomAssetResponse, CreateRoomAssetRequest>({
      query: (body) => ({
        url: "/room-assets",
        method: "POST",
        body,
      }),
    }),

    updateRoomAsset: builder.mutation<
      RoomAssetResponse,
      { id: string; body: CreateRoomAssetRequest }
    >({
      query: ({ id, body }) => ({
        url: `/room-assets/${id}`,
        method: "PATCH",
        body,
      }),
    }),

    deleteRoomAsset: builder.mutation<{ message?: string } | void, { id: string }>({
      query: ({ id }) => ({
        url: `/room-assets/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const { 
  useGetRoomQuery, 
  useCreateRoomMutation, 
  useGetBuildingsQuery , 
  useUpdateRoomMutation,
  useGetRoomAssetsQuery,
  useCreateRoomAssetMutation,
  useUpdateRoomAssetMutation,
  useDeleteRoomAssetMutation,
} = roomApi;
