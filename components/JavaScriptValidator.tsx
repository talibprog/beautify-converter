'use client';

import { useState, useRef } from 'react';

interface ValidationError {
  line?: number;
  message: string;
  type: 'error' | 'warning';
}

export default function JavaScriptValidator() {
  const [jsInput, setJsInput] = useState<string>('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate JS using Function Constructor Parsing
  const handleValidate = () => {
    if (!jsInput.trim()) {
      setErrors([
        {
          message: 'Input is empty. Please paste or load JavaScript content to validate.',
          type: 'error',
        },
      ]);
      setIsValidated(true);
      return;
    }

    const newErrors: ValidationError[] = [];

    try {
      // Syntax check using Function constructor (does not execute code)
      new Function(jsInput);
    } catch (err: any) {
      let lineNum: number | undefined;

      // Extract line number if present in error message
      if (err.stack) {
        const lineMatch = err.stack.match(/<anonymous>:(\d+):(\d+)/);
        if (lineMatch) {
          lineNum = parseInt(lineMatch[1], 10) - 2; // Offset adjustment for Function wrapper
        }
      }

      newErrors.push({
        line: lineNum && lineNum > 0 ? lineNum : undefined,
        message: err.message || 'SyntaxError: Invalid JavaScript syntax.',
        type: 'error',
      });
    }

    setErrors(newErrors);
    setIsValidated(true);
  };

  // Load JS from URL
  const handleLoadFromUrl = async () => {
    const url = prompt('Enter JS File URL:');
    if (!url) return;

    setIsLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch file');
      const text = await res.text();
      setJsInput(text);
      setIsValidated(false);
    } catch (err) {
      alert('Unable to load JS from URL. Make sure CORS is enabled on the target server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load JS from Local File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsInput(content);
      setIsValidated(false);
    };
    reader.readAsText(file);
  };

  // Clear All Data
  const handleClearAll = () => {
    setJsInput('');
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
              <label className="text-xs font-bold text-gray-800">Input JavaScript:</label>
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition flex items-center gap-1"
              >
                <span>🗑️</span> Clear
              </button>
            </div>

            <textarea
              value={jsInput}
              onChange={(e) => {
                setJsInput(e.target.value);
                setIsValidated(false);
              }}
              placeholder={`Paste JS here...\ne.g. function greet(name) {\n  console.log("Hello " + name);\n}`}
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
              accept=".js,text/javascript"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={handleValidate}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150"
            >
              Validate JS
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
                    ✅ Valid JavaScript! No syntax errors found.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-semibold">
                    ❌ Found {errors.length} issue(s) in JavaScript:
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
                          {err.line && (
                            <span className="text-gray-400 font-bold">Line {err.line}</span>
                          )}
                        </div>
                        <p className="text-gray-700 font-sans pt-1">{err.message}</p>
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