import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';

/**
 * @desc    Get all tables
 * @route   GET /api/tables
 * @access  Private (Admin / Customer can view active tables)
 */
export const getTables = async (req, res, next) => {
  try {
    // Admins see all tables; customers see only active tables
    const filter = req.user && req.user.role === 'admin' ? {} : { isActive: true };
    const tables = await Table.find(filter).sort({ tableNumber: 1 });

    res.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new table
 * @route   POST /api/tables
 * @access  Private (Admin)
 */
export const createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, isActive } = req.body;

    // Check if tableNumber is already taken
    const tableExists = await Table.findOne({ tableNumber });
    if (tableExists) {
      return res.status(400).json({
        success: false,
        message: `Table number ${tableNumber} already exists.`,
      });
    }

    const table = await Table.create({
      tableNumber,
      capacity,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update table details
 * @route   PUT /api/tables/:id
 * @access  Private (Admin)
 */
export const updateTable = async (req, res, next) => {
  try {
    const { capacity, isActive } = req.body;
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    if (capacity !== undefined) table.capacity = capacity;
    if (isActive !== undefined) table.isActive = isActive;

    await table.save();

    res.json({
      success: true,
      message: 'Table updated successfully',
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a table (Inactive Tables Only)
 * @route   DELETE /api/tables/:id
 * @access  Private (Admin)
 */
export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    // Constraint: Delete inactive tables only
    if (table.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an active table. Please make the table inactive first.',
      });
    }

    // Check if there are any active bookings associated with this table
    const activeReservations = await Reservation.countDocuments({
      tableId: table._id,
      status: 'Booked',
    });

    if (activeReservations > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete this table because it has upcoming active reservations.',
      });
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Table number ${table.tableNumber} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get table availability for a specific date and time slot
 * @route   GET /api/tables/availability
 * @access  Private (Authenticated users)
 */
export const getTableAvailability = async (req, res, next) => {
  try {
    const { date, timeSlot } = req.query;
    if (!date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Date and time slot are required parameters.',
      });
    }

    const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });
    
    // Find all booked reservations on this date and time slot
    const reservations = await Reservation.find({
      reservationDate: date,
      timeSlot,
      status: 'Booked',
    });

    const bookedTableIds = new Set(
      reservations.map((r) => r.tableId?._id?.toString() || r.tableId?.toString())
    );

    const data = tables.map((t) => ({
      _id: t._id,
      tableNumber: t.tableNumber,
      capacity: t.capacity,
      isBooked: bookedTableIds.has(t._id.toString()),
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

