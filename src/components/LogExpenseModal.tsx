import React, { useState } from 'react';
import { X, Check, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { ExpenseItem } from '../utils/cycleCalculations';
import { EXPENSE_CATEGORIES } from '../utils/sampleData';

interface LogExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  currencySymbol: string;
}

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];
const QUICK_TITLES = ['Groceries', 'Coffee & Snack', 'Work Lunch', 'Rideshare / Gas', 'Supermarket', 'Pharmacy'];

export const LogExpenseModal: React.FC<LogExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  currencySymbol,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid expense amount greater than 0');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a description or vendor');
      return;
    }

    onSaveExpense({
      title: title.trim(),
      amount: num,
      category,
      date,
      note: note.trim() || undefined,
    });

    // Reset & close
    setTitle('');
    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  const handleAddPreset = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-expense-title"
    >
      <div className="w-full max-w-md bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              +
            </div>
            <h2 id="log-expense-title" className="text-base font-bold text-white">
              Log Cycle Expense
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close expense modal"
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
          {/* Big Amount Input */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Expense Amount ({currencySymbol})
            </label>
            <div className="relative rounded-2xl bg-slate-950 border border-slate-700/80 focus-within:border-emerald-500 flex items-center px-4 py-3">
              <span className="text-2xl font-bold text-slate-400 mr-2">{currencySymbol}</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="w-full bg-transparent text-2xl font-black text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Quick add chips */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-500 shrink-0">Quick add:</span>
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAddPreset(val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition cursor-pointer"
                >
                  +{currencySymbol}{val}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Quick Title Suggestions */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Description / Place
            </label>
            <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 focus-within:border-emerald-500 flex items-center px-3 py-2.5">
              <input
                type="text"
                required
                placeholder="e.g. Trader Joe's groceries"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError('');
                }}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
            {/* Quick Title Chips */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {QUICK_TITLES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTitle(t);
                    if (t.includes('Groceries') || t.includes('Supermarket')) setCategory('Groceries');
                    else if (t.includes('Lunch') || t.includes('Coffee')) setCategory('Dining');
                    else if (t.includes('Gas') || t.includes('Rideshare')) setCategory('Transport');
                    else if (t.includes('Pharmacy')) setCategory('Health');
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Date
            </label>
            <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 flex items-center px-3 py-2">
              <Calendar className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Note (Optional)
            </label>
            <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 flex items-center px-3 py-2">
              <FileText className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="text"
                placeholder="Add receipt or memo details"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Record Expense to Cycle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
