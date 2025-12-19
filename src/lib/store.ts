import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./appApi";
import authReducer from "@/feature/auth/auth.slice";
export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) => getDefault().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
