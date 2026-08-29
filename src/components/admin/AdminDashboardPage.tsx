import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { clearAdminSession, getAdminSession } from '../../services/authService';
import { AdminPanelModal } from '../modals/AdminPanelModal';
import { ErrorBoundary } from '../ErrorBoundary';
import {
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Users,
  Radio,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { allUsers, upcomingGames, liveCalledNumbers, isGameCalling } = useTambola();
  const adminSession = getAdminSession();
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleAdminLogout = () => {
    clearAdminSession();
    onNavigate('/admin/login');
  };

  const handleRetry = () => {
    setLoadError(null);
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#05060f] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          ⚠️ Unable to Load Admin Suite
        </h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          {loadError || 'An error occurred while loading the Super Admin Suite. Please retry or re-login.'}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            RETRY
          </button>
          <button
            onClick={() => onNavigate('/admin/login')}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Admin Suite encountered an error" onReset={handleRetry}>
      <div className="min-h-screen bg-[#05060f] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Main Admin 23-Module Panel */}
        <main className="flex-1 w-full flex flex-col p-2 sm:p-4">
          <AdminPanelModal isPageMode={true} onNavigate={onNavigate} />
        </main>
      </div>
    </ErrorBoundary>
  );
};
