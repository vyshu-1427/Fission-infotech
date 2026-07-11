import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FxBackground from '../components/FxBackground.jsx';
import Spinner from '../components/Spinner.jsx';

const FieldIcon = ({ children }) => (
  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400/60 z-10">
    {children}
  </span>
);

const SocialBtn = ({ icon, label }) => (
  <button className="btn-glass flex-1 gap-2 py-3 text-sm">
    <span className="text-base">{icon}</span>
    <span className="text-white/60">{label}</span>
  </button>
);

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await login(email, password);
      if (r && !r.success) setError(r.message);
    } catch { setError('An unexpected error occurred.'); }
    finally  { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <FxBackground />

      {/* Decorative floating orbs around card */}
      <div className="absolute" style={{ width:120, height:120, top:'20%', left:'calc(50% - 340px)',
        background:'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
        borderRadius:'50%', filter:'blur(20px)', animation:'floatY 6s ease-in-out infinite' }} />
      <div className="absolute" style={{ width:80,  height:80,  bottom:'25%', left:'calc(50% - 380px)',
        background:'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
        borderRadius:'50%', filter:'blur(14px)', animation:'floatY 8s ease-in-out infinite', animationDelay:'1s' }} />
      <div className="absolute" style={{ width:100, height:100, top:'30%', right:'calc(50% - 340px)',
        background:'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)',
        borderRadius:'50%', filter:'blur(16px)', animation:'floatY 7s ease-in-out infinite', animationDelay:'2s' }} />
      <div className="absolute" style={{ width:60,  height:60,  bottom:'30%', right:'calc(50% - 380px)',
        background:'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)',
        borderRadius:'50%', filter:'blur(12px)', animation:'floatY 9s ease-in-out infinite', animationDelay:'0.5s' }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 animate-pulse-ring"
            style={{ background:'linear-gradient(135deg, #3B82F6, #8B5CF6)', boxShadow:'0 0 30px rgba(59,130,246,0.5)' }}>
            <span className="text-2xl">✦</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient-animated mb-1" style={{ fontFamily:'Syne,sans-serif', backgroundSize:'300% auto' }}>
            FineDine
          </h1>
          <p className="text-white/40 text-sm tracking-widest uppercase">Premium Reservations</p>
        </div>

        {/* Glass card */}
        <div className="grad-border" style={{ borderRadius:24 }}>
          <div className="glass-card p-8" style={{ borderRadius:24 }}>
            {/* Top shimmer bar */}
            <div style={{ height:2, marginBottom:32, borderRadius:99, background:'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(139,92,246,0.4), transparent)' }} />

            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>Welcome back</h2>
            <p className="text-white/40 text-sm mb-8">Sign in to your account to continue</p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 flex items-center gap-2"
                style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <FieldIcon>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" opacity="0"/><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                </FieldIcon>
                <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-glass" />
              </div>

              {/* Password */}
              <div className="relative">
                <FieldIcon>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </FieldIcon>
                <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" className="input-glass" />
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-sm text-white/50 cursor-pointer select-none">
                  <div
                    onClick={() => setRemember(!remember)}
                    className="w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all"
                    style={{
                      width:18, height:18,
                      background: remember ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${remember ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
                      boxShadow: remember ? '0 0 12px rgba(59,130,246,0.5)' : 'none',
                    }}>
                    {remember && <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 12 12"><path d="m1.5 6 3 3 6-6"/></svg>}
                  </div>
                  Remember me
                </label>
                <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 mt-2"
                style={{ borderRadius:14 }}>
                {loading ? <Spinner size="sm" /> : <>Sign In <span className="ml-1">→</span></>}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="fx-divider flex-1" />
              <span className="text-white/25 text-xs">or continue with</span>
              <div className="fx-divider flex-1" />
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <SocialBtn icon="G" label="Google" />
              <SocialBtn icon="⌘" label="Apple" />
            </div>

            <p className="text-center text-sm text-white/40 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create one
              </Link>
            </p>

            {/* Admin hint */}
            <p className="text-center text-[10px] text-white/15 mt-4 tracking-wider">
              ADMIN · admin@restaurant.com · adminpassword123
            </p>

            <div style={{ height:2, marginTop:28, borderRadius:99, background:'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
