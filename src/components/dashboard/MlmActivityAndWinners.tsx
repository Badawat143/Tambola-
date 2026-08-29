import React, { useState } from 'react';
import {
  WinnerItem,
  DepositRecord,
  WithdrawalRecord,
  CommissionLedgerItem,
  FreeTicketWinner,
  TambolaTicket,
} from '../../types/tambola';
import {
  Activity,
  Trophy,
  Gift,
  History,
  CheckCircle2,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  Ticket,
  Percent,
  Send,
  Sparkles,
} from 'lucide-react';

interface MlmActivityAndWinnersProps {
  winners: WinnerItem[];
  freeTicketWinners: FreeTicketWinner[];
  deposits: DepositRecord[];
  withdrawals: WithdrawalRecord[];
  commissionLedger: CommissionLedgerItem[];
  onViewAllWinners: () => void;
  onViewFreeTickets: () => void;
}

export const MlmActivityAndWinners: React.FC<MlmActivityAndWinnersProps> = ({
  winners,
  freeTicketWinners,
  deposits,
  withdrawals,
  commissionLedger,
  onViewAllWinners,
  onViewFreeTickets,
}) => {
  const [txTab, setTxTab] = useState<string>('all');

  // Team live activity items
  const teamActivities = [
    { id: 1, icon: '🟢', text: 'User AT10245 purchased a ₹20 Ticket', time: '2 mins ago', color: 'text-emerald-300' },
    { id: 2, icon: '🟢', text: 'User AT10288 joined Game #AT10025', time: '5 mins ago', color: 'text-cyan-300' },
    { id: 3, icon: '🏆', text: 'User AT10320 won EARLY 5 (₹450 credited)', time: '11 mins ago', color: 'text-yellow-300' },
    { id: 4, icon: '💎', text: 'Level 1 Commission ₹2.50 credited to Ticket Wallet', time: '18 mins ago', color: 'text-pink-300' },
    { id: 5, icon: '🎟️', text: 'Free Ticket Lucky Pass #FT8821 received', time: '35 mins ago', color: 'text-purple-300' },
    { id: 6, icon: '🟢', text: 'User AT10412 completed ₹500 instant deposit', time: '42 mins ago', color: 'text-emerald-300' },
  ];

  // Verified winners list
  const displayWinners = winners.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* ROW 1: TEAM ACTIVITY + RECENT WINNERS + FREE TICKETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        
        {/* 1. TEAM ACTIVITY FEED (4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-[#0e1233] to-[#070a21] border border-blue-500/30 p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                TEAM & GAME ACTIVITY
              </h4>
            </div>
            <span className="text-[9px] font-bold text-emerald-400 font-mono">LIVE FEED</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {teamActivities.map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5 text-xs hover:border-white/20 transition"
              >
                <span className="text-sm shrink-0">{act.icon}</span>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className={`font-semibold ${act.color} truncate`}>{act.text}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. RECENT VERIFIED WINNERS (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#1a1236] to-[#0d0a22] border border-amber-500/30 p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                🏆 RECENT VERIFIED WINNERS
              </h4>
            </div>
            <button
              onClick={onViewAllWinners}
              className="text-[10px] font-bold text-amber-300 hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2">
            {displayWinners.map((w) => (
              <div
                key={w.id}
                className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    {w.winnerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white leading-tight">{w.winnerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {w.prizeCategory} • Game #{w.gameId}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-black text-amber-400">
                    +₹{w.prizeAmount.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[9px] text-emerald-400">✓ Verified Claim</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. FREE TICKET SECTION (3 Cols) */}
        <div className="lg:col-span-3 rounded-3xl bg-gradient-to-br from-[#1e0f33] to-[#10071e] border border-pink-500/30 p-5 shadow-2xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-pink-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                🎁 MY FREE TICKETS
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">Lucky passes from previous live draws</p>

            <div className="grid grid-cols-3 gap-1.5 my-3 text-center">
              <div className="p-2 rounded-xl bg-black/40 border border-emerald-500/30">
                <span className="text-[8px] text-slate-400 uppercase">Available</span>
                <p className="text-base font-black text-emerald-400 font-mono">5</p>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-pink-500/30">
                <span className="text-[8px] text-slate-400 uppercase">Used</span>
                <p className="text-base font-black text-pink-400 font-mono">2</p>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-slate-700">
                <span className="text-[8px] text-slate-400 uppercase">Expired</span>
                <p className="text-base font-black text-slate-400 font-mono">0</p>
              </div>
            </div>
          </div>

          <button
            onClick={onViewFreeTickets}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black text-xs shadow-md transition cursor-pointer"
          >
            VIEW FREE PASSES
          </button>
        </div>
      </div>

      {/* ROW 2: RECENT TRANSACTIONS LEDGER */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c0e2a] via-[#101438] to-[#07091a] border border-indigo-500/30 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              📜 RECENT TRANSACTIONS & SETTLEMENTS
            </h4>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1">
            {['all', 'deposit', 'ticket', 'prize', 'withdrawal', 'transfer', 'commission'].map((f) => (
              <button
                key={f}
                onClick={() => setTxTab(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                  txTab === f
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table / Rows */}
        <div className="space-y-2">
          {/* Mock recent transaction records */}
          {[
            {
              type: 'Deposit',
              title: 'UPI Add Money (Approved)',
              amount: '+₹500.00',
              txId: 'TXN891240982',
              date: '28 Aug 2026, 12:40 PM',
              status: 'Completed',
              color: 'text-emerald-400',
              icon: ArrowDownToLine,
            },
            {
              type: 'Ticket',
              title: 'Ticket #84920 Purchase (Game AT10025)',
              amount: '-₹20.00',
              txId: 'TCK491823901',
              date: '28 Aug 2026, 11:15 AM',
              status: 'Completed',
              color: 'text-pink-400',
              icon: Ticket,
            },
            {
              type: 'Prize',
              title: 'Full House 1 Verified Claim',
              amount: '+₹1,250.00',
              txId: 'PRZ190481239',
              date: '27 Aug 2026, 09:30 PM',
              status: 'Completed',
              color: 'text-amber-400',
              icon: Trophy,
            },
            {
              type: 'Transfer',
              title: 'P2P Transfer to AT10030 (5% Fee Deducted)',
              amount: '-₹100.00',
              txId: 'TRF778192301',
              date: '27 Aug 2026, 04:20 PM',
              status: 'Completed',
              color: 'text-blue-400',
              icon: Send,
            },
            {
              type: 'Commission',
              title: 'Level 1 Gameplay Commission',
              amount: '+₹18.00',
              txId: 'CMS551829301',
              date: '27 Aug 2026, 02:10 PM',
              status: 'Completed',
              color: 'text-purple-400',
              icon: Percent,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Ref: {item.txId} • {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                  <span className={`font-mono font-black text-sm ${item.color}`}>
                    {item.amount}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase">
                    ● {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
