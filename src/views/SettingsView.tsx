import React, { useState } from 'react';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  Sparkles,
  Lock,
  Smartphone,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  HardDrive,
  Code,
  Zap,
} from 'lucide-react';
import { CloudBackupRecord, UserSubscription } from '../types';
import { CycleConfig } from '../utils/cycleCalculations';

interface SettingsViewProps {
  subscription: UserSubscription;
  backups: CloudBackupRecord[];
  config: CycleConfig;
  onOpenProModal: () => void;
  onOpenConfigModal: () => void;
  onOpenExpoCodeModal: () => void;
  onBackupNow: () => void;
  onRestoreBackup: (record: CloudBackupRecord) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  subscription,
  backups,
  config,
  onOpenProModal,
  onOpenConfigModal,
  onOpenExpoCodeModal,
  onBackupNow,
  onRestoreBackup,
  onResetData,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(true);

  const handleTriggerBackup = () => {
    if (!subscription.isPro) {
      onOpenProModal();
      return;
    }

    setIsSyncing(true);
    setSyncStatusMsg('Encrypting cycle financial state...');

    setTimeout(() => {
      setSyncStatusMsg('Uploading snapshot to secure cloud vault...');
    }, 500);

    setTimeout(() => {
      onBackupNow();
      setIsSyncing(false);
      setSyncStatusMsg('Cloud Backup completed successfully!');
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }, 1100);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-black text-white">Cloud & Settings</h1>
        <p className="text-xs text-slate-400">Sync data, manage Pro plan, and export Expo code</p>
      </div>

      {syncStatusMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Subscription Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${subscription.isPro ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white">SalaryCycle Pro</h2>
                {subscription.isPro && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {subscription.isPro
                  ? `Unlocked (${subscription.tier} tier) • Zero ads & full cloud sync`
                  : 'Free tier • Ads enabled'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenProModal}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              subscription.isPro
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25'
            }`}
          >
            {subscription.isPro ? 'Manage Plan' : 'Go Pro'}
          </button>
        </div>
      </div>

      {/* Cloud Backup & Sync Section (Monetization feature) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Encrypted Cloud Backup
            </h2>
          </div>
          {!subscription.isPro && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
              <Lock className="w-2.5 h-2.5" />
              <span>Pro Feature</span>
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Back up your salary cycles, expenses, and recurring bills to an encrypted cloud vault. Easily restore when switching phones.
        </p>

        {/* Auto sync switch */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200">Automatic Daily Cloud Sync</span>
            <p className="text-[10px] text-slate-500">Backs up after every new expense</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!subscription.isPro) {
                onOpenProModal();
                return;
              }
              setAutoSync(!autoSync);
            }}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              autoSync && subscription.isPro ? 'bg-emerald-500' : 'bg-slate-750'
            }`}
            aria-label="Toggle auto cloud sync"
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                autoSync && subscription.isPro ? 'left-5' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Backup Now CTA */}
        <button
          onClick={handleTriggerBackup}
          disabled={isSyncing}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {isSyncing ? (
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
          ) : (
            <CloudUpload className="w-4 h-4 text-emerald-400" />
          )}
          <span>{subscription.isPro ? 'Backup Current Cycle to Cloud' : 'Unlock Cloud Backup with Pro'}</span>
        </button>

        {/* Backup History */}
        <div className="pt-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Cloud Snapshots ({backups.length})
          </span>
          <div className="space-y-1.5">
            {backups.map((bak) => (
              <div
                key={bak.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-200 text-[11px]">{bak.deviceName}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(bak.timestamp).toLocaleDateString()} • {bak.expenseCount} expenses, {bak.billCount} bills
                  </p>
                </div>

                <button
                  onClick={() => onRestoreBackup(bak)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold border border-slate-700 transition cursor-pointer flex items-center gap-1"
                >
                  <CloudDownload className="w-3 h-3 text-emerald-400" />
                  <span>Restore</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* React Native Expo Source Hub */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white">React Native Expo Source</h2>
            <p className="text-[10px] text-slate-400">View & download native iOS/Android code</p>
          </div>
        </div>

        <button
          onClick={onOpenExpoCodeModal}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer"
        >
          View Code
        </button>
      </div>

      {/* Payday Cycle Settings Quick Link */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <div>
            <h2 className="text-xs font-bold text-slate-200">Pay Frequency & Salary</h2>
            <p className="text-[10px] text-slate-400">
              {config.frequency} • {config.currencySymbol}{config.salaryAmount} per paycheck
            </p>
          </div>
        </div>

        <button
          onClick={onOpenConfigModal}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* Reset Data Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (confirm('Reset all expenses, bills, and cycle data to initial demo state?')) {
              onResetData();
            }
          }}
          className="w-full py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl text-xs font-semibold transition border border-rose-500/20 cursor-pointer"
        >
          Reset to Demo Dataset
        </button>
      </div>
    </div>
  );
};
