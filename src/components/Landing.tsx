import MoviesList from "./MoviesList";

const Landing = () => {
  return (
    <div className="landing-body">
      <div className="landing-overlay"></div>
      <h1 className="search-h1">Find Movies & TVShows</h1>
      <div className="landing-search-bar">
        <input type="text" placeholder="Search. . ." />
        <button>
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
      <MoviesList />
    </div>
  );
};

export default Landing;
