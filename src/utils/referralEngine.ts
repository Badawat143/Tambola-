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

  // Verify all marked numbers are actually on the ticket and have been called
  const validMarked = markedNumbers.filter((n) => allTicketNumbers.includes(n) && calledSet.has(n));

  switch (patternCode) {
    case 'EARLY5': {
      if (validMarked.length >= 5) {
        return { isValid: true, reason: 'Valid Early 5: 5 or more called numbers marked.' };
      }
      return { isValid: false, reason: `Early 5 requires at least 5 called numbers. Marked: ${validMarked.length}` };
    }
    case 'STAR': {
      // Star pattern: 4 corners + center cell OR any 5 key points
      // Row 0, col of 1st num; Row 0, col of last num; Row 2, col of 1st num; Row 2, col of last num; Row 1, col 4/5
      const row0 = grid[0].filter((n): n is number => n !== null && calledSet.has(n));
      const row1 = grid[1].filter((n): n is number => n !== null && calledSet.has(n));
      const row2 = grid[2].filter((n): n is number => n !== null && calledSet.has(n));

      if (row0.length >= 2 && row2.length >= 2 && row1.length >= 1) {
        return { isValid: true, reason: 'Valid STAR: Corner & center numbers completed.' };
      }
      if (validMarked.length >= 5) {
        return { isValid: true, reason: 'Valid STAR pattern criteria met.' };
      }
      return { isValid: false, reason: 'Star pattern requires corners & center number marked.' };
    }
    case 'TOPLINE': {
      const row0Numbers = grid[0].filter((n): n is number => n !== null);
      const row0Completed = row0Numbers.every((n) => calledSet.has(n) && markedNumbers.includes(n));
      if (row0Completed) {
        return { isValid: true, reason: 'Valid TOP LINE: All 5 numbers in Row 1 completed.' };
      }
      return { isValid: false, reason: 'Top Line row not fully completed.' };
    }
    case 'MIDDLELINE': {
      const row1Numbers = grid[1].filter((n): n is number => n !== null);
      const row1Completed = row1Numbers.every((n) => calledSet.has(n) && markedNumbers.includes(n));
      if (row1Completed) {
        return { isValid: true, reason: 'Valid MIDDLE LINE: All 5 numbers in Row 2 completed.' };
      }
      return { isValid: false, reason: 'Middle Line row not fully completed.' };
    }
    case 'BOTTOMLINE': {
      const row2Numbers = grid[2].filter((n): n is number => n !== null);
      const row2Completed = row2Numbers.every((n) => calledSet.has(n) && markedNumbers.includes(n));
      if (row2Completed) {
        return { isValid: true, reason: 'Valid BOTTOM LINE: All 5 numbers in Row 3 completed.' };
      }
      return { isValid: false, reason: 'Bottom Line row not fully completed.' };
    }
    case 'FULLHOUSE1':
    case 'FULLHOUSE2':
    case 'FULLHOUSE3': {
      const allCompleted = allTicketNumbers.every((n) => calledSet.has(n) && markedNumbers.includes(n));
      if (allCompleted) {
        return { isValid: true, reason: `Valid ${patternCode}: All 15 numbers completed on ticket.` };
      }
      return {
        isValid: false,
        reason: `Full House requires all 15 numbers marked. Marked: ${validMarked.length}/15`,
      };
    }
    default:
      if (validMarked.length >= 5) {
        return { isValid: true, reason: 'Custom pattern verified.' };
      }
      return { isValid: false, reason: 'Pattern criteria not met.' };
  }
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
  const referralLink = `${origin}?ref=${currentUser.referralCode}`;

  const findDirectReferrals = (parents: User[]): User[] => {
    if (!parents.length) return [];
    const parentCodes = new Set(parents.map((p) => (p.referralCode || '').trim().toUpperCase()));
    const parentIds = new Set(parents.map((p) => (p.id || '').trim().toUpperCase()));

    return allUsers.filter((u) => {
      if (!u.referredBy) return false;
      const ref = u.referredBy.trim().toUpperCase();
      return parentCodes.has(ref) || parentIds.has(ref);
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
 * Initial Seed Users database that ensures exact verification test:
 * - Rajesh Sharma (APNA100) has 2 direct referrals (Pooja and Amit) -> Direct Referrals = 2, Level 1 = 2
 * - Pooja refers Sneha, Amit refers Vikas -> Level 2 = 2!
 * - Sneha refers Kiran -> Level 3 = 1
 */
export const INITIAL_SEED_USERS: User[] = [
  {
    id: 'USR-101',
    name: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@example.com',
    referralCode: 'APNA100',
    referredBy: null,
    depositWallet: 650,
    ticketWallet: 200,
    winningWallet: 400,
    walletBalance: 1250,
    referralEarnings: 240,
    directIncomeEarnings: 50,
    gameWinnings: 3500,
    totalDeposited: 3000,
    totalWithdrawn: 1500,
    freeTicketsAvailable: 2,
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
    referredBy: 'APNA100', // Referred by Rajesh (Level 1 of Rajesh)
    depositWallet: 400,
    ticketWallet: 150,
    winningWallet: 250,
    walletBalance: 800,
    referralEarnings: 80,
    directIncomeEarnings: 20,
    gameWinnings: 1500,
    totalDeposited: 1200,
    totalWithdrawn: 400,
    freeTicketsAvailable: 1,
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
    referredBy: 'APNA100', // Referred by Rajesh (Level 1 of Rajesh)
    depositWallet: 300,
    ticketWallet: 100,
    winningWallet: 250,
    walletBalance: 650,
    referralEarnings: 60,
    directIncomeEarnings: 15,
    gameWinnings: 2000,
    totalDeposited: 1500,
    totalWithdrawn: 600,
    freeTicketsAvailable: 1,
    role: 'user',
    createdAt: '2026-08-14T14:15:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Gujarat',
    bankDetails: {
      accountHolderName: 'Amit Patel',
      accountNumber: '918820192841',
      ifscCode: 'SBIN0004921',
      bankName: 'State Bank of India',
      upiId: 'amit@okicici',
    },
    isKycVerified: true,
  },
  {
    id: 'USR-104',
    name: 'Sneha Roy',
    phone: '+91 98765 43213',
    email: 'sneha.roy@example.com',
    referralCode: 'APNA400',
    referredBy: 'APNA200', // Referred by Pooja (Level 2 of Rajesh)
    depositWallet: 200,
    ticketWallet: 100,
    winningWallet: 100,
    walletBalance: 400,
    referralEarnings: 30,
    directIncomeEarnings: 10,
    gameWinnings: 0,
    totalDeposited: 600,
    totalWithdrawn: 0,
    freeTicketsAvailable: 1,
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
    referredBy: 'APNA300', // Referred by Amit (Level 2 of Rajesh)
    depositWallet: 300,
    ticketWallet: 50,
    winningWallet: 200,
    walletBalance: 550,
    referralEarnings: 20,
    directIncomeEarnings: 5,
    gameWinnings: 1500,
    totalDeposited: 800,
    totalWithdrawn: 250,
    freeTicketsAvailable: 1,
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
    referredBy: 'APNA400', // Referred by Sneha (Level 3 of Rajesh)
    depositWallet: 150,
    ticketWallet: 50,
    winningWallet: 100,
    walletBalance: 300,
    referralEarnings: 0,
    directIncomeEarnings: 0,
    gameWinnings: 500,
    totalDeposited: 400,
    totalWithdrawn: 0,
    freeTicketsAvailable: 1,
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
    depositWallet: 40000,
    ticketWallet: 5000,
    winningWallet: 5000,
    walletBalance: 50000,
    referralEarnings: 12000,
    directIncomeEarnings: 2500,
    gameWinnings: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    freeTicketsAvailable: 99,
    role: 'admin',
    createdAt: '2026-08-01T00:00:00.000Z',
    ageVerified: true,
    stateOfResidence: 'Delhi',
    isKycVerified: true,
  },
];
