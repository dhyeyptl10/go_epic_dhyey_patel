// ============================================
// DATASET ROUTES – Go-Epic Backend
// ============================================

const express = require('express');
const router  = express.Router();

const {
  getAllDatasets,
  getDatasetById,
  createDataset,
  replaceDataset,
  updateDataset,
  deleteDataset
} = require('../controllers/dataset.controller');

const authMiddleware  = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// Public routes
router.get('/',             getAllDatasets);  // GET /api/v1/datasets
router.get('/:datasetId',   getDatasetById); // GET /api/v1/datasets/:datasetId

// Protected routes (admin only)
router.post('/',              authMiddleware, adminMiddleware, createDataset);   // POST
router.put('/:datasetId',     authMiddleware, adminMiddleware, replaceDataset);  // PUT
router.patch('/:datasetId',   authMiddleware, adminMiddleware, updateDataset);   // PATCH
router.delete('/:datasetId',  authMiddleware, adminMiddleware, deleteDataset);   // DELETE

module.exports = router;
