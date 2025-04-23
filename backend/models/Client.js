const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  notes: { type: String }
});

module.exports = mongoose.model("Client", clientSchema);