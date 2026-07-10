import { body } from 'express-validator';
import { handleValidationErrors } from './authValidator.js';

export const validateReservation = [
  body('reservationDate')
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Reservation date must be in YYYY-MM-DD format')
    .custom((value) => {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),
  body('timeSlot').trim().notEmpty().withMessage('Time slot is required'),
  body('numberOfGuests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  handleValidationErrors,
];

export const validateReservationUpdate = [
  body('reservationDate')
    .optional()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Reservation date must be in YYYY-MM-DD format')
    .custom((value) => {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),
  body('timeSlot').optional().trim().notEmpty().withMessage('Time slot cannot be empty'),
  body('numberOfGuests')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  body('status')
    .optional()
    .isIn(['Booked', 'Cancelled'])
    .withMessage('Status must be either Booked or Cancelled'),
  handleValidationErrors,
];
