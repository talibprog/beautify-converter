'use client';

import { useState, useMemo } from 'react';

// Define Country Tax Rules & Config Data
interface CountryTaxConfig {
  name: string;
  code: string;
  currency: string;
  symbol: string;
  hasRegimes?: boolean;
  regimes?: { label: string; value: string }[];
  hasFilingStatus?: boolean;
  filingStatuses?: { label: string; value: string }[];
  calculateTax: (
    income: number,
    options: { regime?: string; status?: string; deductions?: number }
  ) => {
    taxableIncome: number;
    totalTax: number;
    effectiveRate: number;
    brackets: { rate: number; amount: number; tax: number }[];
    deductionApplied: number;
  };
}

const TAX_RULES: Record<string, CountryTaxConfig> = {
  IN: {
    name: 'India',
    code: 'IN',
    currency: 'INR',
    symbol: '₹',
    hasRegimes: true,
    regimes: [
      { label: 'New Tax Regime (FY 2024-25 / FY 2025-26)', value: 'new' },
      { label: 'Old Tax Regime', value: 'old' },
    ],
    calculateTax: (income, options) => {
      const regime = options.regime || 'new';
      let stdDeduction = regime === 'new' ? 75000 : 50000;
      let otherDeductions = regime === 'old' ? (options.deductions || 0) : 0;
      let totalDeductions = stdDeduction + otherDeductions;
      
      let taxableIncome = Math.max(0, income - totalDeductions);
      let totalTax = 0;
      let brackets: { rate: number; amount: number; tax: number }[] = [];

      if (regime === 'new') {
        // India New Regime Slabs
        const slabs = [
          { limit: 300000, rate: 0 },
          { limit: 700000, rate: 0.05 },
          { limit: 1000000, rate: 0.10 },
          { limit: 1200000, rate: 0.15 },
          { limit: 1500000, rate: 0.20 },
          { limit: Infinity, rate: 0.30 },
        ];

        let prevLimit = 0;
        let tempIncome = taxableIncome;

        // Rebate u/s 87A if taxable income <= 7,000,00 (Rebate upto 25,000)
        if (taxableIncome <= 700000) {
          totalTax = 0;
        } else {
          for (let i = 0; i < slabs.length; i++) {
            const currentLimit = slabs[i].limit;
            const rate = slabs[i].rate;
            if (tempIncome > prevLimit) {
              const taxableInBracket = Math.min(tempIncome, currentLimit) - prevLimit;
              const taxInBracket = taxableInBracket * rate;
              totalTax += taxInBracket;
              if (taxableInBracket > 0) {
                brackets.push({ rate: rate * 100, amount: taxableInBracket, tax: taxInBracket });
              }
              prevLimit = currentLimit;
            } else {
              break;
            }
          }
          // Health & Education Cess @ 4%
          totalTax += totalTax * 0.04;
        }
      } else {
        // Old Regime Slabs
        const slabs = [
          { limit: 250000, rate: 0 },
          { limit: 500000, rate: 0.05 },
          { limit: 1000000, rate: 0.20 },
          { limit: Infinity, rate: 0.30 },
        ];

        if (taxableIncome <= 500000) {
          totalTax = 0;
        } else {
          let prevLimit = 0;
          for (let i = 0; i < slabs.length; i++) {
            const currentLimit = slabs[i].limit;
            const rate = slabs[i].rate;
            if (taxableIncome > prevLimit) {
              const taxableInBracket = Math.min(taxableIncome, currentLimit) - prevLimit;
              const taxInBracket = taxableInBracket * rate;
              totalTax += taxInBracket;
              if (taxableInBracket > 0) {
                brackets.push({ rate: rate * 100, amount: taxableInBracket, tax: taxInBracket });
              }
              prevLimit = currentLimit;
            }
          }
          totalTax += totalTax * 0.04; // Cess
        }
      }

      return {
        taxableIncome,
        totalTax,
        effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
        brackets,
        deductionApplied: totalDeductions,
      };
    },
  },

  US: {
    name: 'United States',
    code: 'US',
    currency: 'USD',
    symbol: '$',
    hasFilingStatus: true,
    filingStatuses: [
      { label: 'Single', value: 'single' },
      { label: 'Married Filing Jointly', value: 'married' },
    ],
    calculateTax: (income, options) => {
      const status = options.status || 'single';
      const stdDeduction = status === 'married' ? 29200 : 14600;
      const taxableIncome = Math.max(0, income - stdDeduction);

      const slabsSingle = [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ];

      const slabsMarried = [
        { limit: 23200, rate: 0.10 },
        { limit: 94300, rate: 0.12 },
        { limit: 201050, rate: 0.22 },
        { limit: 383900, rate: 0.24 },
        { limit: 487450, rate: 0.32 },
        { limit: 731200, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ];

      const slabs = status === 'married' ? slabsMarried : slabsSingle;
      let totalTax = 0;
      let prevLimit = 0;
      let brackets: { rate: number; amount: number; tax: number }[] = [];

      for (let i = 0; i < slabs.length; i++) {
        if (taxableIncome > prevLimit) {
          const taxableInBracket = Math.min(taxableIncome, slabs[i].limit) - prevLimit;
          const taxInBracket = taxableInBracket * slabs[i].rate;
          totalTax += taxInBracket;
          if (taxableInBracket > 0) {
            brackets.push({ rate: slabs[i].rate * 100, amount: taxableInBracket, tax: taxInBracket });
          }
          prevLimit = slabs[i].limit;
        }
      }

      return {
        taxableIncome,
        totalTax,
        effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
        brackets,
        deductionApplied: stdDeduction,
      };
    },
  },

  UK: {
    name: 'United Kingdom',
    code: 'UK',
    currency: 'GBP',
    symbol: '£',
    calculateTax: (income) => {
      // Personal Allowance decreases by £1 for every £2 above £100,000
      let personalAllowance = 12570;
      if (income > 100000) {
        personalAllowance = Math.max(0, 12570 - (income - 100000) / 2);
      }

      const taxableIncome = Math.max(0, income - personalAllowance);
      let totalTax = 0;
      let brackets: { rate: number; amount: number; tax: number }[] = [];

      const slabs = [
        { limit: 37700, rate: 0.20 }, // Basic rate
        { limit: 125140 - 12570, rate: 0.40 }, // Higher rate
        { limit: Infinity, rate: 0.45 }, // Additional rate
      ];

      let prevLimit = 0;
      for (let i = 0; i < slabs.length; i++) {
        if (taxableIncome > prevLimit) {
          const taxableInBracket = Math.min(taxableIncome, slabs[i].limit) - prevLimit;
          const taxInBracket = taxableInBracket * slabs[i].rate;
          totalTax += taxInBracket;
          if (taxableInBracket > 0) {
            brackets.push({ rate: slabs[i].rate * 100, amount: taxableInBracket, tax: taxInBracket });
          }
          prevLimit = slabs[i].limit;
        }
      }

      return {
        taxableIncome,
        totalTax,
        effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
        brackets,
        deductionApplied: personalAllowance,
      };
    },
  },

  CA: {
    name: 'Canada (Federal)',
    code: 'CA',
    currency: 'CAD',
    symbol: 'CA$',
    calculateTax: (income) => {
      const basicPersonalAmount = 15705;
      const taxableIncome = Math.max(0, income - basicPersonalAmount);

      const slabs = [
        { limit: 55867, rate: 0.15 },
        { limit: 111733, rate: 0.205 },
        { limit: 173205, rate: 0.26 },
        { limit: 246752, rate: 0.29 },
        { limit: Infinity, rate: 0.33 },
      ];

      let totalTax = 0;
      let prevLimit = 0;
      let brackets: { rate: number; amount: number; tax: number }[] = [];

      for (let i = 0; i < slabs.length; i++) {
        if (taxableIncome > prevLimit) {
          const taxableInBracket = Math.min(taxableIncome, slabs[i].limit) - prevLimit;
          const taxInBracket = taxableInBracket * slabs[i].rate;
          totalTax += taxInBracket;
          if (taxableInBracket > 0) {
            brackets.push({ rate: slabs[i].rate * 100, amount: taxableInBracket, tax: taxInBracket });
          }
          prevLimit = slabs[i].limit;
        }
      }

      return {
        taxableIncome,
        totalTax,
        effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
        brackets,
        deductionApplied: basicPersonalAmount,
      };
    },
  },

  AE: {
    name: 'United Arab Emirates (UAE)',
    code: 'AE',
    currency: 'AED',
    symbol: 'AED ',
    calculateTax: (income) => {
      // 0% Personal Income Tax in UAE
      return {
        taxableIncome: income,
        totalTax: 0,
        effectiveRate: 0,
        brackets: [{ rate: 0, amount: income, tax: 0 }],
        deductionApplied: 0,
      };
    },
  },
};

export default function IncomeTaxCalculator() {
  const [country, setCountry] = useState<string>('IN');
  const [incomeInput, setIncomeInput] = useState<string>('1200000');
  const [incomeType, setIncomeType] = useState<'annual' | 'monthly'>('annual');
  const [regime, setRegime] = useState<string>('new');
  const [filingStatus, setFilingStatus] = useState<string>('single');
  const [oldRegimeDeductions, setOldRegimeDeductions] = useState<string>('150000');

  const selectedCountry = TAX_RULES[country] || TAX_RULES['IN'];

  // Normalize income to annual
  const grossAnnualIncome = useMemo(() => {
    const val = parseFloat(incomeInput) || 0;
    return incomeType === 'monthly' ? val * 12 : val;
  }, [incomeInput, incomeType]);

  // Perform calculations
  const taxResults = useMemo(() => {
    const deductionsVal = parseFloat(oldRegimeDeductions) || 0;
    return selectedCountry.calculateTax(grossAnnualIncome, {
      regime,
      status: filingStatus,
      deductions: deductionsVal,
    });
  }, [selectedCountry, grossAnnualIncome, regime, filingStatus, oldRegimeDeductions]);

  const netTakeHomeAnnual = Math.max(0, grossAnnualIncome - taxResults.totalTax);
  const netTakeHomeMonthly = netTakeHomeAnnual / 12;

  const formatCurrency = (val: number) => {
    return `${selectedCountry.symbol}${val.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
        {/* Top Bar - Country Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Country:
            </label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setRegime('new');
                setFilingStatus('single');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.keys(TAX_RULES).map((key) => (
                <option key={key} value={key}>
                  {TAX_RULES[key].name} ({TAX_RULES[key].currency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Income Period:
            </label>
            <div className="flex rounded-lg border border-gray-300 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setIncomeType('annual')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  incomeType === 'annual'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual Salary
              </button>
              <button
                type="button"
                onClick={() => setIncomeType('monthly')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  incomeType === 'monthly'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly Salary
              </button>
            </div>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Gross {incomeType === 'annual' ? 'Annual' : 'Monthly'} Income ({selectedCountry.symbol}):
            </label>
            <input
              type="number"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 1200000"
            />
          </div>

          {/* Dynamic Country Options */}
          {selectedCountry.hasRegimes && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tax Regime:
              </label>
              <select
                value={regime}
                onChange={(e) => setRegime(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {selectedCountry.regimes?.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCountry.hasFilingStatus && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Filing Status:
              </label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {selectedCountry.filingStatuses?.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {country === 'IN' && regime === 'old' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Additional Deductions (80C, 80D, etc.) ({selectedCountry.symbol}):
              </label>
              <input
                type="number"
                value={oldRegimeDeductions}
                onChange={(e) => setOldRegimeDeductions(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 150000"
              />
            </div>
          )}
        </div>

        {/* Results Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="text-xs font-medium text-emerald-700">Net Take-Home (Monthly)</div>
            <div className="text-xl font-bold text-emerald-900 mt-1">
              {formatCurrency(netTakeHomeMonthly)}
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="text-xs font-medium text-blue-700">Net Take-Home (Annual)</div>
            <div className="text-xl font-bold text-blue-900 mt-1">
              {formatCurrency(netTakeHomeAnnual)}
            </div>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <div className="text-xs font-medium text-rose-700">Total Annual Tax</div>
            <div className="text-xl font-bold text-rose-900 mt-1">
              {formatCurrency(taxResults.totalTax)}
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="text-xs font-medium text-purple-700">Effective Tax Rate</div>
            <div className="text-xl font-bold text-purple-900 mt-1">
              {taxResults.effectiveRate.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">Calculation Summary:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Gross Annual Salary:</span>
                <span className="font-semibold">{formatCurrency(grossAnnualIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Standard / Applied Deductions:</span>
                <span className="font-semibold">{formatCurrency(taxResults.deductionApplied)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-gray-700">Taxable Income:</span>
                <span className="font-bold">{formatCurrency(taxResults.taxableIncome)}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Gross Salary:</span>
                <span className="font-semibold">{formatCurrency(grossAnnualIncome / 12)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Tax Deduction:</span>
                <span className="font-semibold text-rose-600">
                  {formatCurrency(taxResults.totalTax / 12)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-gray-700">Monthly Net In-Hand:</span>
                <span className="font-bold text-emerald-600">{formatCurrency(netTakeHomeMonthly)}</span>
              </div>
            </div>
          </div>

          {/* Tax Slabs Breakdown Table */}
          {taxResults.brackets.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold text-gray-700">Tax Slab Breakdown:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 border-b">
                      <th className="p-2 font-semibold">Bracket Rate</th>
                      <th className="p-2 font-semibold">Taxable Amount in Bracket</th>
                      <th className="p-2 font-semibold text-right">Tax Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxResults.brackets.map((b, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{b.rate}%</td>
                        <td className="p-2">{formatCurrency(b.amount)}</td>
                        <td className="p-2 text-right font-medium text-rose-600">
                          {formatCurrency(b.tax)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}