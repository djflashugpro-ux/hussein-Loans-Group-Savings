import React from 'react';
import { useLoans } from '../context/LoanContext';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  const { phoneFrameMode, setPhoneFrameMode } = useLoans();

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col items-center justify-start py-0 sm:py-6 sm:px-4">
      {/* Viewport Mode Switcher (Visible on desktop) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-4xl mb-4 px-2 no-print">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.jpeg"
            alt="Hussein Loans Crest"
            className="w-6 h-6 rounded-full border border-amber-400"
          />
          <span className="text-xs font-bold text-white tracking-wide">
            HUSSEIN LOANS GROUP
          </span>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
            · SAVE • BORROW • GROW
          </span>
        </div>

        {/* Toggle Phone Chassis vs Full Width */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 shadow-inner">
          <button
            onClick={() => setPhoneFrameMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              phoneFrameMode
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Phone Chassis (390px)
          </button>
          <button
            onClick={() => setPhoneFrameMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              !phoneFrameMode
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Full Screen
          </button>
        </div>
      </div>

      {/* Phone Frame or Responsive Container */}
      <div
        className={`w-full transition-all duration-300 ${
          phoneFrameMode
            ? 'max-w-[414px] bg-neutral-950 sm:rounded-[48px] sm:border-[10px] sm:border-neutral-800 sm:shadow-[0_25px_70px_-15px_rgba(245,158,11,0.18)] overflow-hidden relative ring-1 ring-amber-400/20'
            : 'max-w-2xl bg-white text-slate-900 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-neutral-800'
        }`}
      >
        {/* Phone Bezel Dynamic Island / Status Bar (Only in Phone Chassis mode) */}
        {phoneFrameMode && (
          <div className="bg-neutral-950 text-neutral-100 px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none sticky top-0 z-50 border-b border-neutral-900">
            {/* Clock */}
            <span className="font-semibold tracking-tight text-[13px] font-mono text-neutral-200">
              9:41
            </span>

            {/* Dynamic Island Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black px-3 py-1 rounded-full border border-neutral-800">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-[10px] font-bold text-amber-300">
                HLG Secure
              </span>
            </div>

            {/* System Icons */}
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Signal className="w-3.5 h-3.5 text-amber-400" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        )}

        {/* Inner Phone Screen Content */}
        <div
          className={`min-h-[640px] sm:min-h-[780px] flex flex-col bg-neutral-950 text-white pb-20 ${
            phoneFrameMode ? 'rounded-b-[38px]' : ''
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
