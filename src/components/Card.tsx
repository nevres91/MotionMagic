import React, { useState } from "react";
import { imgBaseUrl } from "../Api";

type details = {
  id: string;
  original_language: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1?: string;
    name?: string;
  }[];
  omdbData: {
    imdbRating: string;
  };
};

const Card: React.FC<details> = ({
  poster_path,
  id,
  original_language,
  overview,
  release_date,
  title,
  runtime,
  spoken_languages,
  omdbData,
}) => {
  const { english_name } = spoken_languages[0];
  const { imdbRating } = omdbData;
  // *Extracting year from release date
  function trimDate(date: string) {
    const trimmed = date.substring(0, 4);
    return trimmed;
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

  return (
    <div className="card">
      <div className="card-overlay"></div>
      <div
        className="card-image"
        style={{
          background: `url('${imgBaseUrl}${poster_path}')no-repeat center center/cover`,
        }}
      >
        <div className={`about-overlay ${overlayVisible ? "visible" : ""} `}>
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
          {title}
        </h3>
        <span className={`tooltip ${tooltipVisible ? "visible" : ""} `}>
          {title}
        </span>
        <p>{english_name}</p>
        <div className="release-date">
          <span>{trimDate(release_date)}</span>
          <span>{runtime}min</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
