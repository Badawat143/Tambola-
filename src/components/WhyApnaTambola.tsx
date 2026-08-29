import React from 'react';
import {
  Ticket,
  Gamepad2,
  Hash,
  Trophy,
  Smartphone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const WhyApnaTambola: React.FC = () => {
  const features = [
    {
      title: '🎟 Easy Ticket',
      icon: <Ticket className="w-8 h-8 text-amber-400" />,
      color: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      desc: 'Instant 1-click authentic 3×9 ticket generation with cryptographic QR authenticity and automatic daubing.',
    },
    {
      title: '🎮 Live Games',
      icon: <Gamepad2 className="w-8 h-8 text-pink-400" />,
      color: 'from-pink-500/20 to-rose-500/10',
      border: 'border-pink-500/30',
      desc: 'Non-stop interactive multiplayer games scheduled every 15 minutes with real-time sync and voice announcements.',
    },
    {
      title: '🔢 Numbers 1–90',
      icon: <Hash className="w-8 h-8 text-purple-400" />,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      desc: 'Certified RNG number calling across numbers 1 through 90 with traditional Indian Housie call nicknames.',
    },
    {
      title: '🏆 Exciting Prizes',
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      color: 'from-yellow-500/20 to-amber-500/10',
      border: 'border-yellow-500/30',
      desc: '6+ prize categories per game (Early Five, Corners, Lines & Full House) with instant balance credits.',
    },
    {
      title: '📱 Mobile Friendly',
      icon: <Smartphone className="w-8 h-8 text-blue-400" />,
      color: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-blue-500/30',
      desc: 'Smooth, responsive interface engineered for smartphones, tablets, and desktops with zero lag.',
    },
    {
      title: '🔒 Secure Account',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      desc: '256-bit SSL encrypted transactions, verified payouts, 18+ age checks, and multi-level referral tracking.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>PLATFORM HIGHLIGHTS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          WHY APNA TAMBOLA
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Experience India's most entertaining, fair, and rewarding online Housie platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => (
          <div
            key={idx}
            className={`glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border ${item.border} relative overflow-hidden group bg-gradient-to-b ${item.color}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5 backdrop-blur-md group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mb-2">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
