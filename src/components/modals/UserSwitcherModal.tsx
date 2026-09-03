import React from 'react';
import { useTambola } from '../../context/TambolaContext';
import { X, Users, UserCheck, Shield, Award, Wallet } from 'lucide-react';

export const UserSwitcherModal: React.FC = () => {
  const { allUsers, currentUser, switchUser, setActiveModal } = useTambola();
  const [search, setSearch] = React.useState('');

  const filteredUsers = (allUsers || []).filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.id || '').toLowerCase().includes(q) ||
      (u.referralCode || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-lg w-full rounded-3xl border-2 border-purple-500/40 bg-[#0c0d26] shadow-2xl p-6 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">ACCOUNT SWITCHER ({allUsers.length} Users)</h2>
              <p className="text-xs text-slate-400">Switch any registered user to inspect downline & wallet</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="pt-3">
          <input
            type="text"
            placeholder="Search by Name, Mobile, User ID, Referral Code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131538] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-purple-400"
          />
        </div>

        {/* User List */}
        <div className="py-3 space-y-2.5 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
          {filteredUsers.map((u) => {
            const isCurrent = u.id === currentUser.id;
            return (
              <div
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setActiveModal(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-purple-500/20 border-purple-400 shadow-md ring-2 ring-purple-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-white">{u.name}</strong>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/40">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Code: {u.referralCode} {u.referredBy ? `(Invited by: ${u.referredBy})` : '(Top Leader)'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    ₹{u.walletBalance}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ref: ₹{u.referralEarnings}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setActiveModal('admin')}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Open Admin Panel</span>
          </button>
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
