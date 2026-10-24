import React, { useState } from 'react';
import { Sparkles, ExternalLink, X, Info } from 'lucide-react';

interface AdBannerProps {
  isPro: boolean;
  onOpenProModal: () => void;
}

const SAMPLE_ADS = [
  {
    sponsor: 'Chime Direct Deposit',
    title: 'Get paid up to 2 days early! 💸',
    body: 'No monthly fees and fee-free overdraft up to $200 with SpotMe.',
    cta: 'Learn More',
    tag: 'Ad • Financial Partner',
  },
  {
    sponsor: 'High-Yield Wealth 5.2% APY',
    title: 'Grow your payday surplus automatically',
    body: 'Earn 10x national average interest on safe-to-spend reserves.',
    cta: 'Open Account',
    tag: 'Ad • Sponsor',
  },
  {
    sponsor: 'BillCutter Auto-Negotiator',
    title: 'Lower monthly utility & wifi bills by 25%',
    body: 'We contact providers to negotiate lower bills without changing plans.',
    cta: 'Check Savings',
    tag: 'Ad • Featured',
  },
];

export const AdBanner: React.FC<AdBannerProps> = ({ isPro, onOpenProModal }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isDismissedTemporarily, setIsDismissedTemporarily] = useState(false);
  const [showAdInfo, setShowAdInfo] = useState(false);

  // If user has Pro, ads are completely removed!
  if (isPro || isDismissedTemporarily) {
    return null;
  }

  const ad = SAMPLE_ADS[currentAdIndex];

  const handleNextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % SAMPLE_ADS.length);
  };

  return (
    <div className="mx-3 my-2 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/60 rounded-xl p-2.5 shadow-md relative overflow-hidden transition-all">
      {/* Top micro bar */}
      <div className="flex items-center justify-between mb-1 text-[9px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="bg-amber-400 text-slate-950 font-black px-1 py-0.2 rounded text-[8px] tracking-wide">
            AD
          </span>
          <span className="font-medium text-slate-300 truncate max-w-[120px]">{ad.sponsor}</span>
          <button
            onClick={() => setShowAdInfo(!showAdInfo)}
            className="text-slate-400 hover:text-slate-200 cursor-pointer"
            aria-label="Ad information"
          >
            <Info className="w-2.5 h-2.5" />
          </button>
        </div>

        <button
          onClick={onOpenProModal}
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer group"
          aria-label="Remove ads with Pro"
        >
          <Sparkles className="w-2.5 h-2.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Remove Ads with Pro</span>
        </button>
      </div>

      {/* Ad message */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-100 truncate">{ad.title}</p>
          <p className="text-[10px] text-slate-400 line-clamp-1">{ad.body}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleNextAd}
            className="px-2 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 rounded text-[10px] font-medium flex items-center gap-1 transition cursor-pointer"
            aria-label="Next sponsor ad"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => setIsDismissedTemporarily(true)}
            className="p-1 text-slate-500 hover:text-slate-300 transition cursor-pointer"
            title="Dismiss temporarily"
            aria-label="Close ad temporarily"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {showAdInfo && (
        <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded">
          <p>This is a simulated mobile ad placement (AdMob / AppLovin). Free tier users view ads to support app operations. Upgrading to SalaryCycle Pro permanently disables all banners and video interstitials, unlocking encrypted cloud backups and advanced PDF reports.</p>
        </div>
      )}
    </div>
  );
};
