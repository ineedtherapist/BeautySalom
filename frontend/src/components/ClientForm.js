import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Form.css';

const ClientForm = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Якщо передано клієнта для редагування, заповнюємо форму його даними
    if (client) {
      setFormData({
        fullName: client.fullName || '',
        phone: client.phone || '',
        email: client.email || '',
        notes: client.notes || ''
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Очищаємо помилку для поля, яке редагується
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ім'я є обов'язковим";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон є обов'язковим";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email є обов'язковим";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Невірний формат email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      let response;
      
      if (client && client._id) {
        // Редагування існуючого клієнта
        response = await axios.put(`http://localhost:5000/api/clients/${client._id}`, formData);
      } else {
        // Створення нового клієнта
        response = await axios.post('http://localhost:5000/api/clients', formData);
      }
      
      onSave(response.data);
    } catch (error) {
      console.error('Error saving client:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ submit: error.response.data.error });
      } else {
        setErrors({ submit: 'Сталася помилка при збереженні. Спробуйте знову.' });
      }
    }
  };

  return (
    <div className="form-container">
      <h3>{client ? 'Редагувати клієнта' : 'Додати нового клієнта'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Повне ім'я *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <div className="error-message">{errors.fullName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Телефон *</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Додаткові нотатки</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
        
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Скасувати
          </button>
          <button type="submit" className="save-button">
            Зберегти
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
