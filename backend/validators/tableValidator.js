import { body } from 'express-validator';
import { handleValidationErrors } from './authValidator.js';

export const validateTable = [
  body('tableNumber')
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors,
];

export const validateTableUpdate = [
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors,
];
