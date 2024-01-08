import { createSlice } from "@reduxjs/toolkit";
import { trendingMovies } from "../Api";

type Production = {
  name: string;
};
type Genres = {
  name: string;
};

// * Global state Selected Movie or Show details
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
    currentPage: 1 as number,
  },
  reducers: {
    changeEndpoint(state, action: { payload: string }) {
      state.currentEndpoint = action.payload;
    },
    tvShow(state, action: { payload: boolean }) {
      state.tvShow = action.payload;
    },
    setId(state, action: { payload: string }) {
      state.movieId = action.payload;
    },
    moviesDetails(state, action) {
      state.movieDetails = action.payload;
    },
    setPage(state, action: { payload: number }) {
      state.currentPage = action.payload;
    },
  },
});

export const { changeEndpoint, tvShow, setId, moviesDetails, setPage } =
  endpoints.actions;
export default endpoints.reducer;
