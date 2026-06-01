// ============================================
// PRODUCT CONTROLLER – Request/Response Only
// ============================================

const asyncHandler  = require("../utils/asyncHandler");
const { sendSuccess, sendPaginated } = require("../utils/apiResponse");
const { validateProduct } = require("../utils/validator");
const productService = require("../services/productService");

// @desc    Get all products (with filter, sort, search, pagination)
// @route   GET /api/v1/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getAllProducts(req.query);
  sendPaginated(res, "Products fetched successfully.", products, pagination);
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  sendSuccess(res, 200, "Product fetched successfully.", { product });
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const errors = validateProduct(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  const product = await productService.createProduct(req.body);
  sendSuccess(res, 201, "Product created successfully.", { product });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendSuccess(res, 200, "Product updated successfully.", { product });
});

// @desc    Soft delete product
// @route   DELETE /api/v1/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.softDeleteProduct(req.params.id);
  sendSuccess(res, 200, "Product deleted successfully (soft delete applied).");
});

// @desc    Get product statistics – Aggregation
// @route   GET /api/v1/products/stats
// @access  Admin
const getProductStats = asyncHandler(async (req, res) => {
  const stats = await productService.getProductStats();
  sendSuccess(res, 200, "Product statistics fetched successfully.", { stats });
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts(req.query.limit);
  sendSuccess(res, 200, "Featured products fetched successfully.", { count: products.length, products });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getFeaturedProducts,
};
