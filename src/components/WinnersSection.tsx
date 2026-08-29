import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { Trophy, Sparkles, Award, Clock, ArrowRight } from 'lucide-react';

export const WinnersSection: React.FC = () => {
  const { setActiveModal } = useTambola();

  const verifiedWinners = [
    {
      name: 'Rahul Verma',
      userId: 'AT100234',
      pattern: 'Full House',
      amount: '₹5,000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pooja Singh',
      userId: 'AT100567',
      pattern: 'First Line',
      amount: '₹1,000',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Amit Kumar',
      userId: 'AT100789',
      pattern: 'Second Line',
      amount: '₹1,000',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Neha Patel',
      userId: 'AT100890',
      pattern: 'Early Five',
      amount: '₹500',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="winners-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with VERIFIED WINNERS & VIEW ALL button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-['Outfit']">
            VERIFIED WINNERS
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1 font-medium">
            Real players winning instant real cash rewards every 15 minutes
          </p>
        </div>

        <button
          id="btn-view-all-winners-top"
          onClick={() => setActiveModal('winners')}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-400/40 whitespace-nowrap"
        >
          VIEW ALL
        </button>
      </div>

      {/* 4 Verified Winners Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {verifiedWinners.map((win) => (
          <div
            key={win.userId}
            className="rounded-3xl bg-gradient-to-br from-[#101236] via-[#0d0e29] to-[#151740] p-5 sm:p-6 border border-indigo-500/30 shadow-xl relative overflow-hidden group hover:border-yellow-400/50 hover:scale-105 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all pointer-events-none"></div>

            <div>
              {/* User Avatar & Name */}
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={win.avatar}
                  alt={win.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/80 shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">
                    {win.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-mono font-bold">
                    {win.userId}
                  </p>
                </div>
              </div>

              {/* Winning Pattern */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-3 mb-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Pattern
                  </span>
                  <span className="text-xs font-black text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-lg border border-pink-500/20">
                    {win.pattern}
                  </span>
                </div>
              </div>
            </div>

            {/* Won Amount in Gold Badge */}
            <div className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-center text-sm sm:text-base shadow-md font-mono flex items-center justify-center gap-1.5">
              <Trophy className="w-4 h-4 text-slate-950" />
              <span>Won {win.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
