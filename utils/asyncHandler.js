// ============================================
// CENTRALIZED ASYNC ERROR HANDLER
// Wraps async route handlers to avoid
// repetitive try-catch blocks in controllers
// ============================================

/**
 * asyncHandler - Wraps async controller functions
 * Automatically catches errors and passes to global error handler
 *
 * Usage:
 *   router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
