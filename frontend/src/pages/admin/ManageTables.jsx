import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';

const ManageTables = () => {
  const [tables,      setTables]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [capacity,    setCapacity]    = useState('');
  const [isActive,    setIsActive]    = useState(true);
  const [addLoading,  setAddLoading]  = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [editCap,     setEditCap]     = useState('');
  const [editActive,  setEditActive]  = useState(true);
  const [editLoad,    setEditLoad]    = useState(false);
  const [editError,   setEditError]   = useState('');

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    try {
      const r = await api.get('/tables');
      if (r.data?.success) setTables(r.data.data);
    } catch { setError('Failed to fetch tables.'); }
    finally  { setLoading(false); }
  };

  const toast = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); };

  const handleAdd = async (e) => {
    e.preventDefault(); setError('');
    if (!tableNumber || Number(tableNumber) < 1) return setError('Table number must be ≥ 1.');
    if (!capacity    || Number(capacity)    < 1) return setError('Capacity must be ≥ 1.');
    setAddLoading(true);
    try {
      const r = await api.post('/tables', { tableNumber: Number(tableNumber), capacity: Number(capacity), isActive });
      if (r.data?.success) { toast(`Table #${tableNumber} created.`); setTableNumber(''); setCapacity(''); setIsActive(true); fetchTables(); }
    } catch (err) { setError(err.response?.data?.message || 'Create failed.'); }
    finally { setAddLoading(false); }
  };

  const handleToggle = async (t) => {
    const ns = !t.isActive;
    try {
      const r = await api.put(`/tables/${t._id}`, { isActive: ns });
      if (r.data?.success) { setTables(prev => prev.map(x => x._id === t._id ? { ...x, isActive:ns } : x)); toast(`Table #${t.tableNumber} ${ns?'activated':'deactivated'}.`); }
    } catch { setError('Status update failed.'); }
  };

  const handleDelete = async (id, num) => {
    if (!window.confirm(`Delete Table #${num}?`)) return;
    try {
      const r = await api.delete(`/tables/${id}`);
      if (r.data?.success) { toast(`Table #${num} deleted.`); setTables(prev => prev.filter(t => t._id !== id)); }
    } catch (err) { setError(err.response?.data?.message || 'Delete failed.'); }
  };

  const openEdit = (t) => { setEditing(t); setEditCap(t.capacity); setEditActive(t.isActive); setEditError(''); };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); setEditError(''); setEditLoad(true);
    try {
      const r = await api.put(`/tables/${editing._id}`, { capacity: Number(editCap), isActive: editActive });
      if (r.data?.success) { toast(`Table #${editing.tableNumber} updated.`); setEditing(null); fetchTables(); }
    } catch (err) { setEditError(err.response?.data?.message || 'Update failed.'); }
    finally { setEditLoad(false); }
  };

  const Toggle = ({ checked, onChange }) => (
    <button type="button" onClick={onChange}
      className="relative rounded-full transition-all duration-200 shrink-0"
      style={{ width:36, height:20, background: checked ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.1)', boxShadow: checked ? '0 0 10px rgba(59,130,246,0.4)' : 'none' }}>
      <span className="absolute top-0.5 rounded-full bg-white shadow transition-all duration-200"
        style={{ width:16, height:16, left: checked ? '18px' : '2px' }} />
    </button>
  );

  const active   = tables.filter(t => t.isActive).length;
  const inactive = tables.length - active;

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-7 animate-fade-slide-up">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
          Table <span className="text-gradient-blue">Manager</span>
        </h1>
        <p className="text-white/35 text-sm mt-0.5">Configure seating, capacities, and availability</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label:'Total',    value:tables.length, color:'#3B82F6' },
          { label:'Active',   value:active,         color:'#06B6D4' },
          { label:'Inactive', value:inactive,        color:'rgba(255,255,255,0.3)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-panel p-4 text-center animate-fade-slide-up">
            <p className="text-2xl font-bold mb-1" style={{ fontFamily:'Syne,sans-serif', color }}>{value}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">{label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {success && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-green-400 animate-fade-slide-up" style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)' }}>✓ {success}</div>}
      {error   && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400 animate-fade-slide-up"   style={{ background:'rgba(239,68,68,0.08)',   border:'1px solid rgba(239,68,68,0.2)'   }}>⚠ {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Add form */}
        <div className="lg:col-span-3">
          <div className="glass-card overflow-hidden sticky top-24 animate-fade-slide-up stagger-1">
            <div className="px-5 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-sm font-semibold text-white" style={{ fontFamily:'Syne,sans-serif' }}>Add New Table</h2>
            </div>
            <div className="p-5">
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Table Number</label>
                  <input type="number" required min="1" value={tableNumber} onChange={e => setTableNumber(e.target.value)}
                    placeholder="e.g. 7" className="input-glass" style={{ paddingLeft:12 }} />
                </div>
                <div>
                  <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Capacity</label>
                  <input type="number" required min="1" value={capacity} onChange={e => setCapacity(e.target.value)}
                    placeholder="e.g. 4" className="input-glass" style={{ paddingLeft:12 }} />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-white/50">Activate table</span>
                  <Toggle checked={isActive} onChange={() => setIsActive(!isActive)} />
                </div>
                <button type="submit" disabled={addLoading} className="btn-primary w-full py-2.5 text-sm">
                  {addLoading ? '…' : '+ Add Table'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Table grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="flex justify-center py-16">
              <div style={{ width:32,height:32,borderRadius:'50%',border:'2px solid rgba(59,130,246,0.15)',borderTopColor:'#3B82F6',animation:'spin360 .8s linear infinite' }} />
            </div>
          ) : tables.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3 opacity-25">🪑</div>
              <p className="text-white/25 text-sm">No tables configured yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {tables.map(t => (
                <div key={t._id} className={`glass-card p-5 transition-all duration-200 animate-fade-slide-up ${!t.isActive ? 'opacity-50' : ''}`}>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: t.isActive ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.06)', boxShadow: t.isActive ? '0 0 12px rgba(59,130,246,0.3)' : 'none' }}>
                      T{t.tableNumber}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white" style={{ fontFamily:'Syne,sans-serif' }}>Table #{t.tableNumber}</p>
                      <p className="text-[11px] text-white/35">{t.capacity} seats</p>
                    </div>
                    <span className={`ml-auto badge ${t.isActive ? 'badge-green' : ''}`}
                      style={!t.isActive ? { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.3)', fontSize:10, padding:'2px 8px', borderRadius:99, fontWeight:600, letterSpacing:'0.04em' } : {}}>
                      {t.isActive ? '● Active' : '○ Off'}
                    </span>
                  </div>

                  {/* Capacity bar */}
                  <div className="mb-4" style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:99 }}>
                    <div style={{ height:'100%', borderRadius:99, width:`${Math.min(t.capacity*10,100)}%`,
                      background: t.isActive ? 'linear-gradient(90deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.1)',
                      boxShadow: t.isActive ? '0 0 6px rgba(59,130,246,0.5)' : 'none' }} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => handleToggle(t)} className="text-xs font-semibold transition-colors"
                      style={{ color: t.isActive ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                      {t.isActive ? '● Active' : '○ Inactive'}
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(t)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                        style={{ background:'rgba(59,130,246,0.1)', color:'#60A5FA' }}>✎</button>
                      <button onClick={() => handleDelete(t._id, t.tableNumber)} disabled={t.isActive}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                        style={{ background: t.isActive ? 'rgba(255,255,255,0.03)' : 'rgba(239,68,68,0.1)', color: t.isActive ? 'rgba(255,255,255,0.15)' : '#f87171', cursor: t.isActive ? 'not-allowed' : 'pointer' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background:'rgba(0,0,0,0.7)' }} onClick={() => setEditing(null)}>
          <div className="grad-border animate-fade-slide-up" style={{ borderRadius:24, maxWidth:360, width:'100%' }} onClick={e => e.stopPropagation()}>
            <div className="glass-card p-6" style={{ borderRadius:24 }}>
              <div style={{ height:2, marginBottom:20, borderRadius:99, background:'linear-gradient(90deg,transparent,rgba(59,130,246,0.6),rgba(139,92,246,0.4),transparent)' }} />
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>Edit Table #{editing.tableNumber}</h2>
                <button onClick={() => setEditing(null)} className="text-white/30 hover:text-white/60 transition-colors">✕</button>
              </div>
              {editError && <div className="mb-4 px-3 py-2 rounded-lg text-xs text-red-400" style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>{editError}</div>}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Capacity</label>
                  <input type="number" required min="1" value={editCap} onChange={e => setEditCap(e.target.value)}
                    className="input-glass" style={{ paddingLeft:12 }} />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-white/50">Active</span>
                  <Toggle checked={editActive} onChange={() => setEditActive(!editActive)} />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setEditing(null)} className="btn-glass flex-1 py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={editLoad} className="btn-primary flex-1 py-2.5 text-sm">
                    {editLoad ? '…' : 'Save'}
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

export default ManageTables;
