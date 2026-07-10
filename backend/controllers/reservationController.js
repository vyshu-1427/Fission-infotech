import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import { assignTable } from '../services/reservationService.js';

/**
 * @desc    Create a new reservation
 * @route   POST /api/reservations
 * @access  Private (Customer)
 */
export const createReservation = async (req, res, next) => {
  try {
    const { reservationDate, timeSlot, numberOfGuests, tableId } = req.body;

    // Validate date format (should be YYYY-MM-DD and not in the past)
    const today = new Date().toISOString().split('T')[0];
    if (reservationDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book reservations in the past',
      });
    }

    let assignedTable;
    if (tableId) {
      // Direct table selection
      const table = await Table.findOne({ _id: tableId, isActive: true });
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Selected table was not found or is currently inactive.',
        });
      }

      if (table.capacity < numberOfGuests) {
        return res.status(400).json({
          success: false,
          message: `The selected table capacity (${table.capacity}) is too small for ${numberOfGuests} guests.`,
        });
      }

      // Check if table is already booked on this date/timeSlot
      const conflict = await Reservation.findOne({
        tableId: table._id,
        reservationDate,
        timeSlot,
        status: 'Booked',
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Table #${table.tableNumber} is already booked for this date and time slot.`,
        });
      }

      assignedTable = table;
    } else {
      // Assign table automatically using reservation service
      assignedTable = await assignTable(reservationDate, timeSlot, numberOfGuests);
    }

    // Create reservation
    const reservation = await Reservation.create({
      userId: req.user._id,
      tableId: assignedTable._id,
      reservationDate,
      timeSlot,
      numberOfGuests,
      status: 'Booked',
    });

    // Populate table information in response
    const populated = await Reservation.findById(reservation._id)
      .populate('tableId', 'tableNumber capacity');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Get logged in user reservations
 * @route   GET /api/reservations/my
 * @access  Private (Customer)
 */
export const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id }).sort({
      reservationDate: -1,
      timeSlot: -1,
    });

    res.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel user reservation
 * @route   DELETE /api/reservations/:id
 * @access  Private (Customer - Cancel Own Reservation)
 */
export const cancelMyReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Ensure reservation belongs to logged in user
    if (reservation.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot cancel another user\'s reservation',
      });
    }

    // Update status to Cancelled
    reservation.status = 'Cancelled';
    await reservation.save();

    res.json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics for customer
 * @route   GET /api/reservations/my/stats
 * @access  Private (Customer)
 */
export const getCustomerStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalReservations = await Reservation.countDocuments({ userId: req.user._id });
    const upcomingReservations = await Reservation.countDocuments({
      userId: req.user._id,
      status: 'Booked',
      reservationDate: { $gte: today },
    });
    const cancelledReservations = await Reservation.countDocuments({
      userId: req.user._id,
      status: 'Cancelled',
    });

    res.json({
      success: true,
      data: {
        totalReservations,
        upcomingReservations,
        cancelledReservations,
      },
    });
  } catch (error) {
    next(error);
  }
};
