import React from 'react';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="copyright">
          &copy; {currentYear} Система Управління Салоном Краси
        </div>
        <div className="footer-info">
          <p>Розроблено з використанням React і Node.js</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;