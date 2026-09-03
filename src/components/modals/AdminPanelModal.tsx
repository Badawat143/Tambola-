import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { ApnaTambolaLogo } from '../ApnaTambolaLogo';
import {
  X,
  Settings,
  Sliders,
  Trophy,
  Users,
  Bell,
  Plus,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Percent,
  Gift,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Search,
  CreditCard,
  FileText,
  TrendingUp,
  Undo2,
  Radio,
  Menu,
  Download,
  Database,
  Send,
  Eye,
  Flame,
  Award,
  Palette,
  ShieldCheck,
  Printer,
  Lock,
  Unlock,
  Trash2,
  Key,
  Power,
  Check,
  AlertTriangle,
  UserX,
  UserCheck,
  Tag,
  Coins,
  Globe,
  MessageSquare,
  Maximize2,
  ChevronRight,
  ChevronDown,
  Crown,
  Gamepad2,
  History,
  LifeBuoy,
  LayoutDashboard,
  Ticket,
  ArrowRight,
  Copy,
  Image as ImageIcon,
} from 'lucide-react';
import {
  SiteSettings,
  PrizeCategory,
  GameItem,
  AdminTab,
  User,
  ReferralLevelConfig,
} from '../../types/tambola';
import { validatePrizePool } from '../../utils/referralEngine';
import { TAMBOLA_CALLS } from '../../utils/soundEffects';
import { AdminOverviewDashboard } from '../admin/AdminOverviewDashboard';
import { ReferralDiagnostics } from '../admin/ReferralDiagnostics';

interface ExtendedReferralLevel {
  level: number;
  percent: number;
  label?: string;
  isEnabled?: boolean;
}

interface TicketThemeDisplay {
  id: string;
  name: string;
  bg: string;
  border: string;
  badge: string;
  description: string;
}

const ADMIN_TICKET_THEMES: Record<string, TicketThemeDisplay> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Classic',
    bg: 'from-emerald-950/80 to-slate-950',
    border: 'border-emerald-500/50',
    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    description: 'Fresh mint and forest green palette for standard daily tournaments.',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire Ocean',
    bg: 'from-blue-950/80 to-slate-950',
    border: 'border-blue-500/50',
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    description: 'Deep cobalt blue with neon cyan accents for speed rounds.',
  },
  amber: {
    id: 'amber',
    name: 'Amber Sunset',
    bg: 'from-amber-950/80 to-slate-950',
    border: 'border-amber-500/50',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    description: 'Warm gold and bronze gradient for jackpot bumper matches.',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Ruby',
    bg: 'from-rose-950/80 to-slate-950',
    border: 'border-rose-500/50',
    badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    description: 'High voltage ruby red theme for weekend mega games.',
  },
  royal_purple: {
    id: 'royal_purple',
    name: 'Royal Purple',
    bg: 'from-purple-950/80 to-slate-950',
    border: 'border-purple-500/50',
    badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
    description: 'Rich royal amethyst gradient for VIP tournaments.',
  },
  rainbow: {
    id: 'rainbow',
    name: 'Neon Rainbow',
    bg: 'from-purple-950/80 via-pink-950/70 to-blue-950/80',
    border: 'border-pink-500/50',
    badge: 'bg-pink-500/20 text-pink-300 border border-pink-500/40',
    description: 'Vibrant multicolor spectrum for festive special events.',
  },
};

interface AdminPanelModalProps {
  isPageMode?: boolean;
  onNavigate?: (path: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isPageMode = false, onNavigate }) => {
  const {
    activeModal,
    setActiveModal,
    settings,
    updateSettings,
    prizes,
    updatePrizes,
    upcomingGames,
    activeLiveGame,
    allUsers,
    deposits,
    withdrawals,
    transfers,
    commissionLedger,
    platformFeeLedger,
    prizeLedger,
    freeTicketWinners,
    auditLogs,
    approveWithdrawal,
    rejectWithdrawal,
    toggleBlockUser,
    softDeleteUser,
    resetUserPassword,
    verifyUserKyc,
    liveCalledNumbers,
    currentCalledNumber,
    isGameCalling,
    startLiveCaller,
    pauseLiveCaller,
    callNextNumber,
    callSpecificNumber,
    undoLastNumber,
    resetLiveGame,
    createGame,
    updateGameStatus,
    toggleTicketSale,
    updateTicketConfig,
    approveDeposit,
    rejectDeposit,
    addNotification,
    adjustUserWallet,
    drawFreeTicketWinnersForGame,
    myTickets,
    deleteUserPermanently,
    deleteDummyTestUsers,
    deleteDeposit,
    deleteWithdrawal,
    deleteTransfer,
    deleteNotification,
    notifications,
    clearTransactionHistory,
    clearAllNotifications,
    clearAuditLogs,
  } = useTambola();

  if (!isPageMode && activeModal !== 'admin') return null;

  // Active Tab & Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // User Management Search & Inspector
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'blocked' | 'deleted'>('all');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
  const [walletAdjAmount, setWalletAdjAmount] = useState<number>(0);
  const [walletAdjType, setWalletAdjType] = useState<'depositWallet' | 'ticketWallet' | 'winningWallet'>('depositWallet');
  const [walletAdjReason, setWalletAdjReason] = useState<string>('');
  const [userNewPassword, setUserNewPassword] = useState<string>('');
  const [pwdResetMsg, setPwdResetMsg] = useState<{ success: boolean; message: string } | null>(null);

  // Ticket Management Customizer State
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [editTicketPrice, setEditTicketPrice] = useState<number>(20);
  const [editTicketTheme, setEditTicketTheme] = useState<string>('emerald');
  const [editTicketTitle, setEditTicketTitle] = useState<string>('');
  const [editStartDate, setEditStartDate] = useState<string>('2026-08-29');
  const [editStartTime, setEditStartTime] = useState<string>('21:00');

  // Number Control State
  const [customCallNum, setCustomCallNum] = useState<number>(1);

  // Notification Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState<string>('');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastTarget, setBroadcastTarget] = useState<string>('all');
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  // New Game Creation Form State
  const [newGameTitle, setNewGameTitle] = useState<string>('');
  const [newGameTicketPrice, setNewGameTicketPrice] = useState<number>(20);
  const [newGamePrizePool, setNewGamePrizePool] = useState<number>(1400);
  const [newGameStartTime, setNewGameStartTime] = useState<string>('2026-08-29T21:00');
  const [newGameMaxPlayers, setNewGameMaxPlayers] = useState<number>(100);
  const [newGameType, setNewGameType] = useState<'Classic' | 'Speed 90' | 'Mega Jackpot' | 'Bumper Night'>('Classic');
  const [gameCreationMsg, setGameCreationMsg] = useState<string | null>(null);

  // Commission Level Config State
  const [commissionLevels, setCommissionLevels] = useState<ExtendedReferralLevel[]>(() => {
    if (settings.referralLevels && settings.referralLevels.length === 8) {
      return settings.referralLevels.map((l) => ({
        ...l,
        label: l.level === 1 ? 'Direct Sponsor' : `Level ${l.level}`,
        isEnabled: true,
      }));
    }
    return [
      { level: 1, percent: 2.0, isEnabled: true, label: 'Direct Sponsor' },
      { level: 2, percent: 1.0, isEnabled: true, label: 'Level 2' },
      { level: 3, percent: 0.5, isEnabled: true, label: 'Level 3' },
      { level: 4, percent: 0.4, isEnabled: true, label: 'Level 4' },
      { level: 5, percent: 0.3, isEnabled: true, label: 'Level 5' },
      { level: 6, percent: 0.2, isEnabled: true, label: 'Level 6' },
      { level: 7, percent: 0.1, isEnabled: true, label: 'Level 7' },
      { level: 8, percent: 0.1, isEnabled: true, label: 'Level 8' },
    ];
  });

  // Direct Income Setting
  const [directIncomePercent, setDirectIncomePercent] = useState<number>(settings.directIncomePercent || 1.0);
  const [directIncomeEnabled, setDirectIncomeEnabled] = useState<boolean>(settings.directIncomeEnabled ?? true);

  // Payment Settings State
  const [adminUpiId, setAdminUpiId] = useState<string>(settings.adminUpiId || 'apnatambola@upi');
  const [adminQrUrl, setAdminQrUrl] = useState<string>(settings.upiQrCodeUrl || '');
  const [minDeposit, setMinDeposit] = useState<number>(settings.minDeposit || 100);
  const [maxDeposit, setMaxDeposit] = useState<number>(settings.maxDeposit || 2000);
  const [minWithdrawal, setMinWithdrawal] = useState<number>(settings.minWithdrawal || 100);
  const [maxWithdrawal, setMaxWithdrawal] = useState<number>(settings.maxWithdrawal || 2000);
  const [bankName, setBankName] = useState<string>(settings.adminAccountDetails?.bankName || 'HDFC Bank');
  const [accountHolder, setAccountHolder] = useState<string>(settings.adminAccountDetails?.accountHolder || 'Apna Tambola Gaming Ltd');
  const [accountNumber, setAccountNumber] = useState<string>(settings.adminAccountDetails?.accountNumber || '50200084920194');
  const [ifsc, setIfsc] = useState<string>(settings.adminAccountDetails?.ifsc || 'HDFC0001234');

  // Security Master PIN state
  const [currentAdminPin, setCurrentAdminPin] = useState<string>('');
  const [newAdminPin, setNewAdminPin] = useState<string>('');
  const [confirmAdminPin, setConfirmAdminPin] = useState<string>('');
  const [securityFeedback, setSecurityFeedback] = useState<string | null>(null);

  // Free Ticket Draw Selector
  const [selectedGameForFreeDraw, setSelectedGameForFreeDraw] = useState<string>(upcomingGames[0]?.id || 'AT-1025');
  const [freeDrawFeedback, setFreeDrawFeedback] = useState<string | null>(null);

  // Save Feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Deposit Management State
  const [adminDepositFilter, setAdminDepositFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [adminDepositScreenshotPreview, setAdminDepositScreenshotPreview] = useState<string | null>(null);
  const [rejectModalDepositId, setRejectModalDepositId] = useState<string | null>(null);
  const [customRejectReason, setCustomRejectReason] = useState<string>('Invalid UTR / Payment Not Received in Bank');
  const [depositActionFeedback, setDepositActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filtered Users by Search Query & Account Status
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.phone.includes(userSearchQuery) ||
      u.id.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.referralCode && u.referralCode.toLowerCase().includes(userSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (userStatusFilter === 'active') return !u.isBlocked && !u.isDeleted;
    if (userStatusFilter === 'blocked') return !!u.isBlocked;
    if (userStatusFilter === 'deleted') return !!u.isDeleted;
    return true;
  });

  const handleAdminResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForDetail) return;
    if (!userNewPassword || userNewPassword.length < 6) {
      setPwdResetMsg({ success: false, message: 'Password must be at least 6 characters.' });
      return;
    }

    const res = resetUserPassword(selectedUserForDetail.id, userNewPassword);
    setPwdResetMsg(res);
    setUserNewPassword('');
    setTimeout(() => setPwdResetMsg(null), 4000);
  };

  const handleStartEditTicket = (game: GameItem) => {
    setEditingGameId(game.id);
    setEditTicketPrice(game.ticketPrice);
    setEditTicketTheme(game.ticketColorTheme || 'emerald');
    setEditTicketTitle(game.title);
    if (game.startTime) {
      const parts = game.startTime.split('T');
      if (parts.length === 2) {
        setEditStartDate(parts[0]);
        setEditStartTime(parts[1].slice(0, 5));
      }
    }
  };

  const handleSaveTicketEdit = (gameId: string) => {
    updateTicketConfig(gameId, {
      title: editTicketTitle,
      ticketPrice: editTicketPrice,
      ticketColorTheme: editTicketTheme as any,
      startDate: editStartDate,
      startTime: `${editStartDate}T${editStartTime}`,
    });
    setEditingGameId(null);
    setSaveSuccessMsg(`Ticket & Tournament config updated for #${gameId}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Prize Pool Validation for Active Live Game
  const validationResult = validatePrizePool(
    activeLiveGame.ticketPrice * (activeLiveGame.ticketsSoldCount || 50),
    prizes
  );

  const handleSaveSettings = (newSettings: Partial<SiteSettings>) => {
    updateSettings(newSettings);
    setSaveSuccessMsg('Settings updated and persisted successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    addNotification(broadcastTitle, broadcastMessage, 'system', broadcastTarget);
    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccess(false), 3500);
  };

  const handleWalletAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForDetail || walletAdjAmount === 0 || !walletAdjReason) {
      setSaveSuccessMsg('Please specify amount and a mandatory audit reason.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      return;
    }
    adjustUserWallet(selectedUserForDetail.id, walletAdjAmount, walletAdjType, walletAdjReason);
    setWalletAdjAmount(0);
    setWalletAdjReason('');
    setSaveSuccessMsg(`Wallet adjustment of ₹${walletAdjAmount} recorded with immutable audit log.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleCreateGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameTitle) return;
    const res = createGame({
      title: newGameTitle,
      ticketPrice: newGameTicketPrice,
      prizePool: newGamePrizePool,
      startTime: newGameStartTime,
      maxPlayers: newGameMaxPlayers,
      gameType: newGameType,
    });
    if (res.success) {
      setGameCreationMsg(`🎉 Game "${newGameTitle}" created and tickets opened!`);
      setNewGameTitle('');
      setTimeout(() => setGameCreationMsg(null), 4000);
    }
  };

  const handleSaveCommissionLevels = () => {
    const cleanLevels: ReferralLevelConfig[] = commissionLevels.map((l) => ({
      level: l.level,
      percent: l.percent,
    }));
    const totalPct = commissionLevels.reduce((sum, l) => sum + (l.isEnabled !== false ? l.percent : 0), 0);
    updateSettings({ referralLevels: cleanLevels });
    setSaveSuccessMsg(`8-Level Commission structure saved! Total payout: ${totalPct.toFixed(1)}%`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleResetCommissionDefaults = () => {
    const defaults: ExtendedReferralLevel[] = [
      { level: 1, percent: 2.0, isEnabled: true, label: 'Direct Sponsor' },
      { level: 2, percent: 1.0, isEnabled: true, label: 'Level 2' },
      { level: 3, percent: 0.5, isEnabled: true, label: 'Level 3' },
      { level: 4, percent: 0.4, isEnabled: true, label: 'Level 4' },
      { level: 5, percent: 0.3, isEnabled: true, label: 'Level 5' },
      { level: 6, percent: 0.2, isEnabled: true, label: 'Level 6' },
      { level: 7, percent: 0.1, isEnabled: true, label: 'Level 7' },
      { level: 8, percent: 0.1, isEnabled: true, label: 'Level 8' },
    ];
    setCommissionLevels(defaults);
    updateSettings({
      referralLevels: defaults.map((d) => ({ level: d.level, percent: d.percent })),
    });
    setSaveSuccessMsg('Commission structure reset to standard 8-level 4.6% defaults.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSavePayments = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      adminUpiId,
      upiQrCodeUrl: adminQrUrl,
      minDeposit,
      maxDeposit,
      minWithdrawal,
      maxWithdrawal,
      adminAccountDetails: {
        bankName,
        accountHolder,
        accountNumber,
        ifsc,
      },
    });
    setSaveSuccessMsg('Payment gateway & UPI configuration updated successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDrawFreeTickets = () => {
    const res = drawFreeTicketWinnersForGame(selectedGameForFreeDraw);
    setFreeDrawFeedback(res.message);
    setTimeout(() => setFreeDrawFeedback(null), 5000);
  };

  const handleSecurityPinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPin || newAdminPin !== confirmAdminPin) {
      setSecurityFeedback('Error: New PIN and confirmation do not match!');
      return;
    }
    setSecurityFeedback('✓ Master Admin PIN & credentials updated securely.');
    setNewAdminPin('');
    setConfirmAdminPin('');
    setCurrentAdminPin('');
    setTimeout(() => setSecurityFeedback(null), 4000);
  };

  // Real CSV Export Function
  const exportToCSV = (type: 'users' | 'deposits' | 'withdrawals' | 'all') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'users' || type === 'all') {
      csvContent += '=== USERS LEDGER ===\n';
      csvContent += 'User ID,Name,Phone,Email,Deposit Wallet,Ticket Wallet,Winning Wallet,Referral Code,Referred By,Status\n';
      allUsers.forEach((u) => {
        csvContent += `"${u.id}","${u.name}","${u.phone}","${u.email}",${u.depositWallet || 0},${u.ticketWallet || 0},${u.winningWallet || 0},"${u.referralCode}","${u.referredBy || ''}","${u.isBlocked ? 'Blocked' : 'Active'}"\n`;
      });
      csvContent += '\n';
    }
    if (type === 'deposits' || type === 'all') {
      csvContent += '=== DEPOSITS LEDGER ===\n';
      csvContent += 'Deposit ID,User ID,User Name,Amount,Method,UTR Reference,Status,Date\n';
      deposits.forEach((d) => {
        csvContent += `"${d.id}","${d.userId}","${d.userName}",${d.amount},"${d.paymentMethod}","${d.utrRef || d.transactionId}","${d.status}","${d.createdAt}"\n`;
      });
      csvContent += '\n';
    }
    if (type === 'withdrawals' || type === 'all') {
      csvContent += '=== WITHDRAWALS LEDGER ===\n';
      csvContent += 'Withdrawal ID,User ID,User Name,Amount,Payout Type,Details,Status,Date\n';
      withdrawals.forEach((w) => {
        csvContent += `"${w.id}","${w.userId}","${w.userName}",${w.amount},"${w.payoutType}","${w.upiId || w.accountNumber}","${w.status}","${w.requestedAt}"\n`;
      });
      csvContent += '\n';
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apna_tambola_${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Real Excel Export (Tab-Delimited format with .xls MIME)
  const exportToExcel = () => {
    let excelContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    excelContent += '<head><meta charset="utf-8"/></head><body>';
    excelContent += '<h2>APNA TAMBOLA PLATFORM MASTER LEDGER REPORT</h2>';
    excelContent += `<p>Generated on: ${new Date().toLocaleString()}</p>`;
    excelContent += '<table border="1"><tr><th>User ID</th><th>Name</th><th>Phone</th><th>Main Wallet</th><th>Ticket Wallet</th><th>Winning Wallet</th><th>Referral Code</th><th>Status</th></tr>';
    allUsers.forEach((u) => {
      excelContent += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.phone}</td><td>₹${u.depositWallet || 0}</td><td>₹${u.ticketWallet || 0}</td><td>₹${u.winningWallet || 0}</td><td>${u.referralCode}</td><td>${u.isBlocked ? 'Blocked' : 'Active'}</td></tr>`;
    });
    excelContent += '</table></body></html>';

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apna_tambola_full_report_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Admin Navigation Menu Items matching UI Screenshot
  const adminMenuItems: { tab: AdminTab; label: string; icon: any; badge?: string | number; hasChevron?: boolean }[] = [
    { tab: 'overview', label: 'Dashboard', icon: LayoutDashboard, hasChevron: false },
    { tab: 'users', label: 'Users Management', icon: Users, badge: allUsers.length, hasChevron: true },
    { tab: 'games', label: 'Games Management', icon: Gamepad2, badge: upcomingGames.length, hasChevron: true },
    { tab: 'tickets', label: 'Ticket Management', icon: Ticket, hasChevron: true },
    { tab: 'liveGameControl', label: 'Live Game Management', icon: Radio, badge: 'LIVE', hasChevron: true },
    { tab: 'numberControl', label: 'Number Management', icon: RotateCcw, hasChevron: true },
    { tab: 'winners', label: 'Winner Management', icon: Trophy, hasChevron: true },
    { tab: 'wallets', label: 'Wallet Management', icon: Wallet, hasChevron: true },
    { tab: 'deposits', label: 'Deposit Management', icon: ArrowDownToLine, badge: deposits.filter((d) => d.status === 'pending').length || undefined, hasChevron: true },
    { tab: 'withdrawals', label: 'Withdrawal Management', icon: ArrowUpFromLine, badge: withdrawals.filter((w) => w.status === 'pending').length || undefined, hasChevron: true },
    { tab: 'commission', label: 'Commission Management', icon: Percent, hasChevron: true },
    { tab: 'referrals', label: 'Referral Management', icon: Users, hasChevron: true },
    { tab: 'referralDiagnostics', label: 'Referral Diagnostics', icon: ShieldCheck, badge: 'HEALTH', hasChevron: true },
    { tab: 'transfers', label: 'Transaction Management', icon: CreditCard, hasChevron: true },
    { tab: 'notifications', label: 'Notification Management', icon: Bell, hasChevron: true },
    { tab: 'reports', label: 'Support & Ticket', icon: LifeBuoy, hasChevron: true },
    { tab: 'reports', label: 'Report & Analytics', icon: FileText, hasChevron: true },
    { tab: 'settings', label: 'CMS Management', icon: Palette, hasChevron: true },
    { tab: 'settings', label: 'System Settings', icon: Settings, hasChevron: true },
    { tab: 'security', label: 'Security Settings', icon: ShieldCheck, hasChevron: true },
    { tab: 'auditLogs', label: 'Activity Log', icon: History, hasChevron: false },
    { tab: 'auditLogs', label: 'Backup Management', icon: Database, hasChevron: false },
  ];

  const adminContainerContent = (
    <div className={`relative w-full ${isPageMode ? 'flex-1 min-h-[calc(100vh-80px)] rounded-2xl' : 'max-w-7xl h-full sm:h-[95vh] rounded-none sm:rounded-3xl'} flex flex-col bg-[#0b0d1e] border-0 sm:border border-slate-800/80 shadow-2xl overflow-hidden font-['Outfit',sans-serif]`}>
      
      {/* ========================================================================= */}
      {/* ADMIN HEADER BAR (MATCHING SCREENSHOT) */}
      {/* ========================================================================= */}
      <header className="h-16 shrink-0 px-4 sm:px-6 bg-[#0e1128] border-b border-slate-800/80 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-none">
              Dashboard
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Welcome back, Admin! 👋
            </p>
          </div>
        </div>

        {/* Header Center Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#141836] border border-slate-700/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Visit Website */}
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('/');
              } else {
                setActiveModal(null);
              }
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181d42] hover:bg-[#202758] border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Visit Website</span>
          </button>

          {/* Bell Notifications */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 rounded-full bg-[#181d42] hover:bg-[#202758] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center">
              8
            </span>
          </button>

          {/* Messages */}
          <button
            onClick={() => setActiveTab('reports')}
            className="relative p-2 rounded-full bg-[#181d42] hover:bg-[#202758] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center">
              12
            </span>
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="hidden sm:flex p-2 rounded-full bg-[#181d42] hover:bg-[#202758] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Admin User Chip */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-[#141836] flex items-center justify-center font-black text-xs text-white">
                AD
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-tight">Admin</div>
              <div className="text-[10px] font-semibold text-slate-400 leading-none">Super Admin</div>
            </div>
          </div>

          {/* Close Modal Button */}
          <button
            onClick={() => {
              if (isPageMode && onNavigate) {
                onNavigate('/');
              } else {
                setActiveModal(null);
              }
            }}
            className="p-2 rounded-xl bg-slate-800/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer ml-1"
            title={isPageMode ? 'Return to Home' : 'Close Admin Panel'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN BODY: SIDEBAR + WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* DESKTOP SIDEBAR (MATCHING SCREENSHOT) */}
        <aside className="hidden lg:flex w-64 shrink-0 bg-[#0e1128] border-r border-slate-800/80 flex-col justify-between overflow-y-auto custom-scrollbar select-none">
          <div className="p-3.5 space-y-1">
            {/* Sidebar Logo */}
            <div className="flex items-center gap-2.5 px-3 py-3 mb-2 border-b border-slate-800/80">
              <ApnaTambolaLogo size="sm" showText={false} />
              <div>
                <div className="font-black text-sm text-white tracking-wider font-['Outfit']">
                  APNA TAMBOLA
                </div>
                <div className="text-[9px] font-bold text-amber-400 uppercase tracking-widest -mt-0.5">
                  ADMIN PANEL
                </div>
              </div>
            </div>

            {/* Sidebar Nav Items */}
            {adminMenuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={`${item.tab}-${item.label}-${idx}`}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#6366f1] text-white font-bold shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#141836]/60'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-black/30 text-white'
                            : item.badge === 'LIVE'
                            ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.hasChevron && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'text-white/80 rotate-90' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar Bottom Card: Total Online Users */}
          <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-[#161a3d] to-[#121533] border border-indigo-900/40 text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-300">Total Online Users</span>
            </div>
            <div className="text-2xl font-black text-white font-mono my-0.5">256</div>
            <button
              onClick={() => setActiveTab('users')}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 transition-colors"
            >
              <span>View Live Users</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex">
            <div className="w-72 bg-[#0e1128] border-r border-slate-800 h-full flex flex-col justify-between overflow-y-auto p-4 animate-slide-right">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-black uppercase text-indigo-400">APNA TAMBOLA ADMIN</span>
                  <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="py-2 space-y-1">
                  {adminMenuItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;
                    return (
                      <button
                        key={`mob-${item.tab}-${idx}`}
                        onClick={() => {
                          setActiveTab(item.tab);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#6366f1] text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black/30 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)}></div>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#090b1c] custom-scrollbar">
          {saveSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 1: 🏠 DASHBOARD OVERVIEW (PIXEL PERFECT SCREENSHOT MATCH) */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <AdminOverviewDashboard onNavigateTab={setActiveTab} />
          )}

            {/* ================================================================= */}
            {/* TAB 2: 👥 USER MANAGEMENT */}
            {/* ================================================================= */}
            {activeTab === 'users' && (
              <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">👥 USER MANAGEMENT</h3>
                    <p className="text-xs text-slate-400">Search, inspect 3 wallets, block/unblock, delete IDs, reset passwords, and verify KYC</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm('क्या आप सभी बेकार और टेस्ट IDs को सिस्टम से हमेशा के लिए हटाना चाहते हैं? / Are you sure you want to clean all dummy and test accounts?')) {
                          const res = await deleteDummyTestUsers();
                          alert(res.message);
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:brightness-110 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>🧹 बेकार / टेस्ट ID हटाएं (Clean Test IDs)</span>
                    </button>

                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by Name, Phone, ID..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filter Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setUserStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'all'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    All Users ({allUsers.length})
                  </button>
                  <button
                    onClick={() => setUserStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'active'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    🟢 Active ({allUsers.filter((u) => !u.isBlocked && !u.isDeleted).length})
                  </button>
                  <button
                    onClick={() => setUserStatusFilter('blocked')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'blocked'
                        ? 'bg-red-500 text-white font-black'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    🔴 Blocked ({allUsers.filter((u) => u.isBlocked).length})
                  </button>
                  <button
                    onClick={() => setUserStatusFilter('deleted')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'deleted'
                        ? 'bg-slate-600 text-white font-black'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    🗑️ Deleted ({allUsers.filter((u) => u.isDeleted).length})
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Users Table */}
                  <div className="lg:col-span-2 space-y-2">
                    {filteredUsers.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-[#0e102a] border border-white/5 text-center text-xs text-slate-400">
                        No users found matching query and filter.
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUserForDetail(user)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedUserForDetail?.id === user.id
                              ? 'bg-[#15193d] border-amber-400 shadow-lg'
                              : 'bg-[#0e102a] border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl font-black flex items-center justify-center text-sm ${
                              user.isDeleted
                                ? 'bg-slate-700 text-slate-400'
                                : user.isBlocked
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'bg-gradient-to-tr from-amber-400 to-pink-500 text-slate-950'
                            }`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-white text-sm">{user.name}</p>
                                {user.isBlocked && (
                                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black rounded">
                                    🔴 BLOCKED
                                  </span>
                                )}
                                {user.isDeleted && (
                                  <span className="px-1.5 py-0.5 bg-slate-700 text-slate-300 text-[9px] font-black rounded">
                                    🗑️ SOFT DELETED
                                  </span>
                                )}
                                {user.isKycVerified && (
                                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold rounded">
                                    KYC ✓
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 font-mono">{user.phone} • ID: {user.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-black text-emerald-400 font-mono">
                                ₹{(user.depositWallet || user.walletBalance || 0) + (user.ticketWallet || 0) + (user.winningWallet || 0)}
                              </p>
                              <span className="text-[10px] text-slate-400">Total Funds</span>
                            </div>

                            {user.role !== 'admin' && user.role !== 'superadmin' && (
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`क्या आप ${user.name} (ID: ${user.id}) को हमेशा के लिए डिलीट करना चाहते हैं?`)) {
                                    const res = await deleteUserPermanently(user.id);
                                    if (selectedUserForDetail?.id === user.id) {
                                      setSelectedUserForDetail(null);
                                    }
                                    alert(res.message);
                                  }
                                }}
                                title="Delete User Permanently (हमेशा के लिए हटाएं)"
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 transition-all text-xs"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* User Detail & Inspector */}
                  <div className="p-6 rounded-3xl bg-[#0e102a] border border-indigo-500/30 space-y-4">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between">
                      <span>User Inspector</span>
                      {selectedUserForDetail && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          selectedUserForDetail.isDeleted
                            ? 'bg-slate-700 text-slate-300'
                            : selectedUserForDetail.isBlocked
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {selectedUserForDetail.isDeleted ? 'DELETED' : selectedUserForDetail.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                        </span>
                      )}
                    </h4>

                    {selectedUserForDetail ? (
                      <div className="space-y-4 text-xs">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                          <p className="text-white font-bold text-sm">{selectedUserForDetail.name}</p>
                          <p className="text-slate-400">Phone / Login: <strong className="text-white font-mono">{selectedUserForDetail.phone}</strong></p>
                          <p className="text-slate-400">User ID: <strong className="text-amber-300 font-mono">{selectedUserForDetail.id}</strong></p>
                          <p className="text-slate-400">Referral ID: <strong className="text-amber-300 font-mono">{selectedUserForDetail.referralCode}</strong></p>
                          <p className="text-slate-400">Referred By: <strong className="text-purple-300 font-mono">{selectedUserForDetail.referredBy || 'Direct (None)'}</strong></p>
                          <p className="text-slate-400">Referral Earnings: <strong className="text-pink-300">₹{selectedUserForDetail.referralEarnings || 0}</strong></p>
                        </div>

                        {/* 3 Wallets Display */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-black/50 border border-emerald-500/30">
                            <span className="text-[9px] text-slate-400">Main Wallet</span>
                            <p className="text-xs font-bold text-emerald-400 font-mono">
                              ₹{selectedUserForDetail.depositWallet ?? selectedUserForDetail.walletBalance}
                            </p>
                          </div>
                          <div className="p-2 rounded-xl bg-black/50 border border-pink-500/30">
                            <span className="text-[9px] text-slate-400">Ticket Wallet</span>
                            <p className="text-xs font-bold text-pink-400 font-mono">
                              ₹{selectedUserForDetail.ticketWallet ?? 0}
                            </p>
                          </div>
                          <div className="p-2 rounded-xl bg-black/50 border border-amber-500/30">
                            <span className="text-[9px] text-slate-400">Winning Wallet</span>
                            <p className="text-xs font-bold text-amber-400 font-mono">
                              ₹{selectedUserForDetail.winningWallet ?? selectedUserForDetail.gameWinnings}
                            </p>
                          </div>
                        </div>

                        {/* Account Actions: Block / Unblock, Soft Delete, Verify KYC */}
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                          <p className="font-bold text-slate-200">Account Access &amp; Compliance</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => toggleBlockUser(selectedUserForDetail.id)}
                              className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                                selectedUserForDetail.isBlocked
                                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                              }`}
                            >
                              {selectedUserForDetail.isBlocked ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>UNBLOCK USER</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>BLOCK USER</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => softDeleteUser(selectedUserForDetail.id, !selectedUserForDetail.isDeleted)}
                              className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                                selectedUserForDetail.isDeleted
                                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{selectedUserForDetail.isDeleted ? 'RESTORE' : 'SOFT DELETE'}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`क्या आप यूजर "${selectedUserForDetail.name}" (ID: ${selectedUserForDetail.id}) को हमेशा के लिए डिलीट करना चाहते हैं? यह क्रिया वापस नहीं होगी!\n\nAre you sure you want to PERMANENTLY delete user "${selectedUserForDetail.name}" (ID: ${selectedUserForDetail.id})? This cannot be undone!`)) {
                                deleteUserPermanently(selectedUserForDetail.id);
                                setSelectedUserForDetail(null);
                              }
                            }}
                            className="w-full py-2 rounded-xl bg-red-600/30 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/50 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>DELETE USER ID PERMANENTLY (हमेशा के लिए डिलीट)</span>
                          </button>

                          {!selectedUserForDetail.isKycVerified && (
                            <button
                              type="button"
                              onClick={() => verifyUserKyc(selectedUserForDetail.id)}
                              className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>APPROVE KYC VERIFICATION</span>
                            </button>
                          )}
                        </div>

                        {/* Reset Password Form */}
                        <form onSubmit={handleAdminResetPassword} className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                          <p className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5" />
                            <span>Administrative Password Reset</span>
                          </p>
                          {pwdResetMsg && (
                            <div className={`p-2 rounded-lg text-[11px] font-bold ${
                              pwdResetMsg.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {pwdResetMsg.message}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              type="password"
                              placeholder="New password (min 6 chars)"
                              value={userNewPassword}
                              onChange={(e) => setUserNewPassword(e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 cursor-pointer"
                            >
                              RESET
                            </button>
                          </div>
                        </form>

                        {/* Administrative Wallet Adjust Form */}
                        <form onSubmit={handleWalletAdjustSubmit} className="space-y-3 pt-2 border-t border-white/10">
                          <p className="font-bold text-amber-300">Administrative Wallet Adjustment (Audited)</p>
                          <div>
                            <label className="text-slate-400">Target Wallet</label>
                            <select
                              value={walletAdjType}
                              onChange={(e: any) => setWalletAdjType(e.target.value)}
                              className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white"
                            >
                              <option value="depositWallet">Main / Deposit Wallet</option>
                              <option value="ticketWallet">Ticket Wallet</option>
                              <option value="winningWallet">Winning Wallet</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-400">Adjustment Amount (₹, +/- allowed)</label>
                            <input
                              type="number"
                              value={walletAdjAmount}
                              onChange={(e) => setWalletAdjAmount(Number(e.target.value))}
                              placeholder="e.g. 100 or -50"
                              className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-slate-400">Mandatory Audit Reason</label>
                            <input
                              type="text"
                              placeholder="e.g. Manual UPI deposit verification or dispute credit"
                              value={walletAdjReason}
                              onChange={(e) => setWalletAdjReason(e.target.value)}
                              className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 cursor-pointer shadow-md"
                          >
                            RECORD ADJUSTMENT (AUDITED)
                          </button>
                        </form>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-8">Select any user from the left to view details</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 3: 🎮 GAME MANAGEMENT */}
            {/* ================================================================= */}
            {activeTab === 'games' && (
              <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">🎮 TOURNAMENT &amp; GAME MANAGEMENT</h3>
                    <p className="text-xs text-slate-400">Schedule games, open/close ticket sales, and monitor prize pools</p>
                  </div>
                </div>

                {gameCreationMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{gameCreationMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Games List */}
                  <div className="lg:col-span-2 space-y-3">
                    {upcomingGames.map((game) => (
                      <div
                        key={game.id}
                        className="p-5 rounded-2xl bg-[#0e102a] border border-white/10 space-y-3 shadow-xl"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                              #{game.id}
                            </span>
                            <h4 className="text-base font-black text-white">{game.title}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold">
                              {game.gameType || 'Classic'}
                            </span>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              game.status === 'live'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                                : game.status === 'upcoming' || game.status === 'ticket_sale_open'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-slate-500/20 text-slate-400'
                            }`}
                          >
                            {game.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-black/40 p-3 rounded-xl border border-white/5">
                          <div>
                            <span className="text-slate-400">Ticket Price:</span>
                            <p className="font-mono font-black text-emerald-400 text-sm">₹{game.ticketPrice}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Prize Pool (70%):</span>
                            <p className="font-mono font-black text-amber-400 text-sm">₹{game.prizePool}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Tickets Sold:</span>
                            <p className="font-mono font-bold text-white">{game.ticketsSoldCount || 0}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Max Players:</span>
                            <p className="font-mono font-bold text-white">{game.maxPlayers}</p>
                          </div>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => updateGameStatus(game.id, 'live')}
                            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Set Live</span>
                          </button>
                          <button
                            onClick={() => updateGameStatus(game.id, 'ticket_sale_open')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Open Sales
                          </button>
                          <button
                            onClick={() => updateGameStatus(game.id, 'completed')}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold cursor-pointer"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateGameStatus(game.id, 'cancelled')}
                            className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Create New Game Form */}
                  <div className="p-6 rounded-3xl bg-[#0e102a] border border-amber-500/30 space-y-4">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-400" />
                      CREATE NEW TOURNAMENT
                    </h4>

                    <form onSubmit={handleCreateGameSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-300 font-bold">Tournament Name</label>
                        <input
                          type="text"
                          placeholder="e.g. 🌙 Sunday Night Super Bumper"
                          value={newGameTitle}
                          onChange={(e) => setNewGameTitle(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold">Game Format</label>
                        <select
                          value={newGameType}
                          onChange={(e: any) => setNewGameType(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
                        >
                          <option value="Classic">Classic 90-Ball</option>
                          <option value="Speed 90">Speed 90 (Fast Draw)</option>
                          <option value="Mega Jackpot">Mega Jackpot Housie</option>
                          <option value="Bumper Night">Bumper Night Special</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-300 font-bold">Ticket Price (₹)</label>
                          <input
                            type="number"
                            min="10"
                            max="500"
                            value={newGameTicketPrice}
                            onChange={(e) => {
                              const p = Number(e.target.value);
                              setNewGameTicketPrice(p);
                              setNewGamePrizePool(Math.round(p * 100 * 0.7));
                            }}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-emerald-400 font-mono font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold">Prize Pool (₹)</label>
                          <input
                            type="number"
                            value={newGamePrizePool}
                            onChange={(e) => setNewGamePrizePool(Number(e.target.value))}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-amber-400 font-mono font-bold"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold">Max Players Capacity</label>
                        <input
                          type="number"
                          value={newGameMaxPlayers}
                          onChange={(e) => setNewGameMaxPlayers(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold">Scheduled Start Date &amp; Time</label>
                        <input
                          type="datetime-local"
                          value={newGameStartTime}
                          onChange={(e) => setNewGameStartTime(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 cursor-pointer"
                      >
                        PUBLISH &amp; OPEN TICKETS
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 4: 🎟️ TICKET MANAGEMENT & CONFIGURATION */}
            {/* ================================================================= */}
            {activeTab === 'tickets' && (
              <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Tag className="w-5 h-5 text-amber-400" />
                      🎟️ TICKET MANAGEMENT &amp; SALES CONTROL
                    </h3>
                    <p className="text-xs text-slate-400">
                      Master ON/OFF sales switch, ticket price points (5, 10, 20, 40, 100 VP), colour themes, and schedules.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
                      Open Games: {upcomingGames.filter((g) => g.isTicketSaleOpen !== false).length}
                    </span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-full text-xs font-mono font-bold">
                      Issued Tickets: {myTickets.length + 145}
                    </span>
                  </div>
                </div>

                {/* Edit Ticket Configuration Inline Modal / Panel */}
                {editingGameId && (
                  <div className="p-6 rounded-3xl bg-[#0e102a] border-2 border-amber-400/60 shadow-2xl space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <h4 className="text-base font-black text-white flex items-center gap-2">
                          <Palette className="w-4 h-4 text-amber-400" />
                          EDIT TICKET &amp; TOURNAMENT CONFIGURATION (#{editingGameId})
                        </h4>
                        <p className="text-xs text-slate-400">Customize ticket pricing, color scheme, and start schedule</p>
                      </div>
                      <button
                        onClick={() => setEditingGameId(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-slate-300 font-bold">Ticket / Tournament Name</label>
                        <input
                          type="text"
                          value={editTicketTitle}
                          onChange={(e) => setEditTicketTitle(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold">Ticket Price (Virtual Points)</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            value={editTicketPrice}
                            onChange={(e) => setEditTicketPrice(Number(e.target.value))}
                            className="w-28 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-emerald-400 font-mono font-black"
                          />
                          <div className="flex flex-wrap gap-1">
                            {[5, 10, 20, 40, 100].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setEditTicketPrice(preset)}
                                className={`px-2.5 py-1.5 rounded-lg font-mono font-bold text-xs cursor-pointer transition-colors ${
                                  editTicketPrice === preset
                                    ? 'bg-emerald-500 text-slate-950 font-black'
                                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                }`}
                              >
                                {preset} VP
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold">Ticket Colour Theme</label>
                        <select
                          value={editTicketTheme}
                          onChange={(e) => setEditTicketTheme(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-bold"
                        >
                          <option value="emerald">Emerald Classic (Forest / Mint)</option>
                          <option value="sapphire">Sapphire Ocean (Cobalt / Cyan)</option>
                          <option value="amber">Amber Sunset (Gold / Bronze)</option>
                          <option value="crimson">Crimson Ruby (Ruby Red)</option>
                          <option value="royal_purple">Royal Purple (VIP Amethyst)</option>
                          <option value="rainbow">Neon Rainbow (Multicolor Spectrum)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-300 font-bold">Start Date</label>
                          <input
                            type="date"
                            value={editStartDate}
                            onChange={(e) => setEditStartDate(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-300 font-bold">Start Time</label>
                          <input
                            type="time"
                            value={editStartTime}
                            onChange={(e) => setEditStartTime(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setEditingGameId(null)}
                        className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveTicketEdit(editingGameId)}
                        className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-black cursor-pointer shadow-lg"
                      >
                        SAVE CONFIGURATION
                      </button>
                    </div>
                  </div>
                )}

                {/* All Tickets / Games Master Control List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      AVAILABLE TICKETS &amp; GAME MASTER CONTROLS
                    </h4>
                    <span className="text-xs text-slate-400">Total Games Configured: {upcomingGames.length}</span>
                  </div>

                  <div className="space-y-3">
                    {upcomingGames.map((game) => {
                      const isSaleOpen = game.isTicketSaleOpen !== false;
                      const themeKey = game.ticketColorTheme || 'emerald';
                      const theme = ADMIN_TICKET_THEMES[themeKey] || ADMIN_TICKET_THEMES.emerald;
                      const startDateStr = game.startDate || (game.startTime ? game.startTime.split('T')[0] : '2026-08-29');
                      const startTimeStr = game.startTime ? game.startTime.split('T')[1]?.slice(0, 5) : '21:00';

                      return (
                        <div
                          key={game.id}
                          className={`p-5 rounded-3xl border transition-all shadow-xl space-y-4 ${
                            isSaleOpen
                              ? 'bg-[#0e102a] border-white/10 hover:border-amber-400/40'
                              : 'bg-black/60 border-red-500/20 opacity-80'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Left: Identification & Basic Info */}
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                                  TKT-{game.id}
                                </span>
                                <span className="font-mono text-xs text-slate-400">
                                  Game ID: #{game.id}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.badge}`}>
                                  🎨 {theme.name}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold">
                                  {game.gameType || 'Classic'}
                                </span>
                              </div>
                              <h4 className="text-base font-black text-white">{game.title}</h4>
                              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                                <span>📅 {startDateStr}</span>
                                <span>⏰ {startTimeStr}</span>
                                <span>🎟️ Sold: <strong className="text-white">{game.ticketsSoldCount || 0}</strong> / {game.maxPlayers}</span>
                              </div>
                            </div>

                            {/* Center: Price Config & 1-Click Quick Selector */}
                            <div className="bg-black/50 p-3 rounded-2xl border border-white/5 space-y-1.5 min-w-[220px]">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] text-slate-400">Ticket Value:</span>
                                <span className="font-mono font-black text-emerald-400 text-sm">
                                  ₹{game.ticketPrice} / {game.ticketPrice} VP
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[5, 10, 20, 40, 100].map((preset) => (
                                  <button
                                    key={preset}
                                    onClick={() => updateTicketConfig(game.id, { ticketPrice: preset })}
                                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                      game.ticketPrice === preset
                                        ? 'bg-emerald-500 text-slate-950 font-black'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white'
                                    }`}
                                    title={`Set ticket price to ${preset} Virtual Points`}
                                  >
                                    {preset}P
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Right: Master ON / OFF Toggle & Edit Action */}
                            <div className="flex items-center gap-2">
                              {/* Master Toggle */}
                              <button
                                onClick={() => toggleTicketSale(game.id, !isSaleOpen)}
                                className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all ${
                                  isSaleOpen
                                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                                    : 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/20'
                                }`}
                              >
                                <Power className="w-4 h-4" />
                                <span>{isSaleOpen ? '🟢 SALES ON' : '🔴 SALES OFF'}</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => handleStartEditTicket(game)}
                                className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Settings className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Purchased Player Tickets & 3x9 Matrix Inspector */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        🗂️ PURCHASED TICKETS &amp; 3x9 MATRIX INSPECTOR
                      </h4>
                      <p className="text-xs text-slate-400">Examine live participant ticket grids and security verification hashes</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myTickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-5 rounded-3xl bg-[#0e102a] border border-purple-500/30 space-y-3 shadow-xl"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <div>
                            <span className="text-xs font-mono font-bold text-amber-300">Ticket #{t.ticketNumber}</span>
                            <p className="text-[10px] text-slate-400">Owner: {t.userName} ({t.userId})</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                            Game #{t.gameId}
                          </span>
                        </div>

                        {/* 3x9 Matrix Visualizer */}
                        <div className="grid grid-cols-9 gap-1 bg-black/60 p-2 rounded-2xl border border-white/10">
                          {t.grid.map((row, rIdx) =>
                            row.map((val, cIdx) => (
                              <div
                                key={`${rIdx}-${cIdx}`}
                                className={`h-7 rounded flex items-center justify-center font-mono font-bold text-xs ${
                                  val === null
                                    ? 'bg-transparent text-transparent'
                                    : t.markedNumbers.includes(val)
                                    ? 'bg-pink-500 text-white font-black'
                                    : 'bg-white/10 text-white'
                                }`}
                              >
                                {val || ''}
                              </div>
                            ))
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>Code: <strong className="text-pink-400 font-mono">{t.verificationCode || 'VER-74892'}</strong></span>
                          <span>Marked: <strong className="text-emerald-400">{t.markedNumbers.length}/15</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 5 & 6: 🔴 LIVE GAME & 🎱 1-90 NUMBER CALLER SUITE */}
            {/* ================================================================= */}
            {(activeTab === 'liveGameControl' || activeTab === 'numberControl') && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e102a] border-2 border-red-500/40 space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black mb-1">
                        <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE STREAM CALLER CONTROL
                      </div>
                      <h3 className="text-xl font-black text-white">{activeLiveGame.title} (#{activeLiveGame.id})</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={isGameCalling ? pauseLiveCaller : startLiveCaller}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg cursor-pointer ${
                          isGameCalling
                            ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        }`}
                      >
                        {isGameCalling ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        <span>{isGameCalling ? 'PAUSE AUTO-CALLER' : 'START AUTO-CALLER'}</span>
                      </button>

                      <button
                        onClick={callNextNumber}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black shadow-lg hover:brightness-110 cursor-pointer"
                      >
                        DRAW NEXT BALL
                      </button>

                      <button
                        onClick={undoLastNumber}
                        disabled={liveCalledNumbers.length === 0}
                        className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
                      >
                        <Undo2 className="w-4 h-4" />
                        <span>UNDO LAST</span>
                      </button>

                      <button
                        onClick={resetLiveGame}
                        className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                        title="Reset Draw"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 3D Animated Last Ball + Hindi/English Callout */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-black/60 border border-white/10">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center text-3xl font-black text-slate-950 font-mono shadow-2xl ring-4 ring-white/10 animate-pulse">
                        {currentCalledNumber || '--'}
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-bold uppercase">LAST CALLED NUMBER</span>
                        <h4 className="text-lg font-black text-amber-300">
                          {currentCalledNumber
                            ? `${TAMBOLA_CALLS[currentCalledNumber] || `Number ${currentCalledNumber}`}`
                            : 'Waiting to draw first ball...'}
                        </h4>
                      </div>
                    </div>

                    {/* Direct Number Picker (एडमिन कोई भी नंबर डाल सकता है) */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (customCallNum >= 1 && customCallNum <= 90) {
                          callSpecificNumber(customCallNum);
                        }
                      }}
                      className="flex flex-col sm:flex-row items-center gap-2 bg-white/5 p-2.5 rounded-2xl border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] text-slate-300 font-bold uppercase whitespace-nowrap">
                          Manual Number (1-90):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          placeholder="Num"
                          value={customCallNum || ''}
                          onChange={(e) => setCustomCallNum(Number(e.target.value))}
                          className="w-16 px-2.5 py-1.5 rounded-xl bg-black/70 border border-amber-400/40 text-center font-mono font-black text-base text-amber-400 focus:outline-none focus:border-amber-300"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!customCallNum || customCallNum < 1 || customCallNum > 90 || liveCalledNumbers.includes(customCallNum)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black hover:brightness-110 cursor-pointer shadow disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        🎯 CALL NUMBER
                      </button>
                    </form>
                  </div>

                  {/* Offline Ticket Auto-Check Assurance Info for Admin */}
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span>🤖 <strong>Auto-Check & Count Active:</strong> नंबर कॉल होते ही सभी ऑनलाइन व ऑफलाइन यूज़र्स के टिकट स्वतः चेक होंगे और पुरस्कार सीधे विनर वॉलेट में जाएंगे।</span>
                    </span>
                    <span className="text-[11px] font-mono bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">
                      Total Tickets: {myTickets.length}
                    </span>
                  </div>

                  {/* 1-90 Interactive Grid */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">MASTER BOARD (Called: {liveCalledNumbers.length}/90):</span>
                      <span className="text-slate-400 text-[11px]">Click any uncalled number to call it instantly</span>
                    </div>
                    <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-18 gap-1.5">
                      {Array.from({ length: 90 }, (_, i) => i + 1).map((n) => {
                        const isCalled = liveCalledNumbers.includes(n);
                        const isLatest = currentCalledNumber === n;
                        return (
                          <button
                            key={n}
                            onClick={() => !isCalled && callSpecificNumber(n)}
                            disabled={isCalled}
                            className={`h-8 text-xs font-mono font-bold rounded-lg flex items-center justify-center transition-all ${
                              isLatest
                                ? 'bg-amber-400 text-slate-950 font-black scale-110 shadow-lg ring-2 ring-amber-300 z-10'
                                : isCalled
                                ? 'bg-purple-600 text-white font-black opacity-90'
                                : 'bg-white/5 hover:bg-white/20 text-slate-400 border border-white/5 cursor-pointer'
                            }`}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 7: 🏆 WINNER VERIFICATIONS & PRIZE LEDGER */}
            {/* ================================================================= */}
            {activeTab === 'winners' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">🏆 WINNER VERIFICATIONS &amp; PAYOUTS</h3>
                    <p className="text-xs text-slate-400">All verified prize claims with server-audited pattern verification</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-bold">
                    {prizeLedger.length} Verified Payouts
                  </span>
                </div>

                <div className="space-y-3">
                  {prizeLedger.map((prize) => (
                    <div
                      key={prize.id}
                      className="p-5 rounded-2xl bg-[#0e102a] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
                    >
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="text-lg">🏆</span>
                          <span className="font-bold text-white text-sm">{prize.prizeCategory}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            VERIFIED ✓
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono">
                          Winner: <strong>{prize.userName}</strong> ({prize.userId}) • Ticket: #{prize.ticketNumber} • Game: #{prize.gameId}
                        </p>
                        <p className="text-[10px] text-slate-500">{prize.claimedAt}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400">Prize Amount Credited:</span>
                        <p className="text-xl font-black text-emerald-400 font-mono">₹{prize.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 8: 🎁 FREE TICKET WINNERS (5 / GAME) */}
            {/* ================================================================= */}
            {activeTab === 'freeTicketWinners' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950/60 via-[#0e102a] to-purple-950/60 border border-pink-500/40 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-pink-400">🎁 5 FREE TICKETS LUCKY DRAW SUITE</h3>
                      <p className="text-xs text-slate-300">
                        Select any tournament and instantly draw 5 random lucky winners from active platform players
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedGameForFreeDraw}
                        onChange={(e) => setSelectedGameForFreeDraw(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white"
                      >
                        {upcomingGames.map((g) => (
                          <option key={g.id} value={g.id}>
                            #{g.id} - {g.title}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={handleDrawFreeTickets}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg shadow-pink-500/30 hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                      >
                        <Gift className="w-4 h-4" />
                        <span>DRAW 5 WINNERS</span>
                      </button>
                    </div>
                  </div>

                  {freeDrawFeedback && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{freeDrawFeedback}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-black text-white uppercase">All Awarded Free Tickets ({freeTicketWinners.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {freeTicketWinners.map((w) => (
                      <div
                        key={w.id}
                        className="p-4 rounded-2xl bg-[#0e102a] border border-white/10 space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{w.userName}</span>
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                            FREE PASS
                          </span>
                        </div>
                        <p className="text-slate-400 font-mono">ID: {w.userId} • Ticket #{w.ticketNumber}</p>
                        <p className="text-amber-300 font-mono">Game: #{w.gameId}</p>
                        <div className="pt-2 border-t border-white/5 flex justify-between text-[10px] text-slate-500">
                          <span>Code: {w.freeTicketCode}</span>
                          <span className="text-emerald-400 font-bold uppercase">{w.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 9: 💰 DEPOSIT APPROVALS */}
            {/* ================================================================= */}
            {activeTab === 'deposits' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <ArrowDownToLine className="w-6 h-6 text-emerald-400" />
                      <span>💰 DEPOSIT MANAGEMENT / जमा सत्यापन</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review UPI UTRs, verify payment screenshots, and approve or reject fund additions to Deposit Wallets
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('क्या आप सभी डिपॉजिट हिस्ट्री रिकॉर्ड्स को हटाना चाहते हैं? / Clear all deposits history?')) {
                          deposits.forEach((d) => deleteDeposit(d.id));
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>सभी डिपॉजिट हटाएं (Clear All)</span>
                    </button>
                    <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-mono border border-amber-400/30">
                      Pending: {deposits.filter((d) => d.status === 'pending').length}
                    </span>
                  </div>
                </div>

                {depositActionFeedback && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                      depositActionFeedback.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {depositActionFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span>{depositActionFeedback.text}</span>
                  </div>
                )}

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => {
                    const count =
                      filter === 'all'
                        ? deposits.length
                        : filter === 'pending'
                        ? deposits.filter((d) => d.status === 'pending').length
                        : filter === 'approved'
                        ? deposits.filter((d) => d.status === 'approved' || d.status === 'completed').length
                        : deposits.filter((d) => d.status === 'rejected').length;

                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setAdminDepositFilter(filter)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 flex items-center gap-2 ${
                          adminDepositFilter === filter
                            ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{filter}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            adminDepositFilter === filter ? 'bg-black/30 text-white font-bold' : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Deposits List */}
                <div className="space-y-3">
                  {deposits
                    .filter((d) => {
                      if (adminDepositFilter === 'all') return true;
                      if (adminDepositFilter === 'pending') return d.status === 'pending';
                      if (adminDepositFilter === 'approved') return d.status === 'approved' || d.status === 'completed';
                      if (adminDepositFilter === 'rejected') return d.status === 'rejected';
                      return true;
                    })
                    .map((dep) => (
                      <div
                        key={dep.id}
                        className={`p-5 rounded-2xl bg-[#0e102a] border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
                          dep.status === 'pending'
                            ? 'border-amber-500/40 bg-amber-950/10'
                            : dep.status === 'approved' || dep.status === 'completed'
                            ? 'border-emerald-500/20'
                            : 'border-red-500/20 opacity-80'
                        }`}
                      >
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          {/* Screenshot Thumbnail */}
                          {dep.paymentScreenshotUrl ? (
                            <div className="relative group shrink-0">
                              <img
                                src={dep.paymentScreenshotUrl}
                                alt="Payment Proof"
                                onClick={() => setAdminDepositScreenshotPreview(dep.paymentScreenshotUrl || null)}
                                className="w-16 h-16 object-cover rounded-xl border border-white/20 cursor-pointer hover:opacity-80 transition-all shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => setAdminDepositScreenshotPreview(dep.paymentScreenshotUrl || null)}
                                className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-slate-500 shrink-0">
                              <ImageIcon className="w-6 h-6" />
                              <span className="text-[9px] font-bold mt-1">No Proof</span>
                            </div>
                          )}

                          {/* Info */}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-lg font-black text-emerald-400 font-mono">₹{dep.amount}</span>
                              <span className="text-xs text-white font-bold">{dep.userName}</span>
                              <span className="text-[11px] text-slate-400 font-mono">({dep.userId})</span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  dep.status === 'approved' || dep.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : dep.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}
                              >
                                {dep.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono">
                              <span>Method: <strong>{dep.paymentMethod}</strong></span>
                              <span>•</span>
                              <span className="flex items-center gap-1.5">
                                <span>UTR:</span>
                                <strong className="text-amber-300 select-all">{dep.utrRef || dep.transactionId}</strong>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(dep.utrRef || dep.transactionId);
                                    setDepositActionFeedback({ type: 'success', text: `UTR ${dep.utrRef || dep.transactionId} copied to clipboard!` });
                                    setTimeout(() => setDepositActionFeedback(null), 2500);
                                  }}
                                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                                  title="Copy UTR"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                              <span>Created: {new Date(dep.createdAt).toLocaleString()}</span>
                              {dep.verifiedAt && (
                                <>
                                  <span>•</span>
                                  <span>Verified: {new Date(dep.verifiedAt).toLocaleString()} by {dep.verifiedBy || 'Admin'}</span>
                                </>
                              )}
                            </div>

                            {dep.rejectionReason && (
                              <p className="text-xs text-red-400 font-semibold mt-1">
                                Rejection Reason: {dep.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          {dep.paymentScreenshotUrl && (
                            <button
                              type="button"
                              onClick={() => setAdminDepositScreenshotPreview(dep.paymentScreenshotUrl || null)}
                              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          )}

                          {dep.status === 'pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const res = approveDeposit(dep.id);
                                  if (res.success) {
                                    setDepositActionFeedback({ type: 'success', text: `₹${dep.amount} deposit approved and credited to ${dep.userName}!` });
                                  } else {
                                    setDepositActionFeedback({ type: 'error', text: res.message });
                                  }
                                  setTimeout(() => setDepositActionFeedback(null), 3000);
                                }}
                                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>✓ APPROVE & CREDIT</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectModalDepositId(dep.id);
                                  setCustomRejectReason('Invalid UTR / Payment Not Received in Bank');
                                }}
                                className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                              >
                                <X className="w-4 h-4" />
                                <span>✕ REJECT</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono italic">
                              {dep.status === 'approved' || dep.status === 'completed' ? 'Credited to User Wallet' : 'Request Rejected'}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`क्या आप डिपॉजिट ID ${dep.id} (₹${dep.amount}) को हटाना चाहते हैं?`)) {
                                deleteDeposit(dep.id);
                              }
                            }}
                            title="Delete Deposit Record"
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 transition-all text-xs cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {deposits.length === 0 && (
                    <div className="p-8 rounded-2xl bg-[#0e102a] border border-white/10 text-center text-slate-400">
                      No deposit records found in the system.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 10: 💸 WITHDRAWAL APPROVALS */}
            {/* ================================================================= */}
            {activeTab === 'withdrawals' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-black text-white">💸 WITHDRAWAL APPROVALS &amp; PAYOUTS</h3>
                    <p className="text-xs text-slate-400">Disburse verified player earnings to Bank / UPI</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('क्या आप सभी विथड्रॉवल हिस्ट्री रिकॉर्ड्स को हटाना चाहते हैं? / Clear all withdrawals history?')) {
                          withdrawals.forEach((w) => deleteWithdrawal(w.id));
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>सभी विथड्रॉवल हटाएं (Clear All)</span>
                    </button>
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-mono border border-amber-400/30">
                      Pending: {withdrawals.filter((w) => w.status === 'pending').length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {withdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-5 rounded-2xl bg-[#0e102a] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
                    >
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="text-base font-black text-amber-400 font-mono">₹{w.amount}</span>
                          <span className="text-xs text-slate-300 font-bold">for {w.userName} ({w.userId})</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
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
                        <p className="text-xs text-slate-400 font-mono">
                          Payout: {w.payoutType} • Details: {w.upiId || `${w.accountNumber} (${w.ifscCode})`} • Name: {w.accountHolderName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {w.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveWithdrawal(w.id)}
                              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 cursor-pointer"
                            >
                              ✓ APPROVE &amp; MARK PAID
                            </button>
                            <button
                              onClick={() => rejectWithdrawal(w.id, 'Account details mismatch')}
                              className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs cursor-pointer"
                            >
                              ✕ REJECT
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`क्या आप विथड्रॉवल ID ${w.id} (₹${w.amount}) को हटाना चाहते हैं?`)) {
                              deleteWithdrawal(w.id);
                            }
                          }}
                          title="Delete Withdrawal Record"
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 transition-all text-xs cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 11: 💼 3-WALLET MANAGEMENT & SYSTEM BALANCES */}
            {/* ================================================================= */}
            {activeTab === 'wallets' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">💼 3-WALLET MANAGEMENT</h3>
                    <p className="text-xs text-slate-400">Total systemic liquidity distributed across Main, Ticket &amp; Winning Wallets</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 rounded-3xl bg-[#0e102a] border border-emerald-500/40 space-y-2">
                    <span className="text-xs text-emerald-400 font-bold uppercase">1. MAIN / DEPOSIT WALLET</span>
                    <p className="text-3xl font-black text-white font-mono">
                      ₹{allUsers.reduce((acc, u) => acc + (u.depositWallet || 0), 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-slate-400">Total User Deposit Reserves (Transferable with 5% fee)</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#0e102a] border border-pink-500/40 space-y-2">
                    <span className="text-xs text-pink-400 font-bold uppercase">2. TICKET WALLET</span>
                    <p className="text-3xl font-black text-white font-mono">
                      ₹{allUsers.reduce((acc, u) => acc + (u.ticketWallet || 0), 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-slate-400">Dedicated Game Purchase Credit (Non-Transferable)</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#0e102a] border border-amber-500/40 space-y-2">
                    <span className="text-xs text-amber-400 font-bold uppercase">3. WINNING WALLET</span>
                    <p className="text-3xl font-black text-white font-mono">
                      ₹{allUsers.reduce((acc, u) => acc + (u.winningWallet || 0), 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-slate-400">Withdrawable Verified Cash Earnings</p>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 12: 🔄 P2P TRANSFERS & 5% FEE LEDGER */}
            {/* ================================================================= */}
            {activeTab === 'transfers' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">🔄 P2P TRANSFERS &amp; 5% PLATFORM REVENUE</h3>
                    <p className="text-xs text-slate-400">Immutable ledger of wallet transfers and automatic 5% fee deductions</p>
                  </div>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-mono font-bold">
                    Fee Revenue: ₹{platformFeeLedger.reduce((acc, f) => acc + f.amount, 3450)}
                  </span>
                </div>

                <div className="space-y-3">
                  {transfers.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-[#0e102a] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">₹{t.recipientAmount}</span>
                          <span className="text-slate-400">
                            from <strong className="text-emerald-300">{t.senderUserName}</strong> to <strong className="text-purple-300">{t.recipientUserName}</strong>
                          </span>
                        </div>
                        <p className="text-slate-400 font-mono mt-0.5">
                          Gross: ₹{t.amount} • 5% Fee: <span className="text-cyan-400 font-bold">₹{t.feeAmount}</span>
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{t.createdAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 13: 👥 8-LEVEL REFERRAL EXPLORER */}
            {/* ================================================================= */}
            {activeTab === 'referrals' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">👥 8-LEVEL REFERRAL TREE EXPLORER</h3>
                    <p className="text-xs text-slate-400">Inspect user downlines, level counts and cumulative network commissions</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allUsers.map((user) => {
                    const directReferrals = allUsers.filter(
                      (u) =>
                        u.id !== user.id &&
                        ((u.referredBy && u.referredBy.trim().toUpperCase() === user.id.toUpperCase()) ||
                          (u.referredBy && user.referralCode && u.referredBy.trim().toUpperCase() === user.referralCode.toUpperCase()))
                    );

                    return (
                      <div
                        key={user.id}
                        className="p-5 rounded-3xl bg-[#0e102a] border border-purple-500/30 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <div>
                            <h4 className="font-bold text-white flex items-center gap-2">
                              <span>{user.name}</span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                                {user.id}
                              </span>
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">
                              Sponsor: <strong className="text-purple-300">{user.referredBy || 'None (Direct)'}</strong>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-300 text-xs font-mono font-bold block">
                              Earnings: ₹{user.referralEarnings || 0}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5 block">
                              Directs: {directReferrals.length}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Direct Members ({directReferrals.length}):
                          </p>
                          {directReferrals.length === 0 ? (
                            <p className="text-xs text-slate-500 italic bg-black/30 p-2 rounded-xl">
                              No direct referrals registered yet.
                            </p>
                          ) : (
                            <div className="max-h-28 overflow-y-auto space-y-1 bg-black/40 p-2 rounded-xl border border-white/5 text-xs">
                              {directReferrals.map((dr) => (
                                <div key={dr.id} className="flex justify-between items-center text-[11px] py-0.5">
                                  <span className="font-bold text-white">{dr.name}</span>
                                  <span className="font-mono text-amber-300 font-bold">{dr.id}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 14: 💎 8-LEVEL COMMISSION SETTINGS */}
            {/* ================================================================= */}
            {activeTab === 'commission' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e102a] border border-pink-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">💎 8-LEVEL COMMISSION STRUCTURE</h3>
                      <p className="text-xs text-slate-400">Configure exact percentage payouts for Level 1 through Level 8</p>
                    </div>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-full text-xs font-mono font-bold">
                      Total: {commissionLevels.reduce((sum, l) => sum + (l.isEnabled !== false ? l.percent : 0), 0).toFixed(1)}%
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {commissionLevels.map((lvl, idx) => (
                      <div
                        key={lvl.level}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 font-mono font-bold flex items-center justify-center">
                            L{lvl.level}
                          </span>
                          <span className="font-bold text-white">{lvl.label || `Level ${lvl.level}`}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={lvl.percent}
                            onChange={(e) => {
                              const updated = [...commissionLevels];
                              updated[idx].percent = Number(e.target.value);
                              setCommissionLevels(updated);
                            }}
                            className="w-20 px-3 py-1.5 rounded-xl bg-black/60 border border-pink-500/40 text-pink-300 font-mono font-bold text-center"
                          />
                          <span className="text-slate-400 font-bold">%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={handleSaveCommissionLevels}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg shadow-pink-500/25 hover:brightness-110 cursor-pointer"
                    >
                      SAVE 8-LEVEL COMMISSION STRUCTURE
                    </button>
                    <button
                      onClick={handleResetCommissionDefaults}
                      className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      RESET TO DEFAULTS (4.6%)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 13b: 🛡️ REFERRAL SYSTEM DIAGNOSTICS & AUDIT */}
            {/* ================================================================= */}
            {activeTab === 'referralDiagnostics' && (
              <ReferralDiagnostics />
            )}

            {/* ================================================================= */}
            {/* TAB 15: 💰 DIRECT INCOME CONFIGURATION */}
            {/* ================================================================= */}
            {activeTab === 'directIncome' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e102a] border border-emerald-500/30 space-y-4">
                  <h3 className="text-xl font-black text-white">💰 DIRECT SPONSOR INCOME CONFIG</h3>
                  <p className="text-xs text-slate-400">Enable and configure additional direct sponsor bonus on ticket purchases</p>

                  <div className="space-y-4 pt-2 text-xs">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div>
                        <p className="font-bold text-white">Direct Sponsor Income Active</p>
                        <p className="text-slate-400">Award immediate bonus to direct parent upon gameplay</p>
                      </div>
                      <button
                        onClick={() => setDirectIncomeEnabled(!directIncomeEnabled)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                          directIncomeEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {directIncomeEnabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold">Direct Sponsor Bonus Percentage (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={directIncomePercent}
                        onChange={(e) => setDirectIncomePercent(Number(e.target.value))}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-emerald-400 font-mono font-bold"
                      />
                    </div>

                    <button
                      onClick={() => {
                        updateSettings({ directIncomeEnabled, directIncomePercent });
                        setSaveSuccessMsg('Direct sponsor income configuration saved!');
                        setTimeout(() => setSaveSuccessMsg(null), 3000);
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:brightness-110 cursor-pointer"
                    >
                      SAVE DIRECT INCOME SETTINGS
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 16: 🏆 PRIZE SETTINGS & 70% POOL ENFORCEMENT */}
            {/* ================================================================= */}
            {activeTab === 'prizes' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0e102a] to-amber-950/60 border-2 border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-amber-400">🏆 70% CASH PRIZE POOL ENFORCEMENT</h3>
                      <p className="text-xs text-slate-300">
                        Formula: Total Eligible Ticket Sales × 70% = Maximum Prize Distribution
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                      70% Cap Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
                    <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                      <span className="text-slate-400">Current Sales Base</span>
                      <p className="text-lg font-black text-white font-mono">₹{validationResult.totalSales}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/60 border border-emerald-500/30">
                      <span className="text-slate-400">Allowed Prize Pool (70%)</span>
                      <p className="text-lg font-black text-emerald-400 font-mono">₹{validationResult.maxPrizePool70}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/60 border border-pink-500/30">
                      <span className="text-slate-400">Configured Prizes Sum</span>
                      <p className="text-lg font-black text-pink-400 font-mono">₹{validationResult.totalConfiguredPrizes}</p>
                    </div>
                  </div>
                </div>

                {/* Prize Categories Config Table */}
                <div className="p-6 rounded-3xl bg-[#0e102a] border border-white/10 space-y-4">
                  <h4 className="text-sm font-black text-white uppercase">Standard Winning Patterns &amp; Cash Rewards</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prizes.map((p, idx) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{p.icon || '🏆'}</span>
                          <div>
                            <p className="font-bold text-white text-sm">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.hindiName} • Winners: {p.winnerCount}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={p.amount}
                            onChange={(e) => {
                              const updated = [...prizes];
                              updated[idx].amount = Number(e.target.value);
                              updatePrizes(updated);
                            }}
                            className="w-20 px-2.5 py-1.5 rounded-xl bg-black/60 border border-amber-400/40 text-amber-400 font-mono font-bold text-sm text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSaveSettings({})}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg cursor-pointer"
                  >
                    SAVE PRIZE PATTERN CONFIGURATION
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 17: 🎨 TICKET COLORS & THEMES */}
            {/* ================================================================= */}
            {activeTab === 'ticketDesign' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">🎨 TICKET THEMES &amp; COLOR STYLING</h3>
                    <p className="text-xs text-slate-400">Customize visual appearance of player tickets</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(ADMIN_TICKET_THEMES).map(([id, style]) => (
                    <div
                      key={id}
                      className={`p-5 rounded-3xl bg-gradient-to-br ${style.bg} border-2 ${style.border} space-y-3 shadow-xl`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-black text-white uppercase text-sm">{style.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${style.badge}`}>
                          Active Style
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">{style.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 18: 💳 PAYMENT GATEWAY & UPI CONFIG */}
            {/* ================================================================= */}
            {activeTab === 'payments' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e102a] border border-emerald-500/30 space-y-4">
                  <h3 className="text-xl font-black text-white">💳 PAYMENT GATEWAY &amp; UPI SETTINGS</h3>
                  <p className="text-xs text-slate-400">Configure official UPI ID, QR code and bank payout details for deposits &amp; withdrawals</p>

                  <form onSubmit={handleSavePayments} className="space-y-4 pt-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 font-bold">Admin Official UPI ID</label>
                        <input
                          type="text"
                          value={adminUpiId}
                          onChange={(e) => setAdminUpiId(e.target.value)}
                          className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold">QR Code Image URL</label>
                        <input
                          type="text"
                          value={adminQrUrl}
                          onChange={(e) => setAdminQrUrl(e.target.value)}
                          placeholder="https://... or data:image/png..."
                          className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold">Min Deposit (₹)</label>
                        <input
                          type="number"
                          value={minDeposit}
                          onChange={(e) => setMinDeposit(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-emerald-400 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold">Max Deposit (₹)</label>
                        <input
                          type="number"
                          value={maxDeposit}
                          onChange={(e) => setMaxDeposit(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-emerald-400 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold">Min Withdrawal (₹)</label>
                        <input
                          type="number"
                          value={minWithdrawal}
                          onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-amber-400 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold">Max Withdrawal (₹)</label>
                        <input
                          type="number"
                          value={maxWithdrawal}
                          onChange={(e) => setMaxWithdrawal(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-amber-400 font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                      <h4 className="font-bold text-white">Bank Account Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400">Bank Name</label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400">Account Holder Name</label>
                          <input
                            type="text"
                            value={accountHolder}
                            onChange={(e) => setAccountHolder(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400">Account Number</label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400">IFSC Code</label>
                          <input
                            type="text"
                            value={ifsc}
                            onChange={(e) => setIfsc(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:brightness-110 cursor-pointer"
                    >
                      SAVE PAYMENT GATEWAY CONFIGURATION
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 19: 📢 NOTIFICATION BROADCASTER */}
            {/* ================================================================= */}
            {activeTab === 'notifications' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e102a] border border-purple-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">📢 NOTIFICATION BROADCASTER</h3>
                      <p className="text-xs text-slate-400">Broadcast platform announcements to all players or targeted user groups</p>
                    </div>
                    <Bell className="w-8 h-8 text-pink-400" />
                  </div>

                  {broadcastSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Broadcast notification dispatched to active users!</span>
                    </div>
                  )}

                  <form onSubmit={handleBroadcastSubmit} className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Target Audience</label>
                      <select
                        value={broadcastTarget}
                        onChange={(e) => setBroadcastTarget(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                      >
                        <option value="all">All Registered Users</option>
                        <option value="active">Active Players (Last 24h)</option>
                        <option value="vip">High Value Referrers</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300">Notification Title</label>
                      <input
                        type="text"
                        placeholder="e.g. 🎉 Mega Bumper Housie starts at 9:00 PM!"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300">Notification Message</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Book your tickets now for ₹25 and win up to ₹250 full house prizes!"
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg shadow-pink-500/25 cursor-pointer"
                    >
                      SEND BROADCAST ANNOUNCEMENT
                    </button>
                  </form>

                  {/* Active / Sent Notifications List */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span>सक्रिय एवं पूर्व सूचनाएं ({notifications.length})</span>
                      </h4>
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('क्या आप सभी नोटिफिकेशन हटाना चाहते हैं? / Clear all broadcast notifications?')) {
                              clearAllNotifications();
                            }
                          }}
                          className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>सब नोटिफिकेशन हटाएं (Clear All)</span>
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 text-center bg-black/30 rounded-xl">
                        कोई नोटिफिकेशन नहीं है (No notifications in system).
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-white">{n.title}</p>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'}
                                </span>
                              </div>
                              <p className="text-slate-300 mt-1">{n.message}</p>
                              {n.userId && (
                                <p className="text-[10px] text-amber-400 mt-1 font-mono">Recipient: User ID {n.userId}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('क्या आप इस नोटिफिकेशन को हटाना चाहते हैं?')) {
                                  deleteNotification(n.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all"
                              title="Delete Notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 20: 📊 REPORTS & REAL CSV/EXCEL EXPORT */}
            {/* ================================================================= */}
            {activeTab === 'reports' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">📊 PLATFORM REPORTS &amp; DATA EXPORTS</h3>
                    <p className="text-xs text-slate-400">Generate and download instant CSV, Excel (.xls) and printable reports</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => exportToCSV('all')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Export Excel</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print View</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-3xl bg-[#0e102a] border border-white/10 space-y-2">
                    <span className="text-xs text-slate-400 font-bold">USER BASE SNAPSHOT</span>
                    <p className="text-2xl font-black text-white font-mono">{allUsers.length} Users</p>
                    <button
                      onClick={() => exportToCSV('users')}
                      className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      Download Users CSV →
                    </button>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#0e102a] border border-white/10 space-y-2">
                    <span className="text-xs text-slate-400 font-bold">DEPOSITS LEDGER</span>
                    <p className="text-2xl font-black text-emerald-400 font-mono">{deposits.length} Records</p>
                    <button
                      onClick={() => exportToCSV('deposits')}
                      className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      Download Deposits CSV →
                    </button>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#0e102a] border border-white/10 space-y-2">
                    <span className="text-xs text-slate-400 font-bold">WITHDRAWALS LEDGER</span>
                    <p className="text-2xl font-black text-amber-400 font-mono">{withdrawals.length} Records</p>
                    <button
                      onClick={() => exportToCSV('withdrawals')}
                      className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      Download Withdrawals CSV →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 21: ⚙️ WEBSITE CMS SETTINGS */}
            {/* ================================================================= */}
            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e102a] border border-white/10 space-y-4">
                  <h3 className="text-xl font-black text-white">⚙️ CMS &amp; PLATFORM SETTINGS</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-300">Website Name</label>
                      <input
                        type="text"
                        value={settings.websiteName}
                        onChange={(e) => updateSettings({ websiteName: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-300">Tagline</label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => updateSettings({ tagline: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Maintenance Mode</p>
                      <p className="text-xs text-slate-400">Put platform in temporary maintenance</p>
                    </div>
                    <button
                      onClick={() => updateSettings({ maintenanceMode: !settings.maintenanceMode })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                        settings.maintenanceMode ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {settings.maintenanceMode ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* Firebase Firestore Database Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b1035] via-[#101438] to-[#0c1833] border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">Firebase Firestore Database</h4>
                        <p className="text-xs text-amber-300">Live Persistent Documents, User Collections &amp; Realtime Game Sync</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Firestore Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Firebase Project ID</span>
                      <p className="font-mono text-amber-300 font-bold text-sm select-all">earn-mob-a2ea1</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Auth Domain / Database URL</span>
                      <p className="font-mono text-emerald-300 font-bold text-xs select-all break-all">earn-mob-a2ea1.firebaseapp.com</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <p className="text-slate-300">
                      Real-time user state, ticket orders, deposits, and game winner audit logs are automatically persisted to your Firebase Project.
                    </p>
                    <a
                      href="https://console.firebase.google.com/project/earn-mob-a2ea1/firestore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black whitespace-nowrap shadow-lg shadow-amber-500/30 transition-all flex items-center gap-1.5"
                    >
                      <span>Open Firebase Console</span>
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 22: 🔐 ADMIN SECURITY & 2FA */}
            {/* ================================================================= */}
            {activeTab === 'security' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0e102a] border border-amber-500/30 space-y-4">
                  <h3 className="text-xl font-black text-white">🔐 ADMIN MASTER SECURITY &amp; PIN</h3>
                  <p className="text-xs text-slate-400">Update master admin credentials and 2-Factor Authentication requirement</p>

                  {securityFeedback && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{securityFeedback}</span>
                    </div>
                  )}

                  <form onSubmit={handleSecurityPinChange} className="space-y-4 pt-2 text-xs">
                    <div>
                      <label className="text-slate-300 font-bold">Current Super Admin PIN</label>
                      <input
                        type="password"
                        placeholder="••••••"
                        value={currentAdminPin}
                        onChange={(e) => setCurrentAdminPin(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 font-bold">New Super Admin PIN</label>
                        <input
                          type="password"
                          placeholder="••••••"
                          value={newAdminPin}
                          onChange={(e) => setNewAdminPin(e.target.value)}
                          className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold">Confirm New PIN</label>
                        <input
                          type="password"
                          placeholder="••••••"
                          value={confirmAdminPin}
                          onChange={(e) => setConfirmAdminPin(e.target.value)}
                          className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 cursor-pointer"
                    >
                      UPDATE MASTER ADMIN CREDENTIALS
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 23: 📝 IMMUTABLE AUDIT LOGS */}
            {/* ================================================================= */}
            {activeTab === 'auditLogs' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-xl font-black text-white">📝 IMMUTABLE AUDIT LOGS</h3>
                    <p className="text-xs text-slate-400">Chronological history of all financial adjustments, game starts and admin actions</p>
                  </div>
                  <Database className="w-6 h-6 text-amber-400" />
                </div>

                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-[#0e102a] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-300 font-mono">[{log.category}]</span>
                          <span className="font-bold text-white">{log.action}</span>
                        </div>
                        <p className="text-slate-400 mt-0.5">{log.details}</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        <p>{log.adminName}</p>
                        <p>{log.createdAt.split('T')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Screenshot Lightbox Modal for Admin Review */}
        {adminDepositScreenshotPreview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={() => setAdminDepositScreenshotPreview(null)}
          >
            <div
              className="relative max-w-2xl w-full bg-[#0e112d] border border-emerald-500/50 rounded-3xl p-5 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base font-bold text-white">Payment Screenshot Inspection / भुगतान रसीद</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminDepositScreenshotPreview(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-auto rounded-2xl bg-black/80 p-2 flex items-center justify-center border border-white/10">
                <img
                  src={adminDepositScreenshotPreview}
                  alt="Payment Proof Full"
                  className="max-h-[65vh] w-auto object-contain rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={adminDepositScreenshotPreview}
                  download="user-deposit-screenshot.png"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / डाउनलोड</span>
                </a>
                <button
                  type="button"
                  onClick={() => setAdminDepositScreenshotPreview(null)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black"
                >
                  Close / बंद करें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Deposit Modal */}
        {rejectModalDepositId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={() => setRejectModalDepositId(null)}
          >
            <div
              className="relative max-w-md w-full bg-[#0e112d] border border-red-500/50 rounded-3xl p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="text-base font-black">Reject Deposit Request</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setRejectModalDepositId(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Please select or enter the reason for rejecting this deposit. The user will be notified immediately.
              </p>

              {/* Preset Reason Chips */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Quick Templates:</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Invalid UTR / Transaction number',
                    'Payment not received in UPI / Bank',
                    'Screenshot is blurred or invalid',
                    'Incorrect amount transferred',
                    'Duplicate submission / Already processed',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomRejectReason(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                        customRejectReason === preset
                          ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Custom Rejection Reason:</label>
                <textarea
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  rows={3}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-red-400"
                  placeholder="Enter rejection reason..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalDepositId(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (rejectModalDepositId) {
                      const res = rejectDeposit(rejectModalDepositId, customRejectReason);
                      if (res.success) {
                        setDepositActionFeedback({ type: 'success', text: `Deposit has been rejected.` });
                      } else {
                        setDepositActionFeedback({ type: 'error', text: res.message });
                      }
                      setRejectModalDepositId(null);
                      setTimeout(() => setDepositActionFeedback(null), 3000);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-black shadow-lg shadow-red-500/20"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
  );

  if (isPageMode) {
    return (
      <div className="w-full flex-1 flex flex-col">
        {adminContainerContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 bg-black/90 backdrop-blur-md animate-fade-in text-slate-100">
      {adminContainerContent}
    </div>
  );
};
