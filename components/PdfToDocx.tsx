'use client';

import { useState, useRef } from 'react';

export default function PdfToDocx() {
  const [file, setFile] = useState<File | null>(null);
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

  const convertPdfToDocx = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

      const docx = await import('docx');
      const { Document, Packer, Paragraph, ImageRun } = docx;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const children: any[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');

          const base64Data = dataUrl.split(',')[1];
          const binaryString = atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let j = 0; j < len; j++) {
            bytes[j] = binaryString.charCodeAt(j);
          }

          const imgWidth = 450;
          const imgHeight = (viewport.height / viewport.width) * imgWidth;

          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: bytes,
                  transformation: {
                    width: imgWidth,
                    height: imgHeight,
                  },
                } as any),
              ],
              spacing: { after: 200 },
            })
          );
        }
      }

      const doc = new Document({
        sections: [{ properties: {}, children }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      setError('Failed to convert PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
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
            <span>📁</span> Upload PDF File
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
          <div className="text-4xl">📄 ➔ 📝</div>
          <div className="text-sm font-medium text-gray-700">
            {file ? file.name : 'Upload a PDF file with images to convert into Word format'}
          </div>
          <p className="text-xs text-gray-400">All processing happens locally inside your browser.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-2">
          <button
            onClick={convertPdfToDocx}
            disabled={loading || !file}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Converting Pages to Word...' : 'Convert to Word (.docx)'}
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${file?.name.replace(/\.pdf$/i, '')}_converted.docx`}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow flex items-center gap-2"
            >
              ⬇️ Download Word File
            </a>
          )}
        </div>
      </div>
    </div>
  );
}