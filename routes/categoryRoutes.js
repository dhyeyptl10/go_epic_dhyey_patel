// ============================================
// CATEGORY ROUTES – /api/v1/categories
// ============================================

const express = require("express");
const router  = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Public routes
router.get("/",       getAllCategories);   // GET  /api/v1/categories?search=
router.get("/stats",  getCategoryStats);  // GET  /api/v1/categories/stats
router.get("/:id",    getCategoryById);   // GET  /api/v1/categories/:id

// Admin-only routes
router.post(  "/",    protect, authorize("admin"), createCategory);   // POST
router.put(   "/:id", protect, authorize("admin"), updateCategory);   // PUT
router.delete("/:id", protect, authorize("admin"), deleteCategory);   // DELETE

module.exports = router;
