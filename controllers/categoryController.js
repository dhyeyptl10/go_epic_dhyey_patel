// ============================================
// CATEGORY CONTROLLER – Request/Response Only
// ============================================

const asyncHandler  = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const categoryService = require("../services/categoryService");

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories(req.query);
  sendSuccess(res, 200, "Categories fetched successfully.", { count: categories.length, categories });
});

// @desc    Get category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendSuccess(res, 200, "Category fetched successfully.", { category });
});

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ success: false, message: "Category name is required." });
  }
  const category = await categoryService.createCategory(req.body);
  sendSuccess(res, 201, "Category created successfully.", { category });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendSuccess(res, 200, "Category updated successfully.", { category });
});

// @desc    Soft delete category
// @route   DELETE /api/v1/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.softDeleteCategory(req.params.id);
  sendSuccess(res, 200, "Category deleted successfully.");
});

// @desc    Get category stats – Aggregation
// @route   GET /api/v1/categories/stats
// @access  Public
const getCategoryStats = asyncHandler(async (req, res) => {
  const stats = await categoryService.getCategoryStats();
  sendSuccess(res, 200, "Category statistics fetched successfully.", { stats });
});

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getCategoryStats };
