// ============================================
// API RESPONSE UTILS – Go-Epic Backend
// Standardized response format for all APIs
// ============================================

/**
 * Send a success response
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success:   true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send an error response
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success:   false,
    message,
    timestamp: new Date().toISOString()
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Send a paginated response
 */
const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page:     parseInt(page),
      limit:    parseInt(limit),
      total,
      pages:    totalPages,
      hasNext:  parseInt(page) < totalPages,
      hasPrev:  parseInt(page) > 1
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = { successResponse, errorResponse, paginatedResponse };
