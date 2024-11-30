import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaNewspaper, FaBars, FaTimes } from "react-icons/fa"; // Updated icons
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-title">Ganesh Patel Weather App</span>
      </div>
      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaHome className="icon" /> Home
        </Link>
        <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaInfoCircle className="icon" /> About
        </Link>
        <Link to="/news" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaNewspaper className="icon" /> News
        </Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
      </div>
    </nav>
  );
}

export default Navbar;
