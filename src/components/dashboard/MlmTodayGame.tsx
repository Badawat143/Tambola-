import React, { useState, useEffect } from 'react';
import { GameItem, TambolaTicket } from '../../types/tambola';
import { Radio, Users, Ticket, Trophy, Clock, Play, Eye, Sparkles, AlertCircle } from 'lucide-react';

interface MlmTodayGameProps {
  activeLiveGame: GameItem;
  myTickets: TambolaTicket[];
  onJoinGame: (game: GameItem) => void;
  onViewTicket: (ticket: TambolaTicket) => void;
  onBuyMoreTickets: (game: GameItem) => void;
}

export const MlmTodayGame: React.FC<MlmTodayGameProps> = ({
  activeLiveGame,
  myTickets,
  onJoinGame,
  onViewTicket,
  onBuyMoreTickets,
}) => {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ m: number; s: number }>({ m: 12, s: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { m: prev.m - 1, s: 59 };
        return { m: 15, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    const mm = String(timeLeft.m).padStart(2, '0');
    const ss = String(timeLeft.s).padStart(2, '0');
    return `00:${mm}:${ss}`;
  };

  const gameTickets = myTickets.filter((t) => t.gameId === activeLiveGame.id || t.status === 'active');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 🔴 TODAY'S GAME / LIVE SHOWCASE CARD (7 Cols) */}
      <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0f2a] via-[#211438] to-[#0c0a1f] border-2 border-pink-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header: Live indicator & Title */}
        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/25 border border-red-500/50 text-red-400 text-[10px] font-black tracking-wider animate-pulse">
              <Radio className="w-3 h-3" />
              🔴 LIVE / UPCOMING
            </span>
            <span className="text-xs font-mono text-slate-400">
              Game ID: <strong className="text-amber-300 font-bold">{activeLiveGame.id || 'AT10025'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-amber-300 font-mono font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Starts in: {formatCountdown()}</span>
          </div>
        </div>

        {/* Game Title & Main Highlights */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Outfit']">
              {activeLiveGame.title || 'TAMBOLA LIVE BUMPER'}
            </h3>
            <p className="text-xs text-slate-300">
              Standard 90-Ball Live Interactive Draw • 70% Max Prize Pool
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-right">
            <span className="text-[10px] uppercase font-bold text-amber-300">Total Prize Pool</span>
            <p className="text-xl font-black text-amber-400 font-mono">
              ₹{(activeLiveGame.prizePool || 4900).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* 4 Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10 text-center">
          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Ticket Price</span>
            <p className="text-base font-black text-emerald-400 font-mono">
              ₹{activeLiveGame.ticketPrice || 20}
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Tickets Sold</span>
            <p className="text-base font-black text-pink-400 font-mono">
              {activeLiveGame.ticketsSoldCount || 350}
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Live Players</span>
            <p className="text-base font-black text-cyan-400 font-mono">
              {activeLiveGame.playersCount || 210}
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Prize Share</span>
            <p className="text-base font-black text-amber-400 font-mono">70% POOL</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative z-10">
          <button
            onClick={() => onJoinGame(activeLiveGame)}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>JOIN GAME (PLAY LIVE)</span>
          </button>

          <button
            onClick={() => onBuyMoreTickets(activeLiveGame)}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>BUY TICKETS (₹{activeLiveGame.ticketPrice || 20})</span>
          </button>
        </div>
      </div>

      {/* 🎟️ MY TICKETS SECTION (5 Cols) */}
      <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#0e1233] to-[#07091f] border border-indigo-500/30 p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-pink-400" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              MY TICKETS ({myTickets.length})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Latest Active Passes</span>
        </div>

        {/* Ticket Cards Stream */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
          {gameTickets.length > 0 ? (
            gameTickets.slice(0, 3).map((ticket, idx) => (
              <div
                key={ticket.id || idx}
                className="p-3 rounded-2xl bg-[#141842] border border-emerald-500/40 flex items-center justify-between shadow-md hover:border-emerald-400 transition"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white font-mono">
                      🎟️ TICKET #{ticket.ticketNumber || 84920}
                    </span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Game: <span className="text-amber-300">{ticket.gameId || 'AT10025'}</span> • Price: ₹{ticket.ticketPrice || 20} • Color: <span className="text-emerald-300 capitalize">{ticket.colorTheme || 'Green'}</span>
                  </p>
                </div>

                <button
                  onClick={() => onViewTicket(ticket)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-6 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <p className="text-xs text-slate-400">No tickets purchased for this game yet.</p>
              <button
                onClick={() => onBuyMoreTickets(activeLiveGame)}
                className="px-4 py-2 rounded-xl bg-pink-500 text-white font-black text-xs shadow hover:brightness-110 cursor-pointer"
              >
                Buy Your First Ticket
              </button>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Total active passes: {myTickets.length}</span>
          <button
            onClick={() => onJoinGame(activeLiveGame)}
            className="text-amber-400 font-bold hover:underline cursor-pointer"
          >
            Launch Live Game & Daub →
          </button>
        </div>
      </div>
    </div>
  );
};
