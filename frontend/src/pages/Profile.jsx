import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

const SectionCard = ({ title, desc, children, accent = '#3B82F6' }) => (
  <div className="glass-card overflow-hidden animate-fade-slide-up">
    <div className="px-6 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-sm font-semibold text-white" style={{ fontFamily:'Syne,sans-serif' }}>{title}</h3>
      {desc && <p className="text-xs text-white/35 mt-0.5">{desc}</p>}
    </div>
    <div className="p-6">{children}</div>
    <div style={{ height:1, background:`linear-gradient(90deg,transparent,${accent}30,transparent)` }} />
  </div>
);

const InputRow = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">{label}</label>
    {children}
  </div>
);

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name,    setName]    = useState(user?.name  || '');
  const [email,   setEmail]   = useState(user?.email || '');
  const [pass,    setPass]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (pass && pass.length < 6) return setError('Password must be at least 6 characters.');
    if (pass !== confirm)        return setError('Passwords do not match.');
    setLoading(true);
    try {
      const r = await updateProfile(name, email, pass || undefined);
      if (r.success) { setSuccess('Profile updated successfully.'); setPass(''); setConfirm(''); }
      else setError(r.message);
    } catch { setError('An unexpected error occurred.'); }
    finally  { setLoading(false); }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-5xl mx-auto">

      <div className="mb-7 animate-fade-slide-up">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
          Account <span className="text-gradient-blue">Profile</span>
        </h1>
        <p className="text-white/35 text-sm mt-0.5">Manage your personal information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">

          {/* Avatar card */}
          <div className="glass-card p-6 text-center animate-fade-slide-up">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto"
                style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)', boxShadow:'0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(139,92,246,0.2)', fontFamily:'Syne,sans-serif' }}>
                {initial}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background:'#09090B', border:'2px solid rgba(34,197,94,0.5)' }}>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-base font-bold text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{user?.name}</h2>
            <p className="text-xs text-white/35 mb-4">{user?.email}</p>
            <span className="badge badge-blue">
              {user?.role === 'admin' ? '⚡ Admin' : '✦ Customer'}
            </span>
          </div>

          {/* Info chips */}
          <div className="glass-panel p-5 space-y-3 animate-fade-slide-up stagger-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-3">Account Details</p>
            {[
              ['Status',       'Active'],
              ['Role',         user?.role === 'admin' ? 'Administrator' : 'Customer'],
              ['Member Since', 'Active'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs py-2" style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-white/30">{k}</span>
                <span className="text-white/70">{v}</span>
              </div>
            ))}
          </div>

          {/* Security tips */}
          <div className="glass-panel p-5 animate-fade-slide-up stagger-2"
            style={{ border:'1px solid rgba(59,130,246,0.12)', background:'rgba(59,130,246,0.04)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/60 mb-3">Security Tips</p>
            <ul className="space-y-1.5 text-[11px] text-white/35">
              <li>• Use a strong, unique password</li>
              <li>• Keep your email up to date</li>
              <li>• Log out on shared devices</li>
            </ul>
          </div>
        </div>

        {/* Form area */}
        <div className="lg:col-span-8 space-y-5">
          {success && (
            <div className="px-4 py-3 rounded-xl text-sm text-green-400 flex items-center gap-2 animate-fade-slide-up"
              style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)' }}>
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-400 flex items-center gap-2 animate-fade-slide-up"
              style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <SectionCard title="Personal Information" desc="Update your name and email address" accent="#3B82F6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputRow label="Full Name">
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="input-glass" style={{ paddingLeft:16 }} />
                </InputRow>
                <InputRow label="Email Address">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="input-glass" style={{ paddingLeft:16 }} />
                </InputRow>
              </div>
            </SectionCard>

            <SectionCard title="Change Password" desc="Leave blank to keep your current password" accent="#8B5CF6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputRow label="New Password">
                  <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                    placeholder="Min 6 characters" className="input-glass" style={{ paddingLeft:16 }} />
                </InputRow>
                <InputRow label="Confirm Password">
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat password" className="input-glass" style={{ paddingLeft:16 }} />
                </InputRow>
              </div>
            </SectionCard>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-white/25">Changes apply immediately</p>
              <button type="submit" disabled={loading} className="btn-primary px-7 py-3">
                {loading ? <div style={{ width:16,height:16,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'white',animation:'spin360 .8s linear infinite' }} /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
