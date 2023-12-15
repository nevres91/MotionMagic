import { createSlice } from "@reduxjs/toolkit";
import { trendingMovies } from "../Api";

const endpoints = createSlice({
  name: "endpoint",
  initialState: {
    currentEndpoint: trendingMovies,
    tvShow: false,
  },
  reducers: {
    changeEndpoint(state, action) {
      state.currentEndpoint = action.payload;
    },
    tvShow(state, action) {
      state.tvShow = action.payload;
    },
  },
});

export const { changeEndpoint, tvShow } = endpoints.actions;
export default endpoints.reducer;
