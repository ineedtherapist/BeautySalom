import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Clients from './pages/Clients';
import Employees from './pages/Employees';
import Services from './pages/Services';
import Appointments from './pages/Appointments';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/services" element={<Services />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;