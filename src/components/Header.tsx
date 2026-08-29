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
  Crown,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const {
    currentUser,
    settings,
    setActiveModal,
    openUserDashboard,
    isSoundMuted,
    toggleSound,
  } = useTambola();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoute = (path: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', path);
      } catch {
        // ignore
      }
      try {
        window.location.href = path;
      } catch {
        // ignore
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-400/20 bg-[#041d38]/90 backdrop-blur-xl transition-all duration-300 shadow-lg shadow-sky-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Left: 🎱 APNA TAMBOLA with Crown */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleRoute('/')}
          >
            {/* 3D 8-Ball Icon */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-900 via-black to-slate-900 p-[2px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center relative overflow-hidden border border-white/20">
                <div className="absolute top-1 left-2 w-3 h-2 bg-white/50 rounded-full rotate-[-30deg]"></div>
                {/* 8 Ball Center White Circle */}
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-inner">
                  <span className="font-black text-xs text-black font-['Space_Grotesk']">8</span>
                </div>
              </div>
            </div>

            {/* Brand Text with Crown */}
            <div className="relative">
              <div className="flex items-center gap-1">
                <div className="relative flex flex-col">
                  {/* Golden Crown */}
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400 absolute -top-3.5 left-1/2 -translate-x-1/2 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit'] drop-shadow-[0_2px_10px_rgba(234,179,8,0.3)]">
                    APNA <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">TAMBOLA</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Navigation Links: HOME | LIVE GAMES | HOW TO PLAY | WINNERS */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={() => handleRoute('/')}
              className="px-3 py-2 text-xs sm:text-sm font-extrabold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer uppercase tracking-wider"
            >
              HOME
            </button>
            <button
              onClick={() => handleRoute('/live')}
              className="px-3 py-2 text-xs sm:text-sm font-extrabold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>LIVE GAMES</span>
            </button>
            <button
              onClick={() => scrollToSection('how-to-play')}
              className="px-3 py-2 text-xs sm:text-sm font-extrabold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer uppercase tracking-wider"
            >
              HOW TO PLAY
            </button>
            <button
              onClick={() => scrollToSection('winners-section')}
              className="px-3 py-2 text-xs sm:text-sm font-extrabold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer uppercase tracking-wider"
            >
              WINNERS
            </button>
          </nav>

          {/* Right Buttons: LOGIN (Royal Blue) & REGISTER (Pink) */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Audio toggle */}
            <button
              onClick={toggleSound}
              title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* 🔵 LOGIN Button (Royal Blue Pill) */}
            <button
              onClick={() => handleRoute('/login')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-blue-400/30"
            >
              LOGIN
            </button>

            {/* 🩷 REGISTER Button (Pink/Rose Pill) */}
            <button
              onClick={() => handleRoute('/register')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-pink-400/30"
            >
              REGISTER
            </button>

            {/* 🔐 Admin Access Shortcut */}
            <button
              onClick={() => handleRoute('/admin/login')}
              title="Admin Dashboard Portal"
              className="p-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => handleRoute('/login')}
              className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase shadow"
            >
              LOGIN
            </button>
            <button
              onClick={() => handleRoute('/register')}
              className="px-3.5 py-1.5 rounded-full bg-pink-500 text-white text-xs font-black uppercase shadow"
            >
              REGISTER
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0b22] border-b border-indigo-500/20 px-4 py-4 space-y-2">
          <button
            onClick={() => handleRoute('/')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-white hover:bg-white/10"
          >
            HOME
          </button>
          <button
            onClick={() => handleRoute('/live')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>LIVE GAMES</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>
          <button
            onClick={() => scrollToSection('how-to-play')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-white hover:bg-white/10"
          >
            HOW TO PLAY
          </button>
          <button
            onClick={() => scrollToSection('winners-section')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-white hover:bg-white/10"
          >
            WINNERS
          </button>
          <div className="pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={() => handleRoute('/dashboard')}
              className="flex-1 py-2 text-center rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              MEMBER DASHBOARD
            </button>
            <button
              onClick={() => handleRoute('/admin/login')}
              className="flex-1 py-2 text-center rounded-xl bg-amber-600 text-white text-xs font-bold"
            >
              ADMIN PANEL
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

