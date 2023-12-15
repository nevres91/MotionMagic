import { createSlice } from "@reduxjs/toolkit";
import { trendingMovies } from "../Api";

const endpoints = createSlice({
  name: "endpoint",
  initialState: { currentEndpoint: trendingMovies },
  reducers: {
    changeEndpoint(state, action) {
      state.currentEndpoint = action.payload;
    },
  },
});

export const { changeEndpoint } = endpoints.actions;
export default endpoints.reducer;
