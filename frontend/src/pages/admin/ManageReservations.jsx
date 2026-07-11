import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';

const TIME_SLOTS = ['12:00 PM','1:00 PM','2:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'];

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [search,    setSearch]    = useState('');
  const [dateFilter,setDateFilter] = useState('');
  const [statusFilter,setStatus]  = useState('');
  const [editing,   setEditing]   = useState(null);
  const [editDate,  setEditDate]  = useState('');
  const [editTime,  setEditTime]  = useState('');
  const [editGuests,setEditGuests]= useState(1);
  const [editError, setEditError] = useState('');
  const [editLoad,  setEditLoad]  = useState(false);

  useEffect(() => { fetch(); }, [dateFilter, statusFilter]);

  const fetch = async () => {
    setLoading(true); setError('');
    try {
      let q = `?search=${search}`;
      if (dateFilter)  q += `&date=${dateFilter}`;
      if (statusFilter) q += `&status=${statusFilter}`;
      const r = await api.get(`/admin/reservations${q}`);
      if (r.data?.success) setReservations(r.data.data);
    } catch { setError('Failed to fetch.'); }
    finally  { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      const r = await api.delete(`/admin/reservations/${id}`);
      if (r.data?.success) setReservations(prev => prev.map(res => res._id === id ? { ...res, status:'Cancelled' } : res));
    } catch { setError('Cancel failed.'); }
  };

  const openEdit = (res) => {
    setEditing(res); setEditDate(res.reservationDate);
    setEditTime(res.timeSlot); setEditGuests(res.numberOfGuests); setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); setEditError(''); setEditLoad(true);
    try {
      const r = await api.put(`/admin/reservations/${editing._id}`, {
        reservationDate: editDate, timeSlot: editTime, numberOfGuests: Number(editGuests),
      });
      if (r.data?.success) {
        setReservations(prev => prev.map(res => res._id === editing._id ? r.data.data : res));
        setEditing(null);
      }
    } catch (err) { setEditError(err.response?.data?.message || 'Update failed.'); }
    finally { setEditLoad(false); }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-7 animate-fade-slide-up">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
          Reservation <span className="text-gradient-blue">Log</span>
        </h1>
        <p className="text-white/35 text-sm mt-0.5">Manage all dining reservations across the platform</p>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 mb-5 animate-fade-slide-up stagger-1">
        <form onSubmit={(e) => { e.preventDefault(); fetch(); }} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Search</label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Name or email…" className="input-glass py-2 text-sm" style={{ paddingLeft:12 }} />
          </div>
          <div className="min-w-[130px]">
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Date</label>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              className="input-glass py-2 text-sm" style={{ paddingLeft:12 }} />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Status</label>
            <select value={statusFilter} onChange={e => setStatus(e.target.value)}
              className="input-glass py-2 text-sm appearance-none" style={{ paddingLeft:12, background:'rgba(255,255,255,0.04)' }}>
              <option value="" style={{ background:'#09090B' }}>All</option>
              <option value="Booked"    style={{ background:'#09090B' }}>Booked</option>
              <option value="Cancelled" style={{ background:'#09090B' }}>Cancelled</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary px-5 py-2 text-sm">Apply</button>
            <button type="button" onClick={() => { setSearch(''); setDateFilter(''); setStatus(''); }}
              className="btn-glass px-3 py-2 text-sm">↺</button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400" style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      <div className="text-xs text-white/25 mb-3">{reservations.length} results</div>

      {/* Table */}
      <div className="glass-card animate-fade-slide-up stagger-2" style={{ overflow:'hidden' }}>
        {loading ? (
          <div className="flex justify-center py-14">
            <div style={{ width:32,height:32,borderRadius:'50%',border:'2px solid rgba(59,130,246,0.15)',borderTopColor:'#3B82F6',animation:'spin360 .8s linear infinite' }} />
          </div>
        ) : reservations.length === 0 ? (
          <div className="py-14 text-center text-white/25 text-sm">No reservations match your filters</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="fx-table">
              <thead>
                <tr>
                  {['Customer','Date','Time','Guests','Table','Status','Actions'].map(h => (
                    <th key={h} style={{ textAlign:h==='Actions'?'right':'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
                          {res.userId?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">{res.userId?.name || 'Deleted'}</p>
                          <p className="text-[10px] text-white/30">{res.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm whitespace-nowrap">{res.reservationDate}</td>
                    <td className="text-sm whitespace-nowrap">{res.timeSlot}</td>
                    <td className="text-sm">{res.numberOfGuests}</td>
                    <td className="text-sm">
                      #{res.tableId?.tableNumber || '—'} <span className="text-white/25 text-[10px]">({res.tableId?.capacity || 0}s)</span>
                    </td>
                    <td>
                      <span className={`badge ${res.status === 'Booked' ? 'badge-green' : 'badge-red'}`}>
                        {res.status === 'Booked' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                        {res.status}
                      </span>
                    </td>
                    <td style={{ textAlign:'right' }}>
                      {res.status === 'Booked' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(res)} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-300 transition-all"
                            style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)' }}>
                            Edit
                          </button>
                          <button onClick={() => handleCancel(res._id)} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 transition-all"
                            style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                            Cancel
                          </button>
                        </div>
                      ) : <span className="text-white/20 text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background:'rgba(0,0,0,0.7)' }} onClick={() => setEditing(null)}>
          <div className="grad-border animate-fade-slide-up" style={{ borderRadius:24, maxWidth:400, width:'100%' }} onClick={e => e.stopPropagation()}>
            <div className="glass-card p-6" style={{ borderRadius:24 }}>
              <div style={{ height:2, marginBottom:20, borderRadius:99, background:'linear-gradient(90deg,transparent,rgba(59,130,246,0.6),rgba(139,92,246,0.4),transparent)' }} />

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>Edit Reservation</h2>
                <button onClick={() => setEditing(null)} className="text-white/30 hover:text-white/60 transition-colors">✕</button>
              </div>

              {/* Customer info */}
              <div className="mb-4 px-3 py-2.5 rounded-xl text-sm" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs text-white/30">{editing.userId?.name} · {editing.userId?.email}</p>
              </div>

              {editError && (
                <div className="mb-4 px-3 py-2.5 rounded-lg text-xs text-red-400" style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                  {editError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Date</label>
                  <input type="date" required min={new Date().toISOString().split('T')[0]} value={editDate}
                    onChange={e => setEditDate(e.target.value)} className="input-glass" style={{ paddingLeft:12 }} />
                </div>
                <div>
                  <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Time Slot</label>
                  <select required value={editTime} onChange={e => setEditTime(e.target.value)}
                    className="input-glass appearance-none" style={{ paddingLeft:12, background:'rgba(255,255,255,0.04)' }}>
                    {TIME_SLOTS.map(s => <option key={s} value={s} style={{ background:'#09090B' }}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Guests</label>
                  <input type="number" required min="1" value={editGuests} onChange={e => setEditGuests(e.target.value)}
                    className="input-glass" style={{ paddingLeft:12 }} />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setEditing(null)} className="btn-glass flex-1 py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={editLoad} className="btn-primary flex-1 py-2.5 text-sm">
                    {editLoad ? '…' : 'Save Changes'}
                  </button>
                </div>
              </form>

              <div style={{ height:2, marginTop:20, borderRadius:99, background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.3),transparent)' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReservations;
