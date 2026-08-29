import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { X, Shield, FileText, CheckCircle } from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { setActiveModal } = useTambola();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund' | 'compliance'>('terms');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-3xl w-full rounded-3xl border-2 border-indigo-500/40 bg-[#0c0d26] shadow-2xl p-6 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">LEGAL &amp; COMPLIANCE POLICIES</h2>
              <p className="text-xs text-slate-400">Public Gambling Act 1867 &amp; Skill Gaming Compliance</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 py-3 border-b border-white/10">
          {[
            { id: 'terms', label: 'Terms & Conditions' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'refund', label: 'Refund Policy' },
            { id: 'compliance', label: 'Skill Gaming Law' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Policy Text Body */}
        <div className="py-4 space-y-3 max-h-[55vh] overflow-y-auto pr-1 text-xs text-slate-300 leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">1. User Eligibility &amp; Account Responsibility</h3>
              <p>
                To register and participate on APNA TAMBOLA, users must be at least 18 years of age. Users are solely responsible for maintaining the confidentiality of their login credentials and wallet funds.
              </p>
              <h3 className="text-sm font-bold text-white">2. Multi-Level Referral Commissions</h3>
              <p>
                Referral commissions are calculated on valid purchased game tickets in accordance with the published Level 1 to Level 5+ commission schedule. Referral commissions are segregated from game winning pools.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Data Protection &amp; SSL Privacy</h3>
              <p>
                APNA TAMBOLA employs 256-bit SSL encryption. We do not sell, rent, or trade your personal mobile numbers or transactional records to any third parties without explicit authorization.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Cancellation &amp; Refund Policy</h3>
              <p>
                In the rare event of server disconnection or tournament cancellation, full ticket entry fees are automatically refunded to the player’s APNA TAMBOLA wallet balance within 10 minutes.
              </p>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Game of Skill Legal Declaration</h3>
              <p>
                Indian courts, including the Hon'ble Supreme Court of India in State of Bombay v. R.M.D. Chamarbaugwala, have affirmed that games involving substantial degrees of skill, rapid cognitive recognition, and pattern identification are protected under Article 19(1)(g) of the Constitution of India.
              </p>
            </div>
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
