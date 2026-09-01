import {
  ReferralDownlineStats,
  ReferralLevelConfig,
  User,
  LevelMember,
  PrizePoolValidationResult,
  PrizeCategory,
  WinningPatternCode,
} from '../types/tambola';

/**
 * 8-Level Referral Commission Engine (4.6% Total):
 * Level 1 (Direct): 2.0%
 * Level 2: 1.0%
 * Level 3: 0.5%
 * Level 4: 0.4%
 * Level 5: 0.3%
 * Level 6: 0.2%
 * Level 7: 0.1%
 * Level 8: 0.1%
 * Rule: Commission is generated strictly on ticket gameplay transactions with 2-decimal rounding.
 */
export const DEFAULT_REFERRAL_LEVELS: ReferralLevelConfig[] = [
  { level: 1, percent: 2.0 },
  { level: 2, percent: 1.0 },
  { level: 3, percent: 0.5 },
  { level: 4, percent: 0.4 },
  { level: 5, percent: 0.3 },
  { level: 6, percent: 0.2 },
  { level: 7, percent: 0.1 },
  { level: 8, percent: 0.1 },
];

/**
 * FINANCIAL RULE: 70% Maximum Prize Pool Validator
 * Total Eligible Ticket Sales x 70% = Maximum Cash Prize Pool
 * E.g., If total ticket sales = ₹1,000, Max Prize Pool = ₹700.
 * If total configured prizes > 70% Prize Pool, game must NOT start.
 */
export function validatePrizePool(
  totalSales: number,
  prizeCategories: PrizeCategory[]
): PrizePoolValidationResult {
  const maxPrizePool70 = Math.round(totalSales * 0.7 * 100) / 100;
  const enabledPrizes = prizeCategories.filter((p) => p.isEnabled);
  const totalConfiguredPrizes = enabledPrizes.reduce(
    (sum, p) => sum + (p.amount || 0) * (p.winnerCount || 1),
    0
  );
  const remainingPrizePool = Math.round((maxPrizePool70 - totalConfiguredPrizes) * 100) / 100;
  // Standard 8-level commission total: 4.6%
  const commissionAmount = Math.round(totalSales * 0.046 * 100) / 100;
  // Platform retention
  const platformAmount = Math.round((totalSales - maxPrizePool70 - commissionAmount) * 100) / 100;

  const isValid = totalConfiguredPrizes <= maxPrizePool70;

  return {
    totalSales,
    maxPrizePool70,
    totalConfiguredPrizes,
    remainingPrizePool,
    commissionAmount,
    platformAmount,
    isValid,
    errorMessage: isValid
      ? undefined
      : `PRIZE CONFIGURATION EXCEEDS AVAILABLE 70% PRIZE POOL (Configured: ₹${totalConfiguredPrizes}, Max Allowed: ₹${maxPrizePool70})`,
  };
}

/**
 * Validates whether a winning claim on a ticket is genuine against called numbers.
 */
export function evaluateTicketPatterns(
  grid: (number | null)[][],
  calledNumbers: number[]
): {
  isStar: boolean;
  isEarly5: boolean;
  isTopLine: boolean;
  isMiddleLine: boolean;
  isBottomLine: boolean;
  isFullHouse: boolean;
  starNumbers: number[];
  early5Numbers: number[];
  topLineNumbers: number[];
  middleLineNumbers: number[];
  bottomLineNumbers: number[];
  allNumbers: number[];
} {
  const calledSet = new Set(calledNumbers);
  const row0 = grid[0].filter((n): n is number => n !== null && n > 0);
  const row1 = grid[1].filter((n): n is number => n !== null && n > 0);
  const row2 = grid[2].filter((n): n is number => n !== null && n > 0);
  const all15 = [...row0, ...row1, ...row2];

  const calledOnTicket = all15.filter((n) => calledSet.has(n));
  const isEarly5 = calledOnTicket.length >= 5;

  // Star in Indian Tambola: 4 corners + 1 center number
  // Corner 1: row 0 first number
  // Corner 2: row 0 last number
  // Corner 3: row 2 first number
  // Corner 4: row 2 last number
  // Center: row 1 center number (index 2)
  let isStar = false;
  let starNums: number[] = [];
  if (row0.length >= 2 && row2.length >= 2 && row1.length >= 3) {
    starNums = [
      row0[0],
      row0[row0.length - 1],
      row2[0],
      row2[row2.length - 1],
      row1[Math.floor(row1.length / 2)],
    ];
    isStar = starNums.every((n) => calledSet.has(n));
  } else if (calledOnTicket.length >= 5) {
    isStar = calledOnTicket.length >= 5;
    starNums = calledOnTicket.slice(0, 5);
  }

  const isTopLine = row0.length > 0 && row0.every((n) => calledSet.has(n));
  const isMiddleLine = row1.length > 0 && row1.every((n) => calledSet.has(n));
  const isBottomLine = row2.length > 0 && row2.every((n) => calledSet.has(n));
  const isFullHouse = all15.length === 15 && all15.every((n) => calledSet.has(n));

  return {
    isStar,
    isEarly5,
    isTopLine,
    isMiddleLine,
    isBottomLine,
    isFullHouse,
    starNumbers: starNums,
    early5Numbers: calledOnTicket.slice(0, 5),
    topLineNumbers: row0,
    middleLineNumbers: row1,
    bottomLineNumbers: row2,
    allNumbers: all15,
  };
}

export function verifyWinningClaim(
  grid: (number | null)[][],
  markedNumbers: number[],
  calledNumbers: number[],
  patternCode: WinningPatternCode
): { isValid: boolean; reason: string } {
  const calledSet = new Set(calledNumbers);

  // Filter valid marked numbers that actually exist on ticket AND were called
  const allTicketNumbers: number[] = [];
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell !== null && cell > 0) allTicketNumbers.push(cell);
    });
  });

  const validMarked = markedNumbers.filter((n) => allTicketNumbers.includes(n) && calledSet.has(n));
  const evaluation = evaluateTicketPatterns(grid, calledNumbers);

  switch (patternCode) {
    case 'EARLY5': {
      if (evaluation.isEarly5) {
        return { isValid: true, reason: 'Valid Early 5: 5 or more called numbers marked on ticket.' };
      }
      return { isValid: false, reason: `Early 5 requires at least 5 called numbers. Called & marked: ${validMarked.length}/5` };
    }
    case 'STAR': {
      if (evaluation.isStar) {
        return { isValid: true, reason: 'Valid STAR: 4 corners + center number completed!' };
      }
      return { isValid: false, reason: 'Star pattern requires all 4 corner numbers and the center number to be called.' };
    }
    case 'TOPLINE': {
      if (evaluation.isTopLine) {
        return { isValid: true, reason: 'Valid TOP LINE: All 5 numbers in Row 1 completed.' };
      }
      return { isValid: false, reason: 'Top Line row not fully completed.' };
    }
    case 'MIDDLELINE': {
      if (evaluation.isMiddleLine) {
        return { isValid: true, reason: 'Valid MIDDLE LINE: All 5 numbers in Row 2 completed.' };
      }
      return { isValid: false, reason: 'Middle Line row not fully completed.' };
    }
    case 'BOTTOMLINE': {
      if (evaluation.isBottomLine) {
        return { isValid: true, reason: 'Valid BOTTOM LINE: All 5 numbers in Row 3 completed.' };
      }
      return { isValid: false, reason: 'Bottom Line row not fully completed.' };
    }
    case 'FULLHOUSE1':
    case 'FULLHOUSE2':
    case 'FULLHOUSE3': {
      if (evaluation.isFullHouse) {
        return { isValid: true, reason: `Valid ${patternCode}: All 15 numbers completed on ticket.` };
      }
      return {
        isValid: false,
        reason: `Full House requires all 15 numbers completed. Completed: ${validMarked.length}/15`,
      };
    }
    default:
      if (validMarked.length >= 5) {
        return { isValid: true, reason: 'Pattern verified.' };
      }
      return { isValid: false, reason: 'Pattern criteria not met.' };
  }
}

/**
 * Helper to determine if a target user is directly referred by a sponsor using
 * canonical User ID matching with backward-compatible fallback for legacy codes.
 */
export function isDirectlyReferredBy(targetUser: User, sponsor: User): boolean {
  if (!targetUser || !sponsor || !targetUser.id || !sponsor.id || targetUser.id.toUpperCase() === sponsor.id.toUpperCase()) {
    return false;
  }

  // Sponsor identifiers
  const sponsorId = (sponsor.id || '').trim().toUpperCase();
  const sponsorCode = (sponsor.referralCode || sponsor.id || '').trim().toUpperCase();
  const sponsorPhone = (sponsor.phone || '').replace(/[^0-9]/g, '');
  const sponsorEmail = (sponsor.email || '').trim().toLowerCase();
  const sponsorName = (sponsor.name || '').trim().toLowerCase();

  // Target user referral fields (handling both camelCase and snake_case properties)
  const rawRefBy = (
    targetUser.referredBy ||
    (targetUser as any).referred_by ||
    (targetUser as any).sponsorId ||
    (targetUser as any).sponsor_id ||
    ''
  ).toString().trim();

  const rawRefCode = (
    targetUser.referredByCode ||
    (targetUser as any).referred_by_code ||
    ''
  ).toString().trim();

  const rawSponsorName = (
    targetUser.sponsorName ||
    (targetUser as any).sponsor_name ||
    ''
  ).toString().trim().toLowerCase();

  const refUpper = rawRefBy.toUpperCase();
  const refCodeUpper = rawRefCode.toUpperCase();

  // If no referral linkage exists on the target user
  if (!rawRefBy && !rawRefCode && !rawSponsorName) {
    return false;
  }

  // 1. Exact canonical Sponsor User ID match (Primary Source of Truth)
  if (sponsorId && (refUpper === sponsorId || refCodeUpper === sponsorId)) return true;

  // 2. Exact Referral Code match
  if (sponsorCode && (refUpper === sponsorCode || refCodeUpper === sponsorCode)) return true;

  // 3. Alphanumeric comparison (ignoring dashes, prefixes, special chars)
  const sponsorIdAlpha = sponsorId.replace(/[^A-Z0-9]/g, '');
  const sponsorCodeAlpha = sponsorCode.replace(/[^A-Z0-9]/g, '');
  const refAlpha = refUpper.replace(/[^A-Z0-9]/g, '');
  const refCodeAlpha = refCodeUpper.replace(/[^A-Z0-9]/g, '');

  if (sponsorIdAlpha && (refAlpha === sponsorIdAlpha || refCodeAlpha === sponsorIdAlpha)) return true;
  if (sponsorCodeAlpha && (refAlpha === sponsorCodeAlpha || refCodeAlpha === sponsorCodeAlpha)) return true;

  // 4. Digits match (e.g. 101 matches USR-101 or AT101)
  const sponsorDigits = sponsorId.replace(/[^0-9]/g, '');
  const sponsorCodeDigits = sponsorCode.replace(/[^0-9]/g, '');
  const refDigits = rawRefBy.replace(/[^0-9]/g, '');
  const refCodeDigits = rawRefCode.replace(/[^0-9]/g, '');

  if (sponsorDigits.length >= 3) {
    if (refDigits.length >= 3 && (sponsorDigits === refDigits || sponsorDigits.endsWith(refDigits) || refDigits.endsWith(sponsorDigits))) return true;
    if (refCodeDigits.length >= 3 && (sponsorDigits === refCodeDigits || sponsorDigits.endsWith(refCodeDigits) || refCodeDigits.endsWith(sponsorDigits))) return true;
  }
  if (sponsorCodeDigits.length >= 3) {
    if (refDigits.length >= 3 && (sponsorCodeDigits === refDigits || sponsorCodeDigits.endsWith(refDigits) || refDigits.endsWith(sponsorCodeDigits))) return true;
    if (refCodeDigits.length >= 3 && (sponsorCodeDigits === refCodeDigits || sponsorCodeDigits.endsWith(refCodeDigits) || refCodeDigits.endsWith(sponsorCodeDigits))) return true;
  }

  // 5. Phone number 10-digit match
  if (sponsorPhone.length >= 10) {
    if (refDigits.length >= 10 && sponsorPhone.slice(-10) === refDigits.slice(-10)) return true;
    if (refCodeDigits.length >= 10 && sponsorPhone.slice(-10) === refCodeDigits.slice(-10)) return true;
  }

  // 6. Email match
  if (sponsorEmail) {
    if (rawRefBy.toLowerCase() === sponsorEmail || rawRefCode.toLowerCase() === sponsorEmail) return true;
  }

  // 7. Sponsor name exact match fallback
  if (sponsorName && rawSponsorName && sponsorName === rawSponsorName) return true;

  return false;
}

/**
 * Calculates complete multi-level referral hierarchy dynamically from users dataset.
 */
export function calculateReferralDownline(
  currentUser: User,
  allUsers: User[],
  levelsConfig: ReferralLevelConfig[] = DEFAULT_REFERRAL_LEVELS,
  defaultTicketPrice: number = 50
): ReferralDownlineStats {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://apnatambola.com';
  const referralLink = `${origin}/register?ref=${currentUser.referralCode || currentUser.id}`;

  const visitedIds = new Set<string>([currentUser.id.toUpperCase()]);

  const findDirectReferrals = (parents: User[]): User[] => {
    if (!parents.length) return [];
    const parentCodes = new Set(parents.map((p) => (p.referralCode || '').trim().toUpperCase()).filter(Boolean));
    const parentIds = new Set(parents.map((p) => (p.id || '').trim().toUpperCase()).filter(Boolean));
    const parentAlphas = new Set(
      parents.map((p) => (p.referralCode || p.id || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')).filter(Boolean)
    );
    const parentPhone10s = new Set(
      parents.map((p) => (p.phone || '').replace(/[^0-9]/g, '').slice(-10)).filter((p) => p.length >= 10)
    );
    const parentIdDigits = new Set(
      parents.map((p) => (p.id || '').replace(/[^0-9]/g, '')).filter((d) => d.length >= 4)
    );
    const parentCodeDigits = new Set(
      parents.map((p) => (p.referralCode || '').replace(/[^0-9]/g, '')).filter((d) => d.length >= 4)
    );
    const parentEmails = new Set(parents.map((p) => (p.email || '').trim().toLowerCase()).filter(Boolean));

    return allUsers.filter((u) => {
      if (!u || !u.id || !u.referredBy) return false;
      const uIdUpper = u.id.trim().toUpperCase();
      if (visitedIds.has(uIdUpper)) return false;

      const ref = u.referredBy.trim().toUpperCase();
      const refAlpha = ref.replace(/[^A-Z0-9]/g, '');
      const refDigits = u.referredBy.replace(/[^0-9]/g, '');
      const refEmail = u.referredBy.trim().toLowerCase();

      const isMatch =
        parentIds.has(ref) ||
        parentCodes.has(ref) ||
        (refAlpha && parentAlphas.has(refAlpha)) ||
        (refDigits.length >= 10 && parentPhone10s.has(refDigits.slice(-10))) ||
        (refDigits.length >= 4 && (parentIdDigits.has(refDigits) || parentCodeDigits.has(refDigits))) ||
        (refEmail && parentEmails.has(refEmail));

      return isMatch;
    });
  };

  const levelStats: ReferralDownlineStats['levelStats'] = [];
  let currentParentGroup: User[] = [currentUser];
  let totalTeamCount = 0;
  let totalReferralIncome = 0;

  for (let i = 0; i < levelsConfig.length; i++) {
    const lvlConfig = levelsConfig[i];
    const lvlNumber = lvlConfig.level;
    const lvlPercent = lvlConfig.percent;

    const membersAtLevel = findDirectReferrals(currentParentGroup);
    membersAtLevel.forEach((m) => visitedIds.add(m.id.toUpperCase()));

    let levelEarnings = 0;
    const levelMembers: LevelMember[] = membersAtLevel.map((m) => {
      const ticketsBought = Math.max(1, (m.id.charCodeAt(m.id.length - 1) % 4) + 2);
      const totalSpent = ticketsBought * defaultTicketPrice;
      const commissionEarned = Math.round(((totalSpent * lvlPercent) / 100) * 100) / 100;
      levelEarnings = Math.round((levelEarnings + commissionEarned) * 100) / 100;

      return {
        user: m,
        level: lvlNumber,
        ticketsBought,
        totalSpent,
        commissionEarned,
      };
    });

    totalTeamCount += membersAtLevel.length;
    totalReferralIncome = Math.round((totalReferralIncome + levelEarnings) * 100) / 100;

    levelStats.push({
      level: lvlNumber,
      percent: lvlPercent,
      membersCount: membersAtLevel.length,
      totalEarnings: levelEarnings,
      members: levelMembers,
    });

    currentParentGroup = membersAtLevel;
  }

  const directMembersCount = levelStats[0] ? levelStats[0].membersCount : 0;
  const directIncomeTotal = Math.round((currentUser.directIncomeEarnings || 0) * 100) / 100;

  return {
    referralCode: currentUser.referralCode,
    referralLink,
    directMembersCount,
    totalTeamCount,
    totalReferralIncome,
    directIncomeTotal,
    levelStats,
  };
}

/**
 * Initial Seed Users database with canonical sponsor User IDs (referredBy = Sponsor User ID):
 * - Rajesh Sharma (USR-101, APNA100) has 2 direct referrals: Pooja (USR-102) and Amit (USR-103) -> referredBy = 'USR-101'
 * - Pooja (USR-102) refers Sneha (USR-104) -> referredBy = 'USR-102' (Level 2 of Rajesh)
 * - Amit (USR-103) refers Vikas (USR-105) -> referredBy = 'USR-103' (Level 2 of Rajesh)
 * - Sneha (USR-104) refers Kiran (USR-106) -> referredBy = 'USR-104' (Level 3 of Rajesh)
 */
export const INITIAL_SEED_USERS: User[] = [
  {
    id: 'USR-101',
    name: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@example.com',
    referralCode: 'APNA100',
    referredBy: null,
    referredByCode: null,
    sponsorName: null,
    depositWallet: 650,
    ticketWallet: 200,
    winningWallet: 400,
    walletBalance: 1250,
    referralEarnings: 240,
    directIncomeEarnings: 50,
    gameWinnings: 3500,
    totalDeposited: 3000,
    totalWithdrawn: 1500,
    freeTicketsAvailable: 0,
    directReferralsCount: 2,
    role: 'user',
    createdAt: '2026-08-10T10:00:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Maharashtra',
    bankDetails: {
      accountHolderName: 'Rajesh Sharma',
      accountNumber: '501002910291',
      ifscCode: 'HDFC0001029',
      bankName: 'HDFC Bank',
      upiId: 'rajesh@okhdfcbank',
    },
    isKycVerified: true,
  },
  {
    id: 'USR-102',
    name: 'Pooja Verma',
    phone: '+91 98765 43211',
    email: 'pooja.verma@example.com',
    referralCode: 'APNA200',
    referredBy: 'USR-101', // Canonical Sponsor ID of Rajesh Sharma
    referredByCode: 'APNA100',
    sponsorName: 'Rajesh Sharma',
    depositWallet: 400,
    ticketWallet: 150,
    winningWallet: 250,
    walletBalance: 800,
    referralEarnings: 80,
    directIncomeEarnings: 20,
    gameWinnings: 1500,
    totalDeposited: 1200,
    totalWithdrawn: 400,
    freeTicketsAvailable: 0,
    directReferralsCount: 1,
    role: 'user',
    createdAt: '2026-08-12T11:30:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Delhi',
    bankDetails: {
      accountHolderName: 'Pooja Verma',
      accountNumber: '918820192840',
      ifscCode: 'SBIN0004920',
      bankName: 'State Bank of India',
      upiId: 'pooja@oksbi',
    },
    isKycVerified: true,
  },
  {
    id: 'USR-103',
    name: 'Amit Patel',
    phone: '+91 98765 43212',
    email: 'amit.patel@example.com',
    referralCode: 'APNA300',
    referredBy: 'USR-101', // Canonical Sponsor ID of Rajesh Sharma
    referredByCode: 'APNA100',
    sponsorName: 'Rajesh Sharma',
    depositWallet: 300,
    ticketWallet: 100,
    winningWallet: 250,
    walletBalance: 650,
    referralEarnings: 60,
    directIncomeEarnings: 15,
    gameWinnings: 2000,
    totalDeposited: 1500,
    totalWithdrawn: 600,
    freeTicketsAvailable: 0,
    directReferralsCount: 1,
    role: 'user',
    createdAt: '2026-08-14T14:15:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Gujarat',
    bankDetails: {
      accountHolderName: 'Amit Patel',
      accountNumber: '918820192841',
      ifscCode: 'SBIN0004921',
      bankName: 'State Bank of India',
      upiId: 'amit@oksbi',
    },
    isKycVerified: true,
  },
  {
    id: 'USR-104',
    name: 'Sneha Roy',
    phone: '+91 98765 43213',
    email: 'sneha.roy@example.com',
    referralCode: 'APNA400',
    referredBy: 'USR-102', // Canonical Sponsor ID of Pooja Verma
    referredByCode: 'APNA200',
    sponsorName: 'Pooja Verma',
    depositWallet: 200,
    ticketWallet: 100,
    winningWallet: 100,
    walletBalance: 400,
    referralEarnings: 40,
    directIncomeEarnings: 10,
    gameWinnings: 800,
    totalDeposited: 500,
    totalWithdrawn: 0,
    freeTicketsAvailable: 0,
    directReferralsCount: 1,
    role: 'user',
    createdAt: '2026-08-16T09:45:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Karnataka',
  },
  {
    id: 'USR-105',
    name: 'Vikas Kumar',
    phone: '+91 98765 43214',
    email: 'vikas.kumar@example.com',
    referralCode: 'APNA500',
    referredBy: 'USR-103', // Canonical Sponsor ID of Amit Patel
    referredByCode: 'APNA300',
    sponsorName: 'Amit Patel',
    depositWallet: 300,
    ticketWallet: 50,
    winningWallet: 200,
    walletBalance: 550,
    referralEarnings: 20,
    directIncomeEarnings: 5,
    gameWinnings: 1500,
    totalDeposited: 800,
    totalWithdrawn: 250,
    freeTicketsAvailable: 0,
    directReferralsCount: 0,
    role: 'user',
    createdAt: '2026-08-18T16:20:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Uttar Pradesh',
    bankDetails: {
      accountHolderName: 'Vikas Kumar',
      accountNumber: '302910291029',
      ifscCode: 'PUNB0029100',
      bankName: 'Punjab National Bank',
      upiId: 'vikas@paytm',
    },
    isKycVerified: true,
  },
  {
    id: 'USR-106',
    name: 'Kiran Gupta',
    phone: '+91 98765 43215',
    email: 'kiran.gupta@example.com',
    referralCode: 'APNA600',
    referredBy: 'USR-104', // Canonical Sponsor ID of Sneha Roy
    referredByCode: 'APNA400',
    sponsorName: 'Sneha Roy',
    depositWallet: 150,
    ticketWallet: 50,
    winningWallet: 100,
    walletBalance: 300,
    referralEarnings: 0,
    directIncomeEarnings: 0,
    gameWinnings: 500,
    totalDeposited: 400,
    totalWithdrawn: 0,
    freeTicketsAvailable: 0,
    directReferralsCount: 0,
    role: 'user',
    createdAt: '2026-08-20T12:10:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Punjab',
  },
  {
    id: 'USR-ADMIN',
    name: 'Apna Tambola Super Admin',
    phone: '+91 99999 88888',
    email: 'admin@apnatambola.com',
    referralCode: 'APNA999',
    referredBy: null,
    referredByCode: null,
    sponsorName: null,
    depositWallet: 40000,
    ticketWallet: 5000,
    winningWallet: 5000,
    walletBalance: 50000,
    referralEarnings: 12000,
    directIncomeEarnings: 2500,
    gameWinnings: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    freeTicketsAvailable: 0,
    directReferralsCount: 0,
    role: 'admin',
    createdAt: '2026-08-01T00:00:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Delhi',
    isKycVerified: true,
  },
];

export interface DownlineTreeNode {
  id: string;
  name: string;
  referralCode: string;
  phone?: string;
  email?: string;
  level: number;
  joinedDate: string;
  status: 'Active' | 'Inactive';
  directCount: number;
  totalTeamCount: number;
  referredBy?: string | null;
  children: DownlineTreeNode[];
}

/**
 * Builds a complete hierarchical downline tree recursive structure starting from the root user.
 */
export function buildDownlineTreeHierarchy(rootUser: User, allUsers: User[], maxDepth: number = 8): DownlineTreeNode {
  const visited = new Set<string>([rootUser.id.toUpperCase()]);

  function getChildren(parent: User, currentLevel: number): DownlineTreeNode[] {
    if (currentLevel > maxDepth) return [];

    const directs = allUsers.filter((u) => {
      if (!u || !u.id || !u.referredBy) return false;
      const uIdUpper = u.id.trim().toUpperCase();
      if (visited.has(uIdUpper)) return false;
      return isDirectlyReferredBy(u, parent);
    });

    return directs.map((child) => {
      visited.add(child.id.toUpperCase());
      const subChildren = getChildren(child, currentLevel + 1);

      // Count total downline underneath this child
      function countSubTeam(nodes: DownlineTreeNode[]): number {
        return nodes.reduce((sum, n) => sum + 1 + countSubTeam(n.children), 0);
      }

      const totalTeamCount = countSubTeam(subChildren);

      return {
        id: child.id,
        name: child.name,
        referralCode: child.referralCode || child.id,
        phone: child.phone,
        email: child.email,
        level: currentLevel,
        joinedDate: child.createdAt
          ? new Date(child.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : 'Active',
        status: 'Active',
        directCount: subChildren.length,
        totalTeamCount,
        referredBy: child.referredBy,
        children: subChildren,
      };
    });
  }

  const rootChildren = getChildren(rootUser, 1);

  function countSubTeam(nodes: DownlineTreeNode[]): number {
    return nodes.reduce((sum, n) => sum + 1 + countSubTeam(n.children), 0);
  }

  return {
    id: rootUser.id,
    name: rootUser.name,
    referralCode: rootUser.referralCode || rootUser.id,
    phone: rootUser.phone,
    email: rootUser.email,
    level: 0,
    joinedDate: rootUser.createdAt
      ? new Date(rootUser.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Active',
    status: 'Active',
    directCount: rootChildren.length,
    totalTeamCount: countSubTeam(rootChildren),
    referredBy: rootUser.referredBy,
    children: rootChildren,
  };
}
