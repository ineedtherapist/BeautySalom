const express = require("express");
const Service = require("../models/Service");

const router = express.Router();

// GET: Отримати всі послуги
router.get("/", async (req, res) => {
  try {
    console.log("Fetching services from MongoDB...");
    const services = await Service.find();
    console.log(`Found ${services.length} services`);
    
    // Для діагностики
    services.forEach(service => {
      console.log(`Service ${service.name}, isAvailable: ${service.isAvailable}, type: ${typeof service.isAvailable}`);
    });
    
    // Вимкнення кешування
    res.set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    });
    
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Помилка сервера при отриманні послуг" });
  }
});

// GET: Отримати послугу за ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Послугу не знайдено" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера при отриманні послуги" });
  }
});

// POST: Створити нову послугу
router.post("/", async (req, res) => {
  try {
    const { name, description, price, duration, isAvailable } = req.body;
    
    // Перевірка обов'язкових полів
    if (!name || !description || price === undefined || duration === undefined) {
      return res.status(400).json({ error: "Назва, опис, ціна та тривалість є обов'язковими полями" });
    }
    
    // Для діагностики
    console.log("Створення нової послуги");
    console.log("isAvailable отримано:", isAvailable);
    console.log("isAvailable тип:", typeof isAvailable);
    
    // Перетворюємо на булевий тип
    const isAvailableBool = isAvailable === true;
    console.log("isAvailable після перетворення:", isAvailableBool);
    
    const newService = new Service({
      name,
      description,
      price,
      duration,
      isAvailable: isAvailableBool
    });
    
    const savedService = await newService.save();
    console.log("Послугу збережено, isAvailable:", savedService.isAvailable);
    
    res.status(201).json(savedService);
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ error: "Помилка сервера при створенні послуги" });
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
    
    // Для діагностики
    console.log("Оновлення послуги");
    console.log("isAvailable отримано:", isAvailable);
    console.log("isAvailable тип:", typeof isAvailable);
    
    // Перетворюємо на булевий тип
    const isAvailableBool = isAvailable === true;
    console.log("isAvailable після перетворення:", isAvailableBool);
    
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        duration,
        isAvailable: isAvailableBool
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return res.status(404).json({ error: "Послугу не знайдено" });
    }
    
    console.log("Послугу оновлено, isAvailable:", updatedService.isAvailable);
    
    res.json(updatedService);
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: "Помилка сервера при оновленні послуги" });
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