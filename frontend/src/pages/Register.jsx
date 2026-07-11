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

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (pass.length < 6)   return setError('Password must be at least 6 characters.');
    if (pass !== confirm)  return setError('Passwords do not match.');
    setLoading(true);
    try {
      const r = await register(name, email, pass);
      if (r && !r.success) setError(r.message);
    } catch { setError('An unexpected error occurred.'); }
    finally  { setLoading(false); }
  };

  const fields = [
    { id:'name',    type:'text',     value:name,    set:setName,    icon:'👤', ph:'Full Name' },
    { id:'email',   type:'email',    value:email,   set:setEmail,   icon:'✉',  ph:'Email Address' },
    { id:'pass',    type:'password', value:pass,    set:setPass,    icon:'🔒', ph:'Password (min 6 chars)' },
    { id:'confirm', type:'password', value:confirm, set:setConfirm, icon:'🔒', ph:'Confirm Password' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <FxBackground />

      {/* Decorative orbs */}
      {[
        { w:110, pos:'top:18%, left:calc(50% - 350px)', c:'#3B82F6', del:'0s' },
        { w:70,  pos:'bottom:20%, left:calc(50% - 390px)', c:'#EC4899', del:'1.5s' },
        { w:90,  pos:'top:25%, right:calc(50% - 350px)', c:'#8B5CF6', del:'0.8s' },
        { w:60,  pos:'bottom:28%, right:calc(50% - 400px)', c:'#06B6D4', del:'2s' },
      ].map(({ w, pos, c, del }, i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          width: w, height: w, [pos.split(',')[0].split(':')[0]]: pos.split(',')[0].split(':')[1],
          [pos.split(',')[1].trim().split(':')[0]]: pos.split(',')[1].trim().split(':').slice(1).join(':'),
          background: `radial-gradient(circle, ${c}55 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(18px)',
          animation: `floatY ${6+i}s ease-in-out infinite`, animationDelay: del,
        }} />
      ))}

      <div className="relative z-10 w-full max-w-md animate-fade-slide-up">
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
            style={{ background:'linear-gradient(135deg,#06B6D4,#3B82F6)', boxShadow:'0 0 25px rgba(6,182,212,0.5)' }}>
            <span className="text-xl">✦</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient-animated mb-0.5" style={{ fontFamily:'Syne,sans-serif', backgroundSize:'300% auto' }}>
            FineDine
          </h1>
          <p className="text-white/35 text-xs tracking-widest uppercase">Create your account</p>
        </div>

        <div className="grad-border" style={{ borderRadius:24 }}>
          <div className="glass-card p-7" style={{ borderRadius:24 }}>
            <div style={{ height:2, marginBottom:24, borderRadius:99, background:'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(59,130,246,0.4), transparent)' }} />

            <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>Join FineDine</h2>
            <p className="text-white/40 text-sm mb-6">Reserve premium dining experiences</p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 flex items-center gap-2"
                style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ id, type, value, set, icon, ph }) => (
                <div key={id} className="relative">
                  <FieldIcon><span style={{ fontSize:15 }}>{icon}</span></FieldIcon>
                  <input id={id} type={type} required value={value} onChange={e => set(e.target.value)}
                    placeholder={ph} className="input-glass" />
                </div>
              ))}

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 mt-2"
                style={{ background:'linear-gradient(135deg,#06B6D4,#3B82F6,#8B5CF6)', borderRadius:14 }}>
                {loading ? <Spinner size="sm" /> : <>Create Account <span className="ml-1">✦</span></>}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="fx-divider flex-1" />
              <span className="text-white/25 text-xs">or sign up with</span>
              <div className="fx-divider flex-1" />
            </div>

            <div className="flex gap-3">
              <button className="btn-glass flex-1 py-3 text-sm gap-2">
                <span>G</span> <span className="text-white/60">Google</span>
              </button>
              <button className="btn-glass flex-1 py-3 text-sm gap-2">
                <span>⌘</span> <span className="text-white/60">Apple</span>
              </button>
            </div>

            <p className="text-center text-sm text-white/40 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>

            <div style={{ height:2, marginTop:24, borderRadius:99, background:'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
