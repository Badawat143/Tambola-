import React from 'react';
import { useTambola } from '../../context/TambolaContext';
import { X, Trophy, Award, MapPin, Clock } from 'lucide-react';

export const WinnersModal: React.FC = () => {
  const { winners, setActiveModal } = useTambola();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-2xl w-full rounded-3xl border-2 border-yellow-500/40 bg-[#0c0d26] shadow-2xl p-6 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-300 font-black">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">ALL RECENT WINNERS</h2>
              <p className="text-xs text-slate-400">Verified payouts credited to players</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Winners List */}
        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {winners.map((w) => (
            <div
              key={w.id}
              className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={w.avatar}
                  alt={w.winnerName}
                  className="w-10 h-10 rounded-full object-cover border border-yellow-400/50"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{w.winnerName}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-pink-400" />
                    <span>{w.city} • Game #{w.gameId}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-amber-300 block">{w.prizeCategory}</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  +₹{w.prizeAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
