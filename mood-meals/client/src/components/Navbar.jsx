import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/images/Group2.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Mood Meals Logo" className="logo-img" />
          Mood Meals
        </Link>
      </div>

      <ul className="navbar-links">
       <li><Link to="/home">Home</Link></li>

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
