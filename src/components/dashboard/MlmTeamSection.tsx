import React, { useState } from 'react';
import { User, ReferralDownlineStats } from '../../types/tambola';
import {
  Users,
  Percent,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Ticket,
  Sparkles,
} from 'lucide-react';

interface MlmTeamSectionProps {
  currentUser: User;
  downlineStats: ReferralDownlineStats;
}

export const MlmTeamSection: React.FC<MlmTeamSectionProps> = ({
  currentUser,
  downlineStats,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [treeExpanded, setTreeExpanded] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
  });

  const levelConfigs = [
    { level: 1, percent: '2.0%', members: 25, active: 18, earned: '₹1,450.00' },
    { level: 2, percent: '1.0%', members: 64, active: 48, earned: '₹980.00' },
    { level: 3, percent: '0.5%', members: 120, active: 85, earned: '₹540.00' },
    { level: 4, percent: '0.4%', members: 180, active: 110, earned: '₹320.00' },
    { level: 5, percent: '0.3%', members: 250, active: 160, earned: '₹210.00' },
    { level: 6, percent: '0.2%', members: 320, active: 195, earned: '₹140.00' },
    { level: 7, percent: '0.1%', members: 400, active: 240, earned: '₹70.00' },
    { level: 8, percent: '0.1%', members: 520, active: 310, earned: '₹40.00' },
  ];

  const totalTeamMembers = levelConfigs.reduce((acc, l) => acc + l.members, 0);

  // Mock tree nodes for visual representation
  const level1Nodes = [
    {
      id: 'AT10025',
      name: 'Rahul Sharma',
      status: 'Active',
      regDate: '12 Aug 2026',
      gameplay: '₹2,400',
      commission: '₹48.00',
    },
    {
      id: 'AT10030',
      name: 'Priya Verma',
      status: 'Active',
      regDate: '14 Aug 2026',
      gameplay: '₹1,800',
      commission: '₹36.00',
    },
    {
      id: 'AT10041',
      name: 'Amit Patel',
      status: 'Active',
      regDate: '18 Aug 2026',
      gameplay: '₹3,200',
      commission: '₹64.00',
    },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION 1: 8-LEVEL TEAM SUMMARY & COMMISSION STRUCTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 8-Level Clickable Grid (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#0c1236] via-[#111947] to-[#080c25] border border-blue-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  MY TEAM (8 LEVELS • {totalTeamMembers} MEMBERS)
                </h4>
                <p className="text-[10px] text-slate-400">Click any level to view member statistics</p>
              </div>
            </div>

            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
              Total 4.6% Pool
            </span>
          </div>

          {/* 8 Level Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {levelConfigs.map((lvl) => {
              const isSelected = selectedLevel === lvl.level;
              return (
                <button
                  key={lvl.level}
                  onClick={() => setSelectedLevel(lvl.level)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-300 text-slate-950 shadow-lg shadow-amber-500/30 scale-102'
                      : 'bg-black/40 border-white/10 hover:border-white/20 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase ${
                        isSelected ? 'text-slate-900' : 'text-amber-400'
                      }`}
                    >
                      Level {lvl.level}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-black/20 text-slate-950' : 'bg-white/10 text-cyan-300'
                      }`}
                    >
                      {lvl.percent}
                    </span>
                  </div>

                  <p
                    className={`text-lg font-black font-mono mt-1 ${
                      isSelected ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    {lvl.members} <span className="text-[10px] font-normal">Members</span>
                  </p>

                  <div className="flex items-center justify-between text-[9px] mt-1 pt-1 border-t border-black/10">
                    <span className={isSelected ? 'text-slate-900' : 'text-emerald-400'}>
                      ● {lvl.active} Active
                    </span>
                    <span className={`font-mono font-bold ${isSelected ? 'text-slate-950' : 'text-amber-300'}`}>
                      {lvl.earned}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Level Deep Dive */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm font-mono shadow">
                L{selectedLevel}
              </div>
              <div>
                <p className="font-bold text-white">
                  Level {selectedLevel} Detail Breakdown ({levelConfigs[selectedLevel - 1].percent} Commission)
                </p>
                <p className="text-slate-400 text-[11px]">
                  {levelConfigs[selectedLevel - 1].members} total downline users • {levelConfigs[selectedLevel - 1].active} actively purchasing tickets
                </p>
              </div>
            </div>

            <span className="font-mono font-bold text-emerald-400 text-sm">
              Earned: {levelConfigs[selectedLevel - 1].earned}
            </span>
          </div>
        </div>

        {/* 💎 COMMISSION STRUCTURE & RULES (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#1b0d2d] via-[#24133d] to-[#0f071a] border border-pink-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  💎 COMMISSION STRUCTURE
                </h4>
                <p className="text-[10px] text-slate-400">8-Level Gameplay Distribution</p>
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
              100% Automated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {levelConfigs.map((lvl) => (
              <div
                key={lvl.level}
                className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
              >
                <span className="text-slate-300 font-medium">Level {lvl.level}</span>
                <span className="font-mono font-bold text-amber-400">{lvl.percent}</span>
              </div>
            ))}
          </div>

          {/* Important Gameplay Notice Box */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Important Gameplay Rule</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Commission is generated <strong>only from eligible Ticket Gameplay</strong>, according to configured rules—not merely from wallet deposits.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: MLM STYLE TEAM TREE */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c0f2a] via-[#12163d] to-[#07091a] border border-cyan-500/30 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                🌳 VISUAL MLM TEAM TREE
              </h4>
              <p className="text-[10px] text-slate-400">Hierarchical downline structure & member tickets</p>
            </div>
          </div>

          <span className="text-xs font-mono text-cyan-300 font-bold">
            Root: {currentUser.id || 'AT10001'}
          </span>
        </div>

        {/* Tree Root Node */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-xl shadow-amber-500/25 border-2 border-amber-300 text-center max-w-xs w-full">
            <span className="text-[10px] font-black uppercase tracking-wider">MY ID (ROOT SPONSOR)</span>
            <p className="text-lg font-black font-mono">{currentUser.id || 'AT10001'} ({currentUser.name})</p>
            <div className="flex justify-center gap-3 text-[10px] font-bold mt-1 pt-1 border-t border-black/20">
              <span>Directs: 25</span>
              <span>Team: {totalTeamMembers}</span>
            </div>
          </div>

          {/* Connecting Line */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-cyan-400 my-1"></div>

          {/* Level 1 Node Header */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono">
            <span>LEVEL 1 DOWNLINES ({levelConfigs[0].members} Members • 2.0%)</span>
          </div>

          {/* Connecting Lines to Children */}
          <div className="w-0.5 h-4 bg-cyan-400 my-1"></div>

          {/* Level 1 Children Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mt-2">
            {level1Nodes.map((node) => (
              <div
                key={node.id}
                className="p-4 rounded-2xl bg-[#131940] border border-cyan-500/30 hover:border-cyan-400 transition space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <strong className="text-white text-xs font-mono">{node.id}</strong>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    {node.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold text-white">{node.name}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> Reg: {node.regDate}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                  <div className="p-1.5 rounded-lg bg-black/40">
                    <span className="text-[9px] text-slate-400 block">Ticket Gameplay</span>
                    <span className="font-mono font-bold text-pink-300">{node.gameplay}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40">
                    <span className="text-[9px] text-slate-400 block">Commission</span>
                    <span className="font-mono font-bold text-amber-300">{node.commission}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
