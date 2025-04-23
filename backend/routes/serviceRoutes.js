const express = require("express");
const Service = require("../models/Service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, price, duration } = req.body;

  const newService = new Service({ name, price, duration });
  try {
    const savedService = await newService.save();
    res.json(savedService);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;