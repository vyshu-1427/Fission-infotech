import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Spinner from '../../components/Spinner.jsx';

const StatCard = ({ icon, label, value, color, accent, delay }) => (
  <div className="stat-card animate-fade-slide-up" style={{ '--accent-color': accent, animationDelay: delay }}>
    <div className="flex items-start justify-between mb-5">
      <div className="icon-box" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div className="w-2 h-2 rounded-full mt-1" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
    </div>
    <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{value}</p>
    <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl" style={{ background:`linear-gradient(90deg,transparent,${color}40,transparent)` }} />
  </div>
);

const QuickAction = ({ to, icon, title, desc, color, delay }) => (
  <Link to={to} className="glass-card p-5 block group animate-fade-slide-up" style={{ animationDelay: delay }}>
    <div className="icon-box mb-4" style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
      <span style={{ fontSize:20 }}>{icon}</span>
    </div>
    <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{title}</h3>
    <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
    <div className="mt-3 flex items-center gap-1 text-xs font-medium transition-all"
      style={{ color }}>
      Open <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
    </div>
  </Link>
);

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]   = useState({ totalReservations:0, upcomingReservations:0, cancelledReservations:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations/my/stats')
      .then(r => { if (r.data?.success) setStats(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const time = new Date().getHours();
  const greeting = time < 12 ? 'Good Morning' : time < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{ width:40, height:40, borderRadius:'50%', border:'2px solid rgba(59,130,246,0.15)', borderTopColor:'#3B82F6', animation:'spin360 .8s linear infinite' }} />
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-6xl mx-auto">

      {/* ── Welcome Hero ── */}
      <div className="glass-card p-7 mb-8 relative overflow-hidden animate-fade-slide-up"
        style={{ background:'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(9,9,11,0.6) 100%)' }}>
        {/* Decorative glow */}
        <div style={{ position:'absolute', right:-60, top:-60, width:200, height:200, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div>
            <p className="text-xs text-white/35 uppercase tracking-widest mb-2">{greeting}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily:'Syne,sans-serif' }}>
              Welcome back, <span className="text-gradient-blue">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-white/40 text-sm">Your premium dining experiences are just a few clicks away.</p>
          </div>
          <Link to="/reserve" className="btn-primary shrink-0 px-6 py-3">
            Reserve Table ✦
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon="✦" label="Total Reservations" value={stats.totalReservations}    color="#3B82F6" accent="#3B82F6" delay="0ms"   />
        <StatCard icon="◎" label="Upcoming"           value={stats.upcomingReservations}  color="#06B6D4" accent="#06B6D4" delay="80ms"  />
        <StatCard icon="✕" label="Cancelled"          value={stats.cancelledReservations} color="#8B5CF6" accent="#8B5CF6" delay="160ms" />
      </div>

      {/* ── Quick Actions ── */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <QuickAction to="/reserve"      icon="🗓" title="New Reservation"  desc="Book a premium table for your party." color="#3B82F6" delay="0ms"   />
          <QuickAction to="/reservations" icon="📋" title="My Bookings"      desc="View and manage your reservations."   color="#06B6D4" delay="80ms"  />
          <QuickAction to="/profile"      icon="⚙" title="Account Settings" desc="Update your profile and password."    color="#8B5CF6" delay="160ms" />
        </div>
      </div>

      {/* ── Activity timeline ── */}
      <div className="glass-card p-6 animate-fade-slide-up stagger-4">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { icon:'✦', text:'Account created — welcome to FineDine!', time:'Today', color:'#3B82F6' },
            { icon:'◎', text:'Profile set up and ready.',              time:'Today', color:'#06B6D4' },
          ].map(({ icon, text, time, color }, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5"
                style={{ background:`${color}15`, border:`1px solid ${color}25`, color }}>
                {icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/70">{text}</p>
                <p className="text-[11px] text-white/25 mt-0.5">{time}</p>
              </div>
            </div>
          ))}
          {stats.totalReservations === 0 && (
            <div className="text-center py-6">
              <p className="text-white/25 text-sm">No reservations yet — make your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
