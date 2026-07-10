import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiAlertTriangle } from 'react-icons/fi';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
        {/* Visual highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-amber-500" />
        
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <FiAlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-5xl font-extrabold text-white mb-2">403 Forbidden</h1>
        <p className="text-dark-300 mb-8">
          Your current security permissions do not allow you to view this resource. Please return to your designated dashboard.
        </p>

        <Link
          to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
          className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-brand-500/20 transition-all cursor-pointer hover:shadow-xl"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
