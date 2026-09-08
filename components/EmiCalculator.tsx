'use client';

import { useState } from 'react';

export default function EmiCalculator() {
  // Initial States
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // EMI Calculation Logic
  // Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100; // monthly interest rate
    const n = tenureYears * 12; // total months

    if (p <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  const { emi, totalInterest, totalPayment } = calculateEMI();

  // Helper for Indian Currency Formatting
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Percentages for Progress Bar
  const principalPercent = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 0;
  const interestPercent = totalPayment > 0 ? 100 - principalPercent : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-800">EMI Calculator</h2>
          <p className="text-xs text-gray-500 mt-1">
            Calculate your monthly home, car, or personal loan EMIs instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* INPUT CONTROLS SECTION */}
          <div className="md:col-span-7 space-y-6">
            {/* Loan Amount Input & Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-700">Loan Amount</label>
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1">
                  <span className="text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-28 text-right bg-transparent text-xs font-bold text-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>₹10K</span>
                <span>₹1 Cr</span>
              </div>
            </div>

            {/* Interest Rate Input & Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-700">Interest Rate (p.a)</label>
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1">
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-16 text-right bg-transparent text-xs font-bold text-indigo-600 focus:outline-none"
                  />
                  <span className="text-gray-500 font-medium">%</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Tenure Input & Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-700">Loan Tenure</label>
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1">
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-12 text-right bg-transparent text-xs font-bold text-indigo-600 focus:outline-none"
                  />
                  <span className="text-gray-500 font-medium">Years</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* SUMMARY DISPLAY SECTION */}
          <div className="md:col-span-5 bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-5">
            <div className="text-center pb-4 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Loan EMI
              </span>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">
                {formatCurrency(emi)}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                  Principal Amount
                </span>
                <span className="font-bold text-gray-800">{formatCurrency(loanAmount)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block"></span>
                  Total Interest
                </span>
                <span className="font-bold text-gray-800">{formatCurrency(totalInterest)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-700">Total Amount Payable</span>
                <span className="font-extrabold text-gray-900">{formatCurrency(totalPayment)}</span>
              </div>
            </div>

            {/* BREAKDOWN VISUAL BAR */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                <span>Principal ({principalPercent}%)</span>
                <span>Interest ({interestPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${principalPercent}%` }}
                  className="bg-indigo-600 h-full transition-all duration-300"
                ></div>
                <div
                  style={{ width: `${interestPercent}%` }}
                  className="bg-orange-400 h-full transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}