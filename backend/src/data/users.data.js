// ============================================
// USERS DATA – Go-Epic Backend
// In-memory user store (shared across auth & jwt)
// ============================================

const bcrypt = require('bcryptjs');

// Pre-hashed passwords for demo users
const users = [
  {
    id: 'user_001',
    name: 'Admin User',
    email: 'admin@goepic.com',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'user_002',
    name: 'Dhyey Patel',
    email: 'dhyey@goepic.com',
    password: bcrypt.hashSync('Dhyey@123', 10),
    role: 'user',
    isActive: true,
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 'user_003',
    name: 'Test User',
    email: 'user@goepic.com',
    password: bcrypt.hashSync('User@123', 10),
    role: 'user',
    isActive: true,
    createdAt: '2024-01-03T00:00:00.000Z'
  }
];

// In-memory session store (for session-based auth)
const sessions = {};

module.exports = { users, sessions };
