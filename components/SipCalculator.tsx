'use client';

import { useState } from 'react';

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedRate, setExpectedRate] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  const calculateSip = () => {
    const P = monthlyInvestment;
    const i = expectedRate / 12 / 100;
    const n = timePeriod * 12;

    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedAmount = P * n;
    const estimatedReturns = futureValue - investedAmount;

    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(futureValue),
    };
  };

  const result = calculateSip();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: INPUT CONTROLS */}
        <div className="lg:col-span-6 space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          
          {/* Monthly Investment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">Monthly Investment</label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {formatCurrency(monthlyInvestment)}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Expected Return Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">Expected Return Rate (p.a)</label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {expectedRate}%
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={expectedRate}
              onChange={(e) => setExpectedRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Time Period */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {timePeriod} Yr
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={timePeriod}
              onChange={(e) => setTimePeriod(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

        </div>

        {/* RIGHT PANEL: RESULT SUMMARY */}
        <div className="lg:col-span-6 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col justify-between min-h-[320px]">
          <h3 className="text-lg font-bold text-gray-800">Investment Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Invested Amount</span>
              <span className="text-sm font-bold text-gray-800">{formatCurrency(result.investedAmount)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Est. Returns</span>
              <span className="text-sm font-bold text-emerald-600">+{formatCurrency(result.estimatedReturns)}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <span className="text-base font-bold text-indigo-900">Total Value</span>
              <span className="text-lg font-extrabold text-indigo-600">{formatCurrency(result.totalValue)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setMonthlyInvestment(5000);
              setExpectedRate(12);
              setTimePeriod(10);
            }}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 text-sm rounded-lg transition border border-red-200 mt-2"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}