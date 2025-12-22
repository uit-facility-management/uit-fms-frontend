import { appApi } from "@/lib/appApi";
import type { 
  ToolsResponse,
  CreateToolRequest,
  UpdateToolRequest,
 } from "./type";

export const toolApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getTools: builder.query<ToolsResponse[], void>({
      query: () => "/device",
      providesTags: ["Tools"],
    }),

    updateTool: builder.mutation<
      ToolsResponse,
      { id: string; body: UpdateToolRequest }
    >({
      query: ({ id, body }) => ({
        url: `/device/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tools"], 
    }),

    createTool: builder.mutation<ToolsResponse, CreateToolRequest>({
      query: (body) => ({
        url: "/device",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tools"],
    }),
  }),
});

export const { 
  useGetToolsQuery,
  useCreateToolMutation,
  useUpdateToolMutation,
} = toolApi;
  