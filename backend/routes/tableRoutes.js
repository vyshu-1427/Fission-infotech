import express from 'express';
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  getTableAvailability,
} from '../controllers/tableController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateTable, validateTableUpdate } from '../validators/tableValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/tables/availability gets booked vs vacant tables
router.get('/availability', getTableAvailability);

// GET /api/tables is accessible to both customers and admins
router.get('/', getTables);

// POST, PUT, DELETE /api/tables are restricted to administrators only
router.post('/', authorize('admin'), validateTable, createTable);
router.put('/:id', authorize('admin'), validateTableUpdate, updateTable);
router.delete('/:id', authorize('admin'), deleteTable);

export default router;
