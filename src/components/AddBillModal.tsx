import React, { useState } from 'react';
import { X, Check, Calendar, Receipt, AlertCircle } from 'lucide-react';
import { BillItem } from '../utils/cycleCalculations';

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBill: (bill: Omit<BillItem, 'id'>) => void;
  currencySymbol: string;
}

const BILL_CATEGORIES = ['Housing', 'Utilities', 'Auto', 'Entertainment', 'Health', 'Debt', 'Other'];

export const AddBillModal: React.FC<AddBillModalProps> = ({
  isOpen,
  onClose,
  onSaveBill,
  currencySymbol,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid bill amount greater than 0');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a name for this bill (e.g. Electric, Rent)');
      return;
    }

    onSaveBill({
      title: title.trim(),
      amount: num,
      category,
      dueDate,
      frequency,
      isRecurring: true,
      isPaid,
    });

    // Reset & close
    setTitle('');
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-bill-title"
    >
      <div className="w-full max-w-md bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 id="add-bill-title" className="text-base font-bold text-white">
              Schedule Bill Before Payday
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close bill modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Bill Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Wifi Internet, Gym, Rent"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Amount Due ({currencySymbol})
            </label>
            <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 flex items-center px-3 py-2.5">
              <span className="text-lg font-bold text-slate-400 mr-2">{currencySymbol}</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="w-full bg-transparent text-lg font-bold text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
            <p className="text-[10px] text-amber-400/90 mt-1">
              ⚠️ Unpaid bills are automatically reserved and deducted from your daily safe-to-spend.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {BILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                Recurrence
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Due Date
            </label>
            <div className="relative rounded-xl bg-slate-950 border border-slate-700/80 flex items-center px-3 py-2">
              <Calendar className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Paid status toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200">Already Paid this cycle?</span>
              <p className="text-[10px] text-slate-400">Mark as settled if paid from salary account</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPaid(!isPaid)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isPaid ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle bill paid status"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  isPaid ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Scheduled Bill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
