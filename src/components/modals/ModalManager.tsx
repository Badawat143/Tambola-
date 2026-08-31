import React from 'react';
import { useTambola } from '../../context/TambolaContext';
import { LiveGameModal } from './LiveGameModal';
import { BuyTicketModal } from './BuyTicketModal';
import { MyTicketsModal } from './MyTicketsModal';
import { ReferralModal } from './ReferralModal';
import { PrizesModal } from './PrizesModal';
import { WinnersModal } from './WinnersModal';
import { SupportModal } from './SupportModal';
import { LegalModal } from './LegalModal';
import { ResponsibleGamingModal } from './ResponsibleGamingModal';
import { AdminPanelModal } from './AdminPanelModal';
import { AuthModal } from './AuthModal';
import { UserSwitcherModal } from './UserSwitcherModal';
import { UserDashboardModal } from './UserDashboardModal';
import { X, Trophy, Sparkles, UserPlus, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ModalManager: React.FC = () => {
  const {
    activeModal,
    activeWinnerFlash,
    dismissWinnerFlash,
    activeReferralFlash,
    dismissReferralFlash,
    openUserDashboard,
  } = useTambola();

  const renderActiveModal = () => {
    if (!activeModal) return null;

    switch (activeModal) {
      case 'userDashboard':
      case 'deposit':
      case 'withdraw':
        return <UserDashboardModal />;
      case 'playLive':
        return <LiveGameModal />;
      case 'buyTicket':
        return <BuyTicketModal />;
      case 'myTickets':
        return <MyTicketsModal />;
      case 'referral':
        return <ReferralModal />;
      case 'prizes':
        return <PrizesModal />;
      case 'winners':
        return <WinnersModal />;
      case 'support':
        return <SupportModal />;
      case 'legal':
        return <LegalModal />;
      case 'responsibleGaming':
        return <ResponsibleGamingModal />;
      case 'admin':
        return <AdminPanelModal />;
      case 'login':
      case 'register':
        return <AuthModal />;
      case 'userSwitcher':
        return <UserSwitcherModal />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderActiveModal()}

      {/* Global Server-Verified Live Winner Flash Overlay */}
      {activeWinnerFlash && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in text-slate-100">
          <div className="relative max-w-md w-full bg-gradient-to-b from-amber-500/20 via-[#181136] to-black border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
            <div className="absolute top-3 right-3">
              <button
                onClick={dismissWinnerFlash}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10 transition-all cursor-pointer"
                title="Dismiss announcement"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-4xl shadow-lg shadow-amber-400/50 animate-bounce">
              🏆
            </div>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 uppercase tracking-wider mt-3">
              OFFICIAL WINNER FLASH
            </h3>
            <p className="text-xs text-amber-300/80 font-bold uppercase tracking-widest mt-0.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Server-Verified Claim Payout
              <Sparkles className="w-3.5 h-3.5" />
            </p>

            <div className="my-5 bg-black/60 rounded-2xl p-4 border border-amber-500/30 text-left space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Winner:</span>
                <span className="font-bold text-white text-base">{activeWinnerFlash.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Player ID:</span>
                <span className="font-mono font-bold text-pink-400">{activeWinnerFlash.userId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ticket #:</span>
                <span className="font-mono font-bold text-amber-300">#{activeWinnerFlash.ticketNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Winning Category:</span>
                <span className="font-bold text-purple-300">{activeWinnerFlash.prizeName}</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-white/10">
                <span className="font-bold text-emerald-400">Prize Credited:</span>
                <span className="font-mono text-xl font-black text-emerald-400">₹{activeWinnerFlash.prizeAmount} VP</span>
              </div>
            </div>

            <button
              onClick={dismissWinnerFlash}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/40 hover:brightness-110 cursor-pointer"
            >
              🎉 CONGRATULATIONS!
            </button>
          </div>
        </div>
      )}

      {/* Global Real-Time Direct Referral Celebration Flash Overlay */}
      {activeReferralFlash && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in text-slate-100">
          <div className="relative max-w-md w-full bg-gradient-to-b from-emerald-500/25 via-[#0e172e] to-black border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
            <div className="absolute top-3 right-3">
              <button
                onClick={dismissReferralFlash}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10 transition-all cursor-pointer"
                title="Dismiss announcement"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-400 to-teal-200 flex items-center justify-center text-4xl shadow-lg shadow-emerald-400/50 animate-bounce">
              🤝
            </div>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 uppercase tracking-wider mt-3">
              NEW DIRECT REFERRAL!
            </h3>
            <p className="text-xs text-emerald-300/90 font-bold uppercase tracking-widest mt-0.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Level 1 Network Auto-Updated
              <Sparkles className="w-3.5 h-3.5" />
            </p>

            <div className="my-5 bg-black/60 rounded-2xl p-4 border border-emerald-500/30 text-left space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">New Member:</span>
                <span className="font-bold text-white text-base">{activeReferralFlash.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">User ID:</span>
                <span className="font-mono font-bold text-pink-400">{activeReferralFlash.userId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Referral Code:</span>
                <span className="font-mono font-bold text-amber-300">{activeReferralFlash.referralCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Your Level 1 Directs:</span>
                <span className="font-mono font-bold text-emerald-400">{activeReferralFlash.totalDirects} Members</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-white/10">
                <span className="font-bold text-cyan-300">Lifetime Benefit:</span>
                <span className="font-mono text-sm font-black text-cyan-300">2.0% Gameplay Commission</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={dismissReferralFlash}
                className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  dismissReferralFlash();
                  openUserDashboard('referral');
                }}
                className="py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/40 hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Team Tree</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
