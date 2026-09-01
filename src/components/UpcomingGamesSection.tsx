import React, { useState, useEffect } from 'react';
import { useTambola } from '../context/TambolaContext';
import {
  Calendar,
  Clock,
  Ticket,
  Trophy,
  Users,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GameItem } from '../types/tambola';

export const UpcomingGamesSection: React.FC = () => {
  const { upcomingGames, setSelectedGameForPurchase, setActiveModal } = useTambola();

  // Dynamic timers for games
  const [timers, setTimers] = useState<{ [key: string]: number }>({
    'AT-1026': 15 * 60,
    'AT-1027': 45 * 60,
    'AT-1028': 120 * 60,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          next[key] = Math.max(0, next[key] - 1);
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSeconds: number = 0) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBuyTicket = (game: GameItem) => {
    setSelectedGameForPurchase(game);
    setActiveModal('buyTicket');
  };

  return (
    <section id="upcoming-games-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>SCHEDULED TOURNAMENTS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          UPCOMING GAMES
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Reserve your tickets in advance for high prize pool tournaments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingGames.map((game, idx) => {
          const timeLeftSec = timers[game.id] || (idx + 1) * 20 * 60;
          const isUnder5Min = timeLeftSec <= 300;
          const isSaleClosed = game.isTicketSaleOpen === false || isUnder5Min;

          return (
            <div
              key={game.id}
              className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden flex flex-col justify-between group bg-gradient-to-b from-[#141538] to-[#0c0d24]"
            >
              {/* Card Header & Countdown */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black px-2.5 py-1 bg-white/10 text-amber-300 rounded-lg border border-white/15 font-mono">
                    Game ID: {game.id}
                  </span>
                  {isUnder5Min ? (
                    <span className="text-[10px] font-black px-2.5 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/40 uppercase tracking-wider animate-pulse">
                      ⛔ TICKET CLOSED (5m Cutoff)
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40 uppercase tracking-wider">
                      UPCOMING
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-pink-300 transition-colors">
                  {game.title}
                </h3>

                {/* Date & Time info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 my-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Start Date</span>
                      <span className="font-semibold text-white">Today</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Start Time</span>
                      <span className="font-semibold text-white">In {Math.ceil(timeLeftSec / 60)} Mins</span>
                    </div>
                  </div>
                </div>

                {/* Countdown Box */}
                <div className="bg-[#080918] p-3 rounded-2xl border border-indigo-500/20 my-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
                    Countdown
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-widest">
                    {formatCountdown(timeLeftSec)}
                  </p>
                </div>

                {/* Ticket Price & Available Tickets */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                    <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                      Ticket Price
                    </span>
                    <p className="text-lg font-black text-amber-300 font-mono mt-0.5">
                      ₹{game.ticketPrice}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Available Tickets
                    </span>
                    <p className="text-lg font-black text-purple-300 font-mono mt-0.5">
                      {((game.totalTicketSales || 500) - (game.ticketsSoldCount || 0)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* System Auto-Check Note */}
                <div className="text-[10px] text-indigo-300/80 bg-indigo-950/40 p-2 rounded-xl border border-indigo-500/20 mb-2 text-center">
                  🤖 ऑफलाइन यूज़र्स के टिकट भी सिस्टम स्वतः चेक व काउंट करेगा
                </div>
              </div>

              {/* VIEW GAME / JOIN BUTTON */}
              <div className="pt-2">
                <button
                  id={`btn-buy-ticket-${game.id}`}
                  onClick={() => handleBuyTicket(game)}
                  className={`w-full py-3.5 px-5 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                    isSaleClosed
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 shadow-none'
                      : 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <Ticket className="w-5 h-5" />
                  <span>{isUnder5Min ? 'BOOKING CLOSED (5m)' : 'BOOK TICKET / VIEW'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
