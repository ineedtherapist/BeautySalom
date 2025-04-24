import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Система Управління Салоном Краси</h1>
        <p className="subtitle">Сучасне рішення для ефективного управління салоном краси</p>
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="icon-container clients-icon">
            <i className="icon">👤</i>
          </div>
          <h3>Клієнти</h3>
          <p>Керуйте базою клієнтів, зберігайте контактну інформацію та історію відвідувань</p>
          <Link to="/clients" className="feature-link">Перейти до клієнтів</Link>
        </div>
        
        <div className="feature-card">
          <div className="icon-container employees-icon">
            <i className="icon">👩‍💼</i>
          </div>
          <h3>Співробітники</h3>
          <p>Керуйте персоналом, переглядайте графіки роботи та історію послуг</p>
          <Link to="/employees" className="feature-link">Перейти до співробітників</Link>
        </div>
        
        <div className="feature-card">
          <div className="icon-container services-icon">
            <i className="icon">💇‍♀️</i>
          </div>
          <h3>Послуги</h3>
          <p>Управляйте каталогом послуг, встановлюйте ціни та тривалість</p>
          <Link to="/services" className="feature-link">Перейти до послуг</Link>
        </div>
        
        <div className="feature-card">
          <div className="icon-container appointments-icon">
            <i className="icon">📅</i>
          </div>
          <h3>Записи</h3>
          <p>Плануйте візити клієнтів, керуйте розкладом та статусами записів</p>
          <Link to="/appointments" className="feature-link">Перейти до записів</Link>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>Як це працює</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Додайте клієнтів</h4>
              <p>Створіть базу даних ваших клієнтів з контактною інформацією</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Додайте співробітників</h4>
              <p>Зареєструйте ваш персонал та їхні навички</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Налаштуйте послуги</h4>
              <p>Додайте послуги з цінами та тривалістю</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Створюйте записи</h4>
              <p>Плануйте послуги для клієнтів з конкретними співробітниками</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Почніть зараз!</h2>
        <p>Натисніть на одну з опцій вище, щоб розпочати керування вашим салоном</p>
      </div>
    </div>
  );
}

export default Home;