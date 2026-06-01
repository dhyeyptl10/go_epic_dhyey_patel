// ============================================
// DYNAMIC FILTER BUILDER
// Builds MongoDB query filters from req.query
// Supports: range, regex search, exact match
// ============================================

/**
 * buildProductFilter - Builds filter object for product queries
 * @param {Object} query - req.query
 * @returns MongoDB filter object
 */
const buildProductFilter = (query) => {
  const filter = {};

  // Category filter (exact match by ObjectId)
  if (query.category) {
    filter.category = query.category;
  }

  // Brand filter (case-insensitive)
  if (query.brand) {
    filter.brand = { $regex: query.brand, $options: "i" };
  }

  // Price range filter
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
  }

  // Rating filter (minimum rating)
  if (query.minRating) {
    filter.ratings = { $gte: parseFloat(query.minRating) };
  }

  // Stock filter
  if (query.inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  // Featured filter
  if (query.featured === "true") {
    filter.isFeatured = true;
  }

  // Advanced search with Regex (name, description, tags)
  if (query.search) {
    filter.$or = [
      { name:        { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { brand:       { $regex: query.search, $options: "i" } },
      { tags:        { $regex: query.search, $options: "i" } },
    ];
  }

  return filter;
};

/**
 * buildUserFilter - Builds filter object for user queries (admin)
 */
const buildUserFilter = (query) => {
  const filter = {};

  if (query.role)   filter.role   = query.role;
  if (query.search) {
    filter.$or = [
      { name:  { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  return filter;
};

/**
 * buildOrderFilter - Builds filter for order queries
 */
const buildOrderFilter = (query) => {
  const filter = {};

  if (query.status)        filter.status        = query.status;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;

  // Date range
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate)   filter.createdAt.$lte = new Date(query.endDate);
  }

  return filter;
};

/**
 * buildSortObject - Build sort object from query string
 * @example ?sort=price,-ratings  →  { price: 1, ratings: -1 }
 */
const buildSortObject = (sortQuery, defaultSort = { createdAt: -1 }) => {
  if (!sortQuery) return defaultSort;

  const sort = {};
  sortQuery.split(",").forEach((field) => {
    if (field.startsWith("-")) {
      sort[field.slice(1)] = -1;
    } else {
      sort[field] = 1;
    }
  });

  return sort;
};

module.exports = { buildProductFilter, buildUserFilter, buildOrderFilter, buildSortObject };
