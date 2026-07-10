import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';

/**
 * Automatically assigns an available table based on guest count, date, and time slot.
 * Handles exclusions for editing existing reservations.
 * 
 * @param {string} reservationDate - The date (YYYY-MM-DD)
 * @param {string} timeSlot - Pre-configured time slot
 * @param {number} numberOfGuests - Number of guests
 * @param {string} [excludeReservationId] - Optional reservation ID to exclude (used on updates)
 * @returns {Promise<Object>} The assigned Table document
 */
export const assignTable = async (reservationDate, timeSlot, numberOfGuests, excludeReservationId = null) => {
  // 1. Find all active tables with capacity >= numberOfGuests
  const candidateTables = await Table.find({
    isActive: true,
    capacity: { $gte: numberOfGuests },
  }).sort({ capacity: 1, tableNumber: 1 }); // Sort smallest capacity first, then by tableNumber

  if (candidateTables.length === 0) {
    const error = new Error('No tables have sufficient capacity for this guest count.');
    error.statusCode = 409;
    throw error;
  }

  // 2. Iterate through sorted tables to find the first one without a booked conflict
  for (const table of candidateTables) {
    const query = {
      tableId: table._id,
      reservationDate,
      timeSlot,
      status: 'Booked',
    };

    // If editing a reservation, exclude the reservation itself from conflict checks
    if (excludeReservationId) {
      query._id = { $ne: excludeReservationId };
    }

    const conflict = await Reservation.findOne(query);

    if (!conflict) {
      // Found a free table! Return it.
      return table;
    }
  }

  // 3. If we loop through all and find no available tables, throw a 409 Conflict error
  const error = new Error('No tables available for this time slot.');
  error.statusCode = 409;
  throw error;
};
