import { createSlice } from "@reduxjs/toolkit";
import { trendingMovies } from "../Api";

const endpoints = createSlice({
  name: "endpoint",
  initialState: {
    currentEndpoint: trendingMovies as string,
    tvShow: false as boolean,
    currentPage: 1 as number,
  },
  reducers: {
    //*Change currentEndpoint (used in navbar buttons)
    changeEndpoint(state, action: { payload: string }) {
      state.currentEndpoint = action.payload;
    },
    tvShow(state, action: { payload: boolean }) {
      state.tvShow = action.payload;
    },
    setPage(state, action: { payload: number }) {
      state.currentPage = action.payload;
    },
  },
});

export const { changeEndpoint, tvShow, setPage } = endpoints.actions;
export default endpoints.reducer;
