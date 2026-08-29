import React from 'react';
import { useTambola } from '../../context/TambolaContext';
import { X, Trophy, Award, CheckCircle, Sparkles, Play } from 'lucide-react';

export const PrizesModal: React.FC = () => {
  const { prizes, setActiveModal } = useTambola();

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
              <h2 className="text-lg font-black text-white">PRIZES &amp; WINNING RULES</h2>
              <p className="text-xs text-slate-400">All standard Tambola winning combinations explained</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prizes List */}
        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {prizes.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h3 className="text-sm font-black text-white">{p.name} ({p.hindiName})</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{p.description}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Prize Amount</span>
                <span className="text-base font-black text-amber-300 font-mono">
                  ₹{p.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setActiveModal('playLive')}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play in Live Game</span>
          </button>
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
