// ============================================
// USER SERVICE – Business Logic (Admin)
// ============================================

const User = require("../models/User");
const { buildUserFilter, buildSortObject } = require("../utils/filterBuilder");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

/**
 * getAllUsers - Admin: Get all users with filter/sort/pagination
 */
const getAllUsers = async (query) => {
  const filter    = buildUserFilter(query);
  const sort      = buildSortObject(query.sort, { createdAt: -1 });
  const { page, limit, skip } = getPagination(query);

  const [users, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { users, pagination: buildPaginationMeta(total, page, limit) };
};

/**
 * getUserById - Admin: Get single user
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * updateUser - Admin: Update any user
 */
const updateUser = async (id, data) => {
  const allowedFields = ["name", "phone", "address", "role", "isActive"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) updates[field] = data[field];
  });

  const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * softDeleteUser - Admin: Soft delete a user
 */
const softDeleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date(), isActive: false },
    { new: true }
  );
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * getUserStats - Admin: Aggregation – user statistics
 */
const getUserStats = async () => {
  const stats = await User.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
        activeCount: { $sum: { $cond: ["$isActive", 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        role: "$_id",
        total: "$count",
        active: "$activeCount",
        inactive: { $subtract: ["$count", "$activeCount"] },
      },
    },
    { $sort: { role: 1 } },
  ]);

  const totalUsers = await User.countDocuments({ isDeleted: false });

  return { totalUsers, breakdown: stats };
};

module.exports = { getAllUsers, getUserById, updateUser, softDeleteUser, getUserStats };
