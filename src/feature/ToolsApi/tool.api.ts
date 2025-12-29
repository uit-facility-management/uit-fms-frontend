import { appApi } from "@/lib/appApi";
import type { 
  ToolsResponse,
  CreateToolRequest,
  UpdateToolRequest,
  BorrowTicket,
  ToolsQueryParams
 } from "./type";

export const toolApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getTools: builder.query<ToolsResponse[], ToolsQueryParams | void>({
      query: (params) => ({
        url: "/device",
        params: params ?? undefined,
      }),
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

    getBorrowTickets: builder.query<BorrowTicket[], string>({
      query: (id) => `/device/${id}/borrow-tickets`,
      providesTags: (result, error, id) => [{ type: "BorrowTickets", id }],
    }),

  }),
});

export const { 
  useGetToolsQuery,
  useCreateToolMutation,
  useUpdateToolMutation,
  useGetBorrowTicketsQuery,
} = toolApi;
  