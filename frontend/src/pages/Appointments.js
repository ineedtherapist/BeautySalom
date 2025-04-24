import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableView from '../components/TableView';
import AppointmentForm from '../components/AppointmentForm';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching appointments data...");
      const response = await axios.get('http://localhost:5000/api/appointments');
      console.log("Appointments fetched:", response.data.length);
      
      // Фільтрація записів, які мають всі необхідні зв'язки
      const validAppointments = response.data.filter(appointment => 
        appointment.clientId && appointment.employeeId && appointment.serviceId
      );
      
      if (validAppointments.length !== response.data.length) {
        console.warn(`Filtered out ${response.data.length - validAppointments.length} invalid appointments`);
      }
      
      setAppointments(validAppointments);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentAppointment(null);
    setShowForm(true);
  };

  const handleEdit = (appointment) => {
    setCurrentAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = (appointmentId) => {
    setConfirmDelete(appointmentId);
  };

  const confirmDeleteAppointment = async () => {
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${confirmDelete}`);
      setAppointments(appointments.filter(appointment => appointment._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      alert("Не вдалося видалити запис. Спробуйте знову пізніше.");
    }
  };

  const handleSave = (savedAppointment) => {
    if (currentAppointment) {
      // Оновлення існуючого запису
      setAppointments(appointments.map(appointment => 
        appointment._id === savedAppointment._id ? savedAppointment : appointment
      ));
    } else {
      // Додавання нового запису
      setAppointments([...appointments, savedAppointment]);
    }
    
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentAppointment(null);
  };

  // Переклад статусів
  const translateStatus = (status) => {
    const statusMap = {
      'Scheduled': 'Заплановано',
      'Completed': 'Завершено',
      'Cancelled': 'Скасовано'
    };
    return statusMap[status] || status;
  };

  // Форматування дати
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('uk-UA', options);
  };

  // Підготовка даних для таблиці
  const tableData = appointments.map(appointment => ({
    id: appointment._id,
    client: appointment.clientId.fullName,
    employee: appointment.employeeId.fullName,
    service: appointment.serviceId.name,
    price: `${appointment.serviceId.price} грн`,
    duration: `${appointment.serviceId.duration} хв`,
    appointmentDate: formatDate(appointment.appointmentDate),
    status: translateStatus(appointment.status),
    note: appointment.note || '',
    actions: (
      <div className="action-buttons">
        <button 
          className="edit-button" 
          onClick={() => handleEdit(appointment)}
        >
          Редагувати
        </button>
        <button 
          className="delete-button" 
          onClick={() => handleDelete(appointment._id)}
        >
          Видалити
        </button>
      </div>
    )
  }));

  return (
    <div className="appointments-page">
      <h2>Записи</h2>
      
      {!showForm && (
        <div className="actions-bar">
          <button className="add-button" onClick={handleAddNew}>
            Додати новий запис
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading">Завантаження даних...</div>
      ) : showForm ? (
        <AppointmentForm 
          appointment={currentAppointment} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <TableView 
          columns={['client', 'employee', 'service', 'price', 'duration', 'appointmentDate', 'status', 'note', 'actions']} 
          columnTitles={{
            client: "Клієнт",
            employee: "Співробітник",
            service: "Послуга",
            price: "Ціна",
            duration: "Тривалість",
            appointmentDate: "Дата та час",
            status: "Статус",
            note: "Примітка",
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
            <p>Ви впевнені, що хочете видалити цей запис?</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-button" 
                onClick={() => setConfirmDelete(null)}
              >
                Скасувати
              </button>
              <button 
                className="confirm-button" 
                onClick={confirmDeleteAppointment}
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

export default Appointments;