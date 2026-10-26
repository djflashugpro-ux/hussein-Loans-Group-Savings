import React, { useState } from 'react';
import { useLoans } from '../context/LoanContext';
import {
  LoanApplication,
  formatUGX,
  calculateSimpleInterest,
  calculateTotalLoanPayment,
  calculatePaymentPerPeriod,
  checkMomoEligibility,
} from '../types/loan';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Trash2,
  Smartphone,
  Zap,
} from 'lucide-react';
import { MobileMoneyCashoutModal } from './MobileMoneyCashoutModal';

export const ApplicationStatusView: React.FC = () => {
  const { applications, selectedAppId, setSelectedAppId, deleteApplication } = useLoans();
  const [copied, setCopied] = useState(false);
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState(false);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  if (!selectedApp) {
    return (
      <div className="p-8 text-center text-neutral-400 space-y-2">
        <p className="font-bold text-white">No applications found</p>
        <p className="text-xs text-neutral-400">
          Apply for a loan using the &ldquo;Apply&rdquo; tab to get started.
        </p>
      </div>
    );
  }

  const simpleInterest = calculateSimpleInterest(
    selectedApp.desiredAmount,
    selectedApp.interestRate,
    selectedApp.termPeriods
  );
  const totalLoanPayment = calculateTotalLoanPayment(selectedApp.desiredAmount, simpleInterest);
  const paymentPerPeriod = calculatePaymentPerPeriod(totalLoanPayment, selectedApp.termPeriods);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Disbursed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-black bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 rounded-full shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            {status}
          </span>
        );
      case 'Needs Documents':
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-rose-600 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-white" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {status}
          </span>
        );
    }
  };

  const handleCopySummary = () => {
    const text = `*HUSSEIN LOANS GROUP - APPLICATION SLIP*\n` +
      `_Save • Borrow • Grow_\n\n` +
      `Ref ID: ${selectedApp.id}\n` +
      `Applicant: ${selectedApp.fullName}\n` +
      `NIN: ${selectedApp.nin}\n` +
      `Amount: ${formatUGX(selectedApp.desiredAmount)}\n` +
      `Term: ${selectedApp.termPeriods} ${selectedApp.ratePeriod}s @ ${selectedApp.interestRate}%\n` +
      `Total Payment: ${formatUGX(totalLoanPayment)}\n` +
      `Installment: ${formatUGX(paymentPerPeriod)} per ${selectedApp.ratePeriod.toLowerCase()}\n` +
      `Status: ${selectedApp.status}\n` +
      `Payout Account: ${selectedApp.payoutAccount} (${selectedApp.payoutChannel})`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status timeline steps
  const timelineStages = ['Submitted', 'Under Review', 'KYC Verified', 'Approved', 'Disbursed'];
  const currentStageIndex = timelineStages.indexOf(selectedApp.status);

  const docKeys = Object.keys(selectedApp.documents || {}) as (keyof typeof selectedApp.documents)[];

  return (
    <div className="p-4 space-y-4 bg-neutral-950 text-white">
      {/* Applications horizontal selector pill bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppId(app.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              app.id === selectedApp.id
                ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
            }`}
          >
            {app.id} · {app.fullName.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Main Status Card */}
      <div className="bg-neutral-900 rounded-3xl border border-amber-500/30 p-4 shadow-xl space-y-4">
        {/* Header with Logo */}
        <div className="flex items-start justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="Hussein Loans Group Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
            />
            <div>
              <div className="text-[10px] uppercase font-black text-amber-400 tracking-wider">
                {selectedApp.id}
              </div>
              <div className="text-base font-extrabold text-white">
                {selectedApp.fullName}
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {selectedApp.phoneNumber}
              </div>
            </div>
          </div>
          <div>{getStatusBadge(selectedApp.status)}</div>
        </div>

        {/* Timeline Stepper */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-400">
            Application Progress
          </div>
          <div className="grid grid-cols-5 gap-1 text-center">
            {timelineStages.map((stage, idx) => {
              const isPassed = currentStageIndex >= idx;
              const isCurrent = currentStageIndex === idx;
              return (
                <div key={stage} className="flex flex-col items-center">
                  <div
                    className={`w-full h-1.5 rounded-full mb-1 ${
                      isPassed ? 'bg-amber-400' : 'bg-neutral-800'
                    }`}
                  ></div>
                  <span
                    className={`text-[9px] leading-tight ${
                      isCurrent
                        ? 'font-black text-amber-400'
                        : isPassed
                        ? 'text-white'
                        : 'text-neutral-500'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Officer Remarks */}
        {selectedApp.officerRemarks && (
          <div className="p-3 bg-neutral-950 rounded-2xl border border-amber-400/40 text-xs">
            <span className="font-bold text-amber-300 block mb-0.5">
              Credit Officer Notes:
            </span>
            <p className="text-neutral-300 text-[11px]">{selectedApp.officerRemarks}</p>
          </div>
        )}

        {/* ========================================================
            Mobile Money Direct In-App Cashout Section
            ======================================================== */}
        {selectedApp.status === 'Disbursed' || selectedApp.momoDisbursement?.disbursedAt ? (
          <div className="p-3.5 bg-neutral-950 rounded-2xl border border-amber-400/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-black">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="font-black text-white text-xs block">
                    Disbursed to {selectedApp.momoDisbursement?.network || 'Mobile Money'}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    Ref: {selectedApp.momoDisbursement?.transactionId || 'MOMO-UGX-SUCCESS'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCashoutModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:brightness-105 transition-all"
              >
                View Payout Slip
              </button>
            </div>
          </div>
        ) : selectedApp.status === 'Approved' ? (
          <div className="p-4 bg-gradient-to-br from-amber-400/20 via-neutral-950 to-neutral-900 rounded-2xl border-2 border-amber-400 text-xs space-y-2.5 shadow-lg shadow-amber-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-black shadow-xs">
                  <Zap className="w-4 h-4 fill-black" />
                </div>
                <div>
                  <span className="font-black text-white text-xs block">
                    Receive Money via Mobile Money
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">
                    Approved · Ready for Instant Cashout
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black px-2 py-0.5 rounded-full">
                Unlocked
              </span>
            </div>

            <p className="text-[11px] text-neutral-300 leading-snug">
              You meet all requirements! Receive <strong className="text-amber-400">{formatUGX(selectedApp.desiredAmount)}</strong> directly to your MTN MoMo or Airtel Money wallet right now.
            </p>

            <button
              onClick={() => setIsCashoutModalOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-105 text-black font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-black" />
              <span>Receive {formatUGX(selectedApp.desiredAmount)} via MTN / Airtel Now</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-[11px]">
                  Receive via MTN / Airtel Mobile Money
                </span>
              </div>
              <button
                onClick={() => setIsCashoutModalOpen(true)}
                className="text-[10px] text-amber-400 hover:underline font-bold"
              >
                View Requirements
              </button>
            </div>
            <p className="text-[10px] text-neutral-400">
              Instant in-app mobile money disbursement unlocks once your loan is approved and KYC verified.
            </p>
          </div>
        )}

        {/* Loan Financial Parameters (White Card on Dark Background for High Contrast) */}
        <div className="grid grid-cols-2 gap-2 text-xs p-3.5 bg-white text-black rounded-2xl font-mono shadow-sm">
          <div>
            <span className="text-neutral-500 text-[10px] block font-sans font-bold">
              Requested Loan:
            </span>
            <span className="text-sm font-black text-black tabular-nums">
              {formatUGX(selectedApp.desiredAmount)}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 text-[10px] block font-sans font-bold">
              {selectedApp.interestRate}% Simple Interest:
            </span>
            <span className="text-sm font-black text-amber-600 tabular-nums">
              {formatUGX(simpleInterest)}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 text-[10px] block font-sans font-bold">
              Total Repayment:
            </span>
            <span className="text-sm font-black text-black tabular-nums">
              {formatUGX(totalLoanPayment)}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 text-[10px] block font-sans font-bold">
              Per {selectedApp.ratePeriod}:
            </span>
            <span className="text-sm font-black text-amber-600 tabular-nums">
              {formatUGX(paymentPerPeriod)}
            </span>
          </div>
        </div>

        {/* Loan Details List */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-neutral-800">
            <span className="text-neutral-400">Loan Purpose:</span>
            <span className="font-semibold text-white text-right max-w-[200px] truncate">
              {selectedApp.loanPurposeCategory}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-800">
            <span className="text-neutral-400">National ID (NIN):</span>
            <span className="font-mono font-bold text-amber-300">{selectedApp.nin}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-800">
            <span className="text-neutral-400">Employment / Trade:</span>
            <span className="font-semibold text-white">{selectedApp.businessOrEmployerName}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-800">
            <span className="text-neutral-400">Disbursement Channel:</span>
            <span className="font-bold text-amber-400">{selectedApp.payoutChannel}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-neutral-800">
            <span className="text-neutral-400">Payout Account:</span>
            <span className="font-mono font-bold text-white">{selectedApp.payoutAccount}</span>
          </div>
        </div>

        {/* Attached Documents Audit */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-400">
            Attached Documents ({docKeys.length})
          </div>
          <div className="space-y-1.5">
            {docKeys.map((key) => {
              const doc = selectedApp.documents[key];
              if (!doc) return null;
              return (
                <div
                  key={doc.id}
                  className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-bold text-white text-[11px]">{doc.category}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{doc.name} · {doc.size}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-black font-extrabold bg-amber-400 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleCopySummary}
            className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
            <span>{copied ? 'Copied Slip!' : 'Share Application Slip'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Delete application ${selectedApp.id}?`)) {
                deleteApplication(selectedApp.id);
              }
            }}
            className="p-3 text-neutral-400 hover:text-rose-400 rounded-xl hover:bg-neutral-800 transition-colors"
            title="Delete Application"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Money Cashout Terminal Modal */}
      <MobileMoneyCashoutModal
        isOpen={isCashoutModalOpen}
        onClose={() => setIsCashoutModalOpen(false)}
        application={selectedApp}
      />
    </div>
  );
};
