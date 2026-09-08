'use client';

import { useState, useEffect } from 'react';

export default function RandomPasswordGenerator() {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generatePassword = () => {
    setError('');

    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      setError('Please select at least one character type.');
      setPassword('');
      return;
    }

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let allowedChars = '';
    let generatedPassword = '';

    if (includeUppercase) allowedChars += uppercaseChars;
    if (includeLowercase) allowedChars += lowercaseChars;
    if (includeNumbers) allowedChars += numberChars;
    if (includeSymbols) allowedChars += symbolChars;

    // Cryptographically secure random selection
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      generatedPassword += allowedChars[randomValues[i] % allowedChars.length];
    }

    setPassword(generatedPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Password strength calculation
  const getStrength = () => {
    if (!password) return { label: 'None', color: 'bg-gray-200' };
    let score = 0;
    if (length >= 12) score += 2;
    if (length >= 16) score += 1;
    if (includeUppercase) score += 1;
    if (includeLowercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;

    if (score <= 3) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-600' };
    if (score <= 5) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
        {/* DISPLAY & COPY SECTION */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex justify-between">
            <span>Generated Password</span>
            <span className={`font-bold ${strength.text}`}>{strength.label} Security</span>
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              readOnly
              value={password}
              placeholder="Click generate"
              className="w-full p-3 font-mono text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-gray-800 tracking-wider"
            />
            <button
              onClick={handleCopy}
              disabled={!password}
              className={`px-5 py-3 text-sm font-semibold rounded-xl transition shadow flex items-center gap-2 whitespace-nowrap ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
              }`}
            >
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
          
          {/* STRENGTH BAR */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full ${strength.color} transition-all duration-300`}
              style={{
                width:
                  strength.label === 'Weak'
                    ? '33%'
                    : strength.label === 'Medium'
                    ? '66%'
                    : password
                    ? '100%'
                    : '0%',
              }}
            />
          </div>
        </div>

        {/* SETTINGS CONTROLS */}
        <div className="space-y-5 bg-gray-50 p-5 rounded-xl border border-gray-100">
          {/* LENGTH SLIDER */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium text-gray-700">
              <span>Password Length: <strong className="text-blue-600 font-bold">{length}</strong> characters</span>
              <span className="text-xs text-gray-500">Min 6 - Max 64</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* CHARACTER CHECKBOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 accent-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Include Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 accent-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Include Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 text-blue-600 accent-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Include Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 text-blue-600 accent-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Include Symbols (!@#$)</span>
            </label>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            onClick={generatePassword}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow flex items-center justify-center gap-2"
          >
            <span>🔄</span> Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
}