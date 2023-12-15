import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeEndpoint } from "../slices/endpoints";
import { popularMovies, topRatedMovies, trendingMovies } from "../Api";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePopular = () => {
    dispatch(changeEndpoint(popularMovies));
  };
  const handleTopRated = () => {
    dispatch(changeEndpoint(topRatedMovies));
  };
  const handleTrending = () => {
    dispatch(changeEndpoint(trendingMovies));
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
          <li className="popular-shows">TV Shows</li>
          <li onClick={handleTopRated} className="top-rated-movies">
            TopRated
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
