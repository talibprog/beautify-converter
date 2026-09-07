'use client';

import { useState, useRef } from 'react';

export default function CsvToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState(',');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = () => {
    if (!input.trim()) {
      setError('Please enter or load some CSV data.');
      setOutput('');
      return;
    }

    try {
      const lines = input.trim().split('\n');
      if (lines.length === 0) return;

      let headers: string[] = [];
      let startIndex = 0;

      if (hasHeaders) {
        headers = lines[0].split(separator).map((h) => h.trim().replace(/^"(.*)"$/, '$1'));
        startIndex = 1;
      } else {
        const firstLineCols = lines[0].split(separator);
        headers = firstLineCols.map((_, i) => `column_${i + 1}`);
      }

      const result = [];

      for (let i = startIndex; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const currentline = lines[i].split(separator).map((item) => item.trim().replace(/^"(.*)"$/, '$1'));
        const obj: Record<string, string> = {};

        headers.forEach((header, index) => {
          obj[header] = currentline[index] || '';
        });

        result.push(obj);
      }

      setOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch (err: any) {
      setError('Error parsing CSV format. Check your separator and data structure.');
      setOutput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target?.result as string);
        setError('');
      };
      reader.readAsText(file);
    }
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    try {
      const res = await fetch(urlInput);
      const text = await res.text();
      setInput(text);
      setIsUrlModalOpen(false);
      setUrlInput('');
      setError('');
    } catch (err) {
      alert('Failed to fetch CSV from provided URL.');
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* THREE-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT PANEL: CSV INPUT */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Enter CSV here:</span>
            <button
              onClick={() => setInput('')}
              title="Clear Input"
              className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`id,name,role\n1,Talib,Developer\n2,John,Designer`}
            className="w-full h-[450px] p-4 font-mono text-sm bg-white text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* CENTER PANEL: CONTROLS & OPTIONS */}
        <div className="lg:col-span-2 space-y-3 pt-7 flex flex-col justify-center">
          <input
            type="file"
            accept=".csv,.txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => setIsUrlModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm rounded-lg transition shadow-sm"
          >
            Load from Url
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm rounded-lg transition shadow-sm"
          >
            Load from file
          </button>

          {/* OPTIONS BOX */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-2 text-gray-700">
            <div>
              <label className="block font-semibold mb-1">CSV Separator:</label>
              <input
                type="text"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="w-full p-1 border rounded text-center font-mono text-sm bg-white"
                maxLength={3}
              />
            </div>
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="headers"
                checked={hasHeaders}
                onChange={(e) => setHasHeaders(e.target.checked)}
                className="mt-0.5 cursor-pointer"
              />
              <label htmlFor="headers" className="cursor-pointer leading-tight font-medium">
                First line for column names
              </label>
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-sm rounded-lg transition shadow"
          >
            CSV to JSON
          </button>

          <button
            onClick={handleCopy}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 text-sm rounded-lg transition shadow-sm"
          >
            {copied ? 'Copied!' : 'Copy Result'}
          </button>

          <button
            onClick={handleDownload}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 text-sm rounded-lg transition shadow-sm"
          >
            Download
          </button>

          <button
            onClick={() => {
              setInput('');
              setOutput('');
              setError('');
            }}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 text-sm rounded-lg transition border border-red-200"
          >
            Clear All
          </button>
        </div>

        {/* RIGHT PANEL: JSON RESULTS */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Results:</span>
            <button
              onClick={() => setOutput('')}
              title="Clear Output"
              className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Converted JSON will appear here..."
            className="w-full h-[450px] p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none shadow-sm"
          />
        </div>

      </div>

      {/* MODERN POPUP MODAL FOR URL INPUT */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border p-6 w-full max-w-md mx-4 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-800">Load CSV from URL</h3>
            <input
              type="url"
              placeholder="https://example.com/data.csv"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFetchUrl}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Fetch Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}