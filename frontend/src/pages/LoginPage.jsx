import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Loader2, TrendingUp, Shield, Zap, ChevronRight } from 'lucide-react';

const DEMO_USERS = [
  {
    username: 'admin_demo',
    password: 'Admin@1234',
    role: 'Admin',
    description: 'Full access — manage users, records & analytics',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/30',
    badge: 'bg-violet-500/20 text-violet-300',
    dot: 'bg-violet-400',
  },
  {
    username: 'analyst_demo',
    password: 'Analyst@1234',
    role: 'Analyst',
    description: 'Can create & edit records, view all analytics',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300',
    dot: 'bg-blue-400',
  },
  {
    username: 'viewer_demo',
    password: 'Viewer@1234',
    role: 'Viewer',
    description: 'Read-only access to dashboard & records',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300',
    dot: 'bg-emerald-400',
  },
];

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-blue-300" />
    </div>
    <div>
      <p className="font-medium text-white/80 text-sm">{title}</p>
      <p className="text-xs text-white/40 mt-0.5">{desc}</p>
    </div>
  </div>
);

const DemoUserCard = ({ user, onSelect, isSelected }) => (
  <motion.button
    type="button"
    onClick={() => onSelect(user)}
    whileHover={{ scale: 1.02, y: -1 }}
    whileTap={{ scale: 0.98 }}
    className={`
      w-full text-left p-3 rounded-xl border bg-gradient-to-r transition-all duration-200
      ${user.color} ${user.border}
      ${isSelected ? 'ring-1 ring-white/20 shadow-lg shadow-black/20' : 'hover:border-white/20'}
    `}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full ${user.dot} flex-shrink-0`} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{user.username}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${user.badge}`}>
              {user.role}
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5">{user.description}</p>
        </div>
      </div>
      <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${isSelected ? 'text-white/60' : 'text-white/20'}`} />
    </div>
    {isSelected && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-white/50"
      >
        <Lock className="w-3 h-3" />
        <span>Password: <span className="text-white/70 font-mono">{user.password}</span></span>
        <span className="ml-auto text-white/30">↑ filled above</span>
      </motion.div>
    )}
  </motion.button>
);

const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemo, setSelectedDemo] = useState(null);

  const handleDemoSelect = (user) => {
    setSelectedDemo(user.username);
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight bg-mesh flex">
      {/* Left: Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-gradient-blue rounded-xl flex items-center justify-center shadow-blue-glow">
              <span className="text-white font-bold font-outfit text-lg">Z</span>
            </div>
            <span className="text-2xl font-bold font-outfit">Zorvyn</span>
          </div>

          <h2 className="text-5xl font-bold font-outfit leading-tight mb-6">
            Your finances,<br />
            <span className="text-gradient">beautifully clear.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            A professional-grade financial dashboard built for clarity, security, and insight.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <Feature icon={Shield} title="Role-Based Access Control" desc="Granular permissions for your whole team" />
          <Feature icon={TrendingUp} title="Real-time Analytics" desc="Live dashboards powered by server aggregations" />
          <Feature icon={Zap} title="Stateless JWT Auth" desc="Fast, secure, and sessionless authentication" />
        </div>
      </motion.div>

      {/* Right: Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-outfit">Welcome back</h1>
            <p className="text-white/40 mt-2">Sign in to your account</p>
          </div>

          {/* Demo Users Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-widest px-2">
                Demo Accounts
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="space-y-2">
              {DEMO_USERS.map((u) => (
                <DemoUserCard
                  key={u.username}
                  user={u}
                  onSelect={handleDemoSelect}
                  isSelected={selectedDemo === u.username}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 mb-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-widest px-2">
                Or sign in manually
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  required
                  className="input-field input-icon"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setSelectedDemo(null); }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  required
                  className="input-field input-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setSelectedDemo(null); }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 py-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-white/40">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Register here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
