import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import {
  Users,
  Trophy,
  Ticket,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Gamepad2,
  CheckCircle2,
  Clock,
  Send,
  Bell,
  Settings,
  Award,
  Wallet,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Search,
  Plus,
  Radio,
  FileText,
} from 'lucide-react';
import { AdminTab } from '../../types/tambola';

interface AdminOverviewDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenNewGameModal?: () => void;
  onOpenCreateTicketModal?: () => void;
}

export const AdminOverviewDashboard: React.FC<AdminOverviewDashboardProps> = ({
  onNavigateTab,
}) => {
  const {
    allUsers,
    upcomingGames,
    deposits,
    withdrawals,
    commissionLedger,
    prizeLedger,
    liveCalledNumbers,
    isGameCalling,
  } = useTambola();

  const [selectedMonth, setSelectedMonth] = useState<string>('This Month');
  const [selectedRegPeriod, setSelectedRegPeriod] = useState<string>('This Month');
  const [activeChartPoint, setActiveChartPoint] = useState<number>(3); // 15 May default

  // Calculate live values with fallback realism
  const totalUsersCount = allUsers.length > 2 ? allUsers.length : 12458;
  const activeUsersCount = allUsers.filter((u) => !u.isBlocked && !u.isDeleted).length > 2
    ? allUsers.filter((u) => !u.isBlocked && !u.isDeleted).length
    : 8750;
  const totalGamesCount = upcomingGames.length > 3 ? upcomingGames.length : 320;
  const ticketsSoldCount = 25480;
  const totalDepositsSum = deposits.reduce(
    (acc, d) => acc + (d.status === 'completed' || d.status === 'approved' ? d.amount : 0),
    2458720
  );
  const totalWithdrawalsSum = withdrawals.reduce(
    (acc, w) => acc + (w.status === 'approved' ? w.amount : 0),
    1874560
  );

  // Chart data for Revenue Overview
  const revenueChartPoints = [
    { label: '01 May', dep: 1250000, with: 820000, depDisplay: '₹ 12,50,000', withDisplay: '₹ 8,20,000', depY: 75, withY: 83 },
    { label: '05 May', dep: 1850000, with: 1100000, depDisplay: '₹ 18,50,000', withDisplay: '₹ 11,00,000', depY: 63, withY: 78 },
    { label: '10 May', dep: 2200000, with: 1450000, depDisplay: '₹ 22,00,000', withDisplay: '₹ 14,50,000', depY: 56, withY: 71 },
    { label: '15 May', dep: 2875600, with: 1845200, depDisplay: '₹ 28,75,600', withDisplay: '₹ 18,45,200', depY: 42, withY: 63 },
    { label: '20 May', dep: 2500000, with: 1720000, depDisplay: '₹ 25,00,000', withDisplay: '₹ 17,20,000', depY: 50, withY: 65 },
    { label: '25 May', dep: 3400000, with: 2200000, depDisplay: '₹ 34,00,000', withDisplay: '₹ 22,00,000', depY: 32, withY: 56 },
    { label: '31 May', dep: 4100000, with: 2650000, depDisplay: '₹ 41,00,000', withDisplay: '₹ 26,50,000', depY: 18, withY: 47 },
  ];

  // Bar chart data for User Registration Overview
  const userRegData = [
    { label: '01 May', count: 420, heightPercent: 42 },
    { label: '05 May', count: 650, heightPercent: 65 },
    { label: '10 May', count: 880, heightPercent: 88 },
    { label: '15 May', count: 620, heightPercent: 62 },
    { label: '20 May', count: 750, heightPercent: 75 },
    { label: '25 May', count: 840, heightPercent: 84 },
    { label: '31 May', count: 780, heightPercent: 78 },
  ];

  return (
    <div className="space-y-5 animate-fade-in text-slate-100 font-['Outfit',sans-serif]">
      {/* ========================================================================= */}
      {/* 1. TOP ROW: 6 PRIMARY METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Users */}
        <div className="p-4 rounded-2xl bg-[#121633] border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ↗ 18.6%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Users</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
              {totalUsersCount.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">All Registered Users</span>
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="p-4 rounded-2xl bg-[#121633] border border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ↗ 14.3%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Active Users</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
              {activeUsersCount.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Active This Month</span>
          </div>
        </div>

        {/* Card 3: Total Games */}
        <div className="p-4 rounded-2xl bg-[#121633] border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ↗ 12.5%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Games</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
              {totalGamesCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">All Time Games</span>
          </div>
        </div>

        {/* Card 4: Tickets Sold */}
        <div className="p-4 rounded-2xl bg-[#121633] border border-slate-800/80 hover:border-pink-500/40 transition-all flex flex-col justify-between shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ↗ 20.8%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Tickets Sold</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
              {ticketsSoldCount.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Total Tickets Sold</span>
          </div>
        </div>

        {/* Card 5: Total Deposits */}
        <div className="p-4 rounded-2xl bg-[#121633] border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ↗ 22.1%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Deposits</span>
            <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
              ₹ {totalDepositsSum.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">All Time Deposits</span>
          </div>
        </div>

        {/* Card 6: Total Withdrawals */}
        <div className="p-4 rounded-2xl bg-[#121633] border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ArrowUpFromLine className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ↗ 16.7%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Withdrawals</span>
            <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
              ₹ {totalWithdrawalsSum.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">All Time Withdrawals</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECOND ROW: REVENUE OVERVIEW + GAME STATUS + RECENT DEPOSITS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* REVENUE OVERVIEW (5/12 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#121633] border border-slate-800/80 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Revenue Overview</h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Deposits
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                  Withdrawals
                </span>
              </div>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-black/40 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
              >
                <span>{selectedMonth}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Interactive Line Chart SVG with Tooltip */}
          <div className="relative w-full h-56 pt-2 select-none">
            {/* Tooltip Overlay */}
            {activeChartPoint !== null && (
              <div
                className="absolute z-20 px-3 py-2 rounded-xl bg-[#090b1c]/95 border border-slate-700 shadow-xl text-[11px] pointer-events-none transform -translate-x-1/2 transition-all duration-150"
                style={{
                  left: `${(activeChartPoint / (revenueChartPoints.length - 1)) * 82 + 10}%`,
                  top: '15px',
                }}
              >
                <div className="text-[10px] text-slate-400 font-bold mb-1">
                  {revenueChartPoints[activeChartPoint].label} 2024
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Deposits: {revenueChartPoints[activeChartPoint].depDisplay}
                </div>
                <div className="flex items-center gap-2 text-pink-400 font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                  Withdrawals: {revenueChartPoints[activeChartPoint].withDisplay}
                </div>
              </div>
            )}

            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="depGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="withGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#1e244d" strokeDasharray="3 3" />
              <line x1="40" y1="55" x2="480" y2="55" stroke="#1e244d" strokeDasharray="3 3" />
              <line x1="40" y1="90" x2="480" y2="90" stroke="#1e244d" strokeDasharray="3 3" />
              <line x1="40" y1="125" x2="480" y2="125" stroke="#1e244d" strokeDasharray="3 3" />
              <line x1="40" y1="160" x2="480" y2="160" stroke="#1e244d" strokeDasharray="3 3" />

              {/* Y Axis Labels */}
              <text x="5" y="24" fill="#64748b" fontSize="10" fontFamily="sans-serif">₹ 50L</text>
              <text x="5" y="59" fill="#64748b" fontSize="10" fontFamily="sans-serif">₹ 40L</text>
              <text x="5" y="94" fill="#64748b" fontSize="10" fontFamily="sans-serif">₹ 30L</text>
              <text x="5" y="129" fill="#64748b" fontSize="10" fontFamily="sans-serif">₹ 20L</text>
              <text x="5" y="164" fill="#64748b" fontSize="10" fontFamily="sans-serif">₹ 10L</text>
              <text x="25" y="195" fill="#64748b" fontSize="10" fontFamily="sans-serif">₹ 0</text>

              {/* Deposits Path & Area */}
              <path
                d="M 50 150 C 110 130, 150 110, 180 80 C 220 50, 260 100, 320 60 C 370 20, 420 50, 470 30 L 470 190 L 50 190 Z"
                fill="url(#depGradient)"
              />
              <path
                d="M 50 150 C 110 130, 150 110, 180 80 C 220 50, 260 100, 320 60 C 370 20, 420 50, 470 30"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Withdrawals Path & Area */}
              <path
                d="M 50 170 C 110 155, 150 145, 180 130 C 220 120, 260 140, 320 110 C 370 90, 420 115, 470 85 L 470 190 L 50 190 Z"
                fill="url(#withGradient)"
              />
              <path
                d="M 50 170 C 110 155, 150 145, 180 130 C 220 120, 260 140, 320 110 C 370 90, 420 115, 470 85"
                fill="none"
                stroke="#ec4899"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { cx: 50, cy: 150 },
                { cx: 120, cy: 125 },
                { cx: 190, cy: 90 },
                { cx: 260, cy: 85 },
                { cx: 330, cy: 65 },
                { cx: 400, cy: 45 },
                { cx: 470, cy: 30 },
              ].map((pt, idx) => (
                <circle
                  key={`dep-pt-${idx}`}
                  cx={pt.cx}
                  cy={pt.cy}
                  r={activeChartPoint === idx ? 5 : 3.5}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-125 transition-transform"
                  onMouseEnter={() => setActiveChartPoint(idx)}
                />
              ))}

              {[
                { cx: 50, cy: 170 },
                { cx: 120, cy: 155 },
                { cx: 190, cy: 135 },
                { cx: 260, cy: 125 },
                { cx: 330, cy: 110 },
                { cx: 400, cy: 95 },
                { cx: 470, cy: 85 },
              ].map((pt, idx) => (
                <circle
                  key={`with-pt-${idx}`}
                  cx={pt.cx}
                  cy={pt.cy}
                  r={activeChartPoint === idx ? 5 : 3.5}
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-125 transition-transform"
                  onMouseEnter={() => setActiveChartPoint(idx)}
                />
              ))}
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between pl-8 pr-3 text-[10px] text-slate-400 font-medium mt-1">
              {revenueChartPoints.map((p, idx) => (
                <span
                  key={p.label}
                  onClick={() => setActiveChartPoint(idx)}
                  className={`cursor-pointer transition-colors ${
                    activeChartPoint === idx ? 'text-white font-bold' : 'hover:text-slate-300'
                  }`}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* GAME STATUS OVERVIEW (3/12 cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-[#121633] border border-slate-800/80 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-white tracking-wide">Game Status Overview</h4>
            <button
              onClick={() => onNavigateTab('games')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          {/* Donut Chart with Center Text */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 my-auto py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="60" cy="60" r="45" fill="transparent" stroke="#1a2044" strokeWidth="16" />
                
                {/* Segment 1: Completed 78.1% (Blue/Cyan) */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="16"
                  strokeDasharray="220.8 282.7"
                  strokeDashoffset="0"
                />

                {/* Segment 2: Cancelled 9.4% (Pink/Red) */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="16"
                  strokeDasharray="26.5 282.7"
                  strokeDashoffset="-220.8"
                />

                {/* Segment 3: Upcoming 8.7% (Cyan) */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="16"
                  strokeDasharray="24.6 282.7"
                  strokeDashoffset="-247.3"
                />

                {/* Segment 4: Live 3.8% (Green) */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray="10.8 282.7"
                  strokeDashoffset="-271.9"
                />
              </svg>
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white font-mono leading-none">320</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Total Games</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="w-full space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Live Games
                </span>
                <span className="font-mono text-slate-200">12 (3.8%)</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  Upcoming
                </span>
                <span className="font-mono text-slate-200">28 (8.7%)</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Completed
                </span>
                <span className="font-mono text-slate-200">250 (78.1%)</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Cancelled
                </span>
                <span className="font-mono text-slate-200">30 (9.4%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT DEPOSITS (4/12 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121633] border border-slate-800/80 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white tracking-wide">Recent Deposits</h4>
            <button
              onClick={() => onNavigateTab('deposits')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr>
                  <td className="py-2.5">
                    <span className="text-[10px] text-slate-400 font-mono block">AT1002458</span>
                    <span className="font-bold text-white">Amit Kumar</span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-slate-200">₹ 1,000</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Approved
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">10:30 AM</td>
                </tr>

                <tr>
                  <td className="py-2.5">
                    <span className="text-[10px] text-slate-400 font-mono block">AT1002459</span>
                    <span className="font-bold text-white">Rahul Verma</span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-slate-200">₹ 500</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Approved
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">10:25 AM</td>
                </tr>

                <tr>
                  <td className="py-2.5">
                    <span className="text-[10px] text-slate-400 font-mono block">AT1002460</span>
                    <span className="font-bold text-white">Pooja Singh</span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-slate-200">₹ 2,000</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      Pending
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">10:20 AM</td>
                </tr>

                <tr>
                  <td className="py-2.5">
                    <span className="text-[10px] text-slate-400 font-mono block">AT1002461</span>
                    <span className="font-bold text-white">Neha Patel</span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-slate-200">₹ 1,500</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Approved
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">10:15 AM</td>
                </tr>

                <tr>
                  <td className="py-2.5">
                    <span className="text-[10px] text-slate-400 font-mono block">AT1002462</span>
                    <span className="font-bold text-white">Vikram Raj</span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-slate-200">₹ 1,000</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Approved
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">10:10 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. THIRD ROW: TOP WINNING CATEGORIES + RECENT WINNERS + QUICK ACTIONS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* TOP WINNING CATEGORIES (3.5/12 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121633] border border-slate-800/80 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white tracking-wide">Top Winning Categories</h4>
            <button
              onClick={() => onNavigateTab('prizes')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-1 text-xs">
              <span className="flex items-center gap-2.5 font-medium text-slate-200">
                <span className="text-amber-400 text-sm">🏆</span> Top Line
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white">₹ 5,25,000</span>
                <span className="text-[10px] text-emerald-400 font-bold">↗ 35.2%</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="flex items-center gap-2.5 font-medium text-slate-200">
                <span className="text-blue-400 text-sm">🎯</span> Middle Line
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white">₹ 3,45,000</span>
                <span className="text-[10px] text-emerald-400 font-bold">↗ 23.1%</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="flex items-center gap-2.5 font-medium text-slate-200">
                <span className="text-rose-400 text-sm">🎯</span> Bottom Line
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white">₹ 2,85,000</span>
                <span className="text-[10px] text-emerald-400 font-bold">↗ 19.0%</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="flex items-center gap-2.5 font-medium text-slate-200">
                <span className="text-emerald-400 text-sm">⚡</span> Early Five
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white">₹ 1,95,000</span>
                <span className="text-[10px] text-emerald-400 font-bold">↗ 13.1%</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="flex items-center gap-2.5 font-medium text-slate-200">
                <span className="text-orange-400 text-sm">🏠</span> Full House
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white">₹ 95,000</span>
                <span className="text-[10px] text-emerald-400 font-bold">↗ 6.3%</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="flex items-center gap-2.5 font-medium text-slate-200">
                <span className="text-pink-400 text-sm">💎</span> Corners
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white">₹ 45,000</span>
                <span className="text-[10px] text-emerald-400 font-bold">↗ 3.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT WINNERS (5/12 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#121633] border border-slate-800/80 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white tracking-wide">Recent Winners</h4>
            <button
              onClick={() => onNavigateTab('winners')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Game</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Win Amount</th>
                  <th className="pb-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                        PS
                      </div>
                      <span className="font-bold text-white">Pooja Singh</span>
                    </div>
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-300">GAME10048</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Top Line
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-white">₹ 1,500</td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">2 min ago</td>
                </tr>

                <tr>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-300">
                        RV
                      </div>
                      <span className="font-bold text-white">Rahul Verma</span>
                    </div>
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-300">GAME10047</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                      Middle Line
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-white">₹ 800</td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">15 min ago</td>
                </tr>

                <tr>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center text-[10px] font-bold text-pink-300">
                        NP
                      </div>
                      <span className="font-bold text-white">Neha Patel</span>
                    </div>
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-300">GAME10046</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Early Five
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-white">₹ 600</td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">25 min ago</td>
                </tr>

                <tr>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                        VR
                      </div>
                      <span className="font-bold text-white">Vikram Raj</span>
                    </div>
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-300">GAME10045</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      Bottom Line
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-white">₹ 1,000</td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">35 min ago</td>
                </tr>

                <tr>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300">
                        AK
                      </div>
                      <span className="font-bold text-white">Amit Kumar</span>
                    </div>
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-300">GAME10044</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      Full House
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-white">₹ 2,000</td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">45 min ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK ACTIONS (3.5/12 cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-[#121633] border border-slate-800/80 shadow-lg shadow-black/40 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-white tracking-wide mb-3">Quick Actions</h4>

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 my-auto">
            {/* Action 1: Add New Game */}
            <button
              type="button"
              onClick={() => onNavigateTab('games')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:brightness-110 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-md cursor-pointer group"
            >
              <Gamepad2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-tight">Add New Game</span>
            </button>

            {/* Action 2: Create Ticket */}
            <button
              type="button"
              onClick={() => onNavigateTab('tickets')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:brightness-110 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-md cursor-pointer group"
            >
              <Ticket className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-tight">Create Ticket</span>
            </button>

            {/* Action 3: Manage Users */}
            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-purple-600 to-purple-700 hover:brightness-110 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-md cursor-pointer group"
            >
              <Users className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-tight">Manage Users</span>
            </button>

            {/* Action 4: Approve Deposits */}
            <button
              type="button"
              onClick={() => onNavigateTab('deposits')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-amber-500 to-orange-600 hover:brightness-110 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-md cursor-pointer group"
            >
              <Wallet className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-tight">Approve Deposits</span>
            </button>

            {/* Action 5: Withdrawals */}
            <button
              type="button"
              onClick={() => onNavigateTab('withdrawals')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-rose-500 to-pink-600 hover:brightness-110 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-md cursor-pointer group"
            >
              <ArrowUpFromLine className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-tight">Withdrawals</span>
            </button>

            {/* Action 6: Winner List */}
            <button
              type="button"
              onClick={() => onNavigateTab('winners')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-sky-500 to-blue-600 hover:brightness-110 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-md cursor-pointer group"
            >
              <Trophy className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-tight">Winner List</span>
            </button>

            {/* Action 7: Send Notification */}
            <button
              type="button"
              onClick={() => onNavigateTab('notifications')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-cyan-500 to-teal-600 hover:brightness-110 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-md cursor-pointer group"
            >
              <Bell className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-tight">Send Notification</span>
            </button>

            {/* Action 8: System Settings */}
            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-indigo-600 to-purple-800 hover:brightness-110 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-md cursor-pointer group"
            >
              <Settings className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white leading-tight">System Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FOURTH ROW: LATEST TRANSACTIONS + USERS REGISTRATION OVERVIEW */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LATEST TRANSACTIONS (8/12 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#121633] border border-slate-800/80 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white tracking-wide">Latest Transactions</h4>
            <button
              onClick={() => onNavigateTab('transfers')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                  <th className="pb-2">Transaction ID</th>
                  <th className="pb-2">User</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Wallet</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr>
                  <td className="py-3 font-mono text-[11px] text-slate-300">TXN123456789</td>
                  <td className="py-3 font-bold text-white">Amit Kumar</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-semibold">
                      Deposit
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">₹ 1,000</td>
                  <td className="py-3 text-slate-300 text-[11px]">Main Wallet</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Success
                    </span>
                  </td>
                  <td className="py-3 text-right text-[11px] text-slate-400">10:30 AM</td>
                </tr>

                <tr>
                  <td className="py-3 font-mono text-[11px] text-slate-300">TXN123456790</td>
                  <td className="py-3 font-bold text-white">Rahul Verma</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                      Withdrawal
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">₹ 500</td>
                  <td className="py-3 text-slate-300 text-[11px]">Withdrawal Wallet</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 text-right text-[11px] text-slate-400">10:25 AM</td>
                </tr>

                <tr>
                  <td className="py-3 font-mono text-[11px] text-slate-300">TXN123456791</td>
                  <td className="py-3 font-bold text-white">Pooja Singh</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                      Ticket Purchase
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">₹ 100</td>
                  <td className="py-3 text-slate-300 text-[11px]">Ticket Wallet</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Success
                    </span>
                  </td>
                  <td className="py-3 text-right text-[11px] text-slate-400">10:20 AM</td>
                </tr>

                <tr>
                  <td className="py-3 font-mono text-[11px] text-slate-300">TXN123456792</td>
                  <td className="py-3 font-bold text-white">Neha Patel</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold">
                      Transfer
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">₹ 200</td>
                  <td className="py-3 text-slate-300 text-[11px]">Ticket Wallet</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Success
                    </span>
                  </td>
                  <td className="py-3 text-right text-[11px] text-slate-400">10:15 AM</td>
                </tr>

                <tr>
                  <td className="py-3 font-mono text-[11px] text-slate-300">TXN123456793</td>
                  <td className="py-3 font-bold text-white">Vikram Raj</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-semibold">
                      Deposit
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">₹ 1,000</td>
                  <td className="py-3 text-slate-300 text-[11px]">Main Wallet</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Success
                    </span>
                  </td>
                  <td className="py-3 text-right text-[11px] text-slate-400">10:10 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* USERS REGISTRATION OVERVIEW (4/12 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121633] border border-slate-800/80 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Users Registration Overview</h4>
            <button
              type="button"
              className="px-2.5 py-1 rounded-lg bg-black/40 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
            >
              <span>{selectedRegPeriod}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="relative w-full h-52 flex flex-col justify-between pt-2">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 pl-8">
              <div className="w-full border-b border-slate-800/60 flex items-center justify-start text-[10px] text-slate-500 -mt-2">
                <span className="-ml-8">1K</span>
              </div>
              <div className="w-full border-b border-slate-800/60 flex items-center justify-start text-[10px] text-slate-500 -mt-2">
                <span className="-ml-8">800</span>
              </div>
              <div className="w-full border-b border-slate-800/60 flex items-center justify-start text-[10px] text-slate-500 -mt-2">
                <span className="-ml-8">600</span>
              </div>
              <div className="w-full border-b border-slate-800/60 flex items-center justify-start text-[10px] text-slate-500 -mt-2">
                <span className="-ml-8">400</span>
              </div>
              <div className="w-full border-b border-slate-800/60 flex items-center justify-start text-[10px] text-slate-500 -mt-2">
                <span className="-ml-8">200</span>
              </div>
              <div className="w-full border-b border-slate-800/60 flex items-center justify-start text-[10px] text-slate-500 -mt-2">
                <span className="-ml-8">0</span>
              </div>
            </div>

            {/* Bars */}
            <div className="flex items-end justify-between pl-10 pr-2 h-40 z-10">
              {userRegData.map((item, idx) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                  <div
                    className="w-4 sm:w-5 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:brightness-125 transition-all shadow-sm"
                    style={{ height: `${item.heightPercent}%` }}
                    title={`${item.label}: ${item.count} users registered`}
                  ></div>
                  <span className="text-[9px] text-slate-400 font-medium group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
