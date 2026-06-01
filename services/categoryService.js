// ============================================
// CATEGORY SERVICE – Business Logic
// ============================================

const Category = require("../models/Category");
const Product  = require("../models/Product");

/**
 * getAllCategories - Get all active categories
 */
const getAllCategories = async (query) => {
  const filter = {};
  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }
  const categories = await Category.find(filter).sort({ name: 1 });
  return categories;
};

/**
 * getCategoryById
 */
const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    const err = new Error("Category not found.");
    err.statusCode = 404;
    throw err;
  }
  return category;
};

/**
 * createCategory - Admin only
 */
const createCategory = async (data) => {
  const { name, description, slug } = data;

  // Auto-generate slug if not provided
  const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const category = await Category.create({ name, description, slug: finalSlug });
  return category;
};

/**
 * updateCategory - Admin only
 */
const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) {
    const err = new Error("Category not found.");
    err.statusCode = 404;
    throw err;
  }
  return category;
};

/**
 * softDeleteCategory - Admin only
 * Checks if products exist in this category before deleting
 */
const softDeleteCategory = async (id) => {
  const productCount = await Product.countDocuments({ category: id, isDeleted: false });
  if (productCount > 0) {
    const err = new Error(`Cannot delete category. It has ${productCount} active products.`);
    err.statusCode = 400;
    throw err;
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date(), isActive: false },
    { new: true }
  );
  if (!category) {
    const err = new Error("Category not found.");
    err.statusCode = 404;
    throw err;
  }
  return category;
};

/**
 * getCategoryStats - Aggregation: product count per category
 */
const getCategoryStats = async () => {
  const stats = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$category",
        productCount: { $sum: 1 },
        avgPrice:     { $avg: "$price" },
        avgRating:    { $avg: "$ratings" },
        totalStock:   { $sum: "$stock" },
      },
    },
    {
      $lookup: {
        from:         "categories",
        localField:   "_id",
        foreignField: "_id",
        as:           "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $project: {
        _id:          0,
        category:     "$categoryInfo.name",
        slug:         "$categoryInfo.slug",
        productCount: 1,
        avgPrice:     { $round: ["$avgPrice", 2] },
        avgRating:    { $round: ["$avgRating", 2] },
        totalStock:   1,
      },
    },
    { $sort: { productCount: -1 } },
  ]);

  return stats;
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, softDeleteCategory, getCategoryStats };
