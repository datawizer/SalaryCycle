import React, { useState } from 'react';
import { X, Sparkles, Check, Cloud, FileSpreadsheet, ShieldAlert, Zap, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserSubscription } from '../types';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpgrade: (tier: 'monthly' | 'lifetime') => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgrade,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpgrade(selectedPlan);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#f59e0b', '#38bdf8'],
        });
      } catch (e) {
        // Confetti fallback
      }
      onClose();
    }, 600);
  };

  const PRO_PERKS = [
    {
      icon: Zap,
      title: '100% Ad-Free Experience',
      desc: 'Never see banners, popups, or interstitial video ads again.',
    },
    {
      icon: Cloud,
      title: 'Automated Cloud Backup & Sync',
      desc: 'Seamlessly safeguard your salary history and restore to any device.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Deep-Dive PDF & CSV Reports',
      desc: 'Payday burn-rate trends, category velocity, and tax-ready summaries.',
    },
    {
      icon: ShieldAlert,
      title: 'Smart Overspend Alerts',
      desc: 'Get notified when daily spending threatens to deplete payday funds.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pro-upgrade-title"
    >
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition z-20 cursor-pointer"
          aria-label="Close Pro Upgrade Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Badge & Glow */}
        <div className="relative px-6 pt-7 pb-4 text-center bg-gradient-to-b from-emerald-950/40 via-slate-900 to-transparent">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SALARYCYCLE PRO</span>
          </div>

          <h2 id="pro-upgrade-title" className="text-xl font-extrabold text-white tracking-tight">
            Take Full Control of Your Payday
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Zero ads, automated encrypted cloud backups, and advanced financial analytics.
          </p>
        </div>

        {/* Perks List */}
        <div className="px-6 py-2 overflow-y-auto space-y-2.5">
          {PRO_PERKS.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-100">{perk.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">{perk.desc}</p>
                </div>
              </div>
            );
          })}

          {/* Subscription Tier Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Monthly */}
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'monthly'
                  ? 'bg-slate-800/90 border-emerald-400/80 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400'
                  : 'bg-slate-850/50 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-400">Monthly</span>
                <div className="text-lg font-bold text-white mt-1">$2.99</div>
                <span className="text-[10px] text-slate-500">per month</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                <span>Cancel anytime</span>
              </div>
            </button>

            {/* Lifetime (Highlighted) */}
            <button
              onClick={() => setSelectedPlan('lifetime')}
              className={`p-3 rounded-2xl border text-left transition relative cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'lifetime'
                  ? 'bg-emerald-950/30 border-emerald-400 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400'
                  : 'bg-slate-850/50 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                Best Value
              </span>
              <div>
                <span className="text-[11px] font-bold text-emerald-400">Lifetime Pass</span>
                <div className="text-lg font-black text-white mt-1">$24.99</div>
                <span className="text-[10px] text-slate-400 line-through mr-1">$49.99</span>
                <span className="text-[10px] text-amber-400 font-semibold">Pay Once</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <Check className="w-3 h-3" />
                <span>Never pay again</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer with Checkout CTA */}
        <div className="p-6 pt-3 bg-slate-950/90 border-t border-slate-800 flex flex-col items-center">
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
          >
            {isProcessing ? (
              <span className="animate-pulse">Activating Pro Access...</span>
            ) : (
              <>
                <Award className="w-4 h-4 text-slate-950" />
                <span>
                  Unlock Pro {selectedPlan === 'lifetime' ? 'for $24.99' : 'for $2.99/mo'}
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between w-full mt-2.5 text-[10px] text-slate-400">
            <button
              onClick={() => {
                onUpgrade('lifetime');
                onClose();
              }}
              className="hover:text-slate-200 underline cursor-pointer"
            >
              Restore Purchases
            </button>
            <span>Instant Activation • 30-Day Guarantee</span>
            <button onClick={onClose} className="hover:text-slate-200 cursor-pointer">
              Continue Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
