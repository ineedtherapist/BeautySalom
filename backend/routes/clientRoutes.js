const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Імпортуємо модель клієнта
const Client = require("../models/Client");

// GET: Отримати всіх клієнтів
router.get("/", async (req, res) => {
  try {
    console.log("Fetching clients from MongoDB...");
    const clients = await Client.find();

    console.log("Clients fetched from database:", clients);

    if (clients.length === 0) {
      console.warn("No clients found in the database.");
    }

    // Вимкнення кешування
    res.set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error.message);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// GET: Отримати клієнта за ID
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: "Клієнта не знайдено" });
    }
    
    res.status(200).json(client);
  } catch (error) {
    console.error("Error fetching client:", error.message);
    res.status(500).json({ error: "Не вдалося отримати клієнта" });
  }
});

// POST: Створити нового клієнта
router.post("/", async (req, res) => {
  try {
    const { fullName, phone, email, notes } = req.body;
    
    // Перевірка обов'язкових полів
    if (!fullName || !phone || !email) {
      return res.status(400).json({ error: "Ім'я, телефон та email є обов'язковими полями" });
    }
    
    // Створюємо новий екземпляр клієнта
    const newClient = new Client({
      fullName,
      phone,
      email,
      notes
    });
    
    // Зберігаємо клієнта в базі даних
    const savedClient = await newClient.save();
    
    console.log("New client created:", savedClient);
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("Error creating client:", error.message);
    res.status(500).json({ error: "Не вдалося створити клієнта" });
  }
});

// PUT: Оновити клієнта за ID
router.put("/:id", async (req, res) => {
  try {
    const { fullName, phone, email, notes } = req.body;
    
    // Перевірка обов'язкових полів
    if (!fullName || !phone || !email) {
      return res.status(400).json({ error: "Ім'я, телефон та email є обов'язковими полями" });
    }
    
    // Знаходимо та оновлюємо клієнта
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, email, notes },
      { new: true } // Повертає оновлений документ
    );
    
    if (!updatedClient) {
      return res.status(404).json({ error: "Клієнта не знайдено" });
    }
    
    console.log("Client updated:", updatedClient);
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error.message);
    res.status(500).json({ error: "Не вдалося оновити клієнта" });
  }
});

// DELETE: Видалити клієнта за ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    
    if (!deletedClient) {
      return res.status(404).json({ error: "Клієнта не знайдено" });
    }
    
    console.log("Client deleted:", deletedClient);
    res.status(200).json({ message: "Клієнта успішно видалено", deletedClient });
  } catch (error) {
    console.error("Error deleting client:", error.message);
    res.status(500).json({ error: "Не вдалося видалити клієнта" });
  }
});

module.exports = router;