import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import {
  X,
  Users,
  Copy,
  CheckCircle,
  Share2,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const ReferralModal: React.FC = () => {
  const { currentUser, downlineStats, setActiveModal } = useTambola();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downlineStats.referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-3xl w-full rounded-3xl border-2 border-purple-500/40 bg-[#0c0d26] shadow-2xl p-4 sm:p-6 my-4 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">REFERRAL &amp; DOWNLINE DASHBOARD</h2>
              <p className="text-xs text-slate-400">User: {currentUser.name} (Code: {currentUser.referralCode})</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-5 overflow-y-auto max-h-[64vh] pr-1">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct (Lvl 1)</span>
              <p className="text-2xl font-black text-pink-400 font-mono mt-1">
                {downlineStats.directMembersCount}
              </p>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Team (Lvl 1-8)</span>
              <p className="text-2xl font-black text-blue-400 font-mono mt-1">
                {downlineStats.totalTeamCount}
              </p>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Referral Earnings</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                ₹{Math.round((downlineStats.totalReferralIncome + currentUser.referralEarnings) * 100) / 100}
              </p>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Game Winnings</span>
              <p className="text-2xl font-black text-amber-300 font-mono mt-1">
                ₹{currentUser.gameWinnings}
              </p>
            </div>
          </div>

          {/* Quick Copy Link Bar */}
          <div className="p-4 bg-[#080918] border border-white/10 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-slate-300">Your Shareable Referral Link</span>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-pink-300 truncate">
                {downlineStats.referralLink}
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              >
                {copiedLink ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* 8-Level Breakdown Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                8-LEVEL HIERARCHY BREAKDOWN (4.6% Total Commission)
              </h3>
              <span className="text-[10px] text-amber-400 font-bold">
                Instant Wallet Credit on Ticket Purchase
              </span>
            </div>

            {downlineStats.levelStats.map((lvl) => (
              <div
                key={lvl.level}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-black text-xs flex items-center justify-center">
                    L{lvl.level}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-white">Level {lvl.level} {lvl.level === 1 ? '(Direct)' : 'Downline'}</strong>
                      <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 font-bold text-[10px] rounded">
                        {lvl.percent}% Commission
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lvl.members.length > 0
                        ? `Members: ${lvl.members.map((m) => `${m.user.name} (${m.user.id})`).join(', ')}`
                        : 'No downline members joined at this level yet.'}
                    </p>
                  </div>
                </div>

                <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                  <span className="text-xs text-slate-400 block">{lvl.membersCount} Member(s)</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    ₹{Math.round(lvl.totalEarnings * 100) / 100} Earned
                  </span>
                </div>
              </div>
            ))}
          </div>
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
