import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { Trophy, Sparkles, Award, Star, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PrizeSection: React.FC = () => {
  const { prizes, setActiveModal } = useTambola();

  return (
    <section id="prizes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5 text-pink-400" />
          <span>OFFICIAL GAME PATTERNS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          🏆 WINNING PATTERNS &amp; COMBINATIONS
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Multiple exciting ways to win in every match! Complete any of these classic patterns on your colourful ticket to claim victory.
        </p>
      </div>

      {/* 6 Winning Pattern Cards Grid (NO PRIZE AMOUNTS / NO INTERNAL CALCULATIONS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.map((prize) => (
          <div
            key={prize.id}
            className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border-2 border-white/10 relative overflow-hidden group bg-gradient-to-br from-[#0e1338]/90 via-[#0a0d2a]/95 to-[#07091d]/95 hover:border-pink-500/50 shadow-xl"
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

              {/* Pattern Badge */}
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-xs font-black text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified</span>
              </span>
            </div>

            {/* Pattern Description */}
            <div className="my-4 p-4 rounded-2xl bg-[#060818]/80 border border-white/10 group-hover:border-pink-500/30 transition-all">
              <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                {prize.description}
              </p>
            </div>

            {/* Card Footer Action */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Instant Claim Ready
              </span>
              <button
                onClick={() => setActiveModal('playLive')}
                className="text-xs font-black text-white hover:text-pink-300 flex items-center gap-1 group/btn cursor-pointer"
              >
                <span>Play Live</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Button: HOW TO PLAY & RULES */}
      <div className="text-center mt-10">
        <button
          id="btn-view-rules"
          onClick={() => setActiveModal('prizes')}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
        >
          <Award className="w-5 h-5 text-amber-300" />
          <span>VIEW HOW TO PLAY &amp; WINNING RULES</span>
        </button>
      </div>
    </section>
  );
};
