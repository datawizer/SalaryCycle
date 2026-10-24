import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, Smartphone, Sparkles, ExternalLink } from 'lucide-react';
import { EXPO_APP_JS, EXPO_PACKAGE_JSON } from '../utils/expoSourceCode';

interface ExpoCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpoCodeViewerModal: React.FC<ExpoCodeViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'app' | 'package' | 'guide'>('app');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = activeTab === 'app' ? EXPO_APP_JS : EXPO_PACKAGE_JSON;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'app' ? 'App.js' : 'package.json';
    const blob = new Blob([currentCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expo-code-title"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="expo-code-title" className="text-sm font-bold text-white">
                  React Native Expo Mobile Codebase
                </h2>
                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                  Expo SDK 52
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Native iOS & Android mobile application source code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close Expo Code modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                activeTab === 'app'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              App.js
            </button>
            <button
              onClick={() => setActiveTab('package')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                activeTab === 'package'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              package.json
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-medium transition cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              🚀 Expo Launch Guide
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
              aria-label="Copy React Native code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            {activeTab !== 'guide' && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition cursor-pointer"
                aria-label="Download Expo file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-300">
          {activeTab === 'guide' ? (
            <div className="font-sans space-y-4 text-xs text-slate-300 p-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  Quick Launch with Expo CLI:
                </h3>
                <div className="bg-black/60 p-3 rounded-lg font-mono text-emerald-400 text-xs space-y-2 border border-slate-800">
                  <p># 1. Initialize fresh Expo app</p>
                  <p className="text-white">npx create-expo-app salarycycle-mobile</p>
                  <p># 2. Navigate and install dependencies</p>
                  <p className="text-white">cd salarycycle-mobile</p>
                  <p className="text-white">npx expo install expo-linear-gradient expo-haptics @expo/vector-icons react-native-safe-area-context</p>
                  <p># 3. Replace App.js with the code from the 'App.js' tab</p>
                  <p># 4. Start Expo local dev server</p>
                  <p className="text-white">npx expo start</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white mb-1">Direct Expo Snack Preview</h3>
                <p className="text-slate-400 text-xs">
                  You can also paste this code into <span className="text-purple-400 font-semibold">snack.expo.dev</span> to run it directly in your phone browser or the Expo Go mobile app without downloading Node.js!
                </p>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap leading-relaxed select-all">
              {currentCode}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
