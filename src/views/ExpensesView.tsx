import React, { useState } from 'react';
import { Plus, Search, Trash2, Tag, Calendar, Receipt, DollarSign, Filter } from 'lucide-react';
import { ExpenseItem, formatCurrency } from '../utils/cycleCalculations';
import { EXPENSE_CATEGORIES } from '../utils/sampleData';

interface ExpensesViewProps {
  expenses: ExpenseItem[];
  currencySymbol: string;
  totalSpent: number;
  salary: number;
  onOpenExpenseModal: () => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  currencySymbol,
  totalSpent,
  salary,
  onOpenExpenseModal,
  onDeleteExpense,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const spentPercent = salary > 0 ? Math.min(100, Math.round((totalSpent / salary) * 100)) : 0;

  // Filtered expenses
  const filtered = expenses.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4">
      {/* Header and Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">Cycle Expenses</h1>
          <p className="text-xs text-slate-400">Track every dollar spent before payday</p>
        </div>

        <button
          onClick={onOpenExpenseModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Spending Summary Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Spent this cycle
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {formatCurrency(totalSpent, currencySymbol)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              % of Salary
            </span>
            <div className="text-sm font-extrabold text-emerald-400 mt-0.5">
              {spentPercent}% consumed
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              spentPercent > 80 ? 'bg-rose-500' : spentPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${spentPercent}%` }}
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative rounded-xl bg-slate-900 border border-slate-800 flex items-center px-3 py-2 text-xs">
        <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search by vendor, place, or note..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All ({expenses.length})
        </button>

        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition cursor-pointer ${
              selectedCategory === cat.name
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">No expenses found</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Try a different filter or tap "Add Expense" to record spending.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold text-emerald-400">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-snug">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                    {item.note && <span className="italic truncate max-w-[100px]">"{item.note}"</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-sm font-extrabold text-slate-100">
                  -{formatCurrency(item.amount, currencySymbol)}
                </span>
                <button
                  onClick={() => onDeleteExpense(item.id)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-80 group-hover:opacity-100 cursor-pointer"
                  title="Delete expense"
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
