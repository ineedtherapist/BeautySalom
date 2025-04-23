import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/clients">Clients</Link></li>
        <li><Link to="/employees">Employees</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/appointments">Appointments</Link></li>
      </ul>
    </nav>
  );
}

export default Header;