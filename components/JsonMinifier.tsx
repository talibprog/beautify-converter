'use client';

import React, { useState, useRef } from 'react';

export default function JsonMinifier() {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loadingUrl, setLoadingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMinify = () => {
    if (!inputJson.trim()) return;
    try {
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed));
    } catch {
      alert('Invalid JSON syntax. Please check your input.');
    }
  };

  const handleBeautify = () => {
    if (!inputJson.trim()) return;
    try {
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed, null, 2));
    } catch {
      alert('Invalid JSON syntax. Please check your input.');
    }
  };

  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) return;
    setLoadingUrl(true);
    try {
      const res = await fetch(urlInput.trim());
      const text = await res.text();
      setInputJson(text);
      setIsUrlModalOpen(false);
      setUrlInput('');
    } catch {
      alert('Could not fetch JSON content from the provided URL.');
    } finally {
      setLoadingUrl(false);
    }
  };

  const handleTriggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setInputJson((event.target?.result as string) || '');
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputJson) return;
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputJson) return;
    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto relative">
      <input
        type="file"
        accept=".json,.txt"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* INPUT BOX */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Input JSON:
            </label>
            <button
              onClick={() => setInputJson('')}
              className="px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder={'Paste JSON string here...\ne.g. {\n  "name": "John",\n  "age": 30\n}'}
            className="w-full h-[400px] p-4 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* MIDDLE ACTIONS COLUMN */}
        <div className="lg:col-span-2 flex flex-col justify-center gap-2.5 pt-8">
          <button
            onClick={() => setIsUrlModalOpen(true)}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            Load from Url
          </button>
          <button
            onClick={handleTriggerFileSelect}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            Load from file
          </button>
          <button
            onClick={handleMinify}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            Minify JSON
          </button>
          <button
            onClick={handleBeautify}
            className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            Beautify JSON
          </button>
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button
            onClick={handleDownload}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            Download
          </button>
          <button
            onClick={() => {
              setInputJson('');
              setOutputJson('');
            }}
            className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium text-sm rounded-lg shadow-sm transition"
          >
            Clear All
          </button>
        </div>

        {/* OUTPUT BOX */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Processed Output:
            </label>
            <button
              onClick={() => setOutputJson('')}
              className="px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={outputJson}
            readOnly
            placeholder="Minified or beautified JSON result will appear here..."
            className="w-full h-[400px] p-4 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 dark:text-white resize-none"
          />
        </div>
      </div>

      {/* LOAD FROM URL MODAL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Load JSON from URL
            </h3>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://api.example.com/data.json"
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFetchFromUrl}
                disabled={loadingUrl}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {loadingUrl ? 'Fetching...' : 'Fetch Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}