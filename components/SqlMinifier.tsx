'use client';

import React, { useState, useRef } from 'react';

export default function SqlMinifier() {
  const [inputSql, setInputSql] = useState('');
  const [outputSql, setOutputSql] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loadingUrl, setLoadingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSql = (sql: string) => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 
      'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
      'OUTER JOIN', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 
      'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'
    ];

    let formatted = sql.replace(/\s+/g, ' ').trim();

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword.toUpperCase()}`);
    });

    return formatted.trim();
  };

  const handleMinify = () => {
    if (!inputSql.trim()) return;

    try {
      const minified = inputSql
        .replace(/--.*$/gm, '')           // Remove single-line comments (-- comment)
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments (/* comment */)
        .replace(/\s+/g, ' ')             // Collapse multi-spaces & newlines into single space
        .replace(/\s*([=,<>()+*\/])\s*/g, '$1') // Remove spaces around operators
        .trim();

      setOutputSql(minified);
    } catch {
      alert('Error minifying SQL content.');
    }
  };

  const handleBeautify = () => {
    if (!inputSql.trim()) return;

    try {
      const formatted = formatSql(inputSql);
      setOutputSql(formatted);
    } catch {
      alert('Error processing SQL content.');
    }
  };

  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) return;
    setLoadingUrl(true);
    try {
      const res = await fetch(urlInput.trim());
      const text = await res.text();
      setInputSql(text);
      setIsUrlModalOpen(false);
      setUrlInput('');
    } catch {
      alert('Could not fetch SQL content from the provided URL.');
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
    reader.onload = (event) => setInputSql((event.target?.result as string) || '');
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputSql) return;
    navigator.clipboard.writeText(outputSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputSql) return;
    const blob = new Blob([outputSql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto relative">
      <input
        type="file"
        accept=".sql,.txt"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* INPUT BOX */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Input SQL:
            </label>
            <button
              onClick={() => setInputSql('')}
              className="px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={inputSql}
            onChange={(e) => setInputSql(e.target.value)}
            placeholder={'Paste SQL query here...\ne.g. SELECT * \nFROM users \nWHERE status = "active";'}
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
            Minify SQL
          </button>
          <button
            onClick={handleBeautify}
            className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            Beautify SQL
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
              setInputSql('');
              setOutputSql('');
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
              onClick={() => setOutputSql('')}
              className="px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={outputSql}
            readOnly
            placeholder="Minified or beautified SQL output will appear here..."
            className="w-full h-[400px] p-4 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 dark:text-white resize-none"
          />
        </div>
      </div>

      {/* LOAD FROM URL MODAL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Load SQL from URL
            </h3>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/query.sql"
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