# 🚀 Go-Epic Backend API – 2026

A **production-ready Node.js + Express** RESTful API backend for managing coding problems, topics, solutions, and datasets. Built with industry-standard practices covering all 10 phases from basic CRUD to JWT authentication, middleware, rate limiting, search, and statistics.

**Author:** Dhyey Patel

---

## 📁 Folder Structure

```
backend/
├── server.js                        # Entry point
├── package.json
├── .env.example                     # Environment template
├── .gitignore
├── README.md
│
└── src/
    ├── app.js                       # Express app config
    │
    ├── config/
    │   └── db.js                    # DB config (JSON data store)
    │
    ├── data/                        # In-memory JSON data
    │   ├── problems.data.js         # 10 coding problems
    │   ├── topics.data.js           # 7 DSA topics
    │   ├── solutions.data.js        # 5 optimized solutions
    │   ├── datasets.data.js         # 4 datasets
    │   └── users.data.js            # 3 demo users
    │
    ├── controllers/
    │   ├── problem.controller.js
    │   ├── topic.controller.js
    │   ├── solution.controller.js
    │   ├── dataset.controller.js
    │   ├── auth.controller.js       # Session-based auth
    │   ├── jwt.controller.js        # JWT auth
    │   ├── search.controller.js     # Global search
    │   └── stats.controller.js      # Aggregations
    │
    ├── routes/
    │   ├── problem.routes.js
    │   ├── topic.routes.js
    │   ├── solution.routes.js
    │   ├── dataset.routes.js
    │   ├── auth.routes.js
    │   ├── jwt.routes.js
    │   ├── admin.routes.js
    │   ├── search.routes.js
    │   └── stats.routes.js
    │
    ├── middleware/
    │   ├── auth.middleware.js        # JWT token verification
    │   ├── admin.middleware.js       # RBAC (admin-only)
    │   ├── error.middleware.js       # Global error handler
    │   ├── validation.middleware.js  # Request validation
    │   └── rateLimit.middleware.js   # Rate limiting (3 tiers)
    │
    └── utils/
        ├── apiResponse.js            # Standardized responses
        └── helpers.js                # paginate, sort, filter, etc.
```

---

## ⚙️ Setup

```bash
# 1. Clone / enter directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start server
npm run dev       # development (nodemon)
npm start         # production
```

Server runs at: **http://localhost:5000**

---

## 🔐 Test Credentials

| Role  | Email              | Password    |
|-------|--------------------|-------------|
| Admin | admin@goepic.com   | Admin@123   |
| User  | dhyey@goepic.com   | Dhyey@123   |
| User  | user@goepic.com    | User@123    |

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

### 🏥 System
| Method | Route      | Description         |
|--------|------------|---------------------|
| GET    | /          | API overview        |
| GET    | /health    | Health check        |
| GET    | /version   | Version info        |

### 🧩 Problems (`/api/v1/problems`)
| Method | Route             | Access  | Description                         |
|--------|-------------------|---------|-------------------------------------|
| GET    | /                 | Public  | Get all (filter/sort/search/paginate)|
| GET    | /random           | Public  | Get random problem                  |
| GET    | /:problemId       | Public  | Get by ID                           |
| POST   | /                 | Admin   | Create problem                      |
| PUT    | /:problemId       | Admin   | Replace problem                     |
| PATCH  | /:problemId       | Admin   | Update problem                      |
| DELETE | /:problemId       | Admin   | Soft delete                         |

### 📚 Topics (`/api/v1/topics`)
| Method | Route            | Access  | Description        |
|--------|------------------|---------|--------------------|
| GET    | /                | Public  | Get all topics     |
| GET    | /popular         | Public  | Get popular topics |
| GET    | /:topicName      | Public  | Get by name        |
| POST   | /                | Admin   | Create topic       |
| PUT    | /:topicName      | Admin   | Replace topic      |
| PATCH  | /:topicName      | Admin   | Update topic       |
| DELETE | /:topicName      | Admin   | Delete topic       |

### 💡 Solutions (`/api/v1/solutions`)
| Method | Route             | Access  | Description    |
|--------|-------------------|---------|----------------|
| GET    | /                 | Public  | Get all        |
| GET    | /:solutionId      | Public  | Get by ID      |
| POST   | /                 | Auth    | Add solution   |
| PUT    | /:solutionId      | Admin   | Replace        |
| PATCH  | /:solutionId      | Admin   | Update         |
| DELETE | /:solutionId      | Admin   | Delete         |

### 🗄️ Datasets (`/api/v1/datasets`)
| Method | Route             | Access  | Description   |
|--------|-------------------|---------|---------------|
| GET    | /                 | Public  | Get all       |
| GET    | /:datasetId       | Public  | Get by ID     |
| POST   | /                 | Admin   | Create        |
| PUT    | /:datasetId       | Admin   | Replace       |
| PATCH  | /:datasetId       | Admin   | Update        |
| DELETE | /:datasetId       | Admin   | Soft delete   |

### 🔐 Auth (`/api/v1/auth`)  — Session-based
| Method | Route     | Description          |
|--------|-----------|----------------------|
| POST   | /register | Register new user    |
| POST   | /login    | Login → get sessionId|
| POST   | /logout   | Logout               |
| GET    | /profile  | Get profile (X-Session-ID header) |
| PATCH  | /profile  | Update profile       |

### 🔑 JWT (`/api/v1/jwt`)  — Token-based
| Method | Route            | Description              |
|--------|------------------|--------------------------|
| POST   | /generate-token  | Login → get JWT tokens   |
| POST   | /verify-token    | Verify a token           |
| POST   | /refresh-token   | Refresh access token     |
| GET    | /profile         | Profile (Bearer token)   |
| GET    | /dashboard       | Dashboard (Bearer token) |

### 🛡️ Admin (`/api/v1/admin`)
| Method | Route              | Description         |
|--------|--------------------|---------------------|
| GET    | /users             | Get all users       |
| GET    | /users/:userId     | Get user by ID      |
| PATCH  | /users/:userId     | Update user/role    |
| DELETE | /users/:userId     | Deactivate user     |
| GET    | /stats             | Admin dashboard     |

### 🔍 Search (`/api/v1/search`)
| Method | Route             | Description               |
|--------|-------------------|---------------------------|
| GET    | /problems?q=...   | Search problems            |
| GET    | /topics?q=...     | Search topics              |
| GET    | /solutions?q=...  | Search solutions           |
| GET    | /datasets?q=...   | Search datasets            |
| GET    | /all?q=...        | Global search (all)        |

### 📊 Stats (`/api/v1/stats`)
| Method | Route        | Description               |
|--------|--------------|---------------------------|
| GET    | /overview    | Platform-wide summary     |
| GET    | /problems    | Problem statistics        |
| GET    | /topics      | Topic statistics          |
| GET    | /solutions   | Solution statistics       |
| GET    | /datasets    | Dataset statistics        |

---

## 🔍 Query Parameter Examples

```bash
# Filter by difficulty and topic
GET /api/v1/problems?difficulty=easy&topic=arrays

# Search by keyword
GET /api/v1/problems?keyword=worker

# Sort (prefix '-' for descending)
GET /api/v1/problems?sort=-difficulty

# Pagination
GET /api/v1/problems?page=1&limit=5

# Combined
GET /api/v1/problems?difficulty=medium&sort=topic&page=1&limit=10

# Search solutions for mutex
GET /api/v1/search/solutions?q=mutex

# Global search
GET /api/v1/search/all?q=concurrency
```

---

## ✅ Phase Coverage

| Phase | Feature                             | Status |
|-------|-------------------------------------|--------|
| 1     | Express Server Setup                | ✅     |
| 2     | Full CRUD (4 entities)              | ✅     |
| 3     | Route Parameters                    | ✅     |
| 4     | Query Parameters (filter/search)    | ✅     |
| 5     | Pagination & Sorting                | ✅     |
| 6     | Search Routes (global + per-entity) | ✅     |
| 7     | Session-Based Authentication        | ✅     |
| 8     | JWT Authentication + Refresh Token  | ✅     |
| 9     | Middleware (auth/admin/error/rate)  | ✅     |
| 10    | Stats, Random Problem, Popular Topics | ✅   |

---

## 📦 Dependencies

| Package            | Purpose                    |
|--------------------|----------------------------|
| express            | Web framework              |
| jsonwebtoken       | JWT authentication         |
| bcryptjs           | Password hashing           |
| cors               | Cross-origin support       |
| dotenv             | Environment variables      |
| express-rate-limit | Rate limiting              |
| morgan             | HTTP request logging       |
| nodemon (dev)      | Auto-restart               |
