import React from 'react';
import {
  PlusCircle,
  Ticket,
  ArrowUpRight,
  Send,
  Radio,
  Users,
  Sparkles,
  Gift,
} from 'lucide-react';

interface MlmQuickActionsProps {
  onAction: (
    action:
      | 'deposit'
      | 'buyTicket'
      | 'withdraw'
      | 'transfer'
      | 'liveGame'
      | 'referral'
      | 'income'
      | 'freeTickets'
  ) => void;
}

export const MlmQuickActions: React.FC<MlmQuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'deposit' as const,
      label: '➕ Deposit',
      desc: 'Add Funds',
      icon: PlusCircle,
      gradient: 'from-emerald-500 to-teal-700',
      textGrad: 'text-emerald-300',
      border: 'border-emerald-500/40',
      shadow: 'shadow-emerald-500/20',
    },
    {
      id: 'buyTicket' as const,
      label: '🎟️ Buy Ticket',
      desc: 'Join Games',
      icon: Ticket,
      gradient: 'from-pink-500 to-rose-700',
      textGrad: 'text-pink-300',
      border: 'border-pink-500/40',
      shadow: 'shadow-pink-500/20',
    },
    {
      id: 'withdraw' as const,
      label: '💸 Withdraw',
      desc: 'Instant Payout',
      icon: ArrowUpRight,
      gradient: 'from-amber-500 to-yellow-700',
      textGrad: 'text-amber-300',
      border: 'border-amber-500/40',
      shadow: 'shadow-amber-500/20',
    },
    {
      id: 'transfer' as const,
      label: '🔄 Transfer',
      desc: 'P2P 5% Fee',
      icon: Send,
      gradient: 'from-blue-500 to-indigo-700',
      textGrad: 'text-blue-300',
      border: 'border-blue-500/40',
      shadow: 'shadow-blue-500/20',
    },
    {
      id: 'liveGame' as const,
      label: '🎮 Live Game',
      desc: 'Stream Caller',
      icon: Radio,
      gradient: 'from-red-500 to-pink-700',
      textGrad: 'text-red-300',
      border: 'border-red-500/40',
      shadow: 'shadow-red-500/20',
    },
    {
      id: 'referral' as const,
      label: '👥 Referral',
      desc: '8-Level Tree',
      icon: Users,
      gradient: 'from-purple-500 to-violet-700',
      textGrad: 'text-purple-300',
      border: 'border-purple-500/40',
      shadow: 'shadow-purple-500/20',
    },
    {
      id: 'income' as const,
      label: '💎 Income',
      desc: 'MLM Ledger',
      icon: Sparkles,
      gradient: 'from-cyan-500 to-blue-700',
      textGrad: 'text-cyan-300',
      border: 'border-cyan-500/40',
      shadow: 'shadow-cyan-500/20',
    },
    {
      id: 'freeTickets' as const,
      label: '🎁 Free Ticket',
      desc: 'Lucky Passes',
      icon: Gift,
      gradient: 'from-yellow-400 to-amber-600',
      textGrad: 'text-yellow-300',
      border: 'border-yellow-400/40',
      shadow: 'shadow-yellow-400/20',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-300">
          ⚡ QUICK SHORTCUTS
        </span>
        <span className="text-[10px] text-amber-400 font-bold">Fast One-Tap Actions</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onAction(act.id)}
              className={`p-3 rounded-2xl bg-gradient-to-b from-[#101438]/90 to-[#090b22]/90 border ${act.border} hover:border-white/40 shadow-lg ${act.shadow} flex flex-col items-center justify-center text-center transition-all hover:scale-105 active:scale-95 cursor-pointer group`}
            >
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${act.gradient} flex items-center justify-center text-white shadow-md mb-2 group-hover:rotate-6 transition`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-white whitespace-nowrap">
                {act.label}
              </span>
              <span className="text-[9px] text-slate-400 font-medium truncate max-w-full">
                {act.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
