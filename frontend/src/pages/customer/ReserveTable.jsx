import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import Spinner from '../../components/Spinner.jsx';

const TIME_SLOTS = ['12:00 PM','1:00 PM','2:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'];

const FieldIcon = ({ children }) => (
  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400/50 z-10">
    {children}
  </span>
);

const ReserveTable = () => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate]               = useState('');
  const [timeSlot, setTimeSlot]       = useState('');
  const [guests, setGuests]           = useState(2);
  const [tables, setTables]           = useState([]);
  const [selectedTable, setSelected]  = useState(null);
  const [tablesLoading, setTL]        = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [successData, setSuccess]     = useState(null);

  useEffect(() => {
    if (date && timeSlot) fetchAvailability();
    else { setTables([]); setSelected(null); }
  }, [date, timeSlot]);

  const fetchAvailability = async () => {
    setTL(true); setError('');
    try {
      const r = await api.get(`/tables/availability?date=${date}&timeSlot=${timeSlot}`);
      if (r.data?.success) setTables(r.data.data);
    } catch { setError('Could not load table availability.'); }
    finally  { setTL(false); }
  };

  const handleTableClick = (t) => {
    if (t.isBooked) { setError(`Table #${t.tableNumber} is already booked.`); return; }
    setError(''); setSelected(t); setGuests(t.capacity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(null);
    if (!date)        return setError('Select a date.');
    if (date < today) return setError('Date cannot be in the past.');
    if (!timeSlot)    return setError('Select a time slot.');
    setLoading(true);
    try {
      const r = await api.post('/reservations', {
        reservationDate: date, timeSlot, numberOfGuests: Number(guests),
        tableId: selectedTable?._id || null,
      });
      if (r.data?.success) { setSuccess(r.data.data); if (date && timeSlot) fetchAvailability(); }
    } catch (err) { setError(err.response?.data?.message || 'Booking failed. Try another slot.'); }
    finally { setLoading(false); }
  };

  // ── Success ─────────────────────────────────────────────────────
  if (successData) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="grad-border animate-fade-slide-up" style={{ borderRadius:24, maxWidth:440, width:'100%' }}>
        <div className="glass-card p-8 text-center" style={{ borderRadius:24 }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-pulse-ring"
            style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.2),rgba(6,182,212,0.1))', border:'1px solid rgba(34,197,94,0.3)', boxShadow:'0 0 30px rgba(34,197,94,0.2)' }}>
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily:'Syne,sans-serif' }}>Confirmed!</h2>
          <p className="text-white/40 text-sm mb-6">Your reservation has been secured.</p>

          <div className="rounded-xl p-5 mb-6 text-left space-y-3" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
            {[
              ['Table', `#${successData.tableId?.tableNumber} · ${successData.tableId?.capacity} seats`],
              ['Date',  successData.reservationDate],
              ['Time',  successData.timeSlot],
              ['Party', `${successData.numberOfGuests} guests`],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-white/35">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Link to="/reservations" className="btn-primary flex-1 py-3">My Bookings</Link>
            <button onClick={() => { setSuccess(null); setDate(''); setTimeSlot(''); setGuests(2); setSelected(null); }}
              className="btn-glass flex-1 py-3">Book Again</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Booking form ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-7 animate-fade-slide-up">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors mb-4 uppercase tracking-wider">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
          Reserve a <span className="text-gradient-blue">Table</span>
        </h1>
        <p className="text-white/35 text-sm mt-1">Choose your date, time, and table from the live floor plan.</p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 flex items-center gap-2 animate-fade-slide-up"
          style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6 animate-fade-slide-up stagger-1">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">Booking Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="relative">
                <FieldIcon>📅</FieldIcon>
                <input type="date" required min={today} value={date} onChange={e => setDate(e.target.value)} className="input-glass" />
              </div>

              <div className="relative">
                <FieldIcon>🕐</FieldIcon>
                <select required value={timeSlot} onChange={e => setTimeSlot(e.target.value)}
                  className="input-glass appearance-none"
                  style={{ background:'rgba(255,255,255,0.04)', color: timeSlot ? '#F8FAFC' : 'rgba(255,255,255,0.25)' }}>
                  <option value="" style={{ background:'#09090B' }}>Select time slot</option>
                  {TIME_SLOTS.map(s => <option key={s} value={s} style={{ background:'#09090B' }}>{s}</option>)}
                </select>
              </div>

              <div className="relative">
                <FieldIcon>👥</FieldIcon>
                <input type="number" required min="1" value={guests} onChange={e => setGuests(e.target.value)} className="input-glass" />
              </div>

              {selectedTable && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
                  style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)' }}>
                  <span className="text-blue-300">Table #{selectedTable.tableNumber} · {selectedTable.capacity} seats</span>
                  <button type="button" onClick={() => setSelected(null)} className="text-white/30 hover:text-white/60 transition-colors text-xs">Clear</button>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? <div style={{ width:16,height:16,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'white',animation:'spin360 .8s linear infinite' }} /> : 'Confirm Reservation ✦'}
              </button>
            </form>
          </div>

          {/* Legend */}
          <div className="glass-panel p-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Legend</p>
            <div className="space-y-2">
              {[
                ['rgba(255,255,255,0.15)', 'Vacant'],
                ['rgba(59,130,246,0.5)',   'Selected'],
                ['rgba(34,197,94,0.4)',    'Booked'],
              ].map(([c, l]) => (
                <div key={l} className="flex items-center gap-2.5 text-xs text-white/40">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ background:c, border:`1px solid ${c}` }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floor plan */}
        <div className="lg:col-span-3 glass-card p-6 animate-fade-slide-up stagger-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">Floor Plan</h2>
            {(date && timeSlot) && (
              <span className="badge badge-blue animate-pulse-ring">Live</span>
            )}
          </div>

          {tablesLoading ? (
            <div className="flex justify-center py-16">
              <div style={{ width:32,height:32,borderRadius:'50%',border:'2px solid rgba(59,130,246,0.15)',borderTopColor:'#3B82F6',animation:'spin360 .8s linear infinite' }} />
            </div>
          ) : (!date || !timeSlot) ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3 opacity-30">🗓️</div>
              <p className="text-white/25 text-sm">Select date & time to see available tables</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tables.map((t) => {
                const isSel = selectedTable?._id === t._id;
                let bg, border, glow, txt;
                if (t.isBooked) { bg='rgba(34,197,94,0.08)'; border='rgba(34,197,94,0.25)'; glow='none'; txt='#4ade80'; }
                else if (isSel) { bg='rgba(59,130,246,0.12)'; border='rgba(59,130,246,0.5)'; glow='0 0 20px rgba(59,130,246,0.2)'; txt='#60A5FA'; }
                else            { bg='rgba(255,255,255,0.04)'; border='rgba(255,255,255,0.08)'; glow='none'; txt='rgba(255,255,255,0.6)'; }

                return (
                  <div key={t._id} onClick={() => handleTableClick(t)}
                    className="relative rounded-2xl p-4 text-center transition-all duration-200 select-none"
                    style={{ background:bg, border:`1px solid ${border}`, boxShadow:glow,
                      cursor: t.isBooked ? 'not-allowed' : 'pointer', opacity: t.isBooked ? 0.7 : 1 }}>
                    {/* Table circle */}
                    <div className="w-10 h-10 rounded-full mx-auto mb-2.5 flex items-center justify-center text-xs font-bold"
                      style={{ background:bg, border:`2px solid ${border}`, color:txt, boxShadow: isSel ? '0 0 12px rgba(59,130,246,0.4)' : 'none' }}>
                      T{t.tableNumber}
                    </div>
                    <p className="text-xs font-semibold" style={{ color:txt }}>Table #{t.tableNumber}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{t.capacity} seats</p>
                    <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background:`${isSel?'rgba(59,130,246,0.15)':t.isBooked?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.05)'}`, color:txt }}>
                      {t.isBooked ? 'Booked' : isSel ? 'Selected' : 'Vacant'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReserveTable;
