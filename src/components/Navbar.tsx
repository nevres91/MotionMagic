import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="navbar-content">
        <button onClick={() => navigate("/")} className="nav-label"></button>
        <ul className="nav-items">
          <li onClick={() => navigate("/landing")}>Home</li>
          <li>Movies</li>
          <li>TV Shows</li>
          <li>TopRated</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
