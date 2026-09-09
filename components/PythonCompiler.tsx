'use client';

import { useState, useEffect, useRef } from 'react';

const DEFAULT_PYTHON_CODE = `# Python 3 Online Interpreter
x = "hello"
print(x)

# Example: Standard Loop & Calculation
for i in range(1, 6):
    print(f"Number: {i}, Square: {i**2}")
`;

export default function PythonCompiler() {
  const [code, setCode] = useState<string>(DEFAULT_PYTHON_CODE);
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pyodideReady, setPyodideReady] = useState<boolean>(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically load Pyodide WebAssembly script into browser
    const loadPyodideScript = async () => {
      if ((window as any).loadPyodide && pyodideRef.current) return;

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.async = true;
      script.onload = async () => {
        try {
          const pyodide = await (window as any).loadPyodide();
          pyodideRef.current = pyodide;
          setPyodideReady(true);
        } catch (e) {
          console.error('Failed to load Pyodide engine:', e);
        }
      };
      document.body.appendChild(script);
    };

    loadPyodideScript();
  }, []);

  const runPythonCode = async () => {
    setLoading(true);
    setOutput('Executing Python script in browser...');

    try {
      if (!pyodideRef.current) {
        // Fallback or retry loading Pyodide
        if ((window as any).loadPyodide) {
          pyodideRef.current = await (window as any).loadPyodide();
          setPyodideReady(true);
        } else {
          throw new Error('Python WebAssembly engine is still initializing. Please wait a few seconds and try again.');
        }
      }

      const pyodide = pyodideRef.current;

      // Capture print statements (sys.stdout)
      pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // Run actual code
      await pyodide.runPythonAsync(code);

      // Extract generated stdout & stderr
      const stdout = pyodide.runPython(`sys.stdout.getvalue()`);
      const stderr = pyodide.runPython(`sys.stderr.getvalue()`);

      let result = '';
      if (stdout) result += stdout;
      if (stderr) result += (result ? '\nErrors:\n' : '') + stderr;

      setOutput(result || 'Code executed successfully with no output.');
    } catch (err: any) {
      setOutput('Python Error:\n' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <span>🐍 Python 3 Interpreter</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                pyodideReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {pyodideReady ? 'Engine Ready' : 'Loading Engine...'}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
            >
              Clear
            </button>
            <button
              onClick={runPythonCode}
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Running...' : '▶ Run Python'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">Python Script Editor:</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={12}
            className="w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your Python code here..."
            spellCheck={false}
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="block text-xs font-semibold text-gray-700">Console Output:</label>
          <pre className="w-full p-4 min-h-[120px] max-h-[300px] overflow-auto font-mono text-xs bg-black text-green-400 rounded-xl border border-gray-800 whitespace-pre-wrap">
            {output || '// Output will appear here after execution...'}
          </pre>
        </div>
      </div>
    </div>
  );
}