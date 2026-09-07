'use client';

import { useState, useRef } from 'react';

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMinify = () => {
    if (!input.trim()) {
      setError('Please enter or load CSS code.');
      setOutput('');
      return;
    }
    try {
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,])\s*/g, '$1')
        .replace(/;\}/g, '}')
        .trim();
      setOutput(minified);
      setError('');
    } catch (err: any) {
      setError('Error minifying CSS code.');
      setOutput('');
    }
  };

  const handleBeautify = () => {
    if (!input.trim()) {
      setError('Please enter or load CSS code.');
      setOutput('');
      return;
    }
    try {
      let formatted = input
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s*\{\s*/g, ' {\n  ')
        .replace(/\s*;\s*/g, ';\n  ')
        .replace(/\s*\}\s*/g, '\n}\n\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      setOutput(formatted);
      setError('');
    } catch (err: any) {
      setError('Error formatting CSS code.');
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
      alert('Failed to fetch CSS from the provided URL.');
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'style.min.css';
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
        
        {/* LEFT PANEL: INPUT CSS */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Input CSS:</span>
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
            placeholder={`Paste CSS code here...\ne.g. body { color: red; margin: 0; }`}
            className="w-full h-[450px] p-4 font-mono text-sm bg-white text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* CENTER PANEL: CONTROLS */}
        <div className="lg:col-span-2 space-y-3 pt-7 flex flex-col justify-center">
          <input
            type="file"
            accept=".css,.txt"
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

          <button
            onClick={handleMinify}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-sm rounded-lg transition shadow"
          >
            Minify CSS
          </button>

          <button
            onClick={handleBeautify}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 text-sm rounded-lg transition shadow-sm"
          >
            Beautify CSS
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

        {/* RIGHT PANEL: OUTPUT CSS */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Processed Output:</span>
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
            placeholder="Minified or beautified CSS result will appear here..."
            className="w-full h-[450px] p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none shadow-sm"
          />
        </div>

      </div>

      {/* MODERN POPUP MODAL FOR URL INPUT */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border p-6 w-full max-w-md mx-4 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-800">Load CSS from URL</h3>
            <input
              type="url"
              placeholder="https://example.com/style.css"
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