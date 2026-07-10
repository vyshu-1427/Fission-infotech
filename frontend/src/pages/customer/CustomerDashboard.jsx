import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiCalendar, FiList, FiUser, FiActivity, FiArrowRight, FiSmile } from 'react-icons/fi';
import Spinner from '../../components/Spinner.jsx';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReservations: 0,
    upcomingReservations: 0,
    cancelledReservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reservations/my/stats');
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching customer stats:', err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
      {/* Welcome Banner */}
      <div className="glass-card p-8 rounded-3xl mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Welcome, {user?.name}! <FiSmile className="text-brand-400 w-8 h-8" />
          </h1>
          <p className="text-dark-300 mt-2 text-base max-w-xl">
            Book tables, review booking schedules, and update your personal profiles seamlessly.
          </p>
        </div>
        <Link
          to="/reserve"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all cursor-pointer text-sm shrink-0"
        >
          Create Reservation <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-brand-400/20 font-extrabold text-6xl select-none">
            01
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4">
            <FiActivity className="w-6 h-6" />
          </div>
          <h3 className="text-dark-300 text-sm font-semibold uppercase tracking-wider">Total Reservations</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalReservations}</p>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-400/20 font-extrabold text-6xl select-none">
            02
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
            <FiCalendar className="w-6 h-6" />
          </div>
          <h3 className="text-dark-300 text-sm font-semibold uppercase tracking-wider">Upcoming Reservations</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.upcomingReservations}</p>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-red-400/20 font-extrabold text-6xl select-none">
            03
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
            <FiList className="w-6 h-6" />
          </div>
          <h3 className="text-dark-300 text-sm font-semibold uppercase tracking-wider">Cancelled Reservations</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.cancelledReservations}</p>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <h2 className="text-xl font-bold text-white mb-4">Quick Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/reserve" className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Create Reservation</h3>
            <p className="text-sm text-dark-300">Reserve a dining table for a customized guest headcount.</p>
          </div>
          <span className="mt-4 text-xs font-semibold text-brand-400 flex items-center gap-1.5 hover:text-brand-300 transition-colors">
            Go to booking <FiArrowRight />
          </span>
        </Link>

        <Link to="/reservations" className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">View Reservations</h3>
            <p className="text-sm text-dark-300">View details and check the statuses of existing table reservations.</p>
          </div>
          <span className="mt-4 text-xs font-semibold text-brand-400 flex items-center gap-1.5 hover:text-brand-300 transition-colors">
            View reservations <FiArrowRight />
          </span>
        </Link>

        <Link to="/profile" className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Profile Settings</h3>
            <p className="text-sm text-dark-300">Update your account name, email addresses, and security passwords.</p>
          </div>
          <span className="mt-4 text-xs font-semibold text-brand-400 flex items-center gap-1.5 hover:text-brand-300 transition-colors">
            Manage profile <FiArrowRight />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
