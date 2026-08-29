import React from 'react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading your dashboard...',
  subMessage = 'Syncing wallet balances, live game status, and tickets...',
}) => {
  // Colourful animated Tambola balls data
  const balls = [
    { num: 7, color: 'from-red-500 to-rose-700', border: 'border-red-400', shadow: 'shadow-red-500/50', delay: '0s' },
    { num: 21, color: 'from-amber-400 to-yellow-600', border: 'border-yellow-300', shadow: 'shadow-yellow-400/50', delay: '0.15s' },
    { num: 45, color: 'from-emerald-400 to-teal-600', border: 'border-emerald-300', shadow: 'shadow-emerald-400/50', delay: '0.3s' },
    { num: 63, color: 'from-cyan-400 to-blue-600', border: 'border-cyan-300', shadow: 'shadow-cyan-400/50', delay: '0.45s' },
    { num: 77, color: 'from-purple-500 to-indigo-700', border: 'border-purple-300', shadow: 'shadow-purple-500/50', delay: '0.6s' },
    { num: 90, color: 'from-pink-500 to-fuchsia-700', border: 'border-pink-300', shadow: 'shadow-pink-500/50', delay: '0.75s' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021830] via-[#07264a] to-[#031326] text-white flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-pink-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main card container */}
      <div className="relative z-10 max-w-sm w-full p-8 rounded-3xl bg-[#08152b]/90 border-2 border-sky-400/40 shadow-2xl backdrop-blur-xl flex flex-col items-center">
        {/* Glowing Logo Badge */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 via-purple-600 to-cyan-400 p-[2.5px] shadow-2xl shadow-sky-500/30 animate-pulse">
            <div className="w-full h-full bg-[#050e1f] rounded-[13px] flex items-center justify-center text-3xl shadow-inner">
              🎱
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
            LIVE
          </span>
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 via-pink-300 to-cyan-300">
          APNA TAMBOLA
        </h1>

        {/* Message */}
        <p className="text-sm font-bold text-sky-200 mt-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          {message}
        </p>

        {/* Animated Colourful Tambola Balls */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-6">
          {balls.map((b, idx) => (
            <div
              key={idx}
              style={{ animationDelay: b.delay }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b ${b.color} border-2 ${b.border} shadow-lg ${b.shadow} flex items-center justify-center font-black font-mono text-xs sm:text-sm text-white animate-bounce`}
            >
              {b.num}
            </div>
          ))}
        </div>

        {/* Progress indicator bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-white/10 mt-1">
          <div className="bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 h-full w-full animate-[shimmer_1.5s_infinite_linear] rounded-full"></div>
        </div>

        {/* Subtitle */}
        <p className="text-[11px] text-slate-400 mt-3 font-medium">
          {subMessage}
        </p>
      </div>
    </div>
  );
};
