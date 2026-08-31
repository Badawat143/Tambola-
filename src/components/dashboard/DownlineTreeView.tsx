import React, { useState, useMemo } from 'react';
import { User } from '../../types/tambola';
import {
  DownlineTreeNode,
  buildDownlineTreeHierarchy,
  isDirectlyReferredBy,
} from '../../utils/referralEngine';
import {
  Users,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Share2,
  Copy,
  Sparkles,
  GitFork,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Eye,
  X,
} from 'lucide-react';

interface DownlineTreeViewProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser?: (user: User) => void;
}

export const DownlineTreeView: React.FC<DownlineTreeViewProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');
  const [expandedNodes, setExpandedNodes] = useState<{ [nodeId: string]: boolean }>({
    [currentUser.id.toUpperCase()]: true,
  });
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<DownlineTreeNode | null>(null);
  const [viewMode, setViewMode] = useState<'visual_tree' | 'nested_tree' | 'level_cards'>('visual_tree');
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Compute hierarchical tree
  const treeRoot = useMemo(() => {
    return buildDownlineTreeHierarchy(currentUser, allUsers, 8);
  }, [currentUser, allUsers]);

  // Compute direct referrals
  const directReferrals = useMemo(() => {
    return allUsers.filter((u) => isDirectlyReferredBy(u, currentUser));
  }, [allUsers, currentUser]);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId.toUpperCase()]: !prev[nodeId.toUpperCase()],
    }));
  };

  const expandAll = () => {
    const all: { [key: string]: boolean } = {};
    function traverse(n: DownlineTreeNode) {
      all[n.id.toUpperCase()] = true;
      n.children.forEach(traverse);
    }
    traverse(treeRoot);
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes({ [currentUser.id.toUpperCase()]: true });
  };

  // Node details modal
  const handleOpenDetails = (node: DownlineTreeNode, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedNodeDetails(node);
  };

  // Render visual tree branch node recursively
  const renderVisualTreeNode = (node: DownlineTreeNode, depth: number = 0) => {
    const isRoot = node.level === 0;
    const isExpanded = !!expandedNodes[node.id.toUpperCase()];
    const hasChildren = node.children.length > 0;

    // Filter match check
    const matchesSearch =
      !searchQuery ||
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.referralCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevelFilter === 'all' || node.level === selectedLevelFilter;

    const isVisible = (matchesSearch && matchesLevel) || isRoot;

    // Gradient styling per level
    const levelColors = [
      'from-amber-500 to-yellow-600 border-amber-400 text-slate-950 shadow-amber-500/20', // Root
      'from-purple-600 to-indigo-700 border-purple-400 text-white shadow-purple-500/20', // L1
      'from-pink-600 to-rose-700 border-pink-400 text-white shadow-pink-500/20', // L2
      'from-cyan-600 to-blue-700 border-cyan-400 text-white shadow-cyan-500/20', // L3
      'from-emerald-600 to-teal-700 border-emerald-400 text-white shadow-emerald-500/20', // L4
      'from-orange-600 to-amber-700 border-orange-400 text-white shadow-orange-500/20', // L5
      'from-violet-600 to-purple-800 border-violet-400 text-white shadow-violet-500/20', // L6
      'from-red-600 to-rose-800 border-red-400 text-white shadow-red-500/20', // L7
      'from-slate-700 to-slate-900 border-slate-500 text-white shadow-slate-500/20', // L8
    ];

    const cardGradient = levelColors[Math.min(node.level, levelColors.length - 1)];

    return (
      <div key={node.id} className="flex flex-col items-center select-none">
        {/* The Node Box */}
        <div
          onClick={() => handleOpenDetails(node)}
          className={`relative group cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
            isRoot ? 'w-64 sm:w-72' : 'w-52 sm:w-60'
          } rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br ${cardGradient} border-2 shadow-xl ${
            !isVisible ? 'opacity-40 grayscale' : 'opacity-100'
          }`}
        >
          {/* Level Badge */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span
              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isRoot
                  ? 'bg-black text-amber-300'
                  : 'bg-black/40 text-white border border-white/20'
              }`}
            >
              {isRoot ? '👑 YOU (ROOT)' : `LEVEL ${node.level} (DOWNLINE)`}
            </span>

            <span className="flex items-center gap-1 text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{node.status}</span>
            </span>
          </div>

          {/* User Name & ID */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                isRoot ? 'bg-black text-amber-300' : 'bg-white/20 text-white'
              }`}
            >
              {node.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <h5 className="text-xs sm:text-sm font-black truncate">{node.name}</h5>
              <div className="flex items-center gap-1.5 font-mono text-[10px] opacity-90">
                <span>{node.id}</span>
                <span>•</span>
                <span>Code: {node.referralCode}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[10px]">
            <span className="font-bold flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Directs: {node.children.length}</span>
            </span>
            <span className="font-bold opacity-90">
              Team: {node.totalTeamCount}
            </span>
          </div>

          {/* Expand/Collapse Toggle Button for children */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border shadow-lg cursor-pointer transition-transform ${
                isExpanded
                  ? 'bg-amber-400 text-black border-amber-300 rotate-180'
                  : 'bg-indigo-600 text-white border-indigo-400'
              }`}
              title={isExpanded ? 'Collapse team branch' : 'Expand team branch'}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Child branches if expanded */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center w-full mt-5">
            {/* Top vertical branch from parent */}
            <div className="w-0.5 h-4 bg-gradient-to-b from-amber-400 to-indigo-500"></div>

            {/* Horizontal branch line connecting all children */}
            {node.children.length > 1 && (
              <div className="w-[85%] max-w-full h-0.5 bg-indigo-500/80 mb-4"></div>
            )}

            {/* Children grid */}
            <div
              className={`flex flex-wrap justify-center items-start gap-4 sm:gap-6 w-full ${
                node.children.length === 1 ? 'mt-0' : ''
              }`}
            >
              {node.children.map((child) => renderVisualTreeNode(child, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Nested List Format
  const renderNestedNode = (node: DownlineTreeNode, depth: number = 0) => {
    const isExpanded = !!expandedNodes[node.id.toUpperCase()];
    const hasChildren = node.children.length > 0;
    const isRoot = node.level === 0;

    return (
      <div key={node.id} className="space-y-1">
        <div
          onClick={() => handleOpenDetails(node)}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer hover:bg-white/5 ${
            isRoot
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : node.level === 1
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
              : 'bg-black/30 border-white/5 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className="p-1 rounded hover:bg-white/10 text-slate-300 cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            ) : (
              <span className="w-5.5 text-center text-slate-600 text-xs">•</span>
            )}

            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] shrink-0">
              {node.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">{node.name}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300 border border-amber-400/30">
                  {node.id}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  Level {node.level}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400 text-[11px]">
              Directs: <strong className="text-white">{node.children.length}</strong>
            </span>
            <span className="text-slate-400 text-[11px]">
              Team: <strong className="text-pink-400">{node.totalTeamCount}</strong>
            </span>
            <button
              onClick={(e) => handleOpenDetails(node, e)}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
              title="View Profile Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1 pl-2 border-l border-indigo-500/20 ml-4">
            {node.children.map((child) => renderNestedNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header Toolbar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0c0f2f] via-[#14123d] to-[#1f0b38] border border-purple-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                <GitFork className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>8-LEVEL DOWNLINE NETWORK TREE</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Live Auto-Sync
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Interactive real-time visualization of your direct and indirect team hierarchy.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              Collapse
            </button>
            <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/10">
              <button
                onClick={() => setViewMode('visual_tree')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'visual_tree'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Visual Tree
              </button>
              <button
                onClick={() => setViewMode('nested_tree')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'nested_tree'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hierarchy List
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Level 1 (Directs)</span>
            <p className="text-xl font-black text-amber-300 font-mono mt-0.5">
              {directReferrals.length}
            </p>
            <span className="text-[9px] text-emerald-400 font-semibold">2.0% Lifetime Commission</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Downline Team</span>
            <p className="text-xl font-black text-pink-400 font-mono mt-0.5">
              {treeRoot.totalTeamCount}
            </p>
            <span className="text-[9px] text-purple-300">Across 8 Levels</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Direct Income</span>
            <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              ₹{currentUser.directIncomeEarnings || 0}
            </p>
            <span className="text-[9px] text-emerald-400">Withdrawal Ready</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Referral Commission</span>
            <p className="text-xl font-black text-cyan-300 font-mono mt-0.5">
              ₹{currentUser.referralEarnings || 0}
            </p>
            <span className="text-[9px] text-cyan-400">Gameplay Auto-Credit</span>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search member by Name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar py-1">
            <span className="text-[11px] text-slate-400 whitespace-nowrap">Filter Level:</span>
            {['all', 1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl as any)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer shrink-0 ${
                  selectedLevelFilter === lvl
                    ? 'bg-amber-400 text-black font-black shadow'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {lvl === 'all' ? 'All Levels' : `L${lvl}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Tree Content */}
      {viewMode === 'visual_tree' ? (
        <div className="rounded-3xl bg-[#080b24] border border-white/10 p-4 sm:p-8 overflow-x-auto custom-scrollbar shadow-2xl min-h-[420px] flex flex-col items-center">
          {/* Zoom controls */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-6 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-slate-300 font-mono">
                Click any node to inspect member details &amp; team stats
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomScale((z) => Math.max(0.7, z - 0.1))}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((z) => Math.min(1.3, z + 0.1))}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 text-[10px] font-mono cursor-pointer"
                title="Reset Zoom"
              >
                100%
              </button>
            </div>
          </div>

          <div
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out',
            }}
            className="w-full flex justify-center py-4"
          >
            {renderVisualTreeNode(treeRoot)}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#080b24] border border-white/10 p-4 sm:p-6 shadow-2xl space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Hierarchical Downline Directory</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              Total {treeRoot.totalTeamCount + 1} Accounts
            </span>
          </div>

          {renderNestedNode(treeRoot)}
        </div>
      )}

      {/* 3. Member Profile Inspection Modal */}
      {selectedNodeDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-md w-full rounded-3xl bg-gradient-to-b from-[#14123d] via-[#0d102e] to-[#080a1c] border-2 border-amber-400/60 p-6 shadow-2xl text-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-black font-black flex items-center justify-center text-sm">
                  {selectedNodeDetails.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{selectedNodeDetails.name}</h4>
                  <p className="text-[11px] font-mono text-amber-300">ID: {selectedNodeDetails.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNodeDetails(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Member Details Grid */}
            <div className="space-y-2.5 text-xs bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Hierarchy Level:</span>
                <span className="font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                  {selectedNodeDetails.level === 0 ? '👑 Root User (You)' : `Level ${selectedNodeDetails.level}`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Referral Code:</span>
                <span className="font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {selectedNodeDetails.referralCode}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Introduced By (Sponsor):</span>
                <span className="font-mono font-bold text-amber-300">
                  {selectedNodeDetails.referredBy || 'Direct Registration'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Joined Date:</span>
                <span className="font-mono text-slate-300">{selectedNodeDetails.joinedDate}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Direct Referrals:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {selectedNodeDetails.directCount} Members
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sub-Downline Team:</span>
                <span className="font-mono font-bold text-pink-400">
                  {selectedNodeDetails.totalTeamCount} Members
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Player ✓
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedNodeDetails(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
