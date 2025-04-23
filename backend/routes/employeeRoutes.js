const express = require("express");
const Employee = require('../models/Employee');

const router = express.Router();

// GET: Отримати всіх співробітників
router.get("/", async (req, res) => {
  try {
    console.log("Fetching employees from MongoDB...");
    const employees = await Employee.find();
    
    console.log("Employees fetched:", employees.length);
    
    // Вимкнення кешування
    res.set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    });
    
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET: Отримати одного співробітника за ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: "Співробітника не знайдено" });
    }
    
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST: Створити нового співробітника
router.post("/", async (req, res) => {
  const { fullName, position, phone, isActive } = req.body;

  // Перевірка обов'язкових полів
  if (!fullName || !position || !phone) {
    return res.status(400).json({ error: "Ім'я, посада та телефон є обов'язковими полями" });
  }

  const newEmployee = new Employee({ 
    fullName, 
    position, 
    phone, 
    isActive: isActive === undefined ? true : isActive
  });
  
  try {
    const savedEmployee = await newEmployee.save();
    console.log("New employee created:", savedEmployee);
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error creating employee:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT: Оновити співробітника
router.put("/:id", async (req, res) => {
  try {
    const { fullName, position, phone, isActive } = req.body;
    
    // Перевірка обов'язкових полів
    if (!fullName || !position || !phone) {
      return res.status(400).json({ error: "Ім'я, посада та телефон є обов'язковими полями" });
    }
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { fullName, position, phone, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({ error: "Співробітника не знайдено" });
    }
    
    console.log("Employee updated:", updatedEmployee);
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Видалити співробітника
router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Співробітника не знайдено" });
    }
    
    console.log("Employee deleted:", deletedEmployee);
    res.json({ message: "Співробітника успішно видалено", deletedEmployee });
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;