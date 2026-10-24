import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, Volume2, VolumeX } from 'lucide-react';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProModal: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose,
  onOpenProModal,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interstitial-ad-title"
    >
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-5 flex flex-col items-center text-center">
        {/* Top bar with Countdown or Skip Button */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px]">
              ADVERTISEMENT
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 text-slate-400 hover:text-white transition"
              aria-label={isMuted ? 'Unmute ad audio' : 'Mute ad audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div>
            {canSkip ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-semibold border border-slate-600 transition cursor-pointer"
                aria-label="Skip Advertisement"
              >
                <span>Skip Ad</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                Reward in {countdown}s
              </span>
            )}
          </div>
        </div>

        {/* Video / Ad Graphic Content */}
        <div className="my-5 w-full bg-slate-850 rounded-2xl p-5 border border-slate-700/80 flex flex-col items-center shadow-inner relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 id="interstitial-ad-title" className="text-base font-bold text-white mb-1">
            Chime Smart Banking
          </h2>
          <p className="text-xs text-slate-300 max-w-[240px] leading-relaxed mb-3">
            Get your paycheck direct deposit up to <span className="text-emerald-400 font-bold">2 days early</span> with fee-free overdraft protection.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Over 14M+ Members Trust Chime</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button
            onClick={() => {
              window.open('https://chime.com', '_blank');
              if (canSkip) onClose();
            }}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/25 cursor-pointer"
          >
            Claim $0 Fee Banking
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenProModal();
            }}
            className="w-full py-2 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white text-[11px] font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Upgrade to Pro to Remove All Ads Forever</span>
          </button>
        </div>
      </div>
    </div>
  );
};
