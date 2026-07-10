import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table ID is required'],
    },
    reservationDate: {
      type: String, // Stored as 'YYYY-MM-DD' to prevent timezone offsets issues
      required: [true, 'Reservation date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Number of guests must be at least 1'],
    },
    status: {
      type: String,
      enum: ['Booked', 'Cancelled'],
      default: 'Booked',
    },
  },
  {
    timestamps: true,
  }
);

// Populate references automatically on query (optional, but helpful for client responses)
reservationSchema.pre(/^find/, function (next) {
  this.populate('userId', 'name email').populate('tableId', 'tableNumber capacity');
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
