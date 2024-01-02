import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeEndpoint, setPage, tvShow } from "../slices/endpoints";
import {
  popularMovies,
  topRatedMovies,
  trendingMovies,
  popularShows,
} from "../Api";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePopular = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(false));
    dispatch(changeEndpoint(popularMovies));
  };
  const handleTopRated = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(false));
    dispatch(changeEndpoint(topRatedMovies));
  };
  const handleTrending = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(false));
    dispatch(changeEndpoint(trendingMovies));
  };
  const handleShows = () => {
    navigate("/landing");
    dispatch(setPage(1));
    dispatch(tvShow(true));
    dispatch(changeEndpoint(popularShows));
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
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
