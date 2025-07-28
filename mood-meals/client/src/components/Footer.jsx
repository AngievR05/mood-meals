import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const message = `
    Mood Meals: Your journey to mindful eating. |&nbsp;&nbsp;&nbsp;&nbsp;
    Quick Links: Home | About | Contact | FAQ |&nbsp;&nbsp;&nbsp;&nbsp;
    Follow us on: Facebook | Instagram | Twitter |&nbsp;&nbsp;&nbsp;&nbsp;
    Contact Us: support@moodmeals.co.za | +27 66 261 9841 |&nbsp;&nbsp;&nbsp;&nbsp;
    Privacy Policy | Terms of Service&nbsp;&nbsp;&nbsp;&nbsp;
  `;

  return (
    <div className="footer-marquee-wrapper">
      <div className="footer-marquee">
        <span dangerouslySetInnerHTML={{ __html: message.repeat(2) }} />
        <span dangerouslySetInnerHTML={{ __html: message.repeat(2) }} />
      </div>
    </div>
  );
};

export default Footer;
