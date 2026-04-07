import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Receipt, PieChart, User, Shield, LogOut, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import Badge from '../ui/Badge';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'profile', label: 'Profile', icon: User },
  ];
  if (user?.role === 'ADMIN') {
    menuItems.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass border-r border-white/[0.06] h-screen sticky top-0 flex flex-col flex-shrink-0 overflow-hidden z-10"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="flex-shrink-0 w-9 h-9 bg-gradient-blue rounded-xl flex items-center justify-center shadow-blue-glow/50">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold font-outfit whitespace-nowrap"
            >
              Zorvyn
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'text-white bg-blue-500/10 border border-blue-500/20'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <item.icon className={clsx('w-5 h-5 flex-shrink-0', active ? 'text-blue-400' : '')} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User + collapse */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <div className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03]', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-gradient-blue flex-shrink-0 flex items-center justify-center text-sm font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <Badge variant={user?.role?.toLowerCase()}>{user?.role}</Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
