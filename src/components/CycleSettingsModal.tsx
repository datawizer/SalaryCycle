import React, { useState } from 'react';
import { X, Check, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { CycleConfig, CycleFrequency, calculateNextPayday } from '../utils/cycleCalculations';

interface CycleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CycleConfig;
  onSaveConfig: (newConfig: CycleConfig) => void;
}

const FREQUENCIES: { id: CycleFrequency; label: string; desc: string }[] = [
  { id: 'monthly', label: 'Monthly', desc: 'Once a month on fixed date' },
  { id: 'biweekly', label: 'Bi-Weekly', desc: 'Every 2 weeks (26 paydays/yr)' },
  { id: 'semimonthly', label: 'Semi-Monthly', desc: '15th & Last day (24 paydays/yr)' },
  { id: 'weekly', label: 'Weekly', desc: 'Every week on fixed day' },
];

const CURRENCIES = ['$', '€', '£', '¥', '₹', 'C$', 'A$'];

export const CycleSettingsModal: React.FC<CycleSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [salaryAmount, setSalaryAmount] = useState(config.salaryAmount.toString());
  const [additionalIncome, setAdditionalIncome] = useState(config.additionalIncome.toString());
  const [frequency, setFrequency] = useState<CycleFrequency>(config.frequency);
  const [startDate, setStartDate] = useState(config.startDate);
  const [nextPayday, setNextPayday] = useState(config.nextPayday);
  const [currencySymbol, setCurrencySymbol] = useState(config.currencySymbol);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFrequencyChange = (newFreq: CycleFrequency) => {
    setFrequency(newFreq);
    // Automatically recalculate next payday from startDate
    const computedNext = calculateNextPayday(startDate, newFreq);
    setNextPayday(computedNext);
  };

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    const computedNext = calculateNextPayday(newStart, frequency);
    setNextPayday(computedNext);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sal = parseFloat(salaryAmount);
    if (isNaN(sal) || sal <= 0) {
      setError('Please enter a valid salary amount');
      return;
    }
    const extra = parseFloat(additionalIncome) || 0;

    onSaveConfig({
      salaryAmount: sal,
      additionalIncome: extra,
      frequency,
      startDate,
      nextPayday,
      currencySymbol,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cycle-settings-title"
    >
      <div className="w-full max-w-md bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <h2 id="cycle-settings-title" className="text-base font-bold text-white">
              Configure Payday Cycle
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close cycle settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Currency Selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Currency Symbol
            </label>
            <div className="flex items-center gap-2">
              {CURRENCIES.map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrencySymbol(cur)}
                  className={`w-9 h-9 rounded-xl font-bold text-sm border flex items-center justify-center transition cursor-pointer ${
                    currencySymbol === cur
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          {/* Salary Amount */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Net Take-Home Salary Per Paycheck
            </label>
            <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 flex items-center px-3 py-2.5">
              <span className="text-lg font-bold text-slate-400 mr-2">{currencySymbol}</span>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                className="w-full bg-transparent text-lg font-black text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Additional Income */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Bonus / Freelance Inflow (This Cycle)
            </label>
            <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 flex items-center px-3 py-2">
              <span className="text-sm font-semibold text-slate-400 mr-2">{currencySymbol}</span>
              <input
                type="number"
                step="1"
                min="0"
                value={additionalIncome}
                onChange={(e) => setAdditionalIncome(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Frequency radio buttons */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
              Pay Frequency Schedule
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCIES.map((f) => {
                const isSelected = frequency === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFrequencyChange(f.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{f.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                Cycle Started
              </label>
              <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 flex items-center px-3 py-2">
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                Next Payday
              </label>
              <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 flex items-center px-3 py-2">
                <input
                  type="date"
                  required
                  value={nextPayday}
                  onChange={(e) => setNextPayday(e.target.value)}
                  className="w-full bg-transparent text-xs text-emerald-400 font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Update Salary & Payday</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
