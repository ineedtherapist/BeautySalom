import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableView from '../components/TableView';
import ClientForm from '../components/ClientForm';
import '../styles/Clients.css';

function Clients() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      console.log("Sending request to API: http://localhost:5000/api/clients");
      const response = await axios.get("http://localhost:5000/api/clients");

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  const handleAddNew = () => {
    setCurrentClient(null);
    setShowForm(true);
  };

  const handleEdit = (client) => {
    setCurrentClient(client);
    setShowForm(true);
  };

  const handleDelete = (clientId) => {
    setConfirmDelete(clientId);
  };

  const confirmDeleteClient = async () => {
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/clients/${confirmDelete}`);
      setClients(clients.filter(client => client._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Failed to delete client:", error);
      alert("Не вдалося видалити клієнта. Спробуйте знову пізніше.");
    }
  };

  const handleSave = (savedClient) => {
    if (currentClient) {
      // Оновлення існуючого клієнта
      setClients(clients.map(client => 
        client._id === savedClient._id ? savedClient : client
      ));
    } else {
      // Додавання нового клієнта
      setClients([...clients, savedClient]);
    }
    
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentClient(null);
  };

  // Дані для TableView з діями (редагування/видалення)
  const tableData = clients.map(client => ({
    id: client._id,
    fullName: client.fullName,
    phone: client.phone,
    email: client.email,
    notes: client.notes || 'Немає',
    actions: (
      <div className="action-buttons">
        <button 
          className="edit-button" 
          onClick={() => handleEdit(client)}
        >
          Редагувати
        </button>
        <button 
          className="delete-button" 
          onClick={() => handleDelete(client._id)}
        >
          Видалити
        </button>
      </div>
    )
  }));

  return (
    <div className="clients-page">
      <h2>Клієнти</h2>
      
      {!showForm && (
        <div className="actions-bar">
          <button className="add-button" onClick={handleAddNew}>
            Додати нового клієнта
          </button>
        </div>
      )}
      
      {showForm ? (
        <ClientForm 
          client={currentClient} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <TableView 
          columns={['fullName', 'phone', 'email', 'notes', 'actions']} 
          columnTitles={{
            fullName: "Ім'я",
            phone: "Телефон",
            email: "Email",
            notes: "Примітки",
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
            <p>Ви впевнені, що хочете видалити цього клієнта?</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-button" 
                onClick={() => setConfirmDelete(null)}
              >
                Скасувати
              </button>
              <button 
                className="confirm-button" 
                onClick={confirmDeleteClient}
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

export default Clients;