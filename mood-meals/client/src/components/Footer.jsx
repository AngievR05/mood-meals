import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const links = [
    <>Mood Meals: Your journey to mindful eating.</>,
    <>
      Quick Links:{" "}
      <Link to="/home">Home</Link> |{" "}
      <Link to="/mood-tracker">Moods</Link> |{" "}
      <Link to="/meals">Meals</Link> |{" "}
      <Link to="/friends">Friends</Link> |{" "}
      <Link to="/profile">Profile</Link>
    </>,
    <>
      Follow us on:{" "}
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |{" "}
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> |{" "}
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
    </>,
    <>Contact Us: <a href="mailto:support@moodmeals.co.za">support@moodmeals.co.za</a> | +27 66 261 9841</>,
    <>© 2025 Mood Meals. All rights reserved.</>
  ];

  // Duplicate for seamless scroll
  const repeatedLinks = links.concat(links);

  return (
    <div className="footer-marquee-wrapper">
      <div className="footer-marquee">
        {repeatedLinks.map((item, idx) => (
          <span key={idx}>{item}</span>
        ))}
      </div>
    </div>
  );
};

export default Footer;
