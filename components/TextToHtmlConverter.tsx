'use client';

import { useState, useRef } from 'react';

export default function TextToHtmlConverter() {
  const [textInput, setTextInput] = useState<string>('');
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core conversion function: Plain Text -> HTML
  const handleConvert = () => {
    if (!textInput.trim()) {
      setError('Please enter or paste text content.');
      setHtmlOutput('');
      return;
    }

    try {
      setError('');
      // Escape HTML special characters to prevent rendering issues
      const escaped = textInput
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Split by double newlines into paragraphs, single newlines into <br>
      const paragraphs = escaped
        .split(/\n\s*\n/)
        .map((p) => `<p>${p.replace(/\n/g, '<br>\n')}</p>`)
        .join('\n\n');

      setHtmlOutput(paragraphs);
    } catch (err: any) {
      setError('Conversion Error: ' + (err.message || 'Failed to parse text.'));
      setHtmlOutput('');
    }
  };

  // Minify HTML Output
  const handleMinify = () => {
    if (!htmlOutput) {
      handleConvert();
      return;
    }
    setHtmlOutput(htmlOutput.replace(/\s+/g, ' ').trim());
  };

  // Load from Remote URL
  const handleLoadFromUrl = async () => {
    const url = prompt('Enter Text/Document File URL:');
    if (!url) return;

    try {
      setError('');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const text = await res.text();
      setTextInput(text);
    } catch (err: any) {
      setError('Failed to fetch text from URL: ' + err.message);
    }
  };

  // Load from Local File (.txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setTextInput(content);
        setError('');
      };
      reader.readAsText(file);
    }
  };

  // Copy Result
  const handleCopy = () => {
    if (!htmlOutput) return;
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download HTML File
  const handleDownload = () => {
    if (!htmlOutput) return;
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear All
  const handleClearAll = () => {
    setTextInput('');
    setHtmlOutput('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
      {/* Hidden File Input */}
      <input
        type="file"
        accept=".txt, text/plain"
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
        
        {/* Left Column - Input Text */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Input Text:</span>
            <button
              onClick={() => setTextInput('')}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`Paste plain text here...\ne.g. Hello World!\n\nThis is a new paragraph with multiple lines.`}
            className="w-full flex-1 min-h-[420px] p-4 font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-y"
            spellCheck={false}
          />
        </div>

        {/* Center Column - Control Buttons */}
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
            Load from file
          </button>

          <button
            onClick={handleConvert}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm"
          >
            Convert to HTML
          </button>

          <button
            onClick={handleMinify}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-indigo-800 hover:bg-indigo-900 rounded-lg transition shadow-sm"
          >
            Minify / Compact
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition shadow-sm"
          >
            {copied ? '✓ Copied' : 'Copy Result'}
          </button>

          <button
            onClick={handleDownload}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm"
          >
            Download
          </button>

          <button
            onClick={handleClearAll}
            className="w-full py-2.5 px-3 text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition shadow-sm mt-2"
          >
            Clear All
          </button>
        </div>

        {/* Right Column - Formatted Output */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Formatted Output:</span>
            <button
              onClick={() => setHtmlOutput('')}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={htmlOutput}
            readOnly
            placeholder="Formatted HTML result will appear here..."
            className="w-full flex-1 min-h-[420px] p-4 font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-gray-800 resize-y"
            spellCheck={false}
          />
        </div>

      </div>
    </div>
  );
}