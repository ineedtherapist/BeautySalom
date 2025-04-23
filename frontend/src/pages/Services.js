import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableView from '../components/TableView';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  return (
    <div>
      <h2>Services</h2>
      <TableView columns={['name', 'description', 'price', 'duration', 'isAvailable']} data={services} />
    </div>
  );
}

export default Services;