import axios from "axios";
export const appendToResponse = "&append_to_response=";

export const imgBaseUrl = "https://image.tmdb.org/t/p/w500";
export const imgBaseUrlMobile = "https://image.tmdb.org/t/p/w300";

//  Movies
export const popularMovies = "movie/popular";
export const similarMovies = "movie/";
export const topRatedMovies = "movie/top_rated";
export const trendingMovies = "trending/movie/day";

// TV Shows
export const popularShows = "tv/popular";
export const topRatedShows = "tv/top_rated";
export const trendingShows = "trending/tv/day";

export const request = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: process.env.REACT_APP_API_KEY,
  },
});
