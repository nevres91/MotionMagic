import { RootState } from "../store";
import MoviesList from "./MoviesList";
import { useSelector } from "react-redux";

const Landing: React.FC = () => {
  const endpoint = useSelector(
    (state: RootState) => state.endpoints.currentEndpoint
  );
  return (
    <div className="landing-body">
      <div className="landing-overlay"></div>
      <div className="landing-search-bar">
        <input type="text" placeholder="Find Movies and TV-Shows..." />
        <button>
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
      <MoviesList
        endpoint={endpoint}
        tvShow={true}
        h2={
          endpoint === "movie/popular"
            ? "Popular Movies:"
            : endpoint === "movie/top_rated"
            ? "Top Rated Movies:"
            : "Trending Movies:"
        }
        showButtons={false}
      />
    </div>
  );
};

export default Landing;