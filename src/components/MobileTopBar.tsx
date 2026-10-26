import React from 'react';
import { useLoans } from '../context/LoanContext';
import { PhoneCall, RotateCcw } from 'lucide-react';

export const MobileTopBar: React.FC = () => {
  const { resetApplications } = useLoans();

  return (
    <header className="bg-neutral-950 text-white px-4 py-3 sticky top-0 z-40 shadow-md border-b border-amber-500/30">
      <div className="flex items-center justify-between">
        {/* Brand Lockup with User's Official Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/logo.jpeg"
              alt="Hussein Loans Group Official Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-sm"
              onError={(e) => {
                // Fallback to the full asset path if needed
                (e.target as HTMLImageElement).src =
                  '/assets/aistudio/WhatsApp_Image_2026-10-23_at_12.58.40_PM-6adb30b8d56fb7.54945573_0f55d836.jpeg';
              }}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-black"></div>
          </div>

          <div>
            <div className="font-extrabold text-sm tracking-tight text-white leading-tight flex items-center gap-1.5">
              <span>HUSSEIN</span>
              <span className="text-amber-400">LOANS GROUP</span>
            </div>
            <div className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">
              SAVE • BORROW • GROW
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetApplications}
            title="Reset Sample Applications"
            className="p-1.5 text-neutral-400 hover:text-amber-300 rounded-full hover:bg-neutral-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href="tel:+256700000000"
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[11px] font-bold px-3 py-1 rounded-full shadow-xs hover:brightness-105 transition-all"
          >
            <PhoneCall className="w-3 h-3 text-black" />
            <span className="hidden xs:inline">Support</span>
          </a>
        </div>
      </div>
    </header>
  );
};
