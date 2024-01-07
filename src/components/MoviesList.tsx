import axios from "axios";
import Card from "./Card";
import { useEffect, useState } from "react";
import { request, similarMovies } from "../Api";
import { fetchImages, singleImage } from "../slices/movieImages";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setPage } from "../slices/endpoints";

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
    results: {}[];
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

type Props = {
  endpoint: string;
  tvShow: boolean;
  showButtons: boolean;
  h2: string;
};

const MoviesList: React.FC<Props> = ({ endpoint, tvShow, showButtons, h2 }) => {
  // console.log("rendered");
  const bodyWindow = document.querySelector(".landing-body");
  const [showItems, setShowItems] = useState<details[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  let [total_pages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const backdropImages: string[] = [];
  // const total_pages = 500;
  const randomImages = useSelector(
    (state: RootState) => state.images.randomImage
  );
  const currentPage = useSelector(
    (state: RootState) => state.endpoints.currentPage
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await request(`${endpoint}`, {
          params: {
            page: currentPage,
          },
        });
        let { results, total_pages } = res.data;
        // console.log(res.data);
        setTotalPages(total_pages > 500 ? (total_pages = 500) : total_pages);
        results.forEach((result: any) => {
          backdropImages.push(result.backdrop_path);
        });
        // console.log(backdropImages);
        const secondaryRequests = results.map(async (result: any) => {
          const secondaryRes = await request(
            `${tvShow ? `tv/${result.id}` : `movie/${result.id}`}`,
            {
              params: {
                append_to_response: "external_ids,videos",
              },
            }
          );
          const imdb_id = !tvShow
            ? secondaryRes.data.imdb_id
            : secondaryRes.data.external_ids.imdb_id;
          const omdbRes = await axios.get(`https://www.omdbapi.com/`, {
            params: {
              apikey: process.env.REACT_APP_OMDB_API_KEY,
              i: imdb_id,
            },
          });
          return {
            ...secondaryRes.data,
            omdbData: omdbRes.data,
          };
        });
        // console.log(details);
        const details = await Promise.all(secondaryRequests);
        setShowItems(details);
        setLoading(false);

        // console.log(details);
        dispatch(fetchImages(backdropImages));
      } catch (error) {
        console.log("something went south:", error);
      }
    };
    fetchItems();
  }, [endpoint, tvShow, currentPage]);

  // Next Page Buttons
  const nextPage = () => {
    dispatch(setPage(currentPage + 1));
    if (bodyWindow) {
      bodyWindow.scrollTo(0, 0);
    }
  };
  // Previous Page Buttons
  const previousPage = () => {
    dispatch(setPage(currentPage - 1));
    if (bodyWindow) {
      bodyWindow.scrollTo(0, 0);
    }
  };

  // Page Button
  const pageButton = (pageNumber: number) => {
    dispatch(setPage(pageNumber));
    if (bodyWindow) {
      bodyWindow.scrollTo(0, 0);
    }
  };

  return (
    <div className="trending-container">
      <div className="trending-content">
        <h2>{h2}</h2>
        {/* pagination buttons */}
        {/* pagination buttons bottom */}
        {currentPage === 1 ? (
          <div className="page-btns">
            {/* Current page */}
            <button className="current-pg">{currentPage}</button>
            {/* Current page +1 */}
            {total_pages >= 2 ? (
              <button
                onClick={() => {
                  pageButton(currentPage + 1);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 1}
              </button>
            ) : (
              ""
            )}
            {/* Current Page +2 */}
            {total_pages >= 3 ? (
              <button
                onClick={() => {
                  pageButton(currentPage + 2);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 2}
              </button>
            ) : (
              ""
            )}
            {/* Current page +3 */}
            {total_pages > 3 ? (
              <button
                onClick={() => {
                  pageButton(currentPage + 3);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 3}
              </button>
            ) : (
              ""
            )}
            {/* Next Button */}
            {total_pages > currentPage ? (
              <button
                className="next-btn"
                onClick={() => {
                  nextPage();
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
              >
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            ) : (
              ""
            )}
            <button
              className="first-last"
              onClick={() => {
                pageButton(total_pages);
                if (bodyWindow) {
                  bodyWindow.scrollTo(0, 0);
                }
              }}
            >
              <span className="material-symbols-outlined">last_page</span>
            </button>
          </div>
        ) : (
          <div className="page-btns">
            {/* Jump to first page Button */}
            <button
              className="first-last"
              onClick={() => {
                pageButton(1);
                if (bodyWindow) {
                  bodyWindow.scrollTo(0, 0);
                }
              }}
            >
              <span className="material-symbols-outlined">first_page</span>
            </button>
            {/* Previous page Button */}
            <button
              className="prev-btn"
              onClick={() => {
                previousPage();
                if (bodyWindow) {
                  bodyWindow.scrollTo(0, 0);
                }
              }}
            >
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>

            {currentPage > 3 ? (
              // *Current page -3
              <button
                onClick={() => {
                  pageButton(currentPage - 3);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage - 3}
              </button>
            ) : (
              ""
            )}
            {currentPage > 2 ? (
              // *Current page -2
              <button
                onClick={() => {
                  pageButton(currentPage - 2);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage - 2}
              </button>
            ) : (
              ""
            )}
            {currentPage >= 2 ? (
              // *Current page -1
              <button
                onClick={() => {
                  pageButton(currentPage - 1);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage - 1}
              </button>
            ) : (
              ""
            )}
            {/* Current Page */}
            <button className="current-pg">{currentPage}</button>

            {currentPage >= total_pages ? (
              ""
            ) : (
              // *Current page +1
              <button
                onClick={() => {
                  pageButton(currentPage + 1);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage >= total_pages - 1 ? (
              ""
            ) : (
              // *Current page +2
              <button
                onClick={() => {
                  pageButton(currentPage + 2);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 2}
              </button>
            )}
            {currentPage >= total_pages - 2 ? (
              ""
            ) : (
              // *Current page +3
              <button
                onClick={() => {
                  pageButton(currentPage + 3);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 3}
              </button>
            )}
            {currentPage >= total_pages ? (
              ""
            ) : (
              <button
                className="next-btn"
                onClick={() => {
                  nextPage();
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
              >
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            )}
            <button
              className="first-last"
              onClick={() => {
                pageButton(total_pages);
                if (bodyWindow) {
                  bodyWindow.scrollTo(0, 0);
                }
              }}
            >
              <span className="material-symbols-outlined">last_page</span>
            </button>
          </div>
        )}
        {/* ------------------------ */}
        <div className="cards-container">
          {/* {showItems.length < 1 ? ( */}
          {loading ? (
            <div className="loader">
              <div className="loader__circle"></div>
              <div className="loader__circle"></div>
              <div className="loader__circle"></div>
              <div className="loader__circle"></div>
              <div className="loader__circle"></div>
            </div>
          ) : (
            showItems.map((item) => {
              return (
                <Card
                  key={item.id}
                  id={item.id}
                  poster_path={item.poster_path}
                  original_language={item.original_language}
                  overview={item.overview}
                  title={item.title}
                  release_date={item.release_date}
                  runtime={item.runtime}
                  spoken_languages={item.spoken_languages}
                  omdbData={item.omdbData}
                  first_air_date={item.first_air_date}
                  original_name={item.original_name}
                  number_of_episodes={item.number_of_episodes}
                  number_of_seasons={item.number_of_seasons}
                  backdrop_path={item.backdrop_path}
                  production_companies={item.production_companies}
                  genres={item.genres}
                  show_name={item.name}
                  name={item.name}
                  trailerVideos={item.trailerVideos}
                  videos={item.videos}
                />
              );
            })
          )}
        </div>
        {/* pagination buttons bottom */}
        {currentPage === 1 ? (
          <div className="page-btns">
            {/* Current page */}
            <button className="current-pg">{currentPage}</button>
            {/* Current page +1 */}
            {total_pages >= 2 ? (
              <button
                onClick={() => {
                  pageButton(currentPage + 1);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 1}
              </button>
            ) : (
              ""
            )}
            {/* Current Page +2 */}
            {total_pages >= 3 ? (
              <button
                onClick={() => {
                  pageButton(currentPage + 2);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 2}
              </button>
            ) : (
              ""
            )}
            {/* Current page +3 */}
            {total_pages > 3 ? (
              <button
                onClick={() => {
                  pageButton(currentPage + 3);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 3}
              </button>
            ) : (
              ""
            )}
            {/* Next Button */}
            {total_pages > currentPage ? (
              <button
                className="next-btn"
                onClick={() => {
                  nextPage();
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
              >
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            ) : (
              ""
            )}
            <button
              className="first-last"
              onClick={() => {
                pageButton(total_pages);
                if (bodyWindow) {
                  bodyWindow.scrollTo(0, 0);
                }
              }}
            >
              <span className="material-symbols-outlined">last_page</span>
            </button>
          </div>
        ) : (
          <div className="page-btns">
            {/* Jump to first page Button */}
            <button
              className="first-last"
              onClick={() => {
                pageButton(1);
                if (bodyWindow) {
                  bodyWindow.scrollTo(0, 0);
                }
              }}
            >
              <span className="material-symbols-outlined">first_page</span>
            </button>
            {/* Previous page Button */}
            <button
              className="prev-btn"
              onClick={() => {
                previousPage();
                if (bodyWindow) {
                  bodyWindow.scrollTo(0, 0);
                }
              }}
            >
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>

            {currentPage > 3 ? (
              // *Current page -3
              <button
                onClick={() => {
                  pageButton(currentPage - 3);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage - 3}
              </button>
            ) : (
              ""
            )}
            {currentPage > 2 ? (
              // *Current page -2
              <button
                onClick={() => {
                  pageButton(currentPage - 2);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage - 2}
              </button>
            ) : (
              ""
            )}
            {currentPage >= 2 ? (
              // *Current page -1
              <button
                onClick={() => {
                  pageButton(currentPage - 1);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage - 1}
              </button>
            ) : (
              ""
            )}
            {/* Current Page */}
            <button className="current-pg">{currentPage}</button>

            {currentPage >= total_pages ? (
              ""
            ) : (
              // *Current page +1
              <button
                onClick={() => {
                  pageButton(currentPage + 1);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage >= total_pages - 1 ? (
              ""
            ) : (
              // *Current page +2
              <button
                onClick={() => {
                  pageButton(currentPage + 2);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 2}
              </button>
            )}
            {currentPage >= total_pages - 2 ? (
              ""
            ) : (
              // *Current page +3
              <button
                onClick={() => {
                  pageButton(currentPage + 3);
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
                className="page-btn"
              >
                {currentPage + 3}
              </button>
            )}
            {currentPage >= total_pages ? (
              ""
            ) : (
              <button
                className="next-btn"
                onClick={() => {
                  nextPage();
                  if (bodyWindow) {
                    bodyWindow.scrollTo(0, 0);
                  }
                }}
              >
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            )}
            <button
              className="first-last"
              onClick={() => {
                pageButton(total_pages);
                if (bodyWindow) {
                  bodyWindow.scrollTo(0, 0);
                }
              }}
            >
              <span className="material-symbols-outlined">last_page</span>
            </button>
          </div>
        )}
        {/* --------------------- */}
      </div>
    </div>
  );
};

export default MoviesList;
