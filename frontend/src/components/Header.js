import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <nav className="main-nav">
      <div className="logo">
        <Link to="/">Салон Краси</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Головна</Link></li>
        <li><Link to="/clients">Клієнти</Link></li>
        <li><Link to="/employees">Співробітники</Link></li>
        <li><Link to="/services">Послуги</Link></li>
        <li><Link to="/appointments">Записи</Link></li>
      </ul>
    </nav>
  );
}

export default Header;