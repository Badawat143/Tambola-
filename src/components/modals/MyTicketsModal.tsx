import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { X, Ticket, Play, Download, Share2, Plus, QrCode } from 'lucide-react';
import { createNewTicket } from '../../utils/ticketGenerator';

export const MyTicketsModal: React.FC = () => {
  const {
    myTickets,
    setActiveModal,
    setSelectedGameForPurchase,
    upcomingGames,
    toggleMarkNumberOnTicket,
    generateCustomTicket,
  } = useTambola();

  const [activeTicketIndex, setActiveTicketIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-3xl w-full rounded-3xl border-2 border-indigo-500/40 bg-[#0c0d26] shadow-2xl p-4 sm:p-6 my-4 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">MY ACTIVE TICKETS</h2>
              <p className="text-xs text-slate-400">Total Booked: {myTickets.length} Tickets</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedGameForPurchase(upcomingGames[0]);
                setActiveModal('buyTicket');
              }}
              className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buy More</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tickets List / Carousel */}
        <div className="py-4 space-y-6 overflow-y-auto max-h-[64vh] pr-1">
          {myTickets.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-bold">No active tickets found in your wallet.</p>
              <button
                onClick={() => {
                  setSelectedGameForPurchase(upcomingGames[0]);
                  setActiveModal('buyTicket');
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-black rounded-xl text-xs"
              >
                Book Your First Ticket (₹50)
              </button>
            </div>
          ) : (
            myTickets.map((t, idx) => (
              <div
                key={t.id}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-indigo-500/30 bg-[#0e0f2c] space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-pink-500 text-white text-xs font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      ID: {t.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded text-slate-300">
                      Game: {t.gameId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white text-xs"
                      title="Print / Save"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveModal('playLive')}
                      className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" /> Play in Live Game
                    </button>
                  </div>
                </div>

                {/* 3x9 Ticket Grid */}
                <div className="bg-[#070817] p-2.5 sm:p-3 rounded-xl border border-white/10 shadow-inner">
                  <div className="space-y-1.5">
                    {t.grid.map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-9 gap-1 sm:gap-1.5">
                        {row.map((num, cIdx) => {
                          const isMarked = num !== null && t.markedNumbers.includes(num);
                          return (
                            <div
                              key={cIdx}
                              onClick={() => {
                                if (num !== null) {
                                  toggleMarkNumberOnTicket(t.id, num);
                                }
                              }}
                              className={`aspect-square rounded-lg flex items-center justify-center text-xs sm:text-sm font-black transition-all ${
                                num === null
                                  ? 'bg-white/[0.02] border border-white/5'
                                  : isMarked
                                  ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-md border border-pink-300 scale-105 cursor-pointer ring-2 ring-pink-400/40'
                                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/15 cursor-pointer'
                              }`}
                            >
                              {num !== null && (
                                <span className="font-['Space_Grotesk'] font-bold">
                                  {num}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Marked Numbers: <strong className="text-pink-300">{t.markedNumbers.length} / 15</strong></span>
                  <span className="font-mono text-emerald-400">Status: Active &amp; Valid</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
