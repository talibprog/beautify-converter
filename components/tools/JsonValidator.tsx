'use client';

import { useState, useRef } from 'react';

export default function JsonValidator() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidate = () => {
    if (!input.trim()) {
      setStatus({ isValid: false, message: 'Please enter or load JSON code to validate.' });
      return;
    }
    try {
      JSON.parse(input);
      setStatus({ isValid: true, message: 'Valid JSON! No syntax errors found.' });
    } catch (err: any) {
      setStatus({ isValid: false, message: err.message || 'Invalid JSON syntax.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target?.result as string);
        setStatus(null);
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
      setStatus(null);
    } catch (err) {
      alert('Failed to fetch content from the provided URL.');
    }
  };

  return (
    <div className="space-y-4">
      {/* THREE-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT PANEL: INPUT JSON */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Input JSON:</span>
            <button
              onClick={() => {
                setInput('');
                setStatus(null);
              }}
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
            placeholder={`Paste JSON here...\ne.g. { "name": "John", "age": 30 }`}
            className="w-full h-[450px] p-4 font-mono text-sm bg-white text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* CENTER PANEL: CONTROLS */}
        <div className="lg:col-span-2 space-y-3 pt-7 flex flex-col justify-center">
          <input
            type="file"
            accept=".json,.txt"
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
            onClick={handleValidate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-sm rounded-lg transition shadow"
          >
            Validate JSON
          </button>

          <button
            onClick={() => {
              setInput('');
              setStatus(null);
            }}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 text-sm rounded-lg transition border border-red-200"
          >
            Clear All
          </button>
        </div>

        {/* RIGHT PANEL: VALIDATION RESULT */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Validation Result:</span>
          </div>
          <div className="w-full h-[450px] p-4 font-mono text-sm bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-auto">
            {status === null ? (
              <span className="text-gray-400">Validation status will appear here...</span>
            ) : status.isValid ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Valid JSON
                </div>
                <p className="text-xs">{status.message}</p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Invalid JSON Syntax
                </div>
                <p className="text-xs break-all">{status.message}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* POPUP MODAL FOR URL INPUT */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border p-6 w-full max-w-md mx-4 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-800">Load JSON from URL</h3>
            <input
              type="url"
              placeholder="https://example.com/data.json"
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