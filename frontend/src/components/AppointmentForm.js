import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from './Select';
import DatePicker from './DatePicker';
import '../styles/Form.css';

const AppointmentForm = ({ appointment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    employeeId: '',
    serviceId: '',
    appointmentDate: new Date(),
    status: 'Scheduled',
    note: ''
  });
  
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Отримання списків клієнтів, співробітників і послуг
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [clientsResponse, employeesResponse, servicesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/clients'),
          axios.get('http://localhost:5000/api/employees'),
          axios.get('http://localhost:5000/api/services')
        ]);
        
        setClients(clientsResponse.data);
        setEmployees(employeesResponse.data);
        setServices(servicesResponse.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setErrors({ submit: 'Помилка завантаження даних. Спробуйте знову.' });
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Встановлення даних редагованого запису
  useEffect(() => {
    if (appointment && !isLoading) {
      // Перевірка на наявність всіх необхідних посилань
      if (!appointment.clientId || !appointment.employeeId || !appointment.serviceId) {
        console.warn('Appointment is missing required references:', appointment);
        setErrors({ submit: 'Запис містить неповні дані. Деякі поля можуть бути відсутніми.' });
      }
      
      setFormData({
        clientId: appointment.clientId ? (appointment.clientId._id || appointment.clientId) : '',
        employeeId: appointment.employeeId ? (appointment.employeeId._id || appointment.employeeId) : '',
        serviceId: appointment.serviceId ? (appointment.serviceId._id || appointment.serviceId) : '',
        appointmentDate: appointment.appointmentDate || new Date(),
        status: appointment.status || 'Scheduled',
        note: appointment.note || ''
      });
    }
  }, [appointment, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Спеціальна обробка для дати
    if (name === 'appointmentDate') {
      // Якщо маємо об'єкт Date, використовуємо його безпосередньо
      // В іншому випадку конвертуємо рядок у об'єкт Date
      const dateValue = value instanceof Date ? value : new Date(value);
      
      console.log("Встановлюємо дату запису:", dateValue);
      
      setFormData({
        ...formData,
        [name]: dateValue
      });
    } else {
      // Для всіх інших полів обробка залишається стандартною
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Очищаємо помилку для поля, яке редагується
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientId) {
      newErrors.clientId = "Клієнт є обов'язковим";
    }
    
    if (!formData.employeeId) {
      newErrors.employeeId = "Співробітник є обов'язковим";
    }
    
    if (!formData.serviceId) {
      newErrors.serviceId = "Послуга є обов'язковою";
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Дата запису є обов'язковою";
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
      
      if (appointment && appointment._id) {
        // Редагування існуючого запису
        response = await axios.put(`http://localhost:5000/api/appointments/${appointment._id}`, formData);
      } else {
        // Створення нового запису
        response = await axios.post('http://localhost:5000/api/appointments', formData);
      }
      
      onSave(response.data);
    } catch (error) {
      console.error('Error saving appointment:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ submit: error.response.data.error });
      } else {
        setErrors({ submit: 'Сталася помилка при збереженні. Спробуйте знову.' });
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Завантаження даних...</div>;
  }

  return (
    <div className="form-container">
      <h3>{appointment ? 'Редагувати запис' : 'Додати новий запис'}</h3>
      
      <form onSubmit={handleSubmit}>
        <Select
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          options={clients.map(client => ({ value: client._id, label: client.fullName }))}
          label="Клієнт"
          required
          error={errors.clientId}
        />
        
        <Select
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          options={employees.filter(emp => emp.isActive).map(employee => ({ 
            value: employee._id, 
            label: employee.fullName 
          }))}
          label="Співробітник"
          required
          error={errors.employeeId}
        />
        
        <Select
          id="serviceId"
          name="serviceId"
          value={formData.serviceId}
          onChange={handleChange}
          options={services.filter(svc => svc.isAvailable).map(service => ({ 
            value: service._id, 
            label: `${service.name} (${service.price} грн, ${service.duration} хв)` 
          }))}
          label="Послуга"
          required
          error={errors.serviceId}
        />
        
        <DatePicker
          id="appointmentDate"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          label="Дата та час"
          required
          showTime={true}
          error={errors.appointmentDate}
        />
        
        <Select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'Scheduled', label: 'Заплановано' },
            { value: 'Completed', label: 'Завершено' },
            { value: 'Cancelled', label: 'Скасовано' }
          ]}
          label="Статус"
          required
          error={errors.status}
        />
        
        <div className="form-group">
          <label htmlFor="note">Примітка</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={3}
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

export default AppointmentForm;
