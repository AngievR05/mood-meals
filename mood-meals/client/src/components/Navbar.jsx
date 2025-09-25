import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/images/Group2.png';
import { logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || 'user';
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('role') || 'user';
      setRole(updatedRole);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo and Brand */}
      <div className="navbar-logo">
        <Link to="/home">
          <img src={logo} alt="Mood Meals Logo" className="logo-img" />
          <span className="brand-text">Mood Meals</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/mood-tracker">Mood Tracker</Link></li>
        <li><Link to="/meals">My Meals</Link></li>
        <li><Link to="/saved-meals">Saved Meals</Link></li> {/* NEW LINK */}
        <li><Link to="/friends">Friends</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        {/* <li><Link to="/recipes">Recipes</Link></li> */}

        {/* Only show Admin Panel for admins */}
        {role === 'admin' && <li><Link to="/admin">Admin Panel</Link></li>}
      </ul>

      {/* Search + Logout */}
      <div className="navbar-actions">
        <div className="navbar-search">
          <input type="text" placeholder="Search..." className="form-input" />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => logout(navigate)}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
