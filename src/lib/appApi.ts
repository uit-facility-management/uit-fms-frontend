import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://uit-fms-backend-production.up.railway.app/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["RoomAsset", "Room", "User", "Incident", "Tools", "Schedule"],


  endpoints: () => ({}),
});
