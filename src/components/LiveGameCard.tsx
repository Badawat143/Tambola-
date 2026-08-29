import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { Radio, Users, Ticket, Trophy, Play, Flame, Sparkles } from 'lucide-react';

export const LiveGameCard: React.FC = () => {
  const { settings, activeLiveGame, setActiveModal } = useTambola();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/70 via-purple-950/80 to-blue-950/70 p-1 border-2 border-red-500/40 shadow-2xl shadow-red-500/15">
        {/* Animated Glow Backing */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative rounded-[22px] bg-[#0e0f2b]/95 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Title & Live Status Badge */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-pink-600 to-amber-500 p-[2px] shadow-lg shadow-red-500/40">
                <div className="w-full h-full bg-[#131433] rounded-2xl flex items-center justify-center">
                  <Radio className="w-8 h-8 text-red-400 animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    <span className="text-red-500 animate-pulse text-xl">🔴</span>
                    <span>LIVE TAMBOLA</span>
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black border border-red-500/40 uppercase tracking-wider animate-pulse-live">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    LIVE NOW
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-medium mt-1">
                  Real-time number caller in session • Mark tickets & claim instant prizes!
                </p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full lg:w-auto">
              {/* Game ID */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center sm:text-left">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  Game ID
                </p>
                <p className="text-lg font-black text-white font-mono mt-0.5">
                  #{settings.liveGameId || activeLiveGame.id || 'AT-1025'}
                </p>
              </div>

              {/* Ticket Price */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-center sm:text-left">
                <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Ticket className="w-3.5 h-3.5 text-amber-400" /> Ticket Price
                </p>
                <p className="text-lg font-black text-amber-300 font-mono mt-0.5">
                  ₹{activeLiveGame.ticketPrice || 20}
                </p>
              </div>

              {/* Players */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center sm:text-left">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> Players
                </p>
                <p className="text-lg font-black text-blue-300 font-mono mt-0.5">
                  {(settings.livePlayersCount || activeLiveGame.playersCount || 1248).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Tickets Available / Sold */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center sm:text-left">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Available
                </p>
                <p className="text-lg font-black text-pink-300 font-mono mt-0.5">
                  {(activeLiveGame.totalTickets - (activeLiveGame.ticketsSoldCount || 0) || 650).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="w-full lg:w-auto">
              <button
                id="btn-join-live-game"
                onClick={() => setActiveModal('playLive')}
                className="w-full lg:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-extrabold text-base shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-red-300/40 group whitespace-nowrap"
              >
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                <span>JOIN GAME</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
