import React, { useState } from 'react';
import {
  BarChart3,
  Sparkles,
  Lock,
  Download,
  FileText,
  TrendingUp,
  PieChart,
  Calendar,
  CheckCircle2,
  Printer,
  Share2,
} from 'lucide-react';
import { CycleConfig, CycleMetrics, ExpenseItem, BillItem, formatCurrency } from '../utils/cycleCalculations';

interface ReportsViewProps {
  config: CycleConfig;
  metrics: CycleMetrics;
  expenses: ExpenseItem[];
  bills: BillItem[];
  isPro: boolean;
  onOpenProModal: () => void;
  onTriggerAd: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  config,
  metrics,
  expenses,
  bills,
  isPro,
  onOpenProModal,
  onTriggerAd,
}) => {
  const sym = config.currencySymbol;
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  }
  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  const handleExportCSV = () => {
    const rows = [
      ['SalaryCycle Financial Report'],
      ['Cycle Period', `${config.startDate} to ${config.nextPayday}`],
      ['Total Salary Income', `${sym}${metrics.totalIncome}`],
      ['Total Expenses Spent', `${sym}${metrics.totalSpent}`],
      ['Pending Bills Reserved', `${sym}${metrics.pendingBillsTotal}`],
      ['Safe to Spend Remaining', `${sym}${metrics.safeToSpend}`],
      ['Daily Safe Allowance', `${sym}${metrics.dailySafeToSpend}`],
      [''],
      ['EXPENSES LOG'],
      ['Date', 'Title', 'Category', 'Amount', 'Note'],
      ...expenses.map((e) => [e.date, `"${e.title}"`, e.category, e.amount, `"${e.note || ''}"`]),
      [''],
      ['SCHEDULED BILLS'],
      ['Due Date', 'Bill Name', 'Category', 'Amount', 'Status'],
      ...bills.map((b) => [b.dueDate, `"${b.title}"`, b.category, b.amount, b.isPaid ? 'Paid' : 'Unpaid']),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SalaryCycle_Report_${config.startDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV Report downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">Financial Insights</h1>
          <p className="text-xs text-slate-400">Payday burn rate and category analytics</p>
        </div>

        {isPro ? (
          <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>PRO REPORTING</span>
          </span>
        ) : (
          <button
            onClick={onOpenProModal}
            className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 hover:bg-amber-500/30 transition cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>Unlock Pro Reports</span>
          </button>
        )}
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Burn Rate Velocity Card */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Burn Rate Velocity
          </span>
          <span className="text-xs font-bold text-emerald-400">
            {metrics.daysRemaining} days left in cycle
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Actual Burn Rate</span>
            <span className="text-xl font-black text-white mt-0.5 block">
              {formatCurrency(metrics.actualDailyBurnRate, sym)}
              <span className="text-xs text-slate-400 font-normal"> / day</span>
            </span>
            <span className="text-[9px] text-slate-500 mt-1 block">Based on past {metrics.daysPassed} days</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Safe Allowance Target</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              {formatCurrency(metrics.dailySafeToSpend, sym)}
              <span className="text-xs text-slate-400 font-normal"> / day</span>
            </span>
            <span className="text-[9px] text-slate-500 mt-1 block">To arrive at payday safely</span>
          </div>
        </div>

        {/* Projected ending surplus */}
        <div className="mt-3 p-3 rounded-xl bg-slate-850 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Projected Payday Surplus
            </span>
            <p className="text-[11px] text-slate-300">Expected savings when next paycheck arrives</p>
          </div>
          <span
            className={`text-base font-black ${
              metrics.projectedEndingBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(metrics.projectedEndingBalance, sym)}
          </span>
        </div>
      </div>

      {/* Category Spending Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-emerald-400" />
          <span>Category Breakdown</span>
        </h2>

        {categoryEntries.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No expenses logged yet</p>
        ) : (
          <div className="space-y-3">
            {categoryEntries.map(([cat, amt]) => {
              const percent = metrics.totalSpent > 0 ? Math.round((amt / metrics.totalSpent) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat}</span>
                    <span className="font-bold text-slate-300">
                      {formatCurrency(amt, sym)}{' '}
                      <span className="text-slate-500 text-[10px]">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monetization: Premium PDF & CSV Export Hub */}
      {isPro ? (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase text-white tracking-wide">
              Pro Export & Tax-Ready Reports
            </h2>
          </div>
          <p className="text-[11px] text-slate-300">
            Generate clean spreadsheets and printable balance statements for this pay cycle.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleExportCSV}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      ) : (
        /* Locked Pro Teaser Card */
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Premium Payday Reports Locked
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Export comprehensive PDF statements, CSV spreadsheets, and track 6-month historical cycle trends.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={onOpenProModal}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Unlock Pro Reports ($2.99)
            </button>
            <button
              onClick={onTriggerAd}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Watch video ad to test report preview"
            >
              Watch Ad (5s)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
