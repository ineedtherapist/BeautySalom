import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Form.css';

const ServiceForm = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    isAvailable: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Якщо передано послугу для редагування, заповнюємо форму її даними
    if (service) {
      console.log('Редагуємо послугу, isAvailable:', service.isAvailable);
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        duration: service.duration || '',
        isAvailable: service.isAvailable === undefined || service.isAvailable === null ? true : Boolean(service.isAvailable)
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Для чекбокса isAvailable
    if (name === 'isAvailable' && type === 'checkbox') {
      console.log('Встановлено isAvailable:', checked);
      setFormData({
        ...formData,
        isAvailable: checked
      });
    }
    // Обробка числових полів
    else if (name === 'price' || name === 'duration') {
      const numValue = value === '' ? '' : Number(value);
      
      // Перевірка на від'ємне значення
      if (numValue < 0) {
        return;
      }
      
      setFormData({
        ...formData,
        [name]: numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Очищаємо помилку для поля, яке редагується
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Назва послуги є обов'язковою";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Опис послуги є обов'язковим";
    }
    
    if (formData.price === '' || isNaN(formData.price)) {
      newErrors.price = "Ціна повинна бути числом";
    }
    
    if (formData.duration === '' || isNaN(formData.duration)) {
      newErrors.duration = "Тривалість повинна бути числом";
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
      // Створюємо об'єкт з явно вказаним булевим типом для isAvailable
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        isAvailable: formData.isAvailable === true
      };
      
      console.log('Надсилаємо дані послуги. isAvailable тип:', typeof dataToSend.isAvailable);
      console.log('Надсилаємо дані послуги. isAvailable значення:', dataToSend.isAvailable);
      console.log('Повні дані для надсилання:', dataToSend);
      
      if (service && service._id) {
        // Редагування існуючої послуги
        response = await axios.put(`http://localhost:5000/api/services/${service._id}`, dataToSend);
      } else {
        // Створення нової послуги
        response = await axios.post('http://localhost:5000/api/services', dataToSend);
      }
      
      console.log('Відповідь сервера:', response.data);
      console.log('Тип isAvailable у відповіді:', typeof response.data.isAvailable);
      console.log('Значення isAvailable у відповіді:', response.data.isAvailable);
      
      // Перевіряємо, чи зберігається правильне значення для isAvailable
      const updatedService = {
        ...response.data,
        isAvailable: response.data.isAvailable === true
      };
      
      console.log('Оновлене значення послуги для клієнта:', updatedService);
      
      onSave(updatedService);
    } catch (error) {
      console.error('Error saving service:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ submit: error.response.data.error });
      } else {
        setErrors({ submit: 'Сталася помилка при збереженні. Спробуйте знову.' });
      }
    }
  };

  return (
    <div className="form-container">
      <h3>{service ? 'Редагувати послугу' : 'Додати нову послугу'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Назва послуги *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Опис *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            rows={4}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Ціна (грн) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <div className="error-message">{errors.price}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="duration">Тривалість (хв) *</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="0"
            step="1"
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && <div className="error-message">{errors.duration}</div>}
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            Послуга доступна
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

export default ServiceForm;
