import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import TopBar from '../components/layout/TopBar';
import TransactionModal from '../components/forms/TransactionModal';
import { SkeletonRow } from '../components/ui/Skeleton';
import { Plus, Search, ArrowUpRight, ArrowDownRight, Edit2, Trash2, SlidersHorizontal, Shield } from 'lucide-react';

const TransactionsPage = () => {
  const { user } = useAuth();
  const canWrite = user?.role === 'ANALYST' || user?.role === 'ADMIN';
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.append('record_type', typeFilter);
      const res = await apiClient.get(`finance/records/?${params.toString()}`);
      setTransactions(Array.isArray(res.data) ? res.data : (res.data.results ?? []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [typeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await apiClient.delete(`finance/records/${id}/`);
      fetchTransactions();
    } catch (err) { console.error(err); }
  };

  const handleOpenModal = (record = null) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const filtered = transactions.filter(t =>
    (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <TopBar title="Transaction Vault" subtitle="Full history of your financial records." />
        {canWrite && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenModal()}
            className="btn-primary flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </motion.button>
        )}
      </div>

      {!canWrite && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/40 flex items-center gap-2">
          <Shield className="w-4 h-4 flex-shrink-0 text-white/30" />
          You have read-only access. Contact an Admin to get Analyst permissions.
        </div>
      )}

      <GlassCard animate={false} className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by category or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field input-icon py-2.5 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-white/30 flex-shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field py-2.5 text-sm pr-8"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 divide-y divide-white/[0.05]">
              {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Search className="w-10 h-10 mx-auto text-white/20 mb-3" />
              <p className="font-medium text-white/50">No records found</p>
              <p className="text-sm text-white/30 mt-1">Try adjusting filters or add a new record</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/[0.05]">
                  <th className="px-6 py-3 text-left font-medium">Type</th>
                  <th className="px-6 py-3 text-left font-medium">Details</th>
                  <th className="px-6 py-3 text-left font-medium hidden md:table-cell">Date</th>
                  <th className="px-6 py-3 text-right font-medium">Amount</th>
                  <th className="px-6 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <AnimatePresence>
                  {filtered.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          item.record_type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {item.record_type === 'INCOME'
                            ? <ArrowUpRight className="w-4 h-4" />
                            : <ArrowDownRight className="w-4 h-4" />
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium capitalize">{item.category.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-white/40 mt-0.5 max-w-[200px] truncate">{item.description || '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/40 hidden md:table-cell">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold text-sm ${
                        item.record_type === 'INCOME' ? 'text-emerald-400' : 'text-white/70'
                      }`}>
                        {item.record_type === 'INCOME' ? '+' : '-'}${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        {canWrite && (
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      <AnimatePresence>
        {modalOpen && (
          <TransactionModal
            onClose={() => setModalOpen(false)}
            onSuccess={() => { setModalOpen(false); fetchTransactions(); }}
            initialData={editingRecord}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsPage;
