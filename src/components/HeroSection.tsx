import React, { useState, useEffect } from 'react';
import { useTambola } from '../context/TambolaContext';
import { Sparkles, Trophy, Flame, Play, Ticket, Zap, ShieldCheck, Clock, ArrowRight, Users } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    settings,
    setActiveModal,
    setSelectedGameForPurchase,
    upcomingGames,
    activeLiveGame,
    myTickets,
    openUserDashboard,
  } = useTambola();

  // Dynamic countdown timer for next game (starts from 24 mins 36 sec)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 24,
    seconds: 36,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 24, seconds: 36 }; // loop reset
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigits = (val: number) => val.toString().padStart(2, '0');

  // Vibrant animated Tambola balls requested in prompt: 5, 12, 24, 47, 63, 71, 90
  const heroBalls = [
    { num: 5, bg: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-500/40', delay: '0s', class: 'animate-float', label: 'Fingers' },
    { num: 12, bg: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/40', delay: '0.8s', class: 'animate-float-reverse', label: 'One Dozen' },
    { num: 24, bg: 'from-purple-500 to-indigo-600', shadow: 'shadow-purple-500/40', delay: '1.4s', class: 'animate-float', label: 'Two Dozen' },
    { num: 47, bg: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/40', delay: '2.1s', class: 'animate-float-reverse', label: 'Four & Seven' },
    { num: 63, bg: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/40', delay: '2.8s', class: 'animate-float', label: 'Tickle Me' },
    { num: 71, bg: 'from-orange-500 to-amber-600', shadow: 'shadow-orange-500/40', delay: '3.4s', class: 'animate-float-reverse', label: 'Bang On' },
    { num: 90, bg: 'from-red-500 to-pink-600', shadow: 'shadow-red-500/50', delay: '4.0s', class: 'animate-float', label: 'Top Shop' },
  ];

  // Sample decorative premium 3x9 ticket for hero visual
  const heroSampleTicket = [
    [5, 12, null, 34, null, 56, null, 71, null],
    [null, 19, 24, null, 47, null, 63, null, 88],
    [8, null, null, 38, null, 59, null, 77, 90],
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Decorative Gradients & Glow Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Animated Tambola Balls Bar */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 mb-8 overflow-x-auto py-3 px-2 no-scrollbar">
          {heroBalls.map((ball) => (
            <div
              key={ball.num}
              style={{ animationDelay: ball.delay }}
              className={`flex-shrink-0 flex flex-col items-center group cursor-pointer ${ball.class}`}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${ball.bg} p-[2px] shadow-lg ${ball.shadow} flex items-center justify-center transform group-hover:scale-115 transition-transform duration-300`}
              >
                <div className="w-full h-full rounded-full bg-[#11122e]/80 backdrop-blur-sm flex flex-col items-center justify-center border border-white/30 relative overflow-hidden">
                  <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/40 rounded-full rotate-[-30deg]"></div>
                  <span className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-sm font-['Space_Grotesk']">
                    {ball.num}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold mt-1 tracking-tight hidden sm:block">
                {ball.label}
              </span>
            </div>
          ))}
        </div>

        {/* Hero Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headings & Big Buttons */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Live Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-pink-500/40 text-pink-300 text-xs sm:text-sm font-bold shadow-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
              <span>INDIA'S #1 LIVE TAMBOLA PLATFORM</span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] font-['Outfit']">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {settings.heroHeading || 'WELCOME TO APNA TAMBOLA'}
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                Play Live &amp; Win
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl font-medium text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {settings.heroSubheading || 'Play Tambola. Enjoy the Game. Experience the Excitement.'}
            </p>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs sm:text-sm text-slate-300 font-semibold">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Certified 1–90 RNG</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant Auto Ticket Marking</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Trophy className="w-4 h-4 text-pink-400" />
                <span>Multi-Level MLM Rewards</span>
              </div>
            </div>

            {/* Action Buttons: PLAY NOW & LOGIN */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              {/* PLAY NOW BUTTON */}
              <button
                id="btn-hero-play-now"
                onClick={() => setActiveModal('playLive')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 border border-white/20 group"
              >
                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                <span>PLAY NOW</span>
              </button>

              {/* LOGIN / DASHBOARD BUTTON */}
              <button
                id="btn-hero-login"
                onClick={() => openUserDashboard('dashboard')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-base sm:text-lg shadow-xl border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 group"
              >
                <Users className="w-6 h-6 text-amber-400" />
                <span>LOGIN</span>
              </button>
            </div>
          </div>

          {/* Right Column: Premium Tambola Ticket Illustration & Live Countdown Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live-Looking Next Game Countdown Card */}
            <div className="glass-card rounded-3xl p-5 border border-purple-500/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl -z-10 group-hover:bg-pink-500/30 transition-all"></div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-black tracking-wider uppercase text-pink-300">
                    NEXT GAME STARTING IN
                  </span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-white/10 text-amber-300 rounded-md border border-amber-400/30">
                  Game #{activeLiveGame.id}
                </span>
              </div>

              {/* Countdown Ticker Box: 00 : 24 : 36 */}
              <div className="flex items-center justify-center gap-3 py-3 bg-[#0d0e28]/90 rounded-2xl border border-indigo-500/30 shadow-inner my-2">
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {formatDigits(timeLeft.hours)}
                  </span>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HRS</p>
                </div>
                <span className="text-2xl font-black text-pink-400 animate-pulse">:</span>
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {formatDigits(timeLeft.minutes)}
                  </span>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">MIN</p>
                </div>
                <span className="text-2xl font-black text-pink-400 animate-pulse">:</span>
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                    {formatDigits(timeLeft.seconds)}
                  </span>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SEC</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Ticket Price</p>
                  <p className="text-lg font-black text-amber-400 font-mono">₹{activeLiveGame.ticketPrice || 20}</p>
                </div>
                <button
                  id="btn-hero-join-now"
                  onClick={() => setActiveModal('playLive')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>JOIN GAME</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Premium Tambola Ticket Illustration */}
            <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-500/30 shadow-2xl relative">
              {/* Ticket Top Ribbon */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
                    AT
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white tracking-wide">AUTHENTIC 3×9 TICKET</p>
                    <p className="text-[10px] text-pink-300 font-mono">TKT-HERO-PREVIEW</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  VERIFIED QR
                </span>
              </div>

              {/* 3x9 Ticket Grid */}
              <div className="bg-[#0f102c] p-2.5 sm:p-3 rounded-2xl border border-purple-500/20 shadow-inner space-y-1.5 sm:space-y-2">
                {heroSampleTicket.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-9 gap-1 sm:gap-1.5">
                    {row.map((num, cIdx) => {
                      const isMarked = num === 5 || num === 24 || num === 47 || num === 90;
                      return (
                        <div
                          key={cIdx}
                          className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-black transition-all ${
                            num === null
                              ? 'bg-white/[0.02] border border-white/5'
                              : isMarked
                              ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/40 border border-pink-300 ring-2 ring-pink-400/50 scale-105'
                              : 'bg-white/10 text-slate-100 hover:bg-white/20 border border-white/15'
                          }`}
                        >
                          {num !== null && (
                            <span className="font-['Space_Grotesk'] font-bold">
                              {num}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Interactive Footer */}
              <div className="flex items-center justify-between mt-4 text-[11px] text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> 4 Numbers Marked (Daubed)
                </span>
                <span className="text-slate-400 font-mono">15 Numbers Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
