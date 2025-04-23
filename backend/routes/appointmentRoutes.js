const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("clientId", "fullName")
      .populate("employeeId", "fullName")
      .populate("serviceId", "name");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;