const express = require("express");
const router = express.Router();

// Імпортуємо модель клієнта
const Client = require("../models/Client");

// GET: Отримати всіх клієнтів
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find(); // Отримуємо всіх клієнтів з MongoDB
    res.status(200).json(clients); // Повертаємо JSON відповідь
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" }); // Відповідь при помилці
  }
});

module.exports = router;