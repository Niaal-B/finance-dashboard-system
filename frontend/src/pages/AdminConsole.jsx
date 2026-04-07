import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import { Shield, ShieldAlert, CheckCircle, Users } from 'lucide-react';

const AdminConsole = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await apiClient.get('users/');
      setUsers(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiClient.patch(`users/${userId}/role/`, { role: newRole });
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update role');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500/50 mb-4" />
        <h1 className="text-3xl font-outfit font-bold text-red-400">Access Denied</h1>
        <p className="text-secondary mt-2">You do not have the required permissions to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-fade">
      <header>
        <h1 className="text-4xl font-outfit font-bold">Admin Console</h1>
        <p className="text-secondary mt-1">Manage system configurations and user roles.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6 md:col-span-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Total Users</p>
              <h3 className="text-2xl font-bold font-outfit">{users.length}</h3>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 md:col-span-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">System Status</p>
              <h3 className="text-xl font-bold font-outfit text-emerald-400">Online</h3>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-xl font-bold font-outfit mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-secondary" />
          Role Management
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-secondary text-xs uppercase tracking-wider border-b border-glass-border">
                <th className="pb-4 font-semibold px-4">User ID</th>
                <th className="pb-4 font-semibold px-4">Username</th>
                <th className="pb-4 font-semibold px-4">Current Role</th>
                <th className="pb-4 font-semibold px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-secondary">Loading users...</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-smooth group">
                    <td className="py-4 px-4 text-sm text-secondary">#{u.id}</td>
                    <td className="py-4 px-4 font-medium">{u.username}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                        u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' :
                        u.role === 'ANALYST' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <select 
                        value={u.role}
                        className="bg-charcoal border border-glass-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500/50 text-sm"
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={u.username === user.username}
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="ANALYST">Analyst</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminConsole;
