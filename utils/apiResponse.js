// ============================================
// API RESPONSE STANDARDIZATION UTILITY
// All API responses follow this uniform format
// ============================================

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {Object} meta - Optional metadata (pagination, etc.)
 */
const sendSuccess = (res, statusCode = 200, message = "Success", data = null, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} error - Optional error details
 */
const sendError = (res, statusCode = 500, message = "Something went wrong", error = null) => {
  const response = {
    success: false,
    message,
  };

  if (error && process.env.NODE_ENV === "development") {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a paginated response
 */
const sendPaginated = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      pagination,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
