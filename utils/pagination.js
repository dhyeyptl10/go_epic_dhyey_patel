// ============================================
// REUSABLE PAGINATION UTILITY
// Extracts pagination logic from controllers
// ============================================

/**
 * getPagination - Extracts and validates pagination params
 * @param {Object} query - req.query object
 * @returns {{ page, limit, skip }}
 */
const getPagination = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * buildPaginationMeta - Builds meta object for paginated response
 * @param {number} total - Total document count
 * @param {number} page
 * @param {number} limit
 * @returns pagination meta object
 */
const buildPaginationMeta = (total, page, limit) => {
  const totalPages  = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage,
    hasPrevPage,
  };
};

module.exports = { getPagination, buildPaginationMeta };
