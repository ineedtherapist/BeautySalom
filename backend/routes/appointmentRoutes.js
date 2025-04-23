const express = require("express");
const Appointment = require("../models/Appointment");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const Service = require("../models/Service");

const router = express.Router();

// GET: Отримати всі записи
router.get("/", async (req, res) => {
  try {
    console.log("Fetching appointments from MongoDB...");
    const appointments = await Appointment.find()
      .populate("clientId", "fullName")
      .populate("employeeId", "fullName")
      .populate("serviceId", "name price duration");
    
    console.log("Appointments fetched:", appointments.length);
    
    // Вимкнення кешування
    res.set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    });
    
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET: Отримати один запис за ID
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("clientId", "fullName")
      .populate("employeeId", "fullName")
      .populate("serviceId", "name price duration");
    
    if (!appointment) {
      return res.status(404).json({ error: "Запис не знайдено" });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST: Створити новий запис
router.post("/", async (req, res) => {
  const { clientId, employeeId, serviceId, appointmentDate, status, note } = req.body;

  // Перевірка обов'язкових полів
  if (!clientId || !employeeId || !serviceId || !appointmentDate) {
    return res.status(400).json({ error: "Клієнт, співробітник, послуга та дата запису є обов'язковими полями" });
  }

  // Перевірка існування клієнта, співробітника та послуги
  try {
    const clientExists = await Client.findById(clientId);
    if (!clientExists) {
      return res.status(400).json({ error: "Вказаного клієнта не існує" });
    }
    
    const employeeExists = await Employee.findById(employeeId);
    if (!employeeExists) {
      return res.status(400).json({ error: "Вказаного співробітника не існує" });
    }
    
    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) {
      return res.status(400).json({ error: "Вказаної послуги не існує" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Помилка перевірки даних: " + error.message });
  }

  const newAppointment = new Appointment({ 
    clientId, 
    employeeId, 
    serviceId, 
    appointmentDate, 
    status: status || "Scheduled",
    note
  });
  
  try {
    const savedAppointment = await newAppointment.save();
    
    // Повертаємо повні дані з популяцією полів
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate("clientId", "fullName")
      .populate("employeeId", "fullName")
      .populate("serviceId", "name price duration");
    
    console.log("New appointment created:", populatedAppointment);
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT: Оновити запис
router.put("/:id", async (req, res) => {
  try {
    const { clientId, employeeId, serviceId, appointmentDate, status, note } = req.body;
    
    // Перевірка обов'язкових полів
    if (!clientId || !employeeId || !serviceId || !appointmentDate) {
      return res.status(400).json({ error: "Клієнт, співробітник, послуга та дата запису є обов'язковими полями" });
    }
    
    // Перевірка існування клієнта, співробітника та послуги
    try {
      const clientExists = await Client.findById(clientId);
      if (!clientExists) {
        return res.status(400).json({ error: "Вказаного клієнта не існує" });
      }
      
      const employeeExists = await Employee.findById(employeeId);
      if (!employeeExists) {
        return res.status(400).json({ error: "Вказаного співробітника не існує" });
      }
      
      const serviceExists = await Service.findById(serviceId);
      if (!serviceExists) {
        return res.status(400).json({ error: "Вказаної послуги не існує" });
      }
    } catch (error) {
      return res.status(400).json({ error: "Помилка перевірки даних: " + error.message });
    }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { clientId, employeeId, serviceId, appointmentDate, status, note },
      { new: true, runValidators: true }
    )
      .populate("clientId", "fullName")
      .populate("employeeId", "fullName")
      .populate("serviceId", "name price duration");
    
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Запис не знайдено" });
    }
    
    console.log("Appointment updated:", updatedAppointment);
    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Видалити запис
router.delete("/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Запис не знайдено" });
    }
    
    console.log("Appointment deleted:", deletedAppointment);
    res.json({ message: "Запис успішно видалено", deletedAppointment });
  } catch (error) {
    console.error("Error deleting appointment:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;