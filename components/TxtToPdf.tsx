'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function TxtToPdf() {
  const [text, setText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('document.txt');
  const [fontSize, setFontSize] = useState<number>(11);
  const [lineSpacing, setLineSpacing] = useState<number>(6);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.txt') && selectedFile.type !== 'text/plain') {
      setError('Please select a valid plain text (.txt) file.');
      return;
    }

    setError('');
    setFileName(selectedFile.name);
    setIsProcessing(true);
    setPdfUrl(null);

    try {
      const content = await selectedFile.text();
      setText(content);
    } catch (err) {
      setError('Failed to read the text file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToPdf = async () => {
    if (!text.trim()) {
      setError('Please enter or upload some text to generate a PDF.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { jsPDF } = (await import('jspdf')) as any;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const pageHeight = doc.internal.pageSize.getHeight() - margin * 2;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(fontSize);

      // Break input text into wrapped lines fitting page width
      const lines = doc.splitTextToSize(text, pageWidth);
      let cursorY = margin;

      for (let i = 0; i < lines.length; i++) {
        if (cursorY + lineSpacing > pageHeight + margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(lines[i], margin, cursorY);
        cursorY += lineSpacing;
      }

      const pdfBlob = doc.output('blob');
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      setError('Failed to generate PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setFileName('document.txt');
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* TOOL CONTAINER */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
        
        {/* HEADER CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-2"
            >
              <span>📁</span> Upload .TXT File
            </button>
            <input
              type="file"
              accept=".txt,text/plain"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            {text && (
              <span className="text-xs text-gray-500 truncate max-w-xs">
                Loaded: <strong>{fileName}</strong>
              </span>
            )}
          </div>

          {text && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
            >
              Clear Text
            </button>
          )}
        </div>

        {/* FORMATTING OPTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Font Size: <span className="text-blue-600">{fontSize}pt</span>
            </label>
            <input
              type="range"
              min="8"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Line Spacing: <span className="text-blue-600">{lineSpacing}mm</span>
            </label>
            <input
              type="range"
              min="4"
              max="12"
              value={lineSpacing}
              onChange={(e) => setLineSpacing(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* TEXT EDITOR AREA */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex justify-between">
            <span>Plain Text Input</span>
            <span className="text-gray-400 font-normal">{text.length} characters</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setPdfUrl(null);
            }}
            placeholder="Type or paste your text here, or click 'Upload .TXT File' above..."
            rows={12}
            className="w-full p-4 text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 leading-relaxed"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 justify-end pt-2">
          <button
            onClick={handleConvertToPdf}
            disabled={isProcessing || !text.trim()}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? 'Generating PDF...' : 'Convert to PDF'}
          </button>

          {pdfUrl && (
            <a
              href={pdfUrl}
              download={fileName.replace(/\.txt$/i, '.pdf')}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow flex items-center gap-2"
            >
              ⬇️ Download PDF
            </a>
          )}
        </div>

      </div>
    </div>
  );
}