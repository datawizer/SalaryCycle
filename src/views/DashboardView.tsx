import React from 'react';
import {
  Sparkles,
  PlusCircle,
  Calendar,
  Receipt,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  PlayCircle,
  Clock,
} from 'lucide-react';
import { CycleConfig, CycleMetrics, ExpenseItem, BillItem, formatCurrency } from '../utils/cycleCalculations';
import { AdBanner } from '../components/AdBanner';

interface DashboardViewProps {
  config: CycleConfig;
  metrics: CycleMetrics;
  expenses: ExpenseItem[];
  bills: BillItem[];
  isPro: boolean;
  onOpenExpenseModal: () => void;
  onOpenBillModal: () => void;
  onOpenConfigModal: () => void;
  onOpenProModal: () => void;
  onTriggerAd: () => void;
  onToggleBillPaid: (billId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  config,
  metrics,
  expenses,
  bills,
  isPro,
  onOpenExpenseModal,
  onOpenBillModal,
  onOpenConfigModal,
  onOpenProModal,
  onTriggerAd,
  onToggleBillPaid,
}) => {
  const sym = config.currencySymbol;

  // Unpaid bills coming up before payday
  const pendingBillsList = bills.filter((b) => !b.isPaid);

  // Status badge helper
  const renderStatusBadge = () => {
    switch (metrics.budgetStatus) {
      case 'payday_today':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>It's Payday Today! 🎉</span>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Over Budget: Expenses exceed funds</span>
          </div>
        );
      case 'caution':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>High Burn Rate: Spending quickly</span>
          </div>
        );
      case 'healthy':
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>On Track to Payday</span>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4">
      {/* Top Header Card: Cycle period & Config button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
            <span>SalaryCycle</span>
            <span className="text-emerald-400">⚡</span>
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>
              {config.startDate} to {config.nextPayday} • Day {metrics.daysPassed} of {metrics.totalDaysInCycle}
            </span>
          </p>
        </div>

        <button
          onClick={onOpenConfigModal}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs cursor-pointer"
          title="Cycle Settings"
          aria-label="Open Cycle Settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-medium hidden sm:inline">Settings</span>
        </button>
      </div>

      {/* Hero Payday Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Days Countdown & Circular Ring */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              COUNTDOWN TO NEXT PAYDAY
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {metrics.daysRemaining}
              </span>
              <span className="text-sm font-bold text-slate-300 uppercase">
                {metrics.daysRemaining === 1 ? 'Day Left' : 'Days Left'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Next paycheck: <span className="text-slate-200 font-semibold">{config.nextPayday}</span>
            </p>
          </div>

          {/* Progress Circular Badge */}
          <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-700 ease-out"
                strokeDasharray={`${metrics.cycleProgressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-black text-white">{metrics.cycleProgressPercent}%</span>
              <span className="text-[8px] text-slate-400 font-medium">Elapsed</span>
            </div>
          </div>
        </div>

        {/* Daily Safe-to-Spend Centerpiece */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 backdrop-blur-sm mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-emerald-400 tracking-wide uppercase flex items-center gap-1">
              <span>Daily Safe-to-Spend</span>
            </span>
            {renderStatusBadge()}
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(metrics.dailySafeToSpend, sym)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ day</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Guaranteed safe daily budget after reserving{' '}
            <span className="text-amber-400 font-semibold">
              {formatCurrency(metrics.pendingBillsTotal, sym)}
            </span>{' '}
            for remaining bills.
          </p>
        </div>

        {/* Financial Triad Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">
              Safe Remaining
            </span>
            <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block truncate">
              {formatCurrency(metrics.safeToSpend, sym)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">
              Bills Reserved
            </span>
            <span className="text-sm font-extrabold text-amber-400 mt-0.5 block truncate">
              {formatCurrency(metrics.pendingBillsTotal, sym)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">
              Spent So Far
            </span>
            <span className="text-sm font-extrabold text-slate-200 mt-0.5 block truncate">
              {formatCurrency(metrics.totalSpent, sym)}
            </span>
          </div>
        </div>
      </div>

      {/* Fast Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenExpenseModal}
          className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition transform active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>+ Log Expense</span>
        </button>

        <button
          onClick={onOpenBillModal}
          className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
        >
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>+ Add Bill</span>
        </button>
      </div>

      {/* Monetization: Native In-App Ad Placement (Free Tier) */}
      <AdBanner isPro={isPro} onOpenProModal={onOpenProModal} />

      {/* Pending Bills Warning Banner if any are due before payday */}
      {pendingBillsList.length > 0 && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                {pendingBillsList.length} Upcoming {pendingBillsList.length === 1 ? 'Bill' : 'Bills'} Before Payday
              </p>
              <p className="text-[10px] text-amber-300/80">
                {formatCurrency(metrics.pendingBillsTotal, sym)} locked away from daily spending
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const firstBill = pendingBillsList[0];
              if (firstBill) onToggleBillPaid(firstBill.id);
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition cursor-pointer shrink-0"
            title="Mark next bill as paid"
          >
            Pay Next
          </button>
        </div>
      )}

      {/* Recent Activity List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recent Cycle Activity
          </h2>
          <span className="text-[11px] text-slate-500">
            {expenses.length} expenses logged
          </span>
        </div>

        <div className="space-y-2">
          {expenses.slice(0, 4).map((exp) => (
            <div
              key={exp.id}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between transition hover:border-slate-700"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                  {exp.category[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-100">{exp.title}</p>
                  <p className="text-[10px] text-slate-400">
                    {exp.category} • {exp.date}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-200">
                -{formatCurrency(exp.amount, sym)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewarded Ad / Pro Teaser Button */}
      {!isPro && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-100">Watch Sponsor Video</p>
              <p className="text-[10px] text-slate-400">Earn temporary Pro Burn Rate forecast</p>
            </div>
          </div>
          <button
            onClick={onTriggerAd}
            className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition cursor-pointer"
          >
            Watch (5s)
          </button>
        </div>
      )}
    </div>
  );
};
