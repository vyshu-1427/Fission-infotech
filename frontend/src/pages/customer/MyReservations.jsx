import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import Spinner from '../../components/Spinner.jsx';

const TABS = [['all','All'],['booked','Upcoming'],['cancelled','Cancelled']];

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [cancelId,  setCancelId]  = useState(null);
  const [tab,       setTab]       = useState('all');
  const [search,    setSearch]    = useState('');

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await api.get('/reservations/my');
      if (r.data?.success) setReservations(r.data.data);
    } catch { setError('Failed to load reservations.'); }
    finally  { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    setCancelId(id);
    try {
      const r = await api.delete(`/reservations/${id}`);
      if (r.data?.success) setReservations(prev => prev.map(res => res._id === id ? { ...res, status:'Cancelled' } : res));
    } catch (err) { setError(err.response?.data?.message || 'Cancel failed.'); }
    finally { setCancelId(null); }
  };

  const filtered = reservations.filter(r => {
    const matchTab    = tab === 'all' || r.status.toLowerCase() === tab;
    const matchSearch = !search || r.reservationDate.includes(search) || r.timeSlot.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all:       reservations.length,
    booked:    reservations.filter(r => r.status === 'Booked').length,
    cancelled: reservations.filter(r => r.status === 'Cancelled').length,
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{ width:36,height:36,borderRadius:'50%',border:'2px solid rgba(59,130,246,0.15)',borderTopColor:'#3B82F6',animation:'spin360 .8s linear infinite' }} />
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 animate-fade-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
            My <span className="text-gradient-cyan">Bookings</span>
          </h1>
          <p className="text-white/35 text-sm mt-0.5">Manage your dining reservations</p>
        </div>
        <Link to="/reserve" className="btn-primary px-5 py-2.5 text-sm">+ New Booking</Link>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400" style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* Tabs + search */}
      <div className="glass-card mb-5 animate-fade-slide-up stagger-1" style={{ borderRadius:20, overflow:'hidden' }}>
        <div className="flex items-center justify-between px-5 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
          <div className="flex">
            {TABS.map(([val, label]) => (
              <button key={val} onClick={() => setTab(val)}
                className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all"
                style={{
                  color: tab === val ? '#60A5FA' : 'rgba(255,255,255,0.3)',
                  borderBottom: `2px solid ${tab === val ? '#3B82F6' : 'transparent'}`,
                }}>
                {label}
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ background: tab === val ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)', color: tab === val ? '#60A5FA' : 'rgba(255,255,255,0.3)' }}>
                  {counts[val]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative hidden sm:block">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search…" className="input-glass py-1.5 text-xs w-36" style={{ paddingLeft:12 }} />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="text-3xl mb-3 opacity-25">📋</div>
            <p className="text-white/25 text-sm">No reservations found</p>
            <Link to="/reserve" className="btn-primary mt-5 px-5 py-2.5 text-sm">Reserve a Table</Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="fx-table">
                <thead>
                  <tr>
                    {['Date','Time','Guests','Table','Status','Action'].map(h => (
                      <th key={h} style={{ textAlign: h==='Action' ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(res => (
                    <tr key={res._id}>
                      <td className="font-medium">📅 {res.reservationDate}</td>
                      <td>🕐 {res.timeSlot}</td>
                      <td>👥 {res.numberOfGuests}</td>
                      <td>#{res.tableId?.tableNumber} <span className="text-white/30 text-xs">({res.tableId?.capacity} seats)</span></td>
                      <td>
                        <span className={`badge ${res.status === 'Booked' ? 'badge-green' : 'badge-red'}`}>
                          {res.status === 'Booked' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                          {res.status}
                        </span>
                      </td>
                      <td style={{ textAlign:'right' }}>
                        {res.status === 'Booked' ? (
                          <button onClick={() => handleCancel(res._id)} disabled={cancelId === res._id}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 transition-all"
                            style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                            {cancelId === res._id ? '…' : 'Cancel'}
                          </button>
                        ) : <span className="text-white/20 text-xs">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
              {filtered.map(res => (
                <div key={res._id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`badge ${res.status === 'Booked' ? 'badge-green' : 'badge-red'}`}>{res.status}</span>
                    <span className="text-[11px] text-white/25">{new Date(res.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
                    <span>📅 {res.reservationDate}</span>
                    <span>🕐 {res.timeSlot}</span>
                    <span>👥 {res.numberOfGuests} guests</span>
                    <span>Table #{res.tableId?.tableNumber}</span>
                  </div>
                  {res.status === 'Booked' && (
                    <button onClick={() => handleCancel(res._id)} disabled={cancelId === res._id}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-red-400"
                      style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                      {cancelId === res._id ? 'Cancelling…' : 'Cancel Reservation'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-center text-[11px] text-white/20">
        Showing {filtered.length} of {reservations.length} reservations
      </p>
    </div>
  );
};

export default MyReservations;
