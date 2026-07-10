import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { FiSearch, FiCalendar, FiFilter, FiEdit2, FiXCircle, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
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

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Editing States
  const [editingReservation, setEditingReservation] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editGuests, setEditGuests] = useState(1);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, [dateFilter, statusFilter]); // Trigger fetch on filter change (except search, which we query on demand or debounce/button trigger)

  const fetchReservations = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let queryStr = `?search=${searchTerm}`;
      if (dateFilter) queryStr += `&date=${dateFilter}`;
      if (statusFilter) queryStr += `&status=${statusFilter}`;

      const response = await api.get(`/admin/reservations${queryStr}`);
      if (response.data?.success) {
        setReservations(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to fetch reservations log.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/reservations/${id}`);
      if (response.data?.success) {
        setReservations((prev) =>
          prev.map((res) => (res._id === id ? { ...res, status: 'Cancelled' } : res))
        );
      }
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      setError('Failed to cancel reservation.');
    }
  };

  // Open Edit Modal
  const openEditModal = (res) => {
    setEditingReservation(res);
    setEditDate(res.reservationDate);
    setEditTimeSlot(res.timeSlot);
    setEditGuests(res.numberOfGuests);
    setEditError('');
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      const response = await api.put(`/admin/reservations/${editingReservation._id}`, {
        reservationDate: editDate,
        timeSlot: editTimeSlot,
        numberOfGuests: Number(editGuests),
      });

      if (response.data?.success) {
        // Refresh local reservations to show new table assignment or date/time updates
        const updatedReservation = response.data.data;
        setReservations((prev) =>
          prev.map((res) => (res._id === editingReservation._id ? updatedReservation : res))
        );
        setEditingReservation(null);
      }
    } catch (err) {
      console.error('Error updating reservation:', err);
      setEditError(err.response?.data?.message || 'Failed to update reservation. Selected slot might have conflicts.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Reservations</h1>
        <p className="text-dark-300 mt-1">Audit, modify, filter, or cancel dining reservations across the entire system.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-6 rounded-2xl mb-8 border border-white/5">
        <form onSubmit={fetchReservations} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search bar */}
          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Search Customer</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-dark-400 pointer-events-none">
                <FiSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or email..."
                className="w-full pl-9 pr-3 py-2 bg-dark-900/60 border border-white/5 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Filter Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-dark-400 pointer-events-none">
                <FiCalendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Filter Status</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-dark-400 pointer-events-none">
                <FiFilter className="w-4 h-4" />
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-dark-950">All Statuses</option>
                <option value="Booked" className="bg-dark-950">Booked</option>
                <option value="Cancelled" className="bg-dark-950">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Filter button */}
          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25 cursor-pointer"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center border border-white/5">
          <p className="text-dark-300">No reservations matching the search criteria were found.</p>
        </div>
      ) : (
        /* Reservation Table Logs */
        <div className="overflow-hidden rounded-2xl glass border border-white/5">
          <table className="min-w-full divide-y divide-white/5 text-left">
            <thead className="bg-white/2 bg-opacity-10 text-xs font-semibold text-dark-300 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Guests</th>
                <th className="px-6 py-4">Assigned Table</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-white">
              {reservations.map((res) => (
                <tr key={res._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{res.userId?.name || 'Deleted User'}</div>
                    <div className="text-xs text-dark-400 mt-0.5">{res.userId?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{res.reservationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{res.timeSlot}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{res.numberOfGuests}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Table #{res.tableId?.tableNumber || 'Deleted'}{' '}
                    <span className="text-dark-400 text-xs">(Cap: {res.tableId?.capacity || 0})</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      res.status === 'Booked'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-red-500/15 text-red-400 border border-red-500/25'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    {res.status === 'Booked' ? (
                      <>
                        <button
                          onClick={() => openEditModal(res)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-400 hover:text-brand-350 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/10 transition-all cursor-pointer"
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          onClick={() => handleCancel(res._id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 transition-all cursor-pointer"
                        >
                          <FiXCircle /> Cancel
                        </button>
                      </>
                    ) : (
                      <span className="text-dark-400 text-xs">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editing Reservation Dialog Modal */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-scale-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Reservation</h2>
              <button
                onClick={() => setEditingReservation(null)}
                className="p-1 rounded-lg text-dark-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Client Info (Static) */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 mb-4">
                <p className="text-[10px] uppercase text-dark-400 font-semibold tracking-wider">Customer Info</p>
                <p className="text-sm font-bold text-white mt-0.5">{editingReservation.userId?.name}</p>
                <p className="text-xs text-dark-300">{editingReservation.userId?.email}</p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase mb-1">Reservation Date</label>
                <input
                  type="date"
                  required
                  value={editDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-900/60 border border-white/5 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase mb-1">Time Slot</label>
                <select
                  required
                  value={editTimeSlot}
                  onChange={(e) => setEditTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-900/60 border border-white/5 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot} className="bg-dark-950">{slot}</option>
                  ))}
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase mb-1">Number of Guests</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editGuests}
                  onChange={(e) => setEditGuests(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-900/60 border border-white/5 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="w-1/2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/5 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="w-1/2 py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all shadow-lg shadow-brand-500/20 cursor-pointer flex items-center justify-center"
                >
                  {editLoading ? <Spinner size="sm" className="p-0" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReservations;
