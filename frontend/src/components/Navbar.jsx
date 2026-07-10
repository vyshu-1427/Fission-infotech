import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiMenu, FiX, FiLogOut, FiUser, FiCalendar, FiMapPin, FiActivity } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const links =
    user.role === 'admin'
      ? [
          { name: 'Dashboard', path: '/admin/dashboard', icon: FiActivity },
          { name: 'Reservations', path: '/admin/reservations', icon: FiCalendar },
          { name: 'Tables', path: '/admin/tables', icon: FiMapPin },
          { name: 'Profile', path: '/profile', icon: FiUser },
        ]
      : [
          { name: 'Dashboard', path: '/dashboard', icon: FiActivity },
          { name: 'Reserve Table', path: '/reserve', icon: FiCalendar },
          { name: 'My Bookings', path: '/reservations', icon: FiCalendar },
          { name: 'Profile', path: '/profile', icon: FiUser },
        ];

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-brand-500/20">
                🍽️
              </span>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-dark-200">
                Fine<span className="text-brand-400">Dine</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-sm shadow-brand-500/5'
                        : 'text-dark-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          {/* User Profile Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-dark-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{user.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-semibold uppercase text-[10px]">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-red-400 bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-dark-950/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                      : 'text-dark-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </NavLink>
            );
          })}
          <div className="pt-4 mt-4 border-t border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm text-dark-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{user.name}</span>
              <span className="ml-auto px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-semibold uppercase text-[10px]">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-red-400 bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 cursor-pointer"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
