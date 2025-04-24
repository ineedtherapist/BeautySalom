import React from 'react';
import '../styles/Form.css';

const DatePicker = ({ id, name, value, onChange, label, required, error, min }) => {
  // Форматування дати-часу для input type="datetime-local"
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    // Переконуємося, що дата валідна
    if (isNaN(date.getTime())) return '';
    
    // Формат: YYYY-MM-DDThh:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  // Обробник зміни значення поля
  const handleDateTimeChange = (e) => {
    const { name, value: inputValue } = e.target;
    
    // Якщо значення пусте, передаємо null
    if (!inputValue) {
      const syntheticEvent = {
        target: {
          name,
          value: null
        }
      };
      onChange(syntheticEvent);
      return;
    }
    
    // Створюємо об'єкт Date з вибраного значення
    const newDate = new Date(inputValue);
    
    // Створюємо штучну подію з перетвореним значенням
    const syntheticEvent = {
      target: {
        name,
        value: newDate
      }
    };
    
    onChange(syntheticEvent);
  };
  
  // Отримуємо мінімальну дату/час
  const getMinDateTime = () => {
    if (min) return formatDateTimeForInput(min);
    
    // Якщо min не вказано, використовуємо поточний час
    const now = new Date();
    return formatDateTimeForInput(now);
  };
  
  return (
    <div className="form-group">
      <label htmlFor={id}>{label} {required && '*'}</label>
      <input
        type="datetime-local"
        id={id}
        name={name}
        value={formatDateTimeForInput(value)}
        onChange={handleDateTimeChange}
        className={error ? 'error' : ''}
        required={required}
        min={getMinDateTime()}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DatePicker;