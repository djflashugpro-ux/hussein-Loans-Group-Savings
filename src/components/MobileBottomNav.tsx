import React from 'react';
import { useLoans } from '../context/LoanContext';
import { FileEdit, ClipboardList, Calculator, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, applications } = useLoans();

  const pendingCount = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Under Review' || a.status === 'Needs Documents'
  ).length;

  return (
    <nav className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-amber-500/20 shadow-2xl px-2 py-1 max-w-[414px] mx-auto">
      <div className="grid grid-cols-4 items-center">
        {/* 1. Apply Form */}
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors ${
            activeTab === 'apply'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'apply' ? 'bg-amber-400/15 text-amber-400 shadow-sm' : ''
            }`}
          >
            <FileEdit className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Apply</span>
        </button>

        {/* 2. My Applications / Status */}
        <button
          onClick={() => setActiveTab('status')}
          className={`flex flex-col items-center justify-center py-1.5 relative transition-colors ${
            activeTab === 'status'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl relative transition-all ${
              activeTab === 'status' ? 'bg-amber-400/15 text-amber-400 shadow-sm' : ''
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-black font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-xs">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">My Loans</span>
        </button>

        {/* 3. Calculator */}
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors ${
            activeTab === 'calculator'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'calculator' ? 'bg-amber-400/15 text-amber-400 shadow-sm' : ''
            }`}
          >
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Calculator</span>
        </button>

        {/* 4. Officer Portal */}
        <button
          onClick={() => setActiveTab('officer')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors ${
            activeTab === 'officer'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'officer' ? 'bg-amber-400/15 text-amber-400 shadow-sm' : ''
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Officer</span>
        </button>
      </div>
    </nav>
  );
};
