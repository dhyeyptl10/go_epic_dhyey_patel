// ============================================
// ORDER CONTROLLER – Request/Response Only
// ============================================

const asyncHandler  = require("../utils/asyncHandler");
const { sendSuccess, sendPaginated } = require("../utils/apiResponse");
const { validateOrder } = require("../utils/validator");
const orderService  = require("../services/orderService");

// @desc    Place new order
// @route   POST /api/v1/orders
// @access  Private (User)
const createOrder = asyncHandler(async (req, res) => {
  const errors = validateOrder(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  const order = await orderService.createOrder(req.user.id, req.body);
  sendSuccess(res, 201, "Order placed successfully! 🎉", { order });
});

// @desc    Get my orders
// @route   GET /api/v1/orders/my-orders
// @access  Private (User)
const getMyOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getMyOrders(req.user.id, req.query);
  sendPaginated(res, "Your orders fetched successfully.", orders, pagination);
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private (User – own orders, Admin – any order)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
  sendSuccess(res, 200, "Order fetched successfully.", { order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getAllOrders(req.query);
  sendPaginated(res, "All orders fetched successfully.", orders, pagination);
});

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  if (!status && !paymentStatus) {
    return res.status(400).json({
      success: false,
      message: "At least one of 'status' or 'paymentStatus' must be provided.",
    });
  }

  const order = await orderService.updateOrderStatus(req.params.id, status, paymentStatus);
  sendSuccess(res, 200, "Order status updated successfully.", { order });
});

// @desc    Cancel order (User – only processing/confirmed orders)
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private (User)
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user.id);
  sendSuccess(res, 200, "Order cancelled successfully.", { order });
});

// @desc    Delete order – Soft delete (Admin)
// @route   DELETE /api/v1/orders/:id
// @access  Admin
const deleteOrder = asyncHandler(async (req, res) => {
  await orderService.softDeleteOrder(req.params.id);
  sendSuccess(res, 200, "Order deleted successfully.");
});

// @desc    Get order statistics – Aggregation (Admin)
// @route   GET /api/v1/orders/stats
// @access  Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await orderService.getOrderStats();
  sendSuccess(res, 200, "Order statistics fetched successfully.", { stats });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats,
};
