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
      <div className="navbar-logo">
        <Link to="/home">
          <img src={logo} alt="Mood Meals Logo" className="logo-img" />
          <span className="brand-text">Mood Meals</span>
        </Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/mood-tracker" onClick={() => setMenuOpen(false)}>Mood Tracker</Link></li>
        <li><Link to="/meals" onClick={() => setMenuOpen(false)}>My Meals</Link></li>
        <li><Link to="/friends" onClick={() => setMenuOpen(false)}>Friends</Link></li>
        <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
        {role === 'admin' && <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link></li>}
      </ul>

      <div className="navbar-actions">
        {/* <input type="text" placeholder="Search..." className="form-input" /> */}
        <button className="logout-button" onClick={() => logout(navigate)}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
