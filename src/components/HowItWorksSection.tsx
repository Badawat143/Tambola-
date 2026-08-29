import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { UserPlus, Ticket, PlayCircle, Trophy, ArrowRight, PlusCircle } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { setActiveModal, setSelectedGameForPurchase, upcomingGames, openUserDashboard } = useTambola();

  const steps = [
    {
      num: '01',
      stepTag: 'STEP 1',
      title: 'Create Account',
      desc: 'Sign up in 30 seconds with mobile number or User ID and access your personal dashboard.',
      icon: <UserPlus className="w-7 h-7 text-amber-400" />,
      color: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      glow: 'group-hover:border-amber-400/60',
      action: () => setActiveModal('userSwitcher'),
      btnLabel: 'Sign Up / Login',
    },
    {
      num: '02',
      stepTag: 'STEP 2',
      title: 'Add Funds',
      desc: 'Easily deposit funds into your secure wallet via instant UPI/QR with zero waiting time.',
      icon: <PlusCircle className="w-7 h-7 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      glow: 'group-hover:border-emerald-400/60',
      action: () => openUserDashboard('deposit'),
      btnLabel: 'Add Funds',
    },
    {
      num: '03',
      stepTag: 'STEP 3',
      title: 'Buy Tambola Ticket',
      desc: 'Select from certified 3×9 tickets in your favorite vibrant theme and secure your seats.',
      icon: <Ticket className="w-7 h-7 text-pink-400" />,
      color: 'from-pink-500/20 to-rose-500/10',
      border: 'border-pink-500/30',
      glow: 'group-hover:border-pink-400/60',
      action: () => {
        setSelectedGameForPurchase(upcomingGames[0]);
        setActiveModal('buyTicket');
      },
      btnLabel: 'Get Tickets',
    },
    {
      num: '04',
      stepTag: 'STEP 4',
      title: 'Play Live Game',
      desc: 'Experience real-time live number calling (1–90) with auto-marking & instant winning credits.',
      icon: <PlayCircle className="w-7 h-7 text-purple-400" />,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      glow: 'group-hover:border-purple-400/60',
      action: () => setActiveModal('playLive'),
      btnLabel: 'Play Live',
    },
  ];

  return (
    <section id="how-to-play" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
          <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
          <span>EASY 4-STEP GUIDE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          HOW TO PLAY
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Simple, transparent, and exciting. Join thousands of players in 4 easy steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className={`glass-card rounded-3xl p-6 sm:p-7 border ${step.border} ${step.glow} transition-all duration-300 relative group flex flex-col justify-between bg-gradient-to-b ${step.color}`}
          >
            <div>
              {/* Step number badge & icon */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-mono text-xs font-black tracking-wider">
                  {step.stepTag}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-xl font-black text-white tracking-tight mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {step.desc}
              </p>
            </div>

            {/* Quick Action Link */}
            <div className="pt-6 mt-4 border-t border-white/10">
              <button
                onClick={step.action}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{step.btnLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
