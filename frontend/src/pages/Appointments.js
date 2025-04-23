import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableView from '../components/TableView';

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>
      <TableView columns={['clientId', 'employeeId', 'serviceId', 'appointmentDate', 'status', 'note']} data={appointments} />
    </div>
  );
}

export default Appointments;