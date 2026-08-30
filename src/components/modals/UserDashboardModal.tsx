import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronDown,
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
  LayoutDashboard,
  User,
  Gamepad2,
  BarChart3,
  ArrowLeftRight,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Plus,
  MessageSquare,
  Settings,
  List,
  RefreshCw,
} from 'lucide-react';
import { TAMBOLA_CALLS } from '../../utils/soundEffects';
import { WinningPatternCode, User as UserType } from '../../types/tambola';
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
    allUsers,
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
    syncFromBackend,
  } = useTambola();

  if (!isPageMode && activeModal !== 'userDashboard' && activeModal !== 'deposit' && activeModal !== 'withdraw') {
    return null;
  }

  const activeTab: DashboardTab = userDashboardTab || 'dashboard';

  // State for manual / auto downline refresh
  const [isRefreshingDownline, setIsRefreshingDownline] = useState<boolean>(false);

  const handleRefreshDownline = async () => {
    setIsRefreshingDownline(true);
    try {
      if (syncFromBackend) {
        await syncFromBackend();
      }
    } catch {
      // ignore
    } finally {
      setTimeout(() => setIsRefreshingDownline(false), 500);
    }
  };

  useEffect(() => {
    if (activeTab === 'referral' && syncFromBackend) {
      syncFromBackend();
    }
  }, [activeTab]);

  // Mobile sidebar drawer open/close
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [showArchivedHistory, setShowArchivedHistory] = useState<boolean>(false);
  const [ticketCarouselIdx, setTicketCarouselIdx] = useState<number>(0);
  const [walletMenuExpanded, setWalletMenuExpanded] = useState<boolean>(false);

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

  // Referral Sub-View and Search
  const [referralSubView, setReferralSubView] = useState<'level1' | 'level2' | 'matrix'>('level1');
  const [referralSearchQuery, setReferralSearchQuery] = useState<string>('');

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

  // 5 Sample Colorful Carousel Tickets matching screenshot
  const carouselTickets = [
    {
      id: 'ATB123456',
      ticketId: 'ATB123456',
      gameId: 'GAME1001',
      price: 10,
      colorGradient: 'from-[#0284c7] via-[#0369a1] to-[#082f49]',
      markedBg: 'bg-[#0284c7]',
      numbers: [
        { value: 12, marked: false }, { value: 29, marked: false }, { value: 31, marked: false }, { value: 58, marked: false }, { value: 70, marked: false },
        { value: 1, marked: false }, { value: 19, marked: false }, { value: 33, marked: true }, { value: 46, marked: false }, { value: 71, marked: false },
        { value: 5, marked: false }, { value: 25, marked: false }, { value: 38, marked: true }, { value: 55, marked: true }, { value: 64, marked: false },
      ]
    },
    {
      id: 'ATB123457',
      ticketId: 'ATB123457',
      gameId: 'GAME1001',
      price: 20,
      colorGradient: 'from-[#059669] via-[#047857] to-[#022c22]',
      markedBg: 'bg-[#059669]',
      numbers: [
        { value: 12, marked: false }, { value: 29, marked: false }, { value: 31, marked: false }, { value: 58, marked: false }, { value: 70, marked: false },
        { value: 1, marked: false }, { value: 19, marked: false }, { value: 33, marked: false }, { value: 46, marked: true }, { value: 71, marked: false },
        { value: 5, marked: false }, { value: 25, marked: false }, { value: 38, marked: true }, { value: 55, marked: false }, { value: 64, marked: false },
      ]
    },
    {
      id: 'ATB123458',
      ticketId: 'ATB123458',
      gameId: 'GAME1001',
      price: 10,
      colorGradient: 'from-[#d97706] via-[#b45309] to-[#451a03]',
      markedBg: 'bg-[#d97706]',
      numbers: [
        { value: 12, marked: false }, { value: 29, marked: false }, { value: 31, marked: false }, { value: 58, marked: false }, { value: 70, marked: false },
        { value: 1, marked: false }, { value: 19, marked: false }, { value: 33, marked: false }, { value: 46, marked: false }, { value: 71, marked: false },
        { value: 5, marked: false }, { value: 25, marked: false }, { value: 38, marked: false }, { value: 55, marked: false }, { value: 64, marked: false },
      ]
    },
    {
      id: 'ATB123459',
      ticketId: 'ATB123459',
      gameId: 'GAME1001',
      price: 20,
      colorGradient: 'from-[#db2777] via-[#be185d] to-[#500724]',
      markedBg: 'bg-[#db2777]',
      numbers: [
        { value: 12, marked: false }, { value: 29, marked: false }, { value: 31, marked: false }, { value: 58, marked: false }, { value: 70, marked: false },
        { value: 1, marked: false }, { value: 19, marked: false }, { value: 33, marked: true }, { value: 46, marked: false }, { value: 71, marked: false },
        { value: 5, marked: false }, { value: 25, marked: false }, { value: 38, marked: false }, { value: 55, marked: false }, { value: 64, marked: false },
      ]
    },
    {
      id: 'ATB123460',
      ticketId: 'ATB123460',
      gameId: 'GAME1001',
      price: 40,
      colorGradient: 'from-[#7c3aed] via-[#6d28d9] to-[#2e1065]',
      markedBg: 'bg-[#7c3aed]',
      numbers: [
        { value: 12, marked: false }, { value: 29, marked: false }, { value: 31, marked: false }, { value: 58, marked: false }, { value: 70, marked: false },
        { value: 1, marked: false }, { value: 19, marked: false }, { value: 38, marked: true }, { value: 46, marked: false }, { value: 71, marked: false },
        { value: 5, marked: false }, { value: 25, marked: false }, { value: 31, marked: false }, { value: 59, marked: false }, { value: 64, marked: false },
      ]
    }
  ];

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

  // Complete Sidebar Navigation Items matching screenshot
  const sidebarNavItems: { tab: DashboardTab; label: string; icon: any; badge?: string | number; badgeColor?: string; hasDropdown?: boolean }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'profile', label: 'My Profile', icon: User },
    { tab: 'mainWallet', label: 'Wallet', icon: Wallet, hasDropdown: true },
    { tab: 'deposit', label: 'Add Money', icon: CreditCard },
    { tab: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
    { tab: 'ticketWallet', label: 'Ticket Wallet', icon: Ticket },
    { tab: 'buyTicket', label: 'Buy Ticket', icon: Ticket },
    { tab: 'myTickets', label: 'My Tickets', icon: List },
    { tab: 'liveGames', label: 'Live Games', icon: Gamepad2 },
    { tab: 'winners', label: 'Winners', icon: Trophy },
    { tab: 'referral', label: 'My Team', icon: Users },
    { tab: 'referral', label: 'Referral', icon: Share2 },
    { tab: 'commission', label: 'Income', icon: BarChart3 },
    { tab: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { tab: 'freeTickets', label: 'Free Tickets', icon: Gift, badge: 'New', badgeColor: 'bg-red-500' },
    { tab: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter((n) => !n.isRead).length || 5, badgeColor: 'bg-red-500' },
    { tab: 'support', label: 'Support', icon: Headphones },
    { tab: 'security', label: 'Settings', icon: Settings },
    { tab: 'logout', label: 'Logout', icon: LogOut },
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
    <div className={`relative w-full ${isPageMode ? 'flex-1 min-h-[calc(100vh-100px)] rounded-2xl' : 'max-w-7xl h-full sm:h-[96vh] rounded-none sm:rounded-3xl'} flex flex-col bg-[#07091e] border-0 sm:border border-indigo-500/20 shadow-2xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]`}>
      {/* ========================================================================= */}
      {/* TOP HEADER */}
      {/* ========================================================================= */}
      <header className="h-16 shrink-0 px-4 sm:px-6 bg-[#090c24] border-b border-indigo-500/20 flex items-center justify-between z-30">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigateToTab('dashboard')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-600 p-[2px] shadow-lg flex items-center justify-center">
              <span className="text-base">🎱</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent font-['Outfit']">
                APNA TAMBOLA
              </span>
              <span className="text-sm">👑</span>
            </div>
          </div>
        </div>

        {/* Center: Welcome Back & User ID */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-slate-400">Welcome back,</span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white">{currentUser?.name || 'Amit Kumar'}</span>
            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black" title="Verified User">
              ✓
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-black/40 border border-white/10 text-xs font-mono text-slate-300 font-bold ml-1">
            {currentUser?.id || 'AT102458'}
          </span>
        </div>

        {/* Right: Add Money Button + Notifications + Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigateToTab('deposit')}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#d946ef] via-[#ec4899] to-[#db2777] hover:brightness-110 text-white text-xs font-black shadow-lg shadow-pink-500/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <span>Add Money</span>
            <Plus className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => navigateToTab('notifications')}
            className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-200" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md">
              {notifications.filter((n) => !n.isRead).length || 5}
            </span>
          </button>

          {/* Avatar Profile */}
          <div
            onClick={() => navigateToTab('profile')}
            className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px] cursor-pointer"
            title="My Profile"
          >
            <div className="w-full h-full rounded-full bg-[#0d1238] flex items-center justify-center text-sm font-bold text-white overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="fallback-initial uppercase">{currentUser?.name?.charAt(0) || 'A'}</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090c24]"></span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN BODY: SIDEBAR + CONTENT WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-60 shrink-0 bg-[#080a21] border-r border-indigo-500/20 flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="p-3 space-y-1">
            {sidebarNavItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab && (item.label !== 'My Team' && item.label !== 'Referral' ? true : activeTab === 'referral');
              return (
                <div key={`${item.tab}-${idx}`}>
                  <button
                    onClick={() => {
                      if (item.hasDropdown) {
                        setWalletMenuExpanded(!walletMenuExpanded);
                        navigateToTab('mainWallet');
                      } else {
                        navigateToTab(item.tab);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-600/30 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.hasDropdown && (
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${walletMenuExpanded ? 'rotate-180' : ''}`} />
                      )}
                      {item.badge !== undefined && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-red-500'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Wallet Collapsible Submenu */}
                  {item.hasDropdown && walletMenuExpanded && (
                    <div className="pl-6 pr-2 py-1 space-y-1 bg-black/20 rounded-xl my-1 border border-white/5">
                      <button
                        onClick={() => navigateToTab('mainWallet')}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                          activeTab === 'mainWallet' ? 'text-amber-300 font-bold bg-white/5' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>Main Wallet</span>
                        <span className="text-[10px] font-mono">₹{(currentUser.depositWallet || 2540).toLocaleString('en-IN')}</span>
                      </button>
                      <button
                        onClick={() => navigateToTab('ticketWallet')}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                          activeTab === 'ticketWallet' ? 'text-emerald-300 font-bold bg-white/5' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>Ticket Wallet</span>
                        <span className="text-[10px] font-mono">₹{(currentUser.ticketWallet || 1250).toLocaleString('en-IN')}</span>
                      </button>
                      <button
                        onClick={() => navigateToTab('winningWallet')}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                          activeTab === 'winningWallet' ? 'text-amber-400 font-bold bg-white/5' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>Winning Wallet</span>
                        <span className="text-[10px] font-mono">₹{(currentUser.winningWallet || 3780).toLocaleString('en-IN')}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Sidebar: REFER & EARN Banner */}
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] border border-purple-500/30 text-center relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wider mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>REFER & EARN</span>
            </div>
            <p className="text-[10px] text-slate-300 mb-3 px-1 leading-tight">
              Refer your friends and earn exciting rewards
            </p>
            <div className="relative my-2 flex justify-center">
              <span className="text-3xl animate-bounce">🎁</span>
            </div>
            <button
              onClick={() => navigateToTab('referral')}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-red-500/30 cursor-pointer transition-all"
            >
              Refer Now
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex">
            <div className="w-72 bg-[#080a21] border-r border-indigo-500/30 h-full flex flex-col justify-between overflow-y-auto p-4 animate-slide-right">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-black uppercase text-amber-300">USER MENU</span>
                  <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="py-2 space-y-1">
                  {sidebarNavItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;
                    return (
                      <button
                        key={`${item.tab}-${idx}`}
                        onClick={() => navigateToTab(item.tab)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive ? 'bg-[#2563eb] text-white font-black' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-red-500'}`}>
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
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-[#07081c] pb-24 sm:pb-8 custom-scrollbar">
          {/* ================================================================= */}
          {/* TAB 1: 🏠 DASHBOARD HOME (Matching User Screenshot) */}
          {/* ================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              {/* 1. TOP 4 GLOWING WALLET CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Main Wallet (Blue Card) */}
                <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#0c368d] via-[#0e276b] to-[#0d1b4b] border border-blue-400/40 shadow-xl overflow-hidden group">
                  <div className="absolute -top-3 -right-3 w-20 h-20 opacity-10 text-white pointer-events-none">
                    <Wallet className="w-full h-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">Main Wallet</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      ₹{(currentUser.depositWallet || 2540).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-blue-200/80 font-medium mt-0.5">Available Balance</p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center gap-2">
                    <button
                      onClick={() => navigateToTab('deposit')}
                      className="flex-1 py-1.5 px-3 rounded-full bg-[#1d4ed8] hover:bg-[#2563eb] text-white text-xs font-black shadow-md transition-all cursor-pointer text-center"
                    >
                      Add Money
                    </button>
                    <button
                      onClick={() => navigateToTab('transactions')}
                      className="flex-1 py-1.5 px-3 rounded-full bg-black/40 hover:bg-black/60 text-white/90 text-xs font-bold transition-all cursor-pointer text-center border border-white/10"
                    >
                      History
                    </button>
                  </div>
                </div>

                {/* 2. Ticket Wallet (Green Card) */}
                <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#008744] via-[#045e34] to-[#063d21] border border-emerald-400/40 shadow-xl overflow-hidden group">
                  <div className="absolute -top-3 -right-3 w-20 h-20 opacity-10 text-white pointer-events-none">
                    <Ticket className="w-full h-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                        <Ticket className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">Ticket Wallet</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      ₹{(currentUser.ticketWallet || 1250).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-emerald-200/80 font-medium mt-0.5">Available Balance</p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center gap-2">
                    <button
                      onClick={() => navigateToTab('buyTicket')}
                      className="flex-1 py-1.5 px-3 rounded-full bg-[#059669] hover:bg-[#10b981] text-white text-xs font-black shadow-md transition-all cursor-pointer text-center"
                    >
                      Buy Ticket
                    </button>
                    <button
                      onClick={() => navigateToTab('transactions')}
                      className="flex-1 py-1.5 px-3 rounded-full bg-black/40 hover:bg-black/60 text-white/90 text-xs font-bold transition-all cursor-pointer text-center border border-white/10"
                    >
                      History
                    </button>
                  </div>
                </div>

                {/* 3. Withdrawal Wallet (Amber/Orange Card) */}
                <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#d97706] via-[#b45309] to-[#78350f] border border-amber-400/40 shadow-xl overflow-hidden group">
                  <div className="absolute -top-3 -right-3 w-20 h-20 opacity-10 text-white pointer-events-none">
                    <Trophy className="w-full h-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">Withdrawal Wallet</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      ₹{(currentUser.winningWallet || 3780).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-amber-200/80 font-medium mt-0.5">Available Balance</p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center gap-2">
                    <button
                      onClick={() => navigateToTab('withdraw')}
                      className="flex-1 py-1.5 px-3 rounded-full bg-[#ea580c] hover:bg-[#f97316] text-white text-xs font-black shadow-md transition-all cursor-pointer text-center"
                    >
                      Withdraw
                    </button>
                    <button
                      onClick={() => navigateToTab('transactions')}
                      className="flex-1 py-1.5 px-3 rounded-full bg-black/40 hover:bg-black/60 text-white/90 text-xs font-bold transition-all cursor-pointer text-center border border-white/10"
                    >
                      History
                    </button>
                  </div>
                </div>

                {/* 4. Total Income (Purple Card) */}
                <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#3b0764] border border-purple-400/40 shadow-xl overflow-hidden group">
                  <div className="absolute -top-3 -right-3 w-20 h-20 opacity-10 text-white pointer-events-none">
                    <BarChart3 className="w-full h-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">Total Income</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      ₹{(((currentUser.referralEarnings || 0) + (currentUser.gameWinnings || 0)) || 12680).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-purple-200/80 font-medium mt-0.5">Total Earning</p>
                  </div>
                  <div className="mt-4 pt-2">
                    <button
                      onClick={() => navigateToTab('commission')}
                      className="w-full py-1.5 px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black shadow-md transition-all cursor-pointer text-center border border-white/10"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. QUICK ACTIONS ROW */}
              <div className="space-y-2.5">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">Quick Actions</h3>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {/* 1. Add Money */}
                  <button
                    onClick={() => navigateToTab('deposit')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#6366f1] to-[#4338ca] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">Add Money</span>
                  </button>

                  {/* 2. Buy Ticket */}
                  <button
                    onClick={() => navigateToTab('buyTicket')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#10b981] to-[#047857] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <Ticket className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">Buy Ticket</span>
                  </button>

                  {/* 3. Live Game */}
                  <button
                    onClick={() => navigateToTab('liveGames')}
                    className="relative flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#ec4899] to-[#be185d] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <span className="absolute -top-1.5 px-1 py-0.1 rounded-full bg-red-600 text-[7px] font-black tracking-wider uppercase text-white shadow-md animate-pulse">
                      LIVE
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <Gamepad2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">Live Game</span>
                  </button>

                  {/* 4. Withdraw */}
                  <button
                    onClick={() => navigateToTab('withdraw')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#f97316] to-[#c2410c] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <CreditCard className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">Withdraw</span>
                  </button>

                  {/* 5. Transfer */}
                  <button
                    onClick={() => navigateToTab('transfer')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#0284c7] to-[#0369a1] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">Transfer</span>
                  </button>

                  {/* 6. My Team */}
                  <button
                    onClick={() => navigateToTab('referral')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#06b6d4] to-[#0e7490] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <Users className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">My Team</span>
                  </button>

                  {/* 7. Referral */}
                  <button
                    onClick={() => navigateToTab('referral')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#f43f5e] to-[#be123c] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <Share2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">Referral</span>
                  </button>

                  {/* 8. Income */}
                  <button
                    onClick={() => navigateToTab('commission')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#eab308] to-[#a16207] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">Income</span>
                  </button>

                  {/* 9. Free Tickets */}
                  <button
                    onClick={() => navigateToTab('freeTickets')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#10b981] to-[#047857] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <Gift className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">Free Tickets</span>
                  </button>

                  {/* 10. History */}
                  <button
                    onClick={() => navigateToTab('transactions')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] hover:scale-105 transition-all text-white shadow-lg cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <History className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">History</span>
                  </button>
                </div>
              </div>

              {/* 3. MIDDLE ROW: LIVE GAMES & MY TICKETS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Live Games (lg:col-span-5) */}
                <div className="lg:col-span-5 rounded-2xl p-4 sm:p-5 bg-[#0e112d] border border-indigo-500/30 flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-black text-white">Live Games</h3>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                      LIVE
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Tambola Ticket Visual */}
                    <div className="w-full sm:w-44 shrink-0 rounded-2xl p-2.5 bg-gradient-to-br from-red-600 via-rose-700 to-amber-700 shadow-xl border border-red-400/40">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-black text-white tracking-wider mb-2">
                        <span>APNA TAMBOLA</span>
                        <span>👑</span>
                      </div>
                      {/* 3x5 Grid */}
                      <div className="grid grid-cols-5 gap-1 text-center font-mono font-bold text-xs">
                        {/* Row 1 */}
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">3</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">17</div>
                        <div className="h-6 bg-blue-600 text-white rounded flex items-center justify-center font-black">41</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">55</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">73</div>
                        {/* Row 2 */}
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">8</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">22</div>
                        <div className="h-6 bg-red-600 text-white rounded flex items-center justify-center font-black">34</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">45</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">66</div>
                        {/* Row 3 */}
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">12</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">28</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">36</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">59</div>
                        <div className="h-6 bg-white text-slate-900 rounded flex items-center justify-center font-black">78</div>
                      </div>
                    </div>

                    {/* Game Details */}
                    <div className="flex-1 space-y-1.5 text-xs w-full">
                      <div className="flex justify-between sm:block">
                        <span className="text-slate-400 text-[11px]">Game ID:</span>
                        <p className="font-bold text-white text-xs sm:text-sm font-mono">{activeLiveGame?.id || 'GAME1001'}</p>
                      </div>
                      <div className="flex justify-between sm:block">
                        <span className="text-slate-400 text-[11px]">Ticket Price:</span>
                        <p className="font-bold text-white text-xs sm:text-sm font-mono">₹{activeLiveGame?.ticketPrice || 10}</p>
                      </div>
                      <div className="flex justify-between sm:block">
                        <span className="text-slate-400 text-[11px]">Players:</span>
                        <p className="font-bold text-slate-300 text-xs font-mono">{activeLiveGame?.ticketsSoldCount || 120}/500</p>
                      </div>
                      <div className="flex justify-between sm:block">
                        <span className="text-slate-400 text-[11px]">Start Time:</span>
                        <p className="font-bold text-white text-xs font-mono">08:00 PM</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-sm sm:text-base font-black text-white font-mono tracking-widest mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-black/50">02</span>
                          <span>:</span>
                          <span className="px-1.5 py-0.5 rounded bg-black/50">15</span>
                        </div>
                        <div className="flex items-center gap-3 text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>MIN</span>
                          <span className="ml-1">SEC</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Join Now Button */}
                  <button
                    onClick={() => navigateToTab('liveGames')}
                    className="w-full mt-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#ec4899] to-[#be185d] hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-lg shadow-pink-500/30 transition-all cursor-pointer text-center"
                  >
                    Join Now
                  </button>
                </div>

                {/* Right: My Tickets Carousel (lg:col-span-7) */}
                <div className="lg:col-span-7 rounded-2xl p-4 sm:p-5 bg-[#0e112d] border border-indigo-500/30 flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-black text-white">My Tickets</h3>
                    <button
                      onClick={() => navigateToTab('myTickets')}
                      className="text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  {/* Carousel Row with Prev/Next Buttons */}
                  <div className="relative flex items-center gap-2">
                    <button
                      onClick={() => setTicketCarouselIdx((prev) => Math.max(0, prev - 1))}
                      disabled={ticketCarouselIdx === 0}
                      className="p-1.5 rounded-full bg-black/40 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer shrink-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Tickets List */}
                    <div className="flex-1 flex gap-2 overflow-x-auto custom-scrollbar py-1">
                      {carouselTickets.map((ticket, idx) => (
                        <div
                          key={ticket.id || idx}
                          className={`min-w-[125px] sm:min-w-[135px] flex-1 rounded-2xl p-2.5 sm:p-3 bg-gradient-to-b ${ticket.colorGradient} border border-white/20 shadow-lg text-white`}
                        >
                          <div className="text-[9px] text-white/80">Ticket ID</div>
                          <div className="text-[11px] font-bold font-mono tracking-tight text-white">{ticket.ticketId}</div>

                          {/* 3x5 Grid */}
                          <div className="grid grid-cols-5 gap-0.5 my-2 text-center text-[8px] font-mono font-bold">
                            {ticket.numbers.map((num, nIdx) => (
                              <div
                                key={nIdx}
                                className={`h-3.5 rounded-[2px] flex items-center justify-center ${
                                  num.marked ? `${ticket.markedBg} text-white font-black` : 'bg-white text-slate-900'
                                }`}
                              >
                                {num.value}
                              </div>
                            ))}
                          </div>

                          <div className="text-[9px] text-white/80">Game ID</div>
                          <div className="text-[10px] font-bold font-mono text-white">{ticket.gameId}</div>
                          <div className="text-xs font-black font-mono mt-1 text-white">₹{ticket.price}</div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setTicketCarouselIdx((prev) => Math.min(2, prev + 1))}
                      className="p-1.5 rounded-full bg-black/40 border border-white/10 text-slate-300 hover:text-white cursor-pointer shrink-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Carousel Pagination Dots */}
                  <div className="flex justify-center items-center gap-1.5 mt-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                  </div>
                </div>
              </div>

              {/* 4. BOTTOM ROW: 3 COLUMNS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Column 1: My Team */}
                <div className="rounded-2xl p-4 sm:p-5 bg-[#0e112d] border border-indigo-500/30 flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs sm:text-sm font-black text-white">
                      My Team <span className="text-xs text-slate-400 font-normal">(Total Members)</span>
                    </h3>
                    <button
                      onClick={() => navigateToTab('referral')}
                      className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  {/* 8 Level Cards in 2x4 Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Level 1 */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Level 1</p>
                        <p className="text-xs font-black text-white font-mono">25 <span className="text-[9px] text-slate-400 font-normal">Members</span></p>
                      </div>
                    </div>

                    {/* Level 2 */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Level 2</p>
                        <p className="text-xs font-black text-white font-mono">64 <span className="text-[9px] text-slate-400 font-normal">Members</span></p>
                      </div>
                    </div>

                    {/* Level 3 */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Level 3</p>
                        <p className="text-xs font-black text-white font-mono">120 <span className="text-[9px] text-slate-400 font-normal">Members</span></p>
                      </div>
                    </div>

                    {/* Level 4 */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-pink-400/20 text-pink-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Level 4</p>
                        <p className="text-xs font-black text-white font-mono">180 <span className="text-[9px] text-slate-400 font-normal">Members</span></p>
                      </div>
                    </div>

                    {/* Level 5 */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-orange-400/20 text-orange-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Level 5</p>
                        <p className="text-xs font-black text-white font-mono">250 <span className="text-[9px] text-slate-400 font-normal">Members</span></p>
                      </div>
                    </div>

                    {/* Level 6 */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Level 6</p>
                        <p className="text-xs font-black text-white font-mono">320 <span className="text-[9px] text-slate-400 font-normal">Members</span></p>
                      </div>
                    </div>

                    {/* Level 7 */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Level 7</p>
                        <p className="text-xs font-black text-white font-mono">400 <span className="text-[9px] text-slate-400 font-normal">Members</span></p>
                      </div>
                    </div>

                    {/* Level 8 */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-rose-400/20 text-rose-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Level 8</p>
                        <p className="text-xs font-black text-white font-mono">520 <span className="text-[9px] text-slate-400 font-normal">Members</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: My Referral Link */}
                <div className="rounded-2xl p-4 sm:p-5 bg-[#0e112d] border border-indigo-500/30 flex flex-col justify-between shadow-xl space-y-3">
                  <h3 className="text-xs sm:text-sm font-black text-white">My Referral Link</h3>

                  {/* URL Box */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300 truncate select-all">
                    {`https://apnatambola.com/register?ref=${currentUser.referralCode || 'AT102458'}`}
                  </div>

                  {/* Action Buttons: Copy, Share, WhatsApp */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleCopyRef}
                      className="py-2 px-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'APNA TAMBOLA',
                            text: `Join APNA TAMBOLA with my referral code ${currentUser.referralCode || 'AT102458'}!`,
                            url: `https://apnatambola.com/register?ref=${currentUser.referralCode || 'AT102458'}`,
                          });
                        } else {
                          handleCopyRef();
                        }
                      }}
                      className="py-2 px-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => {
                        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `🎱 Join APNA TAMBOLA now! Play live games & win real prizes! Click here: https://apnatambola.com/register?ref=${currentUser.referralCode || 'AT102458'}`
                        )}`;
                        window.open(url, '_blank');
                      }}
                      className="py-2 px-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  {/* Stats: Direct, Total, Active */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                    <div>
                      <p className="text-[9px] text-slate-400">Direct Members</p>
                      <p className="text-sm font-black text-white font-mono mt-0.5">25</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400">Total Team</p>
                      <p className="text-sm font-black text-white font-mono mt-0.5">1,881</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400">Active Members</p>
                      <p className="text-sm font-black text-white font-mono mt-0.5">1,245</p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Recent Transactions */}
                <div className="rounded-2xl p-4 sm:p-5 bg-[#0e112d] border border-indigo-500/30 flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs sm:text-sm font-black text-white">Recent Transactions</h3>
                    <button
                      onClick={() => navigateToTab('transactions')}
                      className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* TX 1 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-[11px] font-bold text-white truncate">Ticket Purchase - GAME1001</p>
                          <p className="text-[9px] text-slate-400">Today, 07:30 PM</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black font-mono text-red-400 shrink-0">-₹10.00</span>
                    </div>

                    {/* TX 2 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-[11px] font-bold text-white truncate">
                            Add Money - <span className="text-emerald-400">Approved</span>
                          </p>
                          <p className="text-[9px] text-slate-400">Today, 06:20 PM</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black font-mono text-emerald-400 shrink-0">+₹500.00</span>
                    </div>

                    {/* TX 3 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-[11px] font-bold text-white truncate">Withdrawal Request</p>
                          <p className="text-[9px] text-slate-400">Today, 05:10 PM</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black font-mono text-orange-400 shrink-0">-₹1,000.00</span>
                    </div>

                    {/* TX 4 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          <Share2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-[11px] font-bold text-white truncate">Referral Income - Level 1</p>
                          <p className="text-[9px] text-slate-400">Today, 04:30 PM</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black font-mono text-cyan-400 shrink-0">+₹25.00</span>
                    </div>

                    {/* TX 5 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-[11px] font-bold text-white truncate">Ticket Purchase - GAME1002</p>
                          <p className="text-[9px] text-slate-400">Today, 03:15 PM</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black font-mono text-red-400 shrink-0">-₹20.00</span>
                    </div>
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
            {/* TAB 14: 👥 MY REFERRALS (LEVEL 1 & LEVEL 2 DOWNLINE NETWORK) */}
            {/* ================================================================= */}
            {activeTab === 'referral' && (() => {
              // Helper for lenient, multi-attribute sponsor verification
              const isDirectlyReferredBy = (targetUser: UserType, sponsor: UserType) => {
                if (!targetUser || !sponsor || !targetUser.referredBy || targetUser.id === sponsor.id) return false;
                const ref = (targetUser.referredBy || '').trim().toUpperCase();
                const sponsorId = (sponsor.id || '').trim().toUpperCase();
                const sponsorCode = (sponsor.referralCode || sponsor.id || '').trim().toUpperCase();
                const refAlpha = ref.replace(/[^A-Z0-9]/g, '');
                const sponsorIdAlpha = sponsorId.replace(/[^A-Z0-9]/g, '');
                const sponsorCodeAlpha = sponsorCode.replace(/[^A-Z0-9]/g, '');
                const refDigits = targetUser.referredBy.replace(/[^0-9]/g, '');
                const sponsorDigits = (sponsor.id || '').replace(/[^0-9]/g, '');
                const sponsorCodeDigits = (sponsor.referralCode || '').replace(/[^0-9]/g, '');
                const sponsorPhone = (sponsor.phone || '').replace(/[^0-9]/g, '');
                const sponsorEmail = (sponsor.email || '').trim().toLowerCase();

                return (
                  ref === sponsorId ||
                  ref === sponsorCode ||
                  (sponsorIdAlpha && refAlpha === sponsorIdAlpha) ||
                  (sponsorCodeAlpha && refAlpha === sponsorCodeAlpha) ||
                  (sponsorDigits.length >= 4 && refDigits === sponsorDigits) ||
                  (sponsorCodeDigits.length >= 4 && refDigits === sponsorCodeDigits) ||
                  (sponsorPhone && refPhone.length >= 10 && refPhone === sponsorPhone) ||
                  (sponsorEmail && targetUser.referredBy.trim().toLowerCase() === sponsorEmail)
                );
              };

              // Level 1: Direct Referrals (Sponsor = currentUser)
              const level1Users = allUsers.filter((u) => isDirectlyReferredBy(u, currentUser));
              const level1Ids = new Set(level1Users.map((u) => u.id.toUpperCase()));
              const level1Codes = new Set(level1Users.map((u) => (u.referralCode || u.id).toUpperCase()));

              // Level 2: Indirect Referrals (Referred by Level 1 users)
              const level2Users = allUsers.filter((u) => {
                if (!u || u.id === currentUser.id || level1Ids.has(u.id.toUpperCase()) || !u.referredBy) return false;
                return level1Users.some((l1) => isDirectlyReferredBy(u, l1));
              });

              // Filtered Lists
              const filteredL1 = level1Users.filter((u) => {
                const q = referralSearchQuery.toLowerCase();
                return (
                  !q ||
                  u.name.toLowerCase().includes(q) ||
                  u.id.toLowerCase().includes(q) ||
                  (u.phone && u.phone.includes(q))
                );
              });

              const filteredL2 = level2Users.filter((u) => {
                const q = referralSearchQuery.toLowerCase();
                return (
                  !q ||
                  u.name.toLowerCase().includes(q) ||
                  u.id.toLowerCase().includes(q) ||
                  (u.referredBy && u.referredBy.toLowerCase().includes(q)) ||
                  (u.phone && u.phone.includes(q))
                );
              });

              const origin = typeof window !== 'undefined' ? window.location.origin : '';
              const myRefLink = `${origin}/register?ref=${currentUser.id}`;

              return (
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                  {/* Live Downline Flash Banner */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-amber-500/10 to-purple-950/40 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-sm shadow-emerald-400"></span>
                      </span>
                      <div className="text-xs">
                        <span className="font-black text-emerald-400 tracking-wide">⚡ REAL-TIME AUTO-SYNC ACTIVE:</span>{' '}
                        <span className="text-white font-bold">
                          Level 1 ({level1Users.length} Directs) • Level 2 ({level2Users.length} Sub-Members)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Auto-Refreshing Live (1s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Header Referral Box */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 to-pink-950/70 border border-purple-500/40 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-pink-400" />
                          <span>8-LEVEL TEAM REFERRAL SYSTEM</span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Share your permanent link &amp; get instant commissions on downline ticket gameplay!
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyRef}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                        </button>
                        <button
                          onClick={() => {
                            const msg = `🎉 Join Apna Tambola with my Referral Link & get ₹10 Free Withdrawal Bonus + 2 Free Tickets! Register here: ${myRefLink}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>WhatsApp Share</span>
                        </button>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 text-center">
                        <span className="text-[11px] text-slate-400 font-bold">Level 1 (Directs)</span>
                        <p className="text-xl font-black text-amber-300 font-mono mt-0.5">{level1Users.length}</p>
                        <span className="text-[10px] text-emerald-400 font-semibold">2% Lifetime Income</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 text-center">
                        <span className="text-[11px] text-slate-400 font-bold">Level 2 (Indirects)</span>
                        <p className="text-xl font-black text-purple-300 font-mono mt-0.5">{level2Users.length}</p>
                        <span className="text-[10px] text-purple-400 font-semibold">1% Lifetime Income</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 text-center">
                        <span className="text-[11px] text-slate-400 font-bold">Total Team Size</span>
                        <p className="text-xl font-black text-pink-400 font-mono mt-0.5">{downlineStats.totalTeamCount || (level1Users.length + level2Users.length)}</p>
                        <span className="text-[10px] text-slate-400">8 Levels Total</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 text-center">
                        <span className="text-[11px] text-slate-400 font-bold">Referral Earnings</span>
                        <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">₹{currentUser.referralEarnings}</p>
                        <span className="text-[10px] text-emerald-400">Auto-Credited</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 1 / Level 2 Sub-Nav Switcher */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0a0c24] p-2 rounded-2xl border border-white/10">
                    <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
                      <button
                        onClick={() => setReferralSubView('level1')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          referralSubView === 'level1'
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>LEVEL 1 DIRECTS ({level1Users.length})</span>
                      </button>

                      <button
                        onClick={() => setReferralSubView('level2')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          referralSubView === 'level2'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>LEVEL 2 MEMBERS ({level2Users.length})</span>
                      </button>

                      <button
                        onClick={() => setReferralSubView('matrix')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          referralSubView === 'matrix'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>8-LEVEL MATRIX</span>
                      </button>
                    </div>

                    {referralSubView !== 'matrix' && (
                      <div className="w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search member by Name or ID..."
                          value={referralSearchQuery}
                          onChange={(e) => setReferralSearchQuery(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* LEVEL 1: DIRECT REFERRALS TABLE */}
                  {referralSubView === 'level1' && (
                    <div className="p-6 rounded-3xl bg-[#0e112d] border border-amber-500/30 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                            🟢 DIRECT REFERRAL USER LIST (LEVEL 1)
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Users registered directly using your Referral ID ({currentUser.id}). You earn 2% commission on all their ticket games!
                          </p>
                        </div>
                        <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          {level1Users.length} Direct Members
                        </span>
                      </div>

                      {filteredL1.length === 0 ? (
                        <div className="py-10 text-center space-y-3 bg-black/30 rounded-2xl border border-white/5 p-6">
                          <p className="text-base font-bold text-slate-200">
                            {referralSearchQuery ? 'No matching Level 1 referrals found' : 'No Direct Referrals Yet'}
                          </p>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Share your referral link with friends, WhatsApp groups, or social media. When they register, they appear here in real time!
                          </p>
                          <div className="pt-2 flex justify-center gap-2">
                            <button
                              onClick={handleCopyRef}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy My Referral Link ({currentUser.id})</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                                <th className="pb-3 px-2">#</th>
                                <th className="pb-3 px-2">User ID</th>
                                <th className="pb-3 px-2">Member Name</th>
                                <th className="pb-3 px-2">Mobile</th>
                                <th className="pb-3 px-2">Joined Date</th>
                                <th className="pb-3 px-2">Commission</th>
                                <th className="pb-3 px-2 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono">
                              {filteredL1.map((refUser, idx) => {
                                const maskedPhone = refUser.phone && refUser.phone.length >= 10
                                  ? `${refUser.phone.slice(0, 3)}****${refUser.phone.slice(-3)}`
                                  : refUser.phone || '--';
                                const joinedDate = refUser.createdAt
                                  ? new Date(refUser.createdAt).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : 'Active';

                                return (
                                  <tr key={refUser.id} className="hover:bg-amber-400/5 transition-colors">
                                    <td className="py-3 px-2 text-slate-500 font-sans">{idx + 1}</td>
                                    <td className="py-3 px-2">
                                      <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-black border border-amber-400/40 text-[11px]">
                                        {refUser.id}
                                      </span>
                                    </td>
                                    <td className="py-3 px-2 font-sans font-bold text-white">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black text-[10px] flex items-center justify-center">
                                          {refUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{refUser.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-2 text-slate-300 font-mono">{maskedPhone}</td>
                                    <td className="py-3 px-2 text-slate-400 text-[11px] font-sans">{joinedDate}</td>
                                    <td className="py-3 px-2">
                                      <span className="text-emerald-400 font-bold font-mono">2.0%</span>
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 font-sans inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        Active Direct ✓
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEVEL 2: INDIRECT TEAM MEMBERS TABLE */}
                  {referralSubView === 'level2' && (
                    <div className="p-6 rounded-3xl bg-[#0e112d] border border-purple-500/30 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <h4 className="text-sm font-black text-purple-300 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
                            🟣 MEMBER LEVEL 2 (INDIRECT TEAM USER LIST)
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Users introduced by your Level 1 direct team members. You earn 1% commission on all their ticket games!
                          </p>
                        </div>
                        <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          {level2Users.length} Level 2 Members
                        </span>
                      </div>

                      {filteredL2.length === 0 ? (
                        <div className="py-10 text-center space-y-3 bg-black/30 rounded-2xl border border-white/5 p-6">
                          <p className="text-base font-bold text-slate-200">
                            {referralSearchQuery ? 'No matching Level 2 members found' : 'No Level 2 Team Members Yet'}
                          </p>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            When your direct referrals (Level 1) invite their friends using their own referral links, those members will automatically appear here under Level 2!
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                                <th className="pb-3 px-2">#</th>
                                <th className="pb-3 px-2">User ID</th>
                                <th className="pb-3 px-2">Member Name</th>
                                <th className="pb-3 px-2">Mobile</th>
                                <th className="pb-3 px-2">Introduced By (L1 Sponsor)</th>
                                <th className="pb-3 px-2">Commission</th>
                                <th className="pb-3 px-2 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono">
                              {filteredL2.map((refUser, idx) => {
                                const maskedPhone = refUser.phone && refUser.phone.length >= 10
                                  ? `${refUser.phone.slice(0, 3)}****${refUser.phone.slice(-3)}`
                                  : refUser.phone || '--';
                                const l1Sponsor = level1Users.find(
                                  (l1) => l1.id.toUpperCase() === (refUser.referredBy || '').toUpperCase() ||
                                          (l1.referralCode && l1.referralCode.toUpperCase() === (refUser.referredBy || '').toUpperCase())
                                );
                                const sponsorLabel = l1Sponsor ? `${l1Sponsor.name} (${l1Sponsor.id})` : refUser.referredBy || 'Direct L1';

                                return (
                                  <tr key={refUser.id} className="hover:bg-purple-400/5 transition-colors">
                                    <td className="py-3 px-2 text-slate-500 font-sans">{idx + 1}</td>
                                    <td className="py-3 px-2">
                                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-black border border-purple-500/40 text-[11px]">
                                        {refUser.id}
                                      </span>
                                    </td>
                                    <td className="py-3 px-2 font-sans font-bold text-white">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 text-white font-black text-[10px] flex items-center justify-center">
                                          {refUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{refUser.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-2 text-slate-300 font-mono">{maskedPhone}</td>
                                    <td className="py-3 px-2">
                                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-amber-300 font-mono text-[10px] border border-white/10 font-bold">
                                        {sponsorLabel}
                                      </span>
                                    </td>
                                    <td className="py-3 px-2">
                                      <span className="text-purple-400 font-bold font-mono">1.0%</span>
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30 font-sans inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                        Active L2 ✓
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 8 Levels Matrix */}
                  {referralSubView === 'matrix' && (
                    <div className="p-6 rounded-3xl bg-[#0e112d] border border-white/10 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-pink-400" />
                          <span>8-LEVEL COMMISSION MATRIX BREAKDOWN</span>
                        </h4>
                        <span className="text-xs text-pink-400 font-bold">Total Payout: 4.6%</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { lvl: 1, name: 'Level 1 (Direct)', pct: '2.0%', count: level1Users.length, color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
                          { lvl: 2, name: 'Level 2 (Sub-Team)', pct: '1.0%', count: level2Users.length, color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' },
                          { lvl: 3, name: 'Level 3', pct: '0.5%', count: 0, color: 'text-pink-400 border-white/5 bg-black/40' },
                          { lvl: 4, name: 'Level 4', pct: '0.4%', count: 0, color: 'text-pink-400 border-white/5 bg-black/40' },
                          { lvl: 5, name: 'Level 5', pct: '0.3%', count: 0, color: 'text-pink-400 border-white/5 bg-black/40' },
                          { lvl: 6, name: 'Level 6', pct: '0.2%', count: 0, color: 'text-pink-400 border-white/5 bg-black/40' },
                          { lvl: 7, name: 'Level 7', pct: '0.1%', count: 0, color: 'text-pink-400 border-white/5 bg-black/40' },
                          { lvl: 8, name: 'Level 8', pct: '0.1%', count: 0, color: 'text-pink-400 border-white/5 bg-black/40' },
                        ].map((l) => (
                          <div key={l.lvl} className={`p-3.5 rounded-2xl border ${l.color} space-y-1`}>
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-300">{l.name}</span>
                              <span className="font-mono font-black">{l.pct}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                              <span>Members:</span>
                              <span className="font-mono font-bold text-white">{l.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300/90 leading-relaxed">
                        💡 <strong>Commission Rule:</strong> Referral income is credited automatically upon game execution when any downline member purchases and plays a contest ticket.
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

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
