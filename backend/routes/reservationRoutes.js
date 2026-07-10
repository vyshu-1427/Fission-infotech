import express from 'express';
import {
  createReservation,
  getMyReservations,
  cancelMyReservation,
  getCustomerStats,
} from '../controllers/reservationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateReservation } from '../validators/reservationValidator.js';

const router = express.Router();

// Apply auth protection and restrict to customer role
router.use(protect);
router.use(authorize('customer'));

router.post('/', validateReservation, createReservation);
router.get('/my', getMyReservations);
router.get('/my/stats', getCustomerStats);
router.delete('/:id', cancelMyReservation);

export default router;
