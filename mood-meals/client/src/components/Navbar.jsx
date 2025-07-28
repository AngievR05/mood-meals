import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🥣 Mood Meals</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/tracker">Mood Tracker</Link></li>
        <li><Link to="/meals">My Meals</Link></li>
        <li><Link to="/friends">Friends</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default Navbar;
