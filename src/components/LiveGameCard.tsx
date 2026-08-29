import React, { useState, useEffect } from 'react';
import { useTambola } from '../context/TambolaContext';
import { Radio, Users, Ticket, Trophy, Play, Flame, Sparkles, Clock, ArrowRight, Eye } from 'lucide-react';
import { GameItem } from '../types/tambola';

export const LiveGameCard: React.FC = () => {
  const { settings, activeLiveGame, setActiveModal, setSelectedGameForPurchase } = useTambola();

  // Countdown timer: 01:25
  const [minSec, setMinSec] = useState({ min: 1, sec: 25 });

  useEffect(() => {
    const timer = setInterval(() => {
      setMinSec((prev) => {
        if (prev.sec > 0) return { ...prev, sec: prev.sec - 1 };
        if (prev.min > 0) return { min: prev.min - 1, sec: 59 };
        return { min: 1, sec: 25 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const upcomingSampleGames = [
    { id: 'ATB12346', price: 20, time: 'Today, 05:00 PM', players: 180 },
    { id: 'ATB12347', price: 30, time: 'Today, 07:00 PM', players: 240 },
    { id: 'ATB12348', price: 50, time: 'Today, 09:00 PM', players: 310 },
    { id: 'ATB12349', price: 100, time: 'Today, 11:00 PM', players: 500 },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: 🔴 LIVE GAME Card */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#0c0d2a] via-[#101238] to-[#170e33] p-6 sm:p-7 border border-pink-500/30 shadow-2xl relative overflow-hidden group">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Top Bar: LIVE GAME & LIVE Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-400 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-['Outfit']">
                  LIVE GAME
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black border border-red-500/40 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                LIVE
              </span>
            </div>

            {/* Metrics 3-Column / 2-Column Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-3">
                <p className="text-[10px] uppercase font-bold text-slate-400">Game ID</p>
                <p className="text-base font-black text-white font-mono mt-0.5">
                  #{settings.liveGameId || 'ATB12345'}
                </p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-3">
                <p className="text-[10px] uppercase font-bold text-amber-300">Ticket Price</p>
                <p className="text-base font-black text-amber-300 font-mono mt-0.5">
                  ₹ 10
                </p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-3">
                <p className="text-[10px] uppercase font-bold text-sky-300">Players</p>
                <p className="text-base font-black text-sky-300 font-mono mt-0.5">
                  120
                </p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-3">
                <p className="text-[10px] uppercase font-bold text-emerald-300">Available</p>
                <p className="text-base font-black text-emerald-300 font-mono mt-0.5">
                  250
                </p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-3 sm:col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Start Time</p>
                <p className="text-base font-black text-purple-300 font-mono mt-0.5">
                  02:30 PM
                </p>
              </div>
            </div>

            {/* Countdown Box: 01 : 25 (MIN : SEC) */}
            <div className="flex items-center justify-center gap-4 py-3 px-6 bg-[#08091e]/90 rounded-2xl border border-pink-500/30 mb-6 shadow-inner">
              <div className="text-center">
                <span className="text-3xl font-black text-white font-mono tracking-tight">
                  {minSec.min.toString().padStart(2, '0')}
                </span>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">MIN</p>
              </div>
              <span className="text-2xl font-black text-pink-400 animate-pulse">:</span>
              <div className="text-center">
                <span className="text-3xl font-black text-amber-300 font-mono tracking-tight">
                  {minSec.sec.toString().padStart(2, '0')}
                </span>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">SEC</p>
              </div>
            </div>
          </div>

          {/* Big Gradient Button: JOIN GAME (Pink-to-Orange) */}
          <button
            id="btn-live-join-game"
            onClick={() => setActiveModal('playLive')}
            className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black text-base tracking-wider uppercase shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-white/20"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>JOIN GAME</span>
          </button>
        </div>

        {/* Right Column: 🎮 UPCOMING GAMES Card */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#0a0c24] via-[#0e1030] to-[#12143b] p-6 sm:p-7 border border-blue-500/30 shadow-2xl relative overflow-hidden">
          {/* Top Bar: UPCOMING GAMES & VIEW ALL Button */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-['Outfit']">
              UPCOMING GAMES
            </h3>
            <button
              onClick={() => setActiveModal('buyTicket')}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer border border-purple-400/40"
            >
              VIEW ALL
            </button>
          </div>

          {/* 4 Upcoming Game Cards in a 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-2">
            {upcomingSampleGames.map((game) => (
              <div
                key={game.id}
                className="bg-black/40 border border-white/10 hover:border-blue-500/50 rounded-2xl p-4 transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white font-mono">
                      #{game.id}
                    </span>
                    <span className="text-xs font-black text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      ₹ {game.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{game.time}</span>
                  </p>
                </div>

                <button
                  onClick={() => setActiveModal('buyTicket')}
                  className="w-full py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white font-black text-xs uppercase tracking-wider border border-blue-500/40 hover:border-blue-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW GAME</span>
                </button>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400 font-medium">
              New games launch automatically every 15 minutes • 24/7
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

