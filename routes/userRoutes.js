// ============================================
// USER ROUTES – /api/v1/users
// All routes are Admin only
// ============================================

const express = require("express");
const router  = express.Router();

const { getAllUsers, getUserById, updateUser, deleteUser, getUserStats } = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All user management routes require admin role
router.use(protect, authorize("admin"));

router.get( "/stats", getUserStats);   // GET  /api/v1/users/stats
router.get( "/",      getAllUsers);    // GET  /api/v1/users?page=1&limit=10&search=name
router.get( "/:id",   getUserById);   // GET  /api/v1/users/:id
router.put( "/:id",   updateUser);    // PUT  /api/v1/users/:id
router.delete("/:id", deleteUser);    // DELETE /api/v1/users/:id

module.exports = router;
