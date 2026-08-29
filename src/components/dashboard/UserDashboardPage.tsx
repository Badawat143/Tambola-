import React, { useState } from 'react';
import { useTambola, DashboardTab } from '../../context/TambolaContext';
import { clearUserSession } from '../../services/authService';
import { UserDashboardModal } from '../modals/UserDashboardModal';
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Ticket,
  Users,
  Trophy,
  History,
  ShieldCheck,
  Headphones,
  UserCheck,
  LogOut,
  Sparkles,
  Radio,
  ArrowLeft,
  Share2,
  DollarSign,
  Percent,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface UserDashboardPageProps {
  onNavigate: (path: string) => void;
  initialTab?: DashboardTab;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ onNavigate, initialTab = 'dashboard' }) => {
  const {
    currentUser,
    userDashboardTab,
    setUserDashboardTab,
    logoutUser,
  } = useTambola();

  const handleLogout = () => {
    clearUserSession();
    logoutUser();
    onNavigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#070817] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top User Bar Header */}
      <header className="sticky top-0 z-40 bg-[#0c0d28]/95 backdrop-blur-xl border-b border-indigo-500/20 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Return */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Return to Public Homepage"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-white font-['Outfit']">
                  APNA TAMBOLA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-black uppercase">
                  PLAYER DASHBOARD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                User ID: <span className="text-amber-400 font-mono font-bold">{currentUser.id}</span> • Sponsor: <span className="text-purple-300 font-mono">{currentUser.referredBy || 'Direct SuperAdmin'}</span>
              </p>
            </div>
          </div>

          {/* Quick Wallets & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Main Balance Chip */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              <Wallet className="w-3.5 h-3.5" />
              <span>Total: ₹{currentUser.walletBalance.toLocaleString('en-IN')}</span>
            </div>

            {/* Quick Live Game Button */}
            <button
              onClick={() => onNavigate('/live')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-500/20 cursor-pointer animate-pulse"
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LIVE CALLER</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Logout from Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        <UserDashboardModal />
      </main>
    </div>
  );
};
