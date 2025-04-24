import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Form.css';

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    phone: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Якщо передано співробітника для редагування, заповнюємо форму його даними
    if (employee) {
      setFormData({
        fullName: employee.fullName || '',
        position: employee.position || '',
        phone: employee.phone || '',
        isActive: employee.isActive === undefined ? true : employee.isActive
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
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
    
    if (!formData.position.trim()) {
      newErrors.position = "Посада є обов'язковою";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон є обов'язковим";
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
      
      if (employee && employee._id) {
        // Редагування існуючого співробітника
        response = await axios.put(`http://localhost:5000/api/employees/${employee._id}`, formData);
      } else {
        // Створення нового співробітника
        response = await axios.post('http://localhost:5000/api/employees', formData);
      }
      
      onSave(response.data);
    } catch (error) {
      console.error('Error saving employee:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ submit: error.response.data.error });
      } else {
        setErrors({ submit: 'Сталася помилка при збереженні. Спробуйте знову.' });
      }
    }
  };

  return (
    <div className="form-container">
      <h3>{employee ? 'Редагувати співробітника' : 'Додати нового співробітника'}</h3>
      
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
          <label htmlFor="position">Посада *</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={errors.position ? 'error' : ''}
          />
          {errors.position && <div className="error-message">{errors.position}</div>}
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
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Активний співробітник
          </label>
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

export default EmployeeForm;
