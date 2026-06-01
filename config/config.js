// ============================================
// ENVIRONMENT-BASED CONFIGURATION
// Separate settings for dev and production
// ============================================

const config = {
  development: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/fullstack_db",
    jwtSecret: process.env.JWT_SECRET || "dev_secret_key",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    debugMode: process.env.DEBUG_MODE === "true",
    corsOrigin: "*",
  },
  production: {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 600000,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 50,
    debugMode: false,
    corsOrigin: process.env.ALLOWED_ORIGIN || "https://yourfrontend.com",
  },
};

const env = process.env.NODE_ENV || "development";
module.exports = config[env];
