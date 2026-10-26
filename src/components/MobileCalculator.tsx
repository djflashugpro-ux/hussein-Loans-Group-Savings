import React, { useState } from 'react';
import { useLoans } from '../context/LoanContext';
import {
  RatePeriod,
  calculateSimpleInterest,
  calculateTotalLoanPayment,
  calculatePaymentPerPeriod,
  formatUGX,
  formatUGXCompact,
  addPeriodsToDate,
} from '../types/loan';
import { Calculator, ArrowRight, Sparkles, Check, HelpCircle } from 'lucide-react';

export const MobileCalculator: React.FC = () => {
  const { setActiveTab } = useLoans();

  const [principal, setPrincipal] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(10); // 10% weekly default
  const [customRateInput, setCustomRateInput] = useState<string>('');
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>('Week'); // Weekly default, Monthly optional
  const [termPeriods, setTermPeriods] = useState<number>(4); // default 4 weeks

  const simpleInterest = calculateSimpleInterest(principal, interestRate, termPeriods);
  const totalLoanPayment = calculateTotalLoanPayment(principal, simpleInterest);
  const paymentPerPeriod = calculatePaymentPerPeriod(totalLoanPayment, termPeriods);
  const dueDate = addPeriodsToDate(new Date().toISOString().split('T')[0], termPeriods, ratePeriod);

  const presetAmounts = [100000, 300000, 500000, 1000000, 2000000, 5000000];

  const handleCustomRateChange = (val: string) => {
    setCustomRateInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setInterestRate(num);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-neutral-950 text-white">
      {/* Header Card */}
      <div className="bg-neutral-900 rounded-3xl border border-amber-500/30 p-4 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="Hussein Loans Logo"
            className="w-10 h-10 rounded-full border border-amber-400 object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-white">
                Simple Interest Loan Simulator
              </h2>
              <span className="text-[10px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded-md uppercase">
                10% Weekly Default
              </span>
            </div>
            <p className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              Hussein Loans Group · Uganda Shillings (UGX)
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-4 shadow-lg space-y-4">
        {/* Desired Amount */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-neutral-300">
              Loan Amount (UGX)
            </label>
            <span className="text-base font-mono font-black text-amber-400">
              {formatUGX(principal)}
            </span>
          </div>

          <input
            type="range"
            min="100000"
            max="5000000"
            step="50000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-amber-400"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setPrincipal(amt)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                  principal === amt
                    ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
                }`}
              >
                {formatUGXCompact(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* Repayment Frequency: Weekly default, Monthly optional */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-neutral-300">
              Repayment Frequency
            </label>
            <span className="text-[10px] font-medium text-neutral-400">
              Weekly is standard · Monthly is optional
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRatePeriod('Week');
                if (termPeriods > 16) setTermPeriods(4);
              }}
              className={`py-2 text-xs font-black rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                ratePeriod === 'Week'
                  ? 'bg-amber-400 text-black border-amber-400 shadow-xs'
                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-400/30'
              }`}
            >
              <span>Weekly</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${ratePeriod === 'Week' ? 'bg-black text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                Default
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRatePeriod('Month');
                if (termPeriods > 12) setTermPeriods(3);
              }}
              className={`py-2 text-xs font-black rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                ratePeriod === 'Month'
                  ? 'bg-amber-400 text-black border-amber-400 shadow-xs'
                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-400/30'
              }`}
            >
              <span>Monthly</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${ratePeriod === 'Month' ? 'bg-black text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                Optional
              </span>
            </button>
          </div>
        </div>

        {/* Freely Choose Interest Rate: 10%, 16%, 20%, or Custom */}
        <div className="space-y-2 p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-xs font-bold text-neutral-200 block">
                Choose Interest Rate (%)
              </label>
              <p className="text-[10px] text-neutral-400">
                10% standard weekly, or freely choose 16%, 20%, or custom
              </p>
            </div>
            <span className="text-xs font-mono font-black text-amber-400">
              {interestRate}% / {ratePeriod.toLowerCase()}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {/* 10% Standard Default */}
            <button
              type="button"
              onClick={() => {
                setInterestRate(10);
                setCustomRateInput('');
              }}
              className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                interestRate === 10 && !customRateInput
                  ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
              }`}
            >
              <div className="font-mono font-black text-xs">10%</div>
              <div className="text-[9px] uppercase font-bold text-neutral-400">Default</div>
            </button>

            {/* 16% */}
            <button
              type="button"
              onClick={() => {
                setInterestRate(16);
                setCustomRateInput('');
              }}
              className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                interestRate === 16 && !customRateInput
                  ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
              }`}
            >
              <div className="font-mono font-black text-xs">16%</div>
              <div className="text-[9px] uppercase font-bold text-neutral-400">Tier 2</div>
            </button>

            {/* 20% */}
            <button
              type="button"
              onClick={() => {
                setInterestRate(20);
                setCustomRateInput('');
              }}
              className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                interestRate === 20 && !customRateInput
                  ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
              }`}
            >
              <div className="font-mono font-black text-xs">20%</div>
              <div className="text-[9px] uppercase font-bold text-neutral-400">Tier 3</div>
            </button>

            {/* Custom Rate Pill */}
            <button
              type="button"
              onClick={() => {
                if (!customRateInput) {
                  setCustomRateInput('12');
                  setInterestRate(12);
                }
              }}
              className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                Boolean(customRateInput)
                  ? 'bg-amber-400 text-black border-amber-400 font-black shadow-xs'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-400/40'
              }`}
            >
              <div className="font-mono font-black text-xs">
                {customRateInput ? `${customRateInput}%` : 'Other'}
              </div>
              <div className="text-[9px] uppercase font-bold text-neutral-400">Custom</div>
            </button>
          </div>

          {/* Custom Percentage Input if selected */}
          {customRateInput !== '' && (
            <div className="pt-1.5 flex items-center gap-2">
              <span className="text-[11px] text-neutral-300 whitespace-nowrap">
                Enter Custom Rate:
              </span>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="0.5"
                  value={customRateInput}
                  onChange={(e) => handleCustomRateChange(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white text-black border border-amber-400 rounded-lg pr-7"
                />
                <span className="absolute right-2.5 top-1.5 text-xs font-bold text-neutral-500">
                  %
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Term Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-neutral-300">
              Loan Term ({ratePeriod.toLowerCase()}s)
            </label>
            <span className="text-xs font-mono font-black text-amber-400">
              {termPeriods} {ratePeriod.toLowerCase()}{termPeriods > 1 ? 's' : ''}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max={ratePeriod === 'Week' ? 16 : 12}
            value={termPeriods}
            onChange={(e) => setTermPeriods(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
            <span>1 {ratePeriod.toLowerCase()}</span>
            <span>{ratePeriod === 'Week' ? '4 weeks (1 mo)' : '3 months'}</span>
            <span>{ratePeriod === 'Week' ? '16 weeks' : '12 months'}</span>
          </div>
        </div>

        {/* Calculation Result Card (White on Black) */}
        <div className="p-4 bg-white text-black rounded-2xl shadow-md space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-neutral-500 text-[11px] font-bold pb-1.5 border-b border-neutral-200">
            <span className="text-black font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {interestRate}% Simple Interest ({ratePeriod}ly)
            </span>
            <span className="font-mono text-neutral-700 font-semibold">Maturity: {dueDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-600 font-semibold">Principal Borrowed:</span>
            <span className="font-mono font-bold text-black tabular-nums">
              {formatUGX(principal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-600 font-semibold">
              Interest ({interestRate}% × {termPeriods} {ratePeriod.toLowerCase()}s):
            </span>
            <span className="font-mono font-bold text-amber-600 tabular-nums">
              {formatUGX(simpleInterest)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-600 font-semibold">Total Repayment:</span>
            <span className="font-mono font-black text-black text-sm tabular-nums">
              {formatUGX(totalLoanPayment)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
            <span className="text-black font-extrabold">
              Installment per {ratePeriod}:
            </span>
            <span className="font-mono font-black text-amber-600 text-base tabular-nums">
              {formatUGX(paymentPerPeriod)}
            </span>
          </div>

          {/* Formula verification note */}
          <div className="p-2 bg-amber-50 rounded-xl text-[10px] text-amber-900 border border-amber-200/60 leading-tight">
            <strong>Formula:</strong> {formatUGX(principal)} × ({interestRate} ÷ 100) × {termPeriods} = <strong className="font-mono">{formatUGX(simpleInterest)}</strong> interest.
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setActiveTab('apply')}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-105 text-black font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Apply with {interestRate}% {ratePeriod}ly Terms</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
