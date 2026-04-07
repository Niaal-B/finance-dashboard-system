import { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/client';
import { Lock, User, Mail, Loader2, CheckCircle } from 'lucide-react';

const RegisterPage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('users/register/', formData);
      setSuccess(true);
    } catch (err) {
      const d = err.response?.data;
      setError(d?.username?.[0] || d?.message || d?.email?.[0] || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight bg-mesh flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {success ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-10 text-center"
          >
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold font-outfit mb-2">Account Created!</h2>
            <p className="text-white/40 mb-8">Your account is ready. Sign in to get started.</p>
            <button onClick={onSwitchToLogin} className="btn-primary w-full py-3">
              Go to Login
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 bg-gradient-blue rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold font-outfit">Z</span>
                </div>
                <span className="text-xl font-bold font-outfit">Zorvyn</span>
              </div>
              <h1 className="text-3xl font-bold font-outfit">Create account</h1>
              <p className="text-white/40 mt-2">Start managing your finances today.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text" required
                    className="input-field input-icon"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email" required
                    className="input-field input-icon"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="password" required minLength={8}
                    className="input-field input-icon"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-white/40">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterPage;
