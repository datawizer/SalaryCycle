import React, { useState, useEffect } from 'react';
import {
  CycleConfig,
  CycleMetrics,
  ExpenseItem,
  BillItem,
  calculateCycleMetrics,
  formatCurrency,
} from './utils/cycleCalculations';
import {
  loadStoredConfig,
  saveStoredConfig,
  loadStoredExpenses,
  saveStoredExpenses,
  loadStoredBills,
  saveStoredBills,
  loadStoredSubscription,
  saveStoredSubscription,
  loadStoredBackups,
  saveStoredBackups,
  resetAllData,
} from './utils/storage';
import { TabType, CloudBackupRecord, UserSubscription } from './types';
import { MobileFrame } from './components/MobileFrame';
import { TabBar } from './components/TabBar';
import { DashboardView } from './views/DashboardView';
import { ExpensesView } from './views/ExpensesView';
import { BillsView } from './views/BillsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

import { LogExpenseModal } from './components/LogExpenseModal';
import { AddBillModal } from './components/AddBillModal';
import { CycleSettingsModal } from './components/CycleSettingsModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { InterstitialAdModal } from './components/InterstitialAdModal';
import { ExpoCodeViewerModal } from './components/ExpoCodeViewerModal';

export default function App() {
  const [config, setConfig] = useState<CycleConfig>(loadStoredConfig);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(loadStoredExpenses);
  const [bills, setBills] = useState<BillItem[]>(loadStoredBills);
  const [subscription, setSubscription] = useState<UserSubscription>(loadStoredSubscription);
  const [backups, setBackups] = useState<CloudBackupRecord[]>(loadStoredBackups);

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(() => {
    // Default to mobile frame on desktop, fluid on small screens
    return typeof window !== 'undefined' ? window.innerWidth > 768 : true;
  });

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isInterstitialAdOpen, setIsInterstitialAdOpen] = useState(false);
  const [isExpoModalOpen, setIsExpoModalOpen] = useState(false);

  // User action counter to naturally trigger interstitial ad in free tier
  const [actionCounter, setActionCounter] = useState(0);

  // Simulated current date (defaults to 2026-10-21 matching current environment, or today)
  const currentDateStr = '2026-10-21';

  // Realtime cycle calculations
  const metrics: CycleMetrics = calculateCycleMetrics(config, expenses, bills, currentDateStr);

  // Persist state updates
  useEffect(() => {
    saveStoredConfig(config);
  }, [config]);

  useEffect(() => {
    saveStoredExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveStoredBills(bills);
  }, [bills]);

  useEffect(() => {
    saveStoredSubscription(subscription);
  }, [subscription]);

  useEffect(() => {
    saveStoredBackups(backups);
  }, [backups]);

  // Handle action tracking for monetization interstitial ads
  const registerAction = () => {
    if (subscription.isPro) return;
    const nextCount = actionCounter + 1;
    setActionCounter(nextCount);
    // Show interstitial ad every 6 interactive actions
    if (nextCount > 0 && nextCount % 6 === 0) {
      setIsInterstitialAdOpen(true);
    }
  };

  // Actions
  const handleSaveExpense = (newExp: Omit<ExpenseItem, 'id'>) => {
    const item: ExpenseItem = {
      ...newExp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [item, ...prev]);
    registerAction();
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    registerAction();
  };

  const handleSaveBill = (newBill: Omit<BillItem, 'id'>) => {
    const item: BillItem = {
      ...newBill,
      id: `bill-${Date.now()}`,
    };
    setBills((prev) => [...prev, item]);
    registerAction();
  };

  const handleToggleBillPaid = (id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPaid: !b.isPaid } : b))
    );
    registerAction();
  };

  const handleDeleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    registerAction();
  };

  const handleSaveConfig = (newConfig: CycleConfig) => {
    setConfig(newConfig);
    registerAction();
  };

  const handleUpgradePro = (tier: 'monthly' | 'lifetime') => {
    setSubscription({
      isPro: true,
      tier,
      expiryDate: tier === 'monthly' ? '2026-11-21' : undefined,
    });
  };

  const handleBackupNow = () => {
    const newRecord: CloudBackupRecord = {
      id: `bak-${Date.now()}`,
      timestamp: new Date().toISOString(),
      deviceName: 'iPhone 16 Pro (SalaryCycle Sync)',
      expenseCount: expenses.length,
      billCount: bills.length,
      totalCycleSavings: metrics.safeToSpend,
    };
    setBackups((prev) => [newRecord, ...prev]);
  };

  const handleRestoreBackup = (record: CloudBackupRecord) => {
    // Confirms restore
    alert(`Restored snapshot from ${new Date(record.timestamp).toLocaleDateString()} with ${record.expenseCount} expenses.`);
  };

  const handleResetData = () => {
    resetAllData();
    window.location.reload();
  };

  const pendingBillsCount = bills.filter((b) => !b.isPaid).length;
  const safePerDayText = `${config.currencySymbol}${metrics.dailySafeToSpend.toFixed(0)}`;
  const nextPaydayText = `${metrics.daysRemaining}d to Payday`;

  return (
    <MobileFrame
      isFrameMode={isFrameMode}
      onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
      nextPaydayText={nextPaydayText}
      safePerDayText={safePerDayText}
    >
      {/* Active Screen View */}
      <div className="flex-1 flex flex-col">
        {currentTab === 'dashboard' && (
          <DashboardView
            config={config}
            metrics={metrics}
            expenses={expenses}
            bills={bills}
            isPro={subscription.isPro}
            onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
            onOpenBillModal={() => setIsBillModalOpen(true)}
            onOpenConfigModal={() => setIsConfigModalOpen(true)}
            onOpenProModal={() => setIsProModalOpen(true)}
            onTriggerAd={() => setIsInterstitialAdOpen(true)}
            onToggleBillPaid={handleToggleBillPaid}
          />
        )}

        {currentTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            currencySymbol={config.currencySymbol}
            totalSpent={metrics.totalSpent}
            salary={config.salaryAmount}
            onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {currentTab === 'bills' && (
          <BillsView
            bills={bills}
            currencySymbol={config.currencySymbol}
            pendingTotal={metrics.pendingBillsTotal}
            paidTotal={metrics.paidBillsTotal}
            nextPayday={config.nextPayday}
            onOpenBillModal={() => setIsBillModalOpen(true)}
            onToggleBillPaid={handleToggleBillPaid}
            onDeleteBill={handleDeleteBill}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            config={config}
            metrics={metrics}
            expenses={expenses}
            bills={bills}
            isPro={subscription.isPro}
            onOpenProModal={() => setIsProModalOpen(true)}
            onTriggerAd={() => setIsInterstitialAdOpen(true)}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            subscription={subscription}
            backups={backups}
            config={config}
            onOpenProModal={() => setIsProModalOpen(true)}
            onOpenConfigModal={() => setIsConfigModalOpen(true)}
            onOpenExpoCodeModal={() => setIsExpoModalOpen(true)}
            onBackupNow={handleBackupNow}
            onRestoreBackup={handleRestoreBackup}
            onResetData={handleResetData}
          />
        )}
      </div>

      {/* Persistent Bottom Tab Bar */}
      <TabBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingBillsCount={pendingBillsCount}
        isPro={subscription.isPro}
      />

      {/* Global Modals */}
      <LogExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSaveExpense={handleSaveExpense}
        currencySymbol={config.currencySymbol}
      />

      <AddBillModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onSaveBill={handleSaveBill}
        currencySymbol={config.currencySymbol}
      />

      <CycleSettingsModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        subscription={subscription}
        onUpgrade={handleUpgradePro}
      />

      <InterstitialAdModal
        isOpen={isInterstitialAdOpen}
        onClose={() => setIsInterstitialAdOpen(false)}
        onOpenProModal={() => {
          setIsInterstitialAdOpen(false);
          setIsProModalOpen(true);
        }}
      />

      <ExpoCodeViewerModal
        isOpen={isExpoModalOpen}
        onClose={() => setIsExpoModalOpen(false)}
      />
    </MobileFrame>
  );
}
