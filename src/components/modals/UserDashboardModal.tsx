import React, { useState } from 'react';
import { useTambola, DashboardTab } from '../../context/TambolaContext';
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Ticket,
  Users,
  Trophy,
  History,
  Gift,
  Bell,
  ShieldCheck,
  Headphones,
  UserCheck,
  LogOut,
  X,
  CreditCard,
  Percent,
  Layers,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  ExternalLink,
  Sparkles,
  QrCode,
  Radio,
  Play,
  Share2,
  Lock,
  FileText,
  Shield,
  Smartphone,
  Check,
  AlertCircle,
  Menu,
  PhoneCall,
  Search,
  DollarSign,
  Award,
  Send,
  Zap,
} from 'lucide-react';
import { TAMBOLA_CALLS } from '../../utils/soundEffects';
import { WinningPatternCode } from '../../types/tambola';
import { clearUserSession } from '../../services/authService';

interface UserDashboardModalProps {
  isPageMode?: boolean;
  onNavigate?: (path: string) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({ isPageMode = false, onNavigate }) => {
  const {
    activeModal,
    setActiveModal,
    currentUser,
    userDashboardTab,
    setUserDashboardTab,
    downlineStats,
    deposits,
    withdrawals,
    commissionLedger,
    freeTicketWinners,
    notifications,
    myTickets,
    availableTicketPrices,
    upcomingGames,
    activeLiveGame,
    liveCalledNumbers,
    currentCalledNumber,
    isGameCalling,
    startLiveCaller,
    pauseLiveCaller,
    callNextNumber,
    logoutUser,
    depositMoney,
    transferMoney,
    transferDepositToTicketWallet,
    requestWithdrawal,
    saveBankDetails,
    useFreeTicketToBuy,
    markNotificationAsRead,
    settings,
    verifyClaim,
    buyTicket,
    archiveHistoryRecord,
    unarchiveHistoryRecord,
    isHistoryRecordArchived,
  } = useTambola();

  if (!isPageMode && activeModal !== 'userDashboard' && activeModal !== 'deposit' && activeModal !== 'withdraw') {
    return null;
  }

  const activeTab: DashboardTab = userDashboardTab || 'dashboard';

  // Mobile sidebar drawer open/close
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [showArchivedHistory, setShowArchivedHistory] = useState<boolean>(false);

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositMethod, setDepositMethod] = useState<'UPI' | 'QR' | 'NetBanking'>('UPI');
  const [depositUtr, setDepositUtr] = useState<string>('');
  const [depositProof, setDepositProof] = useState<string | null>(null);
  const [depositMsg, setDepositMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Wallet Transfers State (P2P & Deposit -> Ticket)
  const [toTicketAmount, setToTicketAmount] = useState<number>(100);
  const [p2pRecipient, setP2pRecipient] = useState<string>('');
  const [p2pAmount, setP2pAmount] = useState<number>(200);
  const [walletFeedback, setWalletFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [payoutType, setPayoutType] = useState<'UPI' | 'Bank'>('UPI');
  const [accountHolder, setAccountHolder] = useState<string>(currentUser.bankDetails?.accountHolderName || currentUser.name);
  const [upiId, setUpiId] = useState<string>(currentUser.bankDetails?.upiId || '');
  const [accountNumber, setAccountNumber] = useState<string>(currentUser.bankDetails?.accountNumber || '');
  const [ifsc, setIfsc] = useState<string>(currentUser.bankDetails?.ifscCode || '');
  const [bankName, setBankName] = useState<string>(currentUser.bankDetails?.bankName || '');
  const [withdrawMsg, setWithdrawMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Profile Form State
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activePasswordModal, setActivePasswordModal] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Transactions Filter
  const [txFilter, setTxFilter] = useState<'all' | 'deposit' | 'ticket' | 'prize' | 'withdrawal' | 'transfer' | 'commission' | 'direct' | 'freeticket'>('all');

  // Ticket Theme Map
  const ticketThemeStyles: Record<string, { bg: string; border: string; badge: string; text: string }> = {
    green: { bg: 'from-emerald-900/60 to-emerald-950/80', border: 'border-emerald-500/50', badge: 'bg-emerald-500 text-emerald-950', text: 'text-emerald-300' },
    blue: { bg: 'from-blue-900/60 to-blue-950/80', border: 'border-blue-500/50', badge: 'bg-blue-500 text-blue-950', text: 'text-blue-300' },
    yellow: { bg: 'from-amber-900/60 to-amber-950/80', border: 'border-amber-500/50', badge: 'bg-amber-400 text-amber-950', text: 'text-amber-300' },
    red: { bg: 'from-red-900/60 to-red-950/80', border: 'border-red-500/50', badge: 'bg-red-500 text-white', text: 'text-red-300' },
    pink: { bg: 'from-pink-900/60 to-pink-950/80', border: 'border-pink-500/50', badge: 'bg-pink-500 text-pink-950', text: 'text-pink-300' },
    orange: { bg: 'from-orange-900/60 to-orange-950/80', border: 'border-orange-500/50', badge: 'bg-orange-500 text-orange-950', text: 'text-orange-300' },
    purple: { bg: 'from-purple-900/60 to-purple-950/80', border: 'border-purple-500/50', badge: 'bg-purple-500 text-white', text: 'text-purple-300' },
    sky_blue: { bg: 'from-cyan-900/60 to-cyan-950/80', border: 'border-cyan-500/50', badge: 'bg-cyan-400 text-cyan-950', text: 'text-cyan-300' },
    rainbow: { bg: 'from-purple-900/70 via-pink-900/70 to-indigo-900/70', border: 'border-amber-400/60', badge: 'bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 text-slate-950', text: 'text-amber-300' },
  };

  // Buy Ticket Modal state inside dashboard
  const [buySuccessTicket, setBuySuccessTicket] = useState<{ ticketNumber: number; gameId: string; color: string; verCode: string } | null>(null);
  const [selectedGameForBuy, setSelectedGameForBuy] = useState(upcomingGames[0] || null);

  // Live game selected ticket
  const [liveSelectedTicketId, setLiveSelectedTicketId] = useState<string>(myTickets[0]?.id || '');
  const activeLiveTicket = myTickets.find((t) => t.id === liveSelectedTicketId) || myTickets[0];
  const [claimFeedback, setClaimFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(downlineStats.referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositMsg(null);
    if (depositAmount < (settings.minDeposit || 100) || depositAmount > (settings.maxDeposit || 2000)) {
      setDepositMsg({ type: 'error', text: `Deposit must be between ₹${settings.minDeposit || 100} and ₹${settings.maxDeposit || 2000}` });
      return;
    }
    if (depositAmount % (settings.depositMultiplesOf || 100) !== 0) {
      setDepositMsg({ type: 'error', text: `Deposit amount must be in multiples of ₹${settings.depositMultiplesOf || 100}` });
      return;
    }
    const res = depositMoney(depositAmount, depositMethod, depositUtr || `UPI-TX-${Date.now().toString().slice(-6)}`);
    if (res.success) {
      setDepositMsg({ type: 'success', text: 'Deposit request submitted successfully! Pending Admin verification.' });
      setDepositUtr('');
      setDepositProof(null);
      setTimeout(() => setDepositMsg(null), 4000);
    } else {
      setDepositMsg({ type: 'error', text: res.message });
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawMsg(null);
    const res = requestWithdrawal(withdrawAmount, {
      payoutType,
      accountHolderName: accountHolder,
      upiId,
      accountNumber,
      ifscCode: ifsc,
      bankName,
    });
    if (res.success) {
      setWithdrawMsg({ success: true, text: res.message });
      setTimeout(() => setWithdrawMsg(null), 4000);
    } else {
      setWithdrawMsg({ success: false, text: res.message });
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveBankDetails({
      accountHolderName: accountHolder,
      accountNumber,
      ifscCode: ifsc,
      bankName,
      upiId,
    });
    setProfileMsg('Bank and payout details updated securely.');
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleDepositToTicketTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (toTicketAmount <= 0) return;
    const res = transferDepositToTicketWallet(toTicketAmount);
    setWalletFeedback(res);
    setTimeout(() => setWalletFeedback(null), 4000);
  };

  const handleP2PSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p2pRecipient || p2pAmount <= 0) {
      setWalletFeedback({ success: false, message: 'Please provide recipient User ID / Phone and valid amount' });
      setTimeout(() => setWalletFeedback(null), 4000);
      return;
    }
    const res = transferMoney(p2pRecipient, p2pAmount);
    setWalletFeedback({ success: res.success, message: res.message });
    if (res.success) {
      setP2pRecipient('');
    }
    setTimeout(() => setWalletFeedback(null), 4000);
  };

  const handleBuyTicketSubmit = (gameId: string, price: number) => {
    const res = buyTicket(gameId, 1, price);
    const firstTicket = res.tickets?.[0];
    if (res.success && firstTicket) {
      setBuySuccessTicket({
        ticketNumber: firstTicket.ticketNumber,
        gameId: firstTicket.gameId,
        color: firstTicket.colorTheme || 'rainbow',
        verCode: firstTicket.verificationCode || `VER-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    } else {
      setClaimFeedback({ type: 'error', message: res.message });
    }
  };

  const handleClaim = (patternCode: WinningPatternCode) => {
    if (!activeLiveTicket) return;
    const res = verifyClaim(activeLiveTicket.id, patternCode);
    if (res.success) {
      setClaimFeedback({ type: 'success', message: res.message });
    } else {
      setClaimFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setClaimFeedback(null), 5000);
  };

  // 23 Complete Sidebar Items
  const menuItems: { tab: DashboardTab; label: string; icon: any; badge?: string | number; color?: string }[] = [
    { tab: 'dashboard', label: '1. 🏠 Dashboard', icon: Layers },
    { tab: 'profile', label: '2. 👤 My Profile', icon: UserCheck },
    { tab: 'mainWallet', label: '3. 💰 Main Wallet', icon: Wallet, badge: `₹${currentUser.depositWallet ?? currentUser.walletBalance}` },
    { tab: 'ticketWallet', label: '4. 🎟️ Ticket Wallet', icon: Ticket, badge: `₹${currentUser.ticketWallet ?? 0}` },
    { tab: 'winningWallet', label: '5. 🏆 Winning Wallet', icon: Trophy, badge: `₹${currentUser.winningWallet ?? currentUser.gameWinnings}` },
    { tab: 'deposit', label: '6. ➕ Deposit', icon: ArrowDownToLine },
    { tab: 'withdraw', label: '7. 💸 Withdraw', icon: ArrowUpFromLine },
    { tab: 'transfer', label: '8. 🔄 Wallet Transfer', icon: Send },
    { tab: 'buyTicket', label: '9. 🎟️ Buy Ticket', icon: Ticket },
    { tab: 'myTickets', label: '10. 🎫 My Tickets', icon: Ticket, badge: myTickets.length },
    { tab: 'liveGames', label: '11. 🔴 Live Games', icon: Radio, badge: 'LIVE', color: 'text-red-400' },
    { tab: 'winners', label: '12. 🏆 Winners', icon: Trophy },
    { tab: 'gameHistory', label: '13. 📜 Game History', icon: History },
    { tab: 'referral', label: '14. 👥 My Referrals', icon: Users, badge: `₹${currentUser.referralEarnings}` },
    { tab: 'commission', label: '15. 💎 Commission', icon: Percent },
    { tab: 'directIncome', label: '16. 💰 Direct Income', icon: TrendingUp },
    { tab: 'freeTickets', label: '17. 🎁 Free Tickets', icon: Gift, badge: currentUser.freeTicketsAvailable },
    { tab: 'notifications', label: '18. 🔔 Notifications', icon: Bell, badge: notifications.filter((n) => !n.isRead).length },
    { tab: 'transactions', label: '19. 📊 Transactions', icon: History },
    { tab: 'support', label: '20. 🎧 Support', icon: Headphones },
    { tab: 'terms', label: '21. 📄 Terms & Conditions', icon: FileText },
    { tab: 'security', label: '22. 🔐 Security', icon: ShieldCheck },
    { tab: 'logout', label: '23. 🚪 Logout', icon: LogOut, color: 'text-rose-400' },
  ];

  const navigateToTab = (tab: DashboardTab) => {
    if (tab === 'logout') {
      clearUserSession();
      logoutUser();
      if (isPageMode && onNavigate) {
        onNavigate('/login');
      } else {
        setActiveModal(null);
      }
      return;
    }
    setUserDashboardTab(tab);
    setMobileDrawerOpen(false);
  };

  const containerContent = (
    <div className={`relative w-full ${isPageMode ? 'flex-1 min-h-[calc(100vh-100px)] rounded-2xl' : 'max-w-7xl h-full sm:h-[94vh] rounded-none sm:rounded-3xl'} flex flex-col bg-[#080a1c] border-0 sm:border-2 border-indigo-500/30 shadow-2xl overflow-hidden`}>
      {/* ========================================================================= */}
      {/* TOP HEADER */}
      {/* ========================================================================= */}
      <header className="h-16 shrink-0 px-4 sm:px-6 bg-[#0c0e27] border-b border-indigo-500/20 flex items-center justify-between z-30">
        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateToTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px] shadow-md shadow-pink-500/30">
              <div className="w-full h-full bg-[#080a1c] rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400 text-sm">
                AT
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent font-['Outfit']">
                  {settings.websiteName || 'APNA TAMBOLA'}
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded">
                  USER
                </span>
              </div>
              <p className="hidden sm:block text-[9px] tracking-wider text-slate-400 uppercase font-bold">
                {settings.tagline || 'PLAY MORE • WIN MORE • SMILE MORE'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions & User Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Online Status & ID */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Online:</span>
            <span className="text-amber-300 font-bold">{currentUser?.name || 'Player'}</span>
            <span className="text-slate-500 font-mono text-[10px]">({currentUser?.id || 'USR'})</span>
          </div>

          {/* Notification Bell with Badge */}
          <button
            onClick={() => navigateToTab('notifications')}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-amber-400" />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg animate-bounce">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>

          {/* Wallet Pill */}
          <div
            onClick={() => navigateToTab('mainWallet')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 cursor-pointer hover:border-emerald-400 transition-all shadow-sm"
            title="Main Wallet Balance"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-black text-emerald-400">
              ₹{(currentUser?.walletBalance ?? (currentUser?.depositWallet ?? 0) + (currentUser?.ticketWallet ?? 0) + (currentUser?.winningWallet ?? 0)).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Close / Return Button */}
          <button
            onClick={() => {
              if (isPageMode && onNavigate) {
                onNavigate('/');
              } else {
                setActiveModal(null);
              }
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
            title={isPageMode ? 'Return to Home' : 'Close Dashboard'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

        {/* ========================================================================= */}
        {/* MAIN BODY: SIDEBAR + CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* DESKTOP SIDEBAR (23 items) */}
          <aside className="hidden lg:flex w-64 shrink-0 bg-[#060717] border-r border-indigo-500/20 flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="p-3 space-y-1">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                USER NAVIGATION MENU
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => navigateToTab(item.tab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${item.color || (isActive ? 'text-white' : 'text-slate-400')}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white text-slate-950'
                            : item.badge === 'LIVE'
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-white/10 text-pink-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-white/5 bg-black/40">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Direct Referral:</span>
                <span className="font-mono text-amber-400 font-bold">{currentUser.referralCode}</span>
              </div>
            </div>
          </aside>

          {/* MOBILE DRAWER OVERLAY */}
          {mobileDrawerOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex">
              <div className="w-72 bg-[#080a1c] border-r border-indigo-500/30 h-full flex flex-col justify-between overflow-y-auto p-4 animate-slide-right">
                <div className="space-y-1">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-black uppercase text-amber-300">USER MENU (23 ITEMS)</span>
                    <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="py-2 space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.tab;
                      return (
                        <button
                          key={item.tab}
                          onClick={() => navigateToTab(item.tab)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-pink-300">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
            </div>
          )}

          {/* CONTENT WORKSPACE */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090b20] pb-24 sm:pb-8 custom-scrollbar">
            
            {/* ================================================================= */}
            {/* TAB 1: 🏠 DASHBOARD HOME */}
            {/* ================================================================= */}
            {activeTab === 'dashboard' && (
              <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                {/* Welcome Banner */}
                <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-indigo-900/60 border border-purple-500/30 shadow-2xl overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-2">
                        <Sparkles className="w-3.5 h-3.5" /> Welcome to India's #1 Live Tambola Platform
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        Namaste, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">{currentUser.name}</span>! 👋
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                        Play live games, win up to 70% cash prizes, book multi-tier tickets, and build continuous passive income across 8 referral levels!
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => navigateToTab('buyTicket')}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-pink-500/30 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Buy Ticket</span>
                      </button>
                      <button
                        onClick={() => navigateToTab('liveGames')}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/30 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                        <span>Live Game Room</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3 SUMMARY WALLET CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 💰 MAIN WALLET */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-[#0f142e] to-[#0a0d24] border-2 border-emerald-500/40 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-emerald-400 text-xs font-black">
                      <span className="flex items-center gap-1.5">💰 MAIN WALLET</span>
                      <Wallet className="w-4 h-4" />
                    </div>
                    <p className="text-3xl font-black text-white font-mono mt-3">
                      ₹{(currentUser.depositWallet ?? currentUser.walletBalance).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Available transferable balance</p>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                      <button
                        onClick={() => navigateToTab('deposit')}
                        className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all cursor-pointer"
                      >
                        ADD MONEY
                      </button>
                      <button
                        onClick={() => navigateToTab('transfer')}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        TRANSFER
                      </button>
                      <button
                        onClick={() => navigateToTab('transactions')}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                        title="History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 🎟️ TICKET WALLET */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-950/70 via-[#0f142e] to-[#0a0d24] border-2 border-pink-500/40 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-pink-400 text-xs font-black">
                      <span className="flex items-center gap-1.5">🎟️ TICKET WALLET</span>
                      <Ticket className="w-4 h-4" />
                    </div>
                    <p className="text-3xl font-black text-white font-mono mt-3">
                      ₹{(currentUser.ticketWallet ?? 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mt-1">
                      ⚠️ TICKET WALLET IS ONLY FOR TICKET PURCHASES
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                      <button
                        onClick={() => navigateToTab('buyTicket')}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white text-xs font-black transition-all cursor-pointer"
                      >
                        BUY TICKET
                      </button>
                    </div>
                  </div>

                  {/* 🏆 WINNING WALLET */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/70 via-[#0f142e] to-[#0a0d24] border-2 border-amber-500/40 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-amber-400 text-xs font-black">
                      <span className="flex items-center gap-1.5">🏆 WINNING WALLET</span>
                      <Trophy className="w-4 h-4" />
                    </div>
                    <p className="text-3xl font-black text-amber-400 font-mono mt-3">
                      ₹{(currentUser.winningWallet ?? currentUser.gameWinnings).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Available Winning Balance</p>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                      <button
                        onClick={() => navigateToTab('withdraw')}
                        className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all cursor-pointer"
                      >
                        WITHDRAW
                      </button>
                      <button
                        onClick={() => navigateToTab('transactions')}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        HISTORY
                      </button>
                    </div>
                  </div>
                </div>

                {/* 🎟️ MY TICKETS & 🎮 LIVE GAMES ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Ticket Summary Card */}
                  <div className="p-6 rounded-3xl bg-[#0e112d] border border-indigo-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-purple-400" />
                        <h3 className="text-base font-black text-white">🎟️ MY TICKETS OVERVIEW</h3>
                      </div>
                      <button
                        onClick={() => navigateToTab('myTickets')}
                        className="text-xs font-bold text-pink-400 hover:underline flex items-center gap-1"
                      >
                        VIEW ALL TICKETS <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                        <p className="text-lg font-black text-white font-mono">{myTickets.length}</p>
                        <p className="text-[10px] text-slate-400">Total</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                        <p className="text-lg font-black text-emerald-400 font-mono">
                          {myTickets.filter((t) => (t.status || 'active') === 'active').length}
                        </p>
                        <p className="text-[10px] text-slate-400">Active</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                        <p className="text-lg font-black text-slate-300 font-mono">
                          {myTickets.filter((t) => t.status === 'completed').length}
                        </p>
                        <p className="text-[10px] text-slate-400">Completed</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                        <p className="text-lg font-black text-amber-400 font-mono">
                          {myTickets.filter((t) => t.status === 'won').length}
                        </p>
                        <p className="text-[10px] text-slate-400">Winning</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 bg-purple-500/10">
                        <p className="text-lg font-black text-pink-400 font-mono">{currentUser.freeTicketsAvailable}</p>
                        <p className="text-[10px] text-pink-300 font-bold">FREE</p>
                      </div>
                    </div>

                    {/* Quick Ticket List */}
                    <div className="space-y-2 pt-2">
                      {myTickets.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 font-mono font-black text-xs flex items-center justify-center">
                              #{t.ticketNumber}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-white">Game #{t.gameId}</p>
                              <p className="text-[10px] text-slate-400">Price: ₹{t.ticketPrice}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigateToTab('myTickets')}
                            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200"
                          >
                            View Ticket
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Game Card */}
                  <div className="p-6 rounded-3xl bg-[#0e112d] border border-red-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                        <h3 className="text-base font-black text-white">🎮 LIVE GAMES</h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase animate-pulse">
                        ● LIVE NOW
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/40 to-black/60 border border-red-500/30 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Game ID:</span>
                        <span className="font-mono text-xs font-bold text-amber-300">#{activeLiveGame.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Game Name:</span>
                        <span className="text-sm font-bold text-white">{activeLiveGame.title}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                        <div>
                          <p className="text-xs text-slate-400">Ticket Price</p>
                          <p className="text-sm font-bold text-emerald-400 font-mono">₹{activeLiveGame.ticketPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Tickets Sold</p>
                          <p className="text-sm font-bold text-pink-400 font-mono">{activeLiveGame.ticketsSoldCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Prize Pool</p>
                          <p className="text-sm font-bold text-amber-400 font-mono">₹{activeLiveGame.prizePool}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigateToTab('liveGames')}
                        className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 text-white font-black text-xs shadow-lg shadow-red-500/30 hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>VIEW LIVE GAME</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 2: 👤 MY PROFILE */}
            {/* ================================================================= */}
            {activeTab === 'profile' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0e112d] border border-indigo-500/30 space-y-6">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-white/10">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[3px] shadow-xl">
                      <div className="w-full h-full bg-[#080a1c] rounded-[21px] flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">
                        {currentUser.name.charAt(0)}
                      </div>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h3 className="text-xl font-black text-white">{currentUser.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                          ACTIVE ACCOUNT
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                          KYC VERIFIED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1">User ID: {currentUser.id} • Joined: {currentUser.createdAt.split('T')[0]}</p>
                    </div>
                  </div>

                  {/* Profile Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-slate-400">Mobile Number:</span>
                      <p className="font-mono font-bold text-white text-sm">{currentUser.phone}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-slate-400">Email Address:</span>
                      <p className="font-mono font-bold text-white text-sm">{currentUser.email}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-slate-400">My Referral ID:</span>
                      <p className="font-mono font-bold text-amber-300 text-sm">{currentUser.referralCode}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-slate-400">State / Region:</span>
                      <p className="font-bold text-white text-sm">{currentUser.stateOfResidence || 'India'}</p>
                    </div>
                  </div>

                  {/* Referral Link Quick Copy */}
                  <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <p className="text-[11px] text-purple-300 font-bold">My Personal Referral Link</p>
                      <p className="text-xs text-slate-300 font-mono truncate">{downlineStats.referralLink}</p>
                    </div>
                    <button
                      onClick={handleCopyRef}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>

                  {/* Bank Details Form */}
                  <form onSubmit={handleProfileSave} className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      BANK & UPI PAYOUT DETAILS
                    </h4>

                    {profileMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{profileMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-300 font-bold">Account Holder Name</label>
                        <input
                          type="text"
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-bold">UPI ID (e.g. name@okhdfcbank)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-bold">Bank Account Number</label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-bold">IFSC Code</label>
                        <input
                          type="text"
                          value={ifsc}
                          onChange={(e) => setIfsc(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:opacity-95 cursor-pointer"
                      >
                        SAVE DETAILS
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('security')}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                      >
                        CHANGE PASSWORD / SECURITY
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 3: 💰 MAIN WALLET */}
            {/* ================================================================= */}
            {activeTab === 'mainWallet' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1a3b] via-[#102454] to-[#08122c] border-2 border-blue-500/40 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-black text-blue-300">💰 MAIN WALLET</h3>
                      <p className="text-xs text-slate-300">Holds your approved deposits and self-funded recharge balance</p>
                    </div>
                    <Wallet className="w-8 h-8 text-blue-400" />
                  </div>

                  <div className="p-6 rounded-2xl bg-black/60 border border-blue-500/30 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Deposit Balance</p>
                    <p className="text-4xl font-black text-white font-mono">
                      ₹{(currentUser.depositWallet ?? currentUser.walletBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-emerald-400 font-bold">100% Safe &amp; Verified</p>
                  </div>

                  {/* Main Wallet Buttons: ADD MONEY & HISTORY (No User-to-User Transfer button) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => navigateToTab('deposit')}
                      className="py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>➕ ADD MONEY</span>
                    </button>
                    <button
                      onClick={() => navigateToTab('transactions')}
                      className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 border border-white/15"
                    >
                      <History className="w-4 h-4 text-blue-300" />
                      <span>📜 TRANSACTION HISTORY</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-300">
                    <p className="font-black text-blue-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Main Wallet Usage Rules:</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      <li>Use for depositing funds securely via UPI apps or QR code scan.</li>
                      <li>Can be transferred to your Ticket Wallet at 0% fee to join matches.</li>
                      <li><strong className="text-amber-300">Note:</strong> User-to-User transfers are strictly processed through the Ticket Wallet only.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 4: 🎟️ TICKET WALLET */}
            {/* ================================================================= */}
            {activeTab === 'ticketWallet' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2f0d3a] via-[#441154] to-[#1c0624] border-2 border-pink-500/40 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-black text-pink-300">🎟️ TICKET WALLET</h3>
                      <p className="text-xs text-pink-200/80">Used for Tambola ticket purchases &amp; User-to-User transfers</p>
                    </div>
                    <Ticket className="w-8 h-8 text-pink-400" />
                  </div>

                  <div className="p-6 rounded-2xl bg-black/60 border border-pink-500/30 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Ticket Balance</p>
                    <p className="text-4xl font-black text-pink-300 font-mono">
                      {(currentUser.ticketWallet ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} VP
                    </p>
                    <div className="inline-block px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-[11px] font-black tracking-wider uppercase">
                      🎟️ RESTRICTED FOR TICKET PURCHASES ONLY
                    </div>
                  </div>

                  {/* Ticket Wallet Buttons: BUY TICKET & HISTORY ONLY */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => navigateToTab('buyTicket')}
                      className="py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 text-white font-black text-xs shadow-xl shadow-pink-500/30 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>BUY TICKET (5, 10, 20, 40, 100 VP)</span>
                    </button>
                    <button
                      onClick={() => navigateToTab('transactions')}
                      className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 border border-white/15"
                    >
                      <History className="w-4 h-4 text-pink-300" />
                      <span>TRANSACTION HISTORY</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/30 text-xs text-slate-300 space-y-2">
                    <p className="font-bold text-pink-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-pink-400" />
                      <span>Ticket Wallet Policy (Closed-Loop Virtual Points):</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      <li>Ticket Wallet funds remain restricted strictly to ticket purchases only.</li>
                      <li>Ticket Wallet cannot be transferred out, withdrawn, or converted.</li>
                      <li>To recharge your Ticket Wallet, convert points from your Main Wallet or receive transfers from other players.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 5: 🏆 WINNING WALLET */}
            {/* ================================================================= */}
            {activeTab === 'winningWallet' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/60 via-[#0e112d] to-black border border-amber-500/40 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-black text-amber-400">🏆 WINNING WALLET</h3>
                      <p className="text-xs text-slate-400">Holds all verified prize wins & gameplay referral earnings</p>
                    </div>
                    <Trophy className="w-8 h-8 text-amber-400" />
                  </div>

                  <div className="p-6 rounded-2xl bg-black/60 border border-amber-500/30 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Winning Balance</p>
                    <p className="text-4xl font-black text-amber-400 font-mono">
                      ₹{(currentUser.winningWallet ?? currentUser.gameWinnings).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-emerald-400 font-bold">Eligible for Instant Bank / UPI Payout (₹100 - ₹2,000)</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => navigateToTab('withdraw')}
                      className="py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/30 hover:brightness-110 cursor-pointer"
                    >
                      💸 WITHDRAW NOW
                    </button>
                    <button
                      onClick={() => navigateToTab('transactions')}
                      className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                    >
                      📜 WINNINGS HISTORY
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 6: ➕ DEPOSIT */}
            {/* ================================================================= */}
            {activeTab === 'deposit' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0e112d] border border-emerald-500/40 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-black text-emerald-400">➕ DEPOSIT FUNDS</h3>
                      <p className="text-xs text-slate-400">
                        Min: ₹{settings.minDeposit || 100} • Max: ₹{settings.maxDeposit || 2000} (In multiples of ₹100)
                      </p>
                    </div>
                    <ArrowDownToLine className="w-7 h-7 text-emerald-400" />
                  </div>

                  {depositMsg && (
                    <div
                      className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                        depositMsg.type === 'success'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {depositMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      <span>{depositMsg.text}</span>
                    </div>
                  )}

                  {/* QR & UPI ID Presentation */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="p-2.5 rounded-2xl bg-white text-black shadow-lg">
                      <QrCode className="w-28 h-28" />
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                      <span className="text-xs text-slate-400">Official UPI ID for Deposit:</span>
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
                        <span className="font-mono font-bold text-amber-300 text-sm">{settings.adminUpiId || 'apnatambola@upi'}</span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(settings.adminUpiId || 'apnatambola@upi')}
                          className="text-slate-400 hover:text-white p-1"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Scan QR with PhonePe, Google Pay, or Paytm. Submit the 12-digit UTR below.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleDepositSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Select or Enter Amount (₹)</label>
                      <div className="grid grid-cols-5 gap-2 mt-1.5 mb-2">
                        {[100, 200, 500, 1000, 2000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setDepositAmount(amt)}
                            className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                              depositAmount === amt
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        min={settings.minDeposit || 100}
                        max={settings.maxDeposit || 2000}
                        step={100}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-emerald-400 text-lg font-mono font-black focus:outline-none focus:border-emerald-400"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300">Payment Method</label>
                        <select
                          value={depositMethod}
                          onChange={(e: any) => setDepositMethod(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none"
                        >
                          <option value="UPI">UPI App (PhonePe, GPay, Paytm)</option>
                          <option value="QR">QR Code Scanner</option>
                          <option value="NetBanking">Net Banking / IMPS</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300">Transaction ID / 12-Digit UTR</label>
                        <input
                          type="text"
                          placeholder="e.g. 423871928371"
                          value={depositUtr}
                          onChange={(e) => setDepositUtr(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 hover:opacity-95 cursor-pointer"
                    >
                      SUBMIT DEPOSIT REQUEST
                    </button>
                  </form>

                  {/* My Deposit Records Status */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-black uppercase text-slate-400">Recent Deposit History</h4>
                    <div className="space-y-2">
                      {deposits.slice(0, 3).map((dep) => (
                        <div
                          key={dep.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 text-xs"
                        >
                          <div>
                            <p className="font-bold text-white">₹{dep.amount} via {dep.paymentMethod}</p>
                            <p className="text-[10px] text-slate-500 font-mono">UTR: {dep.utrRef || dep.transactionId}</p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              dep.status === 'completed' || dep.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : dep.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {dep.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 7: 💸 WITHDRAW */}
            {/* ================================================================= */}
            {activeTab === 'withdraw' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0e112d] border border-amber-500/40 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-black text-amber-400">💸 WITHDRAW WINNINGS</h3>
                      <p className="text-xs text-slate-400">
                        Min: ₹{settings.minWithdrawal || 100} • Max: ₹{settings.maxWithdrawal || 2000} (Instant Bank/UPI)
                      </p>
                    </div>
                    <ArrowUpFromLine className="w-7 h-7 text-amber-400" />
                  </div>

                  {withdrawMsg && (
                    <div
                      className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                        withdrawMsg.success
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {withdrawMsg.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      <span>{withdrawMsg.text}</span>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Available Winning Balance:</span>
                      <p className="text-2xl font-black text-amber-400 font-mono">
                        ₹{(currentUser.winningWallet ?? currentUser.gameWinnings).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      ✓ Instant Payout Ready
                    </span>
                  </div>

                  <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Withdrawal Amount (₹)</label>
                      <input
                        type="number"
                        min={settings.minWithdrawal || 100}
                        max={Math.min(settings.maxWithdrawal || 2000, currentUser.winningWallet ?? currentUser.gameWinnings)}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-amber-400 text-lg font-mono font-black focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-300">Payout Mode</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPayoutType('UPI')}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            payoutType === 'UPI'
                              ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md'
                              : 'bg-white/5 text-slate-300 border-white/10'
                          }`}
                        >
                          UPI ID Instant
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayoutType('Bank')}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            payoutType === 'Bank'
                              ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md'
                              : 'bg-white/5 text-slate-300 border-white/10'
                          }`}
                        >
                          Bank Account (IMPS)
                        </button>
                      </div>
                    </div>

                    {payoutType === 'UPI' ? (
                      <div>
                        <label className="text-xs font-bold text-slate-300">UPI ID</label>
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-300">Bank Account Number</label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-300">IFSC Code</label>
                          <input
                            type="text"
                            value={ifsc}
                            onChange={(e) => setIfsc(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-mono"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Transparent Withdrawal Deductions Breakdown */}
                    <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-xs space-y-2">
                      <div className="flex justify-between text-slate-400">
                        <span>Requested Withdrawal Amount:</span>
                        <span className="font-mono text-white font-bold">₹{withdrawAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-pink-400">
                        <span>Withdrawal Charge (10%):</span>
                        <span className="font-mono">- ₹{(withdrawAmount * 0.10).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-yellow-400">
                        <span>TDS (5%):</span>
                        <span className="font-mono">- ₹{(withdrawAmount * 0.05).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-black text-sm pt-2 border-t border-white/10">
                        <span>Net Amount You Receive:</span>
                        <span className="font-mono font-black text-base">₹{(withdrawAmount * 0.85).toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 pt-1">
                        * Withdrawal charge (10%) and TDS (5%) are deducted automatically in accordance with regulatory guidelines.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={(currentUser.winningWallet ?? currentUser.gameWinnings) < withdrawAmount}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/30 hover:opacity-95 disabled:opacity-40 cursor-pointer"
                    >
                      CONFIRM WITHDRAWAL REQUEST (₹{(withdrawAmount * 0.85).toFixed(2)} Net)
                    </button>
                  </form>

                  {/* Withdrawal Status Pipeline */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-black uppercase text-slate-400">Withdrawal Tracker</h4>
                    <div className="space-y-2">
                      {withdrawals.slice(0, 3).map((w) => (
                        <div
                          key={w.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 text-xs"
                        >
                          <div>
                            <p className="font-bold text-white">₹{w.amount} to {w.payoutType}</p>
                            <p className="text-[10px] text-slate-500">{w.requestedAt.split('T')[0]}</p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              w.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : w.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {w.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 8: 🔄 TICKET WALLET TRANSFER */}
            {/* ================================================================= */}
            {activeTab === 'transfer' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                {walletFeedback && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                      walletFeedback.success
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/20 border border-red-500/40 text-red-300'
                    }`}
                  >
                    {walletFeedback.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{walletFeedback.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form 1: Main/Deposit Wallet ➔ Ticket Wallet (0% Fee Self Top-up) */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e1738] to-[#070c24] border-2 border-pink-500/30 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold border border-pink-500/30">
                        🎟
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">Recharge Ticket Wallet</h4>
                        <p className="text-xs text-emerald-400 font-bold">From Main Wallet (0% Platform Fee)</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex justify-between text-xs">
                      <span className="text-slate-400">Main Wallet Available:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        ₹{(currentUser.depositWallet || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <form onSubmit={handleDepositToTicketTransfer} className="space-y-4 pt-1">
                      <div>
                        <label className="text-xs font-bold text-slate-300">Amount to Transfer (₹)</label>
                        <input
                          type="number"
                          min="10"
                          max={currentUser.depositWallet || 10000}
                          value={toTicketAmount}
                          onChange={(e) => setToTicketAmount(Number(e.target.value))}
                          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-pink-500/40 text-pink-300 text-lg font-black font-mono focus:outline-none focus:border-pink-400"
                        />
                      </div>
                      <div className="flex gap-2">
                        {[50, 100, 200, 500].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setToTicketAmount(amt)}
                            className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-mono"
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>
                      <button
                        type="submit"
                        disabled={(currentUser.depositWallet || 0) < toTicketAmount || toTicketAmount <= 0}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-pink-500/25 cursor-pointer disabled:opacity-40"
                      >
                        CONVERT TO TICKET WALLET (0% FEE)
                      </button>
                    </form>
                  </div>

                  {/* Form 2: P2P Main Wallet ➔ Recipient Ticket Wallet (5% Fee) */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-[#101b44] to-[#080e2a] border-2 border-blue-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold border border-blue-500/30">
                        🔄
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">Send Points to Player</h4>
                        <p className="text-xs text-blue-300">Main Wallet ➔ Recipient's Restricted Ticket Wallet</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex justify-between text-xs">
                      <span className="text-slate-400">Main Wallet Available:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {(currentUser.depositWallet || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} VP
                      </span>
                    </div>

                    <form onSubmit={handleP2PSubmit} className="space-y-4 pt-1">
                      <div>
                        <label className="text-xs font-bold text-slate-300">Recipient (User ID / Referral / Phone)</label>
                        <input
                          type="text"
                          placeholder="e.g. AT102458 or 9876543210"
                          value={p2pRecipient}
                          onChange={(e) => setP2pRecipient(e.target.value)}
                          className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-blue-500/40 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300">Transfer Amount (VP)</label>
                        <input
                          type="number"
                          min="10"
                          max={currentUser.depositWallet || 0}
                          value={p2pAmount}
                          onChange={(e) => setP2pAmount(Number(e.target.value))}
                          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/60 border border-blue-500/40 text-blue-300 text-lg font-black font-mono focus:outline-none focus:border-blue-400"
                          required
                        />
                      </div>

                      {/* 5% Transfer Fee Breakdown Box */}
                      <div className="p-3.5 rounded-xl bg-black/70 border border-blue-500/30 text-xs space-y-1.5">
                        <div className="flex justify-between text-slate-400">
                          <span>Source Wallet:</span>
                          <span className="font-mono text-emerald-300 font-bold">Main Wallet (Transferable)</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Transfer Amount:</span>
                          <span className="font-mono text-white">{p2pAmount} VP</span>
                        </div>
                        <div className="flex justify-between text-pink-400">
                          <span>Platform Maintenance Fee (5%):</span>
                          <span className="font-mono">- {(p2pAmount * 0.05).toFixed(2)} VP</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold pt-1.5 border-t border-white/10">
                          <span>Recipient Receives (Ticket Wallet):</span>
                          <span className="font-mono text-sm font-black">{(p2pAmount * 0.95).toFixed(2)} VP</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={(currentUser.depositWallet || 0) < p2pAmount || p2pAmount <= 0}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-40"
                      >
                        CONFIRM TRANSFER (CREDITS RECIPIENT TICKET WALLET)
                      </button>
                    </form>
                  </div>
                </div>

                {/* Important Wallet Rules Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-[#141b3d] to-[#121330] border-2 border-indigo-500/30 text-xs text-slate-200 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 font-black text-amber-300 uppercase tracking-wide">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>Official Apna Tambola Wallet Rules (Closed-Loop Demo)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
                      <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>User-to-User: Transfers credit Recipient's Ticket Wallet (5% Fee)</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Self Top-up: Main Wallet ➔ Own Ticket Wallet (0% Fee)</span>
                      </p>
                    </div>
                    <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
                      <p className="flex items-center gap-1.5 text-rose-400 font-bold">
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Ticket Wallet: Cannot be withdrawn or transferred out</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-rose-400 font-bold">
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Ticket Wallet: Exclusively for purchasing game tickets</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-300/90 font-medium italic border-t border-white/10 pt-2 text-center">
                    “All user-to-user transfers credit the recipient's Ticket Wallet directly so they can participate in live Tambola matches.”
                  </p>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 9: 🎟️ BUY TICKET */}
            {/* ================================================================= */}
            {activeTab === 'buyTicket' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                {buySuccessTicket && (
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border-2 border-emerald-400 text-center space-y-3 animate-fade-in shadow-2xl">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-3xl font-black">
                      ✓
                    </div>
                    <h3 className="text-2xl font-black text-emerald-300">🎉 TICKET PURCHASED SUCCESSFULLY!</h3>
                    <p className="text-xs text-slate-300">Your ticket has been booked for Game #{buySuccessTicket.gameId}</p>
                    <div className="inline-flex items-center gap-4 bg-black/60 px-6 py-3 rounded-2xl border border-white/10 text-sm">
                      <span className="text-slate-400">Ticket No: <strong className="text-amber-300 font-mono">#{buySuccessTicket.ticketNumber}</strong></span>
                      <span className="text-slate-400">Security Code: <strong className="text-pink-300 font-mono">{buySuccessTicket.verCode}</strong></span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => navigateToTab('myTickets')}
                        className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs"
                      >
                        VIEW IN MY TICKETS
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">🎟️ AVAILABLE GAMES & TOURNAMENTS</h3>
                    <p className="text-xs text-slate-400">Select any scheduled tournament to book your tickets</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Ticket Wallet Balance:</span>
                    <p className="text-base font-black text-pink-400 font-mono">₹{currentUser.ticketWallet ?? 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcomingGames.map((game) => (
                    <div
                      key={game.id}
                      className="p-5 rounded-3xl bg-[#0e112d] border border-indigo-500/30 hover:border-pink-500/50 transition-all space-y-4 shadow-xl flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md">
                            #{game.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            TICKETS OPEN
                          </span>
                        </div>
                        <h4 className="text-base font-black text-white">{game.title}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Start Time: {game.startTime.split('T')[1]?.slice(0, 5) || '10:00 PM'}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">Ticket Price:</span>
                          <p className="font-mono text-base font-black text-emerald-400">₹{game.ticketPrice}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Prize Pool:</span>
                          <p className="font-mono text-base font-black text-amber-400">₹{game.prizePool}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Tickets Sold:</span>
                          <p className="font-mono font-bold text-white">{game.ticketsSoldCount}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Players:</span>
                          <p className="font-mono font-bold text-white">{game.playersCount}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyTicketSubmit(game.id, game.ticketPrice)}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-pink-500/25 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>BUY TICKET (₹{game.ticketPrice})</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 10: 🎫 MY TICKETS (Vibrant Themes) */}
            {/* ================================================================= */}
            {activeTab === 'myTickets' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">🎫 MY PURCHASED TICKETS ({myTickets.length})</h3>
                    <p className="text-xs text-slate-400">Multi-coloured tickets with real-time draw verification</p>
                  </div>
                  <button
                    onClick={() => navigateToTab('buyTicket')}
                    className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black flex items-center gap-1"
                  >
                    <Ticket className="w-3.5 h-3.5" /> Buy More
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myTickets.map((ticket) => {
                    const theme = ticketThemeStyles[ticket.colorTheme || 'rainbow'] || ticketThemeStyles.rainbow;
                    return (
                      <div
                        key={ticket.id}
                        className={`p-5 rounded-3xl bg-gradient-to-br ${theme.bg} border-2 ${theme.border} shadow-2xl space-y-4`}
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div>
                            <span className="font-black text-sm tracking-wider text-white">APNA TAMBOLA</span>
                            <p className="text-[10px] text-slate-300">Ticket #{ticket.ticketNumber} • Game #{ticket.gameId}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${theme.badge}`}>
                            ₹{ticket.ticketPrice} TICKET
                          </span>
                        </div>

                        {/* 3x9 Tambola Grid */}
                        <div className="grid grid-cols-9 gap-1 bg-black/60 p-2 rounded-2xl border border-white/10">
                          {ticket.grid.map((row, rIdx) =>
                            row.map((val, cIdx) => {
                              const isMarked = val && ticket.markedNumbers.includes(val);
                              return (
                                <div
                                  key={`${rIdx}-${cIdx}`}
                                  className={`h-8 sm:h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                                    val === null
                                      ? 'bg-transparent'
                                      : isMarked
                                      ? 'bg-emerald-500 text-slate-950 font-black scale-105 shadow-md ring-1 ring-emerald-300'
                                      : 'bg-white/10 text-white border border-white/10'
                                  }`}
                                >
                                  {val || ''}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
                          <span className="font-mono text-[10px]">Code: {ticket.verificationCode || 'VER-83719'}</span>
                          <button
                            onClick={() => navigateToTab('liveGames')}
                            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" /> Join Live Game
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 11: 🔴 LIVE GAMES */}
            {/* ================================================================= */}
            {activeTab === 'liveGames' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                {claimFeedback && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                      claimFeedback.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {claimFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{claimFeedback.message}</span>
                  </div>
                )}

                {/* Live Room Header */}
                <div className="p-6 rounded-3xl bg-[#0e112d] border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
                  <div className="space-y-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black">
                      <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE STREAM DRAW • #{activeLiveGame.id}
                    </div>
                    <h3 className="text-xl font-black text-white">{activeLiveGame.title}</h3>
                    <p className="text-xs text-slate-400">
                      Players: {activeLiveGame.playersCount} • Tickets Sold: {activeLiveGame.ticketsSoldCount} • Prize Pool: ₹{activeLiveGame.prizePool}
                    </p>
                  </div>

                  {/* 3D Animated Last Ball */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">LAST NUMBER</span>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center text-2xl font-black text-slate-950 font-mono shadow-xl shadow-pink-500/40 ring-4 ring-white/10 animate-pulse mt-1">
                        {currentCalledNumber || '--'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Called Numbers Board */}
                <div className="p-5 rounded-3xl bg-[#0a0c24] border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">CALLED NUMBERS ({liveCalledNumbers.length}/90):</span>
                    <span className="text-[10px] text-emerald-400">🟢 Numbers auto-highlight on your ticket</span>
                  </div>
                  <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-18 gap-1">
                    {Array.from({ length: 90 }, (_, i) => i + 1).map((n) => {
                      const isCalled = liveCalledNumbers.includes(n);
                      const isLatest = currentCalledNumber === n;
                      return (
                        <div
                          key={n}
                          className={`h-6 text-[10px] font-mono font-bold rounded flex items-center justify-center ${
                            isLatest
                              ? 'bg-amber-400 text-slate-950 font-black scale-110 shadow-lg ring-2 ring-amber-300'
                              : isCalled
                              ? 'bg-purple-600 text-white font-black'
                              : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          {n}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* User's Ticket in Live Game */}
                {activeLiveTicket && (
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#0e112d] to-black border border-purple-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white">YOUR TICKET #{activeLiveTicket.ticketNumber}</h4>
                      <span className="text-xs text-emerald-400 font-mono">
                        Marked: {activeLiveTicket.markedNumbers.length} / 15
                      </span>
                    </div>

                    <div className="grid grid-cols-9 gap-1.5 bg-black/60 p-3 rounded-2xl border border-white/10">
                      {activeLiveTicket.grid.map((row, rIdx) =>
                        row.map((val, cIdx) => {
                          const isMarked = val && activeLiveTicket.markedNumbers.includes(val);
                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className={`h-10 sm:h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                                val === null
                                  ? 'bg-transparent'
                                  : isMarked
                                  ? 'bg-emerald-500 text-slate-950 font-black scale-105 shadow-lg ring-2 ring-emerald-300'
                                  : 'bg-white/10 text-white border border-white/10'
                              }`}
                            >
                              {val || ''}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Claim Prize Buttons for Eligible Patterns */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <span className="text-xs font-bold text-amber-300">CLAIM RECOGNIZED PATTERNS:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { code: 'STAR' as WinningPatternCode, label: '⭐ STAR' },
                          { code: 'EARLY5' as WinningPatternCode, label: '⚡ EARLY 5' },
                          { code: 'TOPLINE' as WinningPatternCode, label: '🥇 TOP LINE' },
                          { code: 'MIDDLELINE' as WinningPatternCode, label: '🥈 MIDDLE LINE' },
                          { code: 'BOTTOMLINE' as WinningPatternCode, label: '🥉 BOTTOM LINE' },
                          { code: 'FULLHOUSE1' as WinningPatternCode, label: '👑 FULL HOUSE 1' },
                          { code: 'FULLHOUSE2' as WinningPatternCode, label: '👑 FULL HOUSE 2' },
                          { code: 'FULLHOUSE3' as WinningPatternCode, label: '👑 FULL HOUSE 3' },
                        ].map((pat) => (
                          <button
                            key={pat.code}
                            onClick={() => handleClaim(pat.code)}
                            className="py-2 px-3 rounded-xl bg-purple-600/60 hover:bg-pink-600 text-white text-xs font-black border border-purple-400/40 transition-all cursor-pointer truncate"
                          >
                            CLAIM {pat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 12: 🏆 WINNERS */}
            {/* ================================================================= */}
            {activeTab === 'winners' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-amber-400">🏆 TODAY'S WINNERS & HALL OF FAME</h3>
                    <p className="text-xs text-slate-400">All prizes verified and instantly credited to winning wallets</p>
                  </div>
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Rajesh Sharma', id: 'user_rajesh', ticket: 104, prize: 'First Full House', amount: 250, time: '10 Mins ago', game: 'G-101' },
                    { name: 'Pooja Verma', id: 'user_pooja', ticket: 208, prize: 'Early 5', amount: 25, time: '22 Mins ago', game: 'G-101' },
                    { name: 'Amit Kumar', id: 'user_amit', ticket: 312, prize: 'Top Line', amount: 25, time: '35 Mins ago', game: 'G-100' },
                    { name: 'Sunita Patel', id: 'user_sunita', ticket: 415, prize: 'Star Pattern', amount: 25, time: '1 Hr ago', game: 'G-100' },
                  ].map((w, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#0e112d] border border-amber-500/30 flex items-center justify-between shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-lg">
                          🏆
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{w.name}</p>
                          <p className="text-[10px] text-slate-400">Ticket #{w.ticket} • {w.prize}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-black text-emerald-400 text-base">₹{w.amount}</p>
                        <span className="text-[10px] text-slate-500">{w.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 13: 📜 GAME HISTORY */}
            {/* ================================================================= */}
            {activeTab === 'gameHistory' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">📜 GAME HISTORY & RESULTS</h3>
                    <p className="text-xs text-slate-400">Past tournaments, tickets played and your winnings</p>
                  </div>
                  <History className="w-6 h-6 text-purple-400" />
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'G-101', title: 'Grand Evening Bumper', date: 'Today, 08:00 PM', price: 25, status: 'Completed', result: 'Won ₹25 (Top Line)' },
                    { id: 'G-100', title: 'Afternoon Speed 90', date: 'Today, 03:00 PM', price: 10, status: 'Completed', result: 'Participated' },
                    { id: 'G-099', title: 'Midnight Mega Housie', date: 'Yesterday, 11:30 PM', price: 50, status: 'Completed', result: 'Won ₹250 (Full House)' },
                  ]
                    .filter((g) => (showArchivedHistory ? isHistoryRecordArchived(g.id) : !isHistoryRecordArchived(g.id)))
                    .map((g) => (
                      <div
                        key={g.id}
                        className="p-4 rounded-2xl bg-gradient-to-r from-[#0e1233] to-[#0b0e29] border border-white/10 flex items-center justify-between text-xs transition-all shadow-md"
                      >
                        <div>
                          <p className="font-bold text-white text-sm">{g.title} (#{g.id})</p>
                          <p className="text-slate-400">{g.date} • Ticket: ₹{g.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            {g.result}
                          </span>
                          <button
                            type="button"
                            onClick={() => (isHistoryRecordArchived(g.id) ? unarchiveHistoryRecord(g.id) : archiveHistoryRecord(g.id))}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs"
                          >
                            {isHistoryRecordArchived(g.id) ? 'Unarchive' : 'Archive'}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 14: 👥 MY REFERRALS */}
            {/* ================================================================= */}
            {activeTab === 'referral' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-purple-500/40 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-white">👥 8-LEVEL TEAM REFERRAL</h3>
                      <p className="text-xs text-slate-300">Earn passive income on every ticket bought by your downline team!</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyRef}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400">Direct Members</span>
                      <p className="text-lg font-black text-white font-mono">{downlineStats.directMembersCount}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400">Total Team Size</span>
                      <p className="text-lg font-black text-pink-400 font-mono">{downlineStats.totalTeamCount}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400">Referral Income</span>
                      <p className="text-lg font-black text-emerald-400 font-mono">₹{currentUser.referralEarnings}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400">Direct Income</span>
                      <p className="text-lg font-black text-amber-400 font-mono">₹{currentUser.directIncomeEarnings}</p>
                    </div>
                  </div>
                </div>

                {/* 8 Levels Matrix */}
                <div className="p-6 rounded-3xl bg-[#0e112d] border border-white/10 space-y-4">
                  <h4 className="text-sm font-black text-white">8-LEVEL COMMISSION MATRIX</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { lvl: 1, pct: '2.0%' },
                      { lvl: 2, pct: '1.0%' },
                      { lvl: 3, pct: '0.5%' },
                      { lvl: 4, pct: '0.4%' },
                      { lvl: 5, pct: '0.3%' },
                      { lvl: 6, pct: '0.2%' },
                      { lvl: 7, pct: '0.1%' },
                      { lvl: 8, pct: '0.1%' },
                    ].map((l) => (
                      <div key={l.lvl} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Level {l.lvl}</span>
                        <span className="font-bold text-pink-400">{l.pct}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-300/80 bg-amber-400/10 p-3 rounded-xl border border-amber-400/20">
                    Important: Commission is strictly credited on eligible ticket gameplay, not merely upon deposit.
                  </p>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 15: 💎 COMMISSION */}
            {/* ================================================================= */}
            {activeTab === 'commission' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-pink-400">💎 COMMISSION LEDGER</h3>
                    <p className="text-xs text-slate-400">Real-time ledger of your 8-level ticket gameplay commissions</p>
                  </div>
                  <Percent className="w-6 h-6 text-pink-400" />
                </div>

                <div className="space-y-2">
                  {commissionLedger.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#0e112d] border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">
                          Level {item.level} ({item.percent}%) from {item.sourceUserName}
                        </p>
                        <p className="text-[10px] text-slate-400">Game #{item.gameId} • Ticket Price: ₹{item.ticketPrice}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-black text-emerald-400 text-sm">+ ₹{item.amount.toFixed(2)}</p>
                        <span className="text-[10px] text-slate-500">{item.createdAt.split('T')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 16: 💰 DIRECT INCOME */}
            {/* ================================================================= */}
            {activeTab === 'directIncome' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e112d] border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-amber-400">💰 DIRECT REFERRAL INCOME</h3>
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Direct commissions earned whenever your direct level-1 players book tournament tickets.
                  </p>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Total Direct Income</span>
                    <p className="text-3xl font-black text-amber-400 font-mono mt-1">₹{currentUser.directIncomeEarnings}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 17: 🎁 FREE TICKETS */}
            {/* ================================================================= */}
            {activeTab === 'freeTickets' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-pink-400">🎁 FREE LUCKY TICKETS (5 PER GAME)</h3>
                      <p className="text-xs text-slate-300">In every game, 5 random lucky winners receive 100% free passes!</p>
                    </div>
                    <Gift className="w-8 h-8 text-pink-400" />
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Available Free Passes:</span>
                      <p className="text-2xl font-black text-pink-400 font-mono">{currentUser.freeTicketsAvailable}</p>
                    </div>
                    <button
                      onClick={() => navigateToTab('buyTicket')}
                      className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold"
                    >
                      Redeem Free Ticket
                    </button>
                  </div>
                </div>

                {/* Free ticket winners history */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400">Recent Free Ticket Lucky Winners</h4>
                  <div className="space-y-2">
                    {freeTicketWinners.map((fw) => (
                      <div key={fw.id} className="p-3 rounded-xl bg-[#0e112d] border border-white/5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">{fw.userName} (Ticket #{fw.ticketNumber})</p>
                          <p className="text-[10px] text-slate-400">{fw.gameTitle}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                          FREE PASS
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 18: 🔔 NOTIFICATIONS */}
            {/* ================================================================= */}
            {activeTab === 'notifications' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">🔔 NOTIFICATION CENTER</h3>
                    <p className="text-xs text-slate-400">Stay updated on games, deposits, prize claims and commissions</p>
                  </div>
                  <Bell className="w-6 h-6 text-amber-400" />
                </div>

                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        n.isRead ? 'bg-[#0a0c24] border-white/5 opacity-80' : 'bg-[#0e112d] border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white">{n.title}</p>
                        <span className="text-[10px] text-slate-500">{n.createdAt.split('T')[0]}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 19: 📊 TRANSACTIONS & HISTORY ARCHIVE */}
            {/* ================================================================= */}
            {activeTab === 'transactions' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">📊 COMPLETE FINANCIAL LEDGER</h3>
                    <p className="text-xs text-slate-400">Detailed deposits, withdrawals (15% fee), transfers and earnings</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowArchivedHistory(!showArchivedHistory)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        showArchivedHistory
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{showArchivedHistory ? 'Viewing Archived' : 'Show Archived'}</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {[
                    { key: 'all', label: 'All Records' },
                    { key: 'deposit', label: 'Deposits' },
                    { key: 'withdrawal', label: 'Withdrawals (15% Fee)' },
                    { key: 'transfer', label: 'P2P Transfers' },
                    { key: 'commission', label: 'Commissions' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setTxFilter(f.key as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        txFilter === f.key
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  {/* Deposits */}
                  {(txFilter === 'all' || txFilter === 'deposit') &&
                    deposits
                      .filter((d) => (showArchivedHistory ? isHistoryRecordArchived(d.id) : !isHistoryRecordArchived(d.id)))
                      .map((d) => (
                        <div
                          key={d.id}
                          className="p-4 rounded-2xl bg-gradient-to-r from-[#0e1233] to-[#0b0e29] border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-between text-xs transition-all shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                              ↓
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">Deposit via {d.paymentMethod}</p>
                              <p className="text-[11px] text-slate-400">
                                UTR/Ref: <span className="font-mono text-slate-300">{d.utrRef || d.transactionId}</span> • {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-mono font-black text-emerald-400 text-sm">+ ₹{d.amount.toFixed(2)}</p>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                d.status === 'approved' || d.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : d.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}>
                                {d.status}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => (isHistoryRecordArchived(d.id) ? unarchiveHistoryRecord(d.id) : archiveHistoryRecord(d.id))}
                              title={isHistoryRecordArchived(d.id) ? 'Restore Record' : 'Archive / Hide Record'}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs"
                            >
                              {isHistoryRecordArchived(d.id) ? 'Unarchive' : 'Archive'}
                            </button>
                          </div>
                        </div>
                      ))}

                  {/* Withdrawals with 15% Platform Charge breakdown */}
                  {(txFilter === 'all' || txFilter === 'withdrawal') &&
                    withdrawals
                      .filter((w) => (showArchivedHistory ? isHistoryRecordArchived(w.id) : !isHistoryRecordArchived(w.id)))
                      .map((w) => {
                        const feePercent = w.chargePercent ?? 15;
                        const feeAmt = w.chargeAmount ?? Math.round(((w.amount * feePercent) / 100) * 100) / 100;
                        const netAmt = w.netAmount ?? Math.round((w.amount - feeAmt) * 100) / 100;
                        return (
                          <div
                            key={w.id}
                            className="p-4 rounded-2xl bg-gradient-to-r from-[#170e2b] to-[#100a21] border border-amber-500/20 hover:border-amber-500/40 flex items-center justify-between text-xs transition-all shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                                ↑
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">Payout to {w.payoutType} ({w.accountHolderName})</p>
                                <p className="text-[11px] text-slate-400">
                                  Gross: <span className="font-mono text-white">₹{w.amount}</span> • 15% Service Fee: <span className="font-mono text-pink-400">-₹{feeAmt}</span> • Net: <span className="font-mono text-emerald-400 font-bold">₹{netAmt}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="font-mono font-black text-amber-400 text-sm">₹{netAmt.toFixed(2)} Net</p>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                  w.status === 'approved'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : w.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}>
                                  {w.status}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => (isHistoryRecordArchived(w.id) ? unarchiveHistoryRecord(w.id) : archiveHistoryRecord(w.id))}
                                title={isHistoryRecordArchived(w.id) ? 'Restore Record' : 'Archive / Hide Record'}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs"
                              >
                                {isHistoryRecordArchived(w.id) ? 'Unarchive' : 'Archive'}
                              </button>
                            </div>
                          </div>
                        );
                      })}

                  {/* Commissions */}
                  {(txFilter === 'all' || txFilter === 'commission') &&
                    commissionLedger
                      .filter((c) => (showArchivedHistory ? isHistoryRecordArchived(c.id) : !isHistoryRecordArchived(c.id)))
                      .map((c) => (
                        <div
                          key={c.id}
                          className="p-4 rounded-2xl bg-gradient-to-r from-[#170e30] to-[#0c0920] border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-between text-xs transition-all shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                              %
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">Level {c.level} Referral ({c.percent}%)</p>
                              <p className="text-[11px] text-slate-400">From player: {c.sourceUserName} (Game #{c.gameId})</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-mono font-black text-purple-300 text-sm">+ ₹{c.amount.toFixed(2)}</p>
                              <span className="text-[10px] text-slate-500">{c.createdAt ? c.createdAt.split('T')[0] : 'Recent'}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => (isHistoryRecordArchived(c.id) ? unarchiveHistoryRecord(c.id) : archiveHistoryRecord(c.id))}
                              title={isHistoryRecordArchived(c.id) ? 'Restore Record' : 'Archive / Hide Record'}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs"
                            >
                              {isHistoryRecordArchived(c.id) ? 'Unarchive' : 'Archive'}
                            </button>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 20: 🎧 SUPPORT */}
            {/* ================================================================= */}
            {activeTab === 'support' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e112d] border border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">🎧 24/7 HELP & SUPPORT</h3>
                      <p className="text-xs text-slate-400">Our customer team is always ready to assist you</p>
                    </div>
                    <Headphones className="w-8 h-8 text-pink-400" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <p className="text-slate-400">WhatsApp Support:</p>
                      <p className="font-mono font-bold text-emerald-400 text-sm">{settings.supportContact?.phone || '+91 98765 43210'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <p className="text-slate-400">Official Email:</p>
                      <p className="font-mono font-bold text-amber-300 text-sm">{settings.supportContact?.email || 'support@apnatambola.com'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 21: 📄 TERMS & CONDITIONS */}
            {/* ================================================================= */}
            {activeTab === 'terms' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e112d] border border-white/10 space-y-4 text-xs text-slate-300 leading-relaxed">
                  <h3 className="text-lg font-black text-white">📄 TERMS & CONDITIONS & FAIR PLAY POLICY</h3>
                  <p>1. <strong>Eligibility:</strong> Players must be 18 years or older to participate.</p>
                  <p>2. <strong>Fair Play:</strong> Live Tambola draws use certified cryptographic random number generation.</p>
                  <p>3. <strong>Wallet Rules:</strong> Main Wallet is for deposit & transfers, Ticket Wallet is exclusively for booking tickets, and Winning Wallet is for verified cash payouts.</p>
                  <p>4. <strong>Prize Pool Policy:</strong> Exactly 70% of eligible ticket sales are distributed among verified winner patterns.</p>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 22: 🔐 SECURITY */}
            {/* ================================================================= */}
            {activeTab === 'security' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e112d] border border-purple-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white">🔐 ACCOUNT SECURITY & PIN</h3>
                      <p className="text-xs text-slate-400">Protect your account and withdrawal transactions</p>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">Two-Factor Authentication (2FA)</p>
                        <p className="text-slate-400">Require OTP code for withdrawal requests</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                        ENABLED
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">Active Login Sessions</p>
                        <p className="text-slate-400">Current device: Chrome on Android / Desktop</p>
                      </div>
                      <span className="text-slate-400 font-mono">IP: Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE BOTTOM NAVIGATION DOCK (Home, Games, Tickets, Wallet, Profile) */}
        {/* ========================================================================= */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080a1c]/95 backdrop-blur-xl border-t border-indigo-500/30 px-2 py-2 flex items-center justify-around">
          <button
            onClick={() => navigateToTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'dashboard' ? 'text-pink-400 font-black' : 'text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigateToTab('liveGames')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'liveGames' ? 'text-red-400 font-black' : 'text-slate-400'
            }`}
          >
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Games</span>
          </button>

          <button
            onClick={() => navigateToTab('myTickets')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'myTickets' ? 'text-purple-400 font-black' : 'text-slate-400'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Tickets</span>
          </button>

          <button
            onClick={() => navigateToTab('mainWallet')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'mainWallet' || activeTab === 'wallet' ? 'text-emerald-400 font-black' : 'text-slate-400'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet</span>
          </button>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-amber-300"
          >
            <Menu className="w-4 h-4" />
            <span>Menu (23)</span>
          </button>
        </div>

      </div>
  );

  if (isPageMode) {
    return (
      <div className="w-full flex-1 flex flex-col">
        {containerContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      {containerContent}
    </div>
  );
};
