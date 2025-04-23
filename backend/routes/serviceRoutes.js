const express = require("express");
const Service = require("../models/Service");

const router = express.Router();

// GET: Отримати всі послуги
router.get("/", async (req, res) => {
  try {
    console.log("Fetching services from MongoDB...");
    const services = await Service.find();
    
    console.log("Services fetched:", services.length);
    
    // Вимкнення кешування
    res.set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    });
    
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET: Отримати одну послугу за ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: "Послугу не знайдено" });
    }
    
    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST: Створити нову послугу
router.post("/", async (req, res) => {
  const { name, description, price, duration, isAvailable } = req.body;

  // Перевірка обов'язкових полів
  if (!name || !description || price === undefined || duration === undefined) {
    return res.status(400).json({ error: "Назва, опис, ціна та тривалість є обов'язковими полями" });
  }

  const newService = new Service({ 
    name, 
    description, 
    price, 
    duration,
    isAvailable: isAvailable === undefined ? true : isAvailable
  });
  
  try {
    const savedService = await newService.save();
    console.log("New service created:", savedService);
    res.status(201).json(savedService);
  } catch (error) {
    console.error("Error creating service:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT: Оновити послугу
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, duration, isAvailable } = req.body;
    
    // Перевірка обов'язкових полів
    if (!name || !description || price === undefined || duration === undefined) {
      return res.status(400).json({ error: "Назва, опис, ціна та тривалість є обов'язковими полями" });
    }
    
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, price, duration, isAvailable },
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return res.status(404).json({ error: "Послугу не знайдено" });
    }
    
    console.log("Service updated:", updatedService);
    res.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Видалити послугу
router.delete("/:id", async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    
    if (!deletedService) {
      return res.status(404).json({ error: "Послугу не знайдено" });
    }
    
    console.log("Service deleted:", deletedService);
    res.json({ message: "Послугу успішно видалено", deletedService });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;