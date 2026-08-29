import React, { useState } from 'react';
import { User, NotificationItem } from '../../types/tambola';
import { ApnaTambolaLogo } from '../ApnaTambolaLogo';
import { Bell, Copy, Check, User as UserIcon, X, ArrowRight } from 'lucide-react';

interface MlmTopHeaderProps {
  currentUser: User;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onClose: () => void;
}

export const MlmTopHeader: React.FC<MlmTopHeaderProps> = ({
  currentUser,
  notifications,
  onOpenNotifications,
  onOpenProfile,
  onClose,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentUser.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <header className="shrink-0 px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#07091e] via-[#0d1238] to-[#120a2e] border-b border-indigo-500/30 flex items-center justify-between z-30 shadow-xl">
      {/* Brand & User Greeting */}
      <div className="flex items-center gap-3">
        <ApnaTambolaLogo size="sm" showText={false} />
        
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white font-['Outfit']">
              APNA <span className="text-amber-400">TAMBOLA</span>
            </h2>
            <span className="hidden sm:inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow">
              PRO MLM
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs font-semibold text-slate-300">
              Welcome, <span className="text-amber-300 font-bold">{currentUser.name}</span>
            </p>
            <span className="text-slate-600">•</span>
            <div className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
              <span className="text-[11px] font-mono text-cyan-300 font-bold">
                ID: {currentUser.id}
              </span>
              <button
                onClick={handleCopyId}
                className="text-slate-300 hover:text-white p-0.5 rounded transition cursor-pointer"
                title="Copy User ID"
              >
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls (Notifications, Profile, Close) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-amber-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/60 to-purple-600/60 hover:from-indigo-600 hover:to-purple-600 text-white border border-indigo-400/30 text-xs font-bold transition cursor-pointer shadow-md"
        >
          <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
            {currentUser.name.charAt(0)}
          </div>
          <span className="hidden md:inline">My Profile</span>
        </button>

        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 transition cursor-pointer"
          title="Close Dashboard"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
