import axios from "axios";
import Card from "./Card";
import { useEffect, useState } from "react";
import { request } from "../Api";
import { fetchImages } from "../slices/movieImages";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setPage } from "../slices/endpoints";
import { AppDispatch } from "../store";

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
    results: {
      name: string;
      key: string;
    }[];
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

interface Response<TData> {
  data: TData;
}
type ResponseData = Response<{
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
    results: {
      name: string;
      key: string;
    }[];
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
  page: number;
  results: {
    backdrop_path: string;
    id: string;
  }[];
  total_pages: number;
  imdb_id: number;
  external_ids: {
    imdb_id: number;
  };
}>;

interface OmdbResponse<OData> {
  data: OData;
}
type OmdbResponseData = OmdbResponse<{
  imdbRating: string;
  Country: string;
  Director: string;
  Actors: string[];
  Genre: string[];
}>;

const MoviesList: React.FC<Props> = ({ endpoint, tvShow, h2 }) => {
  const bodyWindow = document.querySelector(".landing-body");
  const [showItems, setShowItems] = useState<details[]>([]);
  let [total_pages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const backdropImages: string[] = [];
  const currentPage = useSelector(
    (state: RootState) => state.endpoints.currentPage
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); //* Month index 1, 2, 3... didn't work, had to be 01, 02, 03...
    const day = currentDate.getDate();
    const fetchItems = async () => {
      try {
        setLoading(true);
        // *Fetching 20 movies with lesser details
        const res: ResponseData = await request(`${endpoint}`, {
          params: {
            page: currentPage,
            ...(endpoint === "discover/movie"
              ? { "primary_release_date.gte": `${year}-${month}-${day}` }
              : {}),
          },
        });
        let { results, total_pages } = res.data;
        setTotalPages(total_pages > 500 ? (total_pages = 500) : total_pages);
        results.forEach((result) => {
          backdropImages.push(result.backdrop_path);
        });
        const secondaryRequests = results.map(async (result) => {
          const secondaryRes: ResponseData = await request(
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
          const omdbRes: OmdbResponseData = await axios.get(
            `https://www.omdbapi.com/`,
            {
              params: {
                apikey: process.env.REACT_APP_OMDB_API_KEY,
                i: imdb_id,
              },
            }
          );
          return {
            ...secondaryRes.data,
            omdbData: omdbRes.data,
          };
        });
        const details = await Promise.all(secondaryRequests);
        // *Sort Items by IMDB Rating (Descending)
        const sortedDetails = details.slice().sort((a, b) => {
          const ratingA = parseFloat(a.omdbData.imdbRating);
          const ratingB = parseFloat(b.omdbData.imdbRating);
          const numericRatingA = isNaN(ratingA) ? -Infinity : ratingA;
          const numericRatingB = isNaN(ratingB) ? -Infinity : ratingB;
          return numericRatingB - numericRatingA;
        });
        setShowItems(sortedDetails);
        setLoading(false);
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
