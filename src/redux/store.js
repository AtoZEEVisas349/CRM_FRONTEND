import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Ensure correct path

const store = configureStore({
  reducer: {
    auth: authReducer, // Ensure this matches your slice
  },
});

export default store;
