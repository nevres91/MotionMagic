import React, { useEffect, useState } from "react";
import { imgBaseUrl, imgBaseUrlMobile } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";

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

const Card: React.FC<details> = ({
  poster_path,
  id,
  overview,
  release_date,
  first_air_date,
  title,
  runtime,
  number_of_episodes,
  number_of_seasons,
  spoken_languages,
  omdbData,
  show_name,
}) => {
  const navigate = useNavigate();
  const tvShow = useSelector((state: RootState) => state.endpoints.tvShow);
  // *Take only the first language from the spoken languages list.
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
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);

  const handleMouseEnter: () => void = () => {
    setTooltipVisible(true);
    setOverlayVisible(true);
  };

  const handleMouseLeave: () => void = () => {
    setTooltipVisible(false);
    setOverlayVisible(false);
  };
  const cardClick: () => void = () => {
    window.scrollTo(0, 0);
    navigate(`/details/${tvShow ? "show" : "movie"}/${id}`);
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
          <span>{!imdbRating ? "N/A" : imdbRating}</span>
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
