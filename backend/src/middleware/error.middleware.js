// ============================================
// ERROR MIDDLEWARE – Global Error Handler
// Go-Epic Backend
// ============================================

const errorMiddleware = (err, req, res, next) => {
  console.error(`\n❌ [${new Date().toISOString()}] Error on ${req.method} ${req.originalUrl}`);
  console.error(`   Message: ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(`   Stack: ${err.stack}`);
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success:   false,
    message:   err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;
