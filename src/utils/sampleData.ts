import { CycleConfig, ExpenseItem, BillItem } from './cycleCalculations';

export const INITIAL_CYCLE_CONFIG: CycleConfig = {
  salaryAmount: 3850,
  additionalIncome: 150,
  frequency: 'monthly',
  startDate: '2026-10-01',
  nextPayday: '2026-10-31',
  currencySymbol: '$',
};

export const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: 'exp-1', title: 'Groceries at Trader Joe\'s', amount: 142.50, category: 'Groceries', date: '2026-10-04', note: 'Weekly pantry restock' },
  { id: 'exp-2', title: 'Team Dinner & Sushi', amount: 68.00, category: 'Dining', date: '2026-10-07', note: 'Dinner outing' },
  { id: 'exp-3', title: 'Gas Fuel Refill', amount: 48.00, category: 'Transport', date: '2026-10-10', note: 'Shell gas station' },
  { id: 'exp-4', title: 'Supermarket Essentials', amount: 112.20, category: 'Groceries', date: '2026-10-14', note: 'Produce and dairy' },
  { id: 'exp-5', title: 'Pharmacy Vitamins', amount: 28.50, category: 'Health', date: '2026-10-17', note: 'Daily wellness' },
  { id: 'exp-6', title: 'Weekend Coffee & Bakery', amount: 24.00, category: 'Dining', date: '2026-10-19', note: 'Espresso & croissant' },
  { id: 'exp-7', title: 'Salad & Lunch Bowl', amount: 16.80, category: 'Dining', date: '2026-10-21', note: 'Quick work lunch' },
];

export const INITIAL_BILLS: BillItem[] = [
  { id: 'bill-1', title: 'Apartment Rent', amount: 1200, category: 'Housing', dueDate: '2026-10-02', isPaid: true, isRecurring: true, frequency: 'monthly' },
  { id: 'bill-2', title: 'High-Speed Fiber Internet', amount: 65, category: 'Utilities', dueDate: '2026-10-24', isPaid: false, isRecurring: true, frequency: 'monthly' },
  { id: 'bill-3', title: 'City Electric & Gas Power', amount: 110, category: 'Utilities', dueDate: '2026-10-27', isPaid: false, isRecurring: true, frequency: 'monthly' },
  { id: 'bill-4', title: 'Fitness Gym Membership', amount: 45, category: 'Health', dueDate: '2026-10-28', isPaid: false, isRecurring: true, frequency: 'monthly' },
  { id: 'bill-5', title: 'Car Insurance Auto Policy', amount: 135, category: 'Auto', dueDate: '2026-10-29', isPaid: false, isRecurring: true, frequency: 'monthly' },
  { id: 'bill-6', title: 'Netflix & Spotify Streaming', amount: 32, category: 'Entertainment', dueDate: '2026-10-12', isPaid: true, isRecurring: true, frequency: 'monthly' },
];

export const EXPENSE_CATEGORIES = [
  { name: 'Groceries', icon: 'ShoppingBag', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { name: 'Dining', icon: 'Utensils', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { name: 'Transport', icon: 'Car', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { name: 'Shopping', icon: 'Shirt', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { name: 'Entertainment', icon: 'Tv', color: 'bg-pink-500/15 text-pink-400 border-pink-500/30' },
  { name: 'Health', icon: 'HeartPulse', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  { name: 'Housing', icon: 'Home', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  { name: 'Utilities', icon: 'Zap', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  { name: 'Other', icon: 'CircleEllipsis', color: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
];
