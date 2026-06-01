# 🚀 Full Stack Backend Go Epic – 2026

A production-ready **Node.js + Express + MongoDB** RESTful API backend built with industry-standard practices. Covers all checklist requirements including MVC architecture, JWT authentication, advanced querying, aggregation pipelines, role-based access control, and much more.

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
