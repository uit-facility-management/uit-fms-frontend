import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3002/api/v1",
  }),

  endpoints: () => ({}),
});
