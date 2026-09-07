'use client';

import React, { useState, useRef } from 'react';

export default function XmlBeautifier() {
  const [inputXml, setInputXml] = useState('');
  const [outputXml, setOutputXml] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loadingUrl, setLoadingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatXml = (xml: string) => {
    let formatted = '';
    let indent = '';
    const tab = '  ';

    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }

      formatted += indent + '<' + node + '>\n';

      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('?xml')) {
        indent += tab;
      }
    });

    return formatted.substring(1, formatted.length - 2).trim();
  };

  const handleBeautify = () => {
    if (!inputXml.trim()) return;

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(inputXml, 'text/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror');

      if (parserError.length > 0) {
        alert('Invalid XML syntax. Please check your input.');
        return;
      }

      const formatted = formatXml(inputXml);
      setOutputXml(formatted);
    } catch {
      alert('Error processing XML content.');
    }
  };

  const handleMinify = () => {
    if (!inputXml.trim()) return;

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(inputXml, 'text/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror');

      if (parserError.length > 0) {
        alert('Invalid XML syntax. Please check your input.');
        return;
      }

      const minified = inputXml
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();

      setOutputXml(minified);
    } catch {
      alert('Error minifying XML content.');
    }
  };

  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) return;
    setLoadingUrl(true);
    try {
      const res = await fetch(urlInput.trim());
      const text = await res.text();
      setInputXml(text);
      setIsUrlModalOpen(false);
      setUrlInput('');
    } catch {
      alert('Could not fetch XML content from the provided URL.');
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
    reader.onload = (event) => setInputXml((event.target?.result as string) || '');
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputXml) return;
    navigator.clipboard.writeText(outputXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputXml) return;
    const blob = new Blob([outputXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto relative">
      <input
        type="file"
        accept=".xml,.txt"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* INPUT BOX */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Input XML:
            </label>
            <button
              onClick={() => setInputXml('')}
              className="px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={inputXml}
            onChange={(e) => setInputXml(e.target.value)}
            placeholder={'Paste XML code here...\ne.g. <root><user id="1"><name>John</name></user></root>'}
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
            onClick={handleBeautify}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            Beautify XML
          </button>
          <button
            onClick={handleMinify}
            className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            Minify XML
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
              setInputXml('');
              setOutputXml('');
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
              onClick={() => setOutputXml('')}
              className="px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={outputXml}
            readOnly
            placeholder="Beautified or minified XML output will appear here..."
            className="w-full h-[400px] p-4 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 dark:text-white resize-none"
          />
        </div>
      </div>

      {/* LOAD FROM URL MODAL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Load XML from URL
            </h3>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/feed.xml"
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