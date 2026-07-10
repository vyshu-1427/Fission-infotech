import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import User from '../models/User.js';
import { assignTable } from '../services/reservationService.js';

/**
 * @desc    Get all reservations with date filter and search (customer name/email)
 * @route   GET /api/admin/reservations
 * @access  Private (Admin)
 */
export const getAllReservations = async (req, res, next) => {
  try {
    const { date, status, search } = req.query;
    const query = {};

    // Apply date filter
    if (date) {
      query.reservationDate = date; // Expecting YYYY-MM-DD
    }

    // Apply status filter
    if (status) {
      query.status = status;
    }

    // Apply search filter (resolving matches on user's name or email)
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');

      const userIds = users.map((u) => u._id);
      query.userId = { $in: userIds };
    }

    const reservations = await Reservation.find(query).sort({
      reservationDate: 1,
      timeSlot: 1,
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
 * @desc    Update reservation details (re-assigns table if changed)
 * @route   PUT /api/admin/reservations/:id
 * @access  Private (Admin)
 */
export const updateReservation = async (req, res, next) => {
  try {
    const { reservationDate, timeSlot, numberOfGuests, status } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // If changing booking criteria, check availability and re-assign table
    const dateChanged = reservationDate && reservationDate !== reservation.reservationDate;
    const slotChanged = timeSlot && timeSlot !== reservation.timeSlot;
    const guestsChanged = numberOfGuests && numberOfGuests !== reservation.numberOfGuests;

    if (dateChanged || slotChanged || guestsChanged) {
      const targetDate = reservationDate || reservation.reservationDate;
      const targetSlot = timeSlot || reservation.timeSlot;
      const targetGuests = numberOfGuests || reservation.numberOfGuests;

      // Assign available table (excluding current reservation from overlap checks)
      const assignedTable = await assignTable(targetDate, targetSlot, targetGuests, reservation._id);
      
      reservation.tableId = assignedTable._id;
      reservation.reservationDate = targetDate;
      reservation.timeSlot = targetSlot;
      reservation.numberOfGuests = targetGuests;
    }

    if (status) {
      reservation.status = status;
    }

    await reservation.save();
    const updated = await Reservation.findById(reservation._id);

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: updated,
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
 * @desc    Cancel reservation
 * @route   DELETE /api/admin/reservations/:id
 * @access  Private (Admin)
 */
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

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
 * @desc    Get dashboard stats for administrator
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalReservations = await Reservation.countDocuments();
    const todayReservations = await Reservation.countDocuments({
      reservationDate: today,
    });
    const cancelledReservations = await Reservation.countDocuments({
      status: 'Cancelled',
    });
    const availableTables = await Table.countDocuments({
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        totalReservations,
        todayReservations,
        cancelledReservations,
        availableTables,
      },
    });
  } catch (error) {
    next(error);
  }
};
