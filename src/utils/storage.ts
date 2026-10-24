import { CycleConfig, ExpenseItem, BillItem } from './cycleCalculations';
import { INITIAL_CYCLE_CONFIG, INITIAL_EXPENSES, INITIAL_BILLS } from './sampleData';
import { CloudBackupRecord, UserSubscription } from '../types';

const STORAGE_KEYS = {
  CONFIG: 'salarycycle_config_v1',
  EXPENSES: 'salarycycle_expenses_v1',
  BILLS: 'salarycycle_bills_v1',
  SUBSCRIPTION: 'salarycycle_sub_v1',
  BACKUPS: 'salarycycle_backups_v1',
  DEVICE_FRAME: 'salarycycle_frame_mode_v1',
  LAST_AD_TIME: 'salarycycle_last_ad_v1',
};

export function loadStoredConfig(): CycleConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse config from storage', e);
  }
  return { ...INITIAL_CYCLE_CONFIG };
}

export function saveStoredConfig(config: CycleConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config', e);
  }
}

export function loadStoredExpenses(): ExpenseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse expenses from storage', e);
  }
  return [...INITIAL_EXPENSES];
}

export function saveStoredExpenses(expenses: ExpenseItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save expenses', e);
  }
}

export function loadStoredBills(): BillItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse bills from storage', e);
  }
  return [...INITIAL_BILLS];
}

export function saveStoredBills(bills: BillItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  } catch (e) {
    console.error('Failed to save bills', e);
  }
}

export function loadStoredSubscription(): UserSubscription {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse subscription', e);
  }
  return { isPro: false, tier: 'free' };
}

export function saveStoredSubscription(sub: UserSubscription): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  } catch (e) {
    console.error('Failed to save subscription', e);
  }
}

export function loadStoredBackups(): CloudBackupRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BACKUPS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse backups', e);
  }
  return [
    {
      id: 'bak-initial',
      timestamp: '2026-10-18T14:30:00.000Z',
      deviceName: 'iPhone 16 Pro (SalaryCycle Sync)',
      expenseCount: 5,
      billCount: 6,
      totalCycleSavings: 1850,
    },
  ];
}

export function saveStoredBackups(backups: CloudBackupRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(backups));
  } catch (e) {
    console.error('Failed to save backups', e);
  }
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.BILLS);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
    localStorage.removeItem(STORAGE_KEYS.BACKUPS);
  } catch (e) {
    console.error('Failed to clear data', e);
  }
}
