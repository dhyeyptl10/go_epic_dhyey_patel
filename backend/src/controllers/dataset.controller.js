// ============================================
// DATASET CONTROLLER – Go-Epic Backend
// Full CRUD + filtering by type/category
// ============================================

const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate, sortArray, filterByKeyword }               = require('../utils/helpers');

let datasets = require('../data/datasets.data');

// GET /api/v1/datasets
const getAllDatasets = (req, res) => {
  try {
    let result = [...datasets].filter(d => d.isActive);
    const { type, category, source, keyword, sort, page = 1, limit = 10 } = req.query;

    if (type)     result = result.filter(d => d.type === type);
    if (category) result = result.filter(d => d.category === category);
    if (source)   result = result.filter(d => d.source === source);
    if (keyword)  result = filterByKeyword(result, keyword, ['name', 'description', 'tags', 'category']);
    if (sort)     result = sortArray(result, sort);

    const total    = result.length;
    const paginated = paginate(result, parseInt(page), parseInt(limit));

    return paginatedResponse(res, paginated, page, limit, total, 'Datasets fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/datasets/:datasetId
const getDatasetById = (req, res) => {
  try {
    const dataset = datasets.find(d => d.id === req.params.datasetId && d.isActive);
    if (!dataset) return errorResponse(res, `Dataset '${req.params.datasetId}' not found`, 404);
    return successResponse(res, dataset, 'Dataset fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// POST /api/v1/datasets
const createDataset = (req, res) => {
  try {
    const { name, description, type, category, source, tags, data } = req.body;
    if (!name || !description) return errorResponse(res, 'name and description are required', 400);
    const newDataset = {
      id:          `ds_${Date.now()}`,
      name:        name.trim(),
      description: description.trim(),
      type:        type     || 'basic',
      category:    category || 'general',
      size:        data     ? data.length : 0,
      source:      source   || 'custom',
      tags:        tags     || [],
      data:        data     || [],
      isActive:    true,
      createdAt:   new Date().toISOString()
    };
    datasets.push(newDataset);
    return successResponse(res, newDataset, 'Dataset created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PUT /api/v1/datasets/:datasetId
const replaceDataset = (req, res) => {
  try {
    const index = datasets.findIndex(d => d.id === req.params.datasetId);
    if (index === -1) return errorResponse(res, 'Dataset not found', 404);
    datasets[index] = { ...datasets[index], ...req.body, updatedAt: new Date().toISOString() };
    return successResponse(res, datasets[index], 'Dataset replaced successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PATCH /api/v1/datasets/:datasetId
const updateDataset = (req, res) => {
  try {
    const index = datasets.findIndex(d => d.id === req.params.datasetId);
    if (index === -1) return errorResponse(res, 'Dataset not found', 404);
    datasets[index] = { ...datasets[index], ...req.body, updatedAt: new Date().toISOString() };
    return successResponse(res, datasets[index], 'Dataset updated successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// DELETE /api/v1/datasets/:datasetId
const deleteDataset = (req, res) => {
  try {
    const index = datasets.findIndex(d => d.id === req.params.datasetId);
    if (index === -1) return errorResponse(res, 'Dataset not found', 404);
    datasets[index].isActive  = false;
    datasets[index].deletedAt = new Date().toISOString();
    return successResponse(res, null, 'Dataset deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { getAllDatasets, getDatasetById, createDataset, replaceDataset, updateDataset, deleteDataset };
