import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { UserPlus, Wallet, Ticket, Radio, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { setActiveModal } = useTambola();

  const steps = [
    {
      step: '01',
      title: 'REGISTER',
      desc: 'Create your account in Apna Tambola in 30 seconds with instant verification.',
      icon: UserPlus,
      bgGradient: 'from-purple-600 via-indigo-700 to-indigo-900',
      shadow: 'shadow-purple-500/25',
      border: 'border-purple-400/40',
      actionText: 'Register Now',
      action: () => {
        if (typeof window !== 'undefined') window.location.href = '/register';
      },
    },
    {
      step: '02',
      title: 'ADD FUNDS',
      desc: 'Add money to your wallet securely via UPI, QR, or Net Banking.',
      icon: Wallet,
      bgGradient: 'from-cyan-600 via-blue-600 to-blue-900',
      shadow: 'shadow-cyan-500/25',
      border: 'border-cyan-400/40',
      actionText: 'Deposit Funds',
      action: () => {
        if (typeof window !== 'undefined') window.location.href = '/dashboard';
      },
    },
    {
      step: '03',
      title: 'BUY TICKET',
      desc: 'Choose an upcoming game and buy your favorite numbered tickets.',
      icon: Ticket,
      bgGradient: 'from-orange-500 via-amber-600 to-red-900',
      shadow: 'shadow-orange-500/25',
      border: 'border-orange-400/40',
      actionText: 'Buy Tickets',
      action: () => setActiveModal('buyTicket'),
    },
    {
      step: '04',
      title: 'PLAY LIVE',
      desc: 'Play live, daub called numbers in real-time, and win exciting cash prizes!',
      icon: Radio,
      bgGradient: 'from-emerald-500 via-teal-600 to-emerald-900',
      shadow: 'shadow-emerald-500/25',
      border: 'border-emerald-400/40',
      actionText: 'Join Live Room',
      action: () => setActiveModal('playLive'),
    },
  ];

  return (
    <section id="how-to-play" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-['Outfit']">
          HOW TO PLAY
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
          Start playing in 4 simple and exciting steps on Apna Tambola
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className={`rounded-3xl bg-gradient-to-b ${item.bgGradient} p-6 text-white shadow-xl ${item.shadow} border ${item.border} flex flex-col justify-between hover:scale-105 transition-all duration-300 relative overflow-hidden group`}
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white/30 font-mono tracking-tighter">
                  {item.step}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-black tracking-wider uppercase font-['Outfit'] text-white">
                  {item.step} {item.title}
                </h3>
                <p className="text-xs text-white/90 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={item.action}
                className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs uppercase tracking-wider shadow hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
