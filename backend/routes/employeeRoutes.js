const express = require("express");
const Employee = require('../models/Employee');

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { fullName, position, phone, isActive } = req.body;

  const newEmployee = new Employee({ fullName, position, phone, isActive });
  try {
    const savedEmployee = await newEmployee.save();
    res.json(savedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;