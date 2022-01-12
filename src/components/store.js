import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});
