import React, { useState } from 'react';
import { useLoans } from '../context/LoanContext';
import {
  ApplicationStatus,
  formatUGX,
  calculateSimpleInterest,
  calculateTotalLoanPayment,
  calculatePaymentPerPeriod,
} from '../types/loan';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Banknote,
} from 'lucide-react';

export const OfficerPortal: React.FC = () => {
  const { applications, updateApplicationStatus } = useLoans();

  const [filter, setFilter] = useState<'All' | 'Under Review' | 'Approved' | 'Disbursed' | 'Needs Documents'>('All');
  const [activeAppId, setActiveAppId] = useState<string>(applications[0]?.id || '');
  const [remarksInput, setRemarksInput] = useState('');

  const filtered = applications.filter((app) => (filter === 'All' ? true : app.status === filter));
  const activeApp = applications.find((a) => a.id === activeAppId) || filtered[0];

  const handleStatusChange = (status: ApplicationStatus) => {
    if (!activeApp) return;
    updateApplicationStatus(
      activeApp.id,
      status,
      remarksInput.trim() || activeApp.officerRemarks
    );
    setRemarksInput('');
  };

  if (!activeApp) {
    return (
      <div className="p-8 text-center text-neutral-400 text-xs bg-neutral-950">
        No loan applications available under this filter.
      </div>
    );
  }

  // Debt to income ratio
  const debtToIncome =
    activeApp.monthlyIncome > 0
      ? Math.round((activeApp.monthlyExpenses / activeApp.monthlyIncome) * 100)
      : 0;

  const simpleInterest = calculateSimpleInterest(
    activeApp.desiredAmount,
    activeApp.interestRate,
    activeApp.termPeriods
  );
  const totalLoanPayment = calculateTotalLoanPayment(activeApp.desiredAmount, simpleInterest);
  const paymentPerPeriod = calculatePaymentPerPeriod(totalLoanPayment, activeApp.termPeriods);

  return (
    <div className="p-4 space-y-4 bg-neutral-950 text-white">
      {/* Officer Header with Logo */}
      <div className="bg-neutral-900 text-white p-3.5 rounded-3xl border border-amber-500/30 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="Hussein Loans Crest"
            className="w-10 h-10 rounded-full border border-amber-400"
          />
          <div>
            <h2 className="text-xs font-black tracking-tight uppercase text-white">
              Credit Officer Verification Portal
            </h2>
            <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              Hussein Loans Group · Save • Borrow • Grow
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {(['All', 'Under Review', 'Approved', 'Disbursed', 'Needs Documents'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-bold border transition-all ${
              filter === st
                ? 'bg-amber-400 text-black border-amber-400 shadow-xs'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {filtered.map((app) => (
          <button
            key={app.id}
            onClick={() => setActiveAppId(app.id)}
            className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
              app.id === activeApp.id
                ? 'bg-neutral-900 border-amber-400 shadow-sm'
                : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900'
            }`}
          >
            <div>
              <div className="font-extrabold text-white">{app.fullName}</div>
              <div className="text-[10px] text-neutral-400 font-mono">
                {app.id} · {formatUGX(app.desiredAmount)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-amber-400 border border-amber-400/30">
                {app.status}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Application Review Details */}
      <div className="bg-neutral-900 rounded-3xl border border-amber-500/30 p-4 shadow-xl space-y-4 text-xs">
        <div className="flex justify-between items-start border-b border-neutral-800 pb-2">
          <div>
            <span className="font-black text-sm text-white">{activeApp.fullName}</span>
            <div className="text-[11px] text-amber-300 font-mono font-bold">NIN: {activeApp.nin}</div>
            <div className="text-[11px] text-neutral-400 font-mono">{activeApp.phoneNumber}</div>
          </div>
          <span className="font-mono font-black text-amber-400 text-base">
            {formatUGX(activeApp.desiredAmount)}
          </span>
        </div>

        {/* Financial & Underwriting Grid (White on Dark) */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-white text-black rounded-2xl text-[11px] font-mono shadow-sm">
          <div>
            <span className="text-neutral-500 block font-sans font-bold">Monthly Income:</span>
            <span className="font-black text-black">
              {formatUGX(activeApp.monthlyIncome)}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 block font-sans font-bold">Expense Ratio (DTI):</span>
            <span className={`font-black ${debtToIncome > 70 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {debtToIncome}%
            </span>
          </div>

          <div>
            <span className="text-neutral-500 block font-sans font-bold">Proposed Term:</span>
            <span className="font-bold text-black font-sans">
              {activeApp.termPeriods} {activeApp.ratePeriod}s @ {activeApp.interestRate}%
            </span>
          </div>

          <div>
            <span className="text-neutral-500 block font-sans font-bold">Periodic Installment:</span>
            <span className="font-black text-amber-600">
              {formatUGX(paymentPerPeriod)}
            </span>
          </div>
        </div>

        {/* Trade & Purpose */}
        <div className="space-y-1 text-neutral-300 text-[11px]">
          <p>
            <strong className="text-white">Trade:</strong> {activeApp.jobTitleOrTrade || activeApp.employmentType} ({activeApp.businessOrEmployerName})
          </p>
          <p>
            <strong className="text-white">Purpose:</strong> {activeApp.loanPurposeCategory} &mdash; {activeApp.loanPurposeDetails || 'General working capital'}
          </p>
          <p>
            <strong className="text-white">Next of Kin:</strong> {activeApp.nextOfKinName} ({activeApp.nextOfKinRelationship}) - {activeApp.nextOfKinPhone}
          </p>
        </div>

        {/* Attached Verification Documents */}
        <div className="space-y-1.5 pt-1">
          <span className="font-black text-amber-400 text-[11px] uppercase tracking-wider block">
            Verification Documents
          </span>
          <div className="space-y-1.5">
            {Object.entries(activeApp.documents || {}).map(([key, doc]) => {
              if (!doc) return null;
              return (
                <div
                  key={doc.id}
                  className="p-2 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-white">{doc.category}</span>
                  </div>
                  <span className="text-amber-300 font-mono text-[10px]">
                    {doc.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Officer Remarks Input */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-bold text-neutral-300 block">
            Add Officer Remarks:
          </label>
          <input
            type="text"
            placeholder="e.g. Approved for mobile money payout. Verification confirmed."
            value={remarksInput}
            onChange={(e) => setRemarksInput(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white text-black font-semibold border border-neutral-300 rounded-xl"
          />
        </div>

        {/* Action Decision Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800">
          <button
            onClick={() => handleStatusChange('Approved')}
            className="py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-black rounded-xl font-black text-xs shadow-sm transition-all flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>

          <button
            onClick={() => handleStatusChange('Disbursed')}
            className="py-2.5 bg-white hover:bg-neutral-200 text-black rounded-xl font-black text-xs shadow-sm transition-all flex items-center justify-center gap-1"
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Disburse</span>
          </button>

          <button
            onClick={() => handleStatusChange('Needs Documents')}
            className="py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Request Doc</span>
          </button>
        </div>
      </div>
    </div>
  );
};
