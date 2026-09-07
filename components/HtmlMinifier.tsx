'use client';

import React, { useState, useRef } from 'react';

export default function HtmlMinifier() {
  const [inputHtml, setInputHtml] = useState('');
  const [outputHtml, setOutputHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loadingUrl, setLoadingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMinify = () => {
    if (!inputHtml.trim()) return;
    const minified = inputHtml
      .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
    setOutputHtml(minified);
  };

  const handleBeautify = () => {
    if (!inputHtml.trim()) return;
    let formatted = '';
    let indentLevel = 0;
    const tab = '  ';
    const tokens = inputHtml.replace(/>\s*</g, '><').split(/(?=<)/);

    tokens.forEach((token) => {
      if (!token) return;
      if (token.match(/^<\//)) indentLevel = Math.max(0, indentLevel - 1);
      formatted += tab.repeat(indentLevel) + token + '\n';
      if (
        token.match(/^<[^\/]/) &&
        !token.match(/\/>$/) &&
        !token.match(/^<!/) &&
        !token.match(/^<(img|meta|link|br|hr|input|source|col|area|embed|param|track|wbr)/i)
      ) {
        indentLevel++;
      }
    });

    setOutputHtml(formatted.trim());
  };

  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) return;
    setLoadingUrl(true);
    try {
      const res = await fetch(urlInput.trim());
      const text = await res.text();
      setInputHtml(text);
      setIsUrlModalOpen(false);
      setUrlInput('');
    } catch {
      alert('Could not fetch HTML content from the provided URL.');
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
    reader.onload = (event) => setInputHtml((event.target?.result as string) || '');
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputHtml) return;
    navigator.clipboard.writeText(outputHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputHtml) return;
    const blob = new Blob([outputHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto relative">
      <input
        type="file"
        accept=".html,.htm,.txt"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-800 dark:text-gray-200">Input HTML:</label>
            <button
              onClick={() => setInputHtml('')}
              className="px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={inputHtml}
            onChange={(e) => setInputHtml(e.target.value)}
            placeholder={"Paste HTML code here...\ne.g. <div>\n  <h1>Title</h1>\n</div>"}
            className="w-full h-[400px] p-4 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white resize-none"
          />
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center gap-2.5 pt-8">
          <button onClick={() => setIsUrlModalOpen(true)} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition">
            Load from Url
          </button>
          <button onClick={handleTriggerFileSelect} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition">
            Load from file
          </button>
          <button onClick={handleMinify} className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition">
            Minify HTML
          </button>
          <button onClick={handleBeautify} className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm rounded-lg shadow-sm transition">
            Beautify HTML
          </button>
          <button onClick={handleCopy} className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm rounded-lg shadow-sm transition">
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button onClick={handleDownload} className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition">
            Download
          </button>
          <button onClick={() => { setInputHtml(''); setOutputHtml(''); }} className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium text-sm rounded-lg shadow-sm transition">
            Clear All
          </button>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-800 dark:text-gray-200">Processed Output:</label>
            <button
              onClick={() => setOutputHtml('')}
              className="px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={outputHtml}
            readOnly
            placeholder="Minified or beautified HTML result will appear here..."
            className="w-full h-[400px] p-4 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 dark:text-white resize-none"
          />
        </div>
      </div>

      {/* LOAD FROM URL MODAL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Load HTML from URL
            </h3>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/index.html"
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