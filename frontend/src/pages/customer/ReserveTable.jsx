import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { FiCalendar, FiClock, FiUsers, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Spinner from '../../components/Spinner.jsx';

const TIME_SLOTS = [
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
];

const ReserveTable = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  // Form states
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [guests, setGuests] = useState(2);

  // Table availability states
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tablesLoading, setTablesLoading] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Fetch table availability when date and slot are selected
  useEffect(() => {
    if (date && timeSlot) {
      fetchTableAvailability();
    } else {
      setTables([]);
      setSelectedTable(null);
    }
  }, [date, timeSlot]);

  const fetchTableAvailability = async () => {
    setTablesLoading(true);
    setError('');
    try {
      const response = await api.get(`/tables/availability?date=${date}&timeSlot=${timeSlot}`);
      if (response.data?.success) {
        setTables(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching table availability:', err);
      setError('Could not fetch table availability for this slot.');
    } finally {
      setTablesLoading(false);
    }
  };

  const handleTableClick = (table) => {
    if (table.isBooked) {
      setError(`Table #${table.tableNumber} is already booked! Please select a vacant table.`);
      return;
    }

    // Reset error if any
    setError('');
    
    // Select the table
    setSelectedTable(table);
    
    // Auto-align guest count to table's capacity
    setGuests(table.capacity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessData(null);

    // Front-end validation checks
    if (!date) {
      setError('Please select a reservation date.');
      return;
    }
    if (date < today) {
      setError('Reservation date cannot be in the past.');
      return;
    }
    if (!timeSlot) {
      setError('Please select a time slot.');
      return;
    }
    if (guests < 1) {
      setError('Number of guests must be at least 1.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        reservationDate: date,
        timeSlot,
        numberOfGuests: Number(guests),
        tableId: selectedTable ? selectedTable._id : null,
      };

      const response = await api.post('/reservations', payload);

      if (response.data?.success) {
        setSuccessData(response.data.data);
        // Refresh availability grid
        if (date && timeSlot) {
          fetchTableAvailability();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete reservation. No tables might be available.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-dark-300 hover:text-white transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {successData ? (
        /* Success Screen */
        <div className="glass-card p-8 rounded-3xl text-center max-w-xl mx-auto shadow-2xl relative overflow-hidden animate-fade-in border border-emerald-500/25">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Reservation Confirmed!</h2>
          <p className="text-dark-300 max-w-md mx-auto mb-8">
            Your table reservation has been recorded successfully.
          </p>

          <div className="bg-dark-900/60 rounded-2xl p-6 border border-white/5 max-w-md mx-auto mb-8 text-left space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
              <span className="text-dark-300 font-medium">Assigned Table</span>
              <span className="text-emerald-400 font-bold">Table #{successData.tableId?.tableNumber} (Capacity: {successData.tableId?.capacity})</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
              <span className="text-dark-300 font-medium">Date</span>
              <span className="text-white font-semibold">{successData.reservationDate}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
              <span className="text-dark-300 font-medium">Time Slot</span>
              <span className="text-white font-semibold">{successData.timeSlot}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-300 font-medium">Number of Guests</span>
              <span className="text-white font-semibold">{successData.numberOfGuests} Guests</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reservations"
              className="py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/20"
            >
              View My Bookings
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                setDate('');
                setTimeSlot('');
                setGuests(2);
                setSelectedTable(null);
              }}
              className="py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all border border-white/5"
            >
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        /* Form & Floorplan Split Screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Booking Form */}
          <div className="glass-card lg:col-span-5 p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-cyan-400" />
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Book a Table</h2>
            <p className="text-dark-300 mb-8 text-xs md:text-sm">
              Select your preferred dining date, time, and guest count. Our automated matching algorithm will handle the rest.
            </p>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2" htmlFor="date">
                  Reservation Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                    <FiCalendar className="w-5 h-5" />
                  </span>
                  <input
                    id="date"
                    type="date"
                    required
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Time Slot Input */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2" htmlFor="timeSlot">
                  Preferred Time Slot
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                    <FiClock className="w-5 h-5" />
                  </span>
                  <select
                    id="timeSlot"
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-dark-950">Select Time Slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="bg-dark-950">{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2" htmlFor="guests">
                  Number of Guests
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                    <FiUsers className="w-5 h-5" />
                  </span>
                  <input
                    id="guests"
                    type="number"
                    required
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-sm"
                  />
                </div>
                <p className="mt-1.5 text-xs text-dark-400">
                  The algorithm automatically prioritizes the smallest table that can accommodate this number of guests.
                </p>
              </div>

              {/* Selected table details banner */}
              {selectedTable && (
                <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3.5 text-xs text-brand-300">
                  Selected manually: <strong>Table #{selectedTable.tableNumber}</strong> (Seats: {selectedTable.capacity}).
                  <button
                    type="button"
                    onClick={() => setSelectedTable(null)}
                    className="float-right text-dark-300 hover:text-white"
                  >
                    Clear Choice
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
              >
                {loading ? <Spinner size="sm" className="p-0" /> : 'Confirm Booking'}
              </button>
            </form>
          </div>

          {/* Right Side: Interactive Restaurant Grid */}
          <div className="glass-card lg:col-span-7 p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 to-brand-500" />
            
            <h2 className="text-xl font-bold text-white mb-2">Interactive Restaurant Layout</h2>
            <p className="text-xs text-dark-300 mb-6">
              {!date || !timeSlot 
                ? 'Please select a Date and Time Slot first to load the live table floorplan.' 
                : 'Click on a vacant table (white) to reserve it directly, or click a booked table (green) to view availability.'}
            </p>

            {tablesLoading ? (
              <div className="flex justify-center p-12">
                <Spinner size="md" />
              </div>
            ) : !date || !timeSlot ? (
              /* Pre-select visual outline */
              <div className="border border-white/5 border-dashed rounded-2xl p-8 text-center text-dark-400 text-sm">
                Select a date and slot to inspect table statuses.
              </div>
            ) : (
              /* Live Floorplan Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tables.map((table) => {
                  const isSelected = selectedTable && selectedTable._id === table._id;
                  
                  // Style configurations: Booked = Green, Vacant = White
                  const cardStyles = table.isBooked
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25 cursor-not-allowed'
                    : isSelected
                    ? 'bg-brand-100 text-brand-950 border-brand-500 ring-2 ring-brand-500 cursor-pointer shadow-lg'
                    : 'bg-white text-dark-950 border-white hover:border-brand-500 hover:shadow-xl cursor-pointer';

                  return (
                    <div
                      key={table._id}
                      onClick={() => handleTableClick(table)}
                      className={`p-6 rounded-2xl border text-center transition-all flex flex-col justify-between items-center select-none ${cardStyles}`}
                    >
                      {/* Round visual table graphic */}
                      <span className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 mb-4 shadow ${
                        table.isBooked
                          ? 'bg-emerald-600 border-emerald-300 text-white'
                          : isSelected
                          ? 'bg-brand-500 border-brand-300 text-white'
                          : 'bg-dark-100 border-dark-300 text-dark-900'
                      }`}>
                        T{table.tableNumber}
                      </span>

                      <div>
                        <h3 className="font-extrabold text-base">Table #{table.tableNumber}</h3>
                        <p className={`text-xs mt-0.5 ${table.isBooked ? 'text-emerald-100' : isSelected ? 'text-brand-800' : 'text-dark-500'}`}>
                          Capacity: {table.capacity} Seats
                        </p>
                      </div>

                      <span className={`mt-4 inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        table.isBooked
                          ? 'bg-emerald-600/40 border border-emerald-300/30 text-white'
                          : isSelected
                          ? 'bg-brand-500/20 border border-brand-500 text-brand-600'
                          : 'bg-dark-200 text-dark-500 border border-dark-300'
                      }`}>
                        {table.isBooked ? 'Booked' : isSelected ? 'Selected' : 'Vacant'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend guide */}
            <div className="mt-8 flex items-center gap-6 border-t border-white/5 pt-4 text-xs text-dark-300">
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-white border border-white" />
                Vacant Table (White)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-400" />
                Booked Table (Green)
              </span>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ReserveTable;
