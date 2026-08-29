import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { Trophy, Sparkles, Award, Star, ArrowRight } from 'lucide-react';

export const PrizeSection: React.FC = () => {
  const { prizes, setActiveModal } = useTambola();

  return (
    <section id="prizes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5 text-pink-400" />
          <span>INSTANT WINNING PATTERNS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          🏆 EXCITING PRIZES
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Multiple ways to win in every single game! Claim your prize the moment your numbers match.
        </p>
      </div>

      {/* 6 Prize Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.map((prize) => (
          <div
            key={prize.id}
            className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden group"
          >
            {/* Background ambient gradient glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${prize.color} opacity-15 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}></div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl filter drop-shadow-md group-hover:scale-115 transition-transform duration-300">
                  {prize.icon}
                </span>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {prize.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {prize.hindiName}
                  </p>
                </div>
              </div>

              {/* Prize Badge */}
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-slate-200 border border-white/10">
                Pattern
              </span>
            </div>

            {/* Prize Amount */}
            <div className="my-5 p-4 rounded-2xl bg-[#0a0b1d]/80 border border-white/10 group-hover:border-pink-500/30 transition-all">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Prize Amount
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent font-['Space_Grotesk']">
                  ₹{prize.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-emerald-400">+ Cash</span>
              </div>
            </div>

            {/* Pattern Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[38px]">
              {prize.description}
            </p>

            {/* Card Footer Action */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-pink-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Instant Claim
              </span>
              <button
                onClick={() => setActiveModal('playLive')}
                className="text-xs font-bold text-white hover:text-pink-300 flex items-center gap-1 group/btn cursor-pointer"
              >
                <span>Play Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Button: VIEW PRIZES */}
      <div className="text-center mt-10">
        <button
          id="btn-view-prizes"
          onClick={() => setActiveModal('prizes')}
          className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm sm:text-base shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
        >
          <Award className="w-5 h-5 text-amber-400" />
          <span>VIEW PRIZES &amp; RULES</span>
        </button>
      </div>
    </section>
  );
};
