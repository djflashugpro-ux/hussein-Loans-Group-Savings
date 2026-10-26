import React, { useState, useEffect } from 'react';
import { useLoans } from '../context/LoanContext';
import {
  LoanApplication,
  formatUGX,
  checkMomoEligibility,
} from '../types/loan';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Check,
  ArrowRight,
  Copy,
  Lock,
  Sparkles,
} from 'lucide-react';

interface MobileMoneyCashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: LoanApplication;
}

export const MobileMoneyCashoutModal: React.FC<MobileMoneyCashoutModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const { disburseViaMobileMoney } = useLoans();

  const [network, setNetwork] = useState<'MTN Mobile Money' | 'Airtel Money'>(
    application.phoneNumber.startsWith('+256 70') || application.phoneNumber.startsWith('+256 75') || application.phoneNumber.startsWith('+256 74')
      ? 'Airtel Money'
      : 'MTN Mobile Money'
  );
  const [phoneNumber, setPhoneNumber] = useState(application.phoneNumber);
  const [pin, setPin] = useState('');
  const [isVerifyingKyc, setIsVerifyingKyc] = useState(false);
  const [kycVerified, setKycVerified] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [disbursementResult, setDisbursementResult] = useState<{
    txnId: string;
    reference: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync phone number
  useEffect(() => {
    if (application) {
      setPhoneNumber(application.phoneNumber);
      setNetwork(
        application.phoneNumber.startsWith('+256 70') ||
        application.phoneNumber.startsWith('+256 75') ||
        application.phoneNumber.startsWith('+256 74')
          ? 'Airtel Money'
          : 'MTN Mobile Money'
      );
      setDisbursementResult(null);
      setPin('');
    }
  }, [application]);

  if (!isOpen) return null;

  const { isEligible, isAlreadyDisbursed, requirements } = checkMomoEligibility(application);

  const handleSimLookup = () => {
    setIsVerifyingKyc(true);
    setTimeout(() => {
      setIsVerifyingKyc(false);
      setKycVerified(true);
    }, 800);
  };

  const handleAuthorizeTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible || isAlreadyDisbursed) return;

    setIsProcessing(true);
    setTimeout(() => {
      const result = disburseViaMobileMoney(
        application.id,
        network,
        phoneNumber,
        application.fullName
      );
      setIsProcessing(false);
      setDisbursementResult(result);
    }, 1200);
  };

  const handleCopyReceipt = () => {
    if (!disbursementResult) return;
    const text = `*HUSSEIN LOANS GROUP - MOMO DISBURSEMENT RECEIPT*\n` +
      `_Save • Borrow • Grow_\n\n` +
      `Txn ID: ${disbursementResult.txnId}\n` +
      `Reference: ${disbursementResult.reference}\n` +
      `Recipient: ${application.fullName}\n` +
      `Network: ${network}\n` +
      `Phone Number: ${phoneNumber}\n` +
      `Amount Credited: ${formatUGX(application.desiredAmount)}\n` +
      `Disbursement Fee: UGX 0 (Subsidized)\n` +
      `Status: SUCCESSFUL / INSTANT DISBURSEMENT\n` +
      `National ID: ${application.nin}\n` +
      `Date: ${new Date().toLocaleString('en-GB')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-neutral-950 border border-amber-500/40 rounded-3xl max-w-md w-full p-5 shadow-2xl text-white space-y-4 my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <img
            src="/logo.jpeg"
            alt="Hussein Loans Crest"
            className="w-10 h-10 rounded-full border border-amber-400 shrink-0"
          />
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Direct In-App Payout
            </div>
            <h2 className="text-base font-extrabold text-white">
              Receive Money via Mobile Money
            </h2>
          </div>
        </div>

        {/* ========================================================
            CASE A: Disbursement Completed (Success Receipt)
            ======================================================== */}
        {disbursementResult ? (
          <div className="space-y-4 animate-in fade-in duration-300 text-center pt-2">
            <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 text-black">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">
                Funds Sent Successfully!
              </h3>
              <p className="text-xs text-amber-300 font-bold">
                {formatUGX(application.desiredAmount)} transferred to your wallet
              </p>
            </div>

            {/* Receipt Slip */}
            <div className="p-4 bg-white text-black rounded-2xl text-left space-y-2 text-xs font-mono shadow-md">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-sans font-bold">Transaction ID:</span>
                <span className="font-black text-black">{disbursementResult.txnId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-sans">Provider:</span>
                <span className="font-bold text-black">{network}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-sans">Recipient Name:</span>
                <span className="font-bold text-black">{application.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-sans">Mobile Number:</span>
                <span className="font-bold text-black">{phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-sans">Amount Credited:</span>
                <span className="font-black text-amber-600 text-sm">{formatUGX(application.desiredAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-neutral-200 text-[11px]">
                <span className="text-neutral-500 font-sans">Payout Fee:</span>
                <span className="text-emerald-700 font-bold">UGX 0 (Free)</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400">
              Your {network} balance has been updated. Repayment is scheduled according to your agreed {application.termPeriods} {application.ratePeriod}s terms.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleCopyReceipt}
                className="flex-1 py-3 bg-neutral-900 border border-neutral-800 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'Copied Receipt!' : 'Share SMS Receipt'}</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-xl text-xs font-black shadow-sm hover:brightness-105 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : isAlreadyDisbursed ? (
          /* ========================================================
             CASE B: Already Disbursed
             ======================================================== */
          <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-sm font-black text-white">
              Funds Already Disbursed
            </h3>
            <p className="text-xs text-neutral-300">
              The loan of <strong className="text-amber-400">{formatUGX(application.desiredAmount)}</strong> was previously credited to {application.momoDisbursement?.network || 'Mobile Money'} ({application.momoDisbursement?.phoneNumber || application.phoneNumber}).
            </p>
            {application.momoDisbursement?.transactionId && (
              <div className="p-2.5 bg-neutral-950 rounded-xl text-[11px] font-mono text-neutral-400 border border-neutral-800">
                Txn Ref: {application.momoDisbursement.transactionId}
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-400 text-black font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        ) : (
          /* ========================================================
             CASE C: Cashout Form & Requirements Checklist
             ======================================================== */
          <form onSubmit={handleAuthorizeTransfer} className="space-y-4 text-xs">
            {/* Amount Banner */}
            <div className="p-3 bg-gradient-to-r from-amber-400/10 via-amber-400/5 to-transparent rounded-2xl border border-amber-400/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Approved Payout Amount
                </span>
                <span className="text-lg font-mono font-black text-amber-400">
                  {formatUGX(application.desiredAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold block">
                  Fee: UGX 0
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Instant Transfer
                </span>
              </div>
            </div>

            {/* Requirements Checklist Card */}
            <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Mandatory Requirements Check
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isEligible
                      ? 'bg-amber-400 text-black'
                      : 'bg-neutral-800 text-amber-300'
                  }`}
                >
                  {isEligible ? 'All Requirements Met' : 'Pending Requirements'}
                </span>
              </div>

              <div className="space-y-1.5">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start gap-2 text-[11px]"
                  >
                    {req.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <span
                        className={req.passed ? 'text-white font-semibold' : 'text-neutral-400'}
                      >
                        {req.label}
                      </span>
                      <p className="text-[10px] text-neutral-500">{req.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* If NOT eligible, show lock explanation */}
            {!isEligible ? (
              <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/30 text-[11px] text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Direct Mobile Money Locked
                </p>
                <p className="text-neutral-300">
                  You can receive money via MTN or Airtel Mobile Money once your application is approved by the credit officer.
                </p>
                {application.status !== 'Approved' && (
                  <p className="text-amber-400 font-semibold pt-1">
                    Current status: {application.status}. Our team processes applications in 2-4 hours.
                  </p>
                )}
              </div>
            ) : (
              /* Network & Cashout Configuration */
              <div className="space-y-3 pt-1">
                {/* Choose Telecom Network */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                    Select Mobile Money Network *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* MTN */}
                    <button
                      type="button"
                      onClick={() => setNetwork('MTN Mobile Money')}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        network === 'MTN Mobile Money'
                          ? 'bg-yellow-400/15 border-yellow-400 text-yellow-300 shadow-sm'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-white">MTN MoMo</span>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      </div>
                      <p className="text-[10px] text-neutral-400">077 / 078 / 076</p>
                    </button>

                    {/* Airtel */}
                    <button
                      type="button"
                      onClick={() => setNetwork('Airtel Money')}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        network === 'Airtel Money'
                          ? 'bg-red-500/15 border-red-500 text-red-300 shadow-sm'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-white">Airtel Money</span>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      </div>
                      <p className="text-[10px] text-neutral-400">070 / 075 / 074</p>
                    </button>
                  </div>
                </div>

                {/* Mobile Number & KYC verification */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Mobile Money Number (Must match borrower legal name) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setKycVerified(false);
                      }}
                      className="flex-1 px-3 py-2.5 bg-white text-black font-mono font-bold text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleSimLookup}
                      disabled={isVerifyingKyc}
                      className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 text-[11px] font-bold rounded-xl border border-neutral-800 transition-colors"
                    >
                      {isVerifyingKyc ? 'Checking...' : 'Verify SIM'}
                    </button>
                  </div>
                </div>

                {/* SIM KYC Verification Status Box */}
                {kycVerified && (
                  <div className="p-2.5 bg-neutral-900 rounded-xl border border-amber-500/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <div>
                        <span className="text-neutral-400">Telecom Registered Name:</span>
                        <div className="font-bold text-white">{application.fullName}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full">
                      Name Match 100%
                    </span>
                  </div>
                )}

                {/* Security PIN / Authorization */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Authorization PIN (4 Digits) *
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white text-black font-mono font-black text-center text-lg tracking-widest rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <p className="text-[10px] text-neutral-400 text-center mt-1">
                    Enter any 4-digit code to authorize immediate bank-to-mobile transfer.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isEligible || !pin || pin.length < 4 || isProcessing}
                className="flex-1 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 disabled:opacity-40 text-black font-black text-xs rounded-xl shadow-md shadow-amber-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <span>Crediting {network}...</span>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 text-black" />
                    <span>Authorize &amp; Receive {formatUGX(application.desiredAmount)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
