import { CycleConfig, ExpenseItem, BillItem } from '../utils/cycleCalculations';

export type TabType = 'dashboard' | 'expenses' | 'bills' | 'reports' | 'settings';

export interface CloudBackupRecord {
  id: string;
  timestamp: string;
  deviceName: string;
  expenseCount: number;
  billCount: number;
  totalCycleSavings: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'payday' | 'bill' | 'budget' | 'system';
  read: boolean;
}

export interface UserSubscription {
  isPro: boolean;
  tier: 'free' | 'monthly' | 'lifetime';
  expiryDate?: string;
}
