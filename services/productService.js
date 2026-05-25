// ============================================
// PRODUCT SERVICE – Business Logic
// ============================================

const Product  = require("../models/Product");
const Category = require("../models/Category");
const { buildProductFilter, buildSortObject } = require("../utils/filterBuilder");
const { getPagination, buildPaginationMeta }  = require("../utils/pagination");

/**
 * getAllProducts - With filter, sort, pagination, search
 */
const getAllProducts = async (query) => {
  const filter = buildProductFilter(query);
  const sort   = buildSortObject(query.sort, { createdAt: -1 });
  const { page, limit, skip } = getPagination(query);

  // Projection: which fields to return
  const projection = query.fields
    ? query.fields.split(",").join(" ")
    : "-__v";

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select(projection)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return { products, pagination: buildPaginationMeta(total, page, limit) };
};

/**
 * getProductById - Single product with category populated
 */
const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category", "name slug description");
  if (!product) {
    const err = new Error("Product not found.");
    err.statusCode = 404;
    throw err;
  }
  return product;
};

/**
 * createProduct - Admin only
 */
const createProduct = async (data) => {
  // Verify category exists
  const category = await Category.findById(data.category);
  if (!category) {
    const err = new Error("Category not found. Please provide a valid category ID.");
    err.statusCode = 404;
    throw err;
  }

  const product = await Product.create(data);
  await product.populate("category", "name slug");
  return product;
};

/**
 * updateProduct - Admin only
 */
const updateProduct = async (id, data) => {
  // If category is being updated, verify it exists
  if (data.category) {
    const category = await Category.findById(data.category);
    if (!category) {
      const err = new Error("Category not found.");
      err.statusCode = 404;
      throw err;
    }
  }

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

  if (!product) {
    const err = new Error("Product not found.");
    err.statusCode = 404;
    throw err;
  }
  return product;
};

/**
 * softDeleteProduct - Admin only
 */
const softDeleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!product) {
    const err = new Error("Product not found.");
    err.statusCode = 404;
    throw err;
  }
  return product;
};

/**
 * getProductStats - Aggregation pipeline
 */
const getProductStats = async () => {
  // Stage 1: Overall stats
  const overallStats = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id:          null,
        totalProducts: { $sum: 1 },
        avgPrice:      { $avg: "$price" },
        minPrice:      { $min: "$price" },
        maxPrice:      { $max: "$price" },
        avgRating:     { $avg: "$ratings" },
        totalStock:    { $sum: "$stock" },
        outOfStock:    { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id:           0,
        totalProducts: 1,
        avgPrice:      { $round: ["$avgPrice", 2] },
        minPrice:      1,
        maxPrice:      1,
        avgRating:     { $round: ["$avgRating", 2] },
        totalStock:    1,
        outOfStock:    1,
      },
    },
  ]);

  // Stage 2: Stats grouped by brand
  const brandStats = await Product.aggregate([
    { $match: { isDeleted: false, brand: { $exists: true, $ne: "" } } },
    {
      $group: {
        _id:          "$brand",
        productCount: { $sum: 1 },
        avgPrice:     { $avg: "$price" },
        avgRating:    { $avg: "$ratings" },
      },
    },
    {
      $project: {
        _id:          0,
        brand:        "$_id",
        productCount: 1,
        avgPrice:     { $round: ["$avgPrice", 2] },
        avgRating:    { $round: ["$avgRating", 2] },
      },
    },
    { $sort: { productCount: -1 } },
    { $limit: 10 },
  ]);

  // Stage 3: Top rated products
  const topRated = await Product.find({ isDeleted: false })
    .select("name price ratings brand")
    .sort({ ratings: -1 })
    .limit(5)
    .populate("category", "name");

  return {
    overall:  overallStats[0] || {},
    byBrand:  brandStats,
    topRated,
  };
};

/**
 * getFeaturedProducts - Get featured/highlighted products
 */
const getFeaturedProducts = async (limit = 8) => {
  return await Product.find({ isFeatured: true, isDeleted: false })
    .select("name price ratings images brand")
    .populate("category", "name slug")
    .sort({ ratings: -1 })
    .limit(parseInt(limit));
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
  getProductStats,
  getFeaturedProducts,
};
