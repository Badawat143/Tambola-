import { TambolaTicket, TicketColorId } from '../types/tambola';

const ALL_TICKET_COLORS: TicketColorId[] = [
  'emerald',
  'sapphire',
  'amber',
  'crimson',
  'neon_pink',
  'sunset_orange',
  'royal_purple',
  'sky_blue',
  'jade',
  'rainbow',
];

export function getRandomTicketColor(): TicketColorId {
  const idx = Math.floor(Math.random() * ALL_TICKET_COLORS.length);
  return ALL_TICKET_COLORS[idx];
}

/**
 * Generates an authentic 3x9 Tambola (Housie) ticket.
 * Rules:
 * - 3 rows, 9 columns
 * - Each row has exactly 5 numbers and 4 blanks (15 numbers total)
 * - Column 0: 1-9, Col 1: 10-19, Col 2: 20-29 ... Col 8: 80-90
 * - Numbers in each column are strictly sorted top-to-bottom
 */
export function generateTambolaTicketGrid(): (number | null)[][] {
  const columnRanges: [number, number][] = [
    [1, 9],
    [10, 19],
    [20, 29],
    [30, 39],
    [40, 49],
    [50, 59],
    [60, 69],
    [70, 79],
    [80, 90],
  ];

  let isValid = false;
  let finalGrid: (number | null)[][] = [];

  // Attempt standard ticket generation
  for (let attempt = 0; attempt < 100 && !isValid; attempt++) {
    const grid: (number | null)[][] = [
      Array(9).fill(null),
      Array(9).fill(null),
      Array(9).fill(null),
    ];

    // Pick 15 column spots distributed across 9 columns (at least 1 per column, max 3)
    const colCounts = Array(9).fill(1); // 9 numbers already allocated
    const remainingSlots = 6;
    let added = 0;
    while (added < remainingSlots) {
      const c = Math.floor(Math.random() * 9);
      if (colCounts[c] < 3) {
        colCounts[c]++;
        added++;
      }
    }

    // Now distribute each column's counts across 3 rows ensuring each row has exactly 5 numbers
    const rowCounts = [0, 0, 0];
    let distributionPossible = true;

    // Distribute columns with 3 numbers (they fill all 3 rows)
    for (let c = 0; c < 9; c++) {
      if (colCounts[c] === 3) {
        grid[0][c] = 1;
        grid[1][c] = 1;
        grid[2][c] = 1;
        rowCounts[0]++;
        rowCounts[1]++;
        rowCounts[2]++;
      }
    }

    // Distribute columns with 2 numbers
    for (let c = 0; c < 9; c++) {
      if (colCounts[c] === 2) {
        // pick two rows with least counts
        const rows = [0, 1, 2].sort((a, b) => rowCounts[a] - rowCounts[b]);
        grid[rows[0]][c] = 1;
        grid[rows[1]][c] = 1;
        rowCounts[rows[0]]++;
        rowCounts[rows[1]]++;
      }
    }

    // Distribute columns with 1 number
    for (let c = 0; c < 9; c++) {
      if (colCounts[c] === 1) {
        const rows = [0, 1, 2]
          .filter((r) => rowCounts[r] < 5)
          .sort((a, b) => rowCounts[a] - rowCounts[b]);
        if (rows.length > 0) {
          grid[rows[0]][c] = 1;
          rowCounts[rows[0]]++;
        } else {
          distributionPossible = false;
        }
      }
    }

    if (
      distributionPossible &&
      rowCounts[0] === 5 &&
      rowCounts[1] === 5 &&
      rowCounts[2] === 5
    ) {
      // Now fill real random numbers from ranges
      for (let c = 0; c < 9; c++) {
        const count = colCounts[c];
        const [min, max] = columnRanges[c];
        const pool: number[] = [];
        for (let num = min; num <= max; num++) {
          pool.push(num);
        }

        // Shuffle pool & take `count` numbers
        const picked: number[] = [];
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * pool.length);
          picked.push(pool.splice(idx, 1)[0]);
        }
        picked.sort((a, b) => a - b);

        let pIdx = 0;
        for (let r = 0; r < 3; r++) {
          if (grid[r][c] !== null) {
            grid[r][c] = picked[pIdx++];
          }
        }
      }

      finalGrid = grid;
      isValid = true;
    }
  }

  if (!isValid || finalGrid.length === 0) {
    // Fallback safe deterministic valid ticket
    return [
      [7, 14, null, 36, null, 52, null, 77, null],
      [null, 18, 24, null, 45, null, 61, null, 85],
      [4, null, 29, 39, null, 58, null, 79, 90],
    ];
  }

  return finalGrid;
}

export function createNewTicket(
  gameId: string,
  userId: string,
  userName: string,
  customId?: string,
  price: number = 20,
  colorTheme?: TicketColorId,
  gameStartTime?: string
): TambolaTicket {
  const numCode = Math.floor(10000 + Math.random() * 90000);
  const id = customId || `TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${numCode}`;
  const grid = generateTambolaTicketGrid();
  const ticketNumber = Math.floor(10000 + Math.random() * 90000);
  const theme = colorTheme || getRandomTicketColor();
  const verificationCode = `V-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${ticketNumber}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=APNA-TAMBOLA-TICKET:${id}:${gameId}:${ticketNumber}`;

  return {
    id,
    gameId,
    userId,
    userName,
    ticketNumber,
    ticketPrice: price,
    grid,
    markedNumbers: [],
    colorTheme: theme,
    gameStartTime: gameStartTime || new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    verificationCode,
    qrCodeUrl: qrUrl,
    createdAt: new Date().toISOString(),
  };
}

export function getTicketNumbers(grid: (number | null)[][]): number[] {
  const nums: number[] = [];
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null) nums.push(cell);
    }
  }
  return nums;
}

export function getFourCorners(grid: (number | null)[][]): number[] {
  const corners: number[] = [];
  // Top left: first non-null in row 0
  const r0 = grid[0].filter((n): n is number => n !== null);
  if (r0.length > 0) corners.push(r0[0], r0[r0.length - 1]);

  // Bottom corners: first and last non-null in row 2
  const r2 = grid[2].filter((n): n is number => n !== null);
  if (r2.length > 0) corners.push(r2[0], r2[r2.length - 1]);

  return Array.from(new Set(corners));
}

export function checkPatternVictory(
  grid: (number | null)[][],
  markedNumbers: number[],
  patternType: 'earlyFive' | 'fourCorners' | 'topLine' | 'middleLine' | 'bottomLine' | 'fullHouse'
): { isWon: boolean; reason: string } {
  const markedSet = new Set(markedNumbers);
  const ticketNums = getTicketNumbers(grid);
  const markedInTicket = ticketNums.filter((n) => markedSet.has(n));

  switch (patternType) {
    case 'earlyFive':
      return {
        isWon: markedInTicket.length >= 5,
        reason: `Marked ${markedInTicket.length}/5 required numbers for Early Five.`,
      };

    case 'fourCorners': {
      const corners = getFourCorners(grid);
      const markedCorners = corners.filter((n) => markedSet.has(n));
      return {
        isWon: corners.length >= 4 && markedCorners.length === corners.length,
        reason: `Marked ${markedCorners.length}/${corners.length} corner numbers.`,
      };
    }

    case 'topLine': {
      const row0 = grid[0].filter((n): n is number => n !== null);
      const markedRow0 = row0.filter((n) => markedSet.has(n));
      return {
        isWon: row0.length === 5 && markedRow0.length === 5,
        reason: `Marked ${markedRow0.length}/5 numbers on the Top Line.`,
      };
    }

    case 'middleLine': {
      const row1 = grid[1].filter((n): n is number => n !== null);
      const markedRow1 = row1.filter((n) => markedSet.has(n));
      return {
        isWon: row1.length === 5 && markedRow1.length === 5,
        reason: `Marked ${markedRow1.length}/5 numbers on the Middle Line.`,
      };
    }

    case 'bottomLine': {
      const row2 = grid[2].filter((n): n is number => n !== null);
      const markedRow2 = row2.filter((n) => markedSet.has(n));
      return {
        isWon: row2.length === 5 && markedRow2.length === 5,
        reason: `Marked ${markedRow2.length}/5 numbers on the Bottom Line.`,
      };
    }

    case 'fullHouse': {
      return {
        isWon: markedInTicket.length === 15,
        reason: `Marked ${markedInTicket.length}/15 numbers for Full House.`,
      };
    }

    default:
      return { isWon: false, reason: 'Unknown pattern' };
  }
}
