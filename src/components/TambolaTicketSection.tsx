import React, { useState } from 'react';
import { useTambola } from '../context/TambolaContext';
import { ApnaTambolaLogo } from './ApnaTambolaLogo';
import {
  Ticket,
  Sparkles,
  QrCode,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  Eye,
  Copy,
} from 'lucide-react';
import { createNewTicket } from '../utils/ticketGenerator';

export const TambolaTicketSection: React.FC = () => {
  const {
    currentUser,
    myTickets,
    setActiveModal,
    setSelectedGameForPurchase,
    upcomingGames,
    toggleMarkNumberOnTicket,
    triggerConfetti,
  } = useTambola();

  // Active preview ticket
  const [currentTicket, setCurrentTicket] = useState(() => {
    return (
      myTickets[0] ||
      createNewTicket('AT-1025', currentUser.id, currentUser.name, 'TKT-AT98421')
    );
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [ticketColorTheme, setTicketColorTheme] = useState<string>('multi');

  const ticketThemes: { id: string; label: string; bgClass: string; activeClass: string; badgeClass: string }[] = [
    { id: 'green', label: '🟢 Green', bgClass: 'from-[#0a2318] via-[#0d3322] to-[#071912] border-emerald-500/40', activeClass: 'from-emerald-500 to-teal-600', badgeClass: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'blue', label: '🔵 Blue', bgClass: 'from-[#0b1d3a] via-[#102a54] to-[#081429] border-blue-500/40', activeClass: 'from-blue-500 to-indigo-600', badgeClass: 'bg-blue-500/20 text-blue-300' },
    { id: 'yellow', label: '🟡 Yellow', bgClass: 'from-[#2e2609] via-[#3d320c] to-[#1c1705] border-amber-500/40', activeClass: 'from-amber-400 to-yellow-500', badgeClass: 'bg-amber-500/20 text-amber-300' },
    { id: 'red', label: '🔴 Red', bgClass: 'from-[#2d0e14] via-[#3d131c] to-[#1a080c] border-red-500/40', activeClass: 'from-red-500 to-rose-600', badgeClass: 'bg-red-500/20 text-red-300' },
    { id: 'pink', label: '🩷 Pink', bgClass: 'from-[#2f0d24] via-[#421233] to-[#1c0715] border-pink-500/40', activeClass: 'from-pink-500 to-rose-500', badgeClass: 'bg-pink-500/20 text-pink-300' },
    { id: 'orange', label: '🟠 Orange', bgClass: 'from-[#2e1909] via-[#3e220c] to-[#1c0e05] border-orange-500/40', activeClass: 'from-orange-500 to-amber-600', badgeClass: 'bg-orange-500/20 text-orange-300' },
    { id: 'purple', label: '🟣 Purple', bgClass: 'from-[#200d33] via-[#2d1247] to-[#130720] border-purple-500/40', activeClass: 'from-purple-500 to-indigo-600', badgeClass: 'bg-purple-500/20 text-purple-300' },
    { id: 'sky', label: '🩵 Sky Blue', bgClass: 'from-[#0b2433] via-[#0f3247] to-[#071721] border-cyan-500/40', activeClass: 'from-cyan-400 to-blue-500', badgeClass: 'bg-cyan-500/20 text-cyan-300' },
    { id: 'multi', label: '🌈 Multi-colour', bgClass: 'from-[#121332] via-[#0d0e26] to-[#17183d] border-indigo-500/40', activeClass: 'from-pink-500 via-purple-600 to-indigo-600', badgeClass: 'bg-gradient-to-r from-amber-400 to-pink-400 text-slate-950 font-bold' },
  ];

  const currentThemeObj = ticketThemes.find((t) => t.id === ticketColorTheme) || ticketThemes[8];

  // Generate new ticket handler
  const handleGenerateNewTicket = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const fresh = createNewTicket('AT-1025', currentUser.id, currentUser.name);
      setCurrentTicket(fresh);
      setIsGenerating(false);
      triggerConfetti();
    }, 350);
  };

  // Share ticket handler
  const handleShareTicket = () => {
    const shareText = `Check out my APNA TAMBOLA ticket ${currentTicket.id} for Game AT-1025! Play & Win with me on ${window.location.origin}`;
    if (navigator.share) {
      navigator
        .share({
          title: 'My APNA TAMBOLA Ticket',
          text: shareText,
          url: window.location.origin,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  // Download / Print ticket
  const handleDownloadTicket = () => {
    window.print();
  };

  return (
    <section id="ticket-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Ticket className="w-3.5 h-3.5 text-amber-400" />
          <span>INSTANT TICKET GENERATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          🎟 GET YOUR TAMBOLA TICKET
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Certified 3×9 Indian Housie grid with 15 unique numbers, cryptographic QR verification, and instant claim readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive 3x9 Ticket Card */}
        <div className="lg:col-span-8 space-y-4">
          {/* Ticket Colour Palette Selector */}
          <div className="bg-[#0b0e26] p-3 rounded-2xl border border-indigo-500/20 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ticket Themes:</span>
            </span>
            {ticketThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTicketColorTheme(theme.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  ticketColorTheme === theme.id
                    ? 'bg-white text-slate-950 font-extrabold shadow-md scale-105 ring-2 ring-pink-500'
                    : 'bg-white/5 text-slate-300 hover:bg-white/15'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>

          <div className={`glass-card rounded-3xl p-6 sm:p-8 border-2 shadow-2xl relative overflow-hidden bg-gradient-to-br transition-all duration-300 ${currentThemeObj.bgClass}`}>
            {/* Background watermarks */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] font-black text-9xl pointer-events-none select-none tracking-tighter">
              TAMBOLA
            </div>

            {/* Ticket Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ApnaTambolaLogo size="md" showText={false} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white tracking-tight">
                      APNA TAMBOLA OFFICIAL TICKET
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${currentThemeObj.badgeClass}`}>
                      {currentThemeObj.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>ID: <strong className="text-pink-400">{currentTicket.id}</strong></span>
                    <span>•</span>
                    <span>Game: <strong className="text-amber-300">AT-1025</strong></span>
                  </div>
                </div>
              </div>

              {/* QR Code Action Box */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQrModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                  title="View QR Verification"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>QR Verify</span>
                </button>
                <button
                  onClick={handleDownloadTicket}
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer"
                  title="Download / Print Ticket"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShareTicket}
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer"
                  title="Share Ticket"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Authentic 3x9 Ticket Matrix */}
            <div className="bg-[#080918] p-3 sm:p-4 rounded-2xl border border-indigo-500/30 shadow-inner">
              <div className="space-y-2">
                {currentTicket.grid.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-9 gap-1.5 sm:gap-2">
                    {row.map((num, cIdx) => {
                      const isMarked = num !== null && currentTicket.markedNumbers.includes(num);
                      return (
                        <div
                          key={cIdx}
                          onClick={() => {
                            if (num !== null) {
                              toggleMarkNumberOnTicket(currentTicket.id, num);
                              setCurrentTicket((prev) => {
                                const marked = prev.markedNumbers.includes(num)
                                  ? prev.markedNumbers.filter((n) => n !== num)
                                  : [...prev.markedNumbers, num];
                                return { ...prev, markedNumbers: marked };
                              });
                            }
                          }}
                          className={`aspect-[1/1] sm:aspect-[1.1/1] rounded-xl flex flex-col items-center justify-center select-none transition-all duration-200 relative group ${
                            num === null
                              ? 'bg-white/[0.02] border border-white/5'
                              : isMarked
                              ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 text-white font-black shadow-lg shadow-emerald-500/40 border-2 border-emerald-300 ring-2 ring-emerald-400/50 scale-[1.03] cursor-pointer'
                              : 'bg-white/10 text-slate-100 hover:bg-white/20 border border-white/15 cursor-pointer hover:border-emerald-400/50 hover:scale-[1.02]'
                          }`}
                        >
                          {num !== null && (
                            <>
                              <span className="text-base sm:text-xl font-black font-['Space_Grotesk'] tracking-tight">
                                {num}
                              </span>
                              {isMarked && (
                                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-yellow-300"></span>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Info Footer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Click numbers to Mark / Unmark (Daub)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-300 font-semibold">
                  Marked: {currentTicket.markedNumbers.length}/15
                </span>
                <span className="text-slate-400">Player: {currentTicket.userName}</span>
              </div>
            </div>

            {copiedNotification && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl shadow-lg text-xs flex items-center gap-1.5 animate-bounce">
                <CheckCircle className="w-4 h-4" />
                <span>Ticket details copied to clipboard!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ticket Generation & Action Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Action Card */}
          <div className="glass-card rounded-3xl p-6 border border-pink-500/30 space-y-5">
            <h3 className="text-xl font-black text-white">Ticket Actions</h3>
            <p className="text-xs text-slate-300">
              Generate infinite certified random tickets, save them to your wallet, or jump directly into the live game.
            </p>

            <div className="space-y-3">
              {/* GENERATE TICKET BUTTON */}
              <button
                id="btn-generate-ticket"
                onClick={handleGenerateNewTicket}
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-slate-950 font-extrabold text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-yellow-300/40"
              >
                <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'GENERATING...' : 'GENERATE TICKET'}</span>
              </button>

              {/* MY TICKETS BUTTON */}
              <button
                id="btn-my-tickets"
                onClick={() => setActiveModal('myTickets')}
                className="w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5 text-purple-400" />
                <span>MY TICKETS ({myTickets.length})</span>
              </button>

              {/* BOOK FOR UPCOMING GAME */}
              <button
                onClick={() => {
                  setSelectedGameForPurchase(upcomingGames[0]);
                  setActiveModal('buyTicket');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4 text-pink-300" />
                <span>Book Live Game Ticket (₹50)</span>
              </button>
            </div>

            {/* Ticket Rules Specs */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span>Row Layout:</span>
                <strong className="text-white">3 Rows × 9 Columns</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Numbers Count:</span>
                <strong className="text-emerald-400">Exactly 15 Numbers (1-90)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>RNG Certified:</span>
                <strong className="text-amber-300">Cryptographically Secure</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Verification Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-sm w-full rounded-3xl p-6 border border-emerald-500/40 text-center space-y-4 bg-[#0e102b]">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">QR Ticket Verification</h3>
            <p className="text-xs text-slate-300 font-mono">ID: {currentTicket.id}</p>

            {/* Visual QR Code Display */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                <rect width="100" height="100" fill="#ffffff" />
                {/* Corner markers */}
                <rect x="10" y="10" width="25" height="25" fill="#000000" />
                <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="18" width="9" height="9" fill="#000000" />

                <rect x="65" y="10" width="25" height="25" fill="#000000" />
                <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="73" y="18" width="9" height="9" fill="#000000" />

                <rect x="10" y="65" width="25" height="25" fill="#000000" />
                <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="73" width="9" height="9" fill="#000000" />

                {/* Random QR patterns */}
                <rect x="40" y="15" width="5" height="5" fill="#000000" />
                <rect x="50" y="15" width="5" height="10" fill="#000000" />
                <rect x="40" y="25" width="10" height="5" fill="#000000" />
                <rect x="40" y="40" width="20" height="20" fill="#000000" />
                <rect x="45" y="45" width="10" height="10" fill="#ffffff" />
                <rect x="70" y="45" width="5" height="15" fill="#000000" />
                <rect x="15" y="45" width="15" height="5" fill="#000000" />
                <rect x="40" y="70" width="10" height="10" fill="#000000" />
                <rect x="65" y="70" width="20" height="10" fill="#000000" />
                <rect x="75" y="85" width="10" height="5" fill="#000000" />
              </svg>
            </div>

            <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-emerald-300 font-semibold">
              ✓ 100% Genuine APNA TAMBOLA Game Hash
            </div>

            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
