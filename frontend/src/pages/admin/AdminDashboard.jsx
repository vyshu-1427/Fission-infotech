import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';

const StatCard = ({ icon, label, value, color, delay }) => (
  <div className="stat-card animate-fade-slide-up" style={{ '--accent-color':color, animationDelay:delay }}>
    <div className="flex items-start justify-between mb-4">
      <div className="icon-box text-lg" style={{ background:`${color}18`, border:`1px solid ${color}30` }}>{icon}</div>
      <div className="w-2 h-2 rounded-full mt-1" style={{ background:color, boxShadow:`0 0 8px ${color}` }} />
    </div>
    <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{value ?? '—'}</p>
    <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl" style={{ background:`linear-gradient(90deg,transparent,${color}40,transparent)` }} />
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').catch(() => null),
      api.get('/admin/reservations?limit=5').catch(() => null),
    ]).then(([s, r]) => {
      if (s?.data?.success) setStats(s.data.data);
      if (r?.data?.success) setRecent(r.data.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{ width:36,height:36,borderRadius:'50%',border:'2px solid rgba(59,130,246,0.15)',borderTopColor:'#3B82F6',animation:'spin360 .8s linear infinite' }} />
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8 animate-fade-slide-up">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Admin Panel</p>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
          Control <span className="text-gradient-blue">Center</span>
        </h1>
        <p className="text-white/35 text-sm mt-0.5">Full restaurant management dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" label="Total Reservations" value={stats?.totalReservations}  color="#3B82F6" delay="0ms"   />
        <StatCard icon="✓"  label="Confirmed"          value={stats?.bookedReservations} color="#06B6D4" delay="80ms"  />
        <StatCard icon="✕"  label="Cancelled"          value={stats?.cancelledReservations} color="#EC4899" delay="160ms" />
        <StatCard icon="🪑" label="Tables"             value={stats?.totalTables}        color="#8B5CF6" delay="240ms" />
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { href:'/admin/reservations', icon:'📋', title:'Reservations', desc:'Manage all bookings', color:'#3B82F6' },
          { href:'/admin/tables',       icon:'🪑', title:'Table Setup',  desc:'Configure floor plan', color:'#8B5CF6' },
          { href:'/profile',            icon:'⚙',  title:'Settings',    desc:'Account preferences', color:'#06B6D4' },
        ].map(({ href, icon, title, desc, color }, i) => (
          <a key={href} href={href} className="glass-card p-5 group block animate-fade-slide-up" style={{ animationDelay:`${i*80}ms` }}>
            <div className="icon-box mb-3 text-xl" style={{ background:`${color}15`, border:`1px solid ${color}25` }}>{icon}</div>
            <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{title}</h3>
            <p className="text-xs text-white/35">{desc}</p>
            <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium transition-all group-hover:gap-2" style={{ color }}>
              Manage <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </a>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="glass-card animate-fade-slide-up stagger-4">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-sm font-semibold text-white" style={{ fontFamily:'Syne,sans-serif' }}>Recent Reservations</h2>
          <a href="/admin/reservations" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</a>
        </div>
        {recent.length === 0 ? (
          <div className="py-10 text-center text-white/25 text-sm">No reservations yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="fx-table">
              <thead>
                <tr>
                  {['Customer','Date','Time','Table','Status'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {recent.map(res => (
                  <tr key={res._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
                          {res.userId?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">{res.userId?.name}</p>
                          <p className="text-[10px] text-white/30">{res.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{res.reservationDate}</td>
                    <td className="text-sm">{res.timeSlot}</td>
                    <td className="text-sm">#{res.tableId?.tableNumber}</td>
                    <td>
                      <span className={`badge ${res.status === 'Booked' ? 'badge-green' : 'badge-red'}`}>
                        {res.status === 'Booked' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
