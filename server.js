// ============================================
// SERVER.JS – Entry Point
// Full Stack Backend 2026
// ============================================

require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const connectDB         = require("./config/db");
const config            = require("./config/config");
const loggerMiddleware  = require("./middlewares/loggerMiddleware");
const { generalLimiter }= require("./middlewares/rateLimitMiddleware");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

// ── Route Imports ─────────────────────────────────────────────────────────────
const authRoutes     = require("./routes/authRoutes");
const userRoutes     = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes  = require("./routes/productRoutes");
const orderRoutes    = require("./routes/orderRoutes");

// ── Initialize Express App ───────────────────────────────────────────────────
const app = express();

// ── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ============================================================
// MIDDLEWARE CHAIN (order matters!)
// 1. CORS           → Allow cross-origin requests
// 2. JSON Parser    → Parse incoming request bodies
// 3. Logger         → Log all requests
// 4. Rate Limiter   → Protect against abuse
// ============================================================

// 1. CORS
app.use(cors({ origin: config.corsOrigin, credentials: true }));

// 2. Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 3. Request Logger (logs method, URL, status, duration)
app.use(loggerMiddleware);

// 4. Rate Limiter (general – 100 req per 15 min per IP)
app.use("/api", generalLimiter);

// ── Health Check API ──────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is up and running!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: "MongoDB Connected",
    version: "1.0.0",
  });
});

// ── Root Route ────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Full Stack Backend API 2026 🎯",
    version: "v1",
    documentation: "Import postman_collection.json to test all APIs",
    endpoints: {
      health:     "GET /health",
      auth:       "/api/v1/auth",
      users:      "/api/v1/users",
      categories: "/api/v1/categories",
      products:   "/api/v1/products",
      orders:     "/api/v1/orders",
    },
  });
});

// ── API Routes (v1) ──────────────────────────────────────────────────────────
app.use("/api/v1/auth",       authRoutes);
app.use("/api/v1/users",      userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products",   productRoutes);
app.use("/api/v1/orders",     orderRoutes);

// ── 404 Handler (undefined routes) ───────────────────────────────────────────
app.use(notFound);

// ── Global Error Handler (must be last middleware) ───────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log("\n🚀 ==========================================");
  console.log(`   Server running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL:  http://localhost:${PORT}`);
  console.log(`   API:  http://localhost:${PORT}/api/v1`);
  console.log("==========================================\n");
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error(`\n❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("📴 SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});

module.exports = app;
