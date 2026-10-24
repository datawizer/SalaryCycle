import React from 'react';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  nextPaydayText: string;
  safePerDayText: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isFrameMode,
  onToggleFrameMode,
  nextPaydayText,
  safePerDayText,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Device Mode Toolbar */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs z-50 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200 tracking-wide">SalaryCycle</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-medium">
            React Native Expo Ready
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFrameMode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs border border-slate-700 shadow-sm cursor-pointer"
            title="Toggle between realistic smartphone frame and full view"
            aria-label="Toggle device frame view"
          >
            {isFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>Full Web View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile Frame View</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 md:p-6 overflow-hidden">
        {isFrameMode ? (
          /* Realistic Smartphone Frame (iPhone 16 Pro styling) */
          <div className="relative w-full max-w-[400px] h-[844px] bg-slate-900 rounded-[50px] shadow-2xl shadow-emerald-950/30 border-[10px] border-slate-800 ring-1 ring-slate-700/60 flex flex-col overflow-hidden transition-all duration-300">
            {/* Phone Speaker and Hardware Buttons accent */}
            <div className="absolute -left-[13px] top-[120px] w-[3px] h-[26px] bg-slate-700 rounded-l" />
            <div className="absolute -left-[13px] top-[160px] w-[3px] h-[48px] bg-slate-700 rounded-l" />
            <div className="absolute -left-[13px] top-[220px] w-[3px] h-[48px] bg-slate-700 rounded-l" />
            <div className="absolute -right-[13px] top-[160px] w-[3px] h-[70px] bg-slate-700 rounded-r" />

            {/* Mobile Status Bar */}
            <div className="w-full bg-slate-950 px-7 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-slate-300 select-none z-40 shrink-0">
              <span className="text-[13px] font-mono tracking-tight text-white">9:41</span>
              {/* Dynamic Island Pill */}
              <div
                className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 text-[10px] border border-slate-800 shadow-inner group cursor-default"
                title={`${nextPaydayText} • Safe: ${safePerDayText}`}
              >
                <span className="text-emerald-400 font-medium truncate max-w-[55px] text-[9px]">
                  {safePerDayText}
                </span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-[10px] font-bold text-slate-400">5G</span>
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-0.5">
                  <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                </div>
              </div>
            </div>

            {/* Content viewport with mobile scroll */}
            <div className="flex-1 overflow-y-auto bg-slate-950 flex flex-col relative text-slate-100 scrollbar-thin scrollbar-thumb-slate-800">
              {children}
            </div>

            {/* Home Swipe Indicator */}
            <div className="w-full bg-slate-950 py-2 flex justify-center items-center shrink-0 z-40 border-t border-slate-900/50">
              <div className="w-32 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        ) : (
          /* Fluid Modern Container */
          <div className="w-full max-w-lg min-h-[90vh] bg-slate-950 md:rounded-3xl border-x md:border border-slate-800 shadow-xl flex flex-col overflow-hidden relative">
            {/* Top mobile simulated header for fluid mode */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 sticky top-0 z-30 backdrop-blur-md">
              <span className="font-semibold text-slate-300">SalaryCycle Mobile</span>
              <span className="text-emerald-400 font-mono font-medium">{safePerDayText} safe / day</span>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col bg-slate-950 pt-1">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
