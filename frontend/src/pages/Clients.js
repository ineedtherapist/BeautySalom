import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableView from '../components/TableView';

function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div>
      <h2>Clients</h2>
      <TableView columns={['fullName', 'phone', 'email', 'notes']} data={clients} />
    </div>
  );
}

export default Clients;