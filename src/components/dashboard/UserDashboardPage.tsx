import React, { useState, useEffect } from 'react';
import { useTambola, DashboardTab } from '../../context/TambolaContext';
import { clearUserSession, getUserSession } from '../../services/authService';
import { UserDashboardModal } from '../modals/UserDashboardModal';
import { ErrorBoundary } from '../ErrorBoundary';
import {
  Wallet,
  LogOut,
  ArrowLeft,
  Radio,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
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
    authState,
  } = useTambola();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Safety check session
    const session = getUserSession();
    if (!session && !currentUser) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleLogout = () => {
    clearUserSession();
    logoutUser();
    onNavigate('/login');
  };

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Safe fallback user data so nothing crashes
  const safeUser = currentUser || {
    id: 'USR-101',
    name: 'Player',
    walletBalance: 0,
    depositWallet: 0,
    ticketWallet: 0,
    winningWallet: 0,
    referralCode: 'APNA100',
    referredBy: 'Direct Admin',
    role: 'user',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070817] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px] mb-6 shadow-2xl shadow-pink-500/30 animate-spin">
          <div className="w-full h-full bg-[#080a1c] rounded-[14px] flex items-center justify-center font-black text-amber-400 text-xl">
            🎱
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mb-2">
          APNA TAMBOLA
        </h2>
        <p className="text-slate-400 text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#070817] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 shadow-xl">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          ⚠️ Unable to Load Dashboard
        </h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          {loadError || 'An error occurred while loading your player dashboard. Please try again.'}
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
            onClick={() => onNavigate('/')}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Player Dashboard encountered an error" onReset={handleRetry}>
      <div className="min-h-screen bg-[#070817] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Main Dashboard Content Layout with embedded UserDashboardModal */}
        <main className="flex-1 w-full flex flex-col p-2 sm:p-4">
          <UserDashboardModal isPageMode={true} onNavigate={onNavigate} />
        </main>
      </div>
    </ErrorBoundary>
  );
};
