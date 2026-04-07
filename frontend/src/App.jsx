import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import ProfilePage from './pages/ProfilePage'
import AdminConsole from './pages/AdminConsole'
import Sidebar from './components/layout/Sidebar'
import './index.css'

const Layout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  return (
    <div className="flex h-screen bg-midnight overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto bg-midnight bg-mesh">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'transactions' && <TransactionsPage />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'admin' && <AdminConsole />}
        {activeTab === 'analytics' && (
          <div className="p-8 text-center text-white/40 mt-24">
            <p className="text-lg font-outfit">Analytics view coming soon</p>
          </div>
        )}
      </main>
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return showRegister
      ? <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
      : <LoginPage onSwitchToRegister={() => setShowRegister(true)} />;
  }

  return <Layout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
