import React from 'react';
import { DashboardTab } from '../../types/tambola';
import {
  LayoutDashboard,
  User,
  Wallet,
  Ticket,
  Trophy,
  PlusCircle,
  ArrowUpRight,
  Send,
  Radio,
  Sparkles,
  Users,
  Share2,
  Percent,
  Gift,
  History,
  Bell,
  Headphones,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

interface MlmSidebarAndNavProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onLogout: () => void;
  unreadNotificationsCount?: number;
}

export const MlmSidebarAndNav: React.FC<MlmSidebarAndNavProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  unreadNotificationsCount = 0,
}) => {
  const menuCategories = [
    {
      category: 'CORE EARNINGS',
      items: [
        { id: 'dashboard' as DashboardTab, label: '🏠 Dashboard', icon: LayoutDashboard },
        { id: 'profile' as DashboardTab, label: '👤 My Profile', icon: User },
        { id: 'mainWallet' as DashboardTab, label: '💰 Main Wallet', icon: Wallet },
        { id: 'ticketWallet' as DashboardTab, label: '🎟️ Ticket Wallet', icon: Ticket },
        { id: 'winningWallet' as DashboardTab, label: '🏆 Winning Wallet', icon: Trophy },
      ],
    },
    {
      category: 'FUNDS & WALLET',
      items: [
        { id: 'deposit' as DashboardTab, label: '➕ Deposit', icon: PlusCircle },
        { id: 'withdraw' as DashboardTab, label: '💸 Withdraw', icon: ArrowUpRight },
        { id: 'transfer' as DashboardTab, label: '🔄 Transfer (5% Fee)', icon: Send },
      ],
    },
    {
      category: 'TAMBOLA GAMEPLAY',
      items: [
        { id: 'buyTicket' as DashboardTab, label: '🎟️ Buy Ticket', icon: Ticket },
        { id: 'myTickets' as DashboardTab, label: '🎫 My Tickets', icon: Ticket },
        { id: 'liveGames' as DashboardTab, label: '🔴 Live Games', icon: Radio },
        { id: 'winners' as DashboardTab, label: '🏆 Winners', icon: Trophy },
      ],
    },
    {
      category: 'MLM & NETWORK',
      items: [
        { id: 'directIncome' as DashboardTab, label: '💎 My Income', icon: Sparkles },
        { id: 'referral' as DashboardTab, label: '👥 My Team (8 Levels)', icon: Users },
        { id: 'referral' as DashboardTab, label: '🔗 Referral Link', icon: Share2 },
        { id: 'commission' as DashboardTab, label: '📊 Commission Ledger', icon: Percent },
        { id: 'freeTickets' as DashboardTab, label: '🎁 Free Tickets', icon: Gift },
      ],
    },
    {
      category: 'SYSTEM & LOGS',
      items: [
        { id: 'transactions' as DashboardTab, label: '📜 Transactions', icon: History },
        {
          id: 'notifications' as DashboardTab,
          label: '🔔 Notifications',
          icon: Bell,
          badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
        },
        { id: 'support' as DashboardTab, label: '🎧 Support Helpdesk', icon: Headphones },
        { id: 'security' as DashboardTab, label: '⚙️ Settings & Security', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#090b20] border-r border-indigo-500/20 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar p-3 space-y-4">
      <div className="space-y-4">
        {menuCategories.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-500">
              {group.category}
            </span>
            <div className="space-y-0.5 mt-1">
              {group.items.map((item, itemIdx) => {
                const isActive = currentTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={`${item.id}-${itemIdx}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[9px] font-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="pt-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>🚪 Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const MlmMobileBottomNav: React.FC<{
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenMenu: () => void;
}> = ({ currentTab, onSelectTab, onOpenMenu }) => {
  const navItems = [
    { id: 'dashboard' as DashboardTab, label: 'Home', icon: LayoutDashboard },
    { id: 'liveGames' as DashboardTab, label: 'Games', icon: Radio },
    { id: 'myTickets' as DashboardTab, label: 'Tickets', icon: Ticket },
    { id: 'mainWallet' as DashboardTab, label: 'Wallet', icon: Wallet },
    { id: 'profile' as DashboardTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080a1e]/95 backdrop-blur-lg border-t border-indigo-500/30 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition cursor-pointer ${
              isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center p-1 text-slate-400 hover:text-white transition cursor-pointer"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Menu</span>
      </button>
    </nav>
  );
};
