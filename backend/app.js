const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// 1. Import your Route files
const authRoutes = require("./routes/authRoutes");   // <-- Added for Auth Connection
const fraudRoutes = require("./routes/fraudRoutes"); 
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// 2. Mount your API routes
app.use("/api/auth", authRoutes);   // <-- Added to connect authentication endpoints
app.use("/api/fraud", fraudRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const alertRoutes = require("./routes/alertRoutes");
app.use("/api/alerts", alertRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fraud Alert Dashboard API is healthy"
  });
});

module.exports = app;

