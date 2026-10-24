import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCycleMetrics,
  calculateNextPayday,
  getDaysDiff,
  formatCurrency,
  type CycleConfig,
  type ExpenseItem,
  type BillItem,
} from './cycleCalculations.ts';

test('getDaysDiff computes exact calendar days', () => {
  assert.equal(getDaysDiff('2026-10-01', '2026-10-15'), 14);
  assert.equal(getDaysDiff('2026-10-15', '2026-10-15'), 0);
  assert.equal(getDaysDiff('2026-10-20', '2026-10-15'), -5);
});

test('calculateNextPayday calculates biweekly and monthly cycles accurately', () => {
  const biweekly = calculateNextPayday('2026-10-01', 'biweekly');
  assert.equal(biweekly, '2026-10-15');

  const weekly = calculateNextPayday('2026-10-01', 'weekly');
  assert.equal(weekly, '2026-10-08');

  const monthly = calculateNextPayday('2026-10-01', 'monthly');
  assert.equal(monthly, '2026-11-01');
});

test('calculateCycleMetrics calculates nominal remaining and safe-to-spend subtracting pending bills', () => {
  const config: CycleConfig = {
    salaryAmount: 3000,
    additionalIncome: 200,
    frequency: 'monthly',
    startDate: '2026-10-01',
    nextPayday: '2026-10-31',
    currencySymbol: '$',
  };

  const expenses: ExpenseItem[] = [
    { id: '1', title: 'Groceries', amount: 150, category: 'Groceries', date: '2026-10-03' },
    { id: '2', title: 'Dinner', amount: 50, category: 'Dining', date: '2026-10-05' },
  ];

  const bills: BillItem[] = [
    { id: 'b1', title: 'Rent', amount: 1000, category: 'Housing', dueDate: '2026-10-05', isPaid: true, isRecurring: true, frequency: 'monthly' },
    { id: 'b2', title: 'Internet', amount: 80, category: 'Utilities', dueDate: '2026-10-20', isPaid: false, isRecurring: true, frequency: 'monthly' },
    { id: 'b3', title: 'Electric', amount: 120, category: 'Utilities', dueDate: '2026-10-25', isPaid: false, isRecurring: true, frequency: 'monthly' },
  ];

  // Current date is 2026-10-16 (15 days passed, 15 days remaining in a 30-day cycle)
  const metrics = calculateCycleMetrics(config, expenses, bills, '2026-10-16');

  // Total income = 3200
  assert.equal(metrics.totalIncome, 3200);
  // Total expenses = 200
  assert.equal(metrics.totalSpent, 200);
  // Paid bills = 1000
  assert.equal(metrics.paidBillsTotal, 1000);
  // Pending bills = 80 + 120 = 200
  assert.equal(metrics.pendingBillsTotal, 200);
  // Nominal remaining = 3200 - 200 (expenses) - 1000 (paid bill) = 2000
  assert.equal(metrics.nominalRemaining, 2000);
  // Safe-to-spend = nominal remaining - pending bills = 2000 - 200 = 1800
  assert.equal(metrics.safeToSpend, 1800);
  // Days: 15 days remaining -> daily safe to spend = 1800 / 15 = 120
  assert.equal(metrics.daysRemaining, 15);
  assert.equal(metrics.dailySafeToSpend, 120);
  // Status should be healthy
  assert.equal(metrics.budgetStatus, 'healthy');
});

test('calculateCycleMetrics detects critical status if expenses + pending bills exceed income', () => {
  const config: CycleConfig = {
    salaryAmount: 1000,
    additionalIncome: 0,
    frequency: 'biweekly',
    startDate: '2026-10-01',
    nextPayday: '2026-10-15',
    currencySymbol: '$',
  };

  const expenses: ExpenseItem[] = [
    { id: '1', title: 'Shopping spree', amount: 800, category: 'Shopping', date: '2026-10-05' },
  ];

  const bills: BillItem[] = [
    { id: 'b1', title: 'Car Loan', amount: 350, category: 'Auto', dueDate: '2026-10-10', isPaid: false, isRecurring: true, frequency: 'monthly' },
  ];

  const metrics = calculateCycleMetrics(config, expenses, bills, '2026-10-07');
  // Nominal remaining = 1000 - 800 = 200
  // Pending bill = 350 -> Safe to spend = 200 - 350 = -150
  assert.equal(metrics.safeToSpend, -150);
  assert.equal(metrics.budgetStatus, 'critical');
  assert.equal(metrics.dailySafeToSpend, 0);
});

test('formatCurrency formats positive and negative balances properly', () => {
  assert.equal(formatCurrency(124.5, '$'), '$124.50');
  assert.equal(formatCurrency(-45.2, '$'), '-$45.20');
  assert.equal(formatCurrency(0, '€'), '€0.00');
});
