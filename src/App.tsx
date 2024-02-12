import React from "react";
import { Routes, Route } from "react-router-dom";
import Sorcerer from "./components/Sorcerer/Sorcerer";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Sorcerer />} />
    </Routes>
  );
};

export default App;
