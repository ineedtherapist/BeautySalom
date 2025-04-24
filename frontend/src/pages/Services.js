import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableView from '../components/TableView';
import ServiceForm from '../components/ServiceForm';
import '../styles/Services.css';

function Services() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      console.log("Fetching services data...");
      const response = await axios.get('http://localhost:5000/api/services');
      console.log("Services fetched:", response.data.length);
      
      // Переконуємося, що поле isAvailable має правильний тип для кожної послуги
      const processedServices = response.data.map(service => ({
        ...service,
        isAvailable: service.isAvailable === true
      }));
      
      console.log("Processed services:", processedServices.length);
      processedServices.forEach(service => {
        console.log(`Service ${service.name}, isAvailable: ${service.isAvailable}, type: ${typeof service.isAvailable}`);
      });
      
      setServices(processedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleAddNew = () => {
    setCurrentService(null);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setShowForm(true);
  };

  const handleDelete = (serviceId) => {
    setConfirmDelete(serviceId);
  };

  const confirmDeleteService = async () => {
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/services/${confirmDelete}`);
      setServices(services.filter(service => service._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Не вдалося видалити послугу. Спробуйте знову пізніше.");
    }
  };

  const handleSave = (savedService) => {
    // Переконуємося, що isAvailable має правильний тип
    const processedService = {
      ...savedService,
      isAvailable: savedService.isAvailable === true
    };
    
    console.log('Збереження послуги з isAvailable:', processedService.isAvailable);
    
    if (currentService) {
      // Оновлення існуючої послуги
      setServices(services.map(service => 
        service._id === processedService._id ? processedService : service
      ));
    } else {
      // Додавання нової послуги
      setServices([...services, processedService]);
    }
    
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentService(null);
  };

  // Форматування ціни та тривалості
  const formatPrice = (price) => {
    return `${price} грн`;
  };

  const formatDuration = (duration) => {
    return `${duration} хв`;
  };

  // Підготовка даних для таблиці
  const tableData = services.map(service => {
    console.log('Послуга в таблиці:', service.name);
    console.log('  - isAvailable значення:', service.isAvailable);
    console.log('  - isAvailable тип:', typeof service.isAvailable);
    
    // Перевірка, чи isAvailable є строго булевим значенням
    const availability = service.isAvailable === true;
    console.log('  - Обчислена доступність:', availability);
    
    return {
      id: service._id,
      name: service.name,
      description: service.description,
      price: formatPrice(service.price),
      duration: formatDuration(service.duration),
      isAvailable: availability ? 'Так' : 'Ні',
      actions: (
        <div className="action-buttons">
          <button 
            className="edit-button" 
            onClick={() => handleEdit({...service, isAvailable: availability})}
          >
            Редагувати
          </button>
          <button 
            className="delete-button" 
            onClick={() => handleDelete(service._id)}
          >
            Видалити
          </button>
        </div>
      )
    };
  });

  return (
    <div className="services-page">
      <h2>Послуги</h2>
      
      {!showForm && (
        <div className="actions-bar">
          <button className="add-button" onClick={handleAddNew}>
            Додати нову послугу
          </button>
        </div>
      )}
      
      {showForm ? (
        <ServiceForm 
          service={currentService} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <TableView 
          columns={['name', 'description', 'price', 'duration', 'isAvailable', 'actions']} 
          columnTitles={{
            name: "Назва",
            description: "Опис",
            price: "Ціна",
            duration: "Тривалість",
            isAvailable: "Доступна",
            actions: "Дії"
          }}
          data={tableData} 
        />
      )}
      
      {/* Діалог підтвердження видалення */}
      {confirmDelete && (
        <div className="delete-confirmation">
          <div className="delete-dialog">
            <h3>Підтвердження видалення</h3>
            <p>Ви впевнені, що хочете видалити цю послугу?</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-button" 
                onClick={() => setConfirmDelete(null)}
              >
                Скасувати
              </button>
              <button 
                className="confirm-button" 
                onClick={confirmDeleteService}
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;