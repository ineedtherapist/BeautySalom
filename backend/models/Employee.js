const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  position: { type: String, required: true },
  phone: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Employee", employeeSchema);