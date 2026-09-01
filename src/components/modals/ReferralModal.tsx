import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { ApnaTambolaLogo } from '../ApnaTambolaLogo';
import {
  X,
  Users,
  Copy,
  CheckCircle,
  Share2,
  TrendingUp,
  Award,
  Sparkles,
  MessageSquare,
  ShieldAlert,
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
    navigator.clipboard.writeText(currentUser.referralCode || currentUser.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const msg = `🎱 *APNA TAMBOLA* 👑\n\nमेरे साथ लाइव तंबोला खेलें और 8 लेवल टीम इनकम पाएं!\n\n👉 *ज्वाइन लिंक:* ${downlineStats.referralLink}\n🔑 *रेफरल कोड:* ${currentUser.referralCode || currentUser.id}\n\n(नोट: डिपॉजिट पर नहीं, बल्कि जब भी टीम टिकट खरीदेगी, आपको 8 लेवल तक लाइफटाइम कमीशन मिलेगा!)`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-3xl w-full rounded-3xl border-2 border-purple-500/40 bg-[#0c0d26] shadow-2xl p-4 sm:p-6 my-4 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        {/* Modal Header with Apna Tambola Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ApnaTambolaLogo size="sm" showText={false} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                रेफरल व 8-लेवल टीम डैशबोर्ड (REFERRAL &amp; DOWNLINE)
              </h2>
              <p className="text-xs text-slate-400">
                User: <span className="text-amber-300 font-bold">{currentUser.name}</span> (Code: <span className="font-mono text-pink-300">{currentUser.referralCode || currentUser.id}</span>)
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto max-h-[64vh] pr-1">
          {/* Official Rule Notice */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/50 to-indigo-950/40 border border-amber-500/40 text-xs space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>टीम इनकम नियम (Team Income Rules):</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              🚫 <strong className="text-red-400">डिपॉजिट पर कोई कमीशन नहीं है।</strong> अपलाइन को इनकम तब मिलती है जब डाउनलाइन यूजर <strong className="text-emerald-400">टिकट खरीद कर गेम खेलता है</strong>। यूजर जितनी अधिक टिकट खरीद कर गेम खेलेगा, 8 लेवल तक उतनी अधिक इनकम तुरंत वॉलेट में प्राप्त होगी!
            </p>
          </div>

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
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ticket Commissions</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                ₹{Math.round((downlineStats.totalReferralIncome + (currentUser.referralEarnings || 0)) * 100) / 100}
              </p>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Game Winnings</span>
              <p className="text-2xl font-black text-amber-300 font-mono mt-1">
                ₹{currentUser.gameWinnings || 0}
              </p>
            </div>
          </div>

          {/* Quick Share Link & Poster Bar with Official Logo */}
          <div className="p-4 bg-[#080918] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Your Shareable Join Link (रेफरल लिंक)</span>
              </span>
              <button
                onClick={() => setActiveModal('shareReferral')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>लोगो कार्ड पोस्टर देखें</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-pink-300 truncate select-all">
                {downlineStats.referralLink}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  {copiedLink ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'कॉपी हुआ' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* 8-Level Breakdown Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                8-LEVEL HIERARCHY BREAKDOWN (4.6% Total on Ticket Play)
              </h3>
              <span className="text-[10px] text-amber-400 font-bold">
                Instant Wallet Credit on Ticket Purchase
              </span>
            </div>

            {downlineStats.levelStats.map((lvl) => (
              <div
                key={lvl.level}
                className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
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
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setActiveModal('shareReferral')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>लोगो के साथ शेयर पोस्टर (Share Card)</span>
          </button>

          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
