import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import TopBar from '../components/layout/TopBar';
import { User, Mail, Key, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <TopBar title="Profile" subtitle="Your account information and settings." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <GlassCard className="p-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-gradient-blue flex items-center justify-center text-3xl font-bold shadow-blue-glow mb-4"
          >
            {user?.username?.[0]?.toUpperCase()}
          </motion.div>
          <h2 className="text-lg font-bold font-outfit">{user?.username}</h2>
          <div className="mt-2"><Badge variant={user?.role?.toLowerCase()}>{user?.role}</Badge></div>
          <div className="mt-4 pt-4 border-t border-white/[0.06] w-full text-left space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Shield className="w-3.5 h-3.5" />
              <span>Access Level: <span className="font-medium text-white/70">{user?.role}</span></span>
            </div>
          </div>
        </GlassCard>

        {/* Info Card */}
        <GlassCard className="p-6 md:col-span-2 space-y-5">
          <h3 className="font-semibold font-outfit border-b border-white/[0.06] pb-4">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text" disabled value={user?.username || ''}
                  className="input-field input-icon opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" className="input-field input-icon" placeholder="Add email..." />
              </div>
            </div>
          </div>

          <button className="btn-primary text-sm">Save Changes</button>

          <div className="border-t border-white/[0.06] pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Change Password</h4>
                <p className="text-xs text-white/40 mt-0.5">Update your password to keep secure</p>
              </div>
              <button className="btn-ghost text-sm gap-2">
                <Key className="w-3.5 h-3.5" />
                Update
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;
