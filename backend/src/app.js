// ============================================
// APP.JS – Express Application
// Go-Epic Backend API 2026
// ============================================

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const errorMiddleware             = require('./middleware/error.middleware');
const { generalLimiter }          = require('./middleware/rateLimit.middleware');

// ── Route Imports ──────────────────────────────────────────────
const problemRoutes  = require('./routes/problem.routes');
const topicRoutes    = require('./routes/topic.routes');
const solutionRoutes = require('./routes/solution.routes');
const datasetRoutes  = require('./routes/dataset.routes');
const authRoutes     = require('./routes/auth.routes');
const jwtRoutes      = require('./routes/jwt.routes');
const adminRoutes    = require('./routes/admin.routes');
const searchRoutes   = require('./routes/search.routes');
const statsRoutes    = require('./routes/stats.routes');

const app = express();

// ── Core Middleware ────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', generalLimiter);

// ── Root Route ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Go-Epic Backend API is running 🎯',
    version: 'v1',
    author: 'Dhyey Patel',
    endpoints: {
      problems:  '/api/v1/problems',
      topics:    '/api/v1/topics',
      solutions: '/api/v1/solutions',
      datasets:  '/api/v1/datasets',
      auth:      '/api/v1/auth',
      jwt:       '/api/v1/jwt',
      admin:     '/api/v1/admin',
      search:    '/api/v1/search',
      stats:     '/api/v1/stats',
      health:    '/health',
      version:   '/version'
    }
  });
});

// ── Health Check ───────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success:     true,
    message:     '✅ Go-Epic Backend is healthy!',
    environment: process.env.NODE_ENV || 'development',
    uptime:      `${Math.floor(process.uptime())}s`,
    timestamp:   new Date().toISOString()
  });
});

// ── Version ────────────────────────────────────────────────────
app.get('/version', (req, res) => {
  res.status(200).json({
    success:  true,
    name:     'Go-Epic Backend API',
    version:  '1.0.0',
    author:   'Dhyey Patel',
    nodeVersion: process.version
  });
});

// ── API v1 Routes ──────────────────────────────────────────────
app.use('/api/v1/problems',  problemRoutes);
app.use('/api/v1/topics',    topicRoutes);
app.use('/api/v1/solutions', solutionRoutes);
app.use('/api/v1/datasets',  datasetRoutes);
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/jwt',       jwtRoutes);
app.use('/api/v1/admin',     adminRoutes);
app.use('/api/v1/search',    searchRoutes);
app.use('/api/v1/stats',     statsRoutes);

// ── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// ── Global Error Handler ───────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
