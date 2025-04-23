const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const clientRoutes = require("./routes/clientRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || "mongodb+srv://admin:123@cluster0.zz1iqwn.mongodb.net/beauty-salon?retryWrites=true&w=majority";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Таймаут 10 секунд
    socketTimeoutMS: 45000, // Таймаут сокету
  })
  .then(() => console.log(`Connected to MongoDB at ${mongoUri}`))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Завершити процес, якщо підключення не вдалося
  });

mongoose.connection.once("open", async () => {
  console.log("Testing direct database connection...");
  try {
    const clients = await mongoose.connection.db.collection("clients").find({}).toArray();
    console.log("Direct MongoDB result (clients):", clients);
  } catch (error) {
    console.error("Error testing MongoDB connection:", error.message);
  }
});

// Start server regardless of DB connection success/failure
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));