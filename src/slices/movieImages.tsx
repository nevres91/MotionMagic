import { createSlice } from "@reduxjs/toolkit";

const movieImages = createSlice({
  name: "images",
  initialState: {
    randomImage: [] as string[], // *One random image of 20 fetched movies
  },
  reducers: {
    fetchImages(state, action: { payload: string[] }) {
      state.randomImage = action.payload;
    },
  },
});

export const { fetchImages } = movieImages.actions;
export default movieImages.reducer;
