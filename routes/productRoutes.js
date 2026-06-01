// ============================================
// PRODUCT ROUTES – /api/v1/products
// ============================================

const express = require("express");
const router  = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getFeaturedProducts,
} = require("../controllers/productController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Public routes
router.get("/",         getAllProducts);    // GET /api/v1/products?search=&category=&brand=&minPrice=&maxPrice=&sort=&page=&limit=
router.get("/featured", getFeaturedProducts); // GET /api/v1/products/featured?limit=8
router.get("/:id",      getProductById);   // GET /api/v1/products/:id

// Admin-only routes
router.get(   "/stats", protect, authorize("admin"), getProductStats);  // GET  /api/v1/products/stats
router.post(  "/",      protect, authorize("admin"), createProduct);    // POST
router.put(   "/:id",   protect, authorize("admin"), updateProduct);    // PUT
router.delete("/:id",   protect, authorize("admin"), deleteProduct);    // DELETE

module.exports = router;
