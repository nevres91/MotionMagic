import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../store";
import Similar from "./Similar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { moviesDetails } from "../slices/endpoints";

const MovieDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movieDetails = useSelector(
    (state: RootState) => state.endpoints.movieDetails
  );
  const isMovieDetailsEmpty = Object.keys(movieDetails).length === 0;
  useEffect(() => {
    const storedDetails = localStorage.getItem("DETAILS");
    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails);
      dispatch(moviesDetails(parsedDetails));
    }
  }, [dispatch]);

  const {
    title,
    overview,
    imdb,
    duration,
    first_air_date,
    released,
    production,
    country,
    director,
    casts,
    backdrop_path,
    poster_path,
    genres,
    show_name,
    number_of_episodes,
    number_of_seasons,
    videos,
    Tvideos,
  } = movieDetails;

  // *Extracting year from release date
  function trimDate(date: string) {
    if (date) {
      const trimmed = date.substring(0, 4);
      return trimmed;
    } else {
      return "Loading...";
    }
  }

  // *Play trailer
  const playTrailer = () => {
    if (videos) {
      const filteredVideos = videos.results
        .filter(
          (video: any) =>
            video.name && video.name.toLowerCase().includes("trailer")
        )
        .map((video: any) => {
          return video.key;
        });
      window.open(`https://www.youtube.com/watch?v=${filteredVideos[0]}`);
    } else {
      alert("Trailer Unavailable!");
    }
  };

  return (
    <div className="details-body">
      {!isMovieDetailsEmpty ? (
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
                  <h1>{first_air_date ? show_name : title}</h1>
                  <p>{overview}</p>
                </div>
                <div className="button-div">
                  <button className="trailer-btn">
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
                        <span className="imdb">IMDB:</span> {imdb}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Released:</span>{" "}
                        {trimDate(
                          first_air_date
                            ? first_air_date
                            : released
                            ? released
                            : "N/A"
                        )}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Genre:</span>{" "}
                        {genres
                          ? genres.map((genre) => `${genre.name}, `)
                          : "N/A"}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Country:</span> {country}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Duration:</span>{" "}
                        {first_air_date
                          ? "S" + number_of_seasons + " E" + number_of_episodes
                          : duration
                          ? JSON.stringify(duration) + " min"
                          : "N/A"}{" "}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Directed by:</span> {director}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Production:</span>{" "}
                        {production.map((prod) => `${prod.name}, `)}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Casts:</span> {casts}
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
