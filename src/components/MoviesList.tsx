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
        const { results, total_pages } = res.data;
        setTotalPages(total_pages);
        const secondaryRequests = results.map(async (result: any) => {
          const secondaryRes = await request(
            `/${tvShow ? "tv" : "movie"}/${result.id}`
          );
          const imdb_id = secondaryRes.data.imdb_id;
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
  }, [endpoint, tvShow]);

  return (
    <div className="trending-container">
      <div className="trending-content">
        <h2>{h2}</h2>
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
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesList;
