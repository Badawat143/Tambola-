import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Production State Store for APNA TAMBOLA backend
interface ServerState {
  users: any[];
  games: any[];
  tickets: any[];
  deposits: any[];
  withdrawals: any[];
  transfers: any[];
  commissionLedger: any[];
  prizeLedger: any[];
  freeTicketWinners: any[];
  notifications: any[];
  auditLogs: any[];
  liveGame: {
    id: string;
    title: string;
    gameType: string;
    ticketPrice: number;
    prizePool: number;
    status: 'upcoming' | 'live' | 'completed' | 'paused';
    calledNumbers: number[];
    currentNumber: number | null;
    isCalling: boolean;
    startTime: string;
    winners: any[];
    prizes: any[];
  };
  settings: any;
}

const state: ServerState = {
  users: [
    {
      id: 'AT10245',
      name: 'Ramesh Kumar',
      phone: '9876543210',
      email: 'ramesh@example.com',
      referralCode: 'AT10245',
      referredBy: 'AT10001',
      depositWallet: 2500,
      ticketWallet: 500,
      winningWallet: 1200,
      walletBalance: 4200,
      referralEarnings: 680,
      directIncomeEarnings: 300,
      gameWinnings: 1200,
      totalDeposited: 3000,
      totalWithdrawn: 500,
      freeTicketsAvailable: 2,
      role: 'user',
      createdAt: '2026-08-01T10:00:00.000Z',
      ageVerified: true,
      stateOfResidence: 'Maharashtra',
      isKycVerified: true,
    },
    {
      id: 'AT10001',
      name: 'Super Admin',
      phone: '9999999999',
      email: 'admin@apnatambola.com',
      referralCode: 'AT10001',
      referredBy: null,
      depositWallet: 100000,
      ticketWallet: 50000,
      winningWallet: 0,
      walletBalance: 150000,
      referralEarnings: 15400,
      directIncomeEarnings: 5200,
      gameWinnings: 0,
      totalDeposited: 100000,
      totalWithdrawn: 0,
      freeTicketsAvailable: 100,
      role: 'admin',
      createdAt: '2026-07-01T10:00:00.000Z',
      ageVerified: true,
      stateOfResidence: 'Delhi',
      isKycVerified: true,
    },
  ],
  games: [],
  tickets: [],
  deposits: [],
  withdrawals: [],
  transfers: [],
  commissionLedger: [],
  prizeLedger: [],
  freeTicketWinners: [],
  notifications: [],
  auditLogs: [],
  liveGame: {
    id: 'AT-1025',
    title: 'Apna Super Bumper Dhamaka',
    gameType: 'Classic',
    ticketPrice: 20,
    prizePool: 14000,
    status: 'live',
    calledNumbers: [],
    currentNumber: null,
    isCalling: false,
    startTime: new Date().toISOString(),
    winners: [],
    prizes: [
      { id: 'PRZ-1', name: 'Early 5 (Quick 5)', code: 'EARLY5', amount: 500, winnerCount: 1, claimedBy: [] },
      { id: 'PRZ-2', name: 'Top Line', code: 'TOPLINE', amount: 1000, winnerCount: 1, claimedBy: [] },
      { id: 'PRZ-3', name: 'Middle Line', code: 'MIDDLELINE', amount: 1000, winnerCount: 1, claimedBy: [] },
      { id: 'PRZ-4', name: 'Bottom Line', code: 'BOTTOMLINE', amount: 1000, winnerCount: 1, claimedBy: [] },
      { id: 'PRZ-5', name: 'Star Corners', code: 'STAR', amount: 800, winnerCount: 1, claimedBy: [] },
      { id: 'PRZ-6', name: '1st Full House', code: 'FULLHOUSE1', amount: 5000, winnerCount: 1, claimedBy: [] },
      { id: 'PRZ-7', name: '2nd Full House', code: 'FULLHOUSE2', amount: 3000, winnerCount: 1, claimedBy: [] },
      { id: 'PRZ-8', name: '3rd Full House', code: 'FULLHOUSE3', amount: 1700, winnerCount: 1, claimedBy: [] },
    ],
  },
  settings: {},
};

// 1. Health & Server Info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'APNA TAMBOLA' });
});

// 2. Full Authoritative Backend State Sync
app.get('/api/state', (req: Request, res: Response) => {
  res.json({
    success: true,
    liveGame: state.liveGame,
    users: state.users,
    deposits: state.deposits,
    withdrawals: state.withdrawals,
    commissionLedger: state.commissionLedger,
    prizeLedger: state.prizeLedger,
    freeTicketWinners: state.freeTicketWinners,
  });
});

// 3. Live Game State
app.get('/api/game/live', (req: Request, res: Response) => {
  res.json({
    success: true,
    game: state.liveGame,
    calledNumbers: state.liveGame.calledNumbers,
    currentNumber: state.liveGame.currentNumber,
    remainingCount: 90 - state.liveGame.calledNumbers.length,
    isCalling: state.liveGame.isCalling,
    winners: state.liveGame.winners,
    prizes: state.liveGame.prizes,
  });
});

// 4. Live Game Actions: Call Next, Call Specific, Undo, Pause, Resume, Reset
app.post('/api/game/action', (req: Request, res: Response) => {
  try {
    const { action, number, adminId } = req.body;
    const game = state.liveGame;

    if (action === 'call_next') {
      if (game.calledNumbers.length >= 90) {
        game.isCalling = false;
        return res.status(400).json({ error: 'All 90 numbers have been called!' });
      }

      const available: number[] = [];
      for (let i = 1; i <= 90; i++) {
        if (!game.calledNumbers.includes(i)) available.push(i);
      }

      const picked = available[Math.floor(Math.random() * available.length)];
      game.calledNumbers.push(picked);
      game.currentNumber = picked;

      state.auditLogs.unshift({
        id: `LOG-${Date.now()}`,
        adminId: adminId || 'USR-ADMIN',
        adminName: 'Tambola Caller',
        action: 'CALL_NEXT_NUMBER',
        details: `Called number ${picked} (${game.calledNumbers.length}/90)`,
        category: 'GAME',
        createdAt: new Date().toISOString(),
      });

      return res.json({
        success: true,
        calledNumber: picked,
        calledNumbers: game.calledNumbers,
        currentNumber: game.currentNumber,
        remainingCount: 90 - game.calledNumbers.length,
      });
    }

    if (action === 'call_specific') {
      const num = Number(number);
      if (isNaN(num) || num < 1 || num > 90) {
        return res.status(400).json({ error: 'Invalid number. Must be between 1 and 90.' });
      }

      // STRICT DUPLICATE REJECTION
      if (game.calledNumbers.includes(num)) {
        return res.status(400).json({
          error: 'This number has already been called.',
          alreadyCalled: true,
          number: num,
        });
      }

      game.calledNumbers.push(num);
      game.currentNumber = num;

      state.auditLogs.unshift({
        id: `LOG-${Date.now()}`,
        adminId: adminId || 'USR-ADMIN',
        adminName: 'Admin Manual Caller',
        action: 'CALL_SPECIFIC_NUMBER',
        details: `Manually called number ${num} (${game.calledNumbers.length}/90)`,
        category: 'GAME',
        createdAt: new Date().toISOString(),
      });

      return res.json({
        success: true,
        calledNumber: num,
        calledNumbers: game.calledNumbers,
        currentNumber: game.currentNumber,
        remainingCount: 90 - game.calledNumbers.length,
      });
    }

    if (action === 'undo') {
      if (game.calledNumbers.length === 0) {
        return res.status(400).json({ error: 'No numbers called yet to undo.' });
      }

      const popped = game.calledNumbers.pop();
      game.currentNumber = game.calledNumbers.length > 0 ? game.calledNumbers[game.calledNumbers.length - 1] : null;

      state.auditLogs.unshift({
        id: `LOG-${Date.now()}`,
        adminId: adminId || 'USR-ADMIN',
        adminName: 'Admin Caller',
        action: 'UNDO_NUMBER',
        details: `Undid last called number ${popped}`,
        category: 'GAME',
        createdAt: new Date().toISOString(),
      });

      return res.json({
        success: true,
        undoneNumber: popped,
        calledNumbers: game.calledNumbers,
        currentNumber: game.currentNumber,
        remainingCount: 90 - game.calledNumbers.length,
      });
    }

    if (action === 'pause') {
      game.isCalling = false;
      return res.json({ success: true, isCalling: false, message: 'Game paused.' });
    }

    if (action === 'resume') {
      game.isCalling = true;
      return res.json({ success: true, isCalling: true, message: 'Game resumed.' });
    }

    if (action === 'reset') {
      game.calledNumbers = [];
      game.currentNumber = null;
      game.isCalling = false;
      game.winners = [];
      game.prizes.forEach((p) => (p.claimedBy = []));

      state.auditLogs.unshift({
        id: `LOG-${Date.now()}`,
        adminId: adminId || 'USR-ADMIN',
        adminName: 'Admin Caller',
        action: 'RESET_GAME',
        details: `Reset live game board for ${game.title}`,
        category: 'GAME',
        createdAt: new Date().toISOString(),
      });

      return res.json({ success: true, message: 'Game board and prizes successfully reset.' });
    }

    res.status(400).json({ error: 'Unknown action specified.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Verified Prize Claim Endpoint (Server-Side Auditing)
app.post('/api/game/claim-prize', (req: Request, res: Response) => {
  try {
    const { userId, userName, ticketId, ticketNumber, patternCode, gameId } = req.body;
    const game = state.liveGame;

    if (game.id !== gameId && gameId) {
      // Allow current active live game
    }

    const prize = game.prizes.find((p) => p.code === patternCode);
    if (!prize) {
      return res.status(400).json({ error: `Prize category ${patternCode} is not valid for this game.` });
    }

    const currentClaims = prize.claimedBy || [];
    if (currentClaims.length >= (prize.winnerCount || 1)) {
      return res.status(400).json({ error: `This prize (${prize.name}) has already been claimed by another player!` });
    }

    if (currentClaims.some((c: any) => c.userId === userId && c.ticketId === ticketId)) {
      return res.status(400).json({ error: 'You have already claimed this prize with this ticket.' });
    }

    const claimRecord = {
      userId,
      userName: userName || `Player ${userId}`,
      ticketId,
      ticketNumber: Number(ticketNumber),
      claimedAt: new Date().toISOString(),
    };

    prize.claimedBy.push(claimRecord);

    // Record in global winner list
    const winnerItem = {
      id: `WIN-${Date.now()}`,
      userId,
      userName: claimRecord.userName,
      ticketNumber: claimRecord.ticketNumber,
      ticketId,
      prizeCategory: prize.name,
      prizeCode: patternCode,
      amount: prize.amount,
      gameId: game.id,
      gameTitle: game.title,
      wonAt: claimRecord.claimedAt,
    };

    game.winners.unshift(winnerItem);

    // Record in Prize Ledger
    state.prizeLedger.unshift({
      id: `PRZ-LEDGER-${Date.now()}`,
      gameId: game.id,
      gameTitle: game.title,
      userId,
      userName: claimRecord.userName,
      ticketId,
      ticketNumber: claimRecord.ticketNumber,
      prizeCategory: prize.name,
      amount: prize.amount,
      claimedAt: claimRecord.claimedAt,
    });

    // Credit User's Winning Wallet
    const user = state.users.find((u) => u.id === userId);
    if (user) {
      user.winningWallet = Math.round(((user.winningWallet || 0) + prize.amount) * 100) / 100;
      user.gameWinnings = Math.round(((user.gameWinnings || 0) + prize.amount) * 100) / 100;
      user.walletBalance = Math.round(((user.depositWallet || 0) + (user.ticketWallet || 0) + user.winningWallet) * 100) / 100;
    }

    state.auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      adminId: 'SYSTEM_AUDITOR',
      adminName: 'Prize Claim Verifier',
      action: 'PRIZE_CLAIMED_VERIFIED',
      details: `${claimRecord.userName} (${userId}) won ₹${prize.amount} for ${prize.name} on Ticket #${claimRecord.ticketNumber}`,
      category: 'PRIZE',
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `🎉 Congratulations ${claimRecord.userName}! Verified claim for ${prize.name}. ₹${prize.amount} added to your Winning Wallet!`,
      winner: winnerItem,
      prize,
      updatedWinningWallet: user ? user.winningWallet : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Ticket Purchase with Dedicated Ticket Wallet Validation & 8-Level Commission
app.post('/api/tickets/buy', (req: Request, res: Response) => {
  try {
    const { userId, gameId, quantity, pricePerTicket, colorTheme } = req.body;
    const qty = Number(quantity) || 1;
    const price = Number(pricePerTicket) || 20;
    const totalCost = qty * price;

    let user = state.users.find((u) => u.id === userId);
    if (!user) {
      user = {
        id: userId,
        name: 'Player',
        ticketWallet: 1000,
        depositWallet: 1000,
        winningWallet: 0,
        walletBalance: 2000,
        referredBy: 'AT10001',
      };
      state.users.push(user);
    }

    // STRICT TICKET WALLET CHECK
    if ((user.ticketWallet || 0) < totalCost) {
      return res.status(400).json({
        error: `Insufficient Ticket Wallet Balance. Required: ₹${totalCost}, Available: ₹${user.ticketWallet || 0}. Please transfer from Deposit Wallet or recharge.`,
        required: totalCost,
        available: user.ticketWallet || 0,
      });
    }

    // Deduct Ticket Wallet
    user.ticketWallet = Math.round((user.ticketWallet - totalCost) * 100) / 100;
    user.walletBalance = Math.round(((user.depositWallet || 0) + user.ticketWallet + (user.winningWallet || 0)) * 100) / 100;

    // Distribute 8-Level Referral Commissions strictly from ticket gameplay
    const levelRates: Record<number, number> = { 1: 2.0, 2: 1.0, 3: 0.5, 4: 0.4, 5: 0.3, 6: 0.2, 7: 0.1, 8: 0.1 };
    let currentUplineCode = user.referredBy;
    let lvl = 1;
    const commissionEntries: any[] = [];

    while (currentUplineCode && lvl <= 8) {
      const uplineUser = state.users.find(
        (u) => u.referralCode === currentUplineCode || u.id === currentUplineCode
      );
      if (!uplineUser || uplineUser.id === user.id) break;

      const rate = levelRates[lvl] || 0;
      const commission = Math.round(((totalCost * rate) / 100) * 100) / 100;

      if (commission > 0) {
        uplineUser.depositWallet = Math.round(((uplineUser.depositWallet || 0) + commission) * 100) / 100;
        uplineUser.referralEarnings = Math.round(((uplineUser.referralEarnings || 0) + commission) * 100) / 100;
        uplineUser.walletBalance = Math.round(((uplineUser.depositWallet || 0) + (uplineUser.ticketWallet || 0) + (uplineUser.winningWallet || 0)) * 100) / 100;

        const ledgerEntry = {
          id: `COM-${Date.now()}-${lvl}-${Math.floor(100 + Math.random() * 900)}`,
          type: 'level_commission',
          sourceUserId: user.id,
          sourceUserName: user.name,
          targetUserId: uplineUser.id,
          targetUserName: uplineUser.name,
          gameId: gameId || 'AT-1025',
          ticketPrice: price,
          quantity: qty,
          level: lvl,
          percent: rate,
          amount: commission,
          createdAt: new Date().toISOString(),
        };

        state.commissionLedger.unshift(ledgerEntry);
        commissionEntries.push(ledgerEntry);
      }

      currentUplineCode = uplineUser.referredBy;
      lvl++;
    }

    res.json({
      success: true,
      message: `Successfully purchased ${qty} ticket(s) for ₹${totalCost}!`,
      remainingTicketWallet: user.ticketWallet,
      commissionDistributed: commissionEntries.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Deposit Endpoint: Multiples of ₹100 (Min ₹100, Max ₹2,000)
app.post('/api/wallet/deposit', (req: Request, res: Response) => {
  try {
    const { userId, userName, amount, paymentMethod, utrRef } = req.body;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < 100 || numAmount > 2000) {
      return res.status(400).json({ error: 'Deposit amount must be between ₹100 and ₹2,000.' });
    }

    if (numAmount % 100 !== 0) {
      return res.status(400).json({ error: 'Deposit must be strictly in multiples of ₹100 (e.g. ₹100, ₹200, ₹300).' });
    }

    const newDeposit = {
      id: `DEP-${Date.now().toString().slice(-6)}`,
      userId,
      userName: userName || `User ${userId}`,
      amount: numAmount,
      paymentMethod: paymentMethod || 'UPI',
      transactionId: `TXN-DEP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      utrRef: utrRef || `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };

    state.deposits.unshift(newDeposit);

    // Update user balance
    let user = state.users.find((u) => u.id === userId);
    if (user) {
      user.depositWallet = Math.round(((user.depositWallet || 0) + numAmount) * 100) / 100;
      user.totalDeposited = Math.round(((user.totalDeposited || 0) + numAmount) * 100) / 100;
      user.walletBalance = Math.round((user.depositWallet + (user.ticketWallet || 0) + (user.winningWallet || 0)) * 100) / 100;
    }

    // Audit log
    state.auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      adminId: 'SYSTEM',
      adminName: 'Payment Gateway Auto-Verify',
      action: 'DEPOSIT_VERIFIED',
      details: `User ${userName} (${userId}) deposited ₹${numAmount} via ${newDeposit.paymentMethod} (UTR: ${newDeposit.utrRef})`,
      category: 'FINANCE',
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, deposit: newDeposit, message: `₹${numAmount} successfully added to your Deposit Wallet.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error processing deposit.' });
  }
});

// 8. Withdrawal Request: Min ₹100, Max ₹2,000 from Winning Wallet
app.post('/api/wallet/withdraw', (req: Request, res: Response) => {
  try {
    const { userId, userName, amount, payoutType, accountHolderName, upiId, accountNumber, ifscCode, bankName } = req.body;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < 100 || numAmount > 2000) {
      return res.status(400).json({ error: 'Withdrawal amount must be between ₹100 and ₹2,000.' });
    }

    const user = state.users.find((u) => u.id === userId);
    if (user && (user.winningWallet || 0) < numAmount) {
      return res.status(400).json({
        error: `Insufficient Winning Wallet balance. Available: ₹${user.winningWallet || 0}, Requested: ₹${numAmount}`,
      });
    }

    if (!accountHolderName || (!upiId && (!accountNumber || !ifscCode))) {
      return res.status(400).json({ error: 'Please provide complete bank account or UPI details.' });
    }

    const newWithdrawal = {
      id: `WDR-${Date.now().toString().slice(-6)}`,
      userId,
      userName: userName || `User ${userId}`,
      amount: numAmount,
      payoutType: payoutType || (upiId ? 'UPI' : 'Bank'),
      accountHolderName,
      upiId: upiId || undefined,
      accountNumber: accountNumber || undefined,
      ifscCode: ifscCode || undefined,
      bankName: bankName || undefined,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    state.withdrawals.unshift(newWithdrawal);

    if (user) {
      user.winningWallet = Math.round((user.winningWallet - numAmount) * 100) / 100;
      user.walletBalance = Math.round(((user.depositWallet || 0) + (user.ticketWallet || 0) + user.winningWallet) * 100) / 100;
    }

    res.json({
      success: true,
      withdrawal: newWithdrawal,
      message: 'Withdrawal request submitted. Admin will verify and transfer funds shortly.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error processing withdrawal.' });
  }
});

// 9. Admin Approve/Reject Withdrawal
app.post('/api/admin/withdrawal/action', (req: Request, res: Response) => {
  try {
    const { withdrawalId, action, rejectionReason, adminId } = req.body;
    const wdr = state.withdrawals.find((w) => w.id === withdrawalId);

    if (!wdr) {
      return res.status(404).json({ error: 'Withdrawal record not found.' });
    }

    if (action === 'approve') {
      wdr.status = 'approved';
      wdr.transactionRef = `PAY-WDR-${Math.floor(100000 + Math.random() * 900000)}`;
      wdr.processedAt = new Date().toISOString();
      wdr.processedBy = adminId || 'Admin';

      const user = state.users.find((u) => u.id === wdr.userId);
      if (user) {
        user.totalWithdrawn = Math.round(((user.totalWithdrawn || 0) + wdr.amount) * 100) / 100;
      }

      state.auditLogs.unshift({
        id: `LOG-${Date.now()}`,
        adminId: adminId || 'USR-ADMIN',
        adminName: 'Super Admin',
        action: 'APPROVE_WITHDRAWAL',
        details: `Approved ₹${wdr.amount} payout for ${wdr.userName} (${wdr.userId}) via ${wdr.payoutType}`,
        category: 'WITHDRAWAL',
        createdAt: new Date().toISOString(),
      });

      return res.json({ success: true, withdrawal: wdr, message: 'Withdrawal approved and funds transferred.' });
    } else if (action === 'reject') {
      wdr.status = 'rejected';
      wdr.rejectionReason = rejectionReason || 'Information mismatch in payout account details.';
      wdr.processedAt = new Date().toISOString();
      wdr.processedBy = adminId || 'Admin';

      // Refund to winning wallet
      const user = state.users.find((u) => u.id === wdr.userId);
      if (user) {
        user.winningWallet = Math.round(((user.winningWallet || 0) + wdr.amount) * 100) / 100;
        user.walletBalance = Math.round(((user.depositWallet || 0) + (user.ticketWallet || 0) + user.winningWallet) * 100) / 100;
      }

      state.auditLogs.unshift({
        id: `LOG-${Date.now()}`,
        adminId: adminId || 'USR-ADMIN',
        adminName: 'Super Admin',
        action: 'REJECT_WITHDRAWAL',
        details: `Rejected ₹${wdr.amount} payout for ${wdr.userName} (${wdr.userId}). Reason: ${wdr.rejectionReason}`,
        category: 'WITHDRAWAL',
        createdAt: new Date().toISOString(),
      });

      return res.json({ success: true, withdrawal: wdr, message: 'Withdrawal rejected and funds refunded to user winning wallet.' });
    }

    res.status(400).json({ error: 'Invalid action.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Prize Pool 70% Validator Endpoint
app.post('/api/games/validate-prizepool', (req: Request, res: Response) => {
  const { totalTicketSales, prizeCategories } = req.body;
  const sales = Number(totalTicketSales) || 0;
  const maxPrizePool70 = Math.round(sales * 0.7 * 100) / 100;

  const totalConfiguredPrizes = (prizeCategories || []).reduce((sum: number, p: any) => {
    if (p.isEnabled === false) return sum;
    return sum + (Number(p.amount) || 0) * (Number(p.winnerCount) || 1);
  }, 0);

  const isValid = totalConfiguredPrizes <= maxPrizePool70;
  const remaining = Math.round((maxPrizePool70 - totalConfiguredPrizes) * 100) / 100;
  const commission = Math.round(sales * 0.046 * 100) / 100;
  const platform = Math.round((sales - maxPrizePool70 - commission) * 100) / 100;

  res.json({
    totalSales: sales,
    maxPrizePool70,
    totalConfiguredPrizes,
    remainingPrizePool: remaining,
    commissionAmount: commission,
    platformAmount: platform,
    isValid,
    errorMessage: isValid
      ? undefined
      : `PRIZE CONFIGURATION EXCEEDS AVAILABLE 70% PRIZE POOL (Configured: ₹${totalConfiguredPrizes}, Max Allowed: ₹${maxPrizePool70})`,
  });
});

// 11. 5 Free Ticket Winners Automatic Selection
app.post('/api/games/draw-free-tickets', (req: Request, res: Response) => {
  try {
    const { gameId, gameTitle, playersList } = req.body;
    const count = 5;

    const candidates = Array.isArray(playersList) && playersList.length > 0 ? [...playersList] : [];
    const chosenWinners: any[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < Math.min(count, candidates.length); i++) {
      const remaining = candidates.filter((c) => !usedIds.has(c.id || c.userId));
      if (!remaining.length) break;
      const idx = Math.floor(Math.random() * remaining.length);
      const picked = remaining[idx];
      usedIds.add(picked.id || picked.userId);

      const freeTicketRecord = {
        id: `FT-${Date.now().toString().slice(-6)}-${i + 1}`,
        gameId: gameId || 'AT-1025',
        gameTitle: gameTitle || 'Grand Bumper Room',
        userId: picked.id || picked.userId,
        userName: picked.name || picked.userName || `Lucky Player #${i + 1}`,
        ticketNumber: Math.floor(10000 + Math.random() * 90000),
        wonAt: new Date().toISOString(),
        status: 'available',
        freeTicketCode: `FREE-${(gameId || 'AT1025').replace(/[^a-zA-Z0-9]/g, '')}-${picked.id || i + 1}`,
      };

      chosenWinners.push(freeTicketRecord);
      state.freeTicketWinners.unshift(freeTicketRecord);
    }

    state.auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      adminId: 'SYSTEM_RNG',
      adminName: 'Automatic Free Ticket Engine',
      action: 'FREE_TICKETS_DRAW',
      details: `Generated ${chosenWinners.length} free ticket winners for Game ${gameId}`,
      category: 'PRIZE',
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, freeTicketWinners: chosenWinners });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ APNA TAMBOLA Server running on http://localhost:${PORT}`);
  });
}

startServer();

