import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./components/settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});
