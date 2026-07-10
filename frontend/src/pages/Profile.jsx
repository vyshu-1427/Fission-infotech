import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Spinner from '../components/Spinner.jsx';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Input validation
    if (password && password.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile(name, email, password || undefined);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Profile</h1>
        <p className="text-dark-300 mt-1">Review or update your personal account settings and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info Card */}
        <div className="glass-card p-6 rounded-2xl text-center self-start relative overflow-hidden border border-white/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-cyan-400" />
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg shadow-brand-500/5">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-sm text-dark-300 mt-1">{user?.email}</p>
          <div className="mt-4 inline-flex px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
            {user?.role} Account
          </div>
        </div>

        {/* Right Column - Update Profile Form */}
        <div className="glass-card lg:col-span-2 p-8 rounded-2xl relative overflow-hidden">
          {success && (
            <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-sm text-emerald-400">
              <FiCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400">
                  <FiUser className="w-5 h-5" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400">
                  <FiMail className="w-5 h-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
              <p className="text-xs text-dark-300 mb-4">Leave fields empty if you do not want to modify your password.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400">
                      <FiLock className="w-5 h-5" />
                    </span>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-11 pr-4 py-3 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400">
                      <FiLock className="w-5 h-5" />
                    </span>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-11 pr-4 py-3 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
            >
              {loading ? <Spinner size="sm" className="p-0" /> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
