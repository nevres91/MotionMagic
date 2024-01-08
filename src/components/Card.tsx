import React, { useEffect, useState } from "react";
import { imgBaseUrl, imgBaseUrlMobile } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { singleImage } from "../slices/movieImages";
import { moviesDetails, setId } from "../slices/endpoints";
import { useNavigate } from "react-router-dom";

type details = {
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
    results: {}[];
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

const Card: React.FC<details> = ({
  poster_path,
  id,
  original_language,
  original_name,
  overview,
  release_date,
  first_air_date,
  title,
  runtime,
  number_of_episodes,
  number_of_seasons,
  spoken_languages,
  omdbData,
  production_companies,
  backdrop_path,
  genres,
  show_name,
  trailerVideos,
  videos,
  name,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tvShow = useSelector((state: RootState) => state.endpoints.tvShow);
  const language = spoken_languages[0];
  const { imdbRating } = omdbData;
  // *Resizing card image for lower resolutions (scrolling laggy on mobile devices)
  const [image, setImage] = useState(imgBaseUrl);
  useEffect(() => {
    const screenWidth = window.innerWidth;
    setImage(screenWidth < 500 ? imgBaseUrlMobile : imgBaseUrl);
  }, []);
  // *Extracting year from release date
  function trimDate(date: string) {
    if (date) {
      const trimmed = date.substring(0, 4);
      return trimmed;
    } else {
      return "Loading...";
    }
  }

  // *tooltip and overview on movie title
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
    setOverlayVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
    setOverlayVisible(false);
  };
  const cardClick = () => {
    dispatch(singleImage(poster_path));
    dispatch(setId(id));
    window.scrollTo(0, 0);
    localStorage.setItem("MovieID", id);
    navigate("/details");
    dispatch(
      moviesDetails({
        title: title,
        overview: overview,
        imdb: omdbData.imdbRating,
        duration: runtime,
        released: release_date,
        first_air_date: first_air_date,
        production: production_companies,
        country: omdbData.Country,
        director: omdbData.Director,
        casts: omdbData.Actors,
        backdrop_path: backdrop_path,
        poster_path: poster_path,
        genres: genres,
        show_name: name,
        number_of_episodes: number_of_episodes,
        number_of_seasons: number_of_seasons,
        Tvideos: trailerVideos,
        videos: videos,
      }),
      localStorage.setItem(
        "DETAILS",
        JSON.stringify({
          title: title,
          overview: overview,
          imdb: omdbData.imdbRating,
          duration: runtime,
          released: release_date,
          first_air_date: first_air_date,
          production: production_companies,
          country: omdbData.Country,
          director: omdbData.Director,
          casts: omdbData.Actors,
          backdrop_path: backdrop_path,
          poster_path: poster_path,
          genres: genres,
          show_name: name,
          number_of_episodes: number_of_episodes,
          number_of_seasons: number_of_seasons,
          Tvideos: trailerVideos,
          videos: videos,
        })
      )
    );
  };

  return (
    <div onClick={cardClick} className="card">
      <div className="card-overlay"></div>
      <div
        className="card-image"
        style={
          poster_path
            ? {
                background: `url('${image}${poster_path}')no-repeat center center/cover`,
              }
            : {}
        }
      >
        <div className={`about-overlay ${overlayVisible ? "o-visible" : ""} `}>
          <p>{overview}</p>
        </div>
        <div className="rating">
          <div></div>
          <span>{imdbRating}</span>
        </div>
        <span className="quality">HD</span>
      </div>
      <div className="card-details">
        <h3
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="movie-title"
        >
          {tvShow ? show_name : title}
        </h3>
        <span className={`tooltip ${tooltipVisible ? "tt-visible" : ""} `}>
          {tvShow ? show_name : title}
        </span>
        <p>{language ? language.english_name : "Unknown"}</p>
        <div className="release-date">
          <span>{trimDate(tvShow ? first_air_date : release_date)}</span>
          <span>
            {!tvShow
              ? runtime + " min"
              : `S${number_of_seasons} E${number_of_episodes}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
