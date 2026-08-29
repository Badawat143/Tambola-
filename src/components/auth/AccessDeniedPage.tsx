import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, LayoutDashboard, Lock } from 'lucide-react';

interface AccessDeniedPageProps {
  onNavigate: (path: string) => void;
  onLogout?: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ onNavigate, onLogout }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] py-16 px-4 flex items-center justify-center bg-gradient-to-b from-[#0a0507] via-[#160b10] to-[#0a0507]">
      <div className="w-full max-w-lg text-center">
        {/* Warning Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-600 p-[2px] mx-auto mb-6 shadow-2xl shadow-red-600/30">
          <div className="w-full h-full bg-[#12070a] rounded-3xl flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
          </div>
        </div>

        {/* 403 Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>HTTP 403 FORBIDDEN</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit'] mb-3">
          403 — ACCESS DENIED
        </h1>

        <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
          You do not have Administrator permissions to access the <strong>APNA TAMBOLA Admin Control Suite</strong>. Player accounts are restricted to user dashboards and gameplay services.
        </p>

        <div className="bg-[#180d12]/90 border border-red-500/30 rounded-2xl p-5 mb-8 text-left text-xs text-red-200">
          <p className="font-bold text-red-400 mb-1">Security Audit Logged:</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-300">
            <li>Attempted Route: <span className="font-mono text-red-300">/admin/*</span></li>
            <li>Status: Restricted — Role authorization failed</li>
            <li>Required Role: <span className="font-mono text-amber-300">ADMIN / SUPER_ADMIN</span></li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>GO TO USER DASHBOARD</span>
          </button>

          <button
            onClick={() => {
              if (onLogout) onLogout();
              onNavigate('/admin/login');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>SWITCH TO ADMIN LOGIN</span>
          </button>
        </div>

        <div className="mt-8">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
