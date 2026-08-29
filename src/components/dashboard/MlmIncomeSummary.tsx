import React, { useState } from 'react';
import { User, ReferralDownlineStats } from '../../types/tambola';
import {
  Sparkles,
  TrendingUp,
  Award,
  Gift,
  Users,
  Copy,
  Check,
  Share2,
  Send,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface MlmIncomeSummaryProps {
  currentUser: User;
  downlineStats: ReferralDownlineStats;
  onViewDirectMembers: () => void;
  onViewCommission: () => void;
}

export const MlmIncomeSummary: React.FC<MlmIncomeSummaryProps> = ({
  currentUser,
  downlineStats,
  onViewDirectMembers,
  onViewCommission,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const directIncome = currentUser.directIncomeEarnings || 850;
  const levelIncome = currentUser.referralEarnings || 3750;
  const winningIncome = currentUser.gameWinnings || 1250;
  const rewardIncome = 500;
  const totalIncome = directIncome + levelIncome + winningIncome + rewardIncome;

  const referralLink =
    downlineStats?.referralLink ||
    `https://apnatambola.in/register?ref=${currentUser.referralCode || 'AT10245'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 Play APNA TAMBOLA with me! Win up to 70% prize pool and earn 8-level lifetime team income! Use referral code: ${currentUser.referralCode || 'AT10245'}\n\nJoin now: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `🎉 Play APNA TAMBOLA with me! Win up to 70% prize pool and earn 8-level team commissions! Use code: ${currentUser.referralCode || 'AT10245'}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 💎 MLM INCOME SUMMARY (6 Cols) */}
      <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#120d2c] via-[#1a1442] to-[#0d0924] border border-purple-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                💎 MLM INCOME SUMMARY
              </h4>
              <p className="text-[10px] text-slate-400">Periodic breakdown & total credited</p>
            </div>
          </div>

          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/40 font-mono">
            Auto-Settled
          </span>
        </div>

        {/* 4 Periodic Cards: Today, This Week, This Month, Total */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Today</span>
            <p className="text-base font-black text-emerald-400 font-mono mt-0.5">₹250.00</p>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase">This Week</span>
            <p className="text-base font-black text-cyan-400 font-mono mt-0.5">₹1,250.00</p>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase">This Month</span>
            <p className="text-base font-black text-pink-400 font-mono mt-0.5">₹4,850.00</p>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/40 bg-purple-950/20 text-center">
            <span className="text-[9px] text-purple-300 font-bold uppercase">Total Income</span>
            <p className="text-base font-black text-amber-300 font-mono mt-0.5">₹{totalIncome.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* 4 Category Breakdown Progress Bars */}
        <div className="space-y-2.5 pt-2 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                <span>🎯 Direct Income (1.0%)</span>
              </span>
              <span className="font-mono font-bold text-pink-300">₹{directIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/60 overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>💎 8-Level Team Income (4.6%)</span>
              </span>
              <span className="font-mono font-bold text-purple-300">₹{levelIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/60 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '55%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>🏆 Winning Game Claims</span>
              </span>
              <span className="font-mono font-bold text-amber-300">₹{winningIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/60 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>🎁 Other Free Ticket & Lucky Rewards</span>
              </span>
              <span className="font-mono font-bold text-emerald-300">₹{rewardIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/60 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 👥 DIRECT REFERRAL & 🔗 REFERRAL LINK (6 Cols) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Direct Referrals Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1838] via-[#10204d] to-[#080d24] border border-blue-500/40 p-5 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">
                👥 DIRECT REFERRALS
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-white font-mono">25</span>
                <span className="text-xs text-slate-400">Members</span>
              </div>
              <div className="flex items-center gap-3 text-xs mt-1">
                <span className="text-emerald-400 font-bold">🟢 Active: 18</span>
                <span className="text-slate-500 font-bold">⚪ Inactive: 7</span>
              </div>
            </div>
          </div>

          <button
            onClick={onViewDirectMembers}
            className="py-2.5 px-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-black text-xs transition cursor-pointer"
          >
            VIEW MEMBERS →
          </button>
        </div>

        {/* 🔗 MY REFERRAL LINK CARD */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1b1438] via-[#241a4d] to-[#100b26] border border-amber-500/40 p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              🔗 MY REFERRAL LINK
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Code: <strong className="text-white">{currentUser.referralCode || 'AT10245'}</strong></span>
          </div>

          {/* Link Box */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-slate-300 overflow-hidden">
            <span className="truncate flex-1">{referralLink}</span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 hover:bg-amber-300 transition cursor-pointer shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'COPIED' : 'COPY LINK'}</span>
            </button>
          </div>

          {/* 3 Share Buttons: Share, WhatsApp, Telegram */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>SHARE</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-500/40 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WHATSAPP</span>
            </button>

            <button
              onClick={handleShareTelegram}
              className="py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-cyan-500/40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>TELEGRAM</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            *Referral relationship is persisted server-side. You earn lifetime 8-level commissions from all ticket purchases!
          </p>
        </div>
      </div>
    </div>
  );
};
