/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TambolaProvider, useTambola } from './context/TambolaContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LiveGameCard } from './components/LiveGameCard';
import { TambolaTicketSection } from './components/TambolaTicketSection';
import { PrizeSection } from './components/PrizeSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ReferralSection } from './components/ReferralSection';
import { WhyApnaTambola } from './components/WhyApnaTambola';
import { WinnersSection } from './components/WinnersSection';
import { UpcomingGamesSection } from './components/UpcomingGamesSection';
import { MobileAppSection } from './components/MobileAppSection';
import { Footer } from './components/Footer';
import { ModalManager } from './components/modals/ModalManager';

import { ErrorBoundary } from './components/ErrorBoundary';

// Dedicated Auth & Page Components
import { UserRegisterPage } from './components/auth/UserRegisterPage';
import { UserLoginPage } from './components/auth/UserLoginPage';
import { UserForgotPasswordPage } from './components/auth/UserForgotPasswordPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { AdminRegisterBlocker } from './components/auth/AdminRegisterBlocker';
import { AccessDeniedPage } from './components/auth/AccessDeniedPage';
import { UserDashboardPage } from './components/dashboard/UserDashboardPage';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { getAdminSession, getUserSession, clearUserSession, clearAdminSession, captureReferralCodeFromUrl } from './services/authService';

import { LoadingScreen } from './components/LoadingScreen';

import {
  Sparkles,
  Ticket,
  PlayCircle,
  Users,
  AlertTriangle,
  Radio,
  Flame,
  Shield,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { settings, setActiveModal, setSelectedGameForPurchase, upcomingGames, openUserDashboard, authState, currentUser } = useTambola();

  // URL Path State - Directs to /register if arriving via referral link
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '/';
      const params = new URLSearchParams(window.location.search);
      const ref =
        params.get('ref') ||
        params.get('referral') ||
        params.get('r') ||
        params.get('sponsor') ||
        params.get('code') ||
        params.get('refcode') ||
        params.get('refCode') ||
        params.get('referralCode');

      // If user landed on root with a referral link and is not already logged in, route directly to /register
      if (ref && (path === '/' || path === '')) {
        const session = getUserSession();
        if (!session) {
          return '/register';
        }
      }
      return path;
    }
    return '/';
  });

  // Capture referral code on initial load and keep URL/history in sync
  useEffect(() => {
    const captured = captureReferralCodeFromUrl();
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '/';
      const params = new URLSearchParams(window.location.search);
      const hasRefQuery =
        params.get('ref') ||
        params.get('referral') ||
        params.get('r') ||
        params.get('sponsor') ||
        params.get('code') ||
        params.get('refcode') ||
        params.get('refCode') ||
        params.get('referralCode');

      if (hasRefQuery && (path === '/' || path === '')) {
        const session = getUserSession();
        if (!session) {
          setCurrentPath('/register');
          try {
            window.history.replaceState({}, '', `/register?ref=${encodeURIComponent(hasRefQuery)}`);
          } catch {}
        }
      }
    }
  }, []);

  // Sync with browser history & URL changes
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        setCurrentPath(window.location.pathname || '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      const targetBase = path.split('?')[0];
      let finalPath = path;

      // If navigating to /register without explicit query, automatically attach cached referral code
      if (targetBase.toLowerCase() === '/register' && !path.includes('?')) {
        const cached = captureReferralCodeFromUrl();
        if (cached) {
          finalPath = `/register?ref=${encodeURIComponent(cached)}`;
        }
      }

      window.history.pushState({}, '', finalPath);
      setCurrentPath(targetBase);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const normalizedPath = currentPath.toLowerCase();

  // Route 1: User Registration (/register)
  if (normalizedPath === '/register') {
    return <UserRegisterPage onNavigate={navigate} />;
  }

  // Route 2: User Login (/login)
  if (normalizedPath === '/login') {
    return <UserLoginPage onNavigate={navigate} />;
  }

  // Route 3: Forgot Password (/forgot-password)
  if (normalizedPath === '/forgot-password') {
    return <UserForgotPasswordPage onNavigate={navigate} />;
  }

  // Route 4: User Logout (/logout)
  if (normalizedPath === '/logout') {
    clearUserSession();
    navigate('/login');
    return <UserLoginPage onNavigate={navigate} />;
  }

  // Route 5: Admin Register (Blocked / Disallowed by Prompt)
  if (normalizedPath === '/admin/register') {
    return <AdminRegisterBlocker onNavigate={navigate} />;
  }

  // Route 6: Admin Login (/admin/login)
  if (normalizedPath === '/admin/login') {
    return <AdminLoginPage onNavigate={navigate} />;
  }

  // Route 7: Admin Logout (/admin/logout)
  if (normalizedPath === '/admin/logout') {
    clearAdminSession();
    navigate('/admin/login');
    return <AdminLoginPage onNavigate={navigate} />;
  }

  // Route 8: Admin Dashboard & Protected Admin Routes (/admin/*)
  if (normalizedPath.startsWith('/admin')) {
    const adminSession = getAdminSession();
    // Role-based access protection: Only authenticated admins/superadmins can access
    if (adminSession && (adminSession.admin.role === 'admin' || adminSession.admin.role === 'superadmin')) {
      return <AdminDashboardPage onNavigate={navigate} />;
    }
    // Normal users / unauthenticated trying to access /admin/* get redirected or access denied
    return <AccessDeniedPage onNavigate={navigate} onLogout={clearAdminSession} />;
  }

  // Route 9: User Dashboard & Member Subroutes (/dashboard, /wallet, /deposit, etc.)
  if (
    normalizedPath === '/dashboard' ||
    normalizedPath === '/wallet' ||
    normalizedPath === '/deposit' ||
    normalizedPath === '/withdraw' ||
    normalizedPath === '/transfer' ||
    normalizedPath === '/tickets' ||
    normalizedPath === '/games' ||
    normalizedPath === '/referral' ||
    normalizedPath === '/passbook' ||
    normalizedPath === '/profile'
  ) {
    if (authState === 'loading') {
      return <LoadingScreen message="Loading your dashboard..." subMessage="Syncing your wallet balances, live game status, and tickets..." />;
    }
    const session = getUserSession();
    if (!session && !currentUser) {
      return <UserLoginPage onNavigate={navigate} />;
    }
    return <UserDashboardPage onNavigate={navigate} />;
  }

  // Route 10: Public Home Page (with separate Login, Register, Admin Login buttons)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021b36] via-[#062c52] via-[#093c6e] to-[#031a33] text-slate-100 selection:bg-sky-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      {/* Sky Blue Ambient Atmospheric Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-sky-400/15 rounded-full blur-[160px]"></div>
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[150px]"></div>
        <div className="absolute top-2/3 -right-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px]"></div>
      </div>

      {/* Maintenance Mode Banner (Admin Controlled) */}
      {settings.maintenanceMode && (
        <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white py-2.5 px-4 text-center text-xs font-black tracking-wide flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>{settings.maintenanceMessage || 'Platform Maintenance in Progress'}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-sky-950/80 via-blue-900/80 to-cyan-950/80 border-b border-sky-400/20 text-xs py-1.5 px-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow">
              <Flame className="w-3 h-3 fill-current" /> MEGA OFFER
            </span>
            <span className="text-sky-100 text-xs font-semibold truncate">
              {settings.announcements[0] || '🎉 Welcome Bonus: Get ₹200 Free Game Credits on First Sign Up!'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sky-200 text-xs">
            <span className="flex items-center gap-1 text-emerald-300 font-mono font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
              Live Caller #AT-{settings.liveGameId}
            </span>
            <button
              onClick={() => navigate('/admin/login')}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer bg-sky-900/40 hover:bg-sky-900/70 border border-sky-400/30 px-2.5 py-0.5 rounded-lg transition-all"
            >
              <Shield className="w-3 h-3" /> Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Responsive Navigation Header with separate 🔵 Login, 🟢 Register, 🔐 Admin Login buttons */}
      <Header onNavigate={navigate} />

      {/* Hero Section */}
      <HeroSection />

      {/* Live Game Status Section */}
      <LiveGameCard />

      {/* Interactive Tambola Ticket Demonstration */}
      <TambolaTicketSection />

      {/* Exciting Winning Prizes Section */}
      <PrizeSection />

      {/* How It Works 4-Step Guide */}
      <HowItWorksSection />

      {/* Multi-Level 5+ Referral & Downline Section */}
      <ReferralSection />

      {/* Why APNA TAMBOLA (6 Feature Cards) */}
      <WhyApnaTambola />

      {/* Recent Winners Hall of Fame */}
      <WinnersSection />

      {/* Upcoming Scheduled Tournaments */}
      <UpcomingGamesSection />

      {/* Cross-Platform Mobile Section */}
      <MobileAppSection />

      {/* Comprehensive Footer */}
      <Footer />

      {/* Modal Controller */}
      <ModalManager />

      {/* Floating Mobile Bottom Action Dock */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d28]/95 backdrop-blur-lg border-t border-indigo-500/30 p-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => {
            setSelectedGameForPurchase(upcomingGames[0]);
            setActiveModal('buyTicket');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-pink-400 text-[10px] font-bold"
        >
          <Ticket className="w-5 h-5 text-pink-400" />
          <span>Buy Ticket</span>
        </button>

        <button
          onClick={() => setActiveModal('playLive')}
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/50 ring-4 ring-[#070817]">
            <PlayCircle className="w-6 h-6 fill-current" />
          </div>
          <span className="text-[10px] font-black text-amber-300 mt-1">Play Live</span>
        </button>

        <button
          onClick={() => navigate('/register')}
          className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-emerald-400 text-[10px] font-bold"
        >
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Join Free</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="Application encountered an unexpected error">
      <TambolaProvider>
        <MainAppContent />
      </TambolaProvider>
    </ErrorBoundary>
  );
}
