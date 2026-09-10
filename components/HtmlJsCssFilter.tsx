'use client';

import { useState, useRef } from 'react';

export default function HtmlJsCssFilter() {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputResult, setOutputResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Checkbox states matching the reference tool
  const [filterHtml, setFilterHtml] = useState<boolean>(true);
  const [filterJs, setFilterJs] = useState<boolean>(true);
  const [filterCss, setFilterCss] = useState<boolean>(true);
  const [trimResult, setTrimResult] = useState<boolean>(true);
  const [customFilterEnabled, setCustomFilterEnabled] = useState<boolean>(false);
  const [customRegexStr, setCustomRegexStr] = useState<string>('');
  
  const [isWrapped, setIsWrapped] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Filtering Logic
  const handleFilter = () => {
    if (!inputCode.trim()) {
      setError('Please enter or paste HTML, JS, or CSS code.');
      setOutputResult('');
      return;
    }

    try {
      setError('');
      let result = inputCode;

      // 1. Filter JS (<script>...</script>)
      if (filterJs) {
        result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }

      // 2. Filter CSS (<style>...</style>)
      if (filterCss) {
        result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      }

      // 3. Filter HTML Tags (<...>)
      if (filterHtml) {
        // Remove HTML tags but preserve text content
        result = result.replace(/<[^>]*>/g, '');
        // Decode common HTML entities
        result = result
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      }

      // 4. Custom Filter Regex
      if (customFilterEnabled && customRegexStr.trim()) {
        try {
          const customRegex = new RegExp(customRegexStr, 'g');
          result = result.replace(customRegex, '');
        } catch (regexErr: any) {
          throw new Error('Invalid Custom Regex: ' + regexErr.message);
        }
      }

      // 5. Trim Result
      if (trimResult) {
        result = result
          .split('\n')
          .map((line) => line.trim())
          .filter((line, index, arr) => line !== '' || (arr[index - 1] !== '')) // collapse multiple empty lines
          .join('\n')
          .trim();
      }

      setOutputResult(result);
    } catch (err: any) {
      setError('Filtering Error: ' + (err.message || 'Failed to process input.'));
      setOutputResult('');
    }
  };

  // Load from Remote URL
  const handleLoadFromUrl = async () => {
    const url = prompt('Enter File URL:');
    if (!url) return;

    try {
      setError('');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const text = await res.text();
      setInputCode(text);
    } catch (err: any) {
      setError('Failed to fetch content from URL: ' + err.message);
    }
  };

  // Load from Local File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputCode(content);
        setError('');
      };
      reader.readAsText(file);
    }
  };

  // Download Result
  const handleDownload = () => {
    if (!outputResult) return;
    const blob = new Blob([outputResult], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered-output.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear All
  const handleClearAll = () => {
    setInputCode('');
    setOutputResult('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
      {/* Hidden File Input */}
      <input
        type="file"
        accept=".html, .js, .css, .txt"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded-md">
          {error}
        </div>
      )}

      {/* Main UI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Column - Input HTML/JS/CSS */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Enter html here:</span>
            <button
              onClick={() => setInputCode('')}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={`Paste HTML, JS, or CSS code here...\n<div id="main">\n  <script>console.log("test");</script>\n  <style>body { color: red; }</style>\n  <p>Hello World!</p>\n</div>`}
            className={`w-full flex-1 min-h-[460px] p-4 font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-y ${
              isWrapped ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
            }`}
            spellCheck={false}
          />
        </div>

        {/* Center Column - Control Actions & Checkboxes */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-2 py-2">
          <button
            onClick={handleLoadFromUrl}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Load from Url
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Load from File
          </button>

          {/* Filter Options Checkboxes */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs text-gray-700">
            <label className="flex items-center space-x-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={filterHtml}
                onChange={(e) => setFilterHtml(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Filter HTML</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={filterJs}
                onChange={(e) => setFilterJs(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Filter JS</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={filterCss}
                onChange={(e) => setFilterCss(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Filter CSS</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={trimResult}
                onChange={(e) => setTrimResult(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Trim result</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={customFilterEnabled}
                onChange={(e) => setCustomFilterEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Custom Filter</span>
            </label>

            {customFilterEnabled && (
              <input
                type="text"
                placeholder="Regex pattern..."
                value={customRegexStr}
                onChange={(e) => setCustomRegexStr(e.target.value)}
                className="w-full mt-1 p-1.5 text-[11px] font-mono bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>

          <button
            onClick={handleFilter}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm"
          >
            Filter
          </button>

          <button
            onClick={() => alert('Editor Options: Standard syntax highlighting mode active.')}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Editor Options
          </button>

          <button
            onClick={() => setIsWrapped(!isWrapped)}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            {isWrapped ? 'Disable Wrap' : 'Wrap Mode'}
          </button>

          <button
            onClick={handleDownload}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm"
          >
            Download
          </button>

          <button
            onClick={handleClearAll}
            className="w-full py-2.5 px-3 text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition shadow-sm mt-1"
          >
            Clear
          </button>
        </div>

        {/* Right Column - Results Output */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Results:</span>
            <button
              onClick={() => setOutputResult('')}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={outputResult}
            readOnly
            placeholder="Filtered text and plain results will appear here..."
            className={`w-full flex-1 min-h-[460px] p-4 font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-gray-800 resize-y ${
              isWrapped ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
            }`}
            spellCheck={false}
          />
        </div>

      </div>
    </div>
  );
}