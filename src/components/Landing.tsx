import { RootState } from "../store";
import MoviesList from "./MoviesList";
import { useSelector } from "react-redux";

const Landing: React.FC = () => {
  // console.log("Landing rendered");
  const endpoint = useSelector(
    (state: RootState) => state.endpoints.currentEndpoint
  );
  // *TV-Show Boolean
  const tvShow = useSelector((state: RootState) => state.endpoints.tvShow);

  // *Array of Backdrop paths for 20 fetched movies
  const imagesArray = useSelector(
    (state: RootState) => state.images.randomImage
  );
  // *Get 1 random backdrop path
  const randomImage =
    imagesArray[Math.floor(Math.random() * imagesArray.length)];
  return (
    <>
      <div className="landing-body">
        <div className="landing-overlay">
          <img
            src={
              !randomImage
                ? `../img/backdrop.png`
                : `https://image.tmdb.org/t/p/original/${randomImage}`
            }
            alt=""
          />
        </div>
        <div className="landing-search-bar">
          <input type="text" placeholder="Find Movies and TV-Shows..." />
          <button>
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
        <MoviesList
          endpoint={endpoint}
          tvShow={tvShow}
          h2={
            endpoint === "movie/popular"
              ? "Popular Movies:"
              : endpoint === "movie/top_rated"
              ? "Top Rated Movies:"
              : endpoint === "tv/popular"
              ? "Popular TV-Shows:"
              : "Trending Movies:"
          }
          showButtons={false}
        />
      </div>
    </>
  );
};

export default Landing;
