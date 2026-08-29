export type TicketColorId =
  | 'green'
  | 'blue'
  | 'yellow'
  | 'red'
  | 'pink'
  | 'orange'
  | 'purple'
  | 'sky_blue'
  | 'gold'
  | 'rainbow'
  | 'emerald'
  | 'sapphire'
  | 'amber'
  | 'crimson'
  | 'neon_pink'
  | 'sunset_orange'
  | 'royal_purple'
  | 'jade';

export interface TicketStyleConfig {
  id: TicketColorId;
  name: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  headerGradient: string;
  accentColor: string;
  cellBg: string;
  cellBorder: string;
  cellText: string;
  cellActiveGradient: string;
  badgeBg: string;
  isEnabled: boolean;
}

export interface TambolaTicket {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  ticketNumber: number;
  ticketPrice: number;
  grid: (number | null)[][]; // 3 rows x 9 columns
  markedNumbers: number[];
  qrCodeUrl?: string;
  createdAt: string;
  isCustom?: boolean;
  status?: 'active' | 'won' | 'completed';
  wonPrizes?: string[];
  colorTheme?: TicketColorId;
  gameStartTime?: string;
  verificationCode?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  passwordHash?: string;
  referralCode: string;
  referredBy: string | null;
  // 3 Separate Wallets
  depositWallet: number; // Main/Deposit wallet (approved deposits, add money)
  ticketWallet: number; // For ticket purchases & User-to-User transfers ONLY (cannot withdraw)
  winningWallet: number; // Winnings from verified claims (eligible for withdrawal)
  walletBalance: number; // Total eligible funds
  referralEarnings: number;
  directIncomeEarnings: number;
  gameWinnings: number;
  totalDeposited: number;
  totalWithdrawn: number;
  freeTicketsAvailable: number;
  role: 'user' | 'admin' | 'superadmin';
  adminPin?: string;
  twoFactorEnabled?: boolean;
  createdAt: string;
  ageVerified: boolean;
  stateOfResidence: string;
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
  };
  isBlocked?: boolean;
  isKycVerified?: boolean;
}

export interface AuthSession {
  token: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: 'user' | 'admin' | 'superadmin';
  expiresAt: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  redirect?: string;
  error?: string;
}

export interface TransferRecord {
  id: string;
  senderUserId: string;
  senderUserName: string;
  recipientUserId: string;
  recipientUserName: string;
  amount: number;
  feeAmount: number; // 5%
  recipientAmount: number; // 95%
  status: 'completed' | 'failed';
  transactionId: string;
  createdAt: string;
  sourceWallet: 'ticketWallet' | 'depositWallet';
  destinationWallet?: 'ticketWallet';
}

export interface PlatformFeeLedgerItem {
  id: string;
  type: 'transfer_fee' | 'platform_margin' | 'game_rake';
  amount: number;
  sourceUserId: string;
  referenceId: string;
  createdAt: string;
  description: string;
}

export interface PrizeLedgerItem {
  id: string;
  gameId: string;
  gameTitle: string;
  userId: string;
  userName: string;
  ticketId: string;
  ticketNumber: number;
  prizeCategory: string;
  amount: number;
  claimedAt: string;
}

export interface ReferralLevelConfig {
  level: number;
  percent: number;
}

export interface LevelMember {
  user: User;
  level: number;
  ticketsBought: number;
  totalSpent: number;
  commissionEarned: number;
}

export interface ReferralDownlineStats {
  referralCode: string;
  referralLink: string;
  directMembersCount: number;
  totalTeamCount: number;
  totalReferralIncome: number;
  directIncomeTotal: number;
  levelStats: {
    level: number;
    percent: number;
    membersCount: number;
    totalEarnings: number;
    members: LevelMember[];
  }[];
}

export interface DepositRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentMethod: 'UPI' | 'QR' | 'NetBanking';
  transactionId: string;
  utrRef: string;
  status: 'completed' | 'pending' | 'approved' | 'rejected';
  paymentScreenshotUrl?: string;
  adminApprovedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface WithdrawalRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  payoutType: 'UPI' | 'Bank';
  accountHolderName: string;
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  transactionRef?: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface CommissionLedgerItem {
  id: string;
  type: 'level_commission' | 'direct_income';
  sourceUserId: string;
  sourceUserName: string;
  targetUserId: string;
  targetUserName: string;
  gameId: string;
  ticketId: string;
  ticketPrice: number;
  quantity: number;
  level: number;
  percent: number;
  amount: number; // 2 decimal rounded
  createdAt: string;
}

export interface FreeTicketWinner {
  id: string;
  gameId: string;
  gameTitle: string;
  userId: string;
  userName: string;
  ticketNumber: number;
  wonAt: string;
  status: 'available' | 'used';
  freeTicketCode: string;
}

export interface TicketPriceOption {
  price: number;
  label: string;
  isEnabled: boolean;
  description: string;
}

export type WinningPatternCode =
  | 'STAR'
  | 'EARLY5'
  | 'TOPLINE'
  | 'MIDDLELINE'
  | 'BOTTOMLINE'
  | 'FULLHOUSE1'
  | 'FULLHOUSE2'
  | 'FULLHOUSE3'
  | 'CUSTOM';

export interface PrizeCategory {
  id: string;
  name: string;
  code: WinningPatternCode;
  hindiName: string;
  icon: string;
  color: string;
  gradient: string;
  amount: number;
  winnerCount: number;
  winningPattern: WinningPatternCode;
  priority: number;
  isEnabled: boolean;
  description: string;
  claimedBy?: {
    userId: string;
    userName: string;
    ticketId: string;
    ticketNumber: number;
    claimedAt: string;
  }[];
}

export interface GameItem {
  id: string;
  title: string;
  gameType: 'Classic' | 'Speed 90' | 'Mega Jackpot' | 'Bumper Night';
  startTime: string; // ISO string
  endTime?: string;
  saleStartTime?: string;
  saleEndTime?: string;
  ticketPrice: number;
  prizePool: number; // Max 70% of ticket sales
  totalTicketSales: number;
  maxPlayers: number;
  maxTickets?: number;
  playersCount: number;
  ticketsSoldCount: number;
  ticketColorMode?: 'random' | TicketColorId;
  status: 'live' | 'upcoming' | 'scheduled' | 'ticket_sale_open' | 'starting_soon' | 'completed' | 'paused' | 'cancelled';
  calledNumbers: number[];
  currentNumber: number | null;
  prizeCategories: PrizeCategory[];
  freeTicketWinners: FreeTicketWinner[];
  canStart?: boolean;
  prizePoolValidation?: PrizePoolValidationResult;
}

export interface PrizePoolValidationResult {
  totalSales: number;
  maxPrizePool70: number;
  totalConfiguredPrizes: number;
  remainingPrizePool: number;
  commissionAmount: number;
  platformAmount: number;
  isValid: boolean;
  errorMessage?: string;
}

export interface WinnerItem {
  id: string;
  winnerName: string;
  userId: string;
  gameId: string;
  ticketNumber: number;
  prizeCategory: string;
  prizeAmount: number;
  date: string;
  avatar: string;
  city: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // 'all' or specific user ID
  title: string;
  message: string;
  type: 'deposit' | 'withdrawal' | 'game' | 'winner' | 'commission' | 'freeticket' | 'system' | 'transfer';
  isRead: boolean;
  createdAt: string;
  linkModal?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  category: 'GAME' | 'WITHDRAWAL' | 'PRIZE' | 'USER' | 'SYSTEM' | 'FINANCE' | 'DEPOSIT' | 'TRANSFER';
  createdAt: string;
}

export interface SiteSettings {
  websiteName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroButton1: string;
  heroButton2: string;
  liveGameId: string;
  livePlayersCount: number;
  liveTicketsSold: number;
  livePrizePool: number;
  defaultTicketPrice: number;
  availableTicketPrices: TicketPriceOption[];
  // Deposit and Withdrawal settings
  minDeposit: number; // 100
  maxDeposit: number; // 2000
  depositMultiplesOf: number; // 100
  minWithdrawal: number; // 100
  maxWithdrawal: number; // 2000
  upiQrCodeUrl: string;
  adminUpiId: string;
  adminAccountDetails: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
  };
  // Wallet to Wallet Transfer Settings
  transferFeePercent: number; // 5%
  transferEnabled: boolean;
  transferMinAmount: number; // 100
  transferMaxAmount: number; // 2000
  // Ticket Design & Colors
  ticketColorThemes: TicketStyleConfig[];
  randomColorMode: boolean;
  activeTicketTemplate: string;
  ticketHeaderTitle: string;
  ticketFooterText: string;
  ticketLogoUrl: string;
  // Prize Categories Config
  prizes: {
    star: number;
    earlyFive: number;
    topLine: number;
    middleLine: number;
    bottomLine: number;
    fullHouse1: number;
    fullHouse2: number;
    fullHouse3: number;
  };
  prizeCategoriesList: PrizeCategory[];
  // Commission settings
  commissionEnabled: boolean;
  commissionOnlyOnTicketGameplay: boolean;
  depositCommissionEnabled: boolean;
  withdrawalCommissionEnabled: boolean;
  directIncomeEnabled: boolean;
  directIncomePercent: number; // e.g. 1.0%
  referralLevels: ReferralLevelConfig[];
  // Free Ticket Settings
  freeTicketsPerGame: number; // default 5
  // Platform & UI
  announcements: string[];
  maintenanceMode: boolean;
  maintenanceMessage: string;
  notificationsEnabled: {
    inApp: boolean;
    ticketPurchase: boolean;
    gameStart: boolean;
    winner: boolean;
    withdrawal: boolean;
    commission: boolean;
    freeTicket: boolean;
  };
  socialLinks: {
    whatsapp: string;
    telegram: string;
    youtube: string;
    instagram: string;
    facebook: string;
  };
  supportContact: {
    phone: string;
    email: string;
    timing: string;
  };
  termsAndConditions: string;
  privacyPolicy: string;
  responsibleGamingNotice: string;
}

export type DashboardTab =
  | 'dashboard'
  | 'profile'
  | 'mainWallet'
  | 'ticketWallet'
  | 'winningWallet'
  | 'wallet'
  | 'deposit'
  | 'withdraw'
  | 'transfer'
  | 'buyTicket'
  | 'myTickets'
  | 'liveGames'
  | 'winners'
  | 'gameHistory'
  | 'referral'
  | 'commission'
  | 'directIncome'
  | 'freeTickets'
  | 'notifications'
  | 'transactions'
  | 'support'
  | 'terms'
  | 'security'
  | 'logout';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'games'
  | 'tickets'
  | 'liveGameControl'
  | 'numberControl'
  | 'winners'
  | 'freeTicketWinners'
  | 'deposits'
  | 'withdrawals'
  | 'wallets'
  | 'transfers'
  | 'referrals'
  | 'commission'
  | 'directIncome'
  | 'prizes'
  | 'ticketDesign'
  | 'payments'
  | 'notifications'
  | 'reports'
  | 'settings'
  | 'security'
  | 'auditLogs';
