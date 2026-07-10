import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiXCircle, FiInfo } from 'react-icons/fi';
import Spinner from '../../components/Spinner.jsx';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  // Fetch own reservations on load
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations/my');
      if (response.data?.success) {
        setReservations(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? This cannot be undone.')) {
      return;
    }

    setCancelLoadingId(id);
    setError('');

    try {
      const response = await api.delete(`/reservations/${id}`);
      if (response.data?.success) {
        // Update local status of the reservation immediately
        setReservations((prev) =>
          prev.map((res) => (res._id === id ? { ...res, status: 'Cancelled' } : res))
        );
      }
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      setError(err.response?.data?.message || 'Failed to cancel reservation.');
    } finally {
      setCancelLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Reservations</h1>
          <p className="text-dark-300 mt-1">Review, monitor, or cancel your fine dining table bookings.</p>
        </div>
        <Link
          to="/reserve"
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all cursor-pointer text-sm"
        >
          Book Another Table
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        /* Empty State */
        <div className="glass-card p-12 rounded-3xl text-center max-w-xl mx-auto border border-white/5">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
            <FiCalendar className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Bookings Found</h2>
          <p className="text-dark-300 mb-8">
            You don't have any active or past reservations yet. Click below to secure your table now!
          </p>
          <Link
            to="/reserve"
            className="inline-block py-3 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-brand-500/20 transition-all cursor-pointer text-sm"
          >
            Make a Reservation
          </Link>
        </div>
      ) : (
        /* Grid list of reservations for mobile, and table view for desktop */
        <div>
          {/* Mobile Grid Layout */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {reservations.map((res) => (
              <div key={res._id} className="glass-card p-5 rounded-2xl border border-white/5 space-y-4 relative">
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                    res.status === 'Booked'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-red-500/15 text-red-400 border border-red-500/25'
                  }`}>
                    {res.status}
                  </span>
                  <span className="text-xs text-dark-400">
                    Booked on {new Date(res.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-white">
                    <FiCalendar className="text-brand-400 w-4.5 h-4.5" />
                    <span>{res.reservationDate}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-white">
                    <FiClock className="text-brand-400 w-4.5 h-4.5" />
                    <span>{res.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-white">
                    <FiUsers className="text-brand-400 w-4.5 h-4.5" />
                    <span>{res.numberOfGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-white">
                    <FiMapPin className="text-brand-400 w-4.5 h-4.5" />
                    <span>Table #{res.tableId?.tableNumber} (Capacity: {res.tableId?.capacity})</span>
                  </div>
                </div>

                {res.status === 'Booked' && (
                  <button
                    onClick={() => handleCancel(res._id)}
                    disabled={cancelLoadingId === res._id}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 text-sm font-semibold transition-all cursor-pointer"
                  >
                    {cancelLoadingId === res._id ? (
                      <Spinner size="sm" className="p-0" />
                    ) : (
                      <>
                        <FiXCircle /> Cancel Reservation
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-hidden rounded-2xl glass border border-white/5">
            <table className="min-w-full divide-y divide-white/5 text-left">
              <thead className="bg-white/2 bg-opacity-10 text-xs font-semibold text-dark-300 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Reservation Date</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Guests</th>
                  <th className="px-6 py-4">Assigned Table</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-white">
                {reservations.map((res) => (
                  <tr key={res._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4.5 font-medium whitespace-nowrap">{res.reservationDate}</td>
                    <td className="px-6 py-4.5 whitespace-nowrap">{res.timeSlot}</td>
                    <td className="px-6 py-4.5 whitespace-nowrap">{res.numberOfGuests}</td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      Table #{res.tableId?.tableNumber}{' '}
                      <span className="text-dark-400 text-xs">(Cap: {res.tableId?.capacity})</span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        res.status === 'Booked'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-red-500/15 text-red-400 border border-red-500/25'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right">
                      {res.status === 'Booked' ? (
                        <button
                          onClick={() => handleCancel(res._id)}
                          disabled={cancelLoadingId === res._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                        >
                          {cancelLoadingId === res._id ? (
                            <Spinner size="sm" className="p-0" />
                          ) : (
                            <>
                              <FiXCircle /> Cancel
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-dark-400 text-xs">No Actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
