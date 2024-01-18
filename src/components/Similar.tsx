import { request } from "../Api";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "axios";
import { setId } from "../slices/endpoints";
import Card from "./Card";
import SocialMedia from "./SocialMedia";
import { AppDispatch } from "../store";

type details = {
  id: string;
  original_language: string;
  poster_path: string;
  title: string;
  original_name: string;
  name: string;
  overview: string;
  release_date: string;
  first_air_date: string;
  runtime: number;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: [];
  genres: [];
  show_name: string;
  backdrop_path: string;
  trailerVideos: {
    results: {}[];
  };
  videos: {
    results: {
      name: string;
      key: string;
    }[];
  };
  spoken_languages: {
    english_name: string;
    iso_639_1?: string;
    name?: string;
  }[];
  omdbData: {
    imdbRating: string;
    Country: string;
    Director: string;
    Actors: string[];
    Genre: string[];
  };
};

interface Response<TData> {
  data: TData;
}
type ResponseData = Response<{
  id: string;
  name: string;
  original_language: string;
  poster_path: string;
  title: string;
  original_name: string;
  overview: string;
  release_date: string;
  first_air_date: string;
  runtime: number;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: [];
  genres: [];
  show_name: string;
  backdrop_path: string;
  trailerVideos: {
    results: {}[];
  };
  videos: {
    results: {
      name: string;
      key: string;
    }[];
  };
  spoken_languages: {
    english_name: string;
    iso_639_1?: string;
    name?: string;
  }[];
  omdbData: {
    imdbRating: string;
    Country: string;
    Director: string;
    Actors: string[];
    Genre: string[];
  };
  page: number;
  results: {
    backdrop_path: string;
    id: string;
  }[];
  total_pages: number;
  imdb_id: number;
  external_ids: {
    imdb_id: number;
  };
}>;
interface OmdbResponse<OData> {
  data: OData;
}
type OmdbResponseData = OmdbResponse<{
  imdbRating: string;
  Country: string;
  Director: string;
  Actors: string[];
  Genre: string[];
}>;

const Similar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tvShow = useSelector((state: RootState) => state.endpoints.tvShow);
  const [showItems, setShowItems] = useState<details[]>([]);
  const movieId = useSelector((state: RootState) => state.endpoints.movieId);

  useEffect(() => {
    const movieId: string = localStorage.getItem("MovieID")!;
    dispatch(setId(movieId));
    const fetchItems = async () => {
      try {
        if (movieId) {
          const response: ResponseData = await request(
            tvShow ? `tv/${movieId}/similar` : `movie/${movieId}/similar`
          );
          const { results } = response.data;
          const idRequest = results.map(async (result: any) => {
            const res: ResponseData = await request(
              `${tvShow ? `tv/${result.id}` : `movie/${result.id}`}`,
              {
                params: {
                  append_to_response: "external_ids,videos",
                },
              }
            );

            const imdb_id = !tvShow
              ? res.data.imdb_id
              : res.data.external_ids.imdb_id;

            const omdbRes: OmdbResponseData = await axios.get(
              `https://www.omdbapi.com/`,
              {
                params: {
                  apikey: process.env.REACT_APP_OMDB_API_KEY,
                  i: imdb_id,
                },
              }
            );
            return {
              ...res.data,
              omdbData: omdbRes.data,
              trailerVideos: res.data.videos,
            };
          });
          const details = await Promise.all(idRequest);
          setShowItems(details);
        }
      } catch (error) {
        console.log("something went similar:", error);
      }
    };
    fetchItems();
  }, [movieId]);
  return (
    <div className="similar-container">
      <h1>You may also like:</h1>
      <div className="cards-container">
        {showItems.length < 1 ? (
          <div className="loader">
            <div className="loader__circle"></div>
            <div className="loader__circle"></div>
            <div className="loader__circle"></div>
            <div className="loader__circle"></div>
            <div className="loader__circle"></div>
          </div>
        ) : (
          showItems.map((item) => {
            return (
              <Card
                key={item.id}
                id={item.id}
                poster_path={item.poster_path}
                original_language={item.original_language}
                overview={item.overview}
                title={item.title}
                release_date={item.release_date}
                runtime={item.runtime}
                spoken_languages={item.spoken_languages}
                omdbData={item.omdbData}
                first_air_date={item.first_air_date}
                original_name={item.name}
                number_of_episodes={item.number_of_episodes}
                number_of_seasons={item.number_of_seasons}
                backdrop_path={item.backdrop_path}
                production_companies={item.production_companies}
                genres={item.genres}
                show_name={item.name}
                trailerVideos={item.trailerVideos}
                videos={item.videos}
                name={item.name}
              />
            );
          })
        )}
      </div>
      <SocialMedia />
    </div>
  );
};

export default Similar;
