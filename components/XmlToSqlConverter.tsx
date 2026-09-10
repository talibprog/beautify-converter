'use client';

import { useState, useRef } from 'react';

export default function XmlToSqlConverter() {
  const [xmlInput, setXmlInput] = useState<string>('');
  const [sqlOutput, setSqlOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core conversion function XML -> SQL INSERT statements
  const handleConvert = (tableNameInput?: string) => {
    if (!xmlInput.trim()) {
      setError('Please enter or paste XML content.');
      return;
    }

    try {
      setError('');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlInput, 'application/xml');

      const parserError = xmlDoc.getElementsByTagName('parsererror');
      if (parserError.length > 0) {
        throw new Error(parserError[0].textContent || 'Invalid XML syntax.');
      }

      const root = xmlDoc.documentElement;
      const children = Array.from(root.children);

      if (children.length === 0) {
        throw new Error('XML root element contains no child records to convert.');
      }

      // Determine Table Name (Root tag or custom name)
      const tableName = tableNameInput || children[0].tagName || 'my_table';
      const sqlRows: string[] = [];

      children.forEach((record) => {
        const rowData: Record<string, string> = {};

        // Extract Attributes
        if (record.attributes.length > 0) {
          for (let i = 0; i < record.attributes.length; i++) {
            const attr = record.attributes[i];
            rowData[attr.name] = attr.value;
          }
        }

        // Extract Child Elements
        Array.from(record.children).forEach((child) => {
          rowData[child.tagName] = child.textContent || '';
        });

        // If no child tags, extract text
        if (Object.keys(rowData).length === 0 && record.textContent) {
          rowData['value'] = record.textContent.trim();
        }

        const columns = Object.keys(rowData);
        if (columns.length > 0) {
          const formattedCols = columns.map((col) => `\`${col}\``).join(', ');
          const formattedVals = columns
            .map((col) => {
              const val = rowData[col].replace(/'/g, "''"); // Escape single quotes
              return `'${val}'`;
            })
            .join(', ');

          sqlRows.push(`INSERT INTO \`${tableName}\` (${formattedCols}) VALUES (${formattedVals});`);
        }
      });

      if (sqlRows.length === 0) {
        throw new Error('Could not extract table rows from XML structure.');
      }

      setSqlOutput(sqlRows.join('\n'));
    } catch (err: any) {
      setError('XML Parsing Error: ' + (err.message || 'Malformed XML data.'));
      setSqlOutput('');
    }
  };

  // Minify SQL Output
  const handleMinify = () => {
    if (!sqlOutput) {
      handleConvert();
      return;
    }
    setSqlOutput(sqlOutput.replace(/\n/g, ' '));
  };

  // Load XML from Remote URL
  const handleLoadFromUrl = async () => {
    const url = prompt('Enter XML File URL:');
    if (!url) return;

    try {
      setError('');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const text = await res.text();
      setXmlInput(text);
    } catch (err: any) {
      setError('Failed to fetch XML from URL: ' + err.message);
    }
  };

  // Load from Local File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setXmlInput(content);
        setError('');
      };
      reader.readAsText(file);
    }
  };

  // Copy Result
  const handleCopy = () => {
    if (!sqlOutput) return;
    navigator.clipboard.writeText(sqlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download SQL File
  const handleDownload = () => {
    if (!sqlOutput) return;
    const blob = new Blob([sqlOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear All
  const handleClearAll = () => {
    setXmlInput('');
    setSqlOutput('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
      {/* Hidden File Input */}
      <input
        type="file"
        accept=".xml, text/xml"
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
        
        {/* Left Column - Input XML */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Input XML:</span>
            <button
              onClick={() => setXmlInput('')}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder={`Paste raw XML here...\ne.g.\n<users>\n  <user id="1">\n    <name>John</name>\n    <role>Admin</role>\n  </user>\n</users>`}
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
            onClick={() => handleConvert()}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm"
          >
            Convert to SQL
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
              onClick={() => setSqlOutput('')}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              🗑 Clear
            </button>
          </div>
          <textarea
            value={sqlOutput}
            readOnly
            placeholder="Generated SQL query result will appear here..."
            className="w-full flex-1 min-h-[420px] p-4 font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-gray-800 resize-y"
            spellCheck={false}
          />
        </div>

      </div>
    </div>
  );
}