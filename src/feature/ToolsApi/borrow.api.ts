import { appApi } from "@/lib/appApi";
import type { BorrowTicket, Student, CreateBorrowTicketRequest, BorrowTicketResponse } from "./type";

export const borrowTicketApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBorrowTickets: builder.query<BorrowTicket[], void>({
      query: () => "/borrow-ticket",
      providesTags: ["BorrowTickets"],
    }),

    getStudents: builder.query<Student[], void>({
      query: () => "/student",
    }),

    createBorrowTicket: builder.mutation<
      BorrowTicketResponse,
      CreateBorrowTicketRequest
    >({
      query: (body) => ({
        url: "/borrow-ticket",
        method: "POST",
        body,
      }),
    }),

    // RETURN (PATCH)
    returnBorrowTicket: builder.mutation<
      BorrowTicket,
      string 
    >({
      query: (id) => ({
        url: `/borrow-ticket/return/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["BorrowTickets"],
    }),
  }),
});

export const {
  useGetAllBorrowTicketsQuery,
  useGetStudentsQuery,
  useCreateBorrowTicketMutation,
  useReturnBorrowTicketMutation,
} = borrowTicketApi;