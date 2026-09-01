import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { ApnaTambolaLogo } from './ApnaTambolaLogo';
import {
  ShieldCheck,
  Award,
  Lock,
  Heart,
  MessageCircle,
  Send,
  Youtube,
  Instagram,
  Facebook,
  Phone,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveModal, setSelectedGameForPurchase, upcomingGames } = useTambola();

  return (
    <footer className="border-t border-indigo-500/20 bg-[#070818] text-slate-400 text-sm relative overflow-hidden">
      {/* Top Banner with 18+ and Security Badges */}
      <div className="border-b border-white/5 py-6 bg-[#090a1f]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-extrabold flex items-center justify-center text-xs">
              18+
            </span>
            <span>Strictly 18+ Players Only • Play Responsibly</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Certified RNG
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <Lock className="w-4 h-4" /> 256-Bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Award className="w-4 h-4" /> Skill Game Approved
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info with Official Logo */}
          <div className="lg:col-span-2 space-y-4">
            <ApnaTambolaLogo size="xl" showText={true} />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier digital Tambola &amp; Housie gaming platform. Providing certified random number calling, transparent multi-level referral commissions, and instant prize settlements.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Join Our Communities
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href={settings.socialLinks?.whatsapp || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 flex items-center justify-center transition-all"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={settings.socialLinks?.telegram || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 flex items-center justify-center transition-all"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
                <a
                  href={settings.socialLinks?.youtube || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400 flex items-center justify-center transition-all"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={settings.socialLinks?.instagram || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-pink-500/10 hover:bg-pink-500/25 border border-pink-500/30 text-pink-400 flex items-center justify-center transition-all"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings.socialLinks?.facebook || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-400 flex items-center justify-center transition-all"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('playLive')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Play Tambola
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedGameForPurchase(upcomingGames[0]);
                    setActiveModal('buyTicket');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Buy Ticket
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('myTickets')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Tickets
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('winners')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Winners
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('referral')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Referral
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: LEGAL */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              LEGAL &amp; POLICIES
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveModal('legal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('legal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('legal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('responsibleGaming')}
                  className="hover:text-amber-400 font-semibold transition-colors cursor-pointer"
                >
                  Responsible Gaming
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('legal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Legal/Compliance Notice
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: SUPPORT */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              SUPPORT
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{settings.supportContact?.phone || '+91 98765 00000'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>{settings.supportContact?.email || 'support@apnatambola.com'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{settings.supportContact?.timing || '24x7 Help Center'}</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => setActiveModal('support')}
                  className="w-full py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Open Support Ticket</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Jurisdiction Warning */}
        <div className="mt-12 pt-8 border-t border-white/5 text-[11px] text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-300">Statutory Notice:</strong> APNA TAMBOLA is a game of skill compliant with the Public Gambling Act, 1867 and applicable state amendments. Participation is strictly prohibited for persons under the age of 18 and residents of Assam, Odisha, Telangana, Andhra Pradesh, and Nagaland.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-slate-400">
            <p>© {new Date().getFullYear()} APNA TAMBOLA Inc. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Indian Housie Enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
