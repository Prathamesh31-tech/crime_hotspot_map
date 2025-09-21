import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CrimeMap from "./components/CrimeMap";
import ReportCrime from "./components/ReportCrime";
import HotspotMap from "./components/HotspotMap";


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<CrimeMap />} />
          <Route path="/report" element={<ReportCrime />} />
          <Route path="/hotspot" element={<HotspotMap />} />
        </Routes>
      </BrowserRouter>
      <div></div>
    </>
  );
}

export default App;
