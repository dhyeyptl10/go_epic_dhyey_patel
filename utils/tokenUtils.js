const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token for a user
 * @param {Object} payload - Data to encode in token
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns decoded payload or throws error
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Differentiate between expired and invalid tokens
    if (error.name === "TokenExpiredError") {
      const err = new Error("Your session has expired. Please login again.");
      err.statusCode = 401;
      err.code = "TOKEN_EXPIRED";
      throw err;
    }
    const err = new Error("Invalid token. Please login again.");
    err.statusCode = 401;
    err.code = "INVALID_TOKEN";
    throw err;
  }
};

module.exports = { generateToken, verifyToken };
