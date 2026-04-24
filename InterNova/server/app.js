const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errorMiddleware");

dotenv.config();

const app = express();

// CORS configuration with credentials support
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folders
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));

// Error handling middleware (must be last)
app.use(errorMiddleware);

module.exports = app;
