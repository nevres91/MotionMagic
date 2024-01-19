import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeEndpoint, setPage, tvShow } from "../slices/endpoints";
import {
  popularMovies,
  topRatedMovies,
  trendingMovies,
  popularShows,
  upcomingMovies,
  discoverMovies,
} from "../Api";
import { AppDispatch } from "../store";

const Navbar: React.FC = () => {
  const bodyWindow = document.querySelector(".landing-body");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handlePopular: () => void = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(false));
    dispatch(changeEndpoint(popularMovies));
    if (bodyWindow) {
      bodyWindow.scrollTo(0, 0);
    }
  };
  const handleUpcoming: () => void = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(false));
    dispatch(changeEndpoint(discoverMovies));
    if (bodyWindow) {
      bodyWindow.scrollTo(0, 0);
    }
  };
  const handleTopRated: () => void = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(false));
    dispatch(changeEndpoint(topRatedMovies));
    if (bodyWindow) {
      bodyWindow.scrollTo(0, 0);
    }
  };
  const handleTrending: () => void = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(false));
    dispatch(changeEndpoint(trendingMovies));
    if (bodyWindow) {
      bodyWindow.scrollTo(0, 0);
    }
  };
  const handleShows: () => void = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(true));
    dispatch(changeEndpoint(popularShows));
    if (bodyWindow) {
      bodyWindow.scrollTo(0, 0);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <button onClick={() => navigate("/")} className="nav-label"></button>
        <ul className="nav-items">
          <li onClick={handleTrending}>Home</li>
          <li onClick={handlePopular} className="popular-movies">
            Movies
          </li>
          <li onClick={handleShows} className="popular-shows">
            TV Shows
          </li>
          <li onClick={handleTopRated} className="top-rated-movies">
            TopRated
          </li>
          <li onClick={handleUpcoming} className="upcoming-movies">
            Upcoming
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
