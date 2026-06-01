// ============================================
// SERVER.JS – Entry Point
// Go-Epic Backend API 2026
// Author: Dhyey Patel
// ============================================

require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n🚀 ==========================================');
  console.log(`   Go-Epic Backend API is running!`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL:  http://localhost:${PORT}`);
  console.log(`   API:  http://localhost:${PORT}/api/v1`);
  console.log('==========================================\n');
});

// Graceful Shutdown
process.on('unhandledRejection', (err) => {
  console.error(`\n❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

module.exports = server;
