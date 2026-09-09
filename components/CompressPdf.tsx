'use client';

import { useState, useRef } from 'react';

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{ originalSize: string; compressedSize: string } | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a valid PDF file.');
        return;
      }
      setFile(selectedFile);
      setDownloadUrl(null);
      setStats(null);
      setError('');
    }
  };

  const handleCompressPdf = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true } as any);
      
      // Save with object streams enabled for better compression
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      const compressedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(compressedBlob);
      
      const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      const compressedSizeMB = (compressedBlob.size / (1024 * 1024)).toFixed(2) + ' MB';

      setStats({ originalSize: originalSizeMB, compressedSize: compressedSizeMB });
      setDownloadUrl(url);
    } catch (err: any) {
      setError('Failed to compress PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setDownloadUrl(null);
    setStats(null);
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

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-2"
          >
            <span>📁</span> Upload PDF to Compress
          </button>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          {file && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 truncate max-w-xs">
                Selected: <strong>{file.name}</strong>
              </span>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50 flex flex-col items-center justify-center space-y-3">
          <div className="text-4xl">📉 ➔ 📦</div>
          <div className="text-sm font-medium text-gray-700">
            {file ? file.name : 'Upload a PDF file to reduce its file size'}
          </div>
          <p className="text-xs text-gray-400">100% secure, processed locally inside your browser.</p>
        </div>

        {stats && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-around text-sm text-emerald-800">
            <div>Original Size: <strong>{stats.originalSize}</strong></div>
            <div>➡️</div>
            <div>Compressed Size: <strong>{stats.compressedSize}</strong></div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end pt-2">
          <button
            onClick={handleCompressPdf}
            disabled={loading || !file}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Compressing PDF...' : 'Compress PDF'}
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${file?.name.replace(/\.pdf$/i, '')}_compressed.pdf`}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow flex items-center gap-2"
            >
              ⬇️ Download Compressed PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}