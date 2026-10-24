import React from 'react';
import { Wallet, ReceiptText, CalendarClock, BarChart3, Cloud, Sparkles } from 'lucide-react';
import { TabType } from '../types';

interface TabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingBillsCount: number;
  isPro: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({
  currentTab,
  onSelectTab,
  pendingBillsCount,
  isPro,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Cycle',
      icon: Wallet,
      badge: null,
    },
    {
      id: 'expenses' as TabType,
      label: 'Spending',
      icon: ReceiptText,
      badge: null,
    },
    {
      id: 'bills' as TabType,
      label: 'Bills',
      icon: CalendarClock,
      badge: pendingBillsCount > 0 ? pendingBillsCount : null,
    },
    {
      id: 'reports' as TabType,
      label: 'Reports',
      icon: BarChart3,
      badge: !isPro ? 'PRO' : null,
    },
    {
      id: 'settings' as TabType,
      label: 'Cloud & Pro',
      icon: Cloud,
      badge: isPro ? <Sparkles className="w-2.5 h-2.5 text-amber-400" /> : null,
    },
  ];

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex justify-around items-center z-30 select-none"
      aria-label="Bottom Navigation"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            aria-label={`Go to ${tab.label} screen`}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 relative transition-all duration-150 cursor-pointer ${
              isActive
                ? 'text-emerald-400 font-semibold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute -top-1.5 w-6 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}

            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              {tab.badge && (
                <span
                  className={`absolute -top-1.5 -right-3 text-[9px] px-1 py-0.2 rounded-full font-bold flex items-center justify-center ${
                    tab.badge === 'PRO'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[8px]'
                      : typeof tab.badge === 'number'
                      ? 'bg-rose-500 text-white min-w-[14px] h-[14px]'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] mt-1 tracking-tight leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
