import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Clock, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import apiClient from '../api/client';
import StatCard from '../components/ui/StatCard';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import TopBar from '../components/layout/TopBar';
import { SkeletonCard, SkeletonRow } from '../components/ui/Skeleton';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, r] = await Promise.all([
          apiClient.get('analytics/dashboard/summary/'),
          apiClient.get('analytics/dashboard/recent-activity/'),
        ]);
        setSummary(s.data);
        // recent-activity is a list endpoint so pagination wraps it in { results: [...] }
        setRecent(Array.isArray(r.data) ? r.data : (r.data.results ?? []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build area chart data from recent
  const areaData = recent.slice(0, 10).reverse().map((item, i) => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: parseFloat(item.amount),
    type: item.record_type,
  }));

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <TopBar title="Dashboard" subtitle="Your financial overview at a glance." />

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
          <StatCard label="Total Income" value={summary?.total_income} icon={TrendingUp} color="emerald" delay={0} />
          <StatCard label="Total Expenses" value={summary?.total_expenses} icon={TrendingDown} color="red" delay={0.08} />
          <StatCard label="Net Balance" value={summary?.net_balance} icon={Wallet} color="blue" delay={0.16} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold font-outfit">Transaction Flow</h3>
              <p className="text-xs text-white/40 mt-0.5">Last 10 transactions</p>
            </div>
          </div>
          {loading ? (
            <div className="h-48 bg-white/[0.03] rounded-xl animate-pulse" />
          ) : areaData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-white/30">
              <TrendingUp className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">Add transactions to see the chart</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                  formatter={(v) => [`$${parseFloat(v).toLocaleString()}`, 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* Donut Chart */}
        <GlassCard className="p-6">
          <h3 className="font-semibold font-outfit mb-6">By Category</h3>
          {loading ? (
            <div className="h-48 bg-white/[0.03] rounded-xl animate-pulse" />
          ) : !summary?.category_breakdown?.length ? (
            <div className="h-48 flex flex-col items-center justify-center text-white/30">
              <p className="text-sm">No data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={summary.category_breakdown} dataKey="total" nameKey="category" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {summary.category_breakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                    formatter={(v) => [`$${parseFloat(v).toLocaleString()}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {summary.category_breakdown.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-white/60 capitalize">{item.category.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="font-medium">${parseFloat(item.total).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="mt-6 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            <h3 className="font-semibold font-outfit">Recent Activity</h3>
          </div>
          <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="divide-y divide-white/[0.05]">
            {[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="py-12 text-center">
            <Clock className="w-10 h-10 mx-auto text-white/20 mb-3" />
            <p className="text-sm text-white/40">No transactions yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/[0.05]">
                <th className="pb-3 text-left font-medium">Type</th>
                <th className="pb-3 text-left font-medium">Details</th>
                <th className="pb-3 text-left font-medium hidden sm:table-cell">Date</th>
                <th className="pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recent.slice(0, 6).map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 pr-4">
                    <Badge variant={item.record_type.toLowerCase()}>
                      {item.record_type === 'INCOME' ? '↑' : '↓'} {item.record_type}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-sm font-medium capitalize">{item.category.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-white/40 truncate max-w-[180px]">{item.description || '—'}</p>
                  </td>
                  <td className="py-3 pr-4 text-sm text-white/40 hidden sm:table-cell">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className={`py-3 text-right font-semibold text-sm ${item.record_type === 'INCOME' ? 'text-emerald-400' : 'text-white/70'}`}>
                    {item.record_type === 'INCOME' ? '+' : '-'}${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
};

export default DashboardPage;
