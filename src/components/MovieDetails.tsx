import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../Api";
import axios from "axios";
import Similar from "./Similar";
type details = {
  secondaryRes: {
    name: string;
    poster_path: string;
    title: string;
    overview: string;
    release_date: string;
    first_air_date: string;
    runtime: number;
    number_of_episodes: number;
    number_of_seasons: number;
    production_companies: [];
    genres: [];
    backdrop_path: string;
    videos: {
      results: {
        name: string;
        key: string;
      }[];
    };
  };
  omdbRes: {
    imdbRating: string;
    Country: string;
    Director: string;
    Actors: string[];
  };
};

const MovieDetails: React.FC = () => {
  const [movieDetails, setMovieDetails] = useState<details | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const secondaryRes = await request(
          `${
            params.type === "show" ? `tv/${params.id}` : `movie/${params.id}`
          }`,
          {
            params: {
              append_to_response: "external_ids,videos",
            },
          }
        );
        const imdb_id =
          params.type === "movie"
            ? secondaryRes.data.imdb_id
            : secondaryRes.data.external_ids.imdb_id;
        const omdbRes = await axios.get(`https://www.omdbapi.com/`, {
          params: {
            apikey: process.env.REACT_APP_OMDB_API_KEY,
            i: imdb_id,
          },
        });
        const details = {
          secondaryRes: secondaryRes.data,
          omdbRes: omdbRes.data,
        };
        setMovieDetails(details as any);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();
  }, [params.id, params.type]);

  if (!movieDetails) {
    return (
      <div className="details-body loading">
        <div className="loader">
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
        </div>
      </div>
    );
  }
  const { secondaryRes, omdbRes } = movieDetails;
  const {
    backdrop_path,
    poster_path,
    first_air_date,
    overview,
    title,
    genres,
    number_of_seasons,
    number_of_episodes,
    runtime,
    production_companies,
    videos,
    name,
    release_date,
  } = secondaryRes;

  const { imdbRating, Country, Director, Actors } = omdbRes;

  // *Play trailer
  const playTrailer = () => {
    if (videos) {
      const filteredVideos = videos.results
        .filter(
          (video) => video.name && video.name.toLowerCase().includes("trailer")
        )
        .map((video) => {
          return video.key;
        });
      window.open(`https://www.youtube.com/watch?v=${filteredVideos[0]}`);
    } else {
      alert("Trailer Unavailable!");
    }
  };

  return (
    <div className="details-body">
      {omdbRes ? (
        <div className="details-container">
          <div
            className="details-movie-image"
            style={
              backdrop_path
                ? {
                    background: `url(https://image.tmdb.org/t/p/original/${backdrop_path}) no-repeat center center/cover`,
                  }
                : {}
            }
          >
            <div className="overview-container">
              <div className="movie-card">
                <div
                  className="movie-cover"
                  style={
                    poster_path
                      ? {
                          background: `url(https://image.tmdb.org/t/p/original/${poster_path}) no-repeat center center/cover`,
                        }
                      : {}
                  }
                ></div>
                <button onClick={playTrailer} className="trailer-btn">
                  <span className="material-symbols-outlined">
                    smart_display
                  </span>
                  Trailer
                </button>
              </div>
              <div className="overview-content">
                <div className="movie-overview">
                  <h1>{first_air_date ? name : title}</h1>
                  <p>{overview}</p>
                </div>
                <div className="button-div">
                  <button onClick={playTrailer} className="trailer-btn">
                    {" "}
                    <span className="material-symbols-outlined">
                      smart_display
                    </span>
                    Play Trailer
                  </button>
                </div>
                <div className="other-details">
                  <ul>
                    <li>
                      <p>
                        <span className="imdb">IMDB:</span> {imdbRating}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Release Date:</span>{" "}
                        {first_air_date
                          ? first_air_date
                          : release_date
                          ? release_date
                          : "N/A"}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Genre:</span>{" "}
                        {genres
                          ? genres.map((genre: any) => `${genre.name}, `)
                          : "N/A"}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Country:</span> {Country}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Duration:</span>{" "}
                        {first_air_date
                          ? "S" + number_of_seasons + " E" + number_of_episodes
                          : runtime
                          ? JSON.stringify(runtime) + " min"
                          : "N/A"}{" "}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Directed by:</span> {Director}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Production:</span>{" "}
                        {production_companies.map(
                          (prod: any) => `${prod.name}, `
                        )}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Casts:</span> {Actors}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="similar-container">
        <Similar />
      </div>
    </div>
  );
};

export default MovieDetails;
