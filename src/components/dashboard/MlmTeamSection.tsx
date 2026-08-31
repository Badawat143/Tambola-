import React, { useState } from 'react';
import { User, ReferralDownlineStats } from '../../types/tambola';
import { isDirectlyReferredBy } from '../../utils/referralEngine';
import { DownlineTreeView } from './DownlineTreeView';
import { useTambola } from '../../context/TambolaContext';
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
  GitFork,
  Copy,
  Share2,
} from 'lucide-react';

interface MlmTeamSectionProps {
  currentUser: User;
  downlineStats: ReferralDownlineStats;
}

export const MlmTeamSection: React.FC<MlmTeamSectionProps> = ({
  currentUser,
  downlineStats,
}) => {
  const { allUsers } = useTambola();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const defaultRates = [
    { level: 1, percent: '2.0%' },
    { level: 2, percent: '1.0%' },
    { level: 3, percent: '0.5%' },
    { level: 4, percent: '0.4%' },
    { level: 5, percent: '0.3%' },
    { level: 6, percent: '0.2%' },
    { level: 7, percent: '0.1%' },
    { level: 8, percent: '0.1%' },
  ];

  // Derive dynamic level stats
  const levelConfigs = defaultRates.map((rate) => {
    const stat = downlineStats?.levelStats?.find((ls) => ls.level === rate.level);
    const membersCount = stat ? stat.membersCount : 0;
    const earned = stat ? `₹${stat.totalEarnings.toFixed(2)}` : '₹0.00';
    return {
      level: rate.level,
      percent: rate.percent,
      members: membersCount,
      active: membersCount,
      earned,
    };
  });

  const totalTeamMembers =
    downlineStats?.totalTeamCount ||
    levelConfigs.reduce((acc, l) => acc + l.members, 0);

  const handleCopyLink = () => {
    if (downlineStats?.referralLink) {
      navigator.clipboard.writeText(downlineStats.referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

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
                  Level {selectedLevel} Detail Breakdown ({levelConfigs[selectedLevel - 1]?.percent} Commission)
                </p>
                <p className="text-slate-400 text-[11px]">
                  {levelConfigs[selectedLevel - 1]?.members} total downline users registered under Level {selectedLevel}
                </p>
              </div>
            </div>

            <span className="font-mono font-bold text-emerald-400 text-sm">
              Earned: {levelConfigs[selectedLevel - 1]?.earned}
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

      {/* SECTION 2: MLM STYLE INTERACTIVE TEAM TREE */}
      <DownlineTreeView currentUser={currentUser} allUsers={allUsers} />
    </div>
  );
};
