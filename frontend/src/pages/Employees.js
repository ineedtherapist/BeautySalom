import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableView from '../components/TableView';
import EmployeeForm from '../components/EmployeeForm';
import '../styles/Employees.css';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log("Fetching employees data...");
      const response = await axios.get('http://localhost:5000/api/employees');
      console.log("Employees fetched:", response.data.length);
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleAddNew = () => {
    setCurrentEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = (employeeId) => {
    setConfirmDelete(employeeId);
  };

  const confirmDeleteEmployee = async () => {
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/employees/${confirmDelete}`);
      setEmployees(employees.filter(employee => employee._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Failed to delete employee:", error);
      alert("Не вдалося видалити співробітника. Спробуйте знову пізніше.");
    }
  };

  const handleSave = (savedEmployee) => {
    if (currentEmployee) {
      // Оновлення існуючого співробітника
      setEmployees(employees.map(employee => 
        employee._id === savedEmployee._id ? savedEmployee : employee
      ));
    } else {
      // Додавання нового співробітника
      setEmployees([...employees, savedEmployee]);
    }
    
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentEmployee(null);
  };

  // Підготовка даних для таблиці
  const tableData = employees.map(employee => ({
    id: employee._id,
    fullName: employee.fullName,
    position: employee.position,
    phone: employee.phone,
    isActive: employee.isActive ? 'Так' : 'Ні',
    actions: (
      <div className="action-buttons">
        <button 
          className="edit-button" 
          onClick={() => handleEdit(employee)}
        >
          Редагувати
        </button>
        <button 
          className="delete-button" 
          onClick={() => handleDelete(employee._id)}
        >
          Видалити
        </button>
      </div>
    )
  }));

  return (
    <div className="employees-page">
      <h2>Співробітники</h2>
      
      {!showForm && (
        <div className="actions-bar">
          <button className="add-button" onClick={handleAddNew}>
            Додати нового співробітника
          </button>
        </div>
      )}
      
      {showForm ? (
        <EmployeeForm 
          employee={currentEmployee} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <TableView 
          columns={['fullName', 'position', 'phone', 'isActive', 'actions']} 
          columnTitles={{
            fullName: "Ім'я",
            position: "Посада",
            phone: "Телефон",
            isActive: "Активний",
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
            <p>Ви впевнені, що хочете видалити цього співробітника?</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-button" 
                onClick={() => setConfirmDelete(null)}
              >
                Скасувати
              </button>
              <button 
                className="confirm-button" 
                onClick={confirmDeleteEmployee}
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

export default Employees;