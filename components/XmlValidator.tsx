'use client';

import { useState, useRef } from 'react';

interface ValidationError {
  message: string;
  type: 'error' | 'warning';
}

export default function XmlValidator() {
  const [xmlInput, setXmlInput] = useState<string>('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate XML using browser DOMParser
  const handleValidate = () => {
    if (!xmlInput.trim()) {
      setErrors([
        {
          message: 'Input is empty. Please paste or load XML content to validate.',
          type: 'error',
        },
      ]);
      setIsValidated(true);
      return;
    }

    const newErrors: ValidationError[] = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, 'application/xml');
    const parserError = xmlDoc.getElementsByTagName('parsererror');

    if (parserError.length > 0) {
      const errorText = parserError[0].textContent || 'Invalid XML structure.';
      // Clean up parser error text formatting
      const cleanMessage = errorText
            .replace(/Below is a rendering of the page.[\s\S]*$/, '')
            .trim();

      newErrors.push({
        message: cleanMessage,
        type: 'error',
      });
    }

    setErrors(newErrors);
    setIsValidated(true);
  };

  // Load XML from URL
  const handleLoadFromUrl = async () => {
    const url = prompt('Enter XML File URL:');
    if (!url) return;

    setIsLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch file');
      const text = await res.text();
      setXmlInput(text);
      setIsValidated(false);
    } catch (err) {
      alert('Unable to load XML from URL. Make sure CORS is enabled on the target server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load XML from Local File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setXmlInput(content);
      setIsValidated(false);
    };
    reader.readAsText(file);
  };

  // Clear All Data
  const handleClearAll = () => {
    setXmlInput('');
    setErrors([]);
    setIsValidated(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 text-gray-800">
      {/* HEADER CARD */}
      

      {/* MAIN CONTENT CARD */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: INPUT AREA */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">Input XML:</label>
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition flex items-center gap-1"
              >
                <span>🗑️</span> Clear
              </button>
            </div>

            <textarea
              value={xmlInput}
              onChange={(e) => {
                setXmlInput(e.target.value);
                setIsValidated(false);
              }}
              placeholder={`Paste XML here...\ne.g. <note>\n  <to>Tove</to>\n  <from>Jani</from>\n</note>`}
              rows={18}
              className="w-full p-4 font-mono text-xs bg-slate-50/50 text-gray-700 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed placeholder:text-gray-400"
            />
          </div>

          {/* MIDDLE COLUMN: ACTION BUTTONS */}
          <div className="lg:col-span-2 flex flex-col gap-3 justify-center pt-8">
            <button
              onClick={handleLoadFromUrl}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load from Url'}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150"
            >
              Load from file
            </button>
            <input
              type="file"
              accept=".xml,text/xml"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={handleValidate}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150"
            >
              Validate XML
            </button>

            <button
              onClick={handleClearAll}
              className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 text-xs font-bold rounded-xl transition duration-150"
            >
              Clear All
            </button>
          </div>

          {/* RIGHT COLUMN: VALIDATION RESULT */}
          <div className="lg:col-span-5 space-y-3">
            <label className="text-xs font-bold text-gray-800 block">Validation Result:</label>

            <div className="w-full min-h-[380px] p-4 font-mono text-xs bg-slate-50/50 text-gray-500 rounded-2xl border border-gray-200 overflow-y-auto">
              {!isValidated ? (
                <span className="text-gray-400">Validation status will appear here...</span>
              ) : errors.length === 0 ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-semibold">
                    ✅ Valid XML! The XML document is well-formed.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-semibold">
                    ❌ XML Parsing Error:
                  </div>

                  <div className="space-y-2">
                    {errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-rose-100 text-rose-700">
                            {err.type}
                          </span>
                        </div>
                        <p className="text-gray-700 font-sans pt-1 whitespace-pre-wrap leading-relaxed">
                          {err.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}