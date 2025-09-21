import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <Link to="/" className="logo"><img className ="logo2" src="./logo.png" alt="" /></Link>

      <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
       ☰
      </button>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>Heatmap</Link>
        <Link to="/report" className="nav-item" onClick={() => setMenuOpen(false)}>Report Crime</Link>
            <Link to="/hotspot" className="nav-item" onClick={() => setMenuOpen(false)}>Future Hotspot</Link>
      </nav>
    </header>
  );
};

export default Header;
