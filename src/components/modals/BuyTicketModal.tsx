import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import {
  X,
  Ticket,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Wallet,
  Gift,
  ArrowDownToLine,
  Percent,
} from 'lucide-react';

export const BuyTicketModal: React.FC = () => {
  const {
    currentUser,
    selectedGameForPurchase,
    upcomingGames,
    settings,
    availableTicketPrices,
    buyTicket,
    useFreeTicketToBuy,
    freeTicketWinners,
    setActiveModal,
    setUserDashboardTab,
  } = useTambola();

  const game = selectedGameForPurchase || upcomingGames[0];
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPrice, setSelectedPrice] = useState<number>(game?.ticketPrice || 20);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const pricePerTicket = selectedPrice;
  const totalCost = pricePerTicket * quantity;
  const hasSufficientBalance = currentUser.walletBalance >= totalCost;

  // Check if current user has an available free ticket voucher for this game or any game
  const availableFreeTicket = freeTicketWinners.find(
    (f) => f.userId === currentUser.id && f.status === 'available'
  );

  const handlePurchase = () => {
    if (!game) return;
    const res = buyTicket(game.id, quantity, pricePerTicket);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setActiveModal('myTickets');
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleRedeemFree = () => {
    if (!availableFreeTicket || !game) return;
    const res = useFreeTicketToBuy(game.id, availableFreeTicket.id);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setActiveModal('myTickets');
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="glass-card max-w-md w-full rounded-3xl border-2 border-indigo-500/40 bg-[#0c0d26] shadow-2xl p-6 relative overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-slate-950 font-black">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">BOOK TAMBOLA TICKETS</h2>
              <p className="text-xs text-slate-400 font-mono">Game ID: {game?.id}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div
            className={`my-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="py-4 space-y-4">
          {/* Select Ticket Price Tier (₹5, ₹10, ₹15, ₹20, ₹50, ₹100) */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 block">
              Select Ticket Price Tier:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {availableTicketPrices.filter((t) => t.isEnabled).map((opt) => (
                <button
                  key={opt.price}
                  type="button"
                  onClick={() => setSelectedPrice(opt.price)}
                  className={`py-2 rounded-xl text-xs font-black border transition-all ${
                    selectedPrice === opt.price
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-md shadow-pink-500/30'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  ₹{opt.price}
                </button>
              ))}
            </div>
          </div>

          {/* Game Details Card */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Tournament:</span>
              <strong className="text-white">{game?.title}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Prize Pool (70%):</span>
              <strong className="text-emerald-400 font-mono">₹{game?.prizePool.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Price per Ticket:</span>
              <strong className="text-pink-400 font-mono">₹{pricePerTicket}</strong>
            </div>
          </div>

          {/* Quantity Preset Buttons */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Select Quantity:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 6].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      quantity === q
                        ? 'bg-amber-400 text-black border-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    {q} {q === 6 ? 'Full Strip' : 'Tkt'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-black text-white font-mono w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400">Total Payable:</span>
                <p className="text-xl font-black text-emerald-400 font-mono">₹{totalCost}</p>
              </div>
            </div>
          </div>

          {/* User Wallet Info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-900/30 border border-purple-500/30 text-xs">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Wallet Balance:</span>
              <strong className="text-emerald-400 font-mono">₹{currentUser.walletBalance}</strong>
            </div>

            {!hasSufficientBalance && (
              <button
                onClick={() => {
                  setUserDashboardTab('deposit');
                  setActiveModal('userDashboard');
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black text-[11px] font-bold flex items-center gap-1"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>+ Deposit</span>
              </button>
            )}
          </div>

          {/* Free Ticket Voucher Alert if Available */}
          {availableFreeTicket && (
            <div className="p-3 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span>You have 1 Free Ticket Pass!</span>
              </div>
              <button
                onClick={handleRedeemFree}
                className="px-2.5 py-1 rounded-lg bg-pink-500 text-white text-[11px] font-black hover:opacity-90"
              >
                Redeem Free
              </button>
            </div>
          )}

          {/* Referral Commission Notice */}
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 shrink-0" />
            <span>4.6% 8-Level Upline commission will be distributed automatically upon purchase.</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={handlePurchase}
            disabled={!hasSufficientBalance}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-black text-sm tracking-wide shadow-xl shadow-pink-500/30 hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed uppercase"
          >
            {hasSufficientBalance ? `Confirm & Pay ₹${totalCost}` : 'Insufficient Balance — Deposit First'}
          </button>
        </div>
      </div>
    </div>
  );
};
