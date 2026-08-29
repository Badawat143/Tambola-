import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  syncUserToFirestore,
  syncTicketToFirestore,
  syncGameToFirestore,
  recordTransactionToFirestore,
  recordWinnerToFirestore,
} from '../services/firebase';
import {
  GameItem,
  PrizeCategory,
  ReferralDownlineStats,
  SiteSettings,
  TambolaTicket,
  User,
  WinnerItem,
  DepositRecord,
  WithdrawalRecord,
  CommissionLedgerItem,
  FreeTicketWinner,
  TicketPriceOption,
  NotificationItem,
  AuditLog,
  WinningPatternCode,
  PrizePoolValidationResult,
  TransferRecord,
  PlatformFeeLedgerItem,
  PrizeLedgerItem,
  TicketColorId,
  DashboardTab,
  AdminTab,
} from '../types/tambola';
import {
  INITIAL_GAMES,
  INITIAL_PRIZE_CATEGORIES,
  INITIAL_SITE_SETTINGS,
  INITIAL_TICKET_PRICES,
  INITIAL_WINNERS,
  INITIAL_DEPOSITS,
  INITIAL_WITHDRAWALS,
  INITIAL_COMMISSION_LEDGER,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TRANSFERS,
  INITIAL_PLATFORM_FEE_LEDGER,
  INITIAL_PRIZE_LEDGER,
} from '../data/mockData';
import {
  calculateReferralDownline,
  INITIAL_SEED_USERS,
  validatePrizePool,
  verifyWinningClaim,
} from '../utils/referralEngine';
import { createNewTicket, getRandomTicketColor } from '../utils/ticketGenerator';
import { soundFx } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export { type DashboardTab, type AdminTab };

interface TambolaContextType {
  // State
  currentUser: User;
  allUsers: User[];
  settings: SiteSettings;
  prizes: PrizeCategory[];
  upcomingGames: GameItem[];
  winners: WinnerItem[];
  myTickets: TambolaTicket[];
  activeLiveGame: GameItem;
  liveCalledNumbers: number[];
  currentCalledNumber: number | null;
  isGameCalling: boolean;
  downlineStats: ReferralDownlineStats;
  isSoundMuted: boolean;
  complianceAgreed: boolean;
  speechCallerEnabled: boolean;

  // Financial & Ledger Data
  deposits: DepositRecord[];
  withdrawals: WithdrawalRecord[];
  transfers: TransferRecord[];
  commissionLedger: CommissionLedgerItem[];
  platformFeeLedger: PlatformFeeLedgerItem[];
  prizeLedger: PrizeLedgerItem[];
  freeTicketWinners: FreeTicketWinner[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  availableTicketPrices: TicketPriceOption[];
  activeWinnerFlash: {
    userName: string;
    userId: string;
    ticketNumber: number;
    prizeName: string;
    prizeAmount: number;
  } | null;
  dismissWinnerFlash: () => void;

  // Active Modals & Dashboard
  activeModal:
    | null
    | 'login'
    | 'register'
    | 'playLive'
    | 'buyTicket'
    | 'myTickets'
    | 'referral'
    | 'admin'
    | 'prizes'
    | 'winners'
    | 'howItWorks'
    | 'support'
    | 'legal'
    | 'responsibleGaming'
    | 'userSwitcher'
    | 'userDashboard'
    | 'deposit'
    | 'withdraw';
  selectedGameForPurchase: GameItem | null;
  userDashboardTab: DashboardTab;

  // Navigation & UI Actions
  setActiveModal: (modal: TambolaContextType['activeModal']) => void;
  setUserDashboardTab: (tab: DashboardTab) => void;
  openUserDashboard: (tab?: DashboardTab) => void;
  setSelectedGameForPurchase: (game: GameItem | null) => void;
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  registerUser: (
    name: string,
    phone: string,
    email: string,
    referralCode?: string,
    state?: string
  ) => { success: boolean; message: string; user?: User };
  loginUser: (phoneOrEmail: string) => { success: boolean; message: string };
  logoutUser: () => void;
  toggleSound: () => boolean;
  toggleSpeechCaller: () => boolean;
  setComplianceAgreed: (agreed: boolean) => void;
  triggerConfetti: () => void;

  // Wallet & Financial Actions
  depositMoney: (
    amount: number,
    method?: 'UPI' | 'QR' | 'NetBanking',
    utr?: string
  ) => { success: boolean; message: string; deposit?: DepositRecord };
  submitManualDeposit: (
    amount: number,
    method: 'UPI' | 'QR' | 'NetBanking',
    utr: string,
    screenshotUrl?: string
  ) => { success: boolean; message: string; deposit?: DepositRecord };
  approveDeposit: (depositId: string, adminId?: string) => { success: boolean; message: string };
  rejectDeposit: (depositId: string, rejectionReason: string, adminId?: string) => { success: boolean; message: string };
  transferMoney: (
    recipientQuery: string,
    amount: number
  ) => { success: boolean; message: string; transfer?: TransferRecord };
  transferDepositToTicketWallet: (
    amount: number
  ) => { success: boolean; message: string };
  requestWithdrawal: (
    amount: number,
    payoutDetails: {
      payoutType: 'UPI' | 'Bank';
      accountHolderName: string;
      upiId?: string;
      accountNumber?: string;
      ifscCode?: string;
      bankName?: string;
    }
  ) => { success: boolean; message: string; withdrawal?: WithdrawalRecord };
  approveWithdrawal: (withdrawalId: string, adminId?: string) => { success: boolean; message: string };
  rejectWithdrawal: (
    withdrawalId: string,
    rejectionReason: string,
    adminId?: string
  ) => { success: boolean; message: string };
  saveBankDetails: (details: User['bankDetails']) => { success: boolean; message: string };

  // Ticket & Gameplay Actions
  buyTicket: (
    gameId: string,
    quantity?: number,
    ticketPrice?: number,
    colorTheme?: TicketColorId
  ) => { success: boolean; message: string; tickets?: TambolaTicket[] };
  useFreeTicketToBuy: (gameId: string, freeTicketWinnerId: string) => { success: boolean; message: string; ticket?: TambolaTicket };
  generateCustomTicket: (gameId?: string, price?: number) => TambolaTicket;
  toggleMarkNumberOnTicket: (ticketId: string, num: number) => void;
  claimPrizeWithPattern: (
    ticketId: string,
    patternCode: WinningPatternCode
  ) => { success: boolean; message: string; prizeAmount?: number; categoryName?: string };

  // Game Management & Live Caller Actions
  startLiveCaller: () => void;
  pauseLiveCaller: () => void;
  callNextNumber: () => number | null;
  callSpecificNumber: (num: number) => { success: boolean; message: string; number?: number };
  undoLastNumber: () => { success: boolean; message: string; undoneNumber?: number };
  resetLiveGame: () => void;
  createGame: (gameData: Partial<GameItem>) => { success: boolean; message: string; game?: GameItem };
  updateGameStatus: (gameId: string, status: GameItem['status']) => void;
  validateGamePrizePool: (totalSales: number, prizeCategories: PrizeCategory[]) => PrizePoolValidationResult;
  drawFreeTicketWinnersForGame: (gameId: string) => { success: boolean; winners: FreeTicketWinner[]; message: string };

  // Admin & CMS Actions
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updatePrizes: (newPrizes: PrizeCategory[]) => void;
  toggleTicketPrice: (price: number, enabled: boolean) => void;
  addTicketPriceOption: (option: TicketPriceOption) => void;
  toggleBlockUser: (userId: string) => void;
  verifyUserKyc: (userId: string) => void;
  addNotification: (title: string, message: string, type: NotificationItem['type'], userId?: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const TambolaContext = createContext<TambolaContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'apna_tambola_users_v6';
const SETTINGS_STORAGE_KEY = 'apna_tambola_settings_v6';
const TICKETS_STORAGE_KEY = 'apna_tambola_tickets_v6';
const ACTIVE_USER_KEY = 'apna_tambola_active_user_v6';
const DEPOSITS_KEY = 'apna_tambola_deposits_v6';
const WITHDRAWALS_KEY = 'apna_tambola_withdrawals_v6';
const TRANSFERS_KEY = 'apna_tambola_transfers_v6';
const COMMISSION_KEY = 'apna_tambola_comm_ledger_v6';
const PLATFORM_FEE_KEY = 'apna_tambola_fee_ledger_v6';
const PRIZE_LEDGER_KEY = 'apna_tambola_prize_ledger_v6';
const FREE_TICKETS_KEY = 'apna_tambola_freetickets_v6';
const NOTIFICATIONS_KEY = 'apna_tambola_notifs_v6';
const AUDIT_LOGS_KEY = 'apna_tambola_audit_v6';
const GAMES_KEY = 'apna_tambola_games_v6';

export const TambolaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Users
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_SEED_USERS;
  });

  // Current Active User
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_USER_KEY);
      if (savedId) {
        const found = allUsers.find((u) => u.id === savedId);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return allUsers[0] || INITIAL_SEED_USERS[0];
  });

  // 2. Site Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SITE_SETTINGS,
          ...parsed,
          referralLevels:
            parsed.referralLevels && parsed.referralLevels.length === 8
              ? parsed.referralLevels
              : INITIAL_SITE_SETTINGS.referralLevels,
          availableTicketPrices:
            parsed.availableTicketPrices && parsed.availableTicketPrices.length > 0
              ? parsed.availableTicketPrices
              : INITIAL_TICKET_PRICES,
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_SITE_SETTINGS;
  });

  // 3. Prizes & Categories
  const [prizes, setPrizes] = useState<PrizeCategory[]>(() => {
    return settings.prizeCategoriesList && settings.prizeCategoriesList.length > 0
      ? settings.prizeCategoriesList
      : INITIAL_PRIZE_CATEGORIES;
  });

  // 4. Games
  const [upcomingGames, setUpcomingGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem(GAMES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_GAMES;
  });

  // 5. Active Live Game
  const [activeLiveGame, setActiveLiveGame] = useState<GameItem>(() => {
    return upcomingGames.find((g) => g.status === 'live') || upcomingGames[0] || INITIAL_GAMES[0];
  });

  const [liveCalledNumbers, setLiveCalledNumbers] = useState<number[]>(() => {
    return activeLiveGame.calledNumbers && activeLiveGame.calledNumbers.length > 0
      ? activeLiveGame.calledNumbers
      : [7, 14, 22, 38, 49, 53, 67, 81, 90, 11, 28, 45, 62, 79, 3];
  });
  const [currentCalledNumber, setCurrentCalledNumber] = useState<number | null>(() => {
    return liveCalledNumbers[liveCalledNumbers.length - 1] || 3;
  });
  const [isGameCalling, setIsGameCalling] = useState<boolean>(false);
  const [speechCallerEnabled, setSpeechCallerEnabled] = useState<boolean>(true);

  // 6. Winners
  const [winners, setWinners] = useState<WinnerItem[]>(INITIAL_WINNERS);

  // 7. User Tickets
  const [myTickets, setMyTickets] = useState<TambolaTicket[]>(() => {
    try {
      const saved = localStorage.getItem(TICKETS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const sample = createNewTicket('AT-1025', INITIAL_SEED_USERS[0].id, INITIAL_SEED_USERS[0].name, 'TKT-84920');
    sample.ticketPrice = 20;
    return [sample];
  });

  // 8. Financial Ledgers
  const [deposits, setDeposits] = useState<DepositRecord[]>(() => {
    try {
      const saved = localStorage.getItem(DEPOSITS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEPOSITS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(WITHDRAWALS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_WITHDRAWALS;
  });

  const [transfers, setTransfers] = useState<TransferRecord[]>(() => {
    try {
      const saved = localStorage.getItem(TRANSFERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TRANSFERS;
  });

  const [commissionLedger, setCommissionLedger] = useState<CommissionLedgerItem[]>(() => {
    try {
      const saved = localStorage.getItem(COMMISSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMMISSION_LEDGER;
  });

  const [platformFeeLedger, setPlatformFeeLedger] = useState<PlatformFeeLedgerItem[]>(() => {
    try {
      const saved = localStorage.getItem(PLATFORM_FEE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PLATFORM_FEE_LEDGER;
  });

  const [prizeLedger, setPrizeLedger] = useState<PrizeLedgerItem[]>(() => {
    try {
      const saved = localStorage.getItem(PRIZE_LEDGER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRIZE_LEDGER;
  });

  const [freeTicketWinners, setFreeTicketWinners] = useState<FreeTicketWinner[]>(() => {
    try {
      const saved = localStorage.getItem(FREE_TICKETS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return activeLiveGame.freeTicketWinners || [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(AUDIT_LOGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });

  const [availableTicketPrices, setAvailableTicketPrices] = useState<TicketPriceOption[]>(() => {
    return settings.availableTicketPrices || INITIAL_TICKET_PRICES;
  });

  // UI State
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [complianceAgreed, setComplianceAgreed] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<TambolaContextType['activeModal']>(null);
  const [userDashboardTab, setUserDashboardTab] = useState<DashboardTab>('dashboard');
  const [selectedGameForPurchase, setSelectedGameForPurchase] = useState<GameItem | null>(null);
  const [activeWinnerFlash, setActiveWinnerFlash] = useState<{
    userName: string;
    userId: string;
    ticketNumber: number;
    prizeName: string;
    prizeAmount: number;
  } | null>(null);

  const dismissWinnerFlash = () => {
    setActiveWinnerFlash(null);
  };

  // Persistence to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(myTickets));
      localStorage.setItem(ACTIVE_USER_KEY, currentUser.id);
      localStorage.setItem(DEPOSITS_KEY, JSON.stringify(deposits));
      localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));
      localStorage.setItem(TRANSFERS_KEY, JSON.stringify(transfers));
      localStorage.setItem(COMMISSION_KEY, JSON.stringify(commissionLedger));
      localStorage.setItem(PLATFORM_FEE_KEY, JSON.stringify(platformFeeLedger));
      localStorage.setItem(PRIZE_LEDGER_KEY, JSON.stringify(prizeLedger));
      localStorage.setItem(FREE_TICKETS_KEY, JSON.stringify(freeTicketWinners));
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(auditLogs));
      localStorage.setItem(GAMES_KEY, JSON.stringify(upcomingGames));
    } catch {}
  }, [allUsers, settings, myTickets, currentUser, deposits, withdrawals, transfers, commissionLedger, platformFeeLedger, prizeLedger, freeTicketWinners, notifications, auditLogs, upcomingGames]);

  // URL referral detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setActiveModal('register');
      }
    }
  }, []);

  // Compute Downline dynamically for current user
  const downlineStats = calculateReferralDownline(
    currentUser,
    allUsers,
    settings.referralLevels,
    settings.defaultTicketPrice
  );

  const openUserDashboard = (tab: DashboardTab = 'dashboard') => {
    setUserDashboardTab(tab);
    setActiveModal('userDashboard');
  };

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsSoundMuted(muted);
    return muted;
  };

  const toggleSpeechCaller = () => {
    setSpeechCallerEnabled((prev) => !prev);
    return !speechCallerEnabled;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#fbbf24'],
      });
      soundFx.playWinFanfare();
    } catch {}
  };

  // Text-To-Speech Tambola Number Announcement
  const speakNumber = (num: number) => {
    if (!speechCallerEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const text = `Number ${num}. Only number ${num}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  // Switch User
  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      // Sync my tickets to user's tickets
      const userTickets = myTickets.filter((t) => t.userId === target.id);
      if (userTickets.length === 0) {
        const fresh = createNewTicket('AT-1025', target.id, target.name, `TKT-${Math.floor(10000 + Math.random() * 90000)}`);
        fresh.ticketPrice = 20;
        setMyTickets((prev) => [fresh, ...prev]);
      }
    }
  };

  // Register User
  const registerUser = (
    name: string,
    phone: string,
    email: string,
    referralCodeInput?: string,
    stateOfResidence: string = 'Maharashtra'
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone);
    if (existing) {
      return { success: false, message: 'An account with this email or mobile number already exists.' };
    }

    let verifiedReferredBy: string | null = null;
    if (referralCodeInput && referralCodeInput.trim()) {
      const code = referralCodeInput.trim().toUpperCase();
      const parentUser = allUsers.find(
        (u) =>
          (u.referralCode && u.referralCode.trim().toUpperCase() === code) ||
          (u.id && u.id.trim().toUpperCase() === code)
      );
      if (parentUser) {
        verifiedReferredBy = parentUser.referralCode;
      }
    }

    const uniqueId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    const newRefCode = `APNA${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
      id: uniqueId,
      name,
      phone: cleanPhone,
      email: cleanEmail,
      referralCode: newRefCode,
      referredBy: verifiedReferredBy,
      depositWallet: 0,
      ticketWallet: 100, // ₹100 welcome signup bonus strictly for tickets
      winningWallet: 0,
      walletBalance: 100, // Total = 0 + 100 + 0
      referralEarnings: 0,
      directIncomeEarnings: 0,
      gameWinnings: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      freeTicketsAvailable: 1, // 1 Free Ticket on Registration!
      role: 'user',
      createdAt: new Date().toISOString(),
      ageVerified: true,
      stateOfResidence,
      isKycVerified: false,
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    syncUserToFirestore(newUser);

    // Initial starter ticket
    const initialTicket = createNewTicket('AT-1025', newUser.id, newUser.name, `TKT-${Math.floor(10000 + Math.random() * 90000)}`);
    initialTicket.ticketPrice = 20;
    setMyTickets((prev) => [initialTicket, ...prev]);

    // Welcome Notification
    addNotification(
      '🎉 Welcome to APNA TAMBOLA!',
      '₹100 Ticket Wallet bonus and 1 Free Ticket added to your account. Enjoy real-money Tambola!',
      'system',
      newUser.id
    );

    return { success: true, message: 'Account registered successfully!', user: newUser };
  };

  // Login User
  const loginUser = (phoneOrEmail: string) => {
    const query = phoneOrEmail.trim().toLowerCase();
    const found = allUsers.find((u) => u.email.toLowerCase() === query || u.phone.toLowerCase() === query);

    if (found) {
      if (found.isBlocked) {
        return { success: false, message: 'Your account has been temporarily suspended. Please contact customer support.' };
      }
      setCurrentUser(found);
      return { success: true, message: `Welcome back, ${found.name}!` };
    }
    return { success: false, message: 'No registered user found with these details. Please register first.' };
  };

  const logoutUser = () => {
    const defaultUser = allUsers[0] || INITIAL_SEED_USERS[0];
    setCurrentUser(defaultUser);
    setActiveModal(null);
  };

  // Save Bank Details
  const saveBankDetails = (details: User['bankDetails']) => {
    const updated = {
      ...currentUser,
      bankDetails: details,
      isKycVerified: true,
    };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    return { success: true, message: 'Bank details & UPI ID saved securely.' };
  };

  // 2. DEPOSIT SYSTEM: Min ₹100, Multiples of ₹100, Max ₹2,000
  const depositMoney = (amount: number, method: 'UPI' | 'QR' | 'NetBanking' = 'UPI', utr?: string) => {
    const num = Number(amount);
    if (isNaN(num) || num < 100 || num > 2000) {
      return { success: false, message: 'Deposit amount must be between ₹100 and ₹2,000.' };
    }
    if (num % 100 !== 0) {
      return { success: false, message: 'Deposit must be strictly in multiples of ₹100 (e.g. ₹100, ₹200, ₹300).' };
    }

    const newDeposit: DepositRecord = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount: num,
      paymentMethod: method,
      transactionId: `TXN-DEP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      utrRef: utr || `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };

    const newDepositWallet = Math.round(((currentUser.depositWallet || 0) + num) * 100) / 100;
    const newTotal = Math.round((newDepositWallet + (currentUser.ticketWallet || 0) + (currentUser.winningWallet || 0)) * 100) / 100;

    const updatedUser: User = {
      ...currentUser,
      depositWallet: newDepositWallet,
      walletBalance: newTotal,
      totalDeposited: Math.round(((currentUser.totalDeposited || 0) + num) * 100) / 100,
    };

    setDeposits((prev) => [newDeposit, ...prev]);
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    // Audit Log
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId: 'SYSTEM_GATEWAY',
        adminName: 'Instant UPI Webhook',
        action: 'DEPOSIT_SUCCESS',
        details: `User ${currentUser.name} (${currentUser.id}) deposited ₹${num} via ${method}. UTR: ${newDeposit.utrRef}`,
        category: 'FINANCE',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    // Notification
    addNotification(
      '💰 Deposit Successful',
      `₹${num} added to your Main/Deposit wallet. Transaction ID: ${newDeposit.transactionId}`,
      'deposit',
      currentUser.id
    );

    soundFx.playNumberCalled();
    return { success: true, message: `₹${num} successfully added to your Main/Deposit wallet!`, deposit: newDeposit };
  };

  // Submit Manual Deposit for Admin Review
  const submitManualDeposit = (
    amount: number,
    method: 'UPI' | 'QR' | 'NetBanking' = 'UPI',
    utr: string,
    screenshotUrl?: string
  ) => {
    const num = Number(amount);
    if (isNaN(num) || num < 100 || num > 2000) {
      return { success: false, message: 'Deposit amount must be between ₹100 and ₹2,000.' };
    }
    if (num % 100 !== 0) {
      return { success: false, message: 'Deposit must be strictly in multiples of ₹100 (e.g. ₹100, ₹200, ₹300).' };
    }
    if (!utr || utr.trim().length < 6) {
      return { success: false, message: 'Please enter a valid 12-digit UTR or Transaction reference number.' };
    }

    const newDeposit: DepositRecord = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount: num,
      paymentMethod: method,
      transactionId: `TXN-DEP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      utrRef: utr.trim(),
      paymentScreenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=60',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setDeposits((prev) => [newDeposit, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId: 'USER_ACTION',
        adminName: currentUser.name,
        action: 'DEPOSIT_PENDING',
        details: `User ${currentUser.name} (${currentUser.id}) submitted ₹${num} deposit via ${method}. UTR: ${utr.trim()}. Pending Admin approval.`,
        category: 'FINANCE',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addNotification(
      '⏳ Deposit Submitted for Verification',
      `Your ₹${num} deposit with UTR ${utr.trim()} has been submitted. Admin will approve within 5-15 minutes.`,
      'deposit',
      currentUser.id
    );

    return { success: true, message: 'Deposit submitted successfully! Funds will be credited upon Admin approval.', deposit: newDeposit };
  };

  // Admin Approve Deposit
  const approveDeposit = (depositId: string, adminId: string = 'USR-ADMIN') => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep) return { success: false, message: 'Deposit record not found.' };
    if (dep.status === 'approved' || dep.status === 'completed') {
      return { success: false, message: 'This deposit has already been approved.' };
    }

    const updatedDeposits = deposits.map((d) =>
      d.id === depositId
        ? {
            ...d,
            status: 'approved' as const,
            verifiedAt: new Date().toISOString(),
            verifiedBy: 'Super Admin',
          }
        : d
    );
    setDeposits(updatedDeposits);

    // Credit user's depositWallet
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === dep.userId) {
          const newDep = Math.round(((u.depositWallet || 0) + dep.amount) * 100) / 100;
          const newBal = Math.round((newDep + (u.ticketWallet || 0) + (u.winningWallet || 0)) * 100) / 100;
          return {
            ...u,
            depositWallet: newDep,
            walletBalance: newBal,
            totalDeposited: Math.round(((u.totalDeposited || 0) + dep.amount) * 100) / 100,
          };
        }
        return u;
      })
    );

    if (currentUser.id === dep.userId) {
      setCurrentUser((prev) => {
        const newDep = Math.round(((prev.depositWallet || 0) + dep.amount) * 100) / 100;
        const newBal = Math.round((newDep + (prev.ticketWallet || 0) + (prev.winningWallet || 0)) * 100) / 100;
        return {
          ...prev,
          depositWallet: newDep,
          walletBalance: newBal,
          totalDeposited: Math.round(((prev.totalDeposited || 0) + dep.amount) * 100) / 100,
        };
      });
    }

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId,
        adminName: 'Super Admin',
        action: 'APPROVE_DEPOSIT',
        details: `Approved ₹${dep.amount} deposit for ${dep.userName} (${dep.userId}). UTR: ${dep.utrRef}`,
        category: 'FINANCE',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addNotification(
      '✅ Deposit Approved!',
      `₹${dep.amount} has been verified and added to your Main/Deposit wallet.`,
      'deposit',
      dep.userId
    );

    return { success: true, message: `Deposit of ₹${dep.amount} approved and credited.` };
  };

  // Admin Reject Deposit
  const rejectDeposit = (depositId: string, rejectionReason: string, adminId: string = 'USR-ADMIN') => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep) return { success: false, message: 'Deposit record not found.' };

    const updatedDeposits = deposits.map((d) =>
      d.id === depositId
        ? {
            ...d,
            status: 'rejected' as const,
            rejectionReason: rejectionReason || 'Invalid UTR or payment not received.',
            verifiedAt: new Date().toISOString(),
            verifiedBy: 'Super Admin',
          }
        : d
    );
    setDeposits(updatedDeposits);

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId,
        adminName: 'Super Admin',
        action: 'REJECT_DEPOSIT',
        details: `Rejected ₹${dep.amount} deposit for ${dep.userName}. Reason: ${rejectionReason}`,
        category: 'FINANCE',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addNotification(
      '❌ Deposit Rejected',
      `Your ₹${dep.amount} deposit was rejected. Reason: ${rejectionReason}`,
      'deposit',
      dep.userId
    );

    return { success: true, message: 'Deposit rejected successfully.' };
  };

  // Wallet-to-Wallet Transfer with 5% Platform Fee
  const transferMoney = (recipientQuery: string, amount: number) => {
    const num = Number(amount);
    if (isNaN(num) || num < 100 || num > 2000) {
      return { success: false, message: 'Transfer amount must be between ₹100 and ₹2,000.' };
    }

    const senderDepositWallet = currentUser.depositWallet || 0;
    if (senderDepositWallet < num) {
      return {
        success: false,
        message: `Insufficient Main/Deposit Wallet balance! Available: ₹${senderDepositWallet}. Only funds in your Main/Deposit wallet can be transferred to other users.`,
      };
    }

    const cleanQuery = recipientQuery.trim().toLowerCase();
    const recipient = allUsers.find(
      (u) =>
        u.id.toLowerCase() === cleanQuery ||
        u.phone.toLowerCase() === cleanQuery ||
        (u.referralCode && u.referralCode.toLowerCase() === cleanQuery) ||
        u.email.toLowerCase() === cleanQuery
    );

    if (!recipient) {
      return { success: false, message: 'Recipient not found! Please check User ID, Referral Code, or Mobile Number.' };
    }

    if (recipient.id === currentUser.id) {
      return { success: false, message: 'You cannot transfer funds to yourself!' };
    }

    const feePercent = settings.transferFeePercent !== undefined ? settings.transferFeePercent : 5;
    const feeAmount = Math.round(((num * feePercent) / 100) * 100) / 100;
    const recipientCredited = Math.round((num - feeAmount) * 100) / 100;

    // Update sender
    const updatedSenderDeposit = Math.round((senderDepositWallet - num) * 100) / 100;
    const updatedSenderBal = Math.round(
      (updatedSenderDeposit + (currentUser.ticketWallet || 0) + (currentUser.winningWallet || 0)) * 100
    ) / 100;

    const updatedCurrentUser: User = {
      ...currentUser,
      depositWallet: updatedSenderDeposit,
      walletBalance: updatedSenderBal,
    };

    // Update all users (sender and recipient)
    const updatedAll = allUsers.map((u) => {
      if (u.id === currentUser.id) {
        return updatedCurrentUser;
      }
      if (u.id === recipient.id) {
        const recDep = Math.round(((u.depositWallet || 0) + recipientCredited) * 100) / 100;
        const recBal = Math.round((recDep + (u.ticketWallet || 0) + (u.winningWallet || 0)) * 100) / 100;
        return {
          ...u,
          depositWallet: recDep,
          walletBalance: recBal,
        };
      }
      return u;
    });

    setAllUsers(updatedAll);
    setCurrentUser(updatedCurrentUser);

    // Create Transfer Record
    const transferRecord: TransferRecord = {
      id: `TRF-${Math.floor(10000 + Math.random() * 90000)}`,
      senderUserId: currentUser.id,
      senderUserName: currentUser.name,
      recipientUserId: recipient.id,
      recipientUserName: recipient.name,
      amount: num,
      feeAmount: feeAmount,
      recipientAmount: recipientCredited,
      transactionId: `TXN-TRF-${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      sourceWallet: 'depositWallet',
    };
    setTransfers((prev) => [transferRecord, ...prev]);

    // Platform Fee Ledger
    const feeItem: PlatformFeeLedgerItem = {
      id: `FEE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      type: 'transfer_fee',
      amount: feeAmount,
      sourceUserId: currentUser.id,
      referenceId: transferRecord.id,
      createdAt: new Date().toISOString(),
      description: `5% platform transfer fee on ₹${num} transfer to ${recipient.name}`,
    };
    setPlatformFeeLedger((prev) => [feeItem, ...prev]);

    // Audit Log
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId: 'SYSTEM_WALLET',
        adminName: 'Wallet Transfer Engine',
        action: 'WALLET_TRANSFER',
        details: `${currentUser.name} transferred ₹${num} to ${recipient.name}. 5% Platform Fee: ₹${feeAmount}, Credited: ₹${recipientCredited}`,
        category: 'FINANCE',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    // Notifications
    addNotification(
      '💸 Transfer Sent',
      `₹${num} sent to ${recipient.name} (${recipient.id}). Platform fee (5%): ₹${feeAmount}.`,
      'transfer',
      currentUser.id
    );

    addNotification(
      '💰 Money Received!',
      `You received ₹${recipientCredited} from ${currentUser.name} (${currentUser.id}) into your Main/Deposit wallet.`,
      'transfer',
      recipient.id
    );

    soundFx.playNumberCalled();
    return {
      success: true,
      message: `₹${recipientCredited} successfully transferred to ${recipient.name}! (5% Platform fee: ₹${feeAmount})`,
      transfer: transferRecord,
    };
  };

  const transferDepositToTicketWallet = (amount: number) => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      return { success: false, message: 'Please enter a valid amount to transfer.' };
    }
    const currentDep = currentUser.depositWallet || 0;
    if (currentDep < num) {
      return {
        success: false,
        message: `Insufficient Deposit Wallet balance. You have ₹${currentDep} available.`,
      };
    }

    const newDeposit = Math.round((currentDep - num) * 100) / 100;
    const newTicket = Math.round(((currentUser.ticketWallet || 0) + num) * 100) / 100;
    const newTotal = Math.round((newDeposit + newTicket + (currentUser.winningWallet || 0)) * 100) / 100;

    const updatedUser: User = {
      ...currentUser,
      depositWallet: newDeposit,
      ticketWallet: newTicket,
      walletBalance: newTotal,
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    addNotification(
      '🎟️ Ticket Wallet Recharged',
      `₹${num} transferred from Deposit Wallet to Ticket Wallet (0% fee). You can now purchase game tickets!`,
      'transfer',
      currentUser.id
    );

    soundFx.playNumberCalled();
    return {
      success: true,
      message: `₹${num} transferred to Ticket Wallet (0% platform fee). Total Ticket Wallet: ₹${newTicket}`,
    };
  };

  // 3. WITHDRAWAL SYSTEM: Min ₹100, Max ₹2,000 (Strictly from Winnings Wallet)
  const requestWithdrawal = (
    amount: number,
    payoutDetails: {
      payoutType: 'UPI' | 'Bank';
      accountHolderName: string;
      upiId?: string;
      accountNumber?: string;
      ifscCode?: string;
      bankName?: string;
    }
  ) => {
    const num = Number(amount);
    if (isNaN(num) || num < 100 || num > 2000) {
      return { success: false, message: 'Withdrawal amount must be between ₹100 and ₹2,000.' };
    }

    const winningBal = currentUser.winningWallet || 0;
    if (winningBal < num) {
      return {
        success: false,
        message: `Insufficient Winnings Balance! You have ₹${winningBal} in your Winning Wallet. Note: Deposits and bonus wallets cannot be directly withdrawn. Only game winnings are eligible.`,
      };
    }

    if (!payoutDetails.accountHolderName || (!payoutDetails.upiId && (!payoutDetails.accountNumber || !payoutDetails.ifscCode))) {
      return { success: false, message: 'Please provide valid Bank account details or UPI ID.' };
    }

    // Deduct from winningWallet immediately while pending
    const newWinningWallet = Math.round((winningBal - num) * 100) / 100;
    const newBal = Math.round(((currentUser.depositWallet || 0) + (currentUser.ticketWallet || 0) + newWinningWallet) * 100) / 100;

    const updatedUser: User = {
      ...currentUser,
      winningWallet: newWinningWallet,
      walletBalance: newBal,
      totalWithdrawn: Math.round(((currentUser.totalWithdrawn || 0) + num) * 100) / 100,
      bankDetails: {
        accountHolderName: payoutDetails.accountHolderName,
        accountNumber: payoutDetails.accountNumber || '',
        ifscCode: payoutDetails.ifscCode || '',
        bankName: payoutDetails.bankName || '',
        upiId: payoutDetails.upiId || '',
      },
    };

    const newWdr: WithdrawalRecord = {
      id: `WDR-${Math.floor(5000 + Math.random() * 5000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount: num,
      payoutType: payoutDetails.payoutType,
      accountHolderName: payoutDetails.accountHolderName,
      upiId: payoutDetails.upiId,
      accountNumber: payoutDetails.accountNumber,
      ifscCode: payoutDetails.ifscCode,
      bankName: payoutDetails.bankName,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    setWithdrawals((prev) => [newWdr, ...prev]);
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    // Audit Log
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId: 'USER_ACTION',
        adminName: currentUser.name,
        action: 'WITHDRAWAL_REQUESTED',
        details: `Requested ₹${num} payout via ${payoutDetails.payoutType}. Status: PENDING ADMIN APPROVAL`,
        category: 'WITHDRAWAL',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addNotification(
      '⏳ Withdrawal Request Submitted',
      `Your payout request for ₹${num} is under admin review. Payout will be credited within 10-30 mins.`,
      'withdrawal',
      currentUser.id
    );

    return { success: true, message: 'Withdrawal request submitted for Admin review!', withdrawal: newWdr };
  };

  const approveWithdrawal = (withdrawalId: string, adminId: string = 'USR-ADMIN') => {
    const wdr = withdrawals.find((w) => w.id === withdrawalId);
    if (!wdr) return { success: false, message: 'Withdrawal not found.' };

    const updated = withdrawals.map((w) =>
      w.id === withdrawalId
        ? {
            ...w,
            status: 'approved' as const,
            transactionRef: `PAY-WDR-${Math.floor(100000 + Math.random() * 900000)}`,
            processedAt: new Date().toISOString(),
            processedBy: 'Super Admin',
          }
        : w
    );
    setWithdrawals(updated);

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId,
        adminName: 'Super Admin',
        action: 'APPROVE_WITHDRAWAL',
        details: `Approved payout of ₹${wdr.amount} for ${wdr.userName} (${wdr.userId})`,
        category: 'WITHDRAWAL',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addNotification(
      '✅ Withdrawal Approved & Transferred!',
      `₹${wdr.amount} has been successfully transferred to your ${wdr.payoutType} account.`,
      'withdrawal',
      wdr.userId
    );

    return { success: true, message: 'Withdrawal approved successfully.' };
  };

  const rejectWithdrawal = (withdrawalId: string, rejectionReason: string, adminId: string = 'USR-ADMIN') => {
    const wdr = withdrawals.find((w) => w.id === withdrawalId);
    if (!wdr) return { success: false, message: 'Withdrawal not found.' };

    // Refund funds to user's winningWallet
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === wdr.userId) {
          const newWin = Math.round(((u.winningWallet || 0) + wdr.amount) * 100) / 100;
          const newBal = Math.round(((u.depositWallet || 0) + (u.ticketWallet || 0) + newWin) * 100) / 100;
          return {
            ...u,
            winningWallet: newWin,
            walletBalance: newBal,
            totalWithdrawn: Math.max(0, Math.round(((u.totalWithdrawn || 0) - wdr.amount) * 100) / 100),
          };
        }
        return u;
      })
    );

    if (currentUser.id === wdr.userId) {
      setCurrentUser((prev) => {
        const newWin = Math.round(((prev.winningWallet || 0) + wdr.amount) * 100) / 100;
        const newBal = Math.round(((prev.depositWallet || 0) + (prev.ticketWallet || 0) + newWin) * 100) / 100;
        return {
          ...prev,
          winningWallet: newWin,
          walletBalance: newBal,
          totalWithdrawn: Math.max(0, Math.round(((prev.totalWithdrawn || 0) - wdr.amount) * 100) / 100),
        };
      });
    }

    const updated = withdrawals.map((w) =>
      w.id === withdrawalId
        ? {
            ...w,
            status: 'rejected' as const,
            rejectionReason: rejectionReason || 'Account details mismatch.',
            processedAt: new Date().toISOString(),
            processedBy: 'Super Admin',
          }
        : w
    );
    setWithdrawals(updated);

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId,
        adminName: 'Super Admin',
        action: 'REJECT_WITHDRAWAL',
        details: `Rejected ₹${wdr.amount} for ${wdr.userName}. Reason: ${rejectionReason}. Funds refunded to Winning Wallet.`,
        category: 'WITHDRAWAL',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addNotification(
      '❌ Withdrawal Rejected & Refunded',
      `Your ₹${wdr.amount} withdrawal was rejected (${rejectionReason}). Funds have been refunded to your Winning Wallet.`,
      'withdrawal',
      wdr.userId
    );

    return { success: true, message: 'Withdrawal rejected and funds refunded to Winning Wallet.' };
  };

  // 4. TICKET GAMEPLAY COMMISSION ENGINE (Strictly 8-Level 4.6% Total + Direct Income)
  const buyTicket = (
    gameId: string,
    quantity: number = 1,
    customPrice?: number,
    colorTheme?: TicketColorId
  ) => {
    const pricePerTicket = customPrice || settings.defaultTicketPrice || 20;
    const totalCost = pricePerTicket * quantity;

    const availableForTickets = (currentUser.ticketWallet || 0) + (currentUser.depositWallet || 0) + (currentUser.winningWallet || 0);

    if (availableForTickets < totalCost) {
      return {
        success: false,
        message: `Insufficient balance! Total required is ₹${totalCost}, but your available balance is ₹${availableForTickets}. Please deposit money to continue.`,
      };
    }

    // Deduct from Ticket Wallet first, then Deposit Wallet, then Winning Wallet if needed
    let remainingCost = totalCost;
    let newTicketWallet = currentUser.ticketWallet || 0;
    let newDepositWallet = currentUser.depositWallet || 0;
    let newWinningWallet = currentUser.winningWallet || 0;

    if (newTicketWallet >= remainingCost) {
      newTicketWallet = Math.round((newTicketWallet - remainingCost) * 100) / 100;
      remainingCost = 0;
    } else {
      remainingCost = Math.round((remainingCost - newTicketWallet) * 100) / 100;
      newTicketWallet = 0;
    }

    if (remainingCost > 0) {
      if (newDepositWallet >= remainingCost) {
        newDepositWallet = Math.round((newDepositWallet - remainingCost) * 100) / 100;
        remainingCost = 0;
      } else {
        remainingCost = Math.round((remainingCost - newDepositWallet) * 100) / 100;
        newDepositWallet = 0;
      }
    }

    if (remainingCost > 0) {
      newWinningWallet = Math.round((newWinningWallet - remainingCost) * 100) / 100;
      remainingCost = 0;
    }

    const newTotalBalance = Math.round((newTicketWallet + newDepositWallet + newWinningWallet) * 100) / 100;

    const updatedUser: User = {
      ...currentUser,
      ticketWallet: newTicketWallet,
      depositWallet: newDepositWallet,
      winningWallet: newWinningWallet,
      walletBalance: newTotalBalance,
    };

    // Calculate 8-Level Referral Commissions & Direct Income
    const newCommissionLedgerEntries: CommissionLedgerItem[] = [];
    const uplineCommissions = new Map<string, number>();
    const uplineDirectIncome = new Map<string, number>();

    let currentUplineCode = currentUser.referredBy;
    let currentLevel = 1;

    const usersById = new Map<string, User>(allUsers.map((u) => [u.id, u]));
    const usersByCode = new Map<string, User>(
      allUsers.map((u) => [(u.referralCode || '').trim().toUpperCase(), u])
    );

    // Direct Income bonus for Level 1 referrer if enabled
    if (settings.directIncomeEnabled && settings.directIncomePercent > 0 && currentUplineCode) {
      const cleanCode = currentUplineCode.trim().toUpperCase();
      const directParent = usersByCode.get(cleanCode) || usersById.get(currentUplineCode);
      if (directParent && directParent.id !== currentUser.id) {
        const directInc = Math.round(((totalCost * settings.directIncomePercent) / 100) * 100) / 100;
        if (directInc > 0) {
          uplineDirectIncome.set(directParent.id, directInc);
          newCommissionLedgerEntries.push({
            id: `DIR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            type: 'direct_income',
            sourceUserId: currentUser.id,
            sourceUserName: currentUser.name,
            targetUserId: directParent.id,
            targetUserName: directParent.name,
            gameId,
            ticketId: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
            ticketPrice: pricePerTicket,
            quantity,
            level: 1,
            percent: settings.directIncomePercent,
            amount: directInc,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Traverse uplines up to 8 levels (4.6% Total)
    if (settings.commissionEnabled && settings.commissionOnlyOnTicketGameplay) {
      while (currentUplineCode && currentLevel <= 8) {
        const cleanCode = currentUplineCode.trim().toUpperCase();
        const parent = usersByCode.get(cleanCode) || usersById.get(currentUplineCode);

        if (!parent || parent.id === currentUser.id) break;

        const lvlConfig = settings.referralLevels.find((l) => l.level === currentLevel);
        const percent = lvlConfig ? lvlConfig.percent : 0;
        const commission = Math.round(((totalCost * percent) / 100) * 100) / 100;

        if (commission > 0) {
          const existingComm = uplineCommissions.get(parent.id) || 0;
          uplineCommissions.set(parent.id, Math.round((existingComm + commission) * 100) / 100);

          newCommissionLedgerEntries.push({
            id: `COM-${Date.now()}-${currentLevel}-${Math.floor(100 + Math.random() * 900)}`,
            type: 'level_commission',
            sourceUserId: currentUser.id,
            sourceUserName: currentUser.name,
            targetUserId: parent.id,
            targetUserName: parent.name,
            gameId,
            ticketId: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
            ticketPrice: pricePerTicket,
            quantity,
            level: currentLevel,
            percent,
            amount: commission,
            createdAt: new Date().toISOString(),
          });
        }

        currentUplineCode = parent.referredBy;
        currentLevel++;
      }
    }

    // Update all users in state
    const updatedAllUsers = allUsers.map((u) => {
      let depWallet = u.id === currentUser.id ? updatedUser.depositWallet : (u.depositWallet || 0);
      let tickWallet = u.id === currentUser.id ? updatedUser.ticketWallet : (u.ticketWallet || 0);
      let winWallet = u.id === currentUser.id ? updatedUser.winningWallet : (u.winningWallet || 0);
      let refEarnings = u.referralEarnings || 0;
      let dirEarnings = u.directIncomeEarnings || 0;

      const comm = uplineCommissions.get(u.id);
      if (comm && comm > 0) {
        depWallet = Math.round((depWallet + comm) * 100) / 100;
        refEarnings = Math.round((refEarnings + comm) * 100) / 100;
      }

      const dir = uplineDirectIncome.get(u.id);
      if (dir && dir > 0) {
        depWallet = Math.round((depWallet + dir) * 100) / 100;
        dirEarnings = Math.round((dirEarnings + dir) * 100) / 100;
      }

      const totBal = Math.round((depWallet + tickWallet + winWallet) * 100) / 100;

      return {
        ...u,
        depositWallet: depWallet,
        ticketWallet: tickWallet,
        winningWallet: winWallet,
        walletBalance: totBal,
        referralEarnings: refEarnings,
        directIncomeEarnings: dirEarnings,
      };
    });

    setAllUsers(updatedAllUsers);
    const activeUpdated = updatedAllUsers.find((u) => u.id === currentUser.id) || updatedUser;
    setCurrentUser(activeUpdated);

    if (newCommissionLedgerEntries.length > 0) {
      setCommissionLedger((prev) => [...newCommissionLedgerEntries, ...prev]);
    }

    // Create tickets with chosen or random colourful theme
    const targetGame = upcomingGames.find((g) => g.id === gameId) || activeLiveGame;
    const generated: TambolaTicket[] = [];
    for (let i = 0; i < quantity; i++) {
      const ticketNum = Math.floor(10000 + Math.random() * 90000);
      const chosenColor = colorTheme || getRandomTicketColor();
      const ticket = createNewTicket(
        gameId,
        currentUser.id,
        currentUser.name,
        `TKT-${ticketNum}`,
        pricePerTicket,
        chosenColor,
        targetGame.startTime
      );
      ticket.ticketNumber = ticketNum;
      ticket.ticketPrice = pricePerTicket;
      generated.push(ticket);
    }

    setMyTickets((prev) => [...generated, ...prev]);
    generated.forEach((t) => syncTicketToFirestore(t));
    syncUserToFirestore(activeUpdated);

    // Update game sales & stats
    setUpcomingGames((prev) =>
      prev.map((g) =>
        g.id === gameId
          ? {
              ...g,
              ticketsSoldCount: g.ticketsSoldCount + quantity,
              totalTicketSales: g.totalTicketSales + totalCost,
              prizePool: Math.round((g.totalTicketSales + totalCost) * 0.7),
            }
          : g
      )
    );

    soundFx.playNumberCalled();
    return {
      success: true,
      message: `Successfully purchased ${quantity} colourful Tambola ticket(s) for ₹${totalCost}!`,
      tickets: generated,
    };
  };

  // Free Ticket Usage
  const useFreeTicketToBuy = (gameId: string, freeTicketWinnerId: string) => {
    if (currentUser.freeTicketsAvailable <= 0) {
      return { success: false, message: 'No free tickets available in your inventory.' };
    }

    const ftWinner = freeTicketWinners.find((f) => f.id === freeTicketWinnerId);
    if (!ftWinner || ftWinner.status === 'used') {
      return { success: false, message: 'This free ticket voucher has already been redeemed.' };
    }

    // Mark free ticket used
    setFreeTicketWinners((prev) =>
      prev.map((f) => (f.id === freeTicketWinnerId ? { ...f, status: 'used' as const } : f))
    );

    const updatedUser: User = {
      ...currentUser,
      freeTicketsAvailable: Math.max(0, currentUser.freeTicketsAvailable - 1),
    };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    const ticketNum = Math.floor(10000 + Math.random() * 90000);
    const freeTicket = createNewTicket(gameId, currentUser.id, currentUser.name, `TKT-FREE-${ticketNum}`);
    freeTicket.ticketNumber = ticketNum;
    freeTicket.ticketPrice = 0;
    freeTicket.isCustom = true;

    setMyTickets((prev) => [freeTicket, ...prev]);

    soundFx.playNumberCalled();
    return { success: true, message: 'Free Ticket voucher redeemed successfully!', ticket: freeTicket };
  };

  // Generate Custom Ticket
  const generateCustomTicket = (gameId: string = 'AT-1025', price: number = 20) => {
    const ticketNum = Math.floor(10000 + Math.random() * 90000);
    const customTicket = createNewTicket(gameId, currentUser.id, currentUser.name, `TKT-CUST-${ticketNum}`);
    customTicket.isCustom = true;
    customTicket.ticketNumber = ticketNum;
    customTicket.ticketPrice = price;

    setMyTickets((prev) => [customTicket, ...prev]);
    soundFx.playNumberCalled();
    return customTicket;
  };

  // Toggle Mark on Ticket
  const toggleMarkNumberOnTicket = (ticketId: string, num: number) => {
    setMyTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const exists = t.markedNumbers.includes(num);
        const updatedMarks = exists
          ? t.markedNumbers.filter((n) => n !== num)
          : [...t.markedNumbers, num];
        return { ...t, markedNumbers: updatedMarks };
      })
    );
    soundFx.playNumberCalled();
  };

  // 7. WINNER SYSTEM: Verify pattern on server, award prize, broadcast live
  const claimPrizeWithPattern = (ticketId: string, patternCode: WinningPatternCode) => {
    const ticket = myTickets.find((t) => t.id === ticketId);
    if (!ticket) {
      return { success: false, message: 'Ticket not found in your account.' };
    }

    const prizeCategory = prizes.find((p) => p.code === patternCode && p.isEnabled);
    if (!prizeCategory) {
      return { success: false, message: 'This prize category is not active in this game.' };
    }

    // Check anti-duplicate claim
    const alreadyClaimed = prizeCategory.claimedBy && prizeCategory.claimedBy.length >= (prizeCategory.winnerCount || 1);
    if (alreadyClaimed) {
      return { success: false, message: `The prize for ${prizeCategory.name} has already been claimed by another player.` };
    }

    // Server-Side Verification against ticket grid and called numbers
    const verification = verifyWinningClaim(
      ticket.grid,
      ticket.markedNumbers,
      liveCalledNumbers,
      patternCode
    );

    if (!verification.isValid) {
      return { success: false, message: `Claim rejected: ${verification.reason}` };
    }

    // Claim is valid! Credit prize amount to user's Winning Wallet
    const prizeAmount = prizeCategory.amount || 25;
    const newWinningWallet = Math.round(((currentUser.winningWallet || 0) + prizeAmount) * 100) / 100;
    const newBal = Math.round(((currentUser.depositWallet || 0) + (currentUser.ticketWallet || 0) + newWinningWallet) * 100) / 100;

    const updatedUser: User = {
      ...currentUser,
      winningWallet: newWinningWallet,
      walletBalance: newBal,
      gameWinnings: Math.round(((currentUser.gameWinnings || 0) + prizeAmount) * 100) / 100,
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    // Add entry to Prize Ledger
    const targetGame = upcomingGames.find((g) => g.id === ticket.gameId) || activeLiveGame;
    const newPrizeLedgerItem: PrizeLedgerItem = {
      id: `PRZ-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      gameId: ticket.gameId,
      gameTitle: targetGame?.title || 'Live Tambola Game',
      userId: currentUser.id,
      userName: currentUser.name,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      prizeCategory: prizeCategory.name,
      amount: prizeAmount,
      claimedAt: new Date().toISOString(),
    };
    setPrizeLedger((prev) => [newPrizeLedgerItem, ...prev]);

    // Mark prize category as claimed
    const claimRecord = {
      userId: currentUser.id,
      userName: currentUser.name,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      claimedAt: new Date().toISOString(),
    };

    const updatedPrizes = prizes.map((p) => {
      if (p.id === prizeCategory.id) {
        return {
          ...p,
          claimedBy: [...(p.claimedBy || []), claimRecord],
        };
      }
      return p;
    });
    setPrizes(updatedPrizes);

    // Add to Live Winners Board
    const newWinner: WinnerItem = {
      id: `WIN-${Date.now()}`,
      winnerName: currentUser.name,
      userId: currentUser.id,
      gameId: ticket.gameId,
      ticketNumber: ticket.ticketNumber,
      prizeCategory: prizeCategory.name,
      prizeAmount,
      date: 'Just Now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
      city: currentUser.stateOfResidence || 'India',
    };
    setWinners((prev) => [newWinner, ...prev]);
    recordWinnerToFirestore(newWinner);
    syncUserToFirestore(updatedUser);

    // Add notification
    addNotification(
      `🏆 PRIZE CLAIM CONFIRMED: ₹${prizeAmount}!`,
      `Congratulations! You won ₹${prizeAmount} for ${prizeCategory.name} on Ticket #${ticket.ticketNumber}.`,
      'winner',
      currentUser.id
    );

    // Flash winner announcement
    setActiveWinnerFlash({
      userName: currentUser.name,
      userId: currentUser.id,
      ticketNumber: ticket.ticketNumber,
      prizeName: prizeCategory.name,
      prizeAmount,
    });

    triggerConfetti();

    return {
      success: true,
      message: `🎉 BINGO! Claim Verified: You won ₹${prizeAmount} for ${prizeCategory.name}!`,
      prizeAmount,
      categoryName: prizeCategory.name,
    };
  };

  // 8. FIVE FREE TICKET WINNERS ENGINE
  const drawFreeTicketWinnersForGame = (gameId: string) => {
    const targetGame = upcomingGames.find((g) => g.id === gameId) || activeLiveGame;
    const candidates = allUsers.filter((u) => u.role !== 'admin');
    const winnersList: FreeTicketWinner[] = [];

    // Shuffle and pick 5 users
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    selected.forEach((u, idx) => {
      const ticketNum = Math.floor(10000 + Math.random() * 90000);
      const freeTicket: FreeTicketWinner = {
        id: `FT-${Date.now().toString().slice(-5)}-${idx + 1}`,
        gameId: targetGame.id,
        gameTitle: targetGame.title,
        userId: u.id,
        userName: u.name,
        ticketNumber: ticketNum,
        wonAt: new Date().toISOString(),
        status: 'available',
        freeTicketCode: `FREE-${targetGame.id}-${u.id}`,
      };
      winnersList.push(freeTicket);
    });

    setFreeTicketWinners((prev) => [...winnersList, ...prev]);

    // Give each selected user +1 free ticket balance
    setAllUsers((prev) =>
      prev.map((u) => {
        if (selected.some((s) => s.id === u.id)) {
          return { ...u, freeTicketsAvailable: (u.freeTicketsAvailable || 0) + 1 };
        }
        return u;
      })
    );

    if (selected.some((s) => s.id === currentUser.id)) {
      setCurrentUser((prev) => ({
        ...prev,
        freeTicketsAvailable: (prev.freeTicketsAvailable || 0) + 1,
      }));
    }

    // Audit Log
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId: 'SYSTEM_RNG',
        adminName: 'Free Ticket Engine',
        action: 'FREE_TICKETS_DRAW',
        details: `Selected 5 free ticket winners for ${targetGame.title} (${targetGame.id})`,
        category: 'PRIZE',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    addNotification(
      '🎟️ 5 Free Ticket Winners Announced!',
      `Lucky draw results for ${targetGame.title} are now live. Check your inventory!`,
      'freeticket',
      'all'
    );

    return {
      success: true,
      winners: winnersList,
      message: '5 Lucky Free Ticket Winners drawn successfully!',
    };
  };

  // 9. LIVE CALLER ENGINE & INSTANT TICKET MARKING
  // Automatic Instant Ticket Marking for all user tickets
  useEffect(() => {
    if (liveCalledNumbers.length === 0) return;
    setMyTickets((prev) =>
      prev.map((t) => {
        const numbersInGrid = t.grid.flat().filter((n) => n > 0);
        const shouldBeMarked = numbersInGrid.filter((n) => liveCalledNumbers.includes(n));
        const newMarked = Array.from(new Set([...t.markedNumbers, ...shouldBeMarked]));
        if (newMarked.length !== t.markedNumbers.length) {
          return {
            ...t,
            markedNumbers: newMarked,
          };
        }
        return t;
      })
    );
  }, [liveCalledNumbers]);

  const callNextNumber = () => {
    if (liveCalledNumbers.length >= 90) {
      setIsGameCalling(false);
      return null;
    }

    const available: number[] = [];
    for (let i = 1; i <= 90; i++) {
      if (!liveCalledNumbers.includes(i)) {
        available.push(i);
      }
    }

    if (available.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * available.length);
    const nextNum = available[randomIndex];

    const updatedCalled = [...liveCalledNumbers, nextNum];
    setLiveCalledNumbers(updatedCalled);
    setCurrentCalledNumber(nextNum);

    // Play sound & TTS speech voice
    soundFx.playNumberCalled();
    speakNumber(nextNum);

    return nextNum;
  };

  const callSpecificNumber = (num: number) => {
    const n = Number(num);
    if (isNaN(n) || n < 1 || n > 90) {
      return { success: false, message: 'Please select a valid number between 1 and 90.' };
    }
    if (liveCalledNumbers.includes(n)) {
      return { success: false, message: `Number ${n} has already been called!` };
    }

    const updatedCalled = [...liveCalledNumbers, n];
    setLiveCalledNumbers(updatedCalled);
    setCurrentCalledNumber(n);

    soundFx.playNumberCalled();
    speakNumber(n);

    return {
      success: true,
      message: `Number ${n} called and broadcast to all tickets!`,
      number: n,
    };
  };

  const undoLastNumber = () => {
    if (liveCalledNumbers.length === 0) {
      return { success: false, message: 'No numbers called to undo.' };
    }
    const undoneNum = liveCalledNumbers[liveCalledNumbers.length - 1];
    const newCalled = liveCalledNumbers.slice(0, -1);
    setLiveCalledNumbers(newCalled);
    setCurrentCalledNumber(newCalled.length > 0 ? newCalled[newCalled.length - 1] : null);

    // Unmark undone number from all tickets
    setMyTickets((prev) =>
      prev.map((t) => ({
        ...t,
        markedNumbers: t.markedNumbers.filter((n) => n !== undoneNum),
      }))
    );

    return {
      success: true,
      message: `Undid number ${undoneNum}.`,
      undoneNumber: undoneNum,
    };
  };

  const startLiveCaller = () => {
    setIsGameCalling(true);
  };

  const pauseLiveCaller = () => {
    setIsGameCalling(false);
  };

  const resetLiveGame = () => {
    setLiveCalledNumbers([]);
    setCurrentCalledNumber(null);
    setIsGameCalling(false);
    // Reset prize claims
    setPrizes((prev) => prev.map((p) => ({ ...p, claimedBy: [] })));
  };

  // Automatic Game Caller Loop
  useEffect(() => {
    let interval: any = null;
    if (isGameCalling) {
      interval = setInterval(() => {
        setLiveCalledNumbers((prev) => {
          if (prev.length >= 90) {
            setIsGameCalling(false);
            return prev;
          }
          const available: number[] = [];
          for (let i = 1; i <= 90; i++) {
            if (!prev.includes(i)) available.push(i);
          }
          if (available.length === 0) {
            setIsGameCalling(false);
            return prev;
          }
          const next = available[Math.floor(Math.random() * available.length)];
          setCurrentCalledNumber(next);
          soundFx.playNumberCalled();
          speakNumber(next);
          return [...prev, next];
        });
      }, 4000); // Calls number every 4 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameCalling, speechCallerEnabled]);

  // 15. Create Game with 70% Prize Pool Validator Check
  const createGame = (gameData: Partial<GameItem>) => {
    const totalSales = (gameData.maxPlayers || 100) * (gameData.ticketPrice || 20);
    const validation = validatePrizePool(totalSales, prizes);

    const newGame: GameItem = {
      id: `AT-${Math.floor(1030 + Math.random() * 900)}`,
      title: gameData.title || 'Super Bumper Room',
      gameType: gameData.gameType || 'Classic',
      startTime: gameData.startTime || new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      ticketPrice: gameData.ticketPrice || 20,
      prizePool: validation.maxPrizePool70,
      totalTicketSales: totalSales,
      maxPlayers: gameData.maxPlayers || 100,
      playersCount: 0,
      ticketsSoldCount: 0,
      status: 'upcoming',
      calledNumbers: [],
      currentNumber: null,
      prizeCategories: prizes,
      freeTicketWinners: [],
      canStart: validation.isValid,
      prizePoolValidation: validation,
    };

    setUpcomingGames((prev) => [newGame, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        adminId: 'USR-ADMIN',
        adminName: 'Super Admin',
        action: 'CREATE_GAME',
        details: `Created ${newGame.title} (Ticket: ₹${newGame.ticketPrice}, Prize Pool: ₹${newGame.prizePool})`,
        category: 'GAME',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    return { success: true, message: 'New Game created successfully!', game: newGame };
  };

  const updateGameStatus = (gameId: string, status: GameItem['status']) => {
    setUpcomingGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, status } : g))
    );
    if (activeLiveGame.id === gameId) {
      setActiveLiveGame((prev) => ({ ...prev, status }));
    }
  };

  const validateGamePrizePool = (sales: number, prizeList: PrizeCategory[]) => {
    return validatePrizePool(sales, prizeList);
  };

  // CMS & Admin Controls
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updatePrizes = (newPrizes: PrizeCategory[]) => {
    setPrizes(newPrizes);
    setSettings((prev) => ({ ...prev, prizeCategoriesList: newPrizes }));
  };

  const toggleTicketPrice = (price: number, enabled: boolean) => {
    const updated = availableTicketPrices.map((t) => (t.price === price ? { ...t, isEnabled: enabled } : t));
    setAvailableTicketPrices(updated);
    setSettings((prev) => ({ ...prev, availableTicketPrices: updated }));
  };

  const addTicketPriceOption = (option: TicketPriceOption) => {
    const updated = [...availableTicketPrices, option];
    setAvailableTicketPrices(updated);
    setSettings((prev) => ({ ...prev, availableTicketPrices: updated }));
  };

  const toggleBlockUser = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
  };

  const verifyUserKyc = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isKycVerified: true } : u))
    );
  };

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'system',
    userId: string = 'all'
  ) => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <TambolaContext.Provider
      value={{
        currentUser,
        allUsers,
        settings,
        prizes,
        upcomingGames,
        winners,
        myTickets,
        activeLiveGame,
        liveCalledNumbers,
        currentCalledNumber,
        isGameCalling,
        downlineStats,
        isSoundMuted,
        complianceAgreed,
        speechCallerEnabled,

        deposits,
        withdrawals,
        transfers,
        commissionLedger,
        platformFeeLedger,
        prizeLedger,
        freeTicketWinners,
        notifications,
        auditLogs,
        availableTicketPrices,
        activeWinnerFlash,
        dismissWinnerFlash,

        activeModal,
        selectedGameForPurchase,
        userDashboardTab,

        setActiveModal,
        setUserDashboardTab,
        openUserDashboard,
        setSelectedGameForPurchase,
        setCurrentUser,
        switchUser,
        registerUser,
        loginUser,
        logoutUser,
        toggleSound,
        toggleSpeechCaller,
        setComplianceAgreed,
        triggerConfetti,

        depositMoney,
        submitManualDeposit,
        approveDeposit,
        rejectDeposit,
        transferMoney,
        transferDepositToTicketWallet,
        requestWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        saveBankDetails,

        buyTicket,
        useFreeTicketToBuy,
        generateCustomTicket,
        toggleMarkNumberOnTicket,
        claimPrizeWithPattern,

        startLiveCaller,
        pauseLiveCaller,
        callNextNumber,
        callSpecificNumber,
        undoLastNumber,
        resetLiveGame,
        createGame,
        updateGameStatus,
        validateGamePrizePool,
        drawFreeTicketWinnersForGame,

        updateSettings,
        updatePrizes,
        toggleTicketPrice,
        addTicketPriceOption,
        toggleBlockUser,
        verifyUserKyc,
        addNotification,
        markNotificationAsRead,
      }}
    >
      {children}
    </TambolaContext.Provider>
  );
};

export const useTambola = () => {
  const context = useContext(TambolaContext);
  if (!context) {
    throw new Error('useTambola must be used within a TambolaProvider');
  }
  return context;
};
