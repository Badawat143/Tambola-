import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { X, Headphones, MessageCircle, Send, Phone, Mail, CheckCircle } from 'lucide-react';

export const SupportModal: React.FC = () => {
  const { settings, setActiveModal } = useTambola();
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveModal(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-lg w-full rounded-3xl border-2 border-indigo-500/40 bg-[#0c0d26] shadow-2xl p-6 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">APNA TAMBOLA SUPPORT</h2>
              <p className="text-xs text-slate-400">24x7 Customer Care &amp; Help Desk</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Support Ticket #AT-{Math.floor(1000 + Math.random() * 9000)} Created!</h3>
            <p className="text-xs text-slate-400">Our customer representative will reply to your registered mobile and email within 15 minutes.</p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  try {
                    // @ts-ignore
                    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
                      // @ts-ignore
                      window.Tawk_API.maximize();
                    } else {
                      window.open('https://tawk.to/chat/671ba0224304e3196ad82413/default', '_blank');
                    }
                  } catch {
                    window.open('https://tawk.to/chat/671ba0224304e3196ad82413/default', '_blank');
                  }
                }}
                className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 hover:brightness-125 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all text-emerald-300 text-xs font-bold cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Live Chat (Tawk.to)</span>
                <span className="text-[9px] text-emerald-400/80 font-normal">Instant 24/7 Agent</span>
              </button>

              <a
                href={settings.socialLinks?.whatsapp || 'https://whatsapp.com'}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all text-emerald-300 text-xs font-bold"
              >
                <Phone className="w-5 h-5" />
                <span>WhatsApp Desk</span>
                <span className="text-[9px] text-slate-400 font-normal">+91 Official Desk</span>
              </a>

              <a
                href="mailto:tickets@click-earn-hvfde7.p.tawk.email?subject=APNA%20TAMBOLA%20Player%20Query"
                className="p-3 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all text-blue-300 text-xs font-bold"
              >
                <Mail className="w-5 h-5 text-blue-400" />
                <span>Ticket Email</span>
                <span className="text-[9px] text-blue-300/80 font-normal truncate max-w-[110px]">Direct Support</span>
              </a>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-[11px] text-sky-200 flex items-center justify-between">
              <span>Official Ticket Mail:</span>
              <strong className="font-mono text-cyan-300 select-all">tickets@click-earn-hvfde7.p.tawk.email</strong>
            </div>

            {/* Support Ticket Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question about Game #AT-1025"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-[#080918] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Describe your query</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please give details..."
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  className="w-full bg-[#080918] border border-white/15 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
