import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { Trophy, Sparkles, Award, MapPin, Clock, ArrowRight } from 'lucide-react';

export const WinnersSection: React.FC = () => {
  const { winners, setActiveModal } = useTambola();

  return (
    <section id="winners-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>HALL OF FAME</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          🏆 RECENT WINNERS
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Real players winning real cash every 15 minutes on APNA TAMBOLA.
        </p>
      </div>

      {/* Winners Carousel/Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners.slice(0, 6).map((win, idx) => {
          const maskedUserId = `AT-USR-***${(idx + 1) * 23 + 12}`;
          const sampleTicketNo = `TKT-99${idx + 24}`;
          return (
            <div
              key={win.id}
              className="glass-card glass-card-hover rounded-3xl p-5 sm:p-6 border border-white/10 relative overflow-hidden group bg-gradient-to-br from-[#131433] via-[#0d0e26] to-[#181238]"
            >
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-all"></div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={win.avatar}
                    alt={win.winnerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/60 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight">
                      {win.winnerName}
                    </h3>
                    <p className="text-xs text-amber-300/90 font-mono font-bold">
                      {maskedUserId}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Verified
                </span>
              </div>

              {/* Winning Pattern & Prize Details */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Winning Pattern
                  </span>
                  <span className="text-xs font-black text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-lg border border-pink-500/20">
                    {win.prizeCategory}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Prize Result
                  </span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    Won ₹{win.prizeAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Footer Metadata: Game ID, Ticket Number, Date */}
              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 pt-2 border-t border-white/5 font-mono">
                <span className="text-purple-300 font-semibold">Game #{win.gameId}</span>
                <span className="text-slate-400">Tkt #{sampleTicketNo}</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{win.date}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW ALL WINNERS BUTTON */}
      <div className="text-center mt-10">
        <button
          id="btn-view-all-winners"
          onClick={() => setActiveModal('winners')}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
        >
          <Award className="w-5 h-5 text-slate-950" />
          <span>VIEW ALL WINNERS</span>
        </button>
      </div>
    </section>
  );
};
