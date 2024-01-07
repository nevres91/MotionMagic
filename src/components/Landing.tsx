import { RootState } from "../store";
import MoviesList from "./MoviesList";
import { useDispatch, useSelector } from "react-redux";
import { changeEndpoint, setPage } from "../slices/endpoints";
import SocialMedia from "./SocialMedia";

const Landing: React.FC = () => {
  // console.log("Landing rendered");
  const endpoint = useSelector(
    (state: RootState) => state.endpoints.currentEndpoint
  );
  const dispatch = useDispatch();
  // *TV-Show Boolean
  const tvShow = useSelector((state: RootState) => state.endpoints.tvShow);

  // *Array of Backdrop paths for 20 fetched movies
  const imagesArray = useSelector(
    (state: RootState) => state.images.randomImage
  );
  // *Get 1 random backdrop path
  const randomImage =
    imagesArray[Math.floor(Math.random() * imagesArray.length)];
  // *Search Button
  const search = () => {
    const searchInput = document.querySelector(
      ".search-input"
    ) as HTMLInputElement;
    if (searchInput.value !== "") {
      dispatch(setPage(1));
      dispatch(
        changeEndpoint(
          tvShow
            ? `search/tv?query=${searchInput.value}&include_adult=false&page=1`
            : `search/movie?query=${searchInput.value}&include_adult=false&page=1`
        )
      );

      searchInput.value = "";
    }
  };
  // *Search on Enter press
  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      search();
    }
  };

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
          <input
            className="search-input"
            type="text"
            placeholder="Find Movies and TV-Shows..."
            onKeyDown={enter}
          />
          <button>
            <span onClick={search} className="material-symbols-outlined">
              search
            </span>
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
              : endpoint === "trending/movie/day"
              ? "Trending Movies:"
              : "Search Results:"
          }
          showButtons={false}
        />
        <SocialMedia />
      </div>
    </>
  );
};

export default Landing;
