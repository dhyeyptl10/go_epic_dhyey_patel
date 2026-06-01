// ============================================
// HELPERS – Go-Epic Backend
// Reusable utility functions
// ============================================

/**
 * Paginate an array
 */
const paginate = (array, page = 1, limit = 10) => {
  const pageNum  = parseInt(page)  || 1;
  const limitNum = parseInt(limit) || 10;
  const start    = (pageNum - 1) * limitNum;
  const end      = start + limitNum;
  return array.slice(start, end);
};

/**
 * Sort an array by a key (prefix '-' for descending)
 */
const sortArray = (array, sortKey) => {
  const isDesc = sortKey.startsWith('-');
  const key    = isDesc ? sortKey.slice(1) : sortKey;
  return [...array].sort((a, b) => {
    const valA = a[key] !== undefined ? a[key] : '';
    const valB = b[key] !== undefined ? b[key] : '';
    if (valA < valB) return isDesc ? 1 : -1;
    if (valA > valB) return isDesc ? -1 : 1;
    return 0;
  });
};

/**
 * Filter array by keyword across specified fields
 */
const filterByKeyword = (array, keyword, fields) => {
  const lower = keyword.toLowerCase();
  return array.filter(item =>
    fields.some(field => {
      const val = item[field];
      if (Array.isArray(val)) return val.some(v => v.toString().toLowerCase().includes(lower));
      return val && val.toString().toLowerCase().includes(lower);
    })
  );
};

/**
 * Generate a simple unique ID
 */
const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
};

/**
 * Strip sensitive fields from user object
 */
const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

module.exports = { paginate, sortArray, filterByKeyword, generateId, sanitizeUser };
