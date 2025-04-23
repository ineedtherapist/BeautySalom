const mongoose = require("mongoose");

// Дефініція схеми клієнтів
const clientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  notes: { type: String },
});

// Назва колекції в MongoDB: clients
// Вказуємо точну назву колекції "clients" як третій параметр
module.exports = mongoose.model("Client", clientSchema, "clients");