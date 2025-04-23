import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableView from '../components/TableView';

function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  return (
    <div>
      <h2>Employees</h2>
      <TableView columns={['fullName', 'position', 'phone', 'isActive']} data={employees} />
    </div>
  );
}

export default Employees;