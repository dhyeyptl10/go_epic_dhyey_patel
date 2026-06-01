// ============================================
// REQUEST LOGGING MIDDLEWARE
// Logs every incoming request with details
// Debug mode provides extended logs
// ============================================

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Log on response finish
  res.on("finish", () => {
    const duration  = Date.now() - start;
    const status    = res.statusCode;
    const color     = status >= 500 ? "31" : status >= 400 ? "33" : status >= 300 ? "36" : "32";
    const method    = req.method.padEnd(7);
    const url       = req.originalUrl;

    const log = `[${timestamp}] \x1b[${color}m${status}\x1b[0m ${method} ${url} — ${duration}ms`;
    console.log(log);

    // Extended debug logging
    if (process.env.DEBUG_MODE === "true" && process.env.NODE_ENV === "development") {
      if (req.body && Object.keys(req.body).length > 0) {
        const safeBody = { ...req.body };
        if (safeBody.password) safeBody.password = "***hidden***";
        console.log(`   📦 Body: ${JSON.stringify(safeBody)}`);
      }
      if (Object.keys(req.query).length > 0) {
        console.log(`   🔍 Query: ${JSON.stringify(req.query)}`);
      }
      if (req.user) {
        console.log(`   👤 User: ${req.user.email} (${req.user.role})`);
      }
    }
  });

  next();
};

module.exports = loggerMiddleware;
