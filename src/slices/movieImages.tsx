import { createSlice } from "@reduxjs/toolkit";

const movieImages = createSlice({
  name: "images",
  initialState: {
    randomImage: [] as string[],
    movieImage: "" as string,
  },
  reducers: {
    fetchImages(state, action) {
      state.randomImage = action.payload;
    },
    singleImage(state, action) {
      state.movieImage = action.payload;
    },
  },
});

export const { fetchImages, singleImage } = movieImages.actions;
export default movieImages.reducer;
