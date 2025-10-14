import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/images/Group2.png';
import { logout, isTokenValid } from '../utils/auth';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role') || '');
      setIsLoggedIn(isTokenValid());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!isLoggedIn) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Mood Meals Logo" className="logo-img" />
          <span className="brand-text">Mood Meals</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/mood-tracker" onClick={() => setMenuOpen(false)}>Mood Tracker</Link></li>
        <li><Link to="/meals" onClick={() => setMenuOpen(false)}>My Meals</Link></li>
        <li><Link to="/friends" onClick={() => setMenuOpen(false)}>Friends</Link></li>
        <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
        {role === 'admin' && <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link></li>}
      </ul>

      {/* Desktop logout */}
      <div className="navbar-actions">
        <button className="logout-button" onClick={() => logout(navigate)}>Logout</button>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
      </button>
    </nav>
  );
};

export default Navbar;
