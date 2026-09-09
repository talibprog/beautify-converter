'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function DocsToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const isDocx = fileName.endsWith('.docx');
    const isTxt = fileName.endsWith('.txt');

    if (!isDocx && !isTxt) {
      setError('Please select a valid .docx or .txt document file.');
      return;
    }

    setError('');
    setFile(selectedFile);
    setIsProcessing(true);
    setPdfUrl(null);

    try {
      if (isTxt) {
        const text = await selectedFile.text();
        setExtractedText(text);
      } else if (isDocx) {
        const mammoth = (await import('mammoth')).default;
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setExtractedText(result.value);
      }
    } catch (err) {
      setError('Failed to read document file. Please ensure it is not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToPdf = async () => {
    if (!extractedText.trim()) {
      setError('No text content available to generate PDF.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const pageHeight = doc.internal.pageSize.getHeight() - margin * 2;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);

      // Split text into lines matching page width
      const lines = doc.splitTextToSize(extractedText, pageWidth);
      let cursorY = margin;
      const lineHeight = 6;

      for (let i = 0; i < lines.length; i++) {
        if (cursorY + lineHeight > pageHeight + margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(lines[i], margin, cursorY);
        cursorY += lineHeight;
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
    setFile(null);
    setExtractedText('');
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

      {/* FILE UPLOAD DROPZONE */}
      {!file && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer bg-gray-50 hover:bg-blue-50/30 transition-all duration-200"
        >
          <input
            type="file"
            accept=".docx,.txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">
            Click or drag & drop Word (.docx) or Text (.txt) file
          </p>
          <p className="text-xs text-gray-500">100% Client-side privacy guaranteed</p>
        </div>
      )}

      {/* DOCUMENT PREVIEW & CONVERSION CONTROL */}
      {file && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{file.name}</h3>
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
            >
              Clear Document
            </button>
          </div>

          {/* EXTRACTED TEXT PREVIEW BOX */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Document Text Preview
            </label>
            <div className="h-64 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">
              {isProcessing && !extractedText ? (
                <div className="text-blue-600 font-sans font-semibold animate-pulse">
                  Extracting document content...
                </div>
              ) : (
                extractedText || 'No text extracted.'
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            <button
              onClick={handleConvertToPdf}
              disabled={isProcessing || !extractedText}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? 'Compiling PDF...' : 'Convert to PDF'}
            </button>

            {pdfUrl && (
              <a
                href={pdfUrl}
                download={file.name.replace(/\.(docx|txt)$/i, '.pdf')}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow flex items-center gap-2"
              >
                ⬇️ Download PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}