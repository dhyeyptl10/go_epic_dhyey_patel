// ============================================
// ORDER ROUTES – /api/v1/orders
// ============================================

const express = require("express");
const router  = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All order routes require authentication
router.use(protect);

// User routes
router.post("/",              createOrder);  // POST   /api/v1/orders
router.get( "/my-orders",     getMyOrders);  // GET    /api/v1/orders/my-orders
router.get( "/:id",           getOrderById); // GET    /api/v1/orders/:id
router.put( "/:id/cancel",    cancelOrder);  // PUT    /api/v1/orders/:id/cancel

// Admin-only routes
router.get(   "/",            authorize("admin"), getAllOrders);      // GET    /api/v1/orders
router.get(   "/stats",       authorize("admin"), getOrderStats);     // GET    /api/v1/orders/stats (must be before /:id)
router.put(   "/:id/status",  authorize("admin"), updateOrderStatus); // PUT    /api/v1/orders/:id/status
router.delete("/:id",         authorize("admin"), deleteOrder);       // DELETE /api/v1/orders/:id

module.exports = router;
