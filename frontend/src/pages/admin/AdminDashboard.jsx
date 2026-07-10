import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { FiCalendar, FiMapPin, FiXCircle, FiTrendingUp, FiActivity, FiArrowRight } from 'react-icons/fi';
import Spinner from '../../components/Spinner.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    todayReservations: 0,
    cancelledReservations: 0,
    availableTables: 0,
  });
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        // 1. Fetch dashboard stats
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data?.success) {
          setStats(statsRes.data.data);
        }

        // 2. Fetch today's reservations for quick view
        const todayStr = new Date().toISOString().split('T')[0];
        const bookingsRes = await api.get(`/admin/reservations?date=${todayStr}&status=Booked`);
        if (bookingsRes.data?.success) {
          setTodayBookings(bookingsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboardData();
  }, []);

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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-dark-300 mt-1">Monitor dining statistics, manage reservation logs, and configure tables.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Reservations */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-brand-400/20 font-extrabold text-5xl select-none">
            All
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4">
            <FiActivity className="w-5 h-5" />
          </div>
          <h3 className="text-dark-300 text-xs font-semibold uppercase tracking-wider">Total Bookings</h3>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalReservations}</p>
        </div>

        {/* Card 2: Today's Reservations */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-400/20 font-extrabold text-5xl select-none">
            Now
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
            <FiCalendar className="w-5 h-5" />
          </div>
          <h3 className="text-dark-300 text-xs font-semibold uppercase tracking-wider">Today's Schedule</h3>
          <p className="text-2xl font-bold text-white mt-1">{stats.todayReservations}</p>
        </div>

        {/* Card 3: Cancelled Reservations */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-red-400/20 font-extrabold text-5xl select-none">
            Void
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
            <FiXCircle className="w-5 h-5" />
          </div>
          <h3 className="text-dark-300 text-xs font-semibold uppercase tracking-wider">Cancelled Bookings</h3>
          <p className="text-2xl font-bold text-white mt-1">{stats.cancelledReservations}</p>
        </div>

        {/* Card 4: Active Tables */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-cyan-400/20 font-extrabold text-5xl select-none">
            Room
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
            <FiMapPin className="w-5 h-5" />
          </div>
          <h3 className="text-dark-300 text-xs font-semibold uppercase tracking-wider">Active Tables</h3>
          <p className="text-2xl font-bold text-white mt-1">{stats.availableTables}</p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Reservation Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Today's Active Schedule</h2>
            <Link to="/admin/reservations" className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              Manage All <FiArrowRight />
            </Link>
          </div>

          {todayBookings.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center text-dark-300 border border-white/5">
              No reservations scheduled for today.
            </div>
          ) : (
            <div className="space-y-4">
              {todayBookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">{booking.userId?.name}</h3>
                    <p className="text-xs text-dark-300 mt-0.5">{booking.userId?.email}</p>
                    <div className="flex gap-4 mt-2 text-xs text-dark-400">
                      <span>Time: <strong className="text-dark-200">{booking.timeSlot}</strong></span>
                      <span>Guests: <strong className="text-dark-200">{booking.numberOfGuests}</strong></span>
                      <span>Table: <strong className="text-dark-200">#{booking.tableId?.tableNumber}</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {booking.timeSlot}
                    </span>
                  </div>
                </div>
              ))}
              {todayBookings.length > 5 && (
                <p className="text-center text-xs text-dark-400">And {todayBookings.length - 5} more reservations scheduled for today...</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Shortcut Menu & Quick Settings */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Management Links</h2>
          
          <div className="space-y-4">
            <Link to="/admin/reservations" className="glass-card glass-card-hover p-5 rounded-2xl block">
              <h3 className="font-bold text-white mb-1">Manage Reservations</h3>
              <p className="text-xs text-dark-300">View, search, edit, or cancel client bookings across all dates.</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 mt-3">
                Open reservation log <FiArrowRight />
              </span>
            </Link>

            <Link to="/admin/tables" className="glass-card glass-card-hover p-5 rounded-2xl block">
              <h3 className="font-bold text-white mb-1">Manage Restaurant Tables</h3>
              <p className="text-xs text-dark-300">Configure layout capacities, toggle statuses, and safely delete inactive tables.</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 mt-3">
                Open table builder <FiArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
