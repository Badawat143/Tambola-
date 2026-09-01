import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { ApnaTambolaLogo } from '../ApnaTambolaLogo';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Trophy,
  CheckCircle,
  AlertCircle,
  Gift,
  Mic,
  MicOff,
  Ticket,
  Undo2,
  PhoneCall,
} from 'lucide-react';
import { TAMBOLA_CALLS } from '../../utils/soundEffects';
import { WinningPatternCode } from '../../types/tambola';

export const LiveGameModal: React.FC = () => {
  const {
    activeLiveGame,
    liveCalledNumbers,
    currentCalledNumber,
    isGameCalling,
    startLiveCaller,
    pauseLiveCaller,
    callNextNumber,
    callSpecificNumber,
    undoLastNumber,
    resetLiveGame,
    myTickets,
    currentUser,
    toggleMarkNumberOnTicket,
    claimPrizeWithPattern,
    prizes,
    freeTicketWinners,
    setActiveModal,
    isSoundMuted,
    toggleSound,
    speechCallerEnabled,
    toggleSpeechCaller,
    activeWinnerFlash,
    dismissWinnerFlash,
  } = useTambola();

  // Active playing ticket
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    myTickets[0]?.id || ''
  );
  const [claimFeedback, setClaimFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [specificInput, setSpecificInput] = useState<string>('');
  const [showAdminCallerControls, setShowAdminCallerControls] = useState<boolean>(true);

  const activeTicket =
    myTickets.find((t) => t.id === selectedTicketId) || myTickets[0];

  const handleClaim = (patternCode: WinningPatternCode) => {
    if (!activeTicket) {
      setClaimFeedback({
        type: 'error',
        message: 'Please select a valid ticket first!',
      });
      return;
    }

    const res = claimPrizeWithPattern(activeTicket.id, patternCode);
    if (res.success) {
      setClaimFeedback({ type: 'success', message: res.message });
    } else {
      setClaimFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setClaimFeedback(null), 5000);
  };

  const handleCallSpecific = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const n = parseInt(specificInput, 10);
    if (isNaN(n) || n < 1 || n > 90) {
      setClaimFeedback({ type: 'error', message: 'Please enter a valid number from 1 to 90.' });
      setTimeout(() => setClaimFeedback(null), 4000);
      return;
    }
    const res = callSpecificNumber(n);
    if (res.success) {
      setClaimFeedback({ type: 'success', message: res.message });
      setSpecificInput('');
    } else {
      setClaimFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setClaimFeedback(null), 4000);
  };

  const handleUndo = () => {
    const res = undoLastNumber();
    if (res.success) {
      setClaimFeedback({ type: 'success', message: res.message });
    } else {
      setClaimFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setClaimFeedback(null), 4000);
  };

  const nickname = currentCalledNumber
    ? TAMBOLA_CALLS[currentCalledNumber] || `Number ${currentCalledNumber}`
    : 'Waiting for draw...';

  // Game 5 Free Ticket Winners
  const gameFreeTickets = freeTicketWinners.filter(
    (f) => f.gameId === activeLiveGame.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in text-slate-100">
      {/* 🏆 WINNER FLASH OVERLAY */}
      {activeWinnerFlash && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
          <div className="relative max-w-md w-full bg-gradient-to-b from-amber-500/20 via-[#181136] to-black border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
            <div className="absolute top-3 right-3">
              <button
                onClick={dismissWinnerFlash}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-4xl shadow-lg shadow-amber-400/50 animate-bounce">
              🏆
            </div>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 uppercase tracking-wider mt-3">
              WINNER ANNOUNCEMENT
            </h3>
            <p className="text-xs text-amber-300/80 font-bold uppercase tracking-widest mt-0.5">
              Claim Verified & Winnings Credited
            </p>

            <div className="my-5 bg-black/60 rounded-2xl p-4 border border-amber-500/30 text-left space-y-2.5 text-sm">
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 shrink-0">Winner(s):</span>
                <span className="font-bold text-white text-base text-right">{activeWinnerFlash.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">User ID:</span>
                <span className="font-mono font-bold text-pink-400">{activeWinnerFlash.userId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Prize Category:</span>
                <span className="font-bold text-purple-300">{activeWinnerFlash.prizeName}</span>
              </div>

              {activeWinnerFlash.isShared && activeWinnerFlash.allWinners && activeWinnerFlash.allWinners.length > 1 ? (
                <div className="p-3 bg-amber-500/15 border border-amber-400/30 rounded-xl space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                    <span>⚡ Equal Prize Split ({activeWinnerFlash.totalShareCount || activeWinnerFlash.allWinners.length} Winners)</span>
                    <span className="bg-amber-400/20 px-2 py-0.5 rounded text-[10px]">Auto-Claimed</span>
                  </div>
                  {activeWinnerFlash.allWinners.map((w, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-200">
                      <span>• {w.userName} (#{w.ticketNumber})</span>
                      <span className="font-bold text-emerald-400">₹{w.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Ticket Number:</span>
                  <span className="font-mono font-bold text-amber-300">#{activeWinnerFlash.ticketNumber}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2.5 border-t border-white/10">
                <span className="font-bold text-emerald-400">
                  {activeWinnerFlash.isShared ? 'Prize Per Winner:' : 'Prize Amount:'}
                </span>
                <span className="font-mono text-xl font-black text-emerald-400">₹{activeWinnerFlash.prizeAmount}</span>
              </div>
            </div>

            <button
              onClick={dismissWinnerFlash}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/40 hover:brightness-110 cursor-pointer"
            >
              🎉 CONGRATULATIONS!
            </button>
          </div>
        </div>
      )}

      <div className="glass-card max-w-5xl w-full rounded-3xl border-2 border-purple-500/40 bg-[#0c0d26] shadow-2xl p-4 sm:p-6 my-4 max-h-[94vh] flex flex-col justify-between overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <ApnaTambolaLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  LIVE TAMBOLA ROOM
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  LIVE CALLER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeLiveGame.title} • 70% Prize Pool: ₹{activeLiveGame.prizePool.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                isSoundMuted
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-white/10 text-white border-white/20'
              }`}
              title="Toggle Sound FX"
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Speech Caller Toggle */}
            <button
              onClick={toggleSpeechCaller}
              className={`p-2 rounded-xl border transition-all ${
                speechCallerEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/10 text-slate-400 border-white/20'
              }`}
              title="Toggle Voice Caller (Speech)"
            >
              {speechCallerEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveModal(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Claim Feedback Banner */}
        {claimFeedback && (
          <div
            className={`my-3 p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade-in ${
              claimFeedback.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                : 'bg-red-500/20 text-red-300 border border-red-500/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {claimFeedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{claimFeedback.message}</span>
            </div>
            {claimFeedback.type === 'success' && <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />}
          </div>
        )}

        {/* 5 Free Ticket Winners Live Strip */}
        {gameFreeTickets.length > 0 && (
          <div className="my-2 p-2.5 rounded-xl bg-pink-900/30 border border-pink-500/30 flex items-center justify-between text-xs overflow-x-auto">
            <div className="flex items-center gap-2 text-pink-300 shrink-0 font-bold">
              <Gift className="w-4 h-4 text-pink-400" />
              <span>5 Lucky Free Ticket Winners:</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
              {gameFreeTickets.map((f, i) => (
                <span key={f.id} className="bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                  #{i + 1} {f.userName} (Tkt #{f.ticketNumber})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-3">
          
          {/* Left Column: Number Caller & Board */}
          <div className="lg:col-span-5 space-y-4">
            {/* Current Number Showcase */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181a40] to-[#0d0e26] border-2 border-purple-500/40 text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-3 left-3 text-[10px] font-black uppercase text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                CURRENT DRAW
              </div>
              <div className="absolute top-3 right-3 text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                {liveCalledNumbers.length} / 90 DRAWN
              </div>

              {/* 3D Animated Ball */}
              <div className="my-4 flex justify-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-1 shadow-2xl shadow-pink-500/40 animate-pulse">
                  <div className="w-full h-full rounded-full bg-radial from-slate-900 via-purple-950 to-black flex flex-col items-center justify-center border-4 border-white/30">
                    <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-amber-300 font-mono drop-shadow-md">
                      {currentCalledNumber !== null ? currentCalledNumber : '--'}
                    </span>
                    <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest mt-0.5">
                      TAMBOLA
                    </span>
                  </div>
                </div>
              </div>

              {/* Call Nickname / Speech Line */}
              <p className="text-sm sm:text-base font-extrabold text-amber-300 tracking-wide">
                "{nickname}"
              </p>

              {/* Primary Caller Controls */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {isGameCalling ? (
                  <button
                    onClick={pauseLiveCaller}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/30 cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause Caller</span>
                  </button>
                ) : (
                  <button
                    onClick={startLiveCaller}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>Auto Draw</span>
                  </button>
                )}

                <button
                  onClick={() => callNextNumber()}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Next Ball
                </button>

                <button
                  onClick={handleUndo}
                  disabled={liveCalledNumbers.length === 0}
                  className="px-3 py-2 rounded-xl bg-orange-600/80 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Undo Last Called Number"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Undo
                </button>

                <button
                  onClick={resetLiveGame}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                  title="Reset Game"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Call Specific Number Control */}
              <form onSubmit={handleCallSpecific} className="mt-3 flex items-center justify-center gap-2 pt-3 border-t border-white/10">
                <span className="text-[11px] text-slate-300 font-bold">Call Number:</span>
                <input
                  type="number"
                  min="1"
                  max="90"
                  placeholder="1-90"
                  value={specificInput}
                  onChange={(e) => setSpecificInput(e.target.value)}
                  className="w-16 px-2 py-1 text-center bg-black/60 border border-purple-500/50 rounded-lg text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold cursor-pointer"
                >
                  Call
                </button>
              </form>
            </div>

            {/* 1-90 Number Board Grid */}
            <div className="p-3 bg-black/40 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
                <span>TAMBOLA 90-BALL BOARD</span>
                <span className="text-pink-400 font-mono">{liveCalledNumbers.length} CALLED</span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
                  const isCalled = liveCalledNumbers.includes(num);
                  const isLatest = currentCalledNumber === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => !isCalled && callSpecificNumber(num)}
                      disabled={isCalled}
                      title={isCalled ? `Number ${num} already called` : `Click to call number ${num}`}
                      className={`h-6 text-[10px] font-mono font-bold rounded flex items-center justify-center transition-all ${
                        isLatest
                          ? 'bg-amber-400 text-slate-950 font-black scale-110 shadow-md ring-2 ring-amber-300'
                          : isCalled
                          ? 'bg-purple-600/80 text-white font-black opacity-90 cursor-not-allowed'
                          : 'bg-white/5 text-slate-400 hover:bg-pink-600/50 hover:text-white cursor-pointer'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: User Tickets & Verified Prize Claims */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Ticket Selector Strip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold text-slate-200">
                  Select Ticket to Play ({myTickets.length} available):
                </span>
              </div>
              <button
                onClick={() => setActiveModal('buyTicket')}
                className="text-xs text-pink-400 hover:text-pink-300 font-bold"
              >
                + Book Another
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {myTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    activeTicket?.id === t.id
                      ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Ticket #{t.ticketNumber} ({t.markedNumbers.length}/15)
                </button>
              ))}
            </div>

            {/* Interactive Ticket Grid */}
            {activeTicket && (
              <div className="p-4 rounded-3xl bg-[#111333] border-2 border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-pink-400">
                      TICKET #{activeTicket.ticketNumber}
                    </span>
                    <span className="text-slate-400">({activeTicket.markedNumbers.length} marked)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    🟢 Numbers marked instantly upon draw
                  </span>
                </div>

                <div className="grid grid-cols-9 gap-1.5 bg-black/50 p-2.5 rounded-2xl border border-white/10">
                  {activeTicket.grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      const isMarked = cell !== null && activeTicket.markedNumbers.includes(cell);
                      const isCalledOnBoard = cell !== null && liveCalledNumbers.includes(cell);

                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          disabled={cell === null}
                          onClick={() => cell !== null && toggleMarkNumberOnTicket(activeTicket.id, cell)}
                          className={`h-11 sm:h-12 rounded-xl flex items-center justify-center font-mono text-sm sm:text-base font-black transition-all cursor-pointer ${
                            cell === null
                              ? 'bg-transparent cursor-default'
                              : isMarked
                              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300 scale-105'
                              : isCalledOnBoard
                              ? 'bg-pink-600/80 text-white animate-pulse border border-pink-400'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {cell !== null ? cell : ''}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Verified Prize Claim Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  🏆 Verified Claim Prize Categories:
                </span>
                <span className="text-[10px] text-slate-400">
                  Server audits ticket before payout
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {prizes.filter((p) => p.isEnabled).map((prize) => {
                  const isClaimed = (prize.claimedBy?.length || 0) >= (prize.winnerCount || 1);
                  return (
                    <button
                      key={prize.id}
                      disabled={isClaimed}
                      onClick={() => handleClaim(prize.code as WinningPatternCode)}
                      className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                        isClaimed
                          ? 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
                          : 'bg-gradient-to-b from-[#181a40] to-[#0f112e] border-purple-500/40 hover:border-pink-500 hover:scale-105 shadow-md cursor-pointer'
                      }`}
                    >
                      <span className="text-lg">{prize.icon}</span>
                      <span className="text-xs font-black text-white mt-1">{prize.name}</span>
                      <span className="text-xs font-black text-emerald-400 font-mono mt-0.5">₹{prize.amount}</span>
                      <span className="text-[9px] text-slate-400 mt-1 font-bold">
                        {isClaimed ? 'CLAIMED' : 'CLAIM NOW'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
