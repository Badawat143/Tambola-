import React from 'react';
import { User } from '../../types/tambola';
import {
  Wallet,
  Ticket,
  Trophy,
  Sparkles,
  PlusCircle,
  Send,
  ArrowUpRight,
  History,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface MlmWalletCardsProps {
  currentUser: User;
  onAddMoney: () => void;
  onTransfer: () => void;
  onBuyTicket: () => void;
  onWithdraw: () => void;
  onViewIncome: () => void;
  onViewHistory?: () => void;
}

export const MlmWalletCards: React.FC<MlmWalletCardsProps> = ({
  currentUser,
  onAddMoney,
  onTransfer,
  onBuyTicket,
  onWithdraw,
  onViewIncome,
  onViewHistory,
}) => {
  const depositBal = currentUser.depositWallet ?? 0;
  const ticketBal = currentUser.ticketWallet ?? 0;
  const winningBal = currentUser.winningWallet ?? currentUser.gameWinnings ?? 0;
  const totalIncome =
    (currentUser.directIncomeEarnings || 0) +
    (currentUser.referralEarnings || 0) +
    (currentUser.gameWinnings || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. 💰 MAIN WALLET */}
      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1a3b] via-[#102454] to-[#08122c] border-2 border-blue-500/50 p-5 shadow-2xl hover:border-blue-400 hover:shadow-blue-500/20 transition-all">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition"></div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/25 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-blue-200">
                💰 MAIN WALLET
              </span>
              <p className="text-[10px] text-blue-300/80">Approved Deposits</p>
            </div>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
            Deposit
          </span>
        </div>

        <div className="my-3 relative z-10">
          <span className="text-xs text-blue-300 font-mono">₹</span>
          <span className="text-3xl font-black text-white font-mono tracking-tight ml-1">
            {depositBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 relative z-10">
          <button
            onClick={onAddMoney}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ADD MONEY</span>
          </button>
          <button
            onClick={onViewHistory || onAddMoney}
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-blue-300" />
            <span>HISTORY</span>
          </button>
        </div>
      </div>

      {/* 2. 🎟️ TICKET WALLET */}
      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-[#2f0d3a] via-[#441154] to-[#1c0624] border-2 border-pink-500/50 p-5 shadow-2xl hover:border-pink-400 hover:shadow-pink-500/20 transition-all">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition"></div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/25 border border-pink-400/40 flex items-center justify-center text-pink-300 shadow-inner">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-pink-200">
                🎟️ TICKET WALLET
              </span>
              <p className="text-[10px] text-pink-300/80">Tickets & P2P Transfer</p>
            </div>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 animate-pulse">
            Transferable
          </span>
        </div>

        <div className="my-3 relative z-10">
          <span className="text-xs text-pink-300 font-mono">₹</span>
          <span className="text-3xl font-black text-pink-200 font-mono tracking-tight ml-1">
            {ticketBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10 relative z-10">
          <button
            onClick={onBuyTicket}
            className="py-2.5 px-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 text-white font-black text-[11px] flex items-center justify-center gap-1 shadow-lg shadow-pink-500/25 transition cursor-pointer"
          >
            <Ticket className="w-3 h-3 shrink-0" />
            <span>BUY TICKET</span>
          </button>
          <button
            onClick={onTransfer}
            className="py-2.5 px-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-black text-[11px] flex items-center justify-center gap-1 shadow-lg shadow-blue-500/25 transition cursor-pointer"
          >
            <Send className="w-3 h-3 shrink-0" />
            <span>TRANSFER</span>
          </button>
          <button
            onClick={onViewHistory || onBuyTicket}
            className="py-2.5 px-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center justify-center gap-1 border border-white/15 transition cursor-pointer"
          >
            <History className="w-3 h-3 shrink-0 text-pink-300" />
            <span>HISTORY</span>
          </button>
        </div>
      </div>

      {/* 3. 🏆 WITHDRAWAL WALLET */}
      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-[#3b270a] via-[#4d330c] to-[#241704] border-2 border-amber-500/50 p-5 shadow-2xl hover:border-amber-400 hover:shadow-amber-500/20 transition-all">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition"></div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/25 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-amber-200">
                🏆 WITHDRAWAL WALLET
              </span>
              <p className="text-[10px] text-amber-300/80">Verified Game Claims</p>
            </div>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Instant Payout
          </span>
        </div>

        <div className="my-3 relative z-10">
          <span className="text-xs text-amber-300 font-mono">₹</span>
          <span className="text-3xl font-black text-amber-300 font-mono tracking-tight ml-1">
            {winningBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 relative z-10">
          <button
            onClick={onWithdraw}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/25 transition cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>WITHDRAW</span>
          </button>
          <button
            onClick={onViewHistory || onWithdraw}
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-amber-300" />
            <span>HISTORY</span>
          </button>
        </div>
      </div>

      {/* 4. 💎 TOTAL INCOME */}
      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-[#130e38] via-[#21175e] to-[#0c0926] border-2 border-purple-500/50 p-5 shadow-2xl hover:border-purple-400 hover:shadow-purple-500/20 transition-all">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition"></div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/25 border border-purple-400/40 flex items-center justify-center text-purple-200 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-purple-200">
                💎 TOTAL INCOME
              </span>
              <p className="text-[10px] text-purple-300/80">Direct + Level + Winnings</p>
            </div>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/40">
            MLM Earnings
          </span>
        </div>

        <div className="my-3 relative z-10">
          <span className="text-xs text-purple-300 font-mono">₹</span>
          <span className="text-3xl font-black text-white font-mono tracking-tight ml-1">
            {totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="pt-2 border-t border-white/10 relative z-10">
          <button
            onClick={onViewIncome}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/25 transition cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-200" />
            <span>VIEW DETAILS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
