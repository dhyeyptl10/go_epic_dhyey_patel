// ============================================
// ORDER SERVICE – Business Logic
// ============================================

const Order   = require("../models/Order");
const Product = require("../models/Product");
const { buildOrderFilter, buildSortObject } = require("../utils/filterBuilder");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

/**
 * createOrder - Place a new order
 * Validates product stock and calculates total
 */
const createOrder = async (userId, data) => {
  const { items, shippingAddress, paymentMethod } = data;

  // Validate products and stock
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      const err = new Error(`Product with ID '${item.product}' not found.`);
      err.statusCode = 404;
      throw err;
    }
    if (product.stock < item.quantity) {
      const err = new Error(
        `Insufficient stock for '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}`
      );
      err.statusCode = 400;
      throw err;
    }

    const itemTotal = product.price * item.quantity;
    totalAmount    += itemTotal;

    orderItems.push({
      product:  product._id,
      name:     product.name,
      price:    product.price,
      quantity: item.quantity,
    });

    // Reduce stock
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
  });

  await order.populate([
    { path: "user",           select: "name email" },
    { path: "items.product",  select: "name price" },
  ]);

  return order;
};

/**
 * getMyOrders - Get current user's orders
 */
const getMyOrders = async (userId, query) => {
  const filter = { user: userId, ...buildOrderFilter(query) };
  const sort   = buildSortObject(query.sort, { createdAt: -1 });
  const { page, limit, skip } = getPagination(query);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("items.product", "name images")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return { orders, pagination: buildPaginationMeta(total, page, limit) };
};

/**
 * getOrderById - Get single order (validates ownership)
 */
const getOrderById = async (id, userId, userRole) => {
  const order = await Order.findById(id)
    .populate("user",          "name email phone")
    .populate("items.product", "name price images");

  if (!order) {
    const err = new Error("Order not found.");
    err.statusCode = 404;
    throw err;
  }

  // Non-admin users can only view their own orders
  if (userRole !== "admin" && order.user._id.toString() !== userId.toString()) {
    const err = new Error("Access denied. This order does not belong to you.");
    err.statusCode = 403;
    throw err;
  }

  return order;
};

/**
 * getAllOrders - Admin: Get all orders with filter/pagination
 */
const getAllOrders = async (query) => {
  const filter = buildOrderFilter(query);
  const sort   = buildSortObject(query.sort, { createdAt: -1 });
  const { page, limit, skip } = getPagination(query);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user",         "name email")
      .populate("items.product","name")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return { orders, pagination: buildPaginationMeta(total, page, limit) };
};

/**
 * updateOrderStatus - Admin: Update order status
 */
const updateOrderStatus = async (id, status, paymentStatus) => {
  const updates = {};
  if (status)        updates.status        = status;
  if (paymentStatus) updates.paymentStatus = paymentStatus;

  const order = await Order.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!order) {
    const err = new Error("Order not found.");
    err.statusCode = 404;
    throw err;
  }
  return order;
};

/**
 * cancelOrder - User: Cancel own order (only if processing)
 */
const cancelOrder = async (id, userId) => {
  const order = await Order.findById(id);

  if (!order) {
    const err = new Error("Order not found.");
    err.statusCode = 404;
    throw err;
  }
  if (order.user.toString() !== userId.toString()) {
    const err = new Error("Access denied.");
    err.statusCode = 403;
    throw err;
  }
  if (!["processing", "confirmed"].includes(order.status)) {
    const err = new Error(`Cannot cancel order with status '${order.status}'.`);
    err.statusCode = 400;
    throw err;
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  order.status = "cancelled";
  await order.save();
  return order;
};

/**
 * softDeleteOrder - Admin only
 */
const softDeleteOrder = async (id) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!order) {
    const err = new Error("Order not found.");
    err.statusCode = 404;
    throw err;
  }
  return order;
};

/**
 * getOrderStats - Admin: Aggregation pipeline for order analytics
 */
const getOrderStats = async () => {
  // Overall revenue & order stats
  const overallStats = await Order.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id:          null,
        totalOrders:  { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        avgOrderValue:{ $avg: "$totalAmount" },
        minOrder:     { $min: "$totalAmount" },
        maxOrder:     { $max: "$totalAmount" },
      },
    },
    {
      $project: {
        _id:           0,
        totalOrders:   1,
        totalRevenue:  { $round: ["$totalRevenue",   2] },
        avgOrderValue: { $round: ["$avgOrderValue",  2] },
        minOrder:      1,
        maxOrder:      1,
      },
    },
  ]);

  // Revenue & orders grouped by status
  const statusBreakdown = await Order.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id:     "$status",
        count:   { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    {
      $project: {
        _id:     0,
        status:  "$_id",
        count:   1,
        revenue: { $round: ["$revenue", 2] },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Revenue by month (last 12 months)
  const monthlyRevenue = await Order.aggregate([
    { $match: { isDeleted: false, status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: {
          year:  { $year:  "$createdAt" },
          month: { $month: "$createdAt" },
        },
        orders:  { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    {
      $project: {
        _id:     0,
        year:    "$_id.year",
        month:   "$_id.month",
        orders:  1,
        revenue: { $round: ["$revenue", 2] },
      },
    },
    { $sort: { year: -1, month: -1 } },
    { $limit: 12 },
  ]);

  // Payment method breakdown
  const paymentBreakdown = await Order.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id:   "$paymentMethod",
        count: { $sum: 1 },
        total: { $sum: "$totalAmount" },
      },
    },
    {
      $project: {
        _id:     0,
        method:  "$_id",
        count:   1,
        total:   { $round: ["$total", 2] },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return {
    overall:        overallStats[0] || {},
    byStatus:       statusBreakdown,
    monthlyRevenue,
    byPaymentMethod: paymentBreakdown,
  };
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  softDeleteOrder,
  getOrderStats,
};
