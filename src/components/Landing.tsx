import { popularMovies, topRatedMovies } from "../Api";
import MoviesList from "./MoviesList";

const Landing = () => {
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
        endpoint={popularMovies}
        tvShow={true}
        h2="Popular Movies:"
        showButtons={false}
      />
      <br />
      <br />
      <MoviesList
        endpoint={topRatedMovies}
        tvShow={true}
        h2="Top Rated Movies:"
        showButtons={false}
      />
    </div>
  );
};

export default Landing;
