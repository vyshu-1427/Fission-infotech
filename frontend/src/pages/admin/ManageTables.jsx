import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiCheckCircle, FiAlertCircle, FiSettings, FiEdit2, FiX } from 'react-icons/fi';
import Spinner from '../../components/Spinner.jsx';

const ManageTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Table Form State
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  // Edit Table Modal State
  const [editingTable, setEditingTable] = useState(null);
  const [editCapacity, setEditCapacity] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      if (response.data?.success) {
        setTables(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch restaurant tables.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!tableNumber || Number(tableNumber) < 1) {
      setError('Table number must be at least 1');
      return;
    }
    if (!capacity || Number(capacity) < 1) {
      setError('Capacity must be at least 1');
      return;
    }

    setAddLoading(true);
    try {
      const response = await api.post('/tables', {
        tableNumber: Number(tableNumber),
        capacity: Number(capacity),
        isActive,
      });

      if (response.data?.success) {
        setSuccess(`Table #${tableNumber} created successfully!`);
        setTableNumber('');
        setCapacity('');
        setIsActive(true);
        fetchTables(); // Refresh list
      }
    } catch (err) {
      console.error('Error creating table:', err);
      setError(err.response?.data?.message || 'Failed to create table. Table number might already exist.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleToggleActive = async (table) => {
    setError('');
    setSuccess('');
    const newActiveState = !table.isActive;

    try {
      const response = await api.put(`/tables/${table._id}`, {
        isActive: newActiveState,
      });

      if (response.data?.success) {
        setTables((prev) =>
          prev.map((t) => (t._id === table._id ? { ...t, isActive: newActiveState } : t))
        );
        setSuccess(`Table #${table.tableNumber} is now ${newActiveState ? 'active' : 'inactive'}.`);
      }
    } catch (err) {
      console.error('Error updating active state:', err);
      setError('Failed to update table status.');
    }
  };

  const handleDelete = async (id, tableNum) => {
    setError('');
    setSuccess('');

    if (!window.confirm(`Are you sure you want to delete Table #${tableNum}?`)) {
      return;
    }

    try {
      const response = await api.delete(`/tables/${id}`);
      if (response.data?.success) {
        setSuccess(`Table #${tableNum} deleted successfully.`);
        setTables((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error('Error deleting table:', err);
      setError(err.response?.data?.message || 'Failed to delete table.');
    }
  };

  // Open Edit Modal
  const openEditModal = (table) => {
    setEditingTable(table);
    setEditCapacity(table.capacity);
    setEditIsActive(table.isActive);
    setEditError('');
  };

  // Submit Edit Modal
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      const response = await api.put(`/tables/${editingTable._id}`, {
        capacity: Number(editCapacity),
        isActive: editIsActive,
      });

      if (response.data?.success) {
        setSuccess(`Table #${editingTable.tableNumber} updated successfully.`);
        setEditingTable(null);
        fetchTables(); // Refresh list
      }
    } catch (err) {
      console.error('Error updating table:', err);
      setEditError(err.response?.data?.message || 'Failed to update table details.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Tables</h1>
        <p className="text-dark-300 mt-1">Configure layout arrangements, add new seats, and control table availability states.</p>
      </div>

      {success && (
        <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-sm text-emerald-400">
          <FiCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Table Form */}
        <div>
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden sticky top-24">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-cyan-400" />
            <h2 className="text-xl font-bold text-white mb-6">Create New Table</h2>
            
            <form onSubmit={handleAddTable} className="space-y-4">
              {/* Table Number */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase mb-1.5" htmlFor="tableNumber">Table Number</label>
                <input
                  id="tableNumber"
                  type="number"
                  required
                  min="1"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. 7"
                  className="w-full px-3.5 py-2.5 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Table Capacity */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase mb-1.5" htmlFor="capacity">Capacity (Seats)</label>
                <input
                  id="capacity"
                  type="number"
                  required
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full px-3.5 py-2.5 bg-dark-900/60 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Is Active Checkbox */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-dark-200 font-medium">Activate Table</span>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className="text-2xl text-brand-400 hover:text-brand-300 transition-colors focus:outline-none cursor-pointer"
                >
                  {isActive ? <FiToggleRight className="text-brand-500 w-8 h-8" /> : <FiToggleLeft className="text-dark-400 w-8 h-8" />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={addLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {addLoading ? <Spinner size="sm" className="p-0" /> : <><FiPlus /> Add Table</>}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Floorplan Table Cards List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center p-12">
              <Spinner size="lg" />
            </div>
          ) : tables.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center border border-white/5">
              <p className="text-dark-300">No tables configured in the restaurant layout yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className={`glass-card p-6 rounded-2xl relative overflow-hidden border transition-all flex flex-col justify-between ${
                    table.isActive
                      ? 'border-brand-500/10 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5'
                      : 'border-white/5 opacity-60'
                  }`}
                >
                  {/* Table visual display */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Round visual table shape */}
                      <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg border shadow ${
                        table.isActive
                          ? 'bg-gradient-to-tr from-brand-600 to-indigo-500 border-brand-400'
                          : 'bg-dark-800 border-dark-700 text-dark-300'
                      }`}>
                        T{table.tableNumber}
                      </span>
                      <div>
                        <h3 className="font-bold text-white text-lg">Table #{table.tableNumber}</h3>
                        <p className="text-xs text-dark-300">{table.capacity} Seats capacity</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      table.isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-dark-800 text-dark-400 border border-dark-700'
                    }`}>
                      {table.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                    <button
                      onClick={() => handleToggleActive(table)}
                      title={table.isActive ? 'Deactivate table' : 'Activate table'}
                      className="text-dark-300 hover:text-white transition-colors flex items-center gap-1 text-xs cursor-pointer focus:outline-none"
                    >
                      {table.isActive ? (
                        <>
                          <FiToggleRight className="text-emerald-500 w-5 h-5" /> Active
                        </>
                      ) : (
                        <>
                          <FiToggleLeft className="text-dark-400 w-5 h-5" /> Inactive
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(table)}
                        className="p-1.5 rounded-lg text-brand-400 hover:text-brand-350 hover:bg-brand-500/10 transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(table._id, table.tableNumber)}
                        disabled={table.isActive}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          table.isActive
                            ? 'text-dark-500 cursor-not-allowed opacity-50'
                            : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                        }`}
                        title={table.isActive ? 'Make table inactive to delete' : 'Delete Table'}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editing Table Modal */}
      {editingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-scale-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Table #{editingTable.tableNumber}</h2>
              <button
                onClick={() => setEditingTable(null)}
                className="p-1 rounded-lg text-dark-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Capacity */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase mb-1">Capacity (Seats)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-900/60 border border-white/5 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Status active toggler */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-dark-200 font-medium font-semibold uppercase text-xs">Active Status</span>
                <button
                  type="button"
                  onClick={() => setEditIsActive(!editIsActive)}
                  className="text-2xl text-brand-400 hover:text-brand-300 transition-colors focus:outline-none cursor-pointer"
                >
                  {editIsActive ? <FiToggleRight className="text-brand-500 w-8 h-8" /> : <FiToggleLeft className="text-dark-400 w-8 h-8" />}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTable(null)}
                  className="w-1/2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/5 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="w-1/2 py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all shadow-lg shadow-brand-500/20 cursor-pointer flex items-center justify-center"
                >
                  {editLoading ? <Spinner size="sm" className="p-0" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTables;
