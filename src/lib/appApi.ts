import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3002/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: () => ({}),
});
