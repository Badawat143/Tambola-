import React, { useState } from 'react';
import { useTambola } from '../context/TambolaContext';
import { ApnaTambolaLogo } from './ApnaTambolaLogo';
import {
  Users,
  Copy,
  CheckCircle,
  Share2,
  TrendingUp,
  Award,
  Wallet,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export const ReferralSection: React.FC = () => {
  const {
    currentUser,
    allUsers,
    downlineStats,
    settings,
    setActiveModal,
    switchUser,
  } = useTambola();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downlineStats.referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode || currentUser.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `🎱 *APNA TAMBOLA - LIVE FUN • LIVE WIN* 👑\n\nनमस्ते! मेरे साथ अपना तंबोला खेलें और 8-लेवल टीम कमीशन पाएं!\n\n👉 *ज्वाइन लिंक:* ${downlineStats.referralLink}\n🔑 *रेफरल कोड:* ${currentUser.referralCode || currentUser.id}\n\n(डिपॉजिट पर नहीं, बल्कि जब भी टीम टिकट खरीदेगी, आपको 8 लेवल तक लाइफटाइम कमीशन मिलेगा!)`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="referral-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121035] via-[#1a0f3c] to-[#0c0d24] border-2 border-purple-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Heading with Logo */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="flex justify-center mb-3">
            <ApnaTambolaLogo size="md" showText={true} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-pink-400" />
            <span>8-LEVEL PASSIVE COMMISSION ENGINE (4.6% TOTAL ON TICKET PURCHASES)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            👥 REFER &amp; EARN
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Build your team network and earn multi-level commissions on every ticket bought across 8 levels for life!
          </p>

          {/* Explicit Hindi / English Plan Rules */}
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 text-xs text-slate-200 text-left sm:text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>कमीशन नियम (Commission Rule):</span>
            </div>
            <p className="text-xs text-slate-300">
              🚫 <strong className="text-red-400">डिपॉजिट पर कोई कमीशन नहीं है।</strong> अपलाइन को कमीशन तब मिलता है जब यूजर <strong className="text-emerald-400">टिकट खरीद कर गेम खेलता है</strong>। जितनी टिकटें खरीदी जाएंगी, उतना 8 लेवल तक लाइफटाइम कमीशन तुरंत वॉलेट में मिलेगा!
            </p>
          </div>
        </div>

        {/* User Referral Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Referral ID */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-purple-500/30 bg-[#0f1130]/90">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Referral Code
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-amber-300 font-mono tracking-wider">
                {currentUser.referralCode || currentUser.id}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer"
                title="Copy Referral Code"
              >
                {copiedCode ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Share code during registration</p>
          </div>

          {/* Direct Members (Level 1) */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-pink-500/30 bg-[#0f1130]/90">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Direct Members</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">Lvl 1 (2.0%)</span>
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-pink-400 font-mono">
                {downlineStats.directMembersCount}
              </span>
              <span className="text-xs text-slate-400">Direct Referrals</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Users directly registered under you</p>
          </div>

          {/* Total Team Members (Level 1 to 8) */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-blue-500/30 bg-[#0f1130]/90">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Team Members</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Lvl 1-8</span>
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-blue-400 font-mono">
                {downlineStats.totalTeamCount}
              </span>
              <span className="text-xs text-slate-400">Total Downline</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Complete multi-level network</p>
          </div>

          {/* Referral Earnings */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-500/30 bg-[#0f1130]/90">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Ticket Commissions</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Wallet Credit</span>
            </p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black text-emerald-400 font-mono">
                ₹{Math.round((downlineStats.totalReferralIncome + (currentUser.referralEarnings || 0)) * 100) / 100}
              </span>
            </div>
            <p className="text-[10px] text-emerald-300/80 mt-1">Earned strictly from ticket purchases</p>
          </div>
        </div>

        {/* 1-Click Referral Link Box with Share Poster Action */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/15 bg-[#0b0c24] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>Your Unique Referral Link</span>
              <span className="text-[10px] text-amber-400 font-normal">(Auto-fills referral code for new users)</span>
            </p>
            <div className="bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-xl font-mono text-xs text-pink-300 truncate select-all">
              {downlineStats.referralLink}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveModal('shareReferral')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>लोगो पोस्टर शेयर</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {copiedLink ? <CheckCircle className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'COPIED!' : 'COPY LINK'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WHATSAPP</span>
            </button>
          </div>
        </div>

        {/* Level Structure & Commission Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>8-Level Ticket Commission Structure</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Instant Credit on Every Ticket Purchase
            </span>
          </div>

          {/* Level Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {downlineStats.levelStats.map((lvl) => (
              <div
                key={lvl.level}
                className={`glass-card rounded-2xl p-3.5 text-center border transition-all ${
                  lvl.level === 1
                    ? 'border-pink-500/50 bg-pink-500/10'
                    : lvl.level === 2
                    ? 'border-purple-500/50 bg-purple-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  LEVEL {lvl.level}
                </span>
                <span className="text-lg sm:text-xl font-black text-amber-300 font-mono my-1 block">
                  {lvl.percent}%
                </span>
                <div className="pt-2 border-t border-white/10 text-[11px]">
                  <p className="text-slate-300 font-semibold">{lvl.membersCount} Members</p>
                  <p className="text-emerald-400 font-mono text-[10px]">₹{(Math.round(lvl.totalEarnings * 100) / 100).toFixed(2)} earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Downline Verification & Network Switcher */}
        <div className="bg-[#090a1c] border border-indigo-500/30 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Network Trace: Logged-in as {currentUser.name}</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Verified data trace: Level 1 Direct = {downlineStats.levelStats[0]?.membersCount || 0} members • Level 2 Downline = {downlineStats.levelStats[1]?.membersCount || 0} members
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveModal('shareReferral')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>शेयर कार्ड</span>
              </button>
              <button
                id="btn-my-referral"
                onClick={() => setActiveModal('referral')}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-1"
              >
                <span>MY REFERRAL DASHBOARD</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
