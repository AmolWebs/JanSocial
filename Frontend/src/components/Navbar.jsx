import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { JanContext } from '../context/JanContext';
import { Menu, X, PlusCircle, User, Home } from 'lucide-react'; // icons
import './Navbar.css';

const Navbar = () => {
  const { user, logoutFunction, validateUser } = useContext(JanContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    validateUser();
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <NavLink to="/">
        <h1>JanSocial</h1>
        </NavLink>
      </div>

      {/* Hamburger for mobile */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      {/* Links */}
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
        <Home size={18} /> Home
        </NavLink>
        <NavLink to="/createPost" className="nav-link" onClick={() => setMenuOpen(false)}>
          <PlusCircle size={18} /> Create Post
        </NavLink>
        <NavLink to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
          <User size={18} /> Profile
        </NavLink>
        {user && (
          <button className="logout-btn" onClick={() => { logoutFunction(); setMenuOpen(false); }}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
