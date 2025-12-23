import { appApi } from "@/lib/appApi";
import type { BorrowTicket } from "./type";

export const borrowTicketApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBorrowTickets: builder.query<BorrowTicket[], void>({
      query: () => "/borrow-ticket",
      providesTags: ["BorrowTickets"],
    }),
  }),
});

export const {
  useGetAllBorrowTicketsQuery,
} = borrowTicketApi;