import React from 'react';
import { useTambola } from '../../context/TambolaContext';
import { clearAdminSession, getAdminSession } from '../../services/authService';
import { AdminPanelModal } from '../modals/AdminPanelModal';
import {
  ShieldAlert,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Activity,
  Server,
  LockKeyhole,
  Users,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { allUsers, upcomingGames, liveCalledNumbers, isGameCalling } = useTambola();
  const adminSession = getAdminSession();

  const handleAdminLogout = () => {
    clearAdminSession();
    onNavigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#05060f] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Executive Admin Bar Header */}
      <header className="sticky top-0 z-40 bg-[#090b1c]/95 backdrop-blur-xl border-b border-amber-500/30 px-4 sm:px-6 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Executive Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="p-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-amber-400 hover:text-white border border-amber-500/30 transition-colors cursor-pointer"
              title="Return to Public Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-white font-['Outfit']">
                  APNA TAMBOLA ADMIN PANEL
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  SUPER ADMIN SUITE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-2">
                <span>Authenticated Operator: <strong className="text-white font-mono">{adminSession?.admin?.name || 'Master Super Admin'}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  RNG Server Live
                </span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Players Metric */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs font-bold font-mono">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{allUsers.length} Players Registered</span>
            </div>

            {/* Live Caller Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs font-bold font-mono">
              <Radio className={`w-3.5 h-3.5 ${isGameCalling ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
              <span>{liveCalledNumbers.length}/90 Numbers Called</span>
            </div>

            {/* Admin Logout Button */}
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Terminate Admin Session"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>ADMIN LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin 23-Module Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        <AdminPanelModal />
      </main>
    </div>
  );
};
