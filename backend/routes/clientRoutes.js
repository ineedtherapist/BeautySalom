const express = require("express");
const Client = require("../models/Client");

const router = express.Router();

// GET: List all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Add a new client
router.post("/", async (req, res) => {
  const { fullName, phone, email, notes } = req.body;

  const newClient = new Client({ fullName, phone, email, notes });
  try {
    const savedClient = await newClient.save();
    res.json(savedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update client by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete client by ID
router.delete("/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;