import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../Api";
import axios from "axios";
import Similar from "./Similar";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";

type details = {
  secondaryRes: {
    name: string;
    poster_path: string;
    title: string;
    overview: string;
    release_date: string;
    first_air_date: string;
    runtime: number;
    number_of_episodes: number;
    number_of_seasons: number;
    production_companies: [];
    genres: [];
    backdrop_path: string;
    videos: {
      results: {
        name: string;
        key: string;
      }[];
    };
  };
  omdbRes: {
    imdbRating: string;
    Country: string;
    Director: string;
    Actors: string[];
  };
};

const MovieDetails: React.FC = () => {
  console.log("rendered");
  const [mui, setMui] = useState(false);
  const [movieDetails, setMovieDetails] = useState<details | null>(null);
  const params = useParams();
  const toggleMui = () => {
    const checkbox = document.getElementById("checkbox") as HTMLInputElement;
    if (checkbox) {
      setMui(checkbox.checked);
      console.log(mui);
    }
  };

  useEffect(() => {
    console.log(mui);
    const fetchMovie = async () => {
      try {
        const secondaryRes = await request(
          `${
            params.type === "show" ? `tv/${params.id}` : `movie/${params.id}`
          }`,
          {
            params: {
              append_to_response: "external_ids,videos",
            },
          }
        );
        const imdb_id =
          params.type === "movie"
            ? secondaryRes.data.imdb_id
            : secondaryRes.data.external_ids.imdb_id;
        const omdbRes = await axios.get(`https://www.omdbapi.com/`, {
          params: {
            apikey: process.env.REACT_APP_OMDB_API_KEY,
            i: imdb_id,
          },
        });
        const details = {
          secondaryRes: secondaryRes.data,
          omdbRes: omdbRes.data,
        };
        setMovieDetails(details as any);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();
  }, [params.id, params.type, mui]);

  if (!movieDetails) {
    return (
      <div className="details-body loading">
        <div className="loader">
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
        </div>
      </div>
    );
  }
  const { secondaryRes, omdbRes } = movieDetails;
  const {
    backdrop_path,
    poster_path,
    first_air_date,
    overview,
    title,
    genres,
    number_of_seasons,
    number_of_episodes,
    runtime,
    production_companies,
    videos,
    name,
    release_date,
  } = secondaryRes;

  const cover = poster_path
    ? `https://image.tmdb.org/t/p/original/${poster_path}`
    : "N/A";

  const backdropImage = backdrop_path
    ? `url(https://image.tmdb.org/t/p/original/${backdrop_path})`
    : "N/A";

  const { imdbRating, Country, Director, Actors } = omdbRes;

  // *Play trailer
  const playTrailer = () => {
    if (videos) {
      const filteredVideos = videos.results
        .filter(
          (video) => video.name && video.name.toLowerCase().includes("trailer")
        )
        .map((video) => {
          return video.key;
        });
      window.open(`https://www.youtube.com/watch?v=${filteredVideos[0]}`);
    } else {
      alert("Trailer Unavailable!");
    }
  };

  return (
    <div className="details-body">
      <div onClick={toggleMui} className="mui">
        <input type="checkbox" id="checkbox" />
        <label htmlFor="checkbox" className="switch">
          MUI
          <svg
            className="slider"
            viewBox="0 0 512 512"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path>
          </svg>
        </label>
      </div>
      {mui ? (
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            marginTop: {
              xs: "0",
              md: "6px",
            },
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              height: "100vh",
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "1500px",
              padding: {
                xs: "0",
                sm: "0",
                md: "0 24px",
              },
            }}
          >
            <Paper
              elevation={10}
              sx={{
                height: "50%",
                borderRadius: {
                  sm: "none",
                  md: "0 150px 0 150px",
                },
                background: backdropImage,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                position: "relative",
              }}
            >
              <Box
                position="absolute"
                bottom="-55%"
                left="0px"
                display="flex"
                justifyContent="center"
                sx={{ width: "100%", height: 400 }}
              >
                <Card
                  sx={{
                    Width: 200,
                    bgcolor: "transparent",
                    display: {
                      xs: "none",
                      sm: "none",
                      md: "block",
                      lg: "block",
                      xl: "block",
                    },
                    boxShadow: "10px 10px 5px 0px rgba(0, 0, 0, 0.75)",
                    height: "360px",
                  }}
                >
                  <CardMedia
                    sx={{ width: 200, height: 300 }}
                    image={cover}
                  ></CardMedia>
                  <CardActions sx={{ padding: "0" }}>
                    <Button
                      onClick={playTrailer}
                      variant="contained"
                      color="secondary"
                      sx={{
                        width: "100%",
                        marginTop: "10px",
                        height: "50px",
                        fontSize: "large",
                      }}
                      startIcon={
                        <SmartDisplayOutlinedIcon sx={{ scale: "1.5" }} />
                      }
                    >
                      Trailer
                    </Button>
                  </CardActions>
                </Card>
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "100%",
                      md: "70%",
                      lg: "70%",
                      xl: "70%",
                    },
                    height: "100%",
                    margin: {
                      xs: "4px",
                      sm: "20px",
                      md: "0",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "100%",
                        md: "90%",
                        lg: "90%",
                        xl: "90%",
                      },
                      minHeight: 260,
                      background: "rgba(0, 0, 0, 0.5)",
                      backdropFilter: "blur(10px)",
                      margin: {
                        xs: "0",
                        md: "20px",
                      },
                      padding: "20px",
                      textAlign: "left",
                      overflow: "auto",
                      boxShadow: "10px 10px 5px 0px rgba(0, 0, 0, 0.75)",
                    }}
                    mx={2}
                    borderRadius={5}
                  >
                    <Typography variant="h4" color="rgb(219, 217, 217)">
                      {first_air_date ? name : title}
                    </Typography>
                    <Typography color="rgb(219, 217, 217)">
                      {overview}
                    </Typography>
                  </Box>
                  <Button
                    onClick={playTrailer}
                    variant="contained"
                    color="secondary"
                    sx={{
                      display: {
                        xs: "flex",
                        md: "none",
                      },
                      width: "100%",
                      margin: "15px 0",
                      height: "50px",
                      fontSize: "large",
                      boxShadow: "10px 10px 5px 0px rgba(0, 0, 0, 0.75)",
                    }}
                    startIcon={
                      <SmartDisplayOutlinedIcon sx={{ scale: "1.5" }} />
                    }
                  >
                    Trailer
                  </Button>
                  <Grid
                    container
                    spacing={0.4}
                    columns={{
                      xs: 1,
                      lg: 12,
                    }}
                    sx={{
                      textAlign: "left",
                      margin: {
                        xs: "5px 0px",
                        md: "5px 20px",
                      },
                      color: "white",
                    }}
                  >
                    <Grid item xs={4}>
                      <span>IMDB:</span> {imdbRating}
                    </Grid>
                    <Grid item xs={8}>
                      <span>Genre:</span>
                      {genres
                        ? genres.map((genre: any) => `${genre.name}, `)
                        : "N/A"}
                    </Grid>
                    <Grid item xs={4}>
                      <span>Duration:</span>
                      {first_air_date
                        ? "S" + number_of_seasons + " E" + number_of_episodes
                        : runtime
                        ? JSON.stringify(runtime) + " min"
                        : "N/A"}{" "}
                    </Grid>
                    <Grid item xs={8}>
                      <span>Production:</span>
                      {production_companies.map(
                        (prod: any) => `${prod.name}, `
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <span>Release date:</span>
                      {first_air_date
                        ? first_air_date
                        : release_date
                        ? release_date
                        : "N/A"}
                    </Grid>
                    <Grid item xs={8}>
                      <span>Directed By:</span> {Director}
                    </Grid>
                    <Grid item xs={4}>
                      <span>Country:</span> {Country}
                    </Grid>
                    <Grid item xs={8}>
                      <span>Casts:</span>
                      {Actors}
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      ) : omdbRes ? (
        <div className="details-container">
          <div
            className="details-movie-image"
            style={
              backdrop_path
                ? {
                    background: `url(https://image.tmdb.org/t/p/original/${backdrop_path}) no-repeat center center/cover`,
                  }
                : {}
            }
          >
            <div className="overview-container">
              <div className="movie-card">
                <div
                  className="movie-cover"
                  style={
                    poster_path
                      ? {
                          background: `url(https://image.tmdb.org/t/p/original/${poster_path}) no-repeat center center/cover`,
                        }
                      : {}
                  }
                ></div>
                <button onClick={playTrailer} className="trailer-btn">
                  <span className="material-symbols-outlined">
                    smart_display
                  </span>
                  Trailer
                </button>
              </div>
              <div className="overview-content">
                <div className="movie-overview">
                  <h1>{first_air_date ? name : title}</h1>
                  <p>{overview}</p>
                </div>
                <div className="button-div">
                  <button onClick={playTrailer} className="trailer-btn">
                    {" "}
                    <span className="material-symbols-outlined">
                      smart_display
                    </span>
                    Play Trailer
                  </button>
                </div>
                <div className="other-details">
                  <ul>
                    <li>
                      <p>
                        <span className="imdb">IMDB:</span> {imdbRating}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Release Date:</span>{" "}
                        {first_air_date
                          ? first_air_date
                          : release_date
                          ? release_date
                          : "N/A"}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Genre:</span>{" "}
                        {genres
                          ? genres.map((genre: any) => `${genre.name}, `)
                          : "N/A"}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Country:</span> {Country}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Duration:</span>{" "}
                        {first_air_date
                          ? "S" + number_of_seasons + " E" + number_of_episodes
                          : runtime
                          ? JSON.stringify(runtime) + " min"
                          : "N/A"}{" "}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Directed by:</span> {Director}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Production:</span>{" "}
                        {production_companies.map(
                          (prod: any) => `${prod.name}, `
                        )}
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>Casts:</span> {Actors}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="similar-container">
        <Similar />
      </div>
    </div>
  );
};

export default MovieDetails;
