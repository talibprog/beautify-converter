'use client';

import { useState, useMemo } from 'react';

const PRESETS = [
  { 
    name: 'Email Address', 
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 
    test: 'Contact us at support@example.com or test.user+tag@domain.co.uk.' 
  },
  { 
    name: 'URL / Link', 
    pattern: 'https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]+', 
    test: 'Visit https://www.beautifyconverter.com or http://sub.domain.org/path?query=1 for info.' 
  },
  { 
    name: 'IP Address (IPv4)', 
    pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', 
    test: 'Servers running on 192.168.1.1 and 10.0.0.255 are online.' 
  },
  { 
    name: 'Phone Number', 
    pattern: '\\b\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}\\b', 
    test: 'Call us at 123-456-7890 or 987.654.3210 today.' 
  },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: false,
    m: false,
    s: false,
  });
  const [testString, setTestString] = useState<string>('Contact support@example.com or admin@test.org for help.');
  const [replaceText, setReplaceText] = useState<string>('[REDACTED]');
  const [activeTab, setActiveTab] = useState<'matches' | 'replace'>('matches');

  const flagString = useMemo(() => {
    let f = '';
    if (flags.g) f += 'g';
    if (flags.i) f += 'i';
    if (flags.m) f += 'm';
    if (flags.s) f += 's';
    return f;
  }, [flags]);

  const matchResults = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flagString);
      const matches: { text: string; index: number; groups: (string | undefined)[] }[] = [];
      
      if (flags.g) {
        let match;
        let counter = 0;
        while ((match = regex.exec(testString)) !== null && counter < 1000) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) regex.lastIndex++;
          counter++;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }
      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [pattern, flagString, testString, flags.g]);

  const replacedOutput = useMemo(() => {
    if (!pattern) return testString;
    try {
      const regex = new RegExp(pattern, flagString);
      return testString.replace(regex, replaceText);
    } catch {
      return testString;
    }
  }, [pattern, flagString, testString, replaceText]);

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setPattern(preset.pattern);
    setTestString(preset.test);
  };

  return (
    <div className="space-y-6">
      {/* Presets Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 mr-2">Presets:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => loadPreset(p)}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main RegEx Editor Box */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          {/* Pattern Input */}
          <div className="lg:col-span-3 space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Regular Expression Pattern:</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500">
              <span className="px-3 text-gray-400 font-mono text-sm">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full py-2 bg-transparent font-mono text-sm text-gray-900 focus:outline-none"
                placeholder="Enter regex pattern..."
              />
              <span className="px-3 text-gray-400 font-mono text-sm">/{flagString}</span>
            </div>
          </div>

          {/* Flags Toggles */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Flags:</label>
            <div className="flex gap-2 py-1.5">
              {(['g', 'i', 'm', 's'] as const).map((flag) => (
                <label
                  key={flag}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer transition select-none ${
                    flags[flag]
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={flags[flag]}
                    onChange={() => setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))}
                    className="hidden"
                  />
                  {flag}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {matchResults.error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-lg font-mono">
            Regex Error: {matchResults.error}
          </div>
        )}

        {/* Test String Input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Test String / Subject:</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={4}
            className="w-full p-3 font-mono text-xs bg-gray-50 text-gray-900 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type or paste test string here..."
          />
        </div>

        {/* Tabs for Matches / Substitution */}
        <div className="flex border-b border-gray-200 pt-2">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'matches'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Matches Found ({matchResults.matches.length})
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'replace'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Substitution / Replace
          </button>
        </div>

        {/* Tab Content: Matches */}
        {activeTab === 'matches' && (
          <div className="space-y-3 pt-2">
            {matchResults.matches.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                No matches found for the given regular expression pattern.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-auto">
                {matchResults.matches.map((m, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono space-y-1">
                    <div className="flex justify-between text-gray-500 text-[10px]">
                      <span>Match #{idx + 1}</span>
                      <span>Index: {m.index}</span>
                    </div>
                    <div className="text-indigo-600 font-bold break-all">"{m.text}"</div>
                    {m.groups.length > 0 && m.groups.some(Boolean) && (
                      <div className="text-gray-600 pt-1 text-[11px]">
                        <span className="font-semibold text-gray-700">Capture Groups:</span>{' '}
                        {JSON.stringify(m.groups)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Replace */}
        {activeTab === 'replace' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Replace With:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Replacement string..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Resulting String:</label>
              <pre className="w-full p-3 font-mono text-xs bg-gray-900 text-green-400 rounded-xl border border-gray-800 whitespace-pre-wrap">
                {replacedOutput}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}