import { createSlice } from "@reduxjs/toolkit";

const movieImages = createSlice({
  name: "images",
  initialState: {
    randomImage: [] as string[], // *One random image of 20 fetched movies
    movieImage: "" as string, // *Image of a selected movie
  },
  reducers: {
    fetchImages(state, action: { payload: string[] }) {
      state.randomImage = action.payload;
    },
    singleImage(state, action: { payload: string }) {
      state.movieImage = action.payload;
    },
  },
});

export const { fetchImages, singleImage } = movieImages.actions;
export default movieImages.reducer;
