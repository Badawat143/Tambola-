import React, { useState } from 'react';
import { useTambola } from '../context/TambolaContext';
import {
  Sparkles,
  Menu,
  X,
  Volume2,
  VolumeX,
  Wallet,
  User,
  Settings,
  Users,
  Trophy,
  Ticket,
  PlayCircle,
  HelpCircle,
  Headphones,
  ArrowDownToLine,
  ArrowUpFromLine,
  LayoutDashboard,
  Gift,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    settings,
    setActiveModal,
    openUserDashboard,
    setSelectedGameForPurchase,
    upcomingGames,
    isSoundMuted,
    toggleSound,
  } = useTambola();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'HOME', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: 'LIVE GAMES', action: () => setActiveModal('playLive') },
    { name: 'HOW TO PLAY', action: () => {
      const el = document.getElementById('how-to-play');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }},
    { name: 'WINNERS', action: () => setActiveModal('winners') },
    { name: 'LOGIN', action: () => openUserDashboard('dashboard') },
    { name: 'REGISTER', action: () => setActiveModal('userSwitcher') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-500/20 bg-[#0c0d23]/90 backdrop-blur-xl transition-all duration-300">
      {/* Top Announcement Bar */}
      {settings.announcements && settings.announcements.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 px-4 py-1 text-center text-xs font-semibold tracking-wide text-white shadow-inner flex items-center justify-center gap-2 overflow-hidden">
          <Sparkles className="h-3.5 w-3.5 animate-spin text-yellow-200" style={{ animationDuration: '4s' }} />
          <span className="truncate">{settings.announcements[0]}</span>
          <span className="hidden md:inline-block bg-white/25 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Live
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Left */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-purple-500/25">
              <div className="w-full h-full bg-[#0d0e24] rounded-2xl flex items-center justify-center relative overflow-hidden">
                <span className="font-extrabold text-xl tracking-tighter bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                  AT
                </span>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0d0e24]"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent font-['Outfit']">
                  {settings.websiteName || 'APNA TAMBOLA'}
                </span>
                <span className="text-[10px] uppercase font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 text-white px-1.5 py-0.5 rounded shadow">
                  PRO
                </span>
              </div>
              <p className="text-[10px] tracking-widest font-semibold uppercase text-slate-400">
                {settings.tagline || 'PLAY MORE • WIN MORE • SMILE MORE'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Join Now Prominent Button */}
            <button
              onClick={() => {
                setSelectedGameForPurchase(upcomingGames[0]);
                setActiveModal('buyTicket');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white text-xs font-black tracking-wide flex items-center gap-1.5 shadow-lg shadow-pink-500/25 hover:scale-105 transition-all cursor-pointer animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOIN NOW</span>
            </button>

            {/* Audio toggle */}
            <button
              onClick={toggleSound}
              title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Wallet Balance / Quick Deposit */}
            <div
              onClick={() => openUserDashboard('wallet')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 cursor-pointer hover:border-emerald-400 transition-all shadow-sm"
              title="Click to view Wallet & Transactions"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 font-mono">₹{currentUser.walletBalance.toLocaleString('en-IN')}</span>
            </div>

            {/* Quick Deposit Button */}
            <button
              onClick={() => openUserDashboard('deposit')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black text-xs font-extrabold flex items-center gap-1 shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>

            {/* User Dashboard & Profile */}
            <button
              onClick={() => openUserDashboard('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 transition-all cursor-pointer text-xs font-bold"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-pink-400" />
              <span className="max-w-[80px] truncate">{currentUser.name}</span>
            </button>

            {/* Admin Switcher */}
            <button
              onClick={() => setActiveModal('admin')}
              title="Open Admin Settings"
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <div
              onClick={() => openUserDashboard('wallet')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black font-mono"
            >
              ₹{currentUser.walletBalance}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-slate-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-indigo-500/20 bg-[#0b0d23] px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          {/* Prominent Join Now Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSelectedGameForPurchase(upcomingGames[0]);
              setActiveModal('buyTicket');
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 animate-pulse"
          >
            <Sparkles className="w-4 h-4" />
            <span>JOIN NOW — PLAY LIVE TAMBOLA</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openUserDashboard('deposit');
              }}
              className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold text-xs flex items-center justify-center gap-1.5"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>+ Deposit Money</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openUserDashboard('withdraw');
              }}
              className="py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setMobileMenuOpen(false);
                  item.action();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 flex items-center justify-between"
              >
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveModal('admin');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveModal('userSwitcher');
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Switch User</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
