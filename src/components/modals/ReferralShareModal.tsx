import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { ApnaTambolaLogo } from '../ApnaTambolaLogo';
import {
  X,
  Copy,
  CheckCircle2,
  Share2,
  MessageSquare,
  QrCode,
  Sparkles,
  Users,
  Percent,
  Flame,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const ReferralShareModal: React.FC = () => {
  const { currentUser, downlineStats, setActiveModal, settings } = useTambola();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCardText, setCopiedCardText] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://apnatambola.in';
  const myRefLink =
    downlineStats?.referralLink ||
    `${origin}/register?ref=${currentUser.referralCode || currentUser.id || 'APNA100'}`;

  const shareText = `🎱 *APNA TAMBOLA - LIVE FUN • LIVE WIN* 👑\n\nनमस्ते! मेरे साथ अपना तंबोला (Apna Tambola) खेलें और हर गेम में 70% तक ईनाम जीतें!\n\n🎟️ *8-लेवल टीम कमीशन:* जब भी टीम टिकट खरीदेगी, आपको 8 लेवल तक लाइफटाइम कमीशन मिलेगा!\n🚫 *डिपॉजिट पर कोई कमीशन नहीं* - केवल टिकट खरीद पर सुरक्षित व रियल इनकम!\n\n👉 *ज्वाइन लिंक:* ${myRefLink}\n🔑 *रेफरल कोड:* ${currentUser.referralCode || currentUser.id}\n\nअभी रजिस्टर करें और पहले डिपॉज़िट पर ₹10 फ्री बोनस पाएं! 🚀`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(myRefLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode || currentUser.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyAllText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedCardText(true);
    setTimeout(() => setCopiedCardText(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'APNA TAMBOLA - Live Fun • Live Win',
          text: shareText,
          url: myRefLink,
        })
        .catch(() => handleCopyLink());
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-xl w-full rounded-3xl border-2 border-amber-500/40 bg-[#07091f] shadow-2xl p-4 sm:p-6 my-4 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                रेफरल लिंक व ज्वाइन कार्ड (Join Link &amp; Share Poster)
              </h2>
              <p className="text-[11px] text-slate-400">
                ऑफिशियल लोगो के साथ अपना रेफरल लिंक और निमंत्रण कार्ड शेयर करें
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

        {/* Scrollable Content */}
        <div className="py-4 space-y-4 overflow-y-auto max-h-[66vh] pr-1 custom-scrollbar">
          {/* Main Visual Invitation Poster Card */}
          <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#121644] via-[#0d1033] to-[#06081e] border-2 border-amber-400/50 shadow-2xl text-center space-y-4 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"></div>

            {/* Official Circular Logo with Crown */}
            <div className="flex justify-center pt-1">
              <ApnaTambolaLogo size="xl" showText={false} />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                APNA TAMBOLA
              </h3>
              <p className="text-xs font-bold text-pink-400 tracking-wider uppercase mt-0.5">
                LIVE FUN • LIVE WIN • 8-LEVEL TEAM EARNINGS
              </p>
            </div>

            {/* User Invitation Plaque */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Invited By / रेफ़रर:</span>
                <span className="font-bold text-white text-sm">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Referral Code / कोड:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-amber-300 text-sm px-2 py-0.5 rounded bg-amber-400/15 border border-amber-400/30">
                    {currentUser.referralCode || currentUser.id}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-xs cursor-pointer"
                    title="Copy Code"
                  >
                    {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Official MLM Earning Rules (Ticket Purchase Only) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>टीम इनकम नियम (8-Level Plan Rules):</span>
              </div>
              <ul className="text-slate-200 text-[11px] space-y-1.5 pl-4 list-disc leading-relaxed">
                <li>
                  <strong className="text-red-400">डिपॉजिट पर कोई कमीशन नहीं:</strong> यूजर जब वॉलेट में पैसे लोड/डिपॉजिट करेगा, तब अपलाइन को कोई कमीशन नहीं मिलेगा।
                </li>
                <li>
                  <strong className="text-emerald-400">टिकट खरीदकर गेम खेलने पर इनकम:</strong> डाउनलाइन यूजर जितना अधिक टिकट खरीदकर गेम खेलेगा, टिकट की कीमत पर पूरे 8 लेवल तक लाइफटाइम कमीशन (4.6% कुल) मिलेगा!
                </li>
              </ul>

              {/* 8 Level Commission Table */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 pt-1.5">
                {[
                  { lvl: 'L1', pct: '2.0%' },
                  { lvl: 'L2', pct: '1.0%' },
                  { lvl: 'L3', pct: '0.5%' },
                  { lvl: 'L4', pct: '0.3%' },
                  { lvl: 'L5', pct: '0.3%' },
                  { lvl: 'L6', pct: '0.2%' },
                  { lvl: 'L7', pct: '0.2%' },
                  { lvl: 'L8', pct: '0.1%' },
                ].map((item, idx) => (
                  <div key={idx} className="p-1 rounded-lg bg-black/50 border border-white/10 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold">{item.lvl}</span>
                    <span className="text-[10px] font-black text-amber-300 font-mono">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code and Join URL */}
            <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-[11px] text-slate-400 block font-bold text-left">
                Direct Registration Link:
              </span>
              <div className="flex items-center gap-2">
                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-pink-300 truncate text-left select-all">
                  {myRefLink}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'कॉपी हुआ' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Sharing Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>व्हाट्सएप पर शेयर करें</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>शेयर लिंक (Share Link)</span>
            </button>

            <button
              onClick={handleCopyAllText}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer transition-all active:scale-95"
            >
              {copiedCardText ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCardText ? 'संदेश कॉपी हुआ!' : 'पूरा मैसेज कॉपी करें'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>👑 APNA TAMBOLA Official Referral Engine</span>
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
