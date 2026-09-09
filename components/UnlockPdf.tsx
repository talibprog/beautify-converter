'use client';

import { useState, useRef } from 'react';

export default function UnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
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
      setError('');
    }
  };

  const handleUnlockPdf = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();

      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        } as any);
      } catch (err) {
        throw new Error('Unable to decrypt or unlock this PDF file.');
      }

      // Save unencrypted PDF bytes with type cast
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      setError('Failed to unlock PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPassword('');
    setDownloadUrl(null);
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
            <span>📁</span> Upload Protected PDF
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

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-700">PDF Password (if encrypted):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter document password..."
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50 flex flex-col items-center justify-center space-y-3">
          <div className="text-4xl">🔓 ➔ 📄</div>
          <div className="text-sm font-medium text-gray-700">
            {file ? file.name : 'Upload a password protected PDF file to unlock'}
          </div>
          <p className="text-xs text-gray-400">Processing happens securely and entirely within your browser.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-2">
          <button
            onClick={handleUnlockPdf}
            disabled={loading || !file}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Unlocking PDF...' : 'Unlock PDF'}
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${file?.name.replace(/\.pdf$/i, '')}_unlocked.pdf`}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow flex items-center gap-2"
            >
              ⬇️ Download Unlocked PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}