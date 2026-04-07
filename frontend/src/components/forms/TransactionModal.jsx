import { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../api/client';
import { X, Loader2 } from 'lucide-react';

const CATEGORIES = ['SALARY', 'FREELANCE', 'FOOD', 'TRANSPORT', 'UTILITIES', 'ENTERTAINMENT', 'SHOPPING', 'HEALTH', 'EDUCATION', 'OTHER'];

const TransactionModal = ({ onClose, onSuccess, initialData }) => {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    record_type: initialData?.record_type || 'EXPENSE',
    category: initialData?.category || 'FOOD',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await apiClient.put(`finance/records/${initialData.id}/`, formData);
      } else {
        await apiClient.post('finance/records/', formData);
      }
      onSuccess();
    } catch (err) {
      const d = err.response?.data;
      setError(d?.message || d?.amount?.[0] || d?.date?.[0] || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-outfit">
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.04] rounded-xl">
            {['EXPENSE', 'INCOME'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, record_type: type })}
                className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.record_type === type
                    ? type === 'INCOME'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Amount ($)</label>
              <input
                type="number" step="0.01" min="0.01" required
                className="input-field text-lg font-bold font-outfit"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Date</label>
              <input
                type="date" required
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Category</label>
            <select
              className="input-field"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Description <span className="text-white/20">(optional)</span></label>
            <input
              type="text"
              className="input-field"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TransactionModal;
