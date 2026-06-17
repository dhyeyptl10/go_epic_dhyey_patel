# 🚀 Go-Epic Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-blue.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![JSON Web Tokens](https://img.shields.io/badge/JWT-Authentication-orange.svg?style=flat-square&logo=json-web-tokens)](https://jwt.io/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

A production-ready, highly scalable **Node.js + Express + MongoDB** RESTful API backend built with industry-standard patterns and practices. 

This project covers a robust implementation of the **MVC architecture**, secure **JWT-based authentication**, custom validation layers, rate-limiting, and advanced **MongoDB aggregation pipelines** for real-time statistical analytics.

---

## 🛠️ Tech Stack & Key Technologies

Here is a detailed breakdown of the technical components used to build this backend:

### 🟢 Core Technologies
*   **Runtime Environment:** **Node.js** (v18+) - Asynchronous event-driven JavaScript runtime.
*   **Web Framework:** **Express.js** (v4.18.3) - Fast, minimalist web framework for routing and middleware orchestration.
*   **Database ODM:** **Mongoose** (v8.3.2) - Schema-based object modeling for robust MongoDB interactions.
*   **Programming Language:** **JavaScript (ES6+)** - Leveraging modern syntax features, promises, and clean code paradigms.

### 🔐 Security & Request Management
*   **Authentication:** **JSON Web Token (JWT)** (via `jsonwebtoken`) - For stateless, secure user sessions.
*   **Password Hashing:** **bcryptjs** - Salted password hashing for robust credential protection.
*   **Rate Limiting:** **express-rate-limit** - API request throttling to protect against brute-force and DDoS attempts.
*   **CORS Management:** **cors** - Configuration rules to allow secure cross-origin requests.
*   **Environment Variables:** **dotenv** - To isolate API configurations, secret keys, and credentials from the source code.

### 📂 Database (MongoDB)
*   **Engine:** **MongoDB** (NoSQL Document Database)
*   **Data Aggregation:** Advanced aggregation stages (`$match`, `$group`, `$sort`, etc.) to generate rich dynamic stats for products, orders, categories, and users.
*   **Indexing:** Custom MongoDB schema indexes to speed up text search and resource queries.
*   **Integrity:** Automatic cascade soft deletes and mongoose-level schema validations.

### 🩺 Logging & Utility Helpers
*   **HTTP Logger:** **Morgan** - For clean request logging in development/production environments.
*   **Database Seeder:** Automated JSON data importer to quickly populate development schemas.
*   **Database Backup:** Custom backup tool to export database collections directly to JSON formatted archives.

---


## 📁 Folder Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection with error handling
│   └── config.js          # Environment-based configuration (dev/prod)
│
├── controllers/           # Request/Response handling only (MVC)
│   ├── authController.js
│   ├── userController.js
│   ├── categoryController.js
│   ├── productController.js
│   └── orderController.js
│
├── services/              # Business logic layer (MVC)
│   ├── authService.js
│   ├── userService.js
│   ├── categoryService.js
│   ├── productService.js
│   └── orderService.js
│
├── models/                # MongoDB schemas (MVC)
│   ├── User.js
│   ├── Category.js
│   ├── Product.js
│   └── Order.js
│
├── routes/                # API route definitions (versioned: /api/v1)
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
│
├── middlewares/           # Middleware chain
│   ├── authMiddleware.js      # JWT protect + RBAC authorize
│   ├── errorMiddleware.js     # Global error handler + 404
│   ├── loggerMiddleware.js    # Request logging with debug mode
│   └── rateLimitMiddleware.js # Rate limiting (general + auth)
│
├── utils/                 # Shared utility functions
│   ├── apiResponse.js     # Standardized API response format
│   ├── asyncHandler.js    # Centralized async error wrapper
│   ├── pagination.js      # Reusable pagination utility
│   ├── filterBuilder.js   # Dynamic MongoDB filter builder
│   ├── validator.js       # Custom validation layer
│   ├── tokenUtils.js      # JWT generate + verify with expiry handling
│   ├── seeder.js          # Database seeding script
│   └── backup.js          # Data backup script
│
├── data/
│   └── dataset.json       # E-commerce seed dataset
│
├── server.js              # Express app entry point
├── package.json
├── .env.example           # Environment variable template
├── .gitignore
├── postman_collection.json # Complete Postman API docs
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone / Download the Project
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
nano .env
```

**Required `.env` values:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/fullstack_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
DEBUG_MODE=true
```

### 4. Seed the Database
```bash
npm run seed
```
This inserts all data from `data/dataset.json` into MongoDB automatically.

### 5. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`

---

## 🔐 Test Credentials

| Role  | Email               | Password    |
|-------|---------------------|-------------|
| Admin | admin@shop.com      | Admin@123   |
| User  | rahul@example.com   | Rahul@123   |
| User  | priya@example.com   | Priya@123   |

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

### 🏥 Health
| Method | Route     | Description          |
|--------|-----------|----------------------|
| GET    | /health   | Server health check  |

### 🔐 Auth (`/api/v1/auth`)
| Method | Route                   | Access  | Description        |
|--------|-------------------------|---------|--------------------|
| POST   | /register               | Public  | Register new user  |
| POST   | /login                  | Public  | Login & get token  |
| GET    | /me                     | Private | Get my profile     |
| PUT    | /me                     | Private | Update my profile  |
| PUT    | /change-password        | Private | Change password    |
| POST   | /logout                 | Private | Logout             |

### 👥 Users (`/api/v1/users`)
| Method | Route      | Access | Description        |
|--------|------------|--------|--------------------|
| GET    | /          | Admin  | Get all users      |
| GET    | /stats     | Admin  | User stats (agg)   |
| GET    | /:id       | Admin  | Get user by ID     |
| PUT    | /:id       | Admin  | Update user        |
| DELETE | /:id       | Admin  | Soft delete user   |

### 📂 Categories (`/api/v1/categories`)
| Method | Route      | Access | Description            |
|--------|------------|--------|------------------------|
| GET    | /          | Public | Get all categories     |
| GET    | /stats     | Public | Category stats (agg)   |
| GET    | /:id       | Public | Get category by ID     |
| POST   | /          | Admin  | Create category        |
| PUT    | /:id       | Admin  | Update category        |
| DELETE | /:id       | Admin  | Soft delete category   |

### 📦 Products (`/api/v1/products`)
| Method | Route       | Access | Description              |
|--------|-------------|--------|--------------------------|
| GET    | /           | Public | Get all products (filter/sort/search/paginate) |
| GET    | /featured   | Public | Get featured products    |
| GET    | /stats      | Admin  | Product stats (agg)      |
| GET    | /:id        | Public | Get product by ID        |
| POST   | /           | Admin  | Create product           |
| PUT    | /:id        | Admin  | Update product           |
| DELETE | /:id        | Admin  | Soft delete product      |

### 🛒 Orders (`/api/v1/orders`)
| Method | Route            | Access       | Description           |
|--------|------------------|--------------|-----------------------|
| POST   | /                | Private      | Place new order       |
| GET    | /my-orders       | Private      | Get my orders         |
| GET    | /:id             | Private/Admin| Get order by ID       |
| PUT    | /:id/cancel      | Private      | Cancel my order       |
| GET    | /                | Admin        | Get all orders        |
| GET    | /stats           | Admin        | Order stats (agg)     |
| PUT    | /:id/status      | Admin        | Update order status   |
| DELETE | /:id             | Admin        | Soft delete order     |

---

## 🔍 Advanced Query Examples

### Product Filtering & Searching
```
GET /api/v1/products?search=iphone
GET /api/v1/products?minPrice=1000&maxPrice=50000
GET /api/v1/products?brand=Apple&sort=-ratings
GET /api/v1/products?inStock=true&page=2&limit=5
GET /api/v1/products?sort=price,-ratings
GET /api/v1/products?fields=name,price,ratings
```

### Pagination
```
GET /api/v1/products?page=1&limit=10
GET /api/v1/users?page=2&limit=5
GET /api/v1/orders/my-orders?page=1&limit=20
```

### Sorting (prefix `-` for descending)
```
GET /api/v1/products?sort=-price          (highest price first)
GET /api/v1/products?sort=ratings         (lowest rating first)
GET /api/v1/products?sort=-ratings,price  (multi-sort)
```

---

## 🏗️ Architecture

### MVC Pattern
- **Models** → MongoDB schema definitions (Mongoose)
- **Services** → All business logic, DB queries, aggregations
- **Controllers** → Only handle `req` → `service()` → `res`

### Middleware Chain (in order)
```
Request → CORS → JSON Parser → Logger → Rate Limiter → Route → Auth → Validation → Controller → Service → DB
                                                                                                    ↓
Response ←────────────────────────────────────────────────────────────────── apiResponse ←─────────┘
                                                                         (on error) ↑
                                                                      Global Error Handler
```

---

## ✅ Checklist Coverage

| Feature                          | Status |
|----------------------------------|--------|
| Node.js + Express Setup          | ✅     |
| MongoDB + Mongoose               | ✅     |
| MVC Architecture                 | ✅     |
| Full CRUD (all 4 entities)       | ✅     |
| JWT Authentication               | ✅     |
| Role-Based Access Control (RBAC) | ✅     |
| Middleware System                | ✅     |
| CORS                             | ✅     |
| Error Handling (Global)          | ✅     |
| Advanced Querying                | ✅     |
| Filter, Sort, Search, Pagination | ✅     |
| Aggregation Pipeline             | ✅     |
| MongoDB Indexing                 | ✅     |
| API Versioning (/api/v1)         | ✅     |
| Soft Delete                      | ✅     |
| Timestamp Tracking               | ✅     |
| Password Hashing (bcrypt)        | ✅     |
| JWT Expiry Handling              | ✅     |
| Rate Limiting                    | ✅     |
| Request Logging Middleware       | ✅     |
| API Response Standardization     | ✅     |
| Centralized Async Handler        | ✅     |
| Custom Validation Layer          | ✅     |
| Dynamic Filter Builder           | ✅     |
| Reusable Pagination Utility      | ✅     |
| Database Seeding Script          | ✅     |
| Data Backup Script               | ✅     |
| Health Check API                 | ✅     |
| Debug Mode Logging               | ✅     |
| Environment-based Config         | ✅     |
| Advanced Regex Search            | ✅     |
| Postman Documentation            | ✅     |
| README                           | ✅     |

---

## 📬 Postman Setup

1. Open Postman
2. Click **Import** → select `postman_collection.json`
3. Set collection variable `BASE_URL` to `http://localhost:5000`
4. Run **Login (Admin)** — token is auto-saved as `TOKEN`
5. Test all other endpoints

---

## 🛠️ Scripts

| Command          | Description                    |
|------------------|--------------------------------|
| `npm run dev`    | Start with nodemon (dev)       |
| `npm start`      | Start production server        |
| `npm run seed`   | Seed database with dataset     |
| `npm run backup` | Export all collections to JSON |

---

## 📦 Dependencies

| Package           | Purpose                        |
|-------------------|--------------------------------|
| express           | Web framework                  |
| mongoose          | MongoDB ODM                    |
| jsonwebtoken      | JWT authentication             |
| bcryptjs          | Password hashing               |
| cors              | Cross-origin resource sharing  |
| dotenv            | Environment variables          |
| express-rate-limit| Rate limiting                  |
| morgan            | HTTP request logging (dev)     |
| nodemon (dev)     | Auto-restart on file change    |
