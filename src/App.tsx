import React from "react";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import { RootState } from "./store";
import MovieDetails from "./components/MovieDetails";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/details" element={<MovieDetails />} />
      </Routes>
    </>
  );
};

export default App;
