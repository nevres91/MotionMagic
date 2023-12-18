import axios from "axios";
import Card from "./Card";
import { useEffect, useState } from "react";
import { request } from "../Api";

type details = {
  id: string;
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
  spoken_languages: {
    english_name: string;
    iso_639_1?: string;
    name?: string;
  }[];
  omdbData: {
    imdbRating: string;
  };
};

type Props = {
  endpoint: string;
  tvShow: boolean;
  showButtons: boolean;
  h2: string;
};

const MoviesList: React.FC<Props> = ({ endpoint, tvShow, showButtons, h2 }) => {
  const [showItems, setShowItems] = useState<details[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await request(`${endpoint}`, {
          params: {
            page: currentPage,
          },
        });
        const { results } = res.data;
        setTotalPages(500);
        const secondaryRequests = results.map(async (result: any) => {
          const secondaryRes = await request(
            `${tvShow ? `tv/${result.id}` : `movie/${result.id}`}`,
            {
              params: {
                append_to_response: tvShow ? "external_ids" : "",
              },
            }
            // `/${tvShow ? "tv" : "movie"}/${result.id}`
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
        const details = await Promise.all(secondaryRequests);
        setShowItems(details);
      } catch (error) {
        console.log("something went south:", error);
      }
    };
    fetchItems();
  }, [endpoint, tvShow, currentPage]);

  // Next Page Buttons
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  // Previous Page Buttons
  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Page Button
  const pageButton = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="trending-container">
      <div className="trending-content">
        <h2>{h2}</h2>
        {/* pagination buttons */}
        {currentPage === 1 ? (
          <div className="page-btns">
            {currentPage > 3 ? (
              <button
                onClick={() => pageButton(currentPage - 3)}
                className="page-btn"
              >
                {currentPage - 3}
              </button>
            ) : (
              ""
            )}
            {currentPage > 2 ? (
              <button
                onClick={() => pageButton(currentPage - 2)}
                className="page-btn"
              >
                {currentPage - 2}
              </button>
            ) : (
              ""
            )}
            {currentPage >= 2 ? (
              <button
                onClick={() => pageButton(currentPage - 1)}
                className="page-btn"
              >
                {currentPage - 1}
              </button>
            ) : (
              ""
            )}
            <button className="current-pg">{currentPage}</button>
            <button
              onClick={() => pageButton(currentPage + 1)}
              className="page-btn"
            >
              {currentPage + 1}
            </button>
            <button
              onClick={() => pageButton(currentPage + 2)}
              className="page-btn"
            >
              {currentPage + 2}
            </button>
            <button
              onClick={() => pageButton(currentPage + 3)}
              className="page-btn"
            >
              {currentPage + 3}
            </button>
            <button className="next-btn" onClick={nextPage}>
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            </button>
          </div>
        ) : (
          <div className="page-btns">
            <button className="first-last" onClick={() => pageButton(1)}>
              <span className="material-symbols-outlined">first_page</span>
            </button>
            <button className="prev-btn" onClick={previousPage}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
            {currentPage > 3 ? (
              <button
                onClick={() => pageButton(currentPage - 3)}
                className="page-btn"
              >
                {currentPage - 3}
              </button>
            ) : (
              ""
            )}
            {currentPage > 2 ? (
              <button
                onClick={() => pageButton(currentPage - 2)}
                className="page-btn"
              >
                {currentPage - 2}
              </button>
            ) : (
              ""
            )}
            {currentPage >= 2 ? (
              <button
                onClick={() => pageButton(currentPage - 1)}
                className="page-btn"
              >
                {currentPage - 1}
              </button>
            ) : (
              ""
            )}
            <button className="current-pg">{currentPage}</button>
            {currentPage >= 500 ? (
              ""
            ) : (
              <button
                onClick={() => pageButton(currentPage + 1)}
                className="page-btn"
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage >= 499 ? (
              ""
            ) : (
              <button
                onClick={() => pageButton(currentPage + 2)}
                className="page-btn"
              >
                {currentPage + 2}
              </button>
            )}

            {currentPage >= 498 ? (
              ""
            ) : (
              <button
                onClick={() => pageButton(currentPage + 3)}
                className="page-btn"
              >
                {currentPage + 3}
              </button>
            )}
            {currentPage >= 500 ? (
              ""
            ) : (
              <button className="next-btn" onClick={nextPage}>
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            )}
            <button
              className="first-last"
              onClick={() => pageButton(total_pages)}
            >
              <span className="material-symbols-outlined">last_page</span>
            </button>
          </div>
        )}
        {/* ------------------------ */}
        <div className="cards-container">
          {showItems.length < 1 ? (
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
                />
              );
            })
          )}
        </div>
        {/* pagination buttons bottom */}
        {currentPage === 1 ? (
          <div className="page-btns">
            {currentPage > 3 ? (
              <button
                onClick={() => pageButton(currentPage - 3)}
                className="page-btn"
              >
                {currentPage - 3}
              </button>
            ) : (
              ""
            )}
            {currentPage > 2 ? (
              <button
                onClick={() => pageButton(currentPage - 2)}
                className="page-btn"
              >
                {currentPage - 2}
              </button>
            ) : (
              ""
            )}
            {currentPage >= 2 ? (
              <button
                onClick={() => pageButton(currentPage - 1)}
                className="page-btn"
              >
                {currentPage - 1}
              </button>
            ) : (
              ""
            )}
            <button className="current-pg">{currentPage}</button>
            <button
              onClick={() => pageButton(currentPage + 1)}
              className="page-btn"
            >
              {currentPage + 1}
            </button>
            <button
              onClick={() => pageButton(currentPage + 2)}
              className="page-btn"
            >
              {currentPage + 2}
            </button>
            <button
              onClick={() => pageButton(currentPage + 3)}
              className="page-btn"
            >
              {currentPage + 3}
            </button>
            <button className="next-btn" onClick={nextPage}>
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            </button>
          </div>
        ) : (
          <div className="page-btns">
            <button className="first-last" onClick={() => pageButton(1)}>
              <span className="material-symbols-outlined">first_page</span>
            </button>
            <button className="prev-btn" onClick={previousPage}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
            {currentPage > 3 ? (
              <button
                onClick={() => pageButton(currentPage - 3)}
                className="page-btn"
              >
                {currentPage - 3}
              </button>
            ) : (
              ""
            )}
            {currentPage > 2 ? (
              <button
                onClick={() => pageButton(currentPage - 2)}
                className="page-btn"
              >
                {currentPage - 2}
              </button>
            ) : (
              ""
            )}
            {currentPage >= 2 ? (
              <button
                onClick={() => pageButton(currentPage - 1)}
                className="page-btn"
              >
                {currentPage - 1}
              </button>
            ) : (
              ""
            )}
            <button className="current-pg">{currentPage}</button>
            {currentPage >= 500 ? (
              ""
            ) : (
              <button
                onClick={() => pageButton(currentPage + 1)}
                className="page-btn"
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage >= 499 ? (
              ""
            ) : (
              <button
                onClick={() => pageButton(currentPage + 2)}
                className="page-btn"
              >
                {currentPage + 2}
              </button>
            )}

            {currentPage >= 498 ? (
              ""
            ) : (
              <button
                onClick={() => pageButton(currentPage + 3)}
                className="page-btn"
              >
                {currentPage + 3}
              </button>
            )}
            {currentPage >= 500 ? (
              ""
            ) : (
              <button className="next-btn" onClick={nextPage}>
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            )}
            <button
              className="first-last"
              onClick={() => pageButton(total_pages)}
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
