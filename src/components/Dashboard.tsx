import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeEndpoint, setPage } from "../slices/endpoints";
import { RootState } from "../store";
import SocialMedia from "./SocialMedia";
import { AppDispatch } from "../store";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const tvShow = useSelector((state: RootState) => state.endpoints.tvShow);

  // *Search Button
  const search = () => {
    const searchInput = document.querySelector(
      ".search-input"
    ) as HTMLInputElement;
    if (searchInput.value !== "") {
      navigate("/landing");
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
    <div className="dashboard-body">
      <div className="dashboard-banner">
        <div className="search-bar">
          <input
            type="text"
            placeholder="search for a movie..."
            className="search-input"
            onKeyDown={enter}
          />
          <button onClick={search} className="search-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
            >
              <path
                d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
                fill="#efeff1"
              ></path>
            </svg>
          </button>
        </div>
        <button
          onClick={() => navigate("/landing")}
          className="enter-btn"
        ></button>
      </div>
      <div className="container">
        <h1>Welcome</h1>
        <br />
        <br />
        <br />
        <h3>About Us:</h3>
        <br />
        <p>
          Welcome to MotionMagic, your go-to destination for everything related
          to movies! Our mission is to provide you with a seamless and enjoyable
          movie-watching experience. Whether you're a casual moviegoer or a
          dedicated cinephile, we've got something for everyone.
        </p>
        <br />
        <br />
        <h3>Who Are We</h3>
        <br />
        <p>
          We are a passionate team of movie enthusiasts who believe in the magic
          of storytelling through films. Our love for cinema inspired us to
          create this platform, where we aim to share our excitement and
          knowledge about movies with you.
        </p>
        <br />
        <br />
        <h3>Why I Created This Page</h3>
        <br />
        <p>
          As the founder of MotionMagic, I wanted to embark on a coding journey
          and enhance my skills in React and TypeScript. This project is not
          just about movies; it's also a personal learning adventure in the
          world of web development. Throughout the process of building this
          website, I've honed my coding abilities and gained valuable insights
          into creating dynamic and responsive user interfaces.
        </p>
        <br />
        <h3>What Sets Us Apart:</h3>
        <br />
        <ul>
          <li>
            <h4>Curated Selection:</h4>
            <p>
              Discover a handpicked selection of movies spanning various genres
              and styles. From timeless classics to the latest releases, we
              strive to curate a diverse collection that caters to all tastes.
            </p>
          </li>
          <li>
            <h4>User-Friendly Interface:</h4>
            <p>
              Navigate through our website effortlessly with our user-friendly
              interface. Find information about your favorite movies, explore
              new releases, and enjoy a seamless browsing experience.
            </p>
          </li>
          <li>
            <h4>Community Engagement:</h4>
            <p>
              Join our community of movie enthusiasts! Share your thoughts,
              reviews, and recommendations with fellow users. Connect with
              like-minded individuals who share your passion for the silver
              screen.
            </p>
          </li>
        </ul>
        <br />
        <br />
        <h3>The Learning Process:</h3>
        <br />
        <p>
          This project is not just a destination for movie lovers; it's also a
          reflection of my coding journey. Throughout the development of [Your
          Movie Website], I've delved into the intricacies of React and
          TypeScript, overcoming challenges, and continuously striving to
          improve the user experience. This platform is a testament to the
          dedication and passion poured into both coding and the world of
          cinema.
        </p>
        <br />
        <br />
        <h3>Our Vision:</h3>
        <br />
        <p>
          Our vision is to become your ultimate movie companion, offering a
          one-stop destination for all things related to cinema. Whether you're
          looking for information about upcoming releases, in-depth reviews, or
          just a place to discuss your favorite films, MotionMagic is here for
          you.
        </p>
        <br />
        <br />
        <h3>Join Us on This Cinematic Journey:</h3>
        <br />
        <p>
          Embark on a cinematic journey with us. Explore the vast world of
          movies, connect with fellow movie lovers, and make MotionMagic your
          go-to source for all things film-related. Thank you for being a part
          of our community!
        </p>
      </div>
      <div onClick={() => navigate("/landing")} className="footer-button"></div>
      <div className="footer">
        <p>
          MotionMagic is a Free Movies streaming site with zero ads. We let you
          watch movies online without having to register or paying, with over
          10000 movies and TV-Series. You can also Download full movies from
          Motionmagic and watch it later if you want.
        </p>
      </div>
      <SocialMedia />
    </div>
  );
};

export default Dashboard;
