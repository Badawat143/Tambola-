import React from 'react';
import { useTambola } from '../../context/TambolaContext';
import { X, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export const ResponsibleGamingModal: React.FC = () => {
  const { settings, setActiveModal } = useTambola();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-2xl w-full rounded-3xl border-2 border-amber-500/40 bg-[#0c0d26] shadow-2xl p-6 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">RESPONSIBLE GAMING</h2>
              <p className="text-xs text-slate-400">18+ Strict Age Verification &amp; Self-Limit Guidelines</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-red-300">Age &amp; Territorial Restrictions</h3>
              <p className="text-[11px] text-slate-300 mt-1">
                You must be at least 18 years old to use APNA TAMBOLA. Participation in paid contests is strictly prohibited in states where skill gaming is legally restricted, including Assam, Odisha, Telangana, Andhra Pradesh, and Nagaland.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">Our Responsible Gaming Principles</h3>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>Play for recreational entertainment only, never as a primary source of income.</li>
              <li>Set personal budget limits on daily or weekly ticket purchases.</li>
              <li>Never chase losses or wager money you cannot afford to lose.</li>
              <li>Maintain balance between gaming and family, professional, and personal commitments.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
