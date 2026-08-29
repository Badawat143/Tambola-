import React from 'react';
import { ShieldX, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

interface AdminRegisterBlockerProps {
  onNavigate: (path: string) => void;
}

export const AdminRegisterBlocker: React.FC<AdminRegisterBlockerProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] py-16 px-4 flex items-center justify-center bg-gradient-to-b from-[#05060f] via-[#090b1c] to-[#05060f]">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 p-[2px] mx-auto mb-6 shadow-2xl shadow-amber-500/20">
          <div className="w-full h-full bg-[#090a18] rounded-3xl flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-amber-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-widest uppercase mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>RESTRICTED PROVISIONING</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit'] mb-3">
          PUBLIC ADMIN REGISTRATION DISABLED
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto mb-6 leading-relaxed">
          Administrator accounts cannot be created via public sign-up. Administrative access is provisioned strictly by an authorized Super Admin or server-side initialization.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onNavigate('/admin/login')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>GO TO ADMIN LOGIN</span>
          </button>

          <button
            onClick={() => onNavigate('/register')}
            className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>REGISTER AS PLAYER USER</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
