// ============================================
// GLOBAL ERROR HANDLING MIDDLEWARE
// Catches all errors, formats consistent responses
// ============================================

const { sendError } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal Server Error";

  // ── Mongoose Validation Error ──────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(", ");
  }

  // ── Mongoose Duplicate Key Error ───────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `'${err.keyValue[field]}' already exists. Please use a different ${field}.`;
  }

  // ── Mongoose CastError (invalid ObjectId) ─────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field '${err.path}': '${err.value}'`;
  }

  // ── JWT Errors ─────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please login again.";
  }

  // ── Debug: Log stack in development ───────────────────────────
  if (process.env.NODE_ENV === "development" && process.env.DEBUG_MODE === "true") {
    console.error(`\n❌ ERROR [${req.method} ${req.originalUrl}]`);
    console.error(`   Status: ${statusCode}`);
    console.error(`   Message: ${message}`);
    console.error(`   Stack: ${err.stack}\n`);
  }

  return sendError(res, statusCode, message, process.env.NODE_ENV === "development" ? err.stack : null);
};

/**
 * notFound - Handles undefined routes (404)
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
