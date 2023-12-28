import { createSlice } from "@reduxjs/toolkit";
import { trendingMovies } from "../Api";

type Production = {
  name: string;
};
type Genres = {
  name: string;
};

type details = {
  title: string;
  overview: string;
  imdb: string;
  duration: number;
  first_air_date: string;
  released: string;
  production: Production[];
  country: string;
  director: string;
  casts: string[];
  backdrop_path: string;
  poster_path: string;
  genres: Genres[];
  show_name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  videos: {
    results: [];
  };
  Tvideos: {
    results: [];
  };
};

const endpoints = createSlice({
  name: "endpoint",
  initialState: {
    currentEndpoint: trendingMovies as string,
    tvShow: false as boolean,
    movieId: "" as string,
    movieDetails: {} as details,
  },
  reducers: {
    changeEndpoint(state, action) {
      state.currentEndpoint = action.payload;
    },
    tvShow(state, action) {
      state.tvShow = action.payload;
    },
    setId(state, action) {
      state.movieId = action.payload;
    },
    moviesDetails(state, action) {
      state.movieDetails = action.payload;
    },
  },
});

export const { changeEndpoint, tvShow, setId, moviesDetails } =
  endpoints.actions;
export default endpoints.reducer;
