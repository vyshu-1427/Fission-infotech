import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

const Landing = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  // Modal States: null | 'login' | 'register'
  const [authModal, setAuthModal] = useState(null);
  
  // Auth Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('home');


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') return;

    if (!user) {
      setError('');
      setAuthModal('login');
    } else {
      if (tab === 'reservations') {
        navigate(user.role === 'admin' ? '/admin/reservations' : '/reservations');
      } else if (tab === 'profile') {
        navigate('/profile');
      }
    }
  };

  const handleBookTonight = () => {
    if (!user) {
      setError('');
      setAuthModal('login');
    } else {
      navigate(user.role === 'admin' ? '/admin/tables' : '/reserve');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModal === 'login') {
        const res = await login(email, password);
        if (res && res.success) {
          setAuthModal(null);
          // Redirect to appropriate screen based on active selection or role
          if (activeTab === 'reservations') {
            navigate(user?.role === 'admin' ? '/admin/reservations' : '/reservations');
          } else if (activeTab === 'profile') {
            navigate('/profile');
          } else {
            navigate(user?.role === 'admin' ? '/admin/dashboard' : '/reserve');
          }
        } else {
          setError(res?.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const res = await register(name, email, password);
        if (res && res.success) {
          setAuthModal(null);
          navigate(user?.role === 'admin' ? '/admin/dashboard' : '/reserve');
        } else {
          setError(res?.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden flex flex-col justify-between animate-fade-in" style={{ backgroundColor: '#0b0c16' }}>
      {/* Full Screen Background Image inspired by PRIMA */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="/prima_table_render.png" 
          alt="PRIMA Background" 
          className="w-full h-full object-cover object-center scale-[1.02]"
        />
        {/* Sleek radial gradient overlay to make text and layout readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c16] via-[#0b0c16]/30 to-[#0b0c16]/70" />
      </div>

      {/* TOP HEADER */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
            <span className="text-white text-lg font-bold">✦</span>
          </div>
          <span className="text-xl font-bold tracking-wider font-display uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>
            FineDine
          </span>
        </div>
      </header>

      {/* HERO TEXT — sits over the full-screen background image */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-end pb-44 px-6 text-center">
        {/* Subtle badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium tracking-widest uppercase text-white/50 border border-white/10 backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now accepting reservations
        </div>

        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-5 text-white leading-[1.05] drop-shadow-2xl"
          style={{ fontFamily: 'Syne, sans-serif', textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>
          Instant access.<br />
          <span style={{
            background: 'linear-gradient(135deg, #93c5fd, #c4b5fd, #f9a8d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Effortless booking</span>
        </h2>

        <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto font-light leading-relaxed"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
          Manage your bookings, reschedule anytime, and get access to premium dining experiences.
        </p>
      </main>

      {/* FLOATING BOTTOM NAV BAR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
        <div className="glass-panel px-3 py-2.5 flex items-center justify-between rounded-full border border-white/10 shadow-2xl backdrop-blur-3xl"
          style={{ background: 'rgba(15,23,42,0.75)', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.05)' }}>
          
          <div className="flex items-center gap-1.5 flex-1">
            {/* Home Tab */}
            <button
              onClick={() => handleTabClick('home')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'home' 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {activeTab === 'home' && <span>Home</span>}
            </button>

            {/* Reservations Tab */}
            <button
              onClick={() => handleTabClick('reservations')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'reservations' 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {activeTab === 'reservations' && <span>Bookings</span>}
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'profile' 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {activeTab === 'profile' && <span>Profile</span>}
            </button>
          </div>

          {/* Book Tonight CTA */}
          <button
            onClick={handleBookTonight}
            className="flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-black hover:scale-105 active:scale-95 transition-all shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FFE0B2 0%, #FFA726 100%)',
              boxShadow: '0 4px 15px rgba(251,140,0,0.3)',
            }}
          >
            Book Tonight
          </button>
        </div>
      </div>

      {/* AUTH OVERLAY MODAL */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setAuthModal(null)} />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md grad-border" style={{ borderRadius: 24 }}>
            <div className="glass-card p-8 relative overflow-hidden" style={{ borderRadius: 24 }}>
              
              {/* Close Button */}
              <button 
                onClick={() => setAuthModal(null)} 
                className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>

              <h3 className="text-2xl font-bold font-display text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                {authModal === 'login' ? 'Welcome back' : 'Create Account'}
              </h3>
              <p className="text-white/40 text-sm mb-6">
                {authModal === 'login' ? 'Sign in to confirm your reservation' : 'Sign up to begin booking premium tables'}
              </p>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-xl text-sm text-red-400 border border-red-500/20 bg-red-500/5">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authModal === 'register' && (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 text-sm">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name" 
                      className="input-glass pl-11" 
                    />
                  </div>
                )}

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 text-sm">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="3"/>
                      <path d="m2 7 10 7 10-7"/>
                    </svg>
                  </span>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com" 
                    className="input-glass pl-11" 
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 text-sm">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="input-glass pl-11" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm font-semibold tracking-wide mt-2"
                  style={{ borderRadius: 14 }}
                >
                  {loading ? <Spinner size="sm" /> : authModal === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              {/* Mode Toggle */}
              <p className="text-center text-sm text-white/40 mt-6">
                {authModal === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthModal(authModal === 'login' ? 'register' : 'login');
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors focus:outline-none"
                >
                  {authModal === 'login' ? 'Create one' : 'Sign In'}
                </button>
              </p>

              {/* Admin login helper details */}
              {authModal === 'login' && (
                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                  <span className="text-[10px] text-white/15 tracking-wider block">
                    ADMIN · admin@restaurant.com · adminpassword123
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
