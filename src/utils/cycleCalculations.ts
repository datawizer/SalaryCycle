export type CycleFrequency = 'monthly' | 'biweekly' | 'semimonthly' | 'weekly';

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
  receiptUrl?: string;
}

export interface BillItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  dueDate: string; // YYYY-MM-DD or day of month (1-31)
  isPaid: boolean;
  isRecurring: boolean;
  frequency: 'monthly' | 'quarterly' | 'yearly';
}

export interface CycleConfig {
  salaryAmount: number;
  additionalIncome: number;
  frequency: CycleFrequency;
  startDate: string; // YYYY-MM-DD
  nextPayday: string; // YYYY-MM-DD
  currencySymbol: string;
}

export interface CycleMetrics {
  totalIncome: number;
  totalSpent: number;
  totalBills: number;
  paidBillsTotal: number;
  pendingBillsTotal: number;
  nominalRemaining: number;
  safeToSpend: number;
  totalDaysInCycle: number;
  daysPassed: number;
  daysRemaining: number;
  cycleProgressPercent: number;
  dailySafeToSpend: number;
  actualDailyBurnRate: number;
  budgetStatus: 'healthy' | 'caution' | 'critical' | 'payday_today';
  projectedEndingBalance: number;
}

/**
 * Difference in full days between two ISO date strings (d2 - d1).
 */
export function getDaysDiff(date1Str: string, date2Str: string): number {
  const d1 = new Date(date1Str + 'T00:00:00');
  const d2 = new Date(date2Str + 'T00:00:00');
  const msDiff = d2.getTime() - d1.getTime();
  return Math.round(msDiff / (1000 * 60 * 60 * 24));
}

/**
 * Calculates next payday given a cycle frequency and starting date.
 */
export function calculateNextPayday(startDateStr: string, frequency: CycleFrequency): string {
  const date = new Date(startDateStr + 'T00:00:00');

  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'semimonthly': {
      const day = date.getDate();
      if (day < 15) {
        date.setDate(15);
      } else {
        // Go to end of current month
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();
        if (day >= lastDay) {
          // Go to 15th of next month
          date.setMonth(month + 1);
          date.setDate(15);
        } else {
          date.setDate(lastDay);
        }
      }
      break;
    }
    case 'monthly':
    default: {
      const originalDay = date.getDate();
      date.setMonth(date.getMonth() + 1);
      // Check for month overflow (e.g. Jan 31 -> Feb 28)
      if (date.getDate() !== originalDay) {
        date.setDate(0);
      }
      break;
    }
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Pure calculation of all cycle metrics, safe-to-spend, burn rate, and health status.
 */
export function calculateCycleMetrics(
  config: CycleConfig,
  expenses: ExpenseItem[],
  bills: BillItem[],
  currentDateStr: string
): CycleMetrics {
  const totalIncome = Math.max(0, config.salaryAmount + (config.additionalIncome || 0));

  // Sum expenses logged in the current cycle
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Compute pending and paid bills
  let paidBillsTotal = 0;
  let pendingBillsTotal = 0;

  for (const bill of bills) {
    const amt = Number(bill.amount) || 0;
    if (bill.isPaid) {
      paidBillsTotal += amt;
    } else {
      pendingBillsTotal += amt;
    }
  }

  const totalBills = paidBillsTotal + pendingBillsTotal;

  // Nominal remaining: Income minus expenses and already paid bills
  const nominalRemaining = totalIncome - totalSpent - paidBillsTotal;

  // Safe to spend: nominal remaining minus bills that still MUST be paid before payday
  const safeToSpend = nominalRemaining - pendingBillsTotal;

  // Days calculations
  const totalDaysInCycle = Math.max(1, getDaysDiff(config.startDate, config.nextPayday));
  const rawDaysPassed = getDaysDiff(config.startDate, currentDateStr);
  const daysPassed = Math.max(0, Math.min(totalDaysInCycle, rawDaysPassed));
  
  const rawDaysRemaining = getDaysDiff(currentDateStr, config.nextPayday);
  const daysRemaining = Math.max(0, rawDaysRemaining);

  const cycleProgressPercent = Math.min(100, Math.max(0, Math.round((daysPassed / totalDaysInCycle) * 100)));

  // Daily safe-to-spend allowance
  const daysDivisor = daysRemaining <= 0 ? 1 : daysRemaining;
  const dailySafeToSpend = Math.max(0, safeToSpend / daysDivisor);

  // Actual burn rate per day passed
  const burnDivisor = daysPassed <= 0 ? 1 : daysPassed;
  const actualDailyBurnRate = totalSpent / burnDivisor;

  // Health status
  let budgetStatus: CycleMetrics['budgetStatus'] = 'healthy';
  if (daysRemaining === 0) {
    budgetStatus = 'payday_today';
  } else if (safeToSpend < 0) {
    budgetStatus = 'critical';
  } else {
    // If daily actual burn rate exceeds daily safe allowance by 30%, caution
    if (actualDailyBurnRate > dailySafeToSpend * 1.3 && daysPassed >= 2) {
      budgetStatus = 'caution';
    } else {
      budgetStatus = 'healthy';
    }
  }

  // Projected ending balance if spending continues at current burn rate
  const projectedEndingBalance = safeToSpend - (actualDailyBurnRate * daysRemaining);

  return {
    totalIncome,
    totalSpent,
    totalBills,
    paidBillsTotal,
    pendingBillsTotal,
    nominalRemaining,
    safeToSpend,
    totalDaysInCycle,
    daysPassed,
    daysRemaining,
    cycleProgressPercent,
    dailySafeToSpend: Math.round(dailySafeToSpend * 100) / 100,
    actualDailyBurnRate: Math.round(actualDailyBurnRate * 100) / 100,
    budgetStatus,
    projectedEndingBalance: Math.round(projectedEndingBalance * 100) / 100,
  };
}

/**
 * Format currency with symbol.
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}
