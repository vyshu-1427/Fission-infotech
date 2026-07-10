import express from 'express';
import {
  getAllReservations,
  updateReservation,
  cancelReservation,
  getAdminStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateReservationUpdate } from '../validators/reservationValidator.js';

const router = express.Router();

// Apply auth protection and restrict to admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/reservations', getAllReservations);
router.put('/reservations/:id', validateReservationUpdate, updateReservation);
router.delete('/reservations/:id', cancelReservation);
router.get('/stats', getAdminStats);

export default router;
